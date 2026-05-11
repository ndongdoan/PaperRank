export interface PaperNode {
  id: string;
  title: string;
  authors: string[];
  year: number;
  rank: number;
  val: number;
}

export interface PaperLink {
  source: string;
  target: string;
}

export interface MatrixSimulation {
  adjacency_matrix: number[][];
  stochastic_matrix: number[][];
  final_vector: number[];
  iterations: number;
  damping_factor: number;
}

export interface RankResponse {
  nodes: PaperNode[];
  links: PaperLink[];
  query: string;
  matrix_simulation?: MatrixSimulation;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchPaperRank(
  keyword: string,
  author: string,
  limit: number,
  year: string = "",
  dampingFactor: number = 0.85,
): Promise<RankResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    d: dampingFactor.toString(),
  });

  if (keyword) params.append("keyword", keyword);
  if (author) params.append("author", author);
  if (year) params.append("year", year);

  const response = await fetch(`${API_BASE_URL}/rank?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch rankings");
  }

  return response.json();
}
