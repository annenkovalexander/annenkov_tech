// scripts/generate-frontend-store-and-state.mts

import fs from 'fs';
import path from 'path';
import { Project, SyntaxKind, ObjectLiteralExpression } from 'ts-morph';

const SRC_ROOT = path.resolve(process.cwd(), 'src');
const SERVICES_ROOT = path.join(SRC_ROOT, 'services');
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  'data/shared/.ai/docs/frontend-store-and-state.md',
);

function createProject() {
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  const project = new Project(
    fs.existsSync(tsconfigPath)
      ? { tsConfigFilePath: tsconfigPath }
      : {
          skipFileDependencyResolution: true,
          compilerOptions: { allowJs: false },
        },
  );

  project.addSourceFilesAtPaths(path.join(SERVICES_ROOT, '**/*.ts'));
  return project;
}

type SliceInfo = {
  file: string;
  name: string;
  stateFields: string[];
};

type ThunkInfo = {
  file: string;
  name: string;
};

type SelectorInfo = {
  file: string;
  name: string;
};

function analyzeServices(project: Project) {
  const slices: SliceInfo[] = [];
  const thunks: ThunkInfo[] = [];
  const selectors: SelectorInfo[] = [];

  const sourceFiles = project
    .getSourceFiles()
    .filter(sf => sf.getFilePath().includes(path.normalize('/services/')));

  for (const sf of sourceFiles) {
    const rel = path.relative(SRC_ROOT, sf.getFilePath());

    // --- SLICES: createSlice({...}) ---
    const callExpressions = sf.getDescendantsOfKind(
      SyntaxKind.CallExpression,
    );

    for (const callExpr of callExpressions) {
      const expr = callExpr.getExpression();
      if (!expr || expr.getText() !== 'createSlice') continue;

      const args = callExpr.getArguments();
      if (args.length === 0) continue;

      const configArg = args[0];
      const configObj = configArg.asKind(SyntaxKind.ObjectLiteralExpression);
      if (!configObj) continue;

      // name
      let sliceName = '(без имени)';
      const nameProp = configObj.getProperty('name');
      if (nameProp?.isKind(SyntaxKind.PropertyAssignment)) {
        const init = nameProp.getInitializer();
        if (init?.isKind(SyntaxKind.StringLiteral)) {
          // name: 'catalog'
          sliceName = init.getText().replace(/^['"`]|['"`]$/g, '');
        } else if (init?.isKind(SyntaxKind.Identifier)) {
          // name: AUTH_USER_SLICE
          sliceName = init.getText();
        }
      }

      // initialState
      const stateFields: string[] = [];

      for (const prop of configObj.getProperties()) {
        let propName: string | undefined;
        let identName: string | undefined;

        if (prop.isKind(SyntaxKind.PropertyAssignment)) {
          const nameNode = prop.getNameNode();
          propName = nameNode.getText().replace(/^['"`]|['"`]$/g, '');
          if (propName !== 'initialState') continue;

          const init = prop.getInitializer();
          if (!init) continue;

          if (init.isKind(SyntaxKind.ObjectLiteralExpression)) {
            // initialState: { ... }
            const obj = init as ObjectLiteralExpression;
            stateFields.push(...extractKeysFromObjectLiteral(obj));
            continue;
          } else if (init.isKind(SyntaxKind.Identifier)) {
            // initialState: someVar
            identName = init.getText();
          } else {
            continue;
          }
        } else if (prop.isKind(SyntaxKind.ShorthandPropertyAssignment)) {
          propName = prop.getName();
          if (propName !== 'initialState') continue;
          // initialState,
          identName = prop.getName();
        } else {
          continue;
        }

        if (!identName) continue;

        const varDecls = sf
          .getVariableDeclarations()
          .filter(vd => vd.getName() === identName);

        for (const vd of varDecls) {
          const initializer = vd.getInitializer();
          if (
            initializer &&
            initializer.isKind(SyntaxKind.ObjectLiteralExpression)
          ) {
            const obj = initializer as ObjectLiteralExpression;
            stateFields.push(...extractKeysFromObjectLiteral(obj));
          }
        }
      }

      slices.push({
        file: rel,
        name: sliceName,
        stateFields: Array.from(new Set(stateFields)),
      });
    }

    const sourceText = sf.getFullText();

    // --- THUNKS ---
    const thunkRegex =
      /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*createAsyncThunk\s*\(/g;
    let thunkMatch;
    while ((thunkMatch = thunkRegex.exec(sourceText)) !== null) {
      thunks.push({
        file: rel,
        name: thunkMatch[1],
      });
    }

    // --- SELECTORS ---
    const selectorRegex =
      /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*\(/g;
    let selectorMatch;
    while ((selectorMatch = selectorRegex.exec(sourceText)) !== null) {
      selectors.push({
        file: rel,
        name: selectorMatch[1],
      });
    }
  }

  return { slices, thunks, selectors };
}

function extractKeysFromObjectLiteral(obj: ObjectLiteralExpression) {
  const fields: string[] = [];

  for (const prop of obj.getProperties()) {
    if (prop.isKind(SyntaxKind.PropertyAssignment)) {
      const nameNode = prop.getNameNode();
      const nameText = nameNode.getText().replace(/^['"`]|['"`]$/g, '');
      fields.push(nameText);
    } else if (prop.isKind(SyntaxKind.ShorthandPropertyAssignment)) {
      fields.push(prop.getName());
    }
  }

  return fields;
}

function generateMarkdown(
  slices: SliceInfo[],
  thunks: ThunkInfo[],
  selectors: SelectorInfo[],
) {
  const lines: string[] = [];

  lines.push('# Frontend Store and State');
  lines.push('');
  lines.push(
    'Этот файл сгенерирован автоматически из `src/services`. Он описывает Redux-слайсы, асинхронные операции и селекторы, используемые во фронтенде.',
  );
  lines.push('');

  // Slices
  lines.push('## Slices');
  lines.push('');
  if (!slices.length) {
    lines.push('_Слайсы не найдены._');
    lines.push('');
  } else {
    for (const s of slices) {
      lines.push(`### Slice \`${s.name}\``);
      lines.push('');
      lines.push(`Файл: \`${s.file}\``);
      lines.push('');

      if (!s.stateFields.length) {
        lines.push('_Поля initialState не обнаружены._');
        lines.push('');
      } else {
        lines.push('| State field |');
        lines.push('| :---------- |');
        for (const f of s.stateFields) {
          lines.push(`| \`${f}\` |`);
        }
        lines.push('');
      }
    }
  }

  // Thunks
  lines.push('## Thunks');
  lines.push('');
  if (!thunks.length) {
    lines.push('_Thunks не найдены._');
    lines.push('');
  } else {
    lines.push('| Thunk | File |');
    lines.push('| :---- | :--- |');
    for (const t of thunks) {
      lines.push(`| \`${t.name}\` | \`${t.file}\` |`);
    }
    lines.push('');
  }

  // Selectors
  lines.push('## Selectors');
  lines.push('');
  if (!selectors.length) {
    lines.push('_Селекторы не найдены._');
    lines.push('');
  } else {
    lines.push('| Selector | File |');
    lines.push('| :------- | :--- |');
    for (const sel of selectors) {
      lines.push(`| \`${sel.name}\` | \`${sel.file}\` |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const project = createProject();
  const { slices, thunks, selectors } = analyzeServices(project);
  const markdown = generateMarkdown(slices, thunks, selectors);

  const outDir = path.dirname(OUTPUT_FILE);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');
}

main();