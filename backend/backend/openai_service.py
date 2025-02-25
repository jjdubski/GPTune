import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_response(prompt):
    """
    Sends a prompt to OpenAI and returns the response.
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return response['choices'][0]['message']['content']

def generate_song_recommendations(user_data):
    """
    Generates song recommendations based on user demographics and listening history.
    """
    prompt = f"""
    The user enjoys these artists: {user_data['top_artists']}
    and prefers these genres: {user_data['top_genres']}.
    Based on their listening history, recommend 5 new songs they might like.
    Provide the song name and artist.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": "You are a music recommendation assistant."},
                  {"role": "user", "content": prompt}]
    )

    # Extract song recommendations
    return response['choices'][0]['message']['content']
