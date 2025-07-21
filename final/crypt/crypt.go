package crypt

import (
	"crypto/md5"
	"crypto/rand"
	"crypto/rsa"

	//"crypto/x509"
	"encoding/base64"
	"encoding/hex"

	//"encoding/pem"
	"errors"
	"strings"
	"unicode"
)

var privateKey *rsa.PrivateKey
var publicKey *rsa.PublicKey

func init() {
	var err error
	privateKey, err = rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic("RSA key generation failed: " + err.Error())
	}
	publicKey = &privateKey.PublicKey
}

func rotateLeft(b byte) byte {
	return (b << 1) | (b >> 7)
}
func rotateRight(b byte) byte {
	return (b >> 1) | (b << 7)
}

func transposeBytes(data []byte) []byte {
	swapped := make([]byte, len(data))
	copy(swapped, data)
	for i := 0; i < len(swapped)-1; i += 2 {
		swapped[i], swapped[i+1] = swapped[i+1], swapped[i]
	}
	return swapped
}
func reverseTransposeBytes(data []byte) []byte {
	return transposeBytes(data)
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

	transposed := transposeBytes(result)

	var b strings.Builder
	for _, r := range base64.StdEncoding.EncodeToString(transposed) {
		if unicode.IsUpper(r) {
			b.WriteRune('Z' - (r - 'A'))
		} else if unicode.IsLower(r) {
			b.WriteRune('z' - (r - 'a'))
		} else {
			b.WriteRune(r)
		}
	}


	encryptedRSA, err := rsa.EncryptPKCS1v15(rand.Reader, publicKey, []byte(b.String()))
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(encryptedRSA), nil
}

func DickTwistDecrypt(ciphertext, key string) (string, error) {
	if len(key) == 0 {
		return "", errors.New("key string must not be empty")
	}


	decodedRSA, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", errors.New("RSA ciphertext base64 decode failed")
	}
	decryptedRSA, err := rsa.DecryptPKCS1v15(rand.Reader, privateKey, decodedRSA)
	if err != nil {
		return "", errors.New("RSA decryption failed")
	}

	var reversed strings.Builder
	for _, r := range string(decryptedRSA) {
		if unicode.IsUpper(r) {
			reversed.WriteRune('Z' - (r - 'A'))
		} else if unicode.IsLower(r) {
			reversed.WriteRune('z' - (r - 'a'))
		} else {
			reversed.WriteRune(r)
		}
	}

	raw, err := base64.StdEncoding.DecodeString(reversed.String())
	if err != nil {
		return "", errors.New("failed to decode base64 ciphertext")
	}

	detransposed := reverseTransposeBytes(raw)
	result := make([]byte, len(detransposed))
	for i, c := range detransposed {
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
