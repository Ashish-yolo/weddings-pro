# Adding a Wedding Hero Image

## Current Status
The homepage now includes a beautiful wedding-themed hero section with:
- ✨ Animated wedding emojis (💒💍💕💐)
- 🎨 Beautiful gradient background (pink → purple → indigo)
- 💖 Floating hearts and romantic elements
- 📱 Responsive design with hover effects
- 🌍 Multi-language caption support

## To Add a Real Wedding Image

### Option 1: Replace CSS Background (Recommended)
Update the gradient background in `src/pages/LandingPage.tsx` at line ~90:

```css
/* Replace this gradient */
<div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">

/* With a background image */
<div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200" 
     style={{backgroundImage: 'url("/images/hero-wedding.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
```

### Option 2: Add `<img>` Element
Replace the gradient div with:

```jsx
<img 
  src="/images/hero-wedding.jpg" 
  alt="Beautiful wedding ceremony" 
  className="absolute inset-0 w-full h-full object-cover"
/>
```

### Image Specifications
- **Size**: Minimum 1200x800px (16:10 aspect ratio)
- **Format**: JPG or WebP for best performance
- **Quality**: High resolution, professional photography
- **Content**: Joyful wedding moment, diverse representation welcome
- **Lighting**: Romantic, warm lighting preferred

### File Location
Place your wedding image at:
```
/public/images/hero-wedding.jpg
```

### Fallback Design
The current gradient + emoji design works beautifully as a fallback and maintains the wedding theme even without a photo.

## Alternative: Stock Photo Services
Consider these sources for wedding images:
- Unsplash (free, high quality)
- Pexels (free)
- Getty Images (premium)
- Shutterstock (premium)

Search terms: "wedding ceremony", "happy couple", "wedding celebration", "bride groom joy"