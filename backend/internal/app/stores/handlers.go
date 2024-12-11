package stores

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type StoreHandlers interface {
	CreateStore(c fiber.Ctx) error
	DeleteStore(c fiber.Ctx) error
	UpdateStore(c fiber.Ctx) error
}

type StoreHandlersImpl struct {
	Services StoreServices
}

func NewHandlers(services StoreServices) StoreHandlers {
	return &StoreHandlersImpl{
		Services: services,
	}
}

func (sh *StoreHandlersImpl) CreateStore(c fiber.Ctx) error {
	var req CreateStoreRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
				Message: "validation failed",
			}, err))
		}
		return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "internal server error",
		}, nil))
	}
	store, err := sh.Services.CreateStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "failed to create a new store",
			Reason:  err.Error(),
		}, nil))
	}
	return c.Status(http.StatusCreated).JSON(utils.SuccessResponse(utils.ResponseInfo{
		Message: "store created",
	}, CreateStoreResponse{
		ID:   store.ID,
		Name: store.Name,
	}))
}

func (sh *StoreHandlersImpl) DeleteStore(c fiber.Ctx) error {
	var req DeleteStoreRequest
	if err := c.Bind().Query(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
				Message: "validation failed",
			}, err))
		}
		log.Info(err)
		return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "internal server error",
		}, nil))
	}
	storeName, err := sh.Services.DeleteStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "failed to delete a store",
			Reason:  err.Error(),
		}, nil))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseInfo{
		Message: "store deleted",
	}, DeleteStoreResponse{
		Name: storeName,
	}))
}

func (sh *StoreHandlersImpl) UpdateStore(c fiber.Ctx) error {
	var req UpdateStoreRequest
	if err := c.Bind().Body(&req); err != nil {
		if e, ok := err.(validator.ValidationErrors); ok {
			err := utils.DigestErrors(e)
			return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
				Message: "validation failed",
			}, err))
		}
		return c.Status(http.StatusBadRequest).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "internal server error",
		}, nil))
	}
	storeName, err := sh.Services.UpdateStore(c.Context(), req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.FailedResponse(utils.ResponseInfo{
			Message: "failed to update a store",
			Reason:  err.Error(),
		}, nil))
	}
	return c.Status(http.StatusOK).JSON(utils.SuccessResponse(utils.ResponseInfo{
		Message: "store updated",
	}, UpdateStoreResponse{
		Name: storeName,
	}))
}
