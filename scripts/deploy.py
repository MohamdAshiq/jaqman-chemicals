"""
Deploy script for GitHub Pages.
This script automates the complete build and deployment process.

Usage: python scripts/deploy.py
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

# Project root and build directories
PROJECT_ROOT = Path(__file__).parent.parent
SITE_DIR = PROJECT_ROOT / '_site'

# Files/folders that should NOT be deleted during deployment
# These are essential for the Django project to work
PROTECTED_ITEMS = {
    '.git',
    '.gitignore', 
    '.env',
    'venv',
    'db.sqlite3',
    'manage.py',
    'requirements.txt',
    'jaqman_chemicals',
    'website',
    'media',
    'scripts',
    'staticfiles',
    '_site',
    '.agent',
}

def run_command(cmd, description):
    """Run a command and print status."""
    print(f"\n{'='*60}")
    print(f"📦 {description}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, shell=True, cwd=PROJECT_ROOT)
    if result.returncode != 0:
        print(f"❌ Error: {description} failed!")
        return False
    print(f"✅ {description} completed!")
    return True

def clean_old_deployment():
    """Remove old deployed files from root (but keep protected items)."""
    print("\n🧹 Cleaning old deployment files...")
    
    for item in PROJECT_ROOT.iterdir():
        if item.name not in PROTECTED_ITEMS:
            if item.is_dir():
                shutil.rmtree(item)
                print(f"  Removed directory: {item.name}")
            else:
                item.unlink()
                print(f"  Removed file: {item.name}")

def copy_site_to_root():
    """Copy built _site contents to project root for GitHub Pages."""
    print("\n📁 Copying _site contents to root...")
    
    if not SITE_DIR.exists():
        print(f"❌ Error: {SITE_DIR} does not exist!")
        return False
    
    for item in SITE_DIR.iterdir():
        dest = PROJECT_ROOT / item.name
        
        if item.name in PROTECTED_ITEMS:
            print(f"  Skipping protected: {item.name}")
            continue
            
        if item.is_dir():
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(item, dest)
            print(f"  Copied directory: {item.name}")
        else:
            shutil.copy2(item, dest)
            print(f"  Copied file: {item.name}")
    
    return True

def main():
    print("""
╔══════════════════════════════════════════════════════════════╗
║           JAQMAN CHEMICALS DEPLOYMENT SCRIPT                  ║
║   Automated build and deploy to GitHub Pages                  ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    # Step 0: Configure environment for production build
    print("⚙️  Configuring production environment...")
    # Force the correct base URL for GitHub Pages
    os.environ['SITE_BASE_URL'] = '/jaqman-chemicals'
    # Force DEBUG to False for production security/behavior
    os.environ['DEBUG'] = 'False'
    print(f"   Set SITE_BASE_URL = {os.environ['SITE_BASE_URL']}")
    print(f"   Set DEBUG = {os.environ['DEBUG']}")
    
    # Step 1: Collect static files
    if not run_command("python manage.py collectstatic --noinput", "Collecting static files"):
        return 1
    
    # Step 2: Generate static site with django-distill
    if not run_command("python manage.py distill-local _site --force", "Generating static site"):
        return 1
    
    # Step 3: Run make_portable to fix paths
    if not run_command("python scripts/make_portable.py", "Making paths portable"):
        return 1
    
    # Step 4: Clean old deployment files from root
    clean_old_deployment()
    
    # Step 5: Copy _site contents to root
    if not copy_site_to_root():
        return 1
    
    # Step 6: Git add, commit and push
    print("\n" + "="*60)
    print("📤 Committing and pushing to GitHub...")
    print("="*60)
    
    # Force add ignored deployment files/folders
    # Since these are in .gitignore, we must use -f to validly stage them
    deploy_items = "index.html about products contact industries resources static media"
    run_command(f"git add -f {deploy_items}", "Staging ignored deployment files")
    
    run_command("git add -A", "Staging all other changes")
    
    # Get commit message from argument or use default
    commit_msg = sys.argv[1] if len(sys.argv) > 1 else "Deploy: Update site content"
    run_command(f'git commit -m "{commit_msg}"', "Creating commit")
    run_command("git push origin gh-pages", "Pushing to GitHub")
    
    print("""
╔══════════════════════════════════════════════════════════════╗
║                    ✅ DEPLOYMENT COMPLETE!                    ║
║                                                              ║
║   Your site should be live at:                                ║
║   https://mohamdashiq.github.io/jaqman-chemicals/             ║
║                                                              ║
║   Note: It may take 1-2 minutes for changes to appear.        ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
