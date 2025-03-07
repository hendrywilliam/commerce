package utils

import (
	"errors"
)

var (
	ErrInternalError = errors.New("internal server error")
	ErrTooManyRequest = errors.New("too many request. please try again later")
	ErrValidationFailed = errors.New("failed to validate")
)
