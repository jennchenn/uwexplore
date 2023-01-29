# fydp

Mongo + Flask + React

## Local Development Setup

1. Make a copy of `.env.example` and `frontend/.env.example`
2. Rename each copy to `.env`
3. Add the appropriate values to each `.env` file
4. Start all containers by running `docker-compose up` in the project root directory

## Lint

Upon making any backend changes, lint all the files before opening a pull request:

```
docker exec -it backend /bin/bash -c "black . && isort --profile black ."
```
