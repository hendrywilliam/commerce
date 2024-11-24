DB_URL=postgresql://root:secret@localhost:5432/commerce?sslmode=disable

# local dev
pg:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:17.1-alpine3.20

start_pg:
	docker start postgres

stop_pg:
	docker stop postgres

create_db:
	docker exec -it postgres createdb --username=root --owner=root commerce

drop_db:
	docker exec -it postgres dropdb commerce

redis:
	docker run --name redis -p 6379:6379 -d redis:8.0-M02-alpine

start_redis:
	docker start redis

stop_redis:
	docker stop redis

.PHONY: pg start_pg stop_pg create_db drop_db redis start_redis stop_redis