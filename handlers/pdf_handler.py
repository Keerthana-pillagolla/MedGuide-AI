import io
import PyPDF2

def extract_text_from_pdf(file_bytes):
    try:
        with io.BytesIO(file_bytes) as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        raise Exception(f"PDF extraction failed: {e}")