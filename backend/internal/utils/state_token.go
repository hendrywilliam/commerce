package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
)

func GenerateAntiForgeryToken() string {
	randomBytes := make([]byte, 1024)
	rand.Read(randomBytes)
	state := sha256.Sum256(randomBytes)
	return hex.EncodeToString(state[:])
}