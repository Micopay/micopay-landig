# Estado del proyecto — micopay.com.mx

Reporte al **27 de julio de 2026**. Cubre qué quedó funcionando, qué falta, y una
auditoría de SEO hecha sobre el sitio ya desplegado (no sobre el código local).

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
- Panel `/admin` escrito, con contadores por tipo de interés. Hoy inaccesible (ver §2).

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

| # | Qué | Consecuencia hoy | Esfuerzo |
|---|---|---|---|
| 1 | Secreto `ADMIN_PASSWORD` | `/admin` responde 404 a todos. **No se puede ver ningún lead que entre.** | 1 comando |
| 2 | Turnstile (site key real + `TURNSTILE_SECRET`) | Sin anti-spam. La site key actual es la de prueba y el Worker **no bloquea** si falta el secreto. Solo queda el honeypot. | ~10 min |
| 3 | Mailgun (cuenta nueva + DNS) | Cero correos: ni aviso interno ni acuse al prospecto. Los leads **sí se guardan**, pero nadie se entera en el momento. | cuenta + verificación DNS |

> Sobre Mailgun: el plan gratuito permite **un solo dominio verificado por cuenta**, y esa
> cuota ya la ocupa `motelabs.com.mx`. Para `micopay.com.mx` hace falta una cuenta nueva
> (gratis) o subir la de motelabs al plan Foundation ($35/mes, hasta 1 000 dominios).
> El plan Basic ($15/mes) **no** sirve: sigue limitado a un dominio.

### Legales — el formulario ya está vivo captando datos personales

| # | Qué | Estado |
|---|---|---|
| 4 | `/privacy` y `/terms` | **404.** El footer enlaza a páginas que no existen |
| 5 | Aviso de privacidad (LFPDPPP) | No existe. Es obligatorio en México al captar nombre y correo |

### Contenido ficticio todavía visible

| # | Qué | Nota |
|---|---|---|
| 6 | Tipo de cambio `18.70` | Hardcodeado, no es precio en vivo. Aislado en `TIPO_CAMBIO` (`Conversor.jsx`) |
| 7 | Proveedores de ejemplo | Está etiquetado como ilustrativo, pero **uno usa la marca real "OXXO"** con métricas inventadas. Conviene cambiarlo por un nombre genérico |

---

## 3. Auditoría SEO

Hecha el 27 jul 2026 contra `https://micopay.com.mx` en producción.

### Lo que ya está bien

| Punto | Detalle |
|---|---|
| Idioma declarado | `<html lang="es-MX">` |
| Title | `MicoPay — Tu dinero, cerca de ti` — único y descriptivo |
| Meta description | Presente, 143 caracteres, dentro del rango útil |
| Canonical | `https://micopay.com.mx/` |
| Jerarquía de encabezados | Un solo H1, luego H2 → H3 **sin saltos** en las 8 secciones |
| Contenido indexable sin JS | El HTML servido trae todo el texto, incluido el FAQ completo (11.5 KB) |
| `robots.txt` | Correcto, con `Disallow: /admin` y referencia al sitemap |
| Sitemap | `sitemap-index.xml` → `sitemap-0.xml`, generado automáticamente |
| Una sola URL canónica | `www` hace 301 al apex; no se parte la autoridad |
| HTTPS y móvil | SSL activo, `viewport` correcto |

### Hallazgos — prioridad alta

**S1 · Sin Open Graph ni Twitter Card.**
No hay una sola etiqueta `og:*` ni `twitter:*`. Al compartir el enlace en WhatsApp, X,
LinkedIn o Slack sale sin imagen, sin título formateado y sin descripción. Para una landing
cuyo único objetivo es que la compartan y captar registros, esto es lo más caro de la lista.
Requiere además crear una imagen social (1200×630).

**S2 · Sin favicon.**
`/favicon.ico` → **404**, y cero etiquetas `rel="icon"` en el head. La pestaña sale en blanco
y los marcadores no tienen ícono. El logo ya existe como SVG en línea; solo hay que
exportarlo a `public/`.

**S3 · Sin datos estructurados (JSON-LD).**
No hay `Organization`, `WebSite` ni `FAQPage`. El FAQ **ya está en el HTML servido** con seis
preguntas y respuestas completas — es decir, califica para *rich results* de Google sin
escribir contenido nuevo, solo el marcado. Es la mejora con mejor relación esfuerzo/retorno.

**S4 · Enlaces internos rotos.**
El footer enlaza a `/terms` y `/privacy`; ambos devuelven **404**. Google los reporta como
errores de rastreo y desperdicia presupuesto de rastreo. Se cruza con el punto legal §2.4.

### Hallazgos — prioridad media

**S5 · Sin página 404 propia.**
`wrangler.jsonc` declara `not_found_handling: "404-page"`, que espera un `404.html` en
`dist/`, y no existe. Cualquier ruta inválida cae en una página en blanco del sistema.

**S6 · Los nombres de los íconos aparecen como texto al cargar.**
La hoja de Material Symbols se pide **sin el parámetro `display`**:

```
fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0
```

Sin `&display=block`, el navegador muestra el texto de la ligadura (`search`, `near_me`,
`storefront`) hasta que la fuente termina de bajar. Se ve roto en la primera carga y golpea
el CLS. La hoja de Manrope/Jakarta sí lleva `&display=swap`; a esta se le olvidó.

**S7 · Inconsistencia canonical vs sitemap.**
El canonical apunta a `https://micopay.com.mx/` (con barra) y el sitemap lista
`https://micopay.com.mx` (sin barra). Es menor porque resuelven igual, pero conviene
unificarlo para no mandar señales cruzadas.

**S8 · Las fuentes de Google bloquean el render.**
Dos hojas de estilo externas en el `<head>` antes de pintar. Ya hay `preconnect`, que ayuda,
pero para mejorar el LCP lo correcto es alojar las fuentes localmente o cargarlas de forma
asíncrona.

### Hallazgos — prioridad baja

| # | Punto |
|---|---|
| S9 | Sin analítica. Cloudflare Web Analytics es gratis y sin cookies |
| S10 | Una sola URL indexable. Páginas dedicadas (`/proveedores`, `/como-funciona`) permitirían competir por más búsquedas |
| S11 | Sin `hreflang`. Relevante solo si se retoma el bilingüe ES/EN que tenía la landing anterior |

### Orden sugerido

1. **S2 + S6** — media hora, y arreglan cómo se *ve* el sitio al cargarlo y en la pestaña.
2. **S1** — antes de cualquier campaña o de compartir el enlace en redes.
3. **S3** — el FAQ ya está escrito; solo falta el marcado.
4. **S4 + §2.4/2.5** — resuelve el enlace roto y el riesgo legal de un tirón.
5. **S5, S7, S8**, luego el resto.

---

## 4. Pendientes de infraestructura, en orden

1. `wrangler secret put ADMIN_PASSWORD` — para poder leer los leads.
2. Widget de Turnstile + `wrangler secret put TURNSTILE_SECRET` — antes de que llegue spam.
3. Aviso de privacidad y términos (§2.4, §2.5) — el formulario ya está captando datos.
4. Cuenta de Mailgun + DNS (MX, SPF, DKIM, DMARC) + `wrangler secret put MAILGUN_API_KEY`.
5. Deploy automático en push (GitHub Actions). Hoy el despliegue es manual.
6. Sustituir el tipo de cambio fijo por un feed real y quitar la marca "OXXO" del ejemplo.
