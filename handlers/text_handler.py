def extract_text_from_txt(file_bytes):
    try:
        return file_bytes.decode('utf-8', errors='ignore')
    except Exception as e:
        raise Exception(f"TXT decoding failed: {e}")