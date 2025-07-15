package crypt

import (
	"fmt"
	"os"
)

func EncryptFile(path, key string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	fmt.Println("File hash: " + MD5Hash(string(data)))
	encrypted := EncryptVigenere(string(data), key)
	return os.WriteFile(path, []byte(encrypted), 0644)
}

func DecryptFile(path, key string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	decrypted := DecryptVigenere(string(data), key)
	fmt.Println("Decrypted hash: " + MD5Hash(string(decrypted)))
	return os.WriteFile(path, []byte(decrypted), 0644)
}
