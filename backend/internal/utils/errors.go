package utils

import (
	"errors"
)

var (
	ErrInternalError = errors.New("Internal server error.")
	ErrTooManyRequest = errors.New("Too many request. Please try again later.")
	ErrValidationFailed = errors.New("Failed to validate.")
)
