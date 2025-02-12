FROM golang:1.23.4-alpine3.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o main main.go
RUN apk add curl
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.14.1/migrate.linux-amd64.tar.gz | tar xvz

FROM alpine:3.21.0
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/start.sh .
RUN chmod +x /app/start.sh
COPY --from=builder /app/.env .
COPY --from=builder /app/migrate.linux-amd64 ./migrate
COPY --from=builder /app/internal/db/migrations ./migrations
EXPOSE 8080
CMD ["/app/main"]