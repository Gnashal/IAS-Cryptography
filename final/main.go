package main

import (
	"bufio"
	"fmt"
	"ias/crypt"
	"os"
	"strings"
)

func main() {
	var reader = bufio.NewReader(os.Stdin)
	fmt.Print("Enter your plaintext: ")
	plaintext, _ := reader.ReadString('\n')
	plaintext = strings.TrimSpace(plaintext)
	fmt.Print("Enter your key string: ")
	key, _ := reader.ReadString('\n')
	key = strings.TrimSpace(key)
	fmt.Println("Hash of plaintext: " + crypt.MD5Hash(plaintext))
	encrypted, err := crypt.DickTwistEncrypt(plaintext, key)
	if err != nil {
		fmt.Println("Error: ", err)
	}
	decrypted, err := crypt.DickTwistDecrypt(encrypted, key)
	if err != nil {
		fmt.Println("Error: ", err)
	}
	fmt.Println("Encrypted: " + encrypted)
	fmt.Println("Hash of decrypted text: " + crypt.MD5Hash(decrypted))
	fmt.Println("Decrypted: " + decrypted)

}
