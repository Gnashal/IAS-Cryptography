package crypt

import (
	"strings"
	"unicode"
)

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
