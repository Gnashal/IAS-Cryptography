package crypt

import (
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"errors"
)

func MD5Hash(text string) string {
	hash := md5.Sum([]byte(text))
	return hex.EncodeToString(hash[:])
}

func GenerateOTP(length int) ([]byte, string, error) {
	key := make([]byte, length)
	_, err := rand.Read(key)
	if err != nil {
		return nil, "", err
	}
	encoded := base64.RawStdEncoding.EncodeToString(key)
	return key, encoded, nil
}

// Decode base64 OTP to raw key bytes
func DecodeOTP(encoded string) ([]byte, error) {
	return base64.RawStdEncoding.DecodeString(encoded)
}

func EncryptVernam(plaintext string, key []byte) (string, error) {
	if len(plaintext) != len(key) {
		return "Error", errors.New("plaintext and key must be of the same length")
	}
	ciphertext := make([]byte, len(plaintext))
	for i := range plaintext {
		ciphertext[i] = plaintext[i] ^ key[i]
	}
	return hex.EncodeToString(ciphertext), nil
}
func DecryptVernam(cipherHex string, key []byte) (string, error) {
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
