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
		fmt.Println("\n==== Vernam File Encryption ====")
		fmt.Println("1. Encrypt plaintext")
		fmt.Println("2. Decrypt ciphertext")
		fmt.Println("3. Exit")
		fmt.Print("Enter your choice: ")

		var choice int
		var err error
		fmt.Scanln(&choice)
		switch choice {
		case 1:
			fmt.Print("Enter plaintext to encrypt: ")
			plaintext, _ := reader.ReadString('\n')
			plaintext = strings.TrimSpace(plaintext)
			fmt.Print("Enter key for encryption: ")
			key, _ := reader.ReadString('\n')
			key = strings.TrimSpace(key)
			hash := crypt.MD5Hash(plaintext)
			fmt.Println("MD5 Hash of plaintext:", hash)
			encrypted, err = crypt.EncryptVernam(plaintext, key)
			if err != nil {
				fmt.Println("Error encrypting:", err)
			} else {
				fmt.Println("Encrypted text:", encrypted)
			}
		case 2:
			fmt.Print("Enter key for decryption: ")
			key, _ := reader.ReadString('\n')
			key = strings.TrimSpace(key)
			decrypted, err := crypt.DecryptVernam(encrypted, key)
			hash := crypt.MD5Hash(decrypted)
			fmt.Println("MD5 Hash of decrypted text:", hash)
			if err != nil {
				fmt.Println("Error encrypting:", err)
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
