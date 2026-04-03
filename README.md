# HYDRA Developer Toolkit

> 22 developer utility endpoints on the global edge. Free. No API key required.

**Live API:** `https://hydra-worker.toledonick98.workers.dev`

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Endpoints](https://img.shields.io/badge/endpoints-22-blue)](https://hydra-worker.toledonick98.workers.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Try It Now

```bash
# Text analysis
curl -X POST https://hydra-worker.toledonick98.workers.dev/text/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'

# Generate UUIDs
curl https://hydra-worker.toledonick98.workers.dev/crypto/uuid?count=5

# Password strength
curl -X POST https://hydra-worker.toledonick98.workers.dev/security/password-strength \
  -H "Content-Type: application/json" \
  -d '{"password": "MyP@ssw0rd!"}'
```

## All 22 Endpoints

### Text Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/text/analyze` | Word count, reading time, Flesch score, readability level |
| POST | `/text/keywords` | Keyword extraction with frequency and density |
| POST | `/text/slug` | URL-safe slug generation |
| POST | `/text/case` | Convert to camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE |
| POST | `/text/strip-html` | Remove HTML tags, decode entities |
| POST | `/text/diff` | Line-by-line text comparison |

### Crypto & Encoding
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/crypto/hash` | SHA-1, SHA-256, SHA-512, MD5 hashing |
| POST | `/crypto/hash-all` | All hash algorithms at once |
| POST | `/crypto/base64/encode` | Base64 encode |
| POST | `/crypto/base64/decode` | Base64 decode |
| GET | `/crypto/uuid?count=N` | Generate 1-100 v4 UUIDs |

### JSON & Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/json/validate` | Validate, prettify, minify JSON |
| POST | `/json/diff` | Structural JSON comparison |

### Security & Validation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/security/password-strength` | Score, entropy, feedback |
| POST | `/regex/test` | Pattern testing with capture groups |
| POST | `/validate/email` | Email format validation |
| POST | `/jwt/decode` | Decode JWT header + payload (no verification) |

### Utilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/url/parse` | URL decomposition with query params |
| POST | `/color/convert` | Hex ↔ RGB ↔ HSL conversion |
| POST | `/convert/md-to-html` | Markdown to HTML |
| GET | `/time/now` | Current time (ISO, Unix, human) |
| GET | `/time/convert/:ts` | Unix timestamp to readable |

### Data Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate/lorem` | Lorem ipsum paragraphs |
| POST | `/generate/random-data` | Fake names, emails, phones, companies |

## Tech Stack

- **Runtime:** Cloudflare Workers (global edge, ~50ms worldwide)
- **Framework:** Hono (ultrafast, 14KB)
- **Auth:** None required (public API)
- **Cost:** $0 on Workers free tier (100K req/day)
- **Zero dependencies** beyond Hono

## Self-Host

```bash
git clone https://github.com/ntoledo319/hydra-worker.git
cd hydra-worker
npm install
npx wrangler dev     # local development
npx wrangler deploy  # deploy to your Cloudflare account
```

## Also Available

- **Python/FastAPI version:** [hydra-toolkit-api](https://github.com/ntoledo319/hydra-toolkit-api)
- **RapidAPI:** Listed for marketplace discovery
- **OpenAPI spec:** `openapi.json` in this repo

## License

MIT — use it however you want.

Built by [Toledo Technologies LLC](https://toledotechnologies.com)
