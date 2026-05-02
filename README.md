# GPTune

![Python](https://img.shields.io/badge/python-v3.13-yellow.svg)
![Django](https://img.shields.io/badge/django-v5.1.4-092e20.svg)
![Docker](https://img.shields.io/badge/Docker-v27.4-118eed.svg)
![Postgres](https://img.shields.io/badge/Postgres-v17-4287f5.svg)

GPTune is a full-stack music discovery app with a React frontend, a Django backend, PostgreSQL, Spotify integration, and AI-assisted recommendation.

## Stack

- React 19 + TypeScript + Vite
- Django + Django REST Framework
- PostgreSQL via Docker Compose
- Spotify Web API / Web Playback SDK
- OpenAI-backed recommendation utilities

App endpoints:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Django admin: [http://localhost:8000/admin](http://localhost:8000/admin)
- PostgreSQL: [http://localhost:5432](http://localhost:5432)

## Table of Contents

1. [Quick Start](#quick-start)
2. [How to run](#how-to-run)
3. [Project Structure](#project-structure)
4. [Application Routes](#application-routes)
5. [List of Commands](#list-of-commands)
   5.1. [Docker](#docker)  
   5.2. [PostgreSQL](#postgresql)  
   5.3. [Git](#git)
6. [Pull Request Workflow](#pull-request-workflow)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- Docker Desktop
- Python 3.13+ if you want to use `run.py`
- A root `.env` file with the variables used by `docker-compose.yml`

Required environment variables include:

- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_SECRET_KEY`
- `DEBUG`
- `DJANGO_LOG_LEVEL`
- `DATABASE_ENGINE`
- `DATABASE_NAME`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_HOST`
- `DATABASE_PORT`

The backend also expects the Spotify and OpenAI-related values used by the project.

## How to run

### Run with the helper script (recommended)

You can start the app with:

```bash
python3 run.py
```

On Windows:

```bash
python run.py
```

`run.py` is a convenience wrapper around Docker Compose. It also refreshes frontend dependencies before startup and deletes the `songs` and `playlists` migration folders, so use it only if that reset behavior is acceptable for your workflow.

### Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Stop the stack and remove volumes:

```bash
docker compose down -v
```

![image](https://github.com/user-attachments/assets/17e3333b-0a9c-4a17-928d-e7d1379af5bf)

## Project Structure

```text
GPTune/
├── .env                      # Environment file goes here
├── docker-compose.yml        # Frontend, backend, and Postgres services
├── run.py                    # Helper script that boots the app with Docker
├── backend/
│   ├── Dockerfile            # Django container image
│   ├── manage.py
│   ├── requirements.txt
│   ├── backend/              # Django project settings, URLs, WSGI/ASGI
│   ├── songs/                # Song models, serializers, views, routes
│   ├── playlists/            # Playlist models, serializers, views, routes
│   └── utils/                # Spotify and OpenAI client helpers
└── frontend/
    ├── Dockerfile            # Vite/React container image
    ├── package.json
    ├── src/
    │   ├── components/       # Reusable UI components
    │   └── pages/            # Route-level screens
    └── public/               # Static assets
```

## Application Routes

Frontend routes configured in the React app include:

- `/`
- `/songs`
- `/playlists`
- `/playlist/:playlistID`
- `/search`
- `/add-to-playlist`
- `/this-or-that`
- `/discover`

Backend routes include:

- `/songAPI/`
- `/playlistAPI/`
- `/musicAPI/search`
- `/getRecommendations/`
- `/getAISongRecommendations/`
- `/api/discover/`
- `/login/`
- `/callback/`
- `/logout/`

## List of Commands

### Docker

Build and start the stack:

```bash
docker compose up --build
```

Start in the background:

```bash
docker compose up -d --build
```

Stop containers and remove volumes:

```bash
docker compose down -v
```

View service logs:

```bash
docker compose logs frontend
docker compose logs backend
docker compose logs db
```

Run Django migrations:

```bash
docker compose exec backend python manage.py migrate --noinput
```

Create an admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

Open a shell in the backend container:

```bash
docker compose exec backend sh
```

Run the frontend linter:

```bash
docker compose exec frontend npm run lint
```

List all docker images:

```bash
docker image ls
```

Launch interactive bash shell that is running in the container:

```bash
docker exec -it musicapp bash
```

- To exit this bash terminal use the command 'exit'
  ![image](https://github.com/user-attachments/assets/4e614cf1-0d2e-4fcd-8e8e-adc396aea569)

### PostgreSQL

Open a `psql` session inside the database container:

```bash
docker compose exec db psql -U "$DATABASE_USER" -d "$DATABASE_NAME"
```

Useful `psql` commands:

List databases:

```bash
\l
```

![image](https://github.com/user-attachments/assets/8b07c240-6f7b-41eb-9607-1d52af3a4148)

List tables:

```bash
\dt
```

![image](https://github.com/user-attachments/assets/8fc36fd0-9331-47f4-a00e-aec231049369)

Show the current connection & current user:

```bash
\c
```

![image](https://github.com/user-attachments/assets/78fa1170-3b74-4c02-ba2a-85b5874ca399)

Exit `psql` interface:

```bash
\q
```

![image](https://github.com/user-attachments/assets/7a39d42f-2f36-4d3c-996b-49fbb9bb0ce9)

### Git

Standardize inputs across Windows/macOS/Linux:

```bash
git config --global core.autocrlf input**
```

Refresh remote refs:

```bash
git fetch
```

Update your current branch:

```bash
git pull
```

- Attempts to update your local branch with what is on the remote branch, fetch to refresh and pull to update
- If done correctly, you should receive "Already up to date." or it will pull the changes without error.
  ![image](https://github.com/user-attachments/assets/07808722-7b21-4ca2-bf9c-4be5b43ec1b7)

List branches:

```bash
git branch
git branch -a
```

- Adding an -a flag will show all branches, local and remote
- Shows all the local branches available | **_The current branch is highlighted in green with a \*_**
  ![image](https://github.com/user-attachments/assets/7d578930-cda5-4a03-9f2b-7c6ace3b28c7)

Create and switch to a branch:

```bash
git checkout -b your-branch-name
```

Create a branch:

```bash
git branch your-branch-name
```

- Creates a branch with the given name (on your local repo), if successful no message will popup
  ![image](https://github.com/user-attachments/assets/8fc28817-c3a1-4703-b3c4-79fa7301506f)

Switch to a branch:

```bash
git checkout your-branch-name
```

- This will switch to the branch with whatever name is inserted after switch.
  ![image](https://github.com/user-attachments/assets/ca46766a-21f0-4e54-b3ed-7a138b000496)

Stage, commit, and push:

```bash
git add .
git commit -m "your message"
git push
```

## Pull Request Workflow

1. Make sure all your files are saved
2. Ensure you are in the repository directory (in terminal)
3. If you aren't already in a new branch, please create one.
4. Then switch to the new branch
5. Add your code to staged changes, commit the changes and then push:
   ![image](https://github.com/user-attachments/assets/2c605c77-e13f-464b-a802-966915a5d2ff)

- **You should see this message on the GitHub page after you push:**

![image](https://github.com/user-attachments/assets/61a61f9c-54d0-4250-b650-ecebcbb4e85b)

- **If not click on the branch selector and choose the branch you pushed to:**

![image](https://github.com/user-attachments/assets/8ac84779-21f7-4160-8bc1-f1ef72e67f7c)

6. Click on "Compare & Pull Request"

- **This will bring you to a page similar to this:**

![image](https://github.com/user-attachments/assets/c3d1e867-7001-4bf8-ad5d-58cba14308b3) 7. Click on the reviewer's gear icon to add the Product Manager/Reviewer:

![image](https://github.com/user-attachments/assets/ec2018d9-4a9c-4bdb-9564-9a2e8250a724)

8. Add a description if you'd like then hit "Create Pull Request":

![image](https://github.com/user-attachments/assets/e70250ce-d426-499c-8c3d-f7a5ade095dc)

- **You'll see this if you have no merge conflicts:**

![image](https://github.com/user-attachments/assets/49f79afc-f35d-404e-87a7-56eb0a3d8f51)

- **Once you're done the reviewer will review your code and either approve/deny/request changes.**
- **Complete the requested changes and request another review**
- **If it is approved you can go ahead and merge it**

9. After the pull request is approved and merged, you can do

- **git switch main**
- **git pull**

**This will update your local main branch with the updated code**

## Troubleshooting

### Docker commands fail immediately

You recieve an error like this when running docker compose up --build:![image](https://github.com/user-attachments/assets/a9a1f501-7d66-4af8-adb4-dc1bc949d5cb)

Docker might be running your containers already, try:

```bash
docker compose down -v
docker compose up --build
```

- to run docker in the background instead:

```bash
docker compose up -d --build
```

If you get this:
![image](https://github.com/user-attachments/assets/e16c0c33-5f6f-4840-a414-24666a54a497)
Or this:
![image](https://github.com/user-attachments/assets/5783e301-885f-4c24-b2f4-644b63a6cd3d)

Make sure Docker Desktop is running first, then try again.

### The app complains about missing environment variables

The project depends on a root `.env` file. If startup fails early, verify that `.env` exists and contains the Django, database, Spotify, and OpenAI variables expected by the backend and Docker Compose.

An error like this means you are missing the .env file
![image](https://github.com/user-attachments/assets/df964348-9a8d-4de3-aa0f-5c925d81c4e7)

### The frontend or dependencies look out of sync

Rebuild the stack:

```bash
docker compose down -v
docker compose up --build
```

If you intentionally want the helper script's reset behavior, run:

```bash
python3 run.py
```
