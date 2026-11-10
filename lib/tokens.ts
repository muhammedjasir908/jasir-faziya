import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
export const TOKEN_LENGTH = 10;

export function generateToken(length = TOKEN_LENGTH) {
  const chars: string[] = [];
  const limit = 256 - (256 % ALPHABET.length);
  while (chars.length < length) {
    const bytes = randomBytes(32);
    for (const byte of bytes) {
      if (byte >= limit) continue;
      chars.push(ALPHABET[byte % ALPHABET.length]!);
      if (chars.length === length) break;
    }
  }
  return chars.join("");
}

export function isWellFormedToken(token: string) {
  if (token.length !== TOKEN_LENGTH) return false;
  return [...token].every((char) => ALPHABET.includes(char));
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function encryptionKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be a random string of at least 16 characters");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptToken(payload: string) {
  const buf = Buffer.from(payload, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
