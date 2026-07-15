import requests
from config import MISTRAL_API_KEY, MISTRAL_ENDPOINT, MISTRAL_MODEL

# Plain-text system prompt – no special characters allowed
SYSTEM_PROMPT = (
    "You are HealthAI, a helpful medical assistant. "
    "IMPORTANT: Use only plain text. Do NOT use any markdown, bold, italics, "
    "asterisks (*), underscores (_), bullet points, or any special formatting characters. "
    "Do not use #, -, or any other symbols for formatting. "
    "Respond in clear, simple sentences using only letters, numbers, periods, and commas. "
    "Always include a medical disclaimer. "
    "Never make a definitive diagnosis. For serious symptoms, recommend seeing a doctor."
)

DOCUMENT_ANALYSIS_PROMPT = (
    "You are a medical document analyzer. Provide a clear, structured analysis using only plain text. "
    "Do not use any markdown, special characters, asterisks, underscores, bullet points, or hash symbols. "
    "Use only periods, commas, and standard punctuation.\n\n"
    "Document Name: {filename}\n\n"
    "Document Content:\n{text}\n\n"
    "Please provide the following information in plain sentences with no special formatting:\n"
    "1. Document Type: What kind of medical document is this? (e.g., Lab Report, Prescription, Medical History, Discharge Summary, etc.)\n"
    "2. Key Findings: List the most important medical findings.\n"
    "3. Possible Diagnosis: Based on the findings, what condition(s) does the patient likely have? Be specific.\n"
    "4. Abnormal Values: List any abnormal lab values or concerning signs.\n"
    "5. Summary: Provide a plain-language summary for a patient.\n"
    "6. Recommendations: What actions should the patient consider?\n\n"
    "Important: Do NOT use any special characters like *, _, #, or bullet points. Use only plain text with periods and commas."
)

def call_mistral(messages):
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MISTRAL_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 500,
        "top_p": 1
    }
    try:
        resp = requests.post(MISTRAL_ENDPOINT, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Mistral API error: {e}")
        return f"Error calling Mistral AI: {str(e)}"    