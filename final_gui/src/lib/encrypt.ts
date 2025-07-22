import forge from "node-forge";

function rotateLeft(b: number): number {
  return ((b << 1) | (b >> 7)) & 0xff;
}

function transposeBytes(data: Uint8Array): Uint8Array {
  const result = new Uint8Array(data.length);
  result.set(data);
  for (let i = 0; i < result.length - 1; i += 2) {
    const temp = result[i];
    result[i] = result[i + 1];
    result[i + 1] = temp;
  }
  return result;
}

function reverseAlphabet(str: string): string {
  return str
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (char >= "A" && char <= "Z") return String.fromCharCode(90 - (code - 65));
      if (char >= "a" && char <= "z") return String.fromCharCode(122 - (code - 97));
      return char;
    })
    .join("");
}

export function dickTwistEncrypt(plaintext: string, key: string, pemPublicKey: string): string {
  if (!key) throw new Error("Key must not be empty");
  const textBytes = new TextEncoder().encode(plaintext);
  const keyBytes = new TextEncoder().encode(key);

  const result = new Uint8Array(textBytes.length);

  for (let i = 0; i < textBytes.length; i++) {
    const x = textBytes[i] ^ keyBytes[i % keyBytes.length];
    const twisted = rotateLeft(x);
    result[i] = (twisted + i * 3) % 256;
  }

  const transposed = transposeBytes(result);
  const base64Text = btoa(String.fromCharCode(...transposed));
  const flipped = reverseAlphabet(base64Text);

  // Encrypt with RSA
  const publicKey = forge.pki.publicKeyFromPem(pemPublicKey) as forge.pki.rsa.PublicKey;
  const encrypted = publicKey.encrypt(flipped, "RSAES-PKCS1-V1_5");

  return btoa(encrypted);
}

// export function DickTwistFileEncrypt(content: string, key: string): string {
//   let encrypted = '';
//   for (let i = 0; i < content.length; i++) {
//     const c = content.charCodeAt(i);
//     const k = key.charCodeAt(i % key.length);
//     encrypted += String.fromCharCode((c + k) % 256); // simple byte shift
//   }
//   return btoa(encrypted); // base64 encode for safe transport
// }