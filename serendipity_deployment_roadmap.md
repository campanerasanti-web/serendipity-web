# 🚀 Serendipity OS — Hoja de Ruta de Despliegue

Este documento detalla el estado actual del proyecto y los pasos exactos que faltan para completar la migración de dominios y el lanzamiento en producción.

---

## ✅ TRABAJO COMPLETADO (Listado)

### 🎨 Branding & UI
- [x] **Logos Dinámicos:** Implementado cambio automático entre `light_icon.png` y `dark_icon.png` según el tema del sistema.
- [x] **Landing Page:** Logo actualizado en el Navbar.
- [x] **Dashboard:** Logo actualizado en el Sidebar.

### 🔐 Autenticación & Seguridad
- [x] **Simplificación de Login:** Eliminada la autenticación biométrica (WebAuthn) para evitar problemas de acceso.
- [x] **Recordar Datos:** Implementada la opción "Ghi nhớ dữ liệu" (Recordar datos) que persiste el email localmente.
- [x] **MFA (Auth):** El sistema de segundos factores por email sigue activo y funcional.

### 🌍 Internacionalización (i18n)
- [x] **Traducciones:** Se agregaron todas las claves faltantes en **Español, Inglés y Vietnamita** para el login y el dashboard.

### 🛠️ Infraestructura (Código)
- [x] **Middleware de Dominio:** Configurado el ruteo automático entre `serendipity.vn` (Landing) y `app.serendipity.vn` (App).
- [x] **Env Variables:** El archivo `.env.local` ya tiene las variables de producción configuradas.
- [x] **GitHub:** El código más reciente ya fue subido al repositorio (`main` branch).

---

## 🟡 EN PROGRESO (Esperando al cliente)

### 🔗 Configuración de Dominios en Vercel
1. [x] **serendipity.vn** añadido en Vercel Settings.
2. [x] **app.serendipity.vn** añadido en Vercel Settings.
3. [x] **www.serendipity.vn** añadido (Redirigido al dominio principal).

---

## 🔴 PASOS PENDIENTES (Siguiente fase)

> ⚠️ Necesitamos acceso a la cuenta de **Cloudflare** vinculada al dominio `serendipity.vn`.

### 1. Configuración DNS en Cloudflare
Debemos entrar a Cloudflare y añadir estos 3 registros exactos:

| Tipo | Nombre | Valor | Proxy (Cloud) |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | ☁️ **Gris** (DNS Only) |
| **CNAME** | `www` | `cname.vercel-dns.com` | ☁️ **Gris** (DNS Only) |
| **CNAME** | `app` | `cname.vercel-dns.com` | ☁️ **Gris** (DNS Only) |

### 2. Verificación de SSL en Vercel
- Una vez los DNS propaguen, esperar a que Vercel genere los certificados SSL (tarda ~10 min).
- Verificar que el estado en Vercel pase a **"Valid Configuration"** (verde).

### 3. Variables de Entorno en Vercel
Asegurarse de que en Vercel existan estas variables nuevas:
- `NEXT_PUBLIC_LANDING_URL` = `https://serendipity.vn`
- `NEXT_PUBLIC_APP_URL` = `https://app.serendipity.vn`

---

## 🧪 Pruebas de Validación Final
Cuando todo esté activo, confirmaremos:
1. `serendipity.vn` ➡️ Muestra la Landing Page.
2. `app.serendipity.vn` ➡️ Va directo al Login.
3. Ingresar al Dashboard y verificar que no pida huella dactilar.
4. Cambiar el idioma y confirmar que "Recordar datos" aparezca traducido correctamente.

---
*Ultima actualización: 25 de Marzo, 2026 - 1:03 PM*
