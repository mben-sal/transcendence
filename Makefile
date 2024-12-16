up:
	docker compose up --build

down:
	docker compose -f down

clean: down
	docker system prune -af
