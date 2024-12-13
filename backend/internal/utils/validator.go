package utils

import (
	"github.com/go-playground/validator/v10"
)

type StructValidator struct {
	Validator *validator.Validate
}

func (sv *StructValidator) Validate(out any) error {
	return sv.Validator.Struct(out)
}
