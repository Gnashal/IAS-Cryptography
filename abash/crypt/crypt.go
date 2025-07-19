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

func EncryptAbash(input string) string {
	var b strings.Builder
	for _, r := range input {
		if unicode.IsUpper(r) {
			char := 'Z' - (r - 'A')
			b.WriteRune(char)
		} else if unicode.IsLower(r) {
			char := 'z' - (r - 'a')
			b.WriteRune(char)
		} else {
			b.WriteRune(r)
		}
	}
	result := b.String()
	return result
}
