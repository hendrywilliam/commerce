package utils

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type StructValidator struct {
	Validator *validator.Validate
}

func (sv *StructValidator) Validate(out any) error {
	return sv.Validator.Struct(out)
}

func DigestValErrors(err validator.ValidationErrors) []string {
	var messages []string
	for _, err := range err {
		var message string
		switch err.Tag() {
		case "required":
			message = fmt.Sprintf("Field '%s' cannot be blank.", err.Field())
		case "email":
			message = fmt.Sprintf("Field '%s' must be a valid email address.", err.Field())
		case "len":
			message = fmt.Sprintf("Field '%s' must be exactly %v characters long.", err.Field(), err.Param())
		default:
			message = fmt.Sprintf("Field '%s': '%v' must satisfy '%s' '%v' criteria.", err.Field(), err.Value(), err.Tag(), err.Param())
		}
		messages = append(messages, message)
	}
	return messages
}
