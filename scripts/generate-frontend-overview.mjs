// generate-frontend-overview.mjs

import fs from 'fs';
import path from 'path';

const SRC_ROOT = path.resolve(process.cwd(), 'src');
console.log("SRC_ROOT: ", SRC_ROOT);
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  'data/shared/.ai/docs/frontend-overview.md',
);

const LAYERS = [
  { name: 'components', dir: 'components' },
  { name: 'pages', dir: 'pages' },
  { name: 'services', dir: 'services' },
  { name: 'entities', dir: 'entities' },
  { name: 'api', dir: 'api' },
];

/**
 * Рекурсивный обход директории
 */
function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, cb);
    } else if (entry.isFile()) {
      cb(fullPath);
    }
  }
}

/**
 * Собираем файлы по слоям (pages, widgets, features и т.д.)
 */
function collectLayerFiles() {
  const result = {};

  for (const layer of LAYERS) {
    const layerRoot = path.join(SRC_ROOT, layer.dir);
    const files = [];
    walkDir(layerRoot, (filePath) => {
      // Берём только типичные исходники
      if (
        filePath.endsWith('.tsx') ||
        filePath.endsWith('.ts') ||
        filePath.endsWith('.jsx') ||
        filePath.endsWith('.js')
      ) {
        files.push(filePath);
      }
    });
    result[layer.name] = files;
  }

  return result;
}

/**
 * Генерация markdown строго на основе имён файлов и их путей.
 * Никаких интерпретаций — только список существующих сущностей фронта.
 */
function generateMarkdown(layerFiles) {
  const lines = [];

  lines.push('# Frontend Overview');
  lines.push('');
  lines.push(
    'Этот файл сгенерирован автоматически из структуры каталога `src` фронтенд-проекта. Он перечисляет основные слои и файлы, которые могут использоваться в пользовательском интерфейсе.',
  );
  lines.push('');

  for (const layer of LAYERS) {
    const name = layer.name;
    const files = layerFiles[name] || [];
    lines.push(`## ${name}`);
    lines.push('');

    if (files.length === 0) {
      lines.push('_Файлы не найдены._');
      lines.push('');
      continue;
    }

    lines.push('| File | Relative path |');
    lines.push('| :--- | :------------ |');

    for (const filePath of files) {
      const rel = path.relative(SRC_ROOT, filePath);
      const base = path.basename(filePath);
      lines.push(`| \`${base}\` | \`${rel}\` |`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Основной запуск
 */
function main() {
  const layerFiles = collectLayerFiles();
  const markdown = generateMarkdown(layerFiles);

  const outDir = path.dirname(OUTPUT_FILE);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');
}

main();