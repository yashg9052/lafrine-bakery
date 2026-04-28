# La Farine Artisan Bakery - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup

#### Option A: MongoDB CLI (Local)
```bash
# Install MongoDB: https://docs.mongodb.com/manual/installation/

# Start MongoDB server
# Windows:
mongod

# Or use MongoDB Compass (GUI) from https://www.mongodb.com/products/compass
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env` file with your connection string

### 3. Run the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

---

## API Endpoints with Postman Test URLs

### 📋 Health Check
```
GET http://localhost:5000/api/health
```

### 🍞 Menu Endpoints

**Get All Menu Items**
```
GET http://localhost:5000/api/menu
GET http://localhost:5000/api/menu?cat=bread
GET http://localhost:5000/api/menu?cat=pastry
GET http://localhost:5000/api/menu?cat=cake
GET http://localhost:5000/api/menu?cat=drink
```

**Get Single Menu Item**
```
GET http://localhost:5000/api/menu/:id
```

**Add New Menu Item (Admin)**
```
POST http://localhost:5000/api/menu

Body (JSON):
{
  "name": "Sourdough Loaf",
  "cat": "bread",
  "price": 280,
  "tag": "new",
  "desc": "Long-fermented, crispy crust, chewy crumb",
  "image": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df"
}
```

---

### 🎉 Sale Items Endpoints

**Get Current Sale Items**
```
GET http://localhost:5000/api/sale
```

**Create Sale Item (Admin)**
```
POST http://localhost:5000/api/sale

Body (JSON):
{
  "name": "Opera Cake (Whole)",
  "originalPrice": 560,
  "salePrice": 280,
  "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  "expiresAt": 1715349600000,
  "quantity": 1,
  "reason": "Cancelled order - Flash sale!"
}
```

**Delete Sale Item**
```
DELETE http://localhost:5000/api/sale/:id
```

---

### 📦 Order Endpoints

**Place New Order**
```
POST http://localhost:5000/api/orders

Body (JSON):
{
  "customer": {
    "name": "John Doe",
    "phone": "+91-9876543210",
    "email": "john@example.com"
  },
  "items": [
    { "itemId": "1", "name": "Sourdough Loaf", "price": 280 },
    { "itemId": "2", "name": "Butter Croissant", "price": 120 }
  ],
  "orderType": "pickup",
  "pickupTime": "2025-04-28T15:30:00",
  "notes": "Please keep it warm"
}
```

**Get Order Details**
```
GET http://localhost:5000/api/orders/:orderId
```

**List All Orders (Admin)**
```
GET http://localhost:5000/api/orders
GET http://localhost:5000/api/orders?status=pending
GET http://localhost:5000/api/orders?status=confirmed
```

**Update Order Status (Admin)**
```
PATCH http://localhost:5000/api/orders/:orderId

Body (JSON):
{
  "status": "confirmed"
}

Valid statuses: pending, confirmed, ready, completed, cancelled
```

---

### 💳 Payment Endpoints

**Initiate Payment (Full)**
```
POST http://localhost:5000/api/payment/initiate

Body (JSON):
{
  "orderId": "ORD-1715349600000",
  "amount": 400,
  "method": "card",
  "isPartial": false,
  "partialAmount": 0
}

Methods: card, upi, wallet, cod
```

**Initiate Partial Payment**
```
POST http://localhost:5000/api/payment/initiate

Body (JSON):
{
  "orderId": "ORD-1715349600000",
  "amount": 400,
  "method": "upi",
  "isPartial": true,
  "partialAmount": 200
}
```

**Verify Payment**
```
POST http://localhost:5000/api/payment/verify

Body (JSON):
{
  "paymentId": "PAY-1715349600000",
  "orderId": "ORD-1715349600000"
}
```

**Get Payment Status**
```
GET http://localhost:5000/api/payment/:paymentId
```

---

### 📍 Geo Endpoints

**Get Bakery Location**
```
GET http://localhost:5000/api/bakery/location
```

---

## Database Schema

### MenuItem
```javascript
{
  _id: ObjectId,
  name: String,
  cat: String (enum: bread, pastry, cake, drink),
  price: Number,
  tag: String,
  desc: String,
  image: String,
  available: Boolean,
  createdAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  orderId: String (unique),
  customer: {
    name: String,
    phone: String,
    email: String
  },
  items: Array,
  orderType: String (enum: pickup, delivery),
  pickupTime: String,
  notes: String,
  totalAmount: Number,
  status: String (enum: pending, confirmed, ready, completed, cancelled),
  payment: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### SaleItem
```javascript
{
  _id: ObjectId,
  name: String,
  originalPrice: Number,
  salePrice: Number,
  image: String,
  expiresAt: Date,
  quantity: Number,
  reason: String,
  createdAt: Date
}
```

### Payment
```javascript
{
  _id: ObjectId,
  paymentId: String (unique),
  orderId: String,
  amount: Number,
  method: String (enum: card, upi, wallet, cod),
  isPartial: Boolean,
  partialAmount: Number,
  status: String (enum: pending, success, failed),
  transactionRef: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing with Postman

1. **Create a Postman Collection**
   - Click "New" → "Collection"
   - Name it "La Farine API"

2. **Import URLs**
   - See endpoint URLs above

3. **Set Environment Variables** (optional)
   - `baseUrl`: http://localhost:5000
   - `orderId`: ORD-1715349600000 (for testing)

4. **Test Flow**
   - GET Menu Items
   - POST Create Order
   - POST Initiate Payment
   - POST Verify Payment
   - GET Order Status

---

## MongoDB CLI Commands

```bash
# Start MongoDB
mongod

# Open MongoDB Shell
mongosh

# List databases
show databases

# Use la-farine database
use la-farine

# List collections
show collections

# View menu items
db.menuitems.find()

# View orders
db.orders.find()

# View sale items
db.saleitems.find()

# Clear collection
db.menuitems.deleteMany({})
```

---

## Environment Variables

Update `.env` file:
```
MONGO_URI=mongodb://localhost:27017/la-farine
PORT=5000
NODE_ENV=development
```

---

## Troubleshooting

**MongoDB Connection Error**
- Make sure MongoDB is running: `mongod`
- Check MONGO_URI in .env file
- Verify MongoDB port (default: 27017)

**Port 5000 Already in Use**
- Change PORT in .env file
- Or kill process: `lsof -i :5000` then `kill -9 <PID>`

**CORS Errors**
- Frontend proxy configured in package.json
- Backend CORS middleware enabled

---

## Next Steps

1. Start MongoDB
2. Run backend: `npm run dev`
3. Test endpoints in Postman
4. Connect frontend to backend
5. Add authentication if needed
