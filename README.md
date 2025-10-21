
## How to run the app

1. Set api keys into .env

2. Run frontend run:

- cd frontend (go to frontend directory)
- npm install (install dependencies)
- npm run dev (run dev server)

3. Run agent api server:

- cd backend (go to backend directory)
- uv sync (install dependencies)
- uv run uvicorn api:app --port 8000 --reload (run dev server)

4. Run qdrand docker container

- docker pull qdrant/qdrant
- docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant

- OR via docker-desktop

(app uses default http://localhost:6333 qdrant url which can be changed in .env)

## How to run evaluation

1. Run the app (instructions above)

2. Upload pdf files into drop area to save docs into vector db.

3. Place the same docs into backend/test_data (to create RAGAS testset)

**NOTE**

Test results will be wrong if uploaded documents into drop area and backend/test_data directory differ. This may cause wrong scores

4. Run the notebook

## Main app description

To read project description go to proj-description.md

