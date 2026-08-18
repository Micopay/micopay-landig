# Estado del proyecto — micopay.com.mx

Reporte al **17 de agosto de 2026**. Sustituye al del 27 de julio, que quedó viejo:
casi toda la auditoría SEO de aquel documento ya está resuelta en el código y desplegada.

Cada punto de abajo se verificó contra el repo, contra `https://micopay.com.mx` en vivo y
contra `wrangler secret list`. Lo que no se pudo comprobar sin escribir en producción se dice
explícitamente.

Los cambios de la sección SEO se desplegaron el 17 ago (versión
`13ea9968-02db-4fba-9ea1-f4fd7cc0dd35`) y están verificados en el sitio en vivo.

---

## 1. Qué tenemos

### Infraestructura — en producción

| Pieza | Estado |
|---|---|
| `https://micopay.com.mx` | ✅ En vivo, SSL activo |
| `https://www.micopay.com.mx` | ✅ Redirige 301 al apex (una sola URL canónica) |
| Stack | Astro 7 + islas React, servido por Cloudflare Worker con static assets |
| Base de datos | ✅ D1 `micopay-leads` (`a744fac0-cf90-4505-aff4-920afa93e580`), migraciones aplicadas en remoto |
| Tablas | `leads`, `events`, `intentos_admin` |
| Repositorio | `github.com/Micopay/micopay-landig` — `main` con este proyecto |
| Respaldo | Rama `legacy-vite-react` con la landing anterior (Vite/React, bilingüe, dark mode) intacta |

### Landing

Hero con conversor USDC→MXN · franja de próximas funciones (CETES tokenizados, DeFi) ·
Cómo funciona · Vitrina de proveedores con filtros · Seguridad / escrow ·
Para proveedores con calculadora de ganancia · Formulario de lista de espera · FAQ · CTA · Footer.

### Captación de leads

- **Un solo formulario** con selector de interés: `usuario` / `proveedor` / `inversion`.
  Es la pieza que responde "¿dónde hay demanda real?" sin tener que adivinar.
- Guarda nombre, correo, ciudad, interés, mensaje y UTMs en D1.
- **Verificado end-to-end contra producción**: `POST /api/contacto` → `{"ok":true}` → fila en D1.
  (El lead de prueba se borró después.)
- Panel `/admin` ✅ **accesible**: responde 200. Sin `ADMIN_PASSWORD` el código devuelve 404,
  así que el secreto ya está configurado.

### Páginas legales — ya existen

`/privacy`, `/terms` y `/privacy-app` responden 200. Las tres llevan `noindex, follow`
mediante el layout `Legal.astro`, y el sitemap las excluye por filtro en `astro.config.mjs`
para no pedirle a Google que indexe lo que le decimos que no indexe.

### Decisiones de narrativa ya corregidas

- **Sin referencias a INE ni identificación.** Era engañoso si va a haber KYC; además deja
  el terreno limpio para comunicarlo cuando se defina.
- **"Sin cuenta bancaria" como diferenciador principal.**
- **Tarifas como rango variable, no número fijo.** La tarifa la pone cada proveedor;
  presentarla como un "1.9%" de MicoPay comunicaba lo contrario del modelo.
- **Se eliminó el "8 min promedio de entrega"** del hero: era un dato inventado, no hay
  operaciones todavía.

### Corrección técnica de fondo

El CSS de las islas React estaba **filtrándose a toda la página**. Un `<style>` dentro de
un `.astro` se aísla solo; dentro de una isla React **no**. Resultado: `.punto` (un puntito
del mapa del hero) convertía los bullets de "Para proveedores" en círculos de 30 px
posicionados en absoluto, encimados unos sobre otros. Mismo choque en `.tarjeta`, `.icono`
y `.campo*`. Se resolvió prefijando las clases por componente (`cv-`, `pv-`, `fq-`, `ct-`, `cl-`).
Hay un comentario en cada isla para que no se reintroduzca.

---

## 2. Qué falta

### Bloqueantes

| # | Qué | Estado hoy | Esfuerzo |
|---|---|---|---|
| 1 | Secreto `ADMIN_PASSWORD` | ✅ **Resuelto.** `/admin` responde 200 | — |
| 2 | Turnstile | ✅ **Resuelto.** Site key real (`0x4AAAAAAECVQ_UG_9RUXc9q`, modo managed) y `TURNSTILE_SECRET` presente en el Worker | — |
| 3 | Mailgun | ✅ **Configurado.** `MAILGUN_API_KEY` presente, con `MAILGUN_DOMAIN` y `NOTIFY_TO` en `wrangler.jsonc` | — |

> Los tres se confirmaron con `wrangler secret list`, que devuelve los **nombres** de los
> secretos y nunca su contenido. Matiz importante: eso prueba que la clave **existe**, no que
> sea válida — una clave de Mailgun vencida aparecería igual en la lista. Confirmar el envío
> real sigue dependiendo de mandar el formulario, y eso escribe un lead de prueba en la D1.

> Ojo con `turnstileOk()` en `worker.ts:74`: si el secreto falta, **devuelve `true`** y deja
> pasar todo. Hoy el secreto está puesto, así que el filtro sí actúa. Vale conservar la nota
> porque el fallo es silencioso: si alguien borra el secreto, el formulario se queda sin
> filtro y por fuera se ve idéntico.

> **Secreto huérfano: `ANTHROPIC_API_KEY`.** Está cargado en el Worker y **no lo usa nada**.
> No aparece en `interface Env`, no hay ninguna llamada de red en `admin.ts`, y los cinco
> contadores del panel salen de un `COUNT(*)` en SQL, no de un modelo. Se buscó en todo el
> historial de git y nunca existió código que lo consumiera, así que no es el resto de una
> función retirada. Lo más probable es que se copiara el juego de secretos desde MoteLabs al
> montar este Worker. Conviene quitarlo con `wrangler secret delete ANTHROPIC_API_KEY`, y
> revocarlo también desde la consola de Anthropic si resulta ser exclusivo de MicoPay y no
> una clave compartida con MoteLabs.

### Legales

| # | Qué | Estado |
|---|---|---|
| 4 | `/privacy` y `/terms` | ✅ **Resuelto.** Ambos 200, más `/privacy-app` |
| 5 | Aviso de privacidad (LFPDPPP) | ✅ **Resuelto.** `privacy.astro` cubre derechos ARCO y contacto |

### Contenido ficticio todavía visible

| # | Qué | Estado |
|---|---|---|
| 6 | Tipo de cambio `18.70` | ❌ **Abierto.** `Conversor.jsx:11`, aislado en `TIPO_CAMBIO` y comentado como referencial |
| 7 | Marca real "OXXO" en los proveedores de ejemplo | ✅ **Resuelto (17 ago).** Ahora es "Abarrotes La Esquina". Queda un comentario en `Proveedores.jsx` explicando por qué los nombres tienen que ser inventados |

---

## 3. Auditoría SEO

Reverificada el 17 ago 2026 contra el repo y contra producción con `curl`.
Importaba comprobar producción y no solo el código, porque el despliegue es manual (§4).

### Lo que ya está bien

| Punto | Detalle |
|---|---|
| Idioma declarado | `<html lang="es-MX">` |
| Title | `MicoPay — Tu dinero, cerca de ti` — único y descriptivo |
| Meta description | Presente, 143 caracteres, dentro del rango útil |
| Canonical | `https://micopay.com.mx` |
| Jerarquía de encabezados | Un solo H1, luego H2 → H3 **sin saltos** |
| Contenido indexable sin JS | El HTML servido trae todo el texto, incluido el FAQ completo |
| `robots.txt` | Correcto, con `Disallow: /admin` y referencia al sitemap |
| Sitemap | `sitemap-index.xml` → 200, generado automáticamente, sin las páginas legales |
| Una sola URL canónica | `www` hace 301 al apex; no se parte la autoridad |
| HTTPS y móvil | SSL activo, `viewport` correcto |

### Hallazgos del 27 jul — ya resueltos

| # | Hallazgo original | Cómo quedó |
|---|---|---|
| S1 | Sin Open Graph ni Twitter Card | ✅ OG completo (`type`, `url`, `title`, `description`, `site_name`, `locale`, `image`) más `twitter:card` en `summary_large_image`. `og.jpg` 1200×630 responde 200 |
| S2 | Sin favicon | ✅ `favicon.svg` y `apple-touch-icon.png`, ambos declarados en el head |
| S3 | Sin datos estructurados | ✅ Tres bloques `application/ld+json`: `Organization`, `WebSite` y `FAQPage` |
| S4 | Enlaces rotos a `/terms` y `/privacy` | ✅ Ambos 200 (ver §2.4) |
| S5 | Sin página 404 propia | ✅ `src/pages/404.astro`, con `noindex` |
| S6 | Material Symbols sin `display` | ✅ Ya carga con `&display=block`; se acabó el destello de ligaduras en texto |
| S7 | Canonical con barra vs sitemap sin barra | ✅ `trailingSlash: 'never'` y `build.format: 'file'` unifican ambos |

### Hallazgos abiertos

**S8 · Las fuentes de Google bloquean el render.** 🟡 Mitigado a medias (17 ago)
La hoja de Material Symbols ya no bloquea: carga con `media="print"` y un `onload` que la
promueve a `all`, con `<noscript>` de respaldo. Sigue con `display=block`, así que mientras
baja no se asoma el texto de la ligadura.
**Falta** la de Archivo, que sí bloquea a propósito: es la tipografía del texto y cargarla
tarde repinta la página entera. Cerrarlo del todo pide alojarla localmente — hay que meter
los `.woff2` al repo y escribir el `@font-face`, decisión que no se tomó todavía.

**S9 · Sin analítica.**
Cero rastro de Cloudflare Web Analytics, `gtag` o equivalente, ni en el repo ni en el HTML
servido. Es gratis y sin cookies, y hoy no hay forma de saber si la landing convierte.

**S10 · Una sola URL indexable.**
Páginas dedicadas (`/proveedores`, `/como-funciona`) permitirían competir por más búsquedas.

**S11 · Sin `hreflang`.**
Relevante solo si se retoma el bilingüe ES/EN que tenía la landing anterior.

**S12 · `/favicon.ico` devolvía 404.** ✅ Resuelto (17 ago)
`public/favicon.ico` generado desde `apple-touch-icon.png` (16/32/48 px, 4.5 KB) y declarado
en el head antes del SVG, que los navegadores modernos siguen prefiriendo.

**S13 · El FAQ estaba duplicado a mano.** ✅ Resuelto (17 ago)
Las 7 preguntas vivían dos veces, en `Faq.jsx` y en el `FAQPage` de `index.astro`. Ahora hay
una sola fuente, `src/data/faqs.js`, que consumen los dos. Editar una respuesta ahí actualiza
el acordeón y el marcado a la vez.
Comprobado sobre el HTML ya compilado: las 7 preguntas y las 7 respuestas del JSON-LD son
idénticas al texto visible.

### Orden sugerido

1. **S9** — sin medición, ninguna otra mejora se puede evaluar. Es lo único que queda
   con retorno claro y esfuerzo bajo.
2. **Resto de S8** — alojar Archivo localmente, si se quiere apretar el LCP.
3. **S10** — páginas dedicadas. Es trabajo de contenido, no técnico.

---

## 4. Pendientes de infraestructura, en orden

1. Quitar el secreto huérfano `ANTHROPIC_API_KEY` (ver §2).
2. Comprobar que Mailgun entrega de verdad: los secretos están, pero un envío real es lo
   único que confirma la clave y el DNS (MX, SPF, DKIM, DMARC).
3. Deploy automático en push (GitHub Actions). Hoy el despliegue es manual, y eso ayudó a que
   este documento y el sitio real se despegaran durante tres semanas.
4. Sustituir el tipo de cambio fijo por un feed real y quitar la marca "OXXO" del ejemplo.
