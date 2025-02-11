package users

import (
	"context"
	"database/sql"
	"errors"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type UserServices interface {
	CreateUser(ctx context.Context, args CreateUserRequest) (queries.User, error)
	UpdateUser(ctx context.Context, args UpdateUserRequest) (queries.User, error)
	GetUser(ctx context.Context, args GetUserRequest) (queries.User, error)
}

type UserServicesImpl struct {
	Q *queries.Queries
}

func NewServices(q *queries.Queries) UserServices {
	return &UserServicesImpl{
		Q: q,
	}
}

func (us *UserServicesImpl) GetUser(ctx context.Context, args GetUserRequest) (queries.User, error) {
	user, err := us.Q.UserQueries.GetUser(ctx, args.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return queries.User{}, queries.ErrUserNotFound
		}
		return queries.User{}, err
	}
	return user, nil
}

func (us *UserServicesImpl) CreateUser(ctx context.Context, args CreateUserRequest) (queries.User, error) {
	hashedPassword, err := utils.HashPassword(args.Password)
	if err != nil {
		return queries.User{}, err
	}
	user, err := us.Q.UserQueries.CreateUser(ctx, queries.CreateUserArgs{
		Email:    args.Email,
		Password: hashedPassword,
	})
	if err != nil {
		return queries.User{}, err
	}
	return user, nil
}

func (us *UserServicesImpl) UpdateUser(ctx context.Context, args UpdateUserRequest) (queries.User, error) {
	userData := queries.UserUpdateArgs{
		ID: args.ID,
	}
	if args.Email != nil && *args.Email != "" {
		userData.Email = args.Email
	}
	if args.Password != nil && *args.Password != "" {
		hashed, err := utils.HashPassword(*args.Password)
		if err != nil {
			return queries.User{}, err
		}
		userData.Password = &hashed
	}
	if args.PrivateMetadata != nil {
		userData.PrivateMetadata = args.PrivateMetadata
	}
	user, err := us.Q.UserQueries.UpdateUser(ctx, userData)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return queries.User{}, queries.ErrUserNotFound
		}
		return queries.User{}, utils.ErrInternalError
	}
	return user, nil
}
