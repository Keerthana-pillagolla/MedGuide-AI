import io
import docx

def extract_text_from_docx(file_bytes):
    try:
        with io.BytesIO(file_bytes) as docx_file:
            doc = docx.Document(docx_file)
            text = "\n".join([para.text for para in doc.paragraphs])
            return text
    except Exception as e:
        raise Exception(f"DOCX extraction failed: {e}")