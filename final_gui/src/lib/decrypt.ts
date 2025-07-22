
// export function DickTwistFileDecrypt(encoded: string, key: string): string {
//   const content = atob(encoded); // decode base64
//   let decrypted = '';
//   for (let i = 0; i < content.length; i++) {
//     const c = content.charCodeAt(i);
//     const k = key.charCodeAt(i % key.length);
//     decrypted += String.fromCharCode((c - k + 256) % 256);
//   }
//   return decrypted;
// }