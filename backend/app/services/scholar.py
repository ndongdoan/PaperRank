import os, json
import httpx
import numpy as np
import redis.asyncio as redis
from diskcache import Cache
from pathlib import Path
from typing import List, Dict, Tuple
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

CURRENT_DIR = Path(__file__).parent
LOCAL_CACHE_PATH = CURRENT_DIR / "../../.cache"

USE_REDIS = os.getenv("USE_REDIS", "false").lower() == "true"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

if USE_REDIS:
    r = redis.from_url(REDIS_URL, decode_responses=True)
    print(">>> [INFO] Using Redis Cache ---")
else:
    local_cache = Cache(str(LOCAL_CACHE_PATH))
    print(">>> [INFO] Using DiskCache (Local)")


async def get_cache(key: str):
    if USE_REDIS:
        data = await r.get(key)
        return json.loads(data) if data else None
    else:
        return local_cache.get(key)


async def set_cache(key: str, value: dict, expire: int = 86400 * 30):
    if USE_REDIS:
        await r.set(key, json.dumps(value), ex=expire)
    else:
        local_cache.set(key, value, expire=expire)

cache = Cache(str(LOCAL_CACHE_PATH))

SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1"
SEMANTIC_SCHOLAR_API_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY")


async def fetch_papers(query: str, limit: int = 20, year: str = None) -> Tuple[List[Dict], np.ndarray]:
    """
    GET papers from Semantic Scholar API based on the query and limit, normalize it into a Python list and return that list along with a matrix of connections between those papers
    """

    if not query or len(query.strip()) < 2:
        raise HTTPException(status_code=400, detail="Keyword is too short!")

    cache_key = f"{query}_{limit}_{year}"

    cached = await get_cache(cache_key) 
    if cached:
        print(f">>> [INFO] Retrieving data from cache for: {query}")
        return cached["papers"], np.array(cached["adj_matrix"])

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

            if year and year.strip():
                search_params["year"] = year.strip()

            response = await client.get(
                f"{SEMANTIC_SCHOLAR_API}/paper/search",
                params=search_params,
                headers=headers,
            )

            response.raise_for_status()
            data = response.json()
            raw_papers = data.get("data", [])
            papers = [p for p in raw_papers if p.get("paperId") and p.get("title")]

            if not papers:
                return [], np.array([])

            # Paper ID list
            paper_ids = [p["paperId"] for p in papers]
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

            result_to_cache = {
                "papers": papers,
                "adj_matrix": adj_matrix.tolist()
            }   
            await set_cache(cache_key, result_to_cache)
            
            result = (papers, adj_matrix)
            return result

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
