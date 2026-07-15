import re

def clean_response(text):
    # Remove markdown bold/italic markers
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    # Remove any remaining * or # or @ (but keep ●)
    text = re.sub(r'[#*@]', '', text)
    # Convert leading * or - to ● if they appear as bullet points
    # We'll let the AI use ● directly, so we don't need to convert.
    # But we can remove extra spaces after ● if needed.
    # Remove multiple newlines
    text = re.sub(r'\n\s*\n', '\n\n', text)
    # Remove extra spaces
    text = re.sub(r' +', ' ', text)
    return text.strip()