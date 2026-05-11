import numpy as np
from typing import Tuple


def compute_pagerank(
    adj_matrix: np.ndarray, d: float = 0.85, eps: float = 1e-6, max_iter: int = 100
) -> Tuple[np.ndarray, np.ndarray, int]:
    """
    Calculate PageRank score using matrix multiplication
    v_new = d * adj_matrix * v + (1 - d) / n
    Returns: (final_vector, stochastic_matrix, iterations)
    """

    M = adj_matrix.copy()
    n = M.shape[0]

    # Dangling nodes
    column_sums = np.sum(M, axis=0)
    for j in range(n):
        if column_sums[j] == 0:
            M[:, j] = 1.0 / n
        else:
            M[:, j] /= column_sums[j]

    # Initial PageRank score vector
    v = np.ones(n) / n
    iters = 0

    for i in range(max_iter):
        iters += 1
        v_next = d * np.dot(M, v) + (1 - d) / n

        if np.linalg.norm(v_next - v, 1) < eps:
            return v_next, M, iters

        v = v_next

    return v, M, iters
