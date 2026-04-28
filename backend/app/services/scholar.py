import httpx
import numpy as np
from typing import List, Dict, Tuple
from fastapi import HTTPException 

SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1"

async def fetch_papers(query: str, limit: int = 20) -> Tuple[List[Dict], np.ndarray]:
    if not query or len(query.strip()) < 2:
        raise HTTPException(status_code = 400, detail = "Keyword is too short!")
    
    header = {
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient(timeout = 30.0) as client:
        try:
            # Search papers based on keywords
            search_params = {
                "query": query,
                "limit": limit,
                "fields": "paperId,title,authors,references,year"
            }

            response = await client.get(f"{SEMANTIC_SCHOLAR_API}/paper/search", params = search_params, headers = header)

            if response.status_code == 429:
                raise HTTPException(status_code = 429, detail = "API Rate Limit: Please try again after 1 minute.")

            if response.status_code != 200:
                raise Exception(f"API Semantic Scholar Error: {response.status_code}")

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
            
            return papers, adj_matrix
    
        except httpx.RequestError:
            raise HTTPException(status_code = 503, detail = "Failed to connect to Semantic Scholar server.")
