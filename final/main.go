package main

import (
	"fmt"
	"ias/server"
	"ias/web"
	"net/http"
)

func main() {
	go server.StartTCPServerRouter()

	http.HandleFunc("/ws", web.WebSocketHandler)

	fmt.Println("Frontend control API listening on :8080")
	http.ListenAndServe(":8080", nil)
}
