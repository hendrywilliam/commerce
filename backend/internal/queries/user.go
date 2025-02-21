package queries

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"strings"
	"time"
)

var (
	ErrUserNotFound     = errors.New("User is not registered.")
	ErrUserAlreadyExist = errors.New("User is already exist.")
)

type User struct {
	ID              uint64      `json:"id,omitempty"`
	Email           string      `json:"email,omitempty"`
	Password        string      `json:"password,omitempty"`
	PrivateMetadata interface{} `json:"private_metadata,omitempty"`
	PublicMetadata  interface{} `json:"public_metadata,omitempty"`
	CreatedAt       *time.Time  `json:"created_at,omitempty"`
	UpdatedAt       *time.Time  `json:"updated_at,omitempty"`
}

type UserQueriesImpl struct {
	DB DbTx
}

func (uq *UserQueriesImpl) GetUser(ctx context.Context, email string) (User, error) {
	row := uq.DB.QueryRow(ctx, `
		SELECT
			id,
			email
		FROM
			users
		WHERE
			email = $1;
	`, email)
	var u User
	err := row.Scan(
		&u.ID,
		&u.Email,
	)
	return u, err
}

type CreateUserArgs struct {
	Email    string
	Password string
}

func (uq *UserQueriesImpl) CreateUser(ctx context.Context, args CreateUserArgs) (User, error) {
	row := uq.DB.QueryRow(ctx, `
		INSERT INTO users (
			email,
			password
		) VALUES (
			$1,
			$2
		) ON CONFLICT (email) DO NOTHING
		RETURNING id, email;
	`,
		args.Email,
		args.Password,
	)
	var u User
	err := row.Scan(
		&u.ID,
		&u.Email,
	)
	return u, err
}

type UserUpdateArgs struct {
	ID              uint64
	Email           *string
	Password        *string
	PrivateMetadata interface{}
}

func (uq *UserQueriesImpl) UpdateUser(ctx context.Context, args UserUpdateArgs) (User, error) {
	// using bytes.Buffer is slower than strings.Builder due to locking mechanism
	// but it is safe for concurrent use.
	baseSql := &bytes.Buffer{}
	var params []interface{}
	baseSql.WriteString("UPDATE users SET ")
	var setClauses []string
	paramIndex := 1
	if args.Email != nil && *args.Email != "" {
		setClauses = append(setClauses, fmt.Sprintf("email = $%d", paramIndex))
		params = append(params, *args.Email)
		paramIndex++
	}
	if args.Password != nil && *args.Password != "" {
		setClauses = append(setClauses, fmt.Sprintf("password = $%d", paramIndex))
		params = append(params, *args.Password)
		paramIndex++
	}
	if args.PrivateMetadata != nil {
		setClauses = append(setClauses, fmt.Sprintf("private_metadata = $%d", paramIndex))
		params = append(params, args.PrivateMetadata)
		paramIndex++
	}
	if len(setClauses) == 0 {
		return User{}, errors.New("no fields were updated.")
	}
	baseSql.WriteString(strings.Join(setClauses, ", "))
	baseSql.WriteString(fmt.Sprintf(" WHERE id = $%d RETURNING email;", paramIndex))
	params = append(params, args.ID)
	row := uq.DB.QueryRow(ctx, baseSql.String(), params...)
	var u User
	err := row.Scan(
		&u.Email,
	)
	return u, err
}
