package main

import (
	"context"
	"log"
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
	rootCtx, stop := signal.NotifyContext(context.Background(), []os.Signal{os.Interrupt, syscall.SIGTERM, syscall.SIGINT}...)
	defer stop()
	g, ctx := errgroup.WithContext(rootCtx)
	pgConn, err := db.OpenPostgres(ctx, config.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	g.Go(func() error {
		return servers.ServeHTTP(ctx, pgConn, config)
	})
	if err := g.Wait(); err == nil {
		pgConn.Close()
		slog.Info("database closed.")
		slog.Info("shutdown")
	}
}
