# 🚀 WeddingPro Deployment Guide

## Netlify Deployment

### Quick Setup
1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Auto-Deploy**: Netlify will automatically use the `netlify.toml` configuration
3. **Environment Variables**: Add your Supabase credentials in Netlify dashboard

### Environment Variables Required
Go to Netlify Dashboard → Site Settings → Environment Variables and add:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Configuration
The repository includes `netlify.toml` with optimal settings:
- **Build Command**: `npm run build:netlify` (with relaxed CI settings)
- **Publish Directory**: `dist`
- **Node.js Version**: 18
- **SPA Redirects**: Configured for React Router

### Manual Deploy Steps
If you prefer manual deployment:

1. **Clone repository**:
   ```bash
   git clone https://github.com/Ashish-yolo/weddings-pro.git
   cd weddings-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Build project**:
   ```bash
   npm run build:netlify
   ```

5. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

## Vercel Deployment

### Quick Setup
1. **Connect Repository**: Import project from GitHub in Vercel dashboard
2. **Auto-Deploy**: Vercel will automatically detect Vite configuration
3. **Environment Variables**: Add Supabase credentials in Vercel dashboard

### Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Configuration
Vercel automatically detects:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Manual/Custom Server Deployment

### Prerequisites
- Node.js 18+
- Web server (Nginx, Apache, or similar)

### Build Steps
1. **Prepare environment**:
   ```bash
   npm install
   npm run build
   ```

2. **Configure web server**:
   - Point document root to `dist` folder
   - Configure SPA fallback to `index.html`
   - Set up HTTPS (recommended)

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/weddings-pro/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Database Setup

### Supabase Configuration
1. **Create Supabase Project**: Visit [supabase.com](https://supabase.com)
2. **Get Credentials**: Copy URL and anon key from project settings
3. **Set up Database**: The app will create tables automatically on first use

### Database Schema
The app creates these tables automatically:
- `profiles` - User profiles
- `weddings` - Wedding information
- `guests` - RSVP data
- `plus_ones` - Additional guests
- `photos` - Photo management
- `love_story_events` - Custom timeline events

### Storage Configuration
1. **Create Buckets**: 
   - `wedding-images` (for cover photos)
   - `wedding-photos` (for guest uploads)
2. **Set Policies**: RLS policies are automatically applied

## Environment Variables Reference

### Required Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional Variables
- `VITE_APP_ENV` - Set to `production` for production builds

## Troubleshooting

### Build Failures
- **ESLint Errors**: Use `npm run build:netlify` instead of `npm run build`
- **Node Version**: Ensure Node.js 18+ is being used
- **Memory Issues**: Increase build memory with `NODE_OPTIONS=--max-old-space-size=4096`

### Runtime Issues
- **Blank Page**: Check browser console for errors
- **API Errors**: Verify Supabase credentials are correct
- **Routing Issues**: Ensure SPA fallback is configured on your server

### Performance Optimization
- **Enable Gzip**: Configure your server to compress static assets
- **CDN**: Use a CDN for faster global delivery
- **Caching**: Set appropriate cache headers for static assets

## Security Checklist

### Before Production
- ✅ Environment variables are set (not hardcoded)
- ✅ Supabase RLS policies are enabled
- ✅ HTTPS is configured
- ✅ Security headers are set
- ✅ File upload limits are appropriate

### Monitoring
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor performance metrics
- Set up uptime monitoring
- Configure backup strategies

## Support

### Documentation
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev/guide/)

### Common Issues
- Check the GitHub repository issues for solutions
- Ensure all environment variables are properly set
- Verify Supabase project is active and accessible

---

**Last Updated**: ${new Date().toLocaleDateString()}  
**Platform Version**: WeddingPro v1.0  
**Build Tools**: Vite 7.0.6, React 18, TypeScript