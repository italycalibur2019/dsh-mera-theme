// Build dsh-mera-theme/client.js from src/client.template.js.
// Embeds wallpapers/mera-light-day.webp and wallpapers/mera-dark-rain.webp as
// base64 data URLs (the plugin cannot serve static assets to the Web client).
//
// Usage: node scripts/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const template = readFileSync(join(root, 'src', 'client.template.js'), 'utf8');

const dataUrl = (name) => {
  const bytes = readFileSync(join(root, 'wallpapers', name));
  return `data:image/webp;base64,${bytes.toString('base64')}`;
};

const light = dataUrl('mera-light-day.webp');
const dark = dataUrl('mera-dark-rain.webp');

if (!template.includes('__MERA_WALLPAPER_LIGHT__') || !template.includes('__MERA_WALLPAPER_DARK__')) {
  throw new Error('template is missing wallpaper placeholders');
}

const output = template
  .replace("'__MERA_WALLPAPER_LIGHT__'", JSON.stringify(light))
  .replace("'__MERA_WALLPAPER_DARK__'", JSON.stringify(dark));

writeFileSync(join(root, 'client.js'), output);
console.log(`client.js written: ${(output.length / 1024).toFixed(1)} KiB`);
