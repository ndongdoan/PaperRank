# Backend Architecture

This is where the core logic of the PaperRank system happens: fetching citation data and calculating the PageRank score.

## Features

- **PageRank Calculation:** Implement the Power Iteration method using NumPy to perform matrix operations on the data and obtain the final rank vector.
- **Citation Data Fetching:** Connect to the Semantic Scholar API to fetch for citation data.
- **Mathematical Simulation:** Provide the underlying matrices to allow for result verification.

## Tech Stack

- **Language:** Python
- **Framework:** FastAPI
- **Mathematical Calculation:** Numpy

## Folder Structure

```text
backend/
├── app/
│   ├── core            # Calculation logic
│   ├── services        # API endpoint
│   └── main.py         # FastAPI client entry point
├── .env.example       
├── .python-version
├── pyproject.toml
├── requirements.txt
├── uv.lock
└── README.md           # Backend doc
```

## Installation and Run

### Installation

The project's backend uses [uv](https://docs.astral.sh/uv/) for package management. You can install the environment by one of the two methods below:

**Method 1: Using ```uv``` (Recommended, extremely fast)**

If you've already had ```uv``` installed:

```bash
# Create .venv automatically and install dependencies
uv sync

# Activate environment
source .venv/bin/activate # MacOS/Linux
.venv\Scripts\activate # Windows
```

**Method 2: Using ```pip``` (Traditional, much slower installation speed)**

```bash
# Create virtual environment
python -m venv venv

# Activate environment
source .venv/bin/activate # MacOS/Linux
.venv\Scripts\activate # Windows

# Installing dependencies
pip install -r requirements.txt
```

### Run Backend Server

After finishing installation, run the FastAPI client:

```bash
uvicorn app.main:app --reload
```

*The API UI (Swagger UI) is available at: ```http://localhost:8000/docs```*
