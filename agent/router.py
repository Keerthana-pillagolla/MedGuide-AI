from ai_client import call_ai
from .tools import AgentTools

class AgentRouter:
    def __init__(self):
        self.tools = AgentTools()

    def handle_chat(self, messages):
        """
        messages: list of dict with 'role' and 'content'
        """
        if not any(m['role'] == 'system' for m in messages):
            system_prompt = (
                "You are MedGuide AI, a caring and knowledgeable healthcare assistant.\n\n"
                "IMPORTANT RULES:\n"
                "1. If the user asks a health-related question (symptoms, diseases, medications, treatments, etc.), "
                "provide a detailed, thoughtful response (at least 7-15 sentences). Use proper formatting:\n"
                "   - Use normal case for headings (e.g., 'Key Findings' not 'KEY FINDINGS').\n"
                "   - After each heading, start the content on a new line.\n"
                "   - Use the bullet symbol '●' for list items (not '-' or '*').\n"
                "   - Do not use all caps words except for standard abbreviations.\n"
                "   - Include a medical disclaimer only in health-related replies.\n"
                "2. If the user asks a non-medical question (greeting, introduction, small talk), "
                "respond briefly in 1-2 sentences without a disclaimer.\n"
                "3. Be empathetic and thorough when giving health advice."
            )
            messages.insert(0, {"role": "system", "content": system_prompt})
        return call_ai(messages, max_tokens=600)

    def analyse_document(self, text, filename):
        prompt = (
            f"Analyze this medical document: {filename}\n\n"
            f"Content: {text[:3000]}\n\n"
            "Provide a detailed structured summary. Use normal case headings (e.g., 'Document Type' not 'DOCUMENT TYPE'). "
            "After each heading, start the content on a new line. Use the bullet symbol '●' for list items. "
            "Include: Document Type, Key Findings, Possible Diagnosis, Abnormal Values, Summary, Recommendations. "
            "Give at least 10 sentences. Include a medical disclaimer. Use plain text, no special characters like *, #, @."
        )
        messages = [
            {"role": "system", "content": "You are a medical document analyzer. Provide thorough, clear analysis with proper formatting."},
            {"role": "user", "content": prompt}
        ]
        return call_ai(messages, max_tokens=600)

    # ─── Wellness Methods ──────────────────────────────────────────────────

    def generate_health_tip(self):
        prompt = "Give a short, practical health tip for today. Keep it to one sentence."
        messages = [
            {"role": "system", "content": "You are a health coach. Provide a concise, actionable tip."},
            {"role": "user", "content": prompt}
        ]
        return call_ai(messages, max_tokens=50)

    def generate_wellness_plan(self, prompt):
        messages = [
            {"role": "system", "content": "You are a wellness expert. Provide actionable, detailed advice. Use normal case headings, newlines after headings, and ● for bullet points. No special characters. Give at least 10 sentences."},
            {"role": "user", "content": prompt}
        ]
        return call_ai(messages, max_tokens=700)

    def generate_healthy_recipes(self):
        prompt = "Suggest a healthy recipe with ingredients and preparation steps. Use normal case headings, newlines after headings, and ● for bullet points. Give detailed description (at least 10 sentences). No special characters."
        messages = [
            {"role": "system", "content": "You are a nutrition expert. Provide a detailed, healthy recipe with proper formatting."},
            {"role": "user", "content": prompt}
        ]
        return call_ai(messages, max_tokens=500)

    def generate_adaptive_workout(self, level):
        prompt = (
            f"Create a detailed workout plan for a {level} fitness level. "
            "Include warm-up, main exercises, cool-down, and safety tips. "
            "Use normal case headings, newlines after headings, and ● for bullet points. "
            "Give at least 10 sentences. No special characters."
        )
        messages = [
            {"role": "system", "content": "You are a fitness trainer. Provide a safe, effective, detailed workout with proper formatting."},
            {"role": "user", "content": prompt}
        ]
        return call_ai(messages, max_tokens=500)

    def generate_mental_wellness_tips(self):
        prompt = "Give detailed, practical tips for improving mental wellness and reducing stress. Use normal case headings, newlines after headings, and ● for bullet points. Provide at least 10 sentences. No special characters."
        messages = [
            {"role": "system", "content": "You are a mental health advocate. Provide supportive, actionable, detailed tips with proper formatting."},
            {"role": "user", "content": prompt}
        ]
        return call_ai(messages, max_tokens=500)

    def generate_sleep_tips(self):
        prompt = "Provide detailed, evidence-based tips for better sleep quality. Use normal case headings, newlines after headings, and ● for bullet points. Give at least 10 sentences. No special characters."
        messages = [
            {"role": "system", "content": "You are a sleep specialist. Offer practical, safe, detailed sleep advice with proper formatting."},
            {"role": "user", "content": prompt}
        ]
        return call_ai(messages, max_tokens=500)