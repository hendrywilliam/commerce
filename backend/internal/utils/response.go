package utils

import "github.com/gofiber/fiber/v3"

type ResponseInfo struct {
	Message string `json:"message"`
	Reason  string `json:"reason,omitempty"`
}

type ErrorDetail struct {
	Message string `json:"message"`
	Param   string `json:"param,omitempty"`
}

func SuccessResponse(info ResponseInfo, data interface{}) fiber.Map {
	return fiber.Map{
		"info": info,
		"data": data,
	}
}

func FailedResponse(info ResponseInfo, errorDetails []ErrorDetail) fiber.Map {
	return fiber.Map{
		"info":   info,
		"errors": errorDetails,
	}
}
