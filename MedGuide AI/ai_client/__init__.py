# AI Client package - handles AI API calls
#from .mistral_client import call_mistral, SYSTEM_PROMPT, DOCUMENT_ANALYSIS_PROMPT

#__all__ = ['call_mistral', 'SYSTEM_PROMPT', 'DOCUMENT_ANALYSIS_PROMPT']

from .ai_client import call_ai

__all__ = ['call_ai']