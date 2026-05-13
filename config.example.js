// Copy to config.js and fill values. config.js is gitignored.
// In CI, GitHub Actions workflow writes config.js from repo secrets.
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_YOUR_KEY',
  SUPABASE_BUCKET: 'immersh-photobooth',
};
