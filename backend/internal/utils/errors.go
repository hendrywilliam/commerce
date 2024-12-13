package utils

import (
	"errors"

	"github.com/go-playground/validator/v10"
)

var (
	ErrInternalError = errors.New("internal server error")
)

type ValidationError struct {
	Message string `json:"message"`
	Param   string `json:"param,omitempty"`
}

func DigestValidationErrors(err validator.ValidationErrors) []ValidationError {
	out := make([]ValidationError, len(err))
	for i, fe := range err {
		out[i] = ValidationError{
			Param:   fe.Field(),
			Message: fe.Error(),
		}
	}
	return out
}
