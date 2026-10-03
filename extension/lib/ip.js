// Conservative global-unicast recognition. Ambiguous special-use ranges are excluded.
export function parseIP(input) {
  if (typeof input !== 'string' || input.length > 45 || /[%\s/\[\]]/.test(input)) return null;
  let s = input.toLowerCase();
  if (!s.includes(':')) {
    if (!/^(0|[1-9]\d{0,2})(\.(0|[1-9]\d{0,2})){3}$/.test(s)) return null;
    const bytes = s.split('.').map(Number);
    if (bytes.some(n => n > 255)) return null;
    return { family: 4, key: bytes.join('.'), bytes };
  }
  if (s.includes('.')) {
    const i = s.lastIndexOf(':'); const v4 = parseIP(s.slice(i + 1));
    if (!v4 || v4.family !== 4) return null;
    s = s.slice(0, i + 1) + ((v4.bytes[0] << 8) | v4.bytes[1]).toString(16) + ':' + ((v4.bytes[2] << 8) | v4.bytes[3]).toString(16);
  }
  if (!/^[0-9a-f:]+$/.test(s) || s.split('::').length > 2) return null;
  const halves = s.split('::');
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  if ([...left, ...right].some(x => !/^[0-9a-f]{1,4}$/.test(x))) return null;
  const missing = 8 - left.length - right.length;
  if (halves.length === 2 ? missing < 1 : left.length !== 8) return null;
  const words = [...left, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...right].map(x => parseInt(x, 16));
  if (words.slice(0, 5).every(n => n === 0) && words[5] === 0xffff) {
    return parseIP([words[6] >> 8, words[6] & 255, words[7] >> 8, words[7] & 255].join('.'));
  }
  return { family: 6, key: words.map(n => n.toString(16).padStart(4, '0')).join(':'), words };
}
export function publicIP(input) {
  const ip = parseIP(input); if (!ip) return null;
  if (ip.family === 4) {
    const [a, b, c] = ip.bytes;
    if (a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && ((b === 0 && (c === 0 || c === 2)) || b === 168 || (b === 88 && c === 99))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113)) return null;
  } else {
    const [a, b] = ip.words;
    if ((a & 0xe000) !== 0x2000 || a === 0x2002 || (a === 0x2001 && (b < 0x200 || b === 0xdb8)) ||
      (a === 0x3fff && b < 0x1000)) return null;
  }
  return ip;
}
export function publicCandidate(candidate) {
  if (!candidate || !['host', 'srflx', 'prflx'].includes(candidate.type)) return null;
  // Relay is a TURN server, relatedAddress is not a separate observed candidate.
  const ip = publicIP(candidate.address);
  return ip ? { address: candidate.address, family: ip.family, key: ip.key, type: candidate.type } : null;
}
