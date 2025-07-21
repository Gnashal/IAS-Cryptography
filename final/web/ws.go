package web

import (
	"encoding/json"
	"fmt"
	"ias/server"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins (for dev)
}

var (
	hostRegistry   = make(map[string]*websocket.Conn)
	hostRegistryMu sync.Mutex
)

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	fmt.Println("Frontend WebSocket connected")

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("WebSocket client disconnected:", err)
			break
		}

		var incoming map[string]interface{}
		err = json.Unmarshal(msg, &incoming)
		if err != nil {
			log.Println("Invalid JSON:", err)
			continue
		}
		fmt.Println("Incoming message:", incoming["type"])
		switch incoming["type"] {
		case "host_announce":
			otp := incoming["otp"].(string)
			ip := strings.Split(r.RemoteAddr, ":")[0]
			addr := ip + ":3000"
			hostRegistryMu.Lock()
			hostRegistry[otp] = conn
			hostRegistryMu.Unlock()
			go server.StartHostTCP(addr)
			fmt.Println("Registered new host with OTP:", otp)

		case "message":
			fmt.Println("Received message from frontend:", incoming["data"])

		// Add more types here as needed

		default:
			log.Println("Unknown WS message type:", incoming["type"])
		}
	}
}
