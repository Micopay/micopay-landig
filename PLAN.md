# Plan de implementación — micopay.com.mx

Mismo patrón que `motelabs` (Astro + Cloudflare Worker + D1 + Mailgun + Turnstile),
adaptado a un solo objetivo por ahora: **captar interés** (usuario / proveedor /
inversión-prensa) antes de que el producto esté operando.

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Hosting | Cloudflare Workers con static assets, dominio propio `micopay.com.mx` (ya en Cloudflare) |
| Sitio | Astro con islas React, contenido portado de `MicoPay Landing.dc.html` |
| Leads | Un solo formulario con selector de interés (`usuario` / `proveedor` / `inversion`), no tres formularios separados |
| Envío de correo | Mailgun — **cuenta nueva y separada** de la de motelabs (el free tier de Mailgun permite un solo dominio verificado por cuenta) |
| Base de datos | Cloudflare D1 |
| Anti-spam | Cloudflare Turnstile + honeypot |
| Panel privado | `/admin` con contraseña (mismo esquema que motelabs: cookie firmada HMAC, freno de fuerza bruta), no Cloudflare Access |

## Qué quedó fuera de este primer corte (a propósito)

- **Buzón entrante / hilo de conversación**: en motelabs se agregó cuando hubo
  volumen. Aquí no hay leads todavía, así que se pospone — el aviso por correo
  ya trae `Reply-To` al prospecto, y se puede responder desde el correo normal
  mientras tanto.
- **UTMs por landing dedicada**: el formulario ya lee `utm_source/medium/campaign`
  de la URL, pero no hay campañas activas todavía.
- **Datos reales de proveedores**: la sección "Proveedores" muestra tarjetas de
  ejemplo para comunicar el producto — no hay red de proveedores operando aún.

## Pendientes por hacer antes de desplegar

1. `wrangler d1 create micopay-leads` → pegar el `database_id` real en `wrangler.jsonc`.
2. Aplicar migraciones: `wrangler d1 migrations apply micopay-leads --remote`.
3. Crear cuenta Mailgun nueva para `micopay.com.mx`, verificar dominio (MX, SPF,
   DKIM, DMARC).
4. Crear widget de Turnstile para `micopay.com.mx` → reemplazar
   `TURNSTILE_SITE_KEY` en `src/components/Contact.jsx` (la site key es pública,
   va directo en el código) y guardar el secreto:
   `wrangler secret put TURNSTILE_SECRET`.
5. Secretos: `wrangler secret put MAILGUN_API_KEY`, `wrangler secret put ADMIN_PASSWORD`.
6. Conectar el dominio en Cloudflare (los `routes` en `wrangler.jsonc` ya están
   declarados; el certificado se aprovisiona solo porque la zona ya vive ahí).
7. GitHub Actions: deploy en push a `main` (copiar el workflow de motelabs).

## Terminado cuando

El sitio carga en `micopay.com.mx`, el formulario guarda el lead en D1 y manda
los dos correos (aviso + acuse), y `/admin` (con contraseña) muestra la lista
de prospectos con su interés.
