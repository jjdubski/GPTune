import os
import openai
import logging

# Configure OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

logger = logging.getLogger(__name__)

class OpenAIClient:
    """
    A wrapper around OpenAI's API to generate song recommendations.
    """

    def __init__(self):
        self.model = "gpt-4"

    # Set up logging
logging.basicConfig(level=logging.INFO)

def generate_recommendations(user_data):
    try:
        logging.info(f"Received user data for recommendations: {user_data}")

        # Ensure required keys exist
        top_artists = user_data.get("top_artists", [])
        top_genres = user_data.get("top_genres", [])

        if not top_artists:
            return {"error": "Missing top artists"}

        if not top_genres:
            logging.warning("Top genres missing, continuing with only artists.")

        # Generate prompt for OpenAI
        prompt = f"Recommend 5 songs based on these artists: {', '.join(top_artists)}"
        if top_genres:
            prompt += f" and genres: {', '.join(top_genres)}."

        logging.info(f"Generated prompt: {prompt}")

        # Call OpenAI API (Replace with your API key handling method)
        response = openai.ChatCompletion.create(
            model="gpt-4",  
            messages=[{"role": "system", "content": "You are a music recommendation assistant."},
                      {"role": "user", "content": prompt}],
            max_tokens=100
        )

        logging.info(f"OpenAI API Response: {response}")

        # Extract recommendations from OpenAI response
        return response["choices"][0]["message"]["content"].strip()

    except Exception as e:
        logging.error(f"Error generating recommendations: {e}")
        return {"error": "Failed to generate recommendations"}

# Initialize OpenAI Client
openai_client = OpenAIClient()
