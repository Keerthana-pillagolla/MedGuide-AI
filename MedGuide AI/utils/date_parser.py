import re
from datetime import datetime

def detect_appointment_from_text(text):
    lower = text.lower()
    if any(kw in lower for kw in ['appointment', 'schedule', 'visit', 'consultation', 'with dr', 'with doctor']):
        date_match = re.search(r'(\d{1,2}[/-]\d{1,2}[/-]\d{4})', text)
        if not date_match:
            date_match = re.search(r'(\d{4}-\d{2}-\d{2})', text)
        appt_date = date_match.group(1) if date_match else datetime.now().strftime("%Y-%m-%d")
        provider_match = re.search(r'with\s+(Dr\.?\s*\w+)', text, re.IGNORECASE)
        provider = provider_match.group(1) if provider_match else "Healthcare Provider"
        return {"date": appt_date, "provider": provider}
    return None