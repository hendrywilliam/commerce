package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/hendrywilliam/commerce/internal/db"
	"github.com/hendrywilliam/commerce/internal/server"
	"github.com/joho/godotenv"
	"golang.org/x/sync/errgroup"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
	rootCtx, stop := signal.NotifyContext(context.Background(), []os.Signal{os.Interrupt, syscall.SIGTERM, syscall.SIGINT}...)
	defer stop()
	g, ctx := errgroup.WithContext(rootCtx)
	conn, err := db.OpenPostgres(ctx)
	if err != nil {
		log.Fatal(err)
	}
	g.Go(func() error {
		return server.ServeHTTP(ctx, conn)
	})
	if err := g.Wait(); err == nil {
		conn.Close()
		slog.Info("database closed.")
		slog.Info("shutdown")
	}
}
