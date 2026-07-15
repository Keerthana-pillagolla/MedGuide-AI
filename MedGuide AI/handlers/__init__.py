# Handlers package - file processing handlers
from .file_handler import process_uploaded_file
from .pdf_handler import extract_text_from_pdf
from .docx_handler import extract_text_from_docx
from .image_handler import extract_text_from_image
from .text_handler import extract_text_from_txt

__all__ = [
    'process_uploaded_file',
    'extract_text_from_pdf',
    'extract_text_from_docx',
    'extract_text_from_image',
    'extract_text_from_txt'
]