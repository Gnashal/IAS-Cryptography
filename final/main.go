package main

import (
	"ias/utils"
	"ias/web"
	"net/http"
)

func main() {
	log, err := utils.NewLogger()
	if err != nil {
		panic(err)
	}
	log.Info("TCP Server Router initialized.")

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		web.WebSocketHandler(w, r, log)
	})
	log.Info("TCP Server Router starting....")
	log.Info("Frontend control API listening on :8080")
	http.ListenAndServe("0.0.0.0:8080", nil)
}
