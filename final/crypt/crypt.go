package crypt

import (
	"crypto/md5"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"fmt"

	//"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"

	//"encoding/pem"
	"errors"
	"strings"
	"unicode"
)

type Crypt struct {
	PrivateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
}
type ChatMessage struct {
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

func NewCrypt() (*Crypt, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}
	return &Crypt{
		PrivateKey: privateKey,
		PublicKey:  &privateKey.PublicKey,
	}, nil
}
func (c *Crypt) rotateLeft(b byte) byte {
	return (b << 1) | (b >> 7)
}
func (c *Crypt) rotateRight(b byte) byte {
	return (b >> 1) | (b << 7)
}

func (c *Crypt) transposeBytes(data []byte) []byte {
	swapped := make([]byte, len(data))
	copy(swapped, data)
	for i := 0; i < len(swapped)-1; i += 2 {
		swapped[i], swapped[i+1] = swapped[i+1], swapped[i]
	}
	return swapped
}
func (c *Crypt) reverseTransposeBytes(data []byte) []byte {
	return c.transposeBytes(data)
}

func (c *Crypt) DickTwistEncrypt(plaintext, key string) (string, error) {
	if len(key) == 0 {
		return "", errors.New("key string must not be empty")
	}
	result := make([]byte, len(plaintext))
	for i, r := range []byte(plaintext) {
		k := key[i%len(key)]
		x := r ^ k
		twist := c.rotateLeft(x)
		final := byte((int(twist) + i*3) % 256)
		result[i] = final
	}

	transposed := c.transposeBytes(result)

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

	encryptedRSA, err := rsa.EncryptPKCS1v15(rand.Reader, c.PublicKey, []byte(b.String()))
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(encryptedRSA), nil
}

func (c *Crypt) DickTwistDecrypt(ciphertextB64, otpKey string) (*ChatMessage, error) {
	if len(otpKey) == 0 {
		return nil, errors.New("OTP key must not be empty")
	}

	decodedRSA, err := base64.StdEncoding.DecodeString(ciphertextB64)
	if err != nil {
		return nil, fmt.Errorf("RSA base64 decode failed: %w", err)
	}

	decryptedRSA, err := rsa.DecryptPKCS1v15(rand.Reader, c.PrivateKey, decodedRSA)
	if err != nil {
		return nil, fmt.Errorf("RSA decryption failed: %w", err)
	}

	// Step 3: Reverse alphabet mapping
	var reversed strings.Builder
	for _, r := range string(decryptedRSA) {
		switch {
		case unicode.IsUpper(r):
			reversed.WriteRune('Z' - (r - 'A'))
		case unicode.IsLower(r):
			reversed.WriteRune('z' - (r - 'a'))
		default:
			reversed.WriteRune(r)
		}
	}
	raw, err := base64.StdEncoding.DecodeString(reversed.String())
	if err != nil {
		return nil, fmt.Errorf("inner base64 decode failed: %w", err)
	}
	detransposed := c.reverseTransposeBytes(raw)
	result := make([]byte, len(detransposed))
	keyBytes := []byte(otpKey)
	for i, r := range detransposed {
		untwist := (int(r) - i*3 + 256) % 256
		rot := c.rotateRight(byte(untwist))
		k := keyBytes[i%len(keyBytes)]
		orig := rot ^ k
		result[i] = orig
	}

	var msg ChatMessage
	if err := json.Unmarshal(result, &msg); err != nil {
		return nil, fmt.Errorf("failed to parse JSON from decrypted data: %w", err)
	}

	return &msg, nil
}
func MD5Hash(text string) string {
	hash := md5.Sum([]byte(text))
	return hex.EncodeToString(hash[:])
}

func (c *Crypt) ExportPublicKeyPEM() (string, error) {
	pubASN1, err := x509.MarshalPKIXPublicKey(c.PublicKey)
	if err != nil {
		return "", err
	}
	pubPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: pubASN1,
	})
	return string(pubPEM), nil
}
