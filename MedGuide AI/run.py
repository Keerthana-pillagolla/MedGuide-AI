#!/usr/bin/env python
"""
Startup script for HealthAI Assistant
Run with: python run.py
"""

import os
import sys
from app import app
from config import DEBUG, HOST, PORT

if __name__ == '__main__':
    print("🏥 HealthAI Assistant Starting...")
    print(f"📍 Host: {HOST}")
    print(f"🔌 Port: {PORT}")
    print(f"🐛 Debug: {DEBUG}")
    print("=" * 50)
    print("🌐 Open http://localhost:5000 in your browser")
    print("=" * 50)
    
    app.run(debug=DEBUG, host=HOST, port=PORT)