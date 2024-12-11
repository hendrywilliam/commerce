package db

import (
	"context"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func OpenPostgres(ctx context.Context) (*pgxpool.Pool, error) {
	db := os.Getenv("DATABASE_URL")
	if len(db) == 0 {
		panic("provide database_url")
	}
	conn, err := pgxpool.New(ctx, db)
	if err != nil {
		return nil, err
	}
	err = conn.Ping(ctx)
	if err != nil {
		return nil, err
	}
	slog.Info("db connection established")
	_, err = conn.Exec(ctx, "SET timezone='Asia/Jakarta'")
	if err != nil {
		return nil, err
	}
	slog.Info("db timezone set to Asia/Jakarta")
	return conn, nil
}
