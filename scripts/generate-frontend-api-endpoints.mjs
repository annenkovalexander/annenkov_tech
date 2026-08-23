// scripts/generate-frontend-api-endpoints.mjs

import fs from 'fs';
import path from 'path';
import { Logger } from 'sass';

const SRC_ROOT = path.resolve(process.cwd(), 'src');
const API_FILE = path.join(SRC_ROOT, 'api', '');
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  'data/shared/.ai/docs/frontend-api-endpoints.md',
);

/**
 * Чтение файла API и извлечение пар (method, path, name)
 * из вызовов fetch(...) внутри экспортируемых функций.
 * Скрипт не делает выводов, он только отражает то, что реально есть в коде.
 */
function parseApiFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`API file not found: ${filePath}`);
  }

  const source = fs.readFileSync(filePath, 'utf-8');

  const endpoints = [];

  // 1) export const fn = async (...) => { ... fetch('/api/...', { method: ... }) ... };
  const exportFnWithBodyRegex =
    /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*(async\s*)?\([^)]*\)\s*=>\s*\{([\s\S]*?)};/g;

  let exportMatch;
  while ((exportMatch = exportFnWithBodyRegex.exec(source)) !== null) {
    const fnName = exportMatch[1];
    const body = exportMatch[3];

    const fetchRegex =
      /fetch\(\s*([`'"])([^'"`]+)\1\s*(?:,\s*\{([\s\S]*?)\}\s*)?\)/g;

    let fetchMatch;
    while ((fetchMatch = fetchRegex.exec(body)) !== null) {
      const rawPath = fetchMatch[2];
      const optionsBlock = fetchMatch[3] || '';

      let method = 'GET';
      const methodMatch = optionsBlock.match(
        /method:\s*['"`]([^'"`]+)['"`]/i,
      );
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
      }

      endpoints.push({
        method,
        path: rawPath,
        name: fnName,
        source: 'fetch',
      });
    }
  }

  // 2) Специальный кейс для updateProfileApi,
  //    оформленного как стрелка с return fetch(...).then(...)
  const updateProfileRegex =
    /export\s+const\s+updateProfileApi\s*=\s*\([^)]*\)\s*[^=]*=>[\s\S]*?fetch\(\s*([`'"])([^'"`]+)\1\s*(?:,\s*\{([\s\S]*?)\}\s*)?\)/;

  const updateMatch = updateProfileRegex.exec(source);
  if (updateMatch) {
    const rawPath = updateMatch[2];
    const optionsBlock = updateMatch[3] || '';

    let method = 'GET';
    const methodMatch = optionsBlock.match(
      /method:\s*['"`]([^'"`]+)['"`]/i,
    );
    if (methodMatch) {
      method = methodMatch[1].toUpperCase();
    }

    const already = endpoints.some(
      (e) => e.name === 'updateProfileApi',
    );
    if (!already) {
      endpoints.push({
        method,
        path: rawPath,
        name: 'updateProfileApi',
        source: 'fetch',
      });
    }
  }

  return endpoints;
}

/**
 * Генерация markdown строго на основе найденных фрагментов кода.
 */
function generateMarkdown(endpoints) {
  const lines = [];

  lines.push('# Frontend API Endpoints');
  lines.push('');
  lines.push(
    `Этот файл сгенерирован автоматически из ${API_FILE}. Он перечисляет HTTP-эндпоинты и определения, которые используются фронтендом для работы с backend API.`,
  );
  lines.push('');

  if (endpoints.length === 0) {
    lines.push('_Эндпоинты не найдены в исходном файле._');
    return lines.join('\n');
  }

  lines.push('| Function | Method | Path | Source |');
  lines.push('| :------- | :----- | :--- | :----- |');

  for (const ep of endpoints) {
    const fn = ep.name ? `\`${ep.name}\`` : '';
    const method = ep.method ? `\`${ep.method}\`` : '';
    const pathStr = ep.path ? `\`${ep.path}\`` : '';
    const sourceStr = ep.source ? `\`${ep.source}\`` : '';

    lines.push(
      `| ${fn} | ${method} | ${pathStr} | ${sourceStr} |`,
    );
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Основной запуск
 */
function main() {
  let endpoints;
  try {
    endpoints = parseApiFile(API_FILE);
  }
  catch(e) {
    endpoints = '';
    console.log(`Возникла ошибка: ${e}`);
  }
  finally {
    const markdown = generateMarkdown(endpoints);
    const outDir = path.dirname(OUTPUT_FILE);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');
  }
}

main();