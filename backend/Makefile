DB_URL=postgresql://root:secret@localhost:5432/commerce?sslmode=disable

pg:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:17.2-alpine3.20

start_pg:
	docker start postgres

stop_pg:
	docker stop postgres

connect_pg:
	docker exec -it postgres psql -d $(dbname)

create_db:
	docker exec -it postgres createdb --username=root --owner=root commerce

create_migrate:
	migrate create -ext sql -dir internal/db/migrations -seq $(name)

migrate_up:
	migrate -path internal/db/migrations -database "$(DB_URL)" -verbose up

migrate_down:
	migrate -path internal/db/migrations -database "$(DB_URL)" -verbose down

redis:
	docker run --name redis -p 6379:6379 -d redis redis-server --save 60 1 --loglevel warning

start_redis:
	docker start redis

stop_redis:
	docker stop redis

.PHONY: pg start_pg stop_pg connect_pg create_db migrate_up migrate_down redis start_redis stop_redis