package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/hendrywilliam/commerce/internal/db"
	"github.com/hendrywilliam/commerce/internal/servers"
	"github.com/hendrywilliam/commerce/internal/utils"
	"golang.org/x/sync/errgroup"
)

func main() {
	config := utils.LoadConfiguration()
	var (
		handler    slog.Handler
		loggerOpts = &slog.HandlerOptions{
			AddSource: true,
			Level:     slog.LevelDebug,
		}
	)
	if config.AppEnv != "production" {
		// Human readable logger during development mode.
		handler = slog.NewTextHandler(os.Stdout, loggerOpts)
	} else {
		handler = slog.NewJSONHandler(os.Stdout, loggerOpts)
	}
	var logger *slog.Logger = slog.New(handler)
	slog.SetDefault(logger)
	rootCtx, stop := signal.NotifyContext(context.Background(), []os.Signal{os.Interrupt, syscall.SIGTERM, syscall.SIGINT}...)
	defer stop()
	g, ctx := errgroup.WithContext(rootCtx)
	pgConn, err := db.OpenPostgres(ctx, config.DatabaseURL)
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	redisClient, err := db.OpenRedis(ctx, config.RedisURL, "")
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	g.Go(func() error {
		return servers.ServeHTTP(ctx, pgConn, logger, redisClient, config)
	})
	if err := g.Wait(); err == nil {
		pgConn.Close()
		slog.Info("database connection closed.")
		redisClient.Close()
		slog.Info("redis connection closed.")
		slog.Info("shutdown")
	}
}
