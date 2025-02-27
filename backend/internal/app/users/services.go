package users

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"

	"github.com/hendrywilliam/commerce/internal/queries"
	"github.com/hendrywilliam/commerce/internal/utils"
)

type UserServices interface {
	UpdateUser(ctx context.Context, args UpdateUserRequest) (queries.User, error)
	GetUser(ctx context.Context, args GetUserRequest) (queries.User, error)
}

type UserServicesImpl struct {
	Q   *queries.Queries
	Log *slog.Logger
}

func NewServices(q *queries.Queries, log *slog.Logger) UserServices {
	return &UserServicesImpl{
		Q:   q,
		Log: log,
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
