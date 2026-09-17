import json
import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured in the .env file"
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


def analyze_complaint(
    title: str,
    description: str,
    location: str | None = None
) -> dict:

    prompt = f"""
Analyze this civic complaint.

Title: {title}
Description: {description}
Location: {location or "Not provided"}

Return ONLY JSON.

Fields:
category
subcategory
priority
priority_score
department
sentiment
ai_summary
recommended_action

Priority must be LOW, MEDIUM, HIGH, or CRITICAL.
Priority score must be 0-100.
Keep summary and recommendation short.
Do not invent facts.
"""

    start_time = time.time()

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
                max_output_tokens=300
            )
        )

        elapsed = time.time() - start_time

        print(
            f"Gemini response time: {elapsed:.2f} seconds"
        )

    except Exception as error:

        print(
            "Gemini API error:",
            error
        )

        return fallback_result(description)

    if not response or not response.text:

        return fallback_result(description)

    try:

        result = json.loads(
            response.text.strip()
        )

        return result

    except json.JSONDecodeError:

        print(
            "Invalid Gemini JSON:",
            response.text
        )

        return fallback_result(description)


def fallback_result(
    description: str
) -> dict:

    return {
        "category": "General",
        "subcategory": "Other",
        "priority": "MEDIUM",
        "priority_score": 50,
        "department": "Municipal Corporation",
        "sentiment": "NEUTRAL",
        "ai_summary": description[:200],
        "recommended_action": (
            "Forward the complaint to the "
            "appropriate municipal department."
        )
    }