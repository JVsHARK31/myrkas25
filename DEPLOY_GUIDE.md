# 🚀 Quick Deploy Guide - R-KAS ke Netlify

## ⚡ Quick Start (5 Menit)

### Opsi 1: Drag & Drop (Termudah)
1. Buka [netlify.com](https://netlify.com) dan login
2. Klik **"Add new site"** → **"Deploy manually"**
3. Drag folder `dist` ke area upload
4. ✅ Done! Aplikasi live dalam 30 detik

### Opsi 2: GitHub Auto-Deploy (Recommended)
1. Di Netlify: **"Add new site"** → **"Import from Git"**
2. Pilih GitHub → Repository: `JVsHARK31/myrkas25`
3. Build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
4. Tambah Environment Variables:
   ```
   VITE_SUPABASE_URL=https://eitaiebffulqhjalotfd.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Klik **"Deploy site"**
6. ✅ Auto-deploy setiap push ke GitHub!

## 🛠️ Build Commands

```bash
# Build production
npm run build

# Check deployment readiness
npm run deploy:check

# Build + Check in one command
npm run deploy:build
```

## 📁 Files Ready
- ✅ `dist/` - Production build
- ✅ `netlify.toml` - Build configuration
- ✅ `public/_redirects` - SPA routing
- ✅ GitHub repo connected

## 🌐 Result
Setelah deploy, aplikasi akan tersedia di:
`https://your-site-name.netlify.app`

## 🆘 Troubleshooting
- **Build error?** → Run `npm run build` locally first
- **Routing issues?** → File `_redirects` sudah dikonfigurasi
- **Env vars?** → Pastikan VITE_ variables diset di Netlify

---
**🎉 Happy Deploying!**