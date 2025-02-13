#!/bin/sh

echo "run db migration"
/app/migrate -path /app/migrations -database "postgresql://root:secret@postgres:5432/commerce?sslmode=disable" -verbose up

echo "start app"
exec "$@"