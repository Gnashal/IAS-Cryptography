package main

import (
	"bufio"
	"fmt"
	"ias/crypt"
	"os"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Println("\n==== Vigenère File Encryption ====")
		fmt.Println("1. Encrypt a file")
		fmt.Println("2. Decrypt a file")
		fmt.Println("3. Exit")
		fmt.Print("Enter your choice: ")

		var choice int
		fmt.Scanln(&choice)

		switch choice {
		case 1:
			fmt.Print("Enter filename to encrypt: ")
			filename, _ := reader.ReadString('\n')
			filename = strings.TrimSpace(filename)

			fmt.Print("Enter key: ")
			key, _ := reader.ReadString('\n')
			key = strings.TrimSpace(key)

			err := crypt.EncryptFile(filename, key)
			if err != nil {
				fmt.Println("Error encrypting:", err)
			} else {
				fmt.Println("File encrypted to:", filename)
			}

		case 2:
			fmt.Print("Enter filename to decrypt: ")
			filename, _ := reader.ReadString('\n')
			filename = strings.TrimSpace(filename)

			fmt.Print("Enter key: ")
			key, _ := reader.ReadString('\n')
			key = strings.TrimSpace(key)

			err := crypt.DecryptFile(filename, key)
			if err != nil {
				fmt.Println("Error decrypting:", err)
			} else {
				fmt.Println("File decrypted to:", filename)
			}

		case 3:
			fmt.Println("Exiting...")
			return

		default:
			fmt.Println("Invalid choice. Try again.")
		}
	}
}
