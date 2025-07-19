import hashlib

def get_column_order(keyword):
    order = sorted(range(len(keyword)), key=lambda k: keyword[k])
    return [order.index(i) for i in range(len(keyword))]

def encrypt(plaintext, keyword):
    width = len(keyword)
    matrix = [list(plaintext[i: i + width]) for i in range(0, len(plaintext), width)]

    result = ""
    for col in get_column_order(keyword):
        for row in matrix:
            if col < len(row):
                result += row[col]

    plaintext_hash = hashlib.sha256(plaintext.encode()).hexdigest()
    encrypted_hash = hashlib.sha256(result.encode()).hexdigest()

    
    return result + "||" + plaintext_hash, result, plaintext_hash, encrypted_hash

def decrypt(ciphertext_with_hash, keyword):
    try:
        ciphertext, original_hash = ciphertext_with_hash.split("||")
    except ValueError:
        return "[Error] Ciphertext missing hash delimiter.", "", "", ""

    width = len(keyword)
    height = len(ciphertext) // width + (1 if len(ciphertext) % width else 0)
    matrix = [[""] * width for _ in range(height)]

    pos = 0
    last_row_len = len(ciphertext) % width or width
    for col in get_column_order(keyword):
        rows = height if col < last_row_len else height - 1
        for row in range(rows):
            if pos < len(ciphertext):
                matrix[row][col] = ciphertext[pos]
                pos += 1

    decrypted_text = "".join("".join(row) for row in matrix).strip()
    decrypted_hash = hashlib.sha256(decrypted_text.encode()).hexdigest()
    encrypted_hash = hashlib.sha256(ciphertext.encode()).hexdigest()

    return decrypted_text, encrypted_hash, decrypted_hash



if __name__ == "__main__":
    plaintext = input("Enter plaintext: ").strip()
    keyword = input("Enter keyword: ").strip()

    if not keyword.isalpha():
        print("[Error] Keyword must contain only alphabetic characters.")
    else:
        encrypted_full, encrypted_text, pt_hash, enc_hash = encrypt(plaintext, keyword)

        print("\n===============ENCRYPTION===============")
        print(f"Encrypted Text: {encrypted_text}")
        print(f"Plaintext SHA-256 Hash: {pt_hash}")
        print(f"Encrypted Data SHA-256 Hash: {enc_hash}")

        print("\n===============DECRYPTION===============")
        decrypted_text, encrypted_sha, decrypted_sha = decrypt(encrypted_full, keyword)
        print(f"Decrypted text: {decrypted_text}")
        print(f"Encrypted Data SHA-256 Hash: {encrypted_sha}")
        print(f"Decrypted Data SHA-256 Hash: {decrypted_sha}")
    
