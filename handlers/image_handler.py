import io
from PIL import Image
import pytesseract

def extract_text_from_image(file_bytes):
    try:
        image = Image.open(io.BytesIO(file_bytes))
        try:
            text = pytesseract.image_to_string(image)
            return text
        except Exception:
            return "Image uploaded. OCR not available; please describe the image contents for analysis."
    except Exception as e:
        raise Exception(f"Image processing failed: {e}")