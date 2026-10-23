import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('HYDRA transport and response security', () => {
  it('redirects HTTP while preserving the path and query', async () => {
    const response = await SELF.fetch('http://example.com/crypto/uuid?count=2', { redirect: 'manual' });
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://example.com/crypto/uuid?count=2');
    expect(response.headers.has('strict-transport-security')).toBe(false);
  });

  it('redirects a POST before attempting to parse its body', async () => {
    const response = await SELF.fetch('http://example.com/text/analyze', {
      method: 'POST', body: 'not JSON', redirect: 'manual',
    });
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://example.com/text/analyze');
  });

  it.each(['/', '/health', '/not-a-route'])('hardens HTTPS responses on %s', async (path) => {
    const response = await SELF.fetch(`https://example.com${path}`);
    expect(response.headers.get('strict-transport-security')).toBe('max-age=15552000');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('content-security-policy')).toContain("default-src 'none'");
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
  });

  it('serves the actual service banner', async () => {
    const response = await SELF.fetch('https://example.com/');
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ service: 'HYDRA Developer Toolkit', status: 'operational' });
  });

  it('preserves keyless cross-origin utilities', async () => {
    const response = await SELF.fetch('https://example.com/text/analyze', {
      method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://example.org' },
      body: JSON.stringify({ text: 'A small test.' }),
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect((await response.json()).words).toBe(3);
  });

  it('preserves HTTPS preflight responses', async () => {
    const response = await SELF.fetch('https://example.com/text/analyze', {
      method: 'OPTIONS', headers: { origin: 'https://example.org', 'access-control-request-method': 'POST' },
    });
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('strict-transport-security')).toBe('max-age=15552000');
  });

  it('retains validation errors and their security headers', async () => {
    const response = await SELF.fetch('https://example.com/text/analyze', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}',
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'text required' });
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });
});
