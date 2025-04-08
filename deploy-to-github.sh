#!/bin/bash

# Add all changes
git add .

# Commit changes
git commit -m "Fix GitHub Pages deployment configuration"

# Push to main branch
git push origin main

echo "Changes pushed to GitHub. Please check the Actions tab for deployment status." 