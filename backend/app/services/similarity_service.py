import uuid

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from ..models import Complaint


SIMILARITY_THRESHOLD = 0.45


def find_similar_complaint(
    title: str,
    description: str,
    complaints: list[Complaint]
) -> tuple[Complaint | None, float]:

    if not complaints:
        return None, 0.0

    new_text = f"{title} {description}"

    existing_texts: list[str] = []

    for complaint in complaints:
        existing_texts.append(
            f"{complaint.title} {complaint.description}"
        )

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    existing_vectors = vectorizer.fit_transform(
        existing_texts
    )

    new_vector = vectorizer.transform(
        [new_text]
    )

    similarity_scores = cosine_similarity(
        new_vector,
        existing_vectors
    ).flatten().tolist()

    if not similarity_scores:
        return None, 0.0

    best_index = max(
        range(len(similarity_scores)),
        key=lambda index: similarity_scores[index]
    )

    best_score = float(
        similarity_scores[best_index]
    )

    if best_score >= SIMILARITY_THRESHOLD:
        return (
            complaints[best_index],
            best_score
        )

    return None, best_score


def generate_cluster_id() -> str:
    return f"CL-{uuid.uuid4().hex[:8].upper()}"