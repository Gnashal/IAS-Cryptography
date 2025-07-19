package crypt

import (
	"crypto/md5"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"strings"
	"unicode"
)

func rotateLeft(b byte) byte {
	return (b << 1) | (b >> 7)
}
func rotateRight(b byte) byte {
	return (b >> 1) | (b << 7)
}
func DickTwistEncrypt(plaintext, key string) (string, error) {
	if len(key) == 0 {
		return "", errors.New("key string must not be empty")
	}
	result := make([]byte, len(plaintext))
	for i, r := range []byte(plaintext) {
		k := key[i%len(key)]
		x := r ^ k
		twist := rotateLeft(x)
		final := byte((int(twist) + i*3) % 256)
		result[i] = final
	}
	var b strings.Builder
	for _, r := range base64.StdEncoding.EncodeToString(result) {
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

	return b.String(), nil
}
func DickTwistDecrypt(ciphertext, key string) (string, error) {
	if len(key) == 0 {
		return "", errors.New("key string must not be empty")
	}

	var b strings.Builder
	for _, r := range ciphertext {
		if unicode.IsUpper(r) {
			char := 'A' + ('Z' - r)
			b.WriteRune(char)
		} else if unicode.IsLower(r) {
			char := 'a' + ('z' - r)
			b.WriteRune(char)
		} else {
			b.WriteRune(r)
		}
	}
	decodedBase64 := b.String()

	raw, err := base64.StdEncoding.DecodeString(decodedBase64)
	if err != nil {
		return "", errors.New("failed to decode base64 ciphertext")
	}

	result := make([]byte, len(raw))
	for i, c := range []byte(raw) {
		untwist := (int(c) - i*3 + 256) % 256
		rot := rotateRight(byte(untwist))
		k := key[i%len(key)]
		orig := rot ^ k
		result[i] = orig
	}

	return string(result), nil
}
func MD5Hash(text string) string {
	hash := md5.Sum([]byte(text))
	return hex.EncodeToString(hash[:])
}
