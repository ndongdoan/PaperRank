import os
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from app.services.scholar import fetch_papers
from app.core.pagerank import compute_pagerank
from fastapi import HTTPException
from typing import Dict

app = FastAPI(title="PaperRank API")

load_dotenv()
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "PageRank system's ready!"}


@app.get("/rank")
async def rank_papers(
    keyword: str = Query(None, description="Keywords/Related-topic Papers"),
    author: str = Query(None, description="Author(s)"),
    year: str = Query(None, description="Year or range (e.g., 2026 or 2020-2025)"),
    limit: int = Query(10, ge=1, le=50),
    d: float = 0.85,
) -> Dict:
    query_parts = []

    if keyword:
        query_parts.append(keyword.strip())

    if author:
        query_parts.append(f'author:"{author.strip()}"')

    final_query = " ".join(query_parts)
    if not final_query:
        raise HTTPException(
            status_code=400,
            detail="You have to fill in at least one of the two fields keywords/authors.",
        )

    papers, adj_matrix = await fetch_papers(final_query, limit, year)

    if not papers:
        return {"nodes": [], "links": []}

    ranks = compute_pagerank(adj_matrix, d=d)

    nodes = []
    max_rank = max(ranks) if len(ranks) > 0 else 1
    for i, p in enumerate(papers):
        display_size = (float(ranks[i] / max_rank)) * 48 + 2
        nodes.append(
            {
                "id": p["paperId"],
                "title": p["title"],
                "authors": [a["name"] for a in p.get("authors", [])],
                "year": p.get("year"),
                "rank": float(ranks[i]),
                "val": display_size
            }
        )

    links = []
    n = len(papers)
    for i in range(n):
        for j in range(n):
            if adj_matrix[j, i] == 1:
                links.append(
                    {"source": papers[i]["paperId"], "target": papers[j]["paperId"]}
                )

    return {"query": final_query, "nodes": nodes, "links": links}

