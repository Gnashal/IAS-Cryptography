import hashlib
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64

class AESCipher:
    def __init__(self, password):
        self.key = hashlib.sha256(password.encode()).digest()

    def pad(self, data):
        pad_len = AES.block_size - len(data) % AES.block_size
        return data + bytes([pad_len] * pad_len)

    def unpad(self, data):
        pad_len = data[-1]
        return data[:-pad_len]

    def encrypt(self, raw):
        raw_bytes = raw.encode()
        print("Plaintext SHA-256 Hash:", hashlib.sha256(raw_bytes).hexdigest())

        raw_padded = self.pad(raw_bytes)
        iv = get_random_bytes(AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(raw_padded)
        encrypted_combined = iv + encrypted

        print("Encrypted Data SHA-256 Hash:", hashlib.sha256(encrypted_combined).hexdigest())
        return base64.b64encode(encrypted_combined).decode()

    def decrypt(self, enc):
        enc_bytes = base64.b64decode(enc)
        print("Encrypted Input SHA-256 Hash:", hashlib.sha256(enc_bytes).hexdigest())

        iv = enc_bytes[:AES.block_size]
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(enc_bytes[AES.block_size:])
        decrypted_unpadded = self.unpad(decrypted)

        print("Decrypted Text SHA-256 Hash:", hashlib.sha256(decrypted_unpadded).hexdigest())
        return decrypted_unpadded.decode()

print("\n--- AES Cryptography with Hash Verification ---")

if __name__ == "__main__":
    password = input("Enter encryption password: ")
    aes = AESCipher(password)

    choice = input("Encrypt or Decrypt? (e/d): ").lower()

    if choice == 'e':
        text = input("\nEnter plaintext to encrypt: ")
        encrypted = aes.encrypt(text)
        print("\nEncrypted text (Base64):", encrypted)

    elif choice == 'd':
        text = input("\nEnter base64 encrypted text: ")
        try:
            decrypted = aes.decrypt(text)
            print("\nDecrypted text:", decrypted)
        except Exception as e:
            print("Decryption failed:", str(e))

    else:
        print("Invalid option.")
