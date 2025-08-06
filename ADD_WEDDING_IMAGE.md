# 📸 How to Add Your Wedding Photo

## Quick Steps (2 minutes)

### 1. Get Your Wedding Photo
- **Size**: At least 1200×800 pixels (landscape orientation)
- **Format**: JPG, PNG, or WebP
- **Quality**: High resolution, clear and bright

### 2. Rename & Place the Photo
```bash
# Rename your photo to: hero-wedding.jpg
# Place it in the public/images/ folder:
/public/images/hero-wedding.jpg
```

### 3. That's It! 
Your photo will automatically appear on the homepage with:
- ✅ Perfect 16:10 aspect ratio
- ✅ Responsive design (mobile + desktop)
- ✅ Professional shadow and rounded corners
- ✅ Automatic fallback if image doesn't load

## File Structure
```
weddings-pro/
├── public/
│   └── images/
│       └── hero-wedding.jpg  ← Place your photo here
├── src/
└── ...
```

## Recommended Photo Sources
### Free Options
- **Unsplash**: [unsplash.com](https://unsplash.com/s/photos/wedding)
- **Pexels**: [pexels.com](https://www.pexels.com/search/wedding/)

### Search Terms
- "wedding ceremony"
- "happy wedding couple" 
- "wedding celebration"
- "bride groom outdoor"

## Current Fallback
If no photo is found, users see:
- Clean gradient background (pink → purple → blue)
- Simple 💒 church icon
- Message: "Add your wedding photo here"

## Technical Details
The image code automatically:
- Handles missing images gracefully
- Optimizes for different screen sizes  
- Maintains aspect ratio across devices
- Includes subtle overlay for text readability