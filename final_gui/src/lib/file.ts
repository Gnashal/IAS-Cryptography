export function DickTwistFileEncrypt(buffer: ArrayBuffer, key: string): string {
  const bytes = new Uint8Array(buffer);
  const keyBytes = new TextEncoder().encode(key);
  const encryptedBytes = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    const k = keyBytes[i % keyBytes.length];
    encryptedBytes[i] = (bytes[i] + k) % 256;
  }

  return btoa(String.fromCharCode(...encryptedBytes));
}

export function DickTwistFileDecrypt(b64: string, key: string): ArrayBuffer {
  const encryptedStr = atob(b64);
  const encryptedBytes = new Uint8Array(encryptedStr.length);
  const keyBytes = new TextEncoder().encode(key);

  for (let i = 0; i < encryptedStr.length; i++) {
    encryptedBytes[i] = encryptedStr.charCodeAt(i);
  }

  const decryptedBytes = new Uint8Array(encryptedBytes.length);
  for (let i = 0; i < encryptedBytes.length; i++) {
    const k = keyBytes[i % keyBytes.length];
    decryptedBytes[i] = (encryptedBytes[i] - k + 256) % 256;
  }

  return decryptedBytes.buffer;
}
