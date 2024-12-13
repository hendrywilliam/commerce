package utils

import (
	"github.com/gofiber/fiber/v3"
)

type InfoDetails struct {
	Message string `json:"message"`
	Reason  string `json:"reason,omitempty"`
}

type ResponseDetails struct {
	Info   InfoDetails `json:"info"`
	Data   interface{} `json:"data,omitempty"`
	Errors interface{} `json:"error,omitempty"`
}

func SuccessResponse(details ResponseDetails) fiber.Map {
	return fiber.Map{
		"info": details.Info,
		"data": details.Data,
	}
}

func ErrorResponse(details ResponseDetails) fiber.Map {
	return fiber.Map{
		"info":   details.Info,
		"errors": details.Errors,
	}
}
