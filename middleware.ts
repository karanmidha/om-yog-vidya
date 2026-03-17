import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (production should use Redis/KV)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMITS = {
  global: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  contact: { requests: 5, windowMs: 60 * 60 * 1000 }, // 5 requests per hour for contact form
  booking: { requests: 10, windowMs: 60 * 60 * 1000 }, // 10 requests per hour for booking
  testimonial: { requests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour for testimonials
};

function getRateLimitKey(ip: string, path: string): string {
  // Create specific keys for different endpoints
  if (path.includes('/contact')) return `${ip}:contact`;
  if (path.includes('/booking')) return `${ip}:booking`;
  if (path.includes('/testimonial')) return `${ip}:testimonial`;
  return `${ip}:global`;
}

function getRateLimit(path: string) {
  if (path.includes('/contact')) return RATE_LIMITS.contact;
  if (path.includes('/booking')) return RATE_LIMITS.booking;
  if (path.includes('/testimonial')) return RATE_LIMITS.testimonial;
  return RATE_LIMITS.global;
}

function isRateLimited(ip: string, path: string): boolean {
  const key = getRateLimitKey(ip, path);
  const limit = getRateLimit(path);
  const now = Date.now();

  const current = requestCounts.get(key) || { count: 0, resetTime: now + limit.windowMs };

  // Reset counter if window has expired
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + limit.windowMs;
  }

  current.count++;
  requestCounts.set(key, current);

  return current.count > limit.requests;
}

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('X-Forwarded-For') || 'unknown';
  const path = request.nextUrl.pathname;

  // Skip rate limiting for static assets
  if (path.startsWith('/_next') || path.startsWith('/static') || path.match(/\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|css|js)$/)) {
    return NextResponse.next();
  }

  // Apply rate limiting
  if (isRateLimited(ip, path)) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Please try again later',
        retryAfter: '15 minutes'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '900', // 15 minutes in seconds
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};