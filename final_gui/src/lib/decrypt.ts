import forge from "node-forge";

function rotateRight(b: number): number {
  return ((b >> 1) | (b << 7)) & 0xff;
}

function reverseTransposeBytes(data: Uint8Array): Uint8Array {
  return transposeBytes(data); // symmetric
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

export function dickTwistDecrypt(ciphertext: string, key: string, pemPrivateKey: string): string {
  if (!key) throw new Error("Key must not be empty");

  const encryptedBytes = atob(ciphertext);
  const privateKey = forge.pki.privateKeyFromPem(pemPrivateKey) as forge.pki.rsa.PrivateKey;
  const decrypted = privateKey.decrypt(encryptedBytes, "RSAES-PKCS1-V1_5");

  const reversed = reverseAlphabet(decrypted);
  const base64Decoded = Uint8Array.from(atob(reversed), c => c.charCodeAt(0));

  const detransposed = reverseTransposeBytes(base64Decoded);
  const result = new Uint8Array(detransposed.length);
  const keyBytes = new TextEncoder().encode(key);

  for (let i = 0; i < detransposed.length; i++) {
    const untwist = (detransposed[i] - i * 3 + 256) % 256;
    result[i] = rotateRight(untwist) ^ keyBytes[i % keyBytes.length];
  }

  return new TextDecoder().decode(result);
}
