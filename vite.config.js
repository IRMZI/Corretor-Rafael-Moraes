import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/* Projeto de duas partes no mesmo deploy:
   - a landing page continua HTML/CSS/JS puro, em index.html (sem React);
   - o painel administrativo e uma SPA React servida em /admin.
   Cada HTML da raiz vira uma entrada do build. */
/* Em producao a Vercel reescreve /admin/* para /admin/index.html (vercel.json).
   Este plugin faz o mesmo no dev e no preview, para recarregar uma rota
   profunda do painel localmente nao cair em 404. */
function rotasDoPainel() {
  const reescrever = (req, _res, proximo) => {
    if (req.url && /^\/admin(\/|$)/.test(req.url) && !/\.[a-z0-9]+(\?|$)/i.test(req.url)) {
      req.url = '/admin/index.html';
    }
    proximo();
  };

  /* Corpo em bloco de proposito: devolver o retorno de .use() faria o Vite
     tratar o app do connect como post-hook e quebrar o servidor. */
  return {
    name: 'rotas-do-painel',
    configureServer(servidor) {
      servidor.middlewares.use(reescrever);
    },
    configurePreviewServer(servidor) {
      servidor.middlewares.use(reescrever);
    }
  };
}

export default defineConfig({
  plugins: [react(), rotasDoPainel()],
  build: {
    rollupOptions: {
      input: {
        landing: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
        politica: resolve(import.meta.dirname, 'politica-de-privacidade.html'),
        naoEncontrado: resolve(import.meta.dirname, '404.html')
      }
    }
  },
  server: {
    port: 5173
  }
});
