import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // ── Detectar dominio raíz (la landing)
  const isRootDomain =
    hostname === 'serendipity.vn' ||
    hostname === 'www.serendipity.vn'

  // ── Detectar subdominio app
  const isAppSubdomain = hostname === 'app.serendipity.vn'

  // ── Rutas que siempre deben pasar sin redirección (assets, api, etc.)
  const isStaticOrApi =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml)$/) !== null

  if (isRootDomain && !isStaticOrApi) {
    // En el dominio raíz solo permitimos la landing page (/)
    // Todo lo demás se redirige al subdominio app
    if (pathname !== '/') {
      const appUrl = new URL(
        pathname + (request.nextUrl.search || ''),
        'https://app.serendipity.vn'
      )
      return NextResponse.redirect(appUrl, { status: 301 })
    }
  }

  if (isAppSubdomain && !isStaticOrApi) {
    // En el subdominio app, si alguien va a la raíz lo mandamos al login
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Si alguien intenta acceder a la landing desde app.*, lo mandamos al dominio raíz
    // (opcional — comenta este bloque si no lo necesitas)
    // if (pathname === '/landing') {
    //   return NextResponse.redirect(new URL('/', 'https://serendipity.vn'))
    // }
  }

  return NextResponse.next()
}

export const config = {
  // Aplicar el middleware a TODAS las rutas excepto archivos estáticos de Next.js
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
