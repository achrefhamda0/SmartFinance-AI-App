/**
 * Copie les dépendances navigateur dans public/vendor.
 *
 * Les paquets npm sont résolus depuis node_modules puis copiés tels quels :
 * aucune étape de bundling, les fichiers restent lisibles et debuggables.
 * Les assets absents (paquet sans build navigateur) sont ignorés.
 */

import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(root, 'public/vendor');

const ASSETS = [
  { from: 'node_modules/gsap/dist/gsap.min.js', to: 'gsap.min.js' },
  { from: 'node_modules/gsap/dist/ScrollTrigger.min.js', to: 'ScrollTrigger.min.js' },
  { from: 'node_modules/motion/dist/motion.js', to: 'motion.js' }
];

const exists = async (path) =>
  access(path).then(
    () => true,
    () => false
  );

const importMap = {
  imports: Object.fromEntries(ASSETS.map((asset) => [asset.to, `/vendor/${asset.to}`]))
};

await mkdir(target, { recursive: true });

for (const asset of ASSETS) {
  const source = resolve(root, asset.from);

  if (!(await exists(source))) {
    console.warn(`[vendor] ignoré (absent) : ${asset.from}`);
    continue;
  }

  await cp(source, resolve(target, asset.to));
  console.log(`[vendor] ${asset.from} → public/vendor/${asset.to}`);
}

await writeFile(
  resolve(target, 'importmap.json'),
  `${JSON.stringify(importMap, null, 2)}\n`,
  'utf8'
);

const version = await readFile(resolve(root, 'package.json'), 'utf8').then((raw) =>
  JSON.parse(raw).version
);

console.log(`[vendor] public/vendor prêt (projet v${version})`);