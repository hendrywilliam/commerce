DB_URL=postgresql://root:secret@localhost:5432/commerce?sslmode=disable

# local dev
postgres:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:17.1-alpine3.20

start_db:
	docker start postgres

stop_db:
	docker stop postgres

create_db:
	docker exec -it postgres createdb --username=root --owner=root commerce

drop_db:
	docker exec -it postgres dropdb commerce

.PHONY: postgres start_db stop_db