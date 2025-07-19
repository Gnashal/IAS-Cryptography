package crypt

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
)

func MD5Hash(text string) string {
	hash := md5.Sum([]byte(text))
	return hex.EncodeToString(hash[:])
}

func EncryptVernam(plaintext, key string) (string, error) {
	if len(plaintext) != len(key) {
		return "Error", errors.New("plaintext and key must be of the same length")
	}
	ciphertext := make([]byte, len(plaintext))
	for i := range plaintext {
		ciphertext[i] = plaintext[i] ^ key[i]
	}
	return hex.EncodeToString(ciphertext), nil
}
func DecryptVernam(cipherHex, key string) (string, error) {
	cipherBytes, err := hex.DecodeString(cipherHex)
	if err != nil {
		return "", err
	}
	if len(cipherBytes) != len(key) {
		return "", errors.New("ciphertext and key must be of the same length")
	}
	plaintext := make([]byte, len(cipherBytes))
	for i := range cipherBytes {
		plaintext[i] = cipherBytes[i] ^ key[i]
	}
	return string(plaintext), nil
}
