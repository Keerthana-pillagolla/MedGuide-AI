import requests
from config import (
    MISTRAL_API_KEY, MISTRAL_ENDPOINT, MISTRAL_MODEL,
    HUGGINGFACE_API_KEY, HUGGINGFACE_ENDPOINT,
    OPENAI_API_KEY, OPENAI_ENDPOINT, OPENAI_MODEL
)

def call_ai(messages, max_tokens=300):
    """
    Unified AI caller with fallback:
    Mistral → Hugging Face → OpenAI.
    """
    max_tokens = min(max_tokens, 500)

    # 1. Mistral
    try:
        headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": MISTRAL_MODEL,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": max_tokens
        }
        resp = requests.post(MISTRAL_ENDPOINT, json=payload, headers=headers, timeout=30)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Mistral error: {e}")

    # 2. Hugging Face
    if HUGGINGFACE_API_KEY:
        try:
            prompt = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
            headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": max_tokens,
                    "temperature": 0.7,
                    "return_full_text": False
                }
            }
            resp = requests.post(HUGGINGFACE_ENDPOINT, json=payload, headers=headers, timeout=60)
            if resp.status_code == 200:
                return resp.json()[0]["generated_text"].strip()
        except Exception as e:
            print(f"Hugging Face error: {e}")

    # 3. OpenAI
    if OPENAI_API_KEY:
        try:
            headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
            payload = {
                "model": OPENAI_MODEL,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": max_tokens
            }
            resp = requests.post(OPENAI_ENDPOINT, json=payload, headers=headers, timeout=30)
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"OpenAI error: {e}")

    return "⚠️ All AI services are currently unavailable. Please try again later."