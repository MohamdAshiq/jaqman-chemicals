"""
Post-process script for GitHub Pages deployment.
Converts absolute URL paths to relative paths for portable deployment.
"""
import os
import re
from pathlib import Path

SITE_DIR = Path(__file__).parent.parent / '_site'

def get_relative_prefix(file_path):
    """Calculate relative prefix based on directory depth from _site root."""
    relative_path = file_path.relative_to(SITE_DIR)
    # Count directory levels (subtract 1 if it's an index.html file)
    depth = len(relative_path.parts) - 1  # -1 for the filename itself
    if depth == 0:
        return './'
    return '../' * depth

def process_html_file(file_path):
    """Convert absolute paths to relative paths in HTML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prefix = get_relative_prefix(file_path)
    
    # Replace absolute static/media paths with relative
    # Pattern: href="/static/ or src="/static/
    content = re.sub(r'(href|src)="/static/', rf'\1="{prefix}static/', content)
    content = re.sub(r'(href|src)="/media/', rf'\1="{prefix}media/', content)
    
    # Replace internal page links that still use absolute paths
    # Pattern: href="/jaqman-chemicals/path/"
    content = re.sub(r'href="/jaqman-chemicals/([^"]*)"', rf'href="{prefix}\1"', content)
    
    # Also handle any remaining absolute page links like href="/about/"
    # These would be internal links without the base prefix
    pages = ['about', 'products', 'industries', 'resources', 'contact']
    for page in pages:
        # Match href="/page/" or href="/page" 
        content = re.sub(rf'href="/{page}(/[^"]*)?"', rf'href="{prefix}{page}\1"' if page else rf'href="{prefix}{page}/"', content)
    
    # Handle home page links - convert href="/" to relative
    content = re.sub(r'href="/"', f'href="{prefix}"', content)
    
    # Handle URL patterns with query strings like href="/contact/?product=..."
    content = re.sub(r'href="/([^"?]+)\?([^"]*)"', rf'href="{prefix}\1?\2"', content)
    
    # Handle background-image urls in inline styles (both single and double quotes)
    content = re.sub(r"url\('/static/", f"url('{prefix}static/", content)
    content = re.sub(r'url\("/static/', f'url("{prefix}static/', content)
    content = re.sub(r"url\('/media/", f"url('{prefix}media/", content)
    content = re.sub(r'url\("/media/', f'url("{prefix}media/', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Processed: {file_path.relative_to(SITE_DIR)}')

def main():
    """Process all HTML files in the _site directory."""
    if not SITE_DIR.exists():
        print(f'Error: {SITE_DIR} does not exist')
        return
    
    html_files = list(SITE_DIR.rglob('*.html'))
    print(f'Found {len(html_files)} HTML files to process')
    
    for html_file in html_files:
        process_html_file(html_file)
    
    print(f'\nDone! Processed {len(html_files)} files.')

if __name__ == '__main__':
    main()
