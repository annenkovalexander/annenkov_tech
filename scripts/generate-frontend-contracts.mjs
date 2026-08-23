// scripts/generate-frontend-contracts.mjs

import fs from 'fs';
import path from 'path';

const SRC_ROOT = path.resolve(process.cwd(), 'src');
const ENTITIES_ROOT = path.join(SRC_ROOT, 'entities');
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  'data/shared/.ai/docs/frontend-contracts.md',
);

/**
 * Рекурсивно обходим директорию entities и собираем файлы model/types.ts
 */
function collectTypeFiles() {
  const result = [];

  if (!fs.existsSync(ENTITIES_ROOT)) {
    return result;
  }

  const entries = fs.readdirSync(ENTITIES_ROOT, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const entityDir = path.join(ENTITIES_ROOT, entry.name);
    const modelDir = path.join(entityDir, 'model');
    const typesFile = path.join(modelDir, 'types.ts');

    if (fs.existsSync(typesFile)) {
      result.push({
        entity: entry.name,
        filePath: typesFile,
      });
    }
  }

  return result;
}

/**
 * Парсим export type / export interface / export const enum
 */
function parseTypesFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf-8');

  const types = [];

  // export type TypeName = { ... }
  const typeRegex =
    /export\s+type\s+([A-Za-z0-9_]+)\s*=\s*{([\s\S]*?)};/g;

  let match;
  while ((match = typeRegex.exec(source)) !== null) {
    const typeName = match[1];
    const body = match[2];

    const fields = extractFields(body);
    types.push({
      kind: 'type',
      name: typeName,
      fields,
    });
  }

  // export interface InterfaceName { ... }
  const interfaceRegex =
    /export\s+interface\s+([A-Za-z0-9_]+)\s*{([\s\S]*?)};/g;

  while ((match = interfaceRegex.exec(source)) !== null) {
    const interfaceName = match[1];
    const body = match[2];

    const fields = extractFields(body);
    types.push({
      kind: 'interface',
      name: interfaceName,
      fields,
    });
  }

  // export const enum EnumName { ... }
  const enumRegex =
  /export\s+(?:const\s+)?enum\s+([A-Za-z0-9_]+)\s*{([\s\S]*?)}/g;

    while ((match = enumRegex.exec(source)) !== null) {
    const enumName = match[1];
    const body = match[2];

    const members = extractEnumMembers(body);
    types.push({
        kind: 'enum',
        name: enumName,
        fields: members,
    });
    }

  return types;
}

/**
 * Парсим список полей из блока { ... } для type/interface.
 */
function extractFields(body) {
  const lines = body.split('\n');
  const fields = [];

  for (let raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('//')) continue;

    const fieldMatch = line.match(
      /^([A-Za-z0-9_]+)\??\s*:\s*([^;]+);?/,
    );
    if (!fieldMatch) continue;

    const name = fieldMatch[1];
    const type = fieldMatch[2].trim();

    fields.push({ name, type });
  }

  return fields;
}

/**
 * Парсим элементы enum:
 *   Idle = 'Idle',
 *   Loading = 'Loading',
 */
function extractEnumMembers(body) {
  const lines = body.split('\n');
  const members = [];

  for (let raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('//')) continue;

    const memberMatch = line.match(
      /^([A-Za-z0-9_]+)\s*=\s*([^,]+),?/,
    );
    if (!memberMatch) continue;

    const name = memberMatch[1];
    const value = memberMatch[2].trim();

    members.push({ name, type: value });
  }

  return members;
}

/**
 * Генерация markdown строго на основе найденных типов и их полей.
 */
function generateMarkdown(entityTypes) {
  const lines = [];

  lines.push('# Frontend Contracts');
  lines.push('');
  lines.push(
    'Этот файл сгенерирован автоматически из `src/entities/*/model/types.ts`. Он перечисляет основные типы данных, которые используются фронтендом.',
  );
  lines.push('');

  if (entityTypes.length === 0) {
    lines.push('_Типы не найдены в каталоге `entities`._');
    return lines.join('\n');
  }

  for (const entry of entityTypes) {
    lines.push(`## ${entry.entity}`);
    lines.push('');
    lines.push(
      `Файл: \`src/entities/${entry.entity}/model/types.ts\``,
    );
    lines.push('');

    if (entry.types.length === 0) {
      lines.push('_Экспортируемые типы и интерфейсы не найдены._');
      lines.push('');
      continue;
    }

    for (const t of entry.types) {
      let label = 'Тип';
      if (t.kind === 'interface') label = 'Интерфейс';
      if (t.kind === 'enum') label = 'Enum';

      lines.push(`### ${label} \`${t.name}\``);
      lines.push('');

      if (!t.fields.length) {
        lines.push('_Поля не обнаружены._');
        lines.push('');
        continue;
      }

      lines.push('| Field | Type |');
      lines.push('| :---- | :--- |');

      for (const f of t.fields) {
        lines.push(`| \`${f.name}\` | \`${f.type}\` |`);
      }

      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Основной запуск
 */
function main() {
  const typeFiles = collectTypeFiles();

  const entityTypes = typeFiles.map((entry) => {
    const types = parseTypesFile(entry.filePath);
    return {
      entity: entry.entity,
      types,
    };
  });

  const markdown = generateMarkdown(entityTypes);

  const outDir = path.dirname(OUTPUT_FILE);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');
}

main();