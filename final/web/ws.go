package web

import (
	"encoding/json"
	"fmt"
	"ias/crypt"
	"ias/utils"
	"net"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Session struct {
	host   *websocket.Conn
	joiner *websocket.Conn
	hostIP string
}

var sessions = map[string]*Session{}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins (for dev)
}

var (
	hostRegistry   = make(map[string]*websocket.Conn)
	hostRegistryMu sync.Mutex
)

func extractIP(addr string) string {
	host, _, err := net.SplitHostPort(addr)
	if err != nil {
		return addr // fallback
	}
	return host
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request, log *utils.Logger, c *crypt.Crypt) {
	conn, err := upgrader.Upgrade(w, r, nil)
	var hostIP string
	if err != nil {
		log.Error("WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	pubKey, err := c.ExportPublicKeyPEM()
	if err != nil {
		log.Error("export pubkey: %v", err)
		return
	}
	msg := map[string]string{
		"type":      "public_key",
		"publicKey": pubKey,
	}
	conn.WriteJSON(msg)

	fmt.Println("Frontend WebSocket connected")

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Info("WebSocket client disconnected: %v", err)
			break
		}

		var incoming map[string]any
		err = json.Unmarshal(msg, &incoming)
		if err != nil {
			log.Error("Invalid JSON: %v", err)
			continue
		}
		fmt.Println("Incoming message:", incoming["type"])
		switch incoming["type"] {
		case "host_announce":
			otp := incoming["otp"].(string)
			log.Info("Host announced with OTP: %s", otp)
			hostIP := extractIP(r.RemoteAddr)
			sessions[otp] = &Session{
				host:   conn,
				hostIP: hostIP,
			}
			hostRegistryMu.Lock()
			hostRegistry[otp] = conn
			hostRegistryMu.Unlock()

			log.Info("Registered new host with OTP: %s", otp)

			resp := map[string]any{
				"type":    "host_announce_ack",
				"success": true,
				"otp":     otp,
				"ip":      hostIP,
			}
			conn.WriteJSON(resp)

		case "join_request":
			otp := incoming["otp"].(string)
			joinerIP := extractIP(r.RemoteAddr)
			log.Info("Connecting to host with OTP: %s", otp)

			hostRegistryMu.Lock()
			if s, ok := sessions[otp]; ok {
				s.joiner = conn

				// Notify both sides
				s.host.WriteJSON(map[string]any{
					"type":      "peer_connected",
					"joiner_ip": extractIP(r.RemoteAddr),
				})
				s.joiner.WriteJSON(map[string]any{
					"type":    "peer_connected",
					"host_ip": s.hostIP,
				})
			}
			hostRegistryMu.Unlock()

			log.Info("Peer: %s and Host: %s CONNECTED", joinerIP, hostIP)

			resp := map[string]any{
				"type":    "join_request_ack",
				"success": true,
				"otp":     otp,
				"ip":      joinerIP,
			}
			conn.WriteJSON(resp)

		case "chat_message":
			otp := incoming["otp"].(string)
			payload, err := c.DickTwistDecrypt(incoming["payload"].(string), otp)
			if err != nil {
				log.Error("Failed to decrypt message: %v", err)
				continue
			}
			log.Info("Payload confirmed: %s", otp)
			if s, ok := sessions[otp]; ok {
				if conn == s.host && s.joiner != nil {
					s.joiner.WriteJSON(map[string]any{"type": "message", "payload": payload})
					log.Debug("Payload sent")
				} else if conn == s.joiner && s.host != nil {
					s.host.WriteJSON(map[string]any{"type": "message", "payload": payload})
					log.Debug("Payload sent")
				}
			}
		case "file":
			otp := incoming["otp"].(string)
			filename := incoming["filename"].(string)
			encryptedPayload := incoming["content"].(string)
			encrypted := incoming["encrypted"].(bool)

			// Forward file to other peer
			if s, ok := sessions[otp]; ok {
				forward := map[string]any{
					"type":      "file_received",
					"filename":  filename,
					"payload":   encryptedPayload,
					"encrypted": encrypted,
				}
				if conn == s.host && s.joiner != nil {
					s.joiner.WriteJSON(forward)
				} else if conn == s.joiner && s.host != nil {
					s.host.WriteJSON(forward)
				}
				log.Info("Encrypted file forwarded: %s", filename)
			}

		default:
			log.Info("Unknown WS message type: %v", incoming["type"])
		}
	}
}
