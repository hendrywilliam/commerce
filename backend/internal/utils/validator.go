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

func DigestErrors(err validator.ValidationErrors) []ErrorDetail {
	out := make([]ErrorDetail, len(err))
	for i, fe := range err {
		out[i] = ErrorDetail{
			Param:   fe.Field(),
			Message: fe.Error(),
		}
	}
	return out
}
