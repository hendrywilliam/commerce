package utils

import (
	"github.com/alexedwards/argon2id"
)

func HashPassword(passphrase string) (string, error) {
	hash, err := argon2id.CreateHash(passphrase, argon2id.DefaultParams)
	if err != nil {
		return "", err
	}
	return hash, nil
}

func ComparePassword(passphrase, hash string) (bool, error) {
	_, err := argon2id.ComparePasswordAndHash(passphrase, hash)
	if err != nil {
		return false, err
	}
	return true, nil
}
