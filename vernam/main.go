package main

import (
	"bufio"
	"fmt"
	"ias/crypt"
	"os"
	"strings"
)

func main() {
	var reader = bufio.NewReader(os.Stdin)
	var encrypted string

	for {
		fmt.Println("\n==== Vernam Text Encryption ====")
		fmt.Println("1. Encrypt plaintext")
		fmt.Println("2. Decrypt ciphertext")
		fmt.Println("3. Exit")
		fmt.Print("Enter your choice: ")

		var choice int
		fmt.Scanln(&choice)
		switch choice {
		case 1:
			fmt.Print("Enter plaintext to encrypt: ")
			plaintext, _ := reader.ReadString('\n')
			plaintext = strings.TrimSpace(plaintext)

			keyBytes, encodedKey, err := crypt.GenerateOTP(len(plaintext))
			if err != nil {
				fmt.Println("Error generating OTP:", err)
				return
			}

			fmt.Println("Generated OTP key (save this!):", encodedKey)
			fmt.Println("MD5 Hash of plaintext:", crypt.MD5Hash(plaintext))

			if err != nil {
				fmt.Println("Error generating OTP:", err)
				return
			}

			encrypted, err = crypt.EncryptVernam(plaintext, keyBytes)
			if err != nil {
				fmt.Println("Error encrypting:", err)
			} else {
				fmt.Println("Encrypted text:", encrypted)
			}
		case 2:
			fmt.Print("Enter base64 OTP key: ")
			otpEncoded, _ := reader.ReadString('\n')
			otpEncoded = strings.TrimSpace(otpEncoded)

			keyBytes, err := crypt.DecodeOTP(otpEncoded)
			if err != nil {
				fmt.Println("Error decoding OTP key:", err)
				continue
			}

			decrypted, err := crypt.DecryptVernam(encrypted, keyBytes)
			fmt.Println("MD5 Hash of decrypted text:", crypt.MD5Hash(decrypted))

			if err != nil {
				fmt.Println("Error decrypting:", err)
			} else {
				fmt.Println("Decrypted text:", decrypted)
			}

		case 3:
			fmt.Println("Exiting...")
			return

		default:
			fmt.Println("Invalid choice. Try again.")
		}
	}
}
