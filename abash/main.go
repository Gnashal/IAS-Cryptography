package main

import (
	"bufio"
	"fmt"
	"ias/crypt"
	"os"
)

func main() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Enter your name: ")
	input, _ := reader.ReadString('\n')
	fmt.Printf("Your name: %s\n", input)
	fmt.Print("Your name with abash: ")
	encryptedIn := crypt.EncryptAbash(input)
	fmt.Print(encryptedIn)
	fmt.Print("Decrypted: ")
	fmt.Print(crypt.EncryptAbash(encryptedIn))

}
