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
	Sub             string      `json:"sub,omitempty"`
	ImageURL        string      `json:"image_url,omitempty"`
	PrivateMetadata interface{} `json:"private_metadata,omitempty"`
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
	Sub      string
	ImageURL string
	Password string
}

func (uq *UserQueriesImpl) CreateUser(ctx context.Context, args CreateUserArgs) (User, error) {
	baseSql := &bytes.Buffer{}
	var params []string
	var insertFields []string
	var arguments []interface{}
	baseSql.WriteString("INSERT INTO users ")
	paramIndex := 1
	if args.Email != "" {
		insertFields = append(insertFields, fmt.Sprintf("email"))
		params = append(params, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.Email)
		paramIndex++
	}
	if args.Password != "" {
		insertFields = append(insertFields, fmt.Sprintf("password"))
		params = append(params, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.Password)
		paramIndex++
	}
	if args.Sub != "" {
		insertFields = append(insertFields, fmt.Sprintf("sub"))
		params = append(params, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.Sub)
		paramIndex++
	}
	if args.ImageURL != "" {
		insertFields = append(insertFields, fmt.Sprintf("image_url"))
		params = append(params, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.ImageURL)
		paramIndex++
	}
	baseSql.WriteString("(")
	joinedFields := strings.Join(insertFields, ", ")
	baseSql.WriteString(joinedFields)
	baseSql.WriteString(")")
	baseSql.WriteString(" VALUES ")
	baseSql.WriteString("(")
	joinedSqlParams := strings.Join(params, ", ")
	baseSql.WriteString(joinedSqlParams)
	baseSql.WriteString(")")
	baseSql.WriteString(" ON CONFLICT (email) DO NOTHING RETURNING id, email;")
	row := uq.DB.QueryRow(ctx,
		baseSql.String(),
		arguments...,
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
