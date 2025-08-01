# 🚀 Panduan Deployment R-KAS ke Netlify

## 📋 Persiapan

Aplikasi R-KAS telah disiapkan untuk deployment ke Netlify dengan konfigurasi berikut:
- ✅ Build production telah dibuat (`npm run build`)
- ✅ File `_redirects` untuk SPA routing
- ✅ File `netlify.toml` untuk konfigurasi build
- ✅ Repository GitHub tersedia di: https://github.com/JVsHARK31/myrkas25.git

## 🎯 Metode Deployment

### Metode 1: Drag & Drop (Paling Mudah)

1. **Buka Netlify**
   - Kunjungi [netlify.com](https://netlify.com)
   - Login atau daftar akun baru

2. **Deploy Manual**
   - Klik "Add new site" → "Deploy manually"
   - Drag & drop folder `dist` ke area upload
   - Tunggu proses deployment selesai

3. **Konfigurasi Domain**
   - Setelah deploy, klik "Site settings"
   - Ubah site name sesuai keinginan
   - Domain akan menjadi: `https://nama-site.netlify.app`

### Metode 2: GitHub Integration (Recommended)

1. **Connect Repository**
   - Di Netlify, klik "Add new site" → "Import an existing project"
   - Pilih "GitHub" dan authorize akses
   - Pilih repository: `JVsHARK31/myrkas25`

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Masuk ke "Site settings" → "Environment variables"
   - Tambahkan variabel berikut:
   ```
   VITE_SUPABASE_URL=https://eitaiebffulqhjalotfd.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Deploy**
   - Klik "Deploy site"
   - Netlify akan otomatis build dan deploy
   - Setiap push ke GitHub akan trigger auto-deploy

## 🔧 Konfigurasi Tambahan

### Custom Domain
1. Beli domain dari provider (Namecheap, GoDaddy, dll)
2. Di Netlify: "Site settings" → "Domain management"
3. Klik "Add custom domain"
4. Update DNS records di domain provider:
   ```
   Type: CNAME
   Name: www
   Value: nama-site.netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

### SSL Certificate
- Netlify otomatis menyediakan SSL certificate gratis
- Aktif dalam 24 jam setelah domain setup

### Form Handling
Jika ada form di aplikasi:
1. Tambahkan `netlify` attribute ke form
2. Netlify akan otomatis handle form submissions

## 📊 Monitoring & Analytics

### Netlify Analytics
- Aktifkan di "Site settings" → "Analytics"
- Monitor traffic, performance, dan errors

### Performance Optimization
1. **Asset Optimization**
   - Netlify otomatis compress images
   - Minify CSS/JS

2. **CDN**
   - Global CDN otomatis aktif
   - Fast loading worldwide

## 🚨 Troubleshooting

### Build Errors
```bash
# Jika build gagal, cek di local:
npm run build

# Update dependencies:
npm update
```

### Routing Issues
- File `_redirects` sudah dikonfigurasi untuk SPA
- Semua routes akan redirect ke `index.html`

### Environment Variables
- Pastikan semua VITE_ variables sudah diset
- Restart deployment setelah update env vars

## 📱 Mobile Optimization

Aplikasi sudah responsive dengan:
- Tailwind CSS responsive classes
- Mobile-first design
- Touch-friendly interface

## 🔐 Security

Konfigurasi security headers sudah diset di `netlify.toml`:
- X-Frame-Options: DENY
- X-XSS-Protection: enabled
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 📞 Support

Jika ada masalah:
1. Cek Netlify deploy logs
2. Verify environment variables
3. Test build locally dengan `npm run build`
4. Cek browser console untuk errors

---

**🎉 Selamat! Aplikasi R-KAS siap di-deploy ke Netlify!**

URL Demo: `https://nama-site.netlify.app`
GitHub: https://github.com/JVsHARK31/myrkas25.git