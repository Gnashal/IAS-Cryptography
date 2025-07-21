package server

import (
	"encoding/json"
	"io"
	"net/http"
)

func HandleHost(w http.ResponseWriter, r *http.Request) {
	go StartHostTCP(":6969") // Spawns a TCP server to wait for peer
	w.Write([]byte("Hosting started..."))
}

func HandleJoin(w http.ResponseWriter, r *http.Request) {
	// Parse body to get host IP and OTP
	body, _ := io.ReadAll(r.Body)
	var payload map[string]string
	json.Unmarshal(body, &payload)

	go ConnectToHost(payload["ip"], payload["otp"])
	w.Write([]byte("Trying to join host..."))
}
