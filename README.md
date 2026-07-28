# micopay-web

Sitio de MicoPay (`micopay.com.mx`): landing + captación de leads.
Astro + islas React, desplegado como Cloudflare Worker con static assets.

Ver [`PLAN.md`](./PLAN.md) para decisiones de arquitectura y pendientes antes
de desplegar a producción.

## Desarrollo

```sh
npm install
npm run dev       # localhost:4321
```

El backend (`/api/contacto`, `/admin`) solo corre bajo Wrangler, no bajo
`astro dev`:

```sh
npm run build
npx wrangler dev
```

## Comandos

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo de Astro (solo frontend) |
| `npm run build` | Build de producción a `./dist/` |
| `npx wrangler dev` | Sirve `dist/` + el Worker (`/api/contacto`, `/admin`) localmente |
| `npx wrangler deploy` | Despliega a Cloudflare |
| `npx wrangler d1 migrations apply micopay-leads --remote` | Aplica las migraciones de `migrations/` a D1 |
