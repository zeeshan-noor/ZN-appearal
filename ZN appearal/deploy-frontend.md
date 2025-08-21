# 🚀 Quick Frontend Deployment

## **Your Backend is Already Live!**
- **API URL**: https://postgres-production-9a87.up.railway.app
- **Status**: ✅ Running successfully

## **Deploy Frontend in 5 Minutes**

### **Step 1: Go to Vercel**
Visit: https://vercel.com/new

### **Step 2: Import Your Repository**
1. Connect your GitHub account
2. Select your ZN Apparel repository
3. Click "Import"

### **Step 3: Configure Project**
Set these settings:
- **Framework Preset**: `Next.js`
- **Root Directory**: `apps/web` ⭐ **IMPORTANT**
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### **Step 4: Add Environment Variable**
Add this environment variable:
- **Name**: `NEXT_PUBLIC_API_BASE_URL`
- **Value**: `https://postgres-production-9a87.up.railway.app`

### **Step 5: Deploy**
Click "Deploy" and wait for build to complete!

## **Alternative: Deploy from Web Directory**

If the above doesn't work, try this approach:

1. **Go to**: https://vercel.com/new
2. **Import Repository**: Select your repo
3. **Settings**:
   - **Framework**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://postgres-production-9a87.up.railway.app`
5. **Deploy**

## **Test Your Live Application**

### **Admin Access**
- **URL**: `https://your-app.vercel.app/admin`
- **Email**: `admin@znapparel.com`
- **Password**: `Admin123!`

### **Features to Test**
1. ✅ Browse product catalog
2. ✅ Search and filter products
3. ✅ Admin product management
4. ✅ Inventory tracking with quantities
5. ✅ Image uploads
6. ✅ Real-time stock management

## **Your Live URLs**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://postgres-production-9a87.up.railway.app`
- **API Docs**: `https://postgres-production-9a87.up.railway.app/docs`

## **Troubleshooting**

If you get package name errors:
1. ✅ Package names are now fixed: `zn-apparel`, `zn-apparel-web`, `zn-apparel-api`
2. ✅ Root directory must be: `apps/web`
3. ✅ Environment variable must be set correctly

**🎉 Your ZN Apparel e-commerce platform will be live!**
