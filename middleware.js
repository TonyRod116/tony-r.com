/**
 * Vercel Edge Middleware: evita 403 en /demos y /demos/ reescribiendo a index.html (SPA).
 * Logs de debug: Vercel Dashboard → Project → Logs (Runtime Logs).
 */
import { rewrite, next } from '@vercel/functions';

export const config = {
  matcher: ['/demos', '/demos/'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Debug: ver en Vercel → Deployments → [último] → Functions / Runtime Logs
  console.log('[middleware] pathname=', pathname, 'url=', request.url);

  if (pathname === '/demos' || pathname === '/demos/') {
    const target = new URL('/index.html', request.url);
    console.log('[middleware] rewriting to', target.href);
    return rewrite(target);
  }

  return next();
}
