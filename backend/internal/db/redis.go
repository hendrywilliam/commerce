package db

import (
	"context"
	"log/slog"

	"github.com/redis/go-redis/v9"
)

func OpenRedis(ctx context.Context, address string, password string) (*redis.Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr: address,
		Password: "",
		DB: 0,
	})
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return nil, err
	}
	slog.Info("redis connection established.")
	return rdb, nil
}
