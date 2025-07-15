package crypt

import (
	"crypto/md5"
	"encoding/hex"
	"strings"
	"unicode"
)

func MD5Hash(text string) string {
	hash := md5.Sum([]byte(text))
	return hex.EncodeToString(hash[:])
}

func EncryptVigenere(input, key string) string {
	var b strings.Builder
	key = strings.ToUpper(key)
	input = strings.ToUpper(input)
	keyIndex := 0
	for _, r := range input {
		if unicode.IsLetter(r) {
			shift := key[keyIndex%len(key)] - 'A'
			encrypted := 'A' + (r-'A'+rune(shift))%26
			b.WriteRune(encrypted)
			keyIndex++
		} else {
			b.WriteRune(r)
		}
	}

	return b.String()
}
func DecryptVigenere(input, key string) string {
	var b strings.Builder
	key = strings.ToUpper(key)
	input = strings.ToUpper(input)
	keyIndex := 0
	for _, r := range input {
		if unicode.IsLetter(r) {
			shift := key[keyIndex%len(key)] - 'A'
			decrypted := 'A' + (r-'A'-rune(shift)+26)%26
			b.WriteRune(decrypted)
			keyIndex++
		} else {
			b.WriteRune(r)
		}
	}

	return b.String()
}
