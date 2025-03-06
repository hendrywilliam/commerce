package queries

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"
)

var (
	ErrUserNotFound     = errors.New("user is not registered")
	ErrUserAlreadyExist = errors.New("user is already exist")
)

type User struct {
	ID                 uint64      `json:"id,omitempty"`
	Email              string      `json:"email,omitempty"`
	Password           string      `json:"password,omitempty"`
	Sub                string      `json:"sub,omitempty"`
	ImageURL           string      `json:"image_url,omitempty"`
	FullName           string      `json:"fullname,omitempty"`
	AuthenticationType string      `json:"authentication_type,omitempty"`
	PrivateMetadata    interface{} `json:"private_metadata,omitempty"`
	CreatedAt          time.Time   `json:"created_at,omitempty"`
	UpdatedAt          time.Time   `json:"updated_at,omitempty"`
}

// Do not expose sensitive details to logger.
func (u User) LogValue() slog.Value {
	return slog.GroupValue(
		slog.Uint64("id", u.ID),
		slog.String("sub", u.Sub),
		slog.Time("created_at", u.CreatedAt),
		slog.Time("updated_at", u.UpdatedAt),
	)
}

type UserQueriesImpl struct {
	DB DbTx
}

func (uq *UserQueriesImpl) GetUser(ctx context.Context, email string) (User, error) {
	row := uq.DB.QueryRow(ctx, `
		SELECT
			id,
			email,
			fullname,
			image_url,
			authentication_type,
			private_metadata,
			created_at
		FROM
			users
		WHERE
			email = $1;
	`, email)
	var u User
	err := row.Scan(
		&u.ID,
		&u.Email,
		&u.FullName,
		&u.ImageURL,
		&u.PrivateMetadata,
		&u.CreatedAt,
	)
	return u, err
}

type CreateUserArgs struct {
	Email              string
	Sub                string
	ImageURL           string
	Password           string
	Name               string
	AuthenticationType string
}

// Full query:
//
// INSERT INTO users (columnSub, columnEmail)
// 	SELECT newSub, newEmail
//  -- 0 row -> true
// 	WHERE NOT EXISTS (
//		-- subquery for returning a row if there is a row exist with sub = newSub.
// 		SELECT 1 FROM users WHERE sub = newSub
// 	)
// RETURNING *
//
// Source: https://www.postgresql.org/message-id/3bf1920f$0$201$e4fe514c@newszilla.xs4all.nl

func (uq *UserQueriesImpl) CreateUser(ctx context.Context, args CreateUserArgs) (User, error) {
	var paramsPlaceholder []string
	var insertColumns []string
	var arguments []interface{}
	paramIndex := 1
	if args.Email != "" {
		insertColumns = append(insertColumns, "email")
		paramsPlaceholder = append(paramsPlaceholder, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.Email)
		paramIndex++
	}
	if args.Password != "" {
		insertColumns = append(insertColumns, "password")
		paramsPlaceholder = append(paramsPlaceholder, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.Password)
		paramIndex++
	}
	if args.Sub != "" {
		insertColumns = append(insertColumns, "sub")
		paramsPlaceholder = append(paramsPlaceholder, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.Sub)
		paramIndex++
	}
	if args.ImageURL != "" {
		insertColumns = append(insertColumns, "image_url")
		paramsPlaceholder = append(paramsPlaceholder, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.ImageURL)
		paramIndex++
	}
	if args.Name != "" {
		insertColumns = append(insertColumns, "fullname")
		paramsPlaceholder = append(paramsPlaceholder, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.Name)
		paramIndex++
	}
	if args.AuthenticationType != "" {
		insertColumns = append(insertColumns, "authentication_type")
		paramsPlaceholder = append(paramsPlaceholder, fmt.Sprintf("$%v", paramIndex))
		arguments = append(arguments, args.AuthenticationType)
		paramIndex++
	}
	if len(insertColumns) == 0 {
		return User{}, fmt.Errorf("no data to insert")
	}
	var whereConditions []string
	if args.Sub != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("sub = $%d", paramIndex))
		arguments = append(arguments, args.Sub)
		paramIndex++
	}
	if args.Email != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("email = $%d", paramIndex))
		arguments = append(arguments, args.Email)
		paramIndex++
	}
	whereClause := ""
	if len(whereConditions) > 0 {
		whereClause = "WHERE NOT EXISTS (SELECT 1 FROM users WHERE " + strings.Join(whereConditions, " OR ") + ")"
	}
	combinedColumns := strings.Join(insertColumns, ", ")
	combinedPlaceholders := strings.Join(paramsPlaceholder, ", ")
	cteTable := fmt.Sprintf(`
		INSERT INTO users (%s)
		SELECT %s
		%s
		RETURNING id, email`, combinedColumns, combinedPlaceholders, whereClause)
	finalQuery := fmt.Sprintf(`
		WITH new_user AS (
			%v
		)
		SELECT * FROM new_user
		UNION ALL
		SELECT id, email FROM users WHERE %s
		LIMIT 1;
	`, cteTable, strings.Join(whereConditions, " OR "))
	slog.Info(finalQuery)
	row := uq.DB.QueryRow(ctx,
		finalQuery,
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
		return User{}, errors.New("no fields were updated")
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
