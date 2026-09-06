# Deployment Guide

This guide explains how to deploy ChainBounty documentation to Vercel with a custom domain.

---

## Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository connected to Vercel
- Custom domain (e.g., `docs.chainbounty.dev`)

---

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Log in to Vercel** at [vercel.com](https://vercel.com)
2. **Click "Add New Project"**
3. **Import your GitHub repository:**
   - Select `chainbounty-docs`
4. **Configure build settings:**
   - Framework Preset: **Docusaurus**
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Click "Deploy"**

Vercel automatically detects `vercel.json` configuration.

---

### Option 2: Deploy via Vercel CLI

Install Vercel CLI:

```bash
npm install -g vercel
```

Deploy:

```bash
cd chainbounty-docs
vercel --prod
```

Follow the prompts to link your project.

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click **Settings → Domains**
3. Add your domain: `docs.chainbounty.dev`
4. Vercel provides DNS records to configure

### Step 2: Configure DNS

Add the following DNS records in your domain provider:

**For subdomain (docs.chainbounty.dev):**

```
Type: CNAME
Name: docs
Value: cname.vercel-dns.com
```

**For apex domain (chainbounty.dev):**

```
Type: A
Name: @
Value: 76.76.21.21
```

### Step 3: Verify

Vercel automatically provisions an SSL certificate via Let's Encrypt. Wait 1-2 minutes, then visit:

```
https://docs.chainbounty.dev
```

---

## Automatic Deployments

Vercel automatically deploys on every push to the `main` branch.

### Production (main branch)

```bash
git push origin main
```

Deploys to: `https://docs.chainbounty.dev`

### Preview (feature branches)

```bash
git checkout -b feature/new-guide
git push origin feature/new-guide
```

Deploys to: `https://chainbounty-docs-<hash>.vercel.app`

---

## Environment Variables

No environment variables are required for the docs site. If you add environment-dependent features in the future:

1. Go to **Settings → Environment Variables**
2. Add variables for **Production**, **Preview**, or **Development**
3. Redeploy to apply

---

## Sitemap

The sitemap is auto-generated on build and available at:

```
https://docs.chainbounty.dev/sitemap.xml
```

Submit to Google Search Console for better indexing.

---

## robots.txt

Create `static/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://docs.chainbounty.dev/sitemap.xml
```

---

## Analytics (Optional)

### Google Analytics

Add to `docusaurus.config.ts`:

```typescript
presets: [
  [
    'classic',
    {
      // ... existing config
      gtag: {
        trackingID: 'G-XXXXXXXXXX',
        anonymizeIP: true,
      },
    },
  ],
],
```

### Vercel Analytics

Add `@vercel/analytics`:

```bash
npm install @vercel/analytics
```

In `src/theme/Root.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function Root({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

---

## Monitoring

### Build Status

Monitor builds in Vercel dashboard:

- **Deployments tab** — see all builds and logs
- **Build logs** — debug failed builds
- **Runtime logs** — check 404s and errors

### Performance

Vercel provides:

- **Lighthouse scores** — performance, accessibility, SEO
- **Web Vitals** — real-user metrics
- **Edge caching** — automatic CDN

---

## Troubleshooting

### Build fails with "Module not found"

```bash
# Locally test the build
npm run build
```

Fix any broken imports or missing files.

### Custom domain not working

- **Check DNS propagation:** [dnschecker.org](https://dnschecker.org)
- **Verify CNAME/A record** is correct
- **Wait up to 48 hours** for DNS to propagate

### 404 on `/docs`

Redirect is configured in `vercel.json`. If missing, add:

```json
{
  "redirects": [
    {
      "source": "/docs",
      "destination": "/docs/intro",
      "permanent": true
    }
  ]
}
```

---

## CI/CD Best Practices

### Branch Protection

Enable branch protection on `main`:

1. Go to GitHub **Settings → Branches**
2. Add rule for `main`
3. Require **pull request reviews** before merging
4. Require **status checks to pass** (Vercel build)

### Preview Deployments

Every PR gets a unique preview URL. Share with reviewers:

```
https://chainbounty-docs-git-<branch>-<team>.vercel.app
```

### Rollback

If a deployment breaks production:

1. Go to **Deployments** in Vercel
2. Find the last working deployment
3. Click **Promote to Production**

---

## Cost

Docusaurus static sites are **free on Vercel** (Hobby plan):

- Unlimited bandwidth
- Automatic SSL
- Global CDN
- 100 GB-hours of build time/month

---

## Security Headers

Configured in `vercel.json`:

- **X-Content-Type-Options: nosniff** — prevent MIME sniffing
- **X-Frame-Options: DENY** — prevent clickjacking
- **X-XSS-Protection: 1; mode=block** — enable browser XSS filter
- **Referrer-Policy: strict-origin-when-cross-origin** — control referrer info

---

## Performance Optimizations

### Image Optimization

Use `static/img/` for images. Vercel auto-optimizes:

- WebP format
- Lazy loading
- Responsive sizes

### Caching

Static assets are cached with:

```
Cache-Control: public, max-age=31536000, immutable
```

HTML pages are cached with:

```
Cache-Control: public, max-age=0, must-revalidate
```

---

## Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
```

### Rebuild Sitemap

Sitemap is auto-generated on every build. No manual action needed.

### Monitor Broken Links

Run locally:

```bash
npm run build
npx http-server build
```

Check for 404s in the build output.

---

## Related

- [Vercel Documentation](https://vercel.com/docs)
- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)
- [Custom Domains on Vercel](https://vercel.com/docs/concepts/projects/domains)

---

## Support

For deployment issues:

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **ChainBounty Discord:** [discord.gg/chainbounty](https://discord.gg/chainbounty)
