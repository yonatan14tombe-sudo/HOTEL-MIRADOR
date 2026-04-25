#!/usr/bin/env python3
"""
========================================
HOTEL MIRADOR - Local Development Server
========================================

Simple HTTP server for testing the static website locally.

Usage:
    python server.py

Then open your browser at:
    http://localhost:8000

Press Ctrl+C to stop the server.
"""

import http.server
import socketserver
import os
import webbrowser
from functools import partial

# Configuration
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with better MIME types and logging."""
    
    # Extended MIME types for modern web development
    extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html; charset=utf-8',
        '.htm': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'font/otf',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.pdf': 'application/pdf',
        '.xml': 'application/xml',
        '.txt': 'text/plain; charset=utf-8',
    }
    
    def __init__(self, *args, directory=None, **kwargs):
        if directory is None:
            directory = DIRECTORY
        super().__init__(*args, directory=directory, **kwargs)
    
    def end_headers(self):
        """Add CORS and cache headers."""
        # Enable CORS for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        
        # Disable caching for development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom log format with colors."""
        status_code = args[1] if len(args) > 1 else '---'
        
        # Color codes
        GREEN = '\033[92m'
        YELLOW = '\033[93m'
        RED = '\033[91m'
        RESET = '\033[0m'
        CYAN = '\033[96m'
        
        # Choose color based on status code
        if str(status_code).startswith('2'):
            color = GREEN
        elif str(status_code).startswith('3'):
            color = CYAN
        elif str(status_code).startswith('4'):
            color = YELLOW
        else:
            color = RED
        
        print(f"{color}[{status_code}]{RESET} {args[0]}")


def run_server():
    """Start the HTTP server."""
    
    # Change to the project directory
    os.chdir(DIRECTORY)
    
    # Create handler with directory
    handler = partial(CustomHTTPRequestHandler, directory=DIRECTORY)
    
    # Create server
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("\n" + "=" * 50)
        print("  🏨 HOTEL MIRADOR - Local Server")
        print("=" * 50)
        print(f"\n  ✓ Server running at: \033[96mhttp://localhost:{PORT}\033[0m")
        print(f"  ✓ Serving files from: {DIRECTORY}")
        print("\n  Press Ctrl+C to stop the server\n")
        print("=" * 50 + "\n")
        
        # Try to open browser automatically
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass  # Silently fail if browser can't be opened
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n  👋 Server stopped. Goodbye!\n")


if __name__ == "__main__":
    run_server()
