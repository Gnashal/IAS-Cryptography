def encrypt(message, shift):
    message = message.lower()
    encrypted_message = ""
    for char in message:
        if char.islower():
            encrypted_message += chr((ord(char) + shift - 97) % 26 + 97)
        else:
            encrypted_message += char
    return encrypted_message

def decrypt(message, shift):
    message = message.lower()
    decrypted_message = ""
    for char in message:
        if char.islower():
            decrypted_message += chr((ord(char) - shift - 97) % 26 + 97)
        else:
            decrypted_message += char
    return decrypted_message

print("---Caesar Shift Cipher in Python---")
message = input("\nInput your message for encrypting: ")
shift = int(input("Input how many shifts: "))

encryptedMessage = encrypt(message, shift)
print("\nEncrypted Message: " + encryptedMessage)
decryptedMessage = decrypt(encryptedMessage, shift)
print("Decrypted Message: "+ decryptedMessage)



