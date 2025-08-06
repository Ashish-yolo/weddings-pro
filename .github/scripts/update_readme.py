#!/usr/bin/env python3
"""
GitHub Actions script to automatically update README.md with a list of markdown files.
This script finds all .md files (excluding node_modules and .git) and updates the README
with a formatted list of documentation files.
"""

import os
import glob
import re
from pathlib import Path


def find_markdown_files():
    """Find all markdown files in the repository, excluding node_modules and .git."""
    markdown_files = []
    root_dir = Path('.')
    
    # Find all .md files recursively
    for md_file in root_dir.rglob('*.md'):
        # Skip files in node_modules, .git, and other ignored directories
        if any(part in md_file.parts for part in ['node_modules', '.git', '.github']):
            continue
            
        # Convert to relative path from repository root
        relative_path = md_file.relative_to(root_dir)
        markdown_files.append(relative_path)
    
    # Sort files: README.md first, then alphabetically
    markdown_files.sort(key=lambda x: (x.name != 'README.md', str(x).lower()))
    
    return markdown_files


def generate_markdown_list(markdown_files):
    """Generate a formatted markdown list of documentation files."""
    if not markdown_files:
        return "No markdown files found."
    
    markdown_list = []
    markdown_list.append("## 📚 Documentation Files")
    markdown_list.append("")
    
    for file_path in markdown_files:
        if file_path.name == 'README.md':
            continue  # Skip README.md itself
            
        # Create a nice display name from the file path
        display_name = file_path.stem.replace('-', ' ').replace('_', ' ').title()
        
        # Create relative link
        link = f"[{display_name}]({file_path})"
        
        # Add description based on file name patterns
        description = get_file_description(file_path.name)
        if description:
            link += f" - {description}"
            
        markdown_list.append(f"- {link}")
    
    markdown_list.append("")
    markdown_list.append("*This list is automatically updated by GitHub Actions.*")
    markdown_list.append("")
    
    return "\n".join(markdown_list)


def get_file_description(filename):
    """Get a description for common file patterns."""
    descriptions = {
        'wedding-pro-development.md': 'Comprehensive Product Requirements Document for the WeddingPro platform',
        'CHANGELOG.md': 'Version history and release notes',
        'CONTRIBUTING.md': 'Guidelines for contributing to this project',
        'LICENSE.md': 'Project license information',
        'INSTALLATION.md': 'Installation and setup instructions',
        'API.md': 'API documentation and endpoints',
        'DEPLOYMENT.md': 'Deployment and hosting instructions',
        'TROUBLESHOOTING.md': 'Common issues and solutions',
    }
    
    return descriptions.get(filename, '')


def update_readme(markdown_files):
    """Update README.md with the list of markdown files."""
    readme_path = Path('README.md')
    
    # Read existing README content
    if readme_path.exists():
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = "# WeddingPro\n\nA comprehensive wedding management platform.\n\n"
    
    # Generate new markdown list
    new_section = generate_markdown_list(markdown_files)
    
    # Define markers for the auto-generated section
    start_marker = "<!-- AUTO-GENERATED-DOCS-START -->"
    end_marker = "<!-- AUTO-GENERATED-DOCS-END -->"
    
    # Check if markers exist
    if start_marker in content and end_marker in content:
        # Replace existing section
        pattern = f"{re.escape(start_marker)}.*?{re.escape(end_marker)}"
        replacement = f"{start_marker}\n{new_section}\n{end_marker}"
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    else:
        # Add new section at the end
        if not content.endswith('\n'):
            content += '\n'
        new_content = content + f"\n{start_marker}\n{new_section}\n{end_marker}\n"
    
    # Write updated content back to README
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Updated README.md with {len(markdown_files)} markdown files")
    for file_path in markdown_files:
        if file_path.name != 'README.md':
            print(f"   - {file_path}")


def main():
    """Main function to run the README update process."""
    print("🔍 Searching for markdown files...")
    
    # Find all markdown files
    markdown_files = find_markdown_files()
    
    if not markdown_files:
        print("❌ No markdown files found!")
        return
    
    print(f"📝 Found {len(markdown_files)} markdown files")
    
    # Update README.md
    update_readme(markdown_files)
    
    print("🎉 README.md update completed successfully!")


if __name__ == "__main__":
    main()