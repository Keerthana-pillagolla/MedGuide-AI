from .pdf_handler import extract_text_from_pdf
from .docx_handler import extract_text_from_docx
from .image_handler import extract_text_from_image
from .text_handler import extract_text_from_txt

def process_uploaded_file(file):
    """Dispatch to the appropriate handler based on file extension."""
    filename = file.filename
    file_bytes = file.read()
    file_ext = filename.split('.')[-1].lower() if '.' in filename else ''
    file_size = len(file_bytes)
    extracted_text = ""

    if file_ext == 'pdf':
        extracted_text = extract_text_from_pdf(file_bytes)
    elif file_ext in ['docx', 'doc']:
        extracted_text = extract_text_from_docx(file_bytes)
    elif file_ext == 'txt':
        extracted_text = extract_text_from_txt(file_bytes)
    elif file_ext in ['png', 'jpg', 'jpeg', 'gif']:
        extracted_text = extract_text_from_image(file_bytes)
    else:
        raise Exception(f"Unsupported file type: {file_ext}")

    return {
        "filename": filename,
        "extension": file_ext,
        "size": file_size,
        "text": extracted_text[:8000]   # keep for analysis
    }