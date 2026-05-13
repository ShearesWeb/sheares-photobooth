# Sheares Photo Booth

A scrapbook-style virtual photo booth for Sheares Hall — webcam capture, scene
overlays per filter, drag-on stickers, AI captions, and a shared wall of
polaroids backed by Supabase.

## Run locally

```bash
cp .env.example .env       # fill in your Supabase values
./build-config.sh          # writes config.js
python3 -m http.server 8000
open http://localhost:8000
```

Camera access requires `http://localhost` (any port) or `https://`. Opening
`index.html` over `file://` won't work — Chrome blocks both `getUserMedia` and
the Babel-standalone fetch for the JSX files.

## Configuration

Two files hold environment:

- `.env` — bash-style key=value, read by `build-config.sh`. Gitignored.
- `config.js` — emitted JS that `index.html` loads. Gitignored.

Either copy `config.example.js` to `config.js` and hand-edit, or use
`build-config.sh` to generate it from `.env`. Both files are gitignored.

In CI, `.github/workflows/deploy.yml` runs `build-config.sh` against repository
secrets (see below) before publishing.

### Supabase setup

Run this once in your Supabase SQL editor:

```sql
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  caption text,
  filter_id text,
  format text,
  image_url text not null,
  thumb_url text,
  image_path text,
  thumb_path text,
  created_at timestamptz default now()
);
alter table gallery enable row level security;
create policy "anyone read"   on gallery for select using (true);
create policy "anyone insert" on gallery for insert with check (true);
create policy "anyone delete" on gallery for delete using (true);

create policy "obj read"   on storage.objects for select using (bucket_id = 'immersh-photobooth');
create policy "obj insert" on storage.objects for insert with check (bucket_id = 'immersh-photobooth');
create policy "obj delete" on storage.objects for delete using (bucket_id = 'immersh-photobooth');
```

Then in the dashboard:

1. **Storage → New bucket** → name `immersh-photobooth`, mark **Public**.
2. **Project Settings → API** → copy `Project URL` and the `publishable` anon
   key (the `sb_publishable_*` one — safe for browsers).

## Deploy to GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds `config.js` from
repository secrets and publishes the site on every push to `main`.

Set these repo secrets (Settings → Secrets and variables → Actions):

| name                 | value                                |
| -------------------- | ------------------------------------ |
| `SUPABASE_URL`       | `https://YOUR-PROJECT.supabase.co`   |
| `SUPABASE_ANON_KEY`  | `sb_publishable_…`                   |
| `SUPABASE_BUCKET`    | `immersh-photobooth`                 |

Then in Settings → Pages, set **Source = GitHub Actions**. Push to `main`
and the action publishes the site.

## File map

- `index.html` — entry; loads React 18 UMD + Babel standalone + Supabase JS, then mounts the four `.jsx` scripts.
- `tokens.css`, `styles.css` — design tokens + scrapbook layout.
- `tweaks-panel.jsx` — floating Tweaks shell and form helpers (slider/toggle/etc).
- `scenes.jsx` — per-filter SVG overlays that bake into the captured photo.
- `components.jsx` — `FILTERS`, `PROPS`, and the small UI primitives (FilterRail, FormatToggle, PropsPalette, CaptionCard, GalleryWall, GalleryModal, ThemesCard).
- `app.jsx` — main App: camera control, capture flow, sticker model, Supabase storage helpers (`fetchGallery` / `insertEntry` / `deleteEntry`), final composite.
- `assets/` — brand imagery (favicon + first sticker).
