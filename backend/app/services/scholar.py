import os
import httpx
import numpy as np
from diskcache import Cache
from pathlib import Path
from typing import List, Dict, Tuple
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

CURRENT_DIR = Path(__file__).parent
cache_path = CURRENT_DIR / "../../.cache"
cache = Cache(str(cache_path))

SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1"
SEMANTIC_SCHOLAR_API_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY")


async def fetch_papers(query: str, limit: int = 20) -> Tuple[List[Dict], np.ndarray]:
    """
    GET papers from Semantic Scholar API based on the query and limit, normalize it into a Python list and return that list along with a matrix of connections between those papers
    """

    if not query or len(query.strip()) < 2:
        raise HTTPException(status_code=400, detail="Keyword is too short!")

    cache_key = f"{query}_{limit}"
    if cache_key in cache:
        print(f"--- Retrieving data from cache for: {query} ---")
        return cache[cache_key]

    headers = {
        "Content-Type": "application/json",
        "x-api-key": SEMANTIC_SCHOLAR_API_KEY,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Search papers based on keywords
            search_params = {
                "query": query,
                "limit": limit,
                "fields": "paperId,title,authors,references,year",
            }

            response = await client.get(
                f"{SEMANTIC_SCHOLAR_API}/paper/search",
                params=search_params,
                headers=headers,
            )

            response.raise_for_status()
            data = response.json()
            papers = data.get("data", [])

            if not papers:
                return [], np.array([])

            # Paper ID list
            paper_ids = [p["paperId"] for p in papers if p["paperId"]]
            id_to_idx = {pid: i for i, pid in enumerate(paper_ids)}
            n = len(paper_ids)
            # Initial matrix
            adj_matrix = np.zeros((n, n))

            # Find references
            for i, paper in enumerate(papers):
                references = paper.get("references", [])
                if not references:
                    continue

                for ref in references:
                    ref_id = ref.get("paperId")
                    if ref_id in id_to_idx:
                        j = id_to_idx[ref_id]
                        adj_matrix[j, i] = 1

            result = (papers, adj_matrix)
            cache.set(cache_key, result, expire=86400 * 7)

            return result

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
