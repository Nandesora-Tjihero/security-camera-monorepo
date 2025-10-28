import fs from 'fs';
import path from 'path';

const workspaces = [
  {
    name: 'web',
    path: 'apps/web',
    theme: 'Tokyo Night Light',
    iconTheme: 'vscode-icons',
    extensions: [
      'Vue.volar',
      'dbaeumer.vscode-eslint',
      'esbenp.prettier-vscode',
    ],
  },
  {
    name: 'functions',
    path: 'apps/backend',
    theme: 'Monokai Pro (Filter Spectrum)',
    iconTheme: 'material-icon-theme',
    extensions: ['dbaeumer.vscode-eslint', 'Firebase.firebase-tools'],
  },
  {
    name: 'mobile',
    path: 'apps/mobile',
    theme: 'Solarized Dark',
    iconTheme: 'vscode-icons',
    extensions: [
      'tsvetan-ganev.nativescript-xml-snippets',
      'nativescript.nativescript',
      'msaelices.nativescript-vue-snippets',
      'esbenp.prettier-vscode',
      'dbaeumer.vscode-eslint',
    ],
  },
];

const root = path.resolve(process.cwd());

for (const ws of workspaces) {
  const content = {
    folders: [{ path: ws.path }],
    settings: {
      'workbench.colorTheme': ws.theme,
      'workbench.iconTheme': ws.iconTheme,
      'window.title': `${ws.name.toUpperCase()} Workspace`,
      'workbench.colorCustomizations': {
        'titleBar.activeBackground':
          ws.name === 'web'
            ? '#1E90FF'
            : ws.name === 'functions'
            ? '#8B008B'
            : '#228B22',
        'titleBar.activeForeground': '#FFFFFF',
      },
    },
    extensions: {
      recommendations: ws.extensions,
    },
  };

  const filePath = path.join(root, `${ws.name}.code-workspace`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`✅ Created ${ws.name}.code-workspace`);
}
