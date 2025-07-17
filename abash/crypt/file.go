package crypt

import (
	"fmt"
	"os"
)

func EncryptFile(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	fmt.Println("File hash: " + MD5Hash(string(data)))
	encrypted := EncryptAbash(string(data))
	return os.WriteFile(path, []byte(encrypted), 0644)
}

func DecryptFile(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	decrypted := EncryptAbash(string(data))
	fmt.Println("Decrypted hash: " + MD5Hash(string(decrypted)))
	return os.WriteFile(path, []byte(decrypted), 0644)
}
