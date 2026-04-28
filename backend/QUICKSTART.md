## 🚀 QUICK START GUIDE

### Step 1: Install MongoDB
Download from: https://www.mongodb.com/try/download/community

### Step 2: Start MongoDB Server
```bash
# Windows (if installed via installer)
mongod

# Or use MongoDB Compass GUI from: https://www.mongodb.com/products/compass
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 4: Seed Initial Data
```bash
npm run seed
```

### Step 5: Start Backend Server
```bash
npm run dev
```

You should see:
```
✓ MongoDB connected
🍞 La Farine Backend running on http://localhost:5000
```

### Step 6: Test APIs with Postman

**Option A: Import Collection**
1. Open Postman
2. Click "Import"
3. Select `backend/La-Farine-API.postman_collection.json`

**Option B: Manual Testing**
```
GET http://localhost:5000/api/health
GET http://localhost:5000/api/menu
GET http://localhost:5000/api/sale
```

### Step 7: Connect Frontend
Frontend is already configured to use the backend on port 5000!

---

## 📝 Frontend is Already Updated

The frontend (`frontend/src/services/api.js`) is configured to call:
- Base URL: `http://localhost:5000/api`

When you run `npm run dev` in the frontend folder, it proxies requests to the backend automatically.

---

## 🛠️ Common Commands

```bash
# Backend
npm run dev              # Start with auto-reload
npm start               # Start production
npm run seed            # Load sample data

# MongoDB
mongosh                 # Open MongoDB shell
show databases          # List all databases
use la-farine          # Switch to la-farine DB
db.menuitems.find()    # View menu items
db.orders.find()       # View orders
```

---

## ✅ API Testing Checklist

- [ ] GET /api/health → Check server status
- [ ] GET /api/menu → Fetch all menu items
- [ ] GET /api/menu?cat=bread → Filter by category
- [ ] GET /api/sale → View sale items
- [ ] POST /api/orders → Place order
- [ ] POST /api/payment/initiate → Initiate payment
- [ ] POST /api/payment/verify → Verify payment
- [ ] GET /api/bakery/location → Get location

---

## 📚 Full Documentation
See `README.md` for complete API documentation
