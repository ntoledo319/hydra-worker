import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('*', cors());

// ─── HEALTH ────────────────────────────────────────
app.get('/', (c) => c.json({
  service: 'HYDRA Developer Toolkit', version: '1.0.0', status: 'operational',
  endpoints: 20, docs: 'https://github.com/ntoledo319/hydra-toolkit-api',
  runtime: 'Cloudflare Workers (global edge)',
}));

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── TEXT ANALYSIS ─────────────────────────────────
app.post('/text/analyze', async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const syllables = words.reduce((s, w) => s + Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) || []).length), 0);
  const avgSyl = syllables / Math.max(words.length, 1);
  const avgSent = words.length / Math.max(sentences.length, 1);
  const flesch = Math.max(0, Math.min(100, 206.835 - 1.015 * avgSent - 84.6 * avgSyl));
  return c.json({
    characters: text.length, characters_no_spaces: text.replace(/ /g, '').length,
    words: words.length, sentences: sentences.length,
    paragraphs: text.split(/\n\n+/).filter(p => p.trim()).length,
    avg_word_length: +(words.reduce((s, w) => s + w.length, 0) / Math.max(words.length, 1)).toFixed(2),
    reading_time_seconds: Math.round(words.length / 4.2),
    speaking_time_seconds: Math.round(words.length / 2.5),
    flesch_reading_ease: +flesch.toFixed(1),
    reading_level: flesch > 70 ? 'Easy' : flesch > 50 ? 'Medium' : 'Difficult',
  });
});

// ─── KEYWORDS ──────────────────────────────────────
const STOP = new Set('the a an is are was were be been being have has had do does did will would could should may might shall can to of in for on with at by from as into about between through during before after above below up down out off over under again further then once and but or nor not so yet both either neither each every all any few more most other some such no only own same than too very just because it its this that these those i me my we our you your he him his she her they them their what which who'.split(' '));

app.post('/text/keywords', async (c) => {
  const { text, top_n = 10 } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const freq = {};
  words.forEach(w => { if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const total = Object.values(freq).reduce((s, v) => s + v, 0);
  const ranked = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, top_n);
  return c.json({
    keywords: ranked.map(([word, count]) => ({ word, count, density: +(count / total * 100).toFixed(2) })),
    unique_words: Object.keys(freq).length, total_significant_words: total,
  });
});

// ─── SLUG ──────────────────────────────────────────
app.post('/text/slug', async (c) => {
  const { text, separator = '-' } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  const slug = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/[-\s]+/g, separator);
  return c.json({ slug, original: text, length: slug.length });
});

// ─── CASE CONVERT ──────────────────────────────────
app.post('/text/case', async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  const words = text.match(/[a-zA-Z0-9]+/g) || [];
  return c.json({
    lower: text.toLowerCase(), upper: text.toUpperCase(),
    title: text.replace(/\b\w/g, c => c.toUpperCase()),
    camelCase: words.length ? words[0].toLowerCase() + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('') : '',
    PascalCase: words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
    snake_case: words.map(w => w.toLowerCase()).join('_'),
    'kebab-case': words.map(w => w.toLowerCase()).join('-'),
    CONSTANT_CASE: words.map(w => w.toUpperCase()).join('_'),
  });
});

// ─── STRIP HTML ────────────────────────────────────
app.post('/text/strip-html', async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  const tags = (text.match(/<[^>]+>/g) || []).length;
  const clean = text.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#039;/g,"'").trim();
  return c.json({ cleaned: clean, tags_removed: tags });
});

// ─── TEXT DIFF ──────────────────────────────────────
app.post('/text/diff', async (c) => {
  const { text1, text2 } = await c.req.json();
  if (!text1 || !text2) return c.json({ error: 'text1 and text2 required' }, 400);
  const l1 = text1.split('\n'), l2 = text2.split('\n');
  const added = [], removed = [];
  const max = Math.max(l1.length, l2.length);
  for (let i = 0; i < max; i++) {
    if (i >= l1.length) added.push({ line: i + 1, content: l2[i] });
    else if (i >= l2.length) removed.push({ line: i + 1, content: l1[i] });
    else if (l1[i] !== l2[i]) { removed.push({ line: i + 1, content: l1[i] }); added.push({ line: i + 1, content: l2[i] }); }
  }
  return c.json({ identical: text1 === text2, lines_added: added.length, lines_removed: removed.length, added, removed });
});

// ─── HASHING ───────────────────────────────────────
async function hash(text, algo) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

app.post('/crypto/hash', async (c) => {
  const { text, algorithm = 'sha256' } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  const map = { sha1: 'SHA-1', sha256: 'SHA-256', sha512: 'SHA-512' };
  if (algorithm === 'md5') {
    // MD5 not in Web Crypto — simple implementation
    return c.json({ hash: md5(text), algorithm: 'md5', length: 32 });
  }
  if (!map[algorithm]) return c.json({ error: `Unsupported. Use: sha1, sha256, sha512, md5` }, 400);
  const h = await hash(text, map[algorithm]);
  return c.json({ hash: h, algorithm, length: h.length });
});

app.post('/crypto/hash-all', async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  return c.json({
    md5: md5(text),
    sha1: await hash(text, 'SHA-1'),
    sha256: await hash(text, 'SHA-256'),
    sha512: await hash(text, 'SHA-512'),
  });
});

// Simple MD5 (not in Web Crypto)
function md5(str) {
  function rotl(v,s){return(v<<s)|(v>>>(32-s));}
  const K=[],M=[];
  for(let i=0;i<64;i++)K[i]=Math.floor(2**32*Math.abs(Math.sin(i+1)));
  let a0=0x67452301,b0=0xEFCDAB89,c0=0x98BADCFE,d0=0x10325476;
  const bytes=new TextEncoder().encode(str);
  const bits=bytes.length*8;
  const padded=new Uint8Array(Math.ceil((bytes.length+9)/64)*64);
  padded.set(bytes);padded[bytes.length]=0x80;
  const dv=new DataView(padded.buffer);
  dv.setUint32(padded.length-8,bits&0xFFFFFFFF,true);
  dv.setUint32(padded.length-4,Math.floor(bits/2**32),true);
  for(let o=0;o<padded.length;o+=64){
    for(let j=0;j<16;j++)M[j]=dv.getUint32(o+j*4,true);
    let a=a0,b=b0,c=c0,d=d0;
    for(let i=0;i<64;i++){
      let f,g;
      if(i<16){f=(b&c)|((~b)&d);g=i;}
      else if(i<32){f=(d&b)|((~d)&c);g=(5*i+1)%16;}
      else if(i<48){f=b^c^d;g=(3*i+5)%16;}
      else{f=c^(b|(~d));g=(7*i)%16;}
      const S=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
      f=((f+a+K[i]+M[g])&0xFFFFFFFF);
      a=d;d=c;c=b;b=(b+rotl(f,S[i]))&0xFFFFFFFF;
    }
    a0=(a0+a)&0xFFFFFFFF;b0=(b0+b)&0xFFFFFFFF;c0=(c0+c)&0xFFFFFFFF;d0=(d0+d)&0xFFFFFFFF;
  }
  const r=new DataView(new ArrayBuffer(16));
  r.setUint32(0,a0,true);r.setUint32(4,b0,true);r.setUint32(8,c0,true);r.setUint32(12,d0,true);
  return[...new Uint8Array(r.buffer)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

// ─── BASE64 ────────────────────────────────────────
app.post('/crypto/base64/encode', async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  const encoded = btoa(text);
  return c.json({ encoded, original_length: text.length, encoded_length: encoded.length });
});

app.post('/crypto/base64/decode', async (c) => {
  const { text } = await c.req.json();
  try { return c.json({ decoded: atob(text) }); }
  catch(e) { return c.json({ error: 'Invalid base64' }, 400); }
});

// ─── UUID ──────────────────────────────────────────
app.get('/crypto/uuid', (c) => {
  const count = Math.min(100, Math.max(1, parseInt(c.req.query('count') || '1')));
  const uuids = Array.from({ length: count }, () => crypto.randomUUID());
  return c.json({ uuids, version: 4, count: uuids.length });
});

// ─── JSON VALIDATE ─────────────────────────────────
app.post('/json/validate', async (c) => {
  const { text } = await c.req.json();
  try {
    const parsed = JSON.parse(text);
    const pretty = JSON.stringify(parsed, null, 2);
    const minified = JSON.stringify(parsed);
    const countKeys = (o) => {
      if (o && typeof o === 'object' && !Array.isArray(o)) return Object.keys(o).length + Object.values(o).reduce((s, v) => s + countKeys(v), 0);
      if (Array.isArray(o)) return o.reduce((s, v) => s + countKeys(v), 0);
      return 0;
    };
    return c.json({ valid: true, pretty, minified, type: Array.isArray(parsed) ? 'array' : typeof parsed, keys: countKeys(parsed), pretty_length: pretty.length, minified_length: minified.length });
  } catch(e) { return c.json({ valid: false, error: e.message }); }
});

// ─── REGEX ─────────────────────────────────────────
app.post('/regex/test', async (c) => {
  const { pattern, text, flags = '' } = await c.req.json();
  if (!pattern || !text) return c.json({ error: 'pattern and text required' }, 400);
  try {
    const re = new RegExp(pattern, flags + (flags.includes('g') ? '' : 'g'));
    const matches = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push({ match: m[0], start: m.index, end: m.index + m[0].length, groups: m.slice(1) });
      if (!flags.includes('g')) break;
    }
    return c.json({ pattern, matches_found: matches.length, matches });
  } catch(e) { return c.json({ error: `Invalid regex: ${e.message}` }, 400); }
});

// ─── PASSWORD STRENGTH ─────────────────────────────
app.post('/security/password-strength', async (c) => {
  const { password } = await c.req.json();
  if (!password) return c.json({ error: 'password required' }, 400);
  let score = 0; const fb = [];
  if (password.length >= 8) score++; else fb.push('Use at least 8 characters');
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++; else fb.push('Mix uppercase and lowercase');
  if (/\d/.test(password)) score++; else fb.push('Add numbers');
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++; else fb.push('Add special characters');
  if (!/(.)\1{2,}/.test(password)) score++; else fb.push('Avoid repeated characters');
  const common = ['password','123456','qwerty','admin','letmein','welcome'];
  if (!common.includes(password.toLowerCase())) score++; else fb.push("Don't use common passwords");
  let cs = 0;
  if (/[a-z]/.test(password)) cs += 26; if (/[A-Z]/.test(password)) cs += 26;
  if (/\d/.test(password)) cs += 10; if (/[^a-zA-Z0-9]/.test(password)) cs += 32;
  const entropy = +(password.length * Math.log2(Math.max(cs, 1))).toFixed(1);
  const labels = ['Very Weak','Very Weak','Weak','Weak','Fair','Good','Strong','Very Strong','Excellent'];
  return c.json({ score, max_score: 8, strength: labels[score] || 'Excellent', entropy_bits: entropy, feedback: fb, length: password.length });
});

// ─── URL PARSE ─────────────────────────────────────
app.post('/url/parse', async (c) => {
  const { text } = await c.req.json();
  try {
    const u = new URL(text);
    const params = {};
    u.searchParams.forEach((v, k) => { params[k] = params[k] ? [].concat(params[k], v) : v; });
    return c.json({ scheme: u.protocol.replace(':', ''), host: u.hostname, port: u.port || null,
      path: u.pathname, query_string: u.search.slice(1), fragment: u.hash.slice(1),
      params, is_https: u.protocol === 'https:', domain_parts: u.hostname.split('.') });
  } catch(e) { return c.json({ error: 'Invalid URL' }, 400); }
});

// ─── EMAIL VALIDATE ────────────────────────────────
app.post('/validate/email', async (c) => {
  const { text } = await c.req.json();
  const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text);
  const parts = text.split('@');
  return c.json({ email: text, valid_format: valid, local_part: parts[0], domain: parts[1] || null,
    issues: valid ? [] : ['Invalid email format'] });
});

// ─── COLOR CONVERT ─────────────────────────────────
app.post('/color/convert', async (c) => {
  const { color } = await c.req.json();
  let r = 0, g = 0, b = 0;
  if (color.startsWith('#')) {
    let h = color.slice(1);
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    if (h.length !== 6) return c.json({ error: 'Invalid hex' }, 400);
    r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
  } else if (color.startsWith('rgb')) {
    const nums = color.match(/\d+/g);
    if (!nums || nums.length < 3) return c.json({ error: 'Invalid rgb' }, 400);
    r = +nums[0]; g = +nums[1]; b = +nums[2];
  } else return c.json({ error: 'Use hex (#FF5733) or rgb(255,87,51)' }, 400);
  r = Math.min(255, r); g = Math.min(255, g); b = Math.min(255, b);
  const mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255;
  const l = (mx + mn) / 2;
  const s = mx === mn ? 0 : l > 0.5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn);
  let h = 0;
  if (mx !== mn) {
    if (mx === r / 255) h = 60 * (((g / 255 - b / 255) / (mx - mn)) % 6);
    else if (mx === g / 255) h = 60 * ((b / 255 - r / 255) / (mx - mn) + 2);
    else h = 60 * ((r / 255 - g / 255) / (mx - mn) + 4);
  }
  if (h < 0) h += 360;
  return c.json({ hex: `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`,
    rgb: `rgb(${r},${g},${b})`, hsl: `hsl(${Math.round(h)},${Math.round(s*100)}%,${Math.round(l*100)}%)`,
    r, g, b, h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) });
});

// ─── LOREM IPSUM ───────────────────────────────────
const LW = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim est laborum'.split(' ');

app.post('/generate/lorem', async (c) => {
  const { paragraphs = 3, sentences_per = 5 } = await c.req.json();
  const ps = [];
  for (let p = 0; p < Math.min(20, paragraphs); p++) {
    const sents = [];
    for (let s = 0; s < Math.min(15, sentences_per); s++) {
      const len = 6 + Math.floor(Math.random() * 10);
      const words = Array.from({ length: len }, () => LW[Math.floor(Math.random() * LW.length)]);
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      sents.push(words.join(' ') + '.');
    }
    ps.push(sents.join(' '));
  }
  const full = ps.join('\n\n');
  return c.json({ text: full, paragraphs: ps.length, words: full.split(/\s+/).length, characters: full.length });
});

// ─── RANDOM DATA ───────────────────────────────────
const FN = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica'];
const LN = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Wilson','Anderson'];
const CO = ['Acme Corp','TechFlow','DataVerse','CloudNine','PixelForge','NexGen Labs','CoreSync','VeloTech'];
const ST = ['Main St','Oak Ave','Pine Rd','Elm Blvd','Cedar Ln','Maple Dr','Highland'];

app.post('/generate/random-data', async (c) => {
  const { count = 5, fields = ['name','email','phone'] } = await c.req.json();
  const rn = (a) => a[Math.floor(Math.random() * a.length)];
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const records = Array.from({ length: Math.min(100, count) }, () => {
    const first = rn(FN), last = rn(LN), rec = {};
    fields.forEach(f => {
      if (f === 'name') rec.name = `${first} ${last}`;
      else if (f === 'email') rec.email = `${first.toLowerCase()}.${last.toLowerCase()}${ri(1,99)}@example.com`;
      else if (f === 'phone') rec.phone = `+1-${ri(200,999)}-${ri(100,999)}-${ri(1000,9999)}`;
      else if (f === 'company') rec.company = rn(CO);
      else if (f === 'address') rec.address = `${ri(1,9999)} ${rn(ST)}`;
      else if (f === 'date') rec.date = `20${ri(20,26)}-${String(ri(1,12)).padStart(2,'0')}-${String(ri(1,28)).padStart(2,'0')}`;
      else if (f === 'uuid') rec.uuid = crypto.randomUUID();
      else if (f === 'number') rec.number = ri(1, 1000000);
    });
    return rec;
  });
  return c.json({ count: records.length, fields, data: records });
});

// ─── MARKDOWN TO HTML ──────────────────────────────
app.post('/convert/md-to-html', async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: 'text required' }, 400);
  let t = text;
  t = t.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  t = t.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  t = t.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  t = t.replace(/`(.+?)`/g, '<code>$1</code>');
  t = t.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/^- (.+)$/gm, '<li>$1</li>');
  return c.json({ html: t, input_length: text.length, output_length: t.length });
});

// ─── TIME ──────────────────────────────────────────
app.get('/time/now', (c) => {
  const now = new Date();
  return c.json({ iso8601: now.toISOString(), unix: Math.floor(now.getTime() / 1000),
    unix_ms: now.getTime(), date: now.toISOString().split('T')[0],
    time: now.toISOString().split('T')[1].split('.')[0],
    day_of_week: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getUTCDay()] });
});

app.get('/time/convert/:ts', (c) => {
  let ts = parseInt(c.req.param('ts'));
  if (ts > 1e12) ts = Math.floor(ts / 1000);
  try {
    const dt = new Date(ts * 1000);
    if (isNaN(dt.getTime())) throw new Error('Invalid');
    return c.json({ iso8601: dt.toISOString(), unix: ts,
      human_readable: dt.toUTCString(), date: dt.toISOString().split('T')[0],
      time: dt.toISOString().split('T')[1].split('.')[0] });
  } catch(e) { return c.json({ error: 'Invalid timestamp' }, 400); }
});

// ─── JWT DECODE ────────────────────────────────────
app.post('/jwt/decode', async (c) => {
  const { text } = await c.req.json();
  const parts = text.split('.');
  if (parts.length !== 3) return c.json({ error: 'Invalid JWT (need 3 dot-separated parts)' }, 400);
  const decode = (s) => {
    try {
      const pad = s + '='.repeat((4 - s.length % 4) % 4);
      return JSON.parse(atob(pad.replace(/-/g, '+').replace(/_/g, '/')));
    } catch { return null; }
  };
  const header = decode(parts[0]), payload = decode(parts[1]);
  let expired = null;
  if (payload?.exp) expired = new Date(payload.exp * 1000) < new Date();
  return c.json({ header, payload, signature_present: !!parts[2],
    expired, warning: 'Signature NOT verified - decode only' });
});

// ─── JSON DIFF ─────────────────────────────────────
app.post('/json/diff', async (c) => {
  const { text1, text2 } = await c.req.json();
  let j1, j2;
  try { j1 = JSON.parse(text1); j2 = JSON.parse(text2); }
  catch(e) { return c.json({ error: `Invalid JSON: ${e.message}` }, 400); }
  const s1 = JSON.stringify(j1, Object.keys(j1).sort(), 2);
  const s2 = JSON.stringify(j2, Object.keys(j2).sort(), 2);
  const l1 = s1.split('\n'), l2 = s2.split('\n');
  const diffs = [];
  const max = Math.max(l1.length, l2.length);
  for (let i = 0; i < max; i++) {
    if (l1[i] !== l2[i]) diffs.push({ line: i + 1, from: l1[i] || '(absent)', to: l2[i] || '(absent)' });
  }
  return c.json({ identical: JSON.stringify(j1) === JSON.stringify(j2), diff_lines: diffs.length, diffs });
});

export default app;
