package server

import (
	"fmt"
	"net"
)

func StartTCPServerRouter() {
	// Optional router logic here
	fmt.Println("TCP Server Router initialized.")
}

func StartHostTCP(addr string) {
	fmt.Println("Starting host TCP server for IP:", addr)
	listener, err := net.Listen("tcp", addr)
	if err != nil {
		fmt.Println("Failed to host:", err)
		return
	}
	defer listener.Close()

	fmt.Println("Hosting on", addr)

	conn, err := listener.Accept()
	if err != nil {
		fmt.Println("Failed to accept:", err)
		return
	}

	// Example: echo back
	buffer := make([]byte, 1024)
	n, _ := conn.Read(buffer)
	fmt.Println("Received:", string(buffer[:n]))

	conn.Write([]byte("Hello back!"))
	conn.Close()
}

func ConnectToHost(ip, otp string) {
	conn, err := net.Dial("tcp", ip+":6969")
	if err != nil {
		fmt.Println("Failed to connect:", err)
		return
	}
	fmt.Println("Connected to host", ip)

	// Example: send OTP
	conn.Write([]byte(otp))
	buffer := make([]byte, 1024)
	n, _ := conn.Read(buffer)
	fmt.Println("Reply from host:", string(buffer[:n]))

	conn.Close()
}
