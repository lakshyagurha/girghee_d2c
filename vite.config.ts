/// <reference types="vitest" />
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev only: serves netlify/functions/*.mts at /.netlify/functions/<name>, like Netlify does,
 * so checkout works on `npm run dev`. Server secrets are read from .env into process.env here
 * and are never exposed to the browser bundle (only VITE_* vars are).
 */
function netlifyFunctionsDev(): Plugin {
  return {
    name: 'netlify-functions-dev',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), 'RAZORPAY_'));
      server.middlewares.use('/.netlify/functions', async (req, res) => {
        const name = (req.url ?? '').split('?')[0].replace(/^\//, '');
        const file = resolve('netlify/functions', `${name}.mts`);
        if (!/^[\w-]+$/.test(name) || !existsSync(file)) {
          res.statusCode = 404;
          res.end('Function not found');
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const request = new Request(`http://localhost${req.originalUrl ?? req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: ['GET', 'HEAD'].includes(req.method ?? 'GET') ? undefined : Buffer.concat(chunks),
          });
          const mod = await server.ssrLoadModule(file);
          const response: Response = await mod.default(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.config.logger.error(`[functions] ${name}: ${(err as Error).stack ?? err}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Function crashed. See the dev server log.' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyFunctionsDev()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
