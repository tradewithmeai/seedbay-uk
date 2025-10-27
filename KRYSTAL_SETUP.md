# Krystal Auto-Deployment Setup Guide

Quick setup guide to deploy SeedBay.uk to Krystal with automatic GitHub deployments.

---

## 🎯 What We're Doing

Every time you push code to GitHub, it will automatically:
1. Build your Next.js app
2. Upload it to Krystal via FTP
3. Your site updates automatically!

---

## Step 1: Get Your Krystal FTP Credentials

You need 4 pieces of information from Krystal:

### In Your Krystal Control Panel:

1. **Find your Node.js app** (the one you just created)
2. **Look for FTP/SFTP settings** or **"File Manager"** or **"Access Details"**
3. Write down these values:

| Info Needed | Where to Find It | Example |
|-------------|------------------|---------|
| **HOST** | FTP hostname | `ftp.yourdomain.com` or `seedbay.uk` |
| **USERNAME** | FTP username | `seedbay@yourdomain.com` |
| **PASSWORD** | FTP password | (create one if needed) |
| **REMOTE DIR** | Path to your app | `/public_html` or `/home/seedbay/public_html` |

💡 **Can't find FTP settings?** Look for:
- "FTP Accounts"
- "File Manager" → "FTP Details"
- "Access" → "FTP/SFTP"
- Or create a new FTP account for this app

---

## Step 2: Add Secrets to GitHub

Now we'll add those credentials to GitHub (securely):

### Go to GitHub Secrets:
https://github.com/tradewithmeai/seedbay-uk/settings/secrets/actions

### Add These 6 Secrets:

Click **"New repository secret"** for each:

#### 1. KRYSTAL_HOST
- **Name**: `KRYSTAL_HOST`
- **Value**: Your FTP hostname (e.g., `ftp.seedbay.uk`)

#### 2. KRYSTAL_USER
- **Name**: `KRYSTAL_USER`
- **Value**: Your FTP username

#### 3. KRYSTAL_PASSWORD
- **Name**: `KRYSTAL_PASSWORD`
- **Value**: Your FTP password

#### 4. FTP_REMOTE_DIR
- **Name**: `FTP_REMOTE_DIR`
- **Value**: Your app directory path (e.g., `/public_html`)

#### 5. NEXT_PUBLIC_SUPABASE_URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://cogxunjrdqsuvlgbmokf.supabase.co`

#### 6. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZ3h1bmpyZHFzdXZsZ2Jtb2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ4MzUsImV4cCI6MjA2NjQ1MDgzNX0.bV7nN60sA8MDut1iZ5Ede0jBJGfLwkJkp5Rw-Dqlmd0`

---

## Step 3: Configure Krystal App to Run Node.js

### In your Krystal Node.js app settings:

1. **Start Command**: Set to `npm start`
2. **Build Command**: (optional) `npm run build`
3. **Node Version**: Set to `18` or `20`
4. **Auto-restart**: Enable if available

### Add Environment Variables in Krystal:

In your Krystal app settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cogxunjrdqsuvlgbmokf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZ3h1bmpyZHFzdXZsZ2Jtb2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ4MzUsImV4cCI6MjA2NjQ1MDgzNX0.bV7nN60sA8MDut1iZ5Ede0jBJGfLwkJkp5Rw-Dqlmd0` |
| `NODE_ENV` | `production` |

---

## Step 4: First Deployment

### Push the GitHub workflow to trigger deployment:

```bash
cd seedbay
git add .github/workflows/deploy.yml
git commit -m "Add Krystal auto-deployment workflow"
git push origin main
```

### Watch the deployment:

1. Go to: https://github.com/tradewithmeai/seedbay-uk/actions
2. You should see "Deploy to Krystal" running
3. Click on it to watch the progress
4. Wait for green checkmark ✅

---

## Step 5: Start Your App on Krystal

After the first deployment:

1. Go to your Krystal app dashboard
2. **Restart** or **Start** the application
3. Wait for it to show "Running"
4. Visit your domain!

---

## ✅ Done! Future Updates are Automatic

Now, every time you:
```bash
git push origin main
```

Your site will automatically update in 2-5 minutes! 🎉

---

## 🧪 Testing the Auto-Deployment

Let's test it:

1. Make a small change to your site
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
3. Watch GitHub Actions: https://github.com/tradewithmeai/seedbay-uk/actions
4. Wait for deployment to complete
5. Visit your site - the change should be live!

---

## 🐛 Troubleshooting

### "FTP connection failed"
- Check KRYSTAL_HOST is correct (no `ftp://` prefix)
- Verify FTP account exists and has correct permissions
- Try port 21 or 22

### "Build failed"
- Check all 6 GitHub secrets are set correctly
- Verify Supabase credentials are correct
- Check GitHub Actions logs for specific error

### "Site shows old version"
- Wait 5 minutes (deployment takes time)
- Check GitHub Actions completed successfully
- Restart your Krystal app
- Clear browser cache

### "App won't start on Krystal"
- Check Node.js version is 18 or 20
- Verify `npm start` is the start command
- Check environment variables are set in Krystal
- Look at application logs in Krystal

---

## 📞 Quick Reference

| What | URL |
|------|-----|
| **GitHub Repo** | https://github.com/tradewithmeai/seedbay-uk |
| **GitHub Secrets** | https://github.com/tradewithmeai/seedbay-uk/settings/secrets/actions |
| **GitHub Actions** | https://github.com/tradewithmeai/seedbay-uk/actions |
| **Krystal Panel** | https://my.krystal.uk |
| **Your Site** | https://seedbay.uk (once deployed) |

---

## 🎉 You're All Set!

Follow these steps and your site will be live with automatic deployments!
