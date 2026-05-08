# Database Setup Guide - AgriCommerce

This guide will help you set up MongoDB for the AgriCommerce application. The application currently works with or without MongoDB (using localStorage as fallback).

## Quick Start (Without MongoDB)

The application works out of the box! All data will be stored in:
- **LocalStorage** (browser) for products, categories, and cart
- **Orders** will be saved locally and can be migrated to MongoDB later

No additional setup required. Just run:
```bash
npm run dev
```

---

## Production Setup (With MongoDB)

### Option 1: MongoDB Atlas (Cloud - Recommended)

MongoDB Atlas is the easiest way to get started with a cloud-hosted MongoDB database.

#### Steps:

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Click "Create" to create a new project

2. **Create a Database Cluster**
   - Select "Build a Database"
   - Choose "Free Tier" (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"
   - Wait 2-3 minutes for cluster to initialize

3. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (for development)
   - Or add your specific IP address

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Add user with "Read and write to any database"

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Drivers"
   - Copy the connection string

6. **Add to Environment Variables**
   - Create a `.env.local` file in project root:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agricommerce?retryWrites=true&w=majority
   ```
   - Replace `username`, `password`, and `cluster` with your values

7. **Verify Connection**
   ```bash
   npm run dev
   # Check console for "MongoDB connected" message
   ```

---

### Option 2: Local MongoDB Installation

If you prefer to run MongoDB locally:

#### Windows:

1. **Download MongoDB Community**
   - Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Download Windows MSI installer
   - Run installer and follow setup wizard
   - Choose "Install MongoDB as a Service" for auto-start

2. **Verify Installation**
   ```bash
   mongosh
   ```

3. **Add Connection String to `.env.local`**
   ```env
   MONGODB_URI=mongodb://localhost:27017/agricommerce
   ```

#### Mac:

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Add to .env.local
# MONGODB_URI=mongodb://localhost:27017/agricommerce
```

#### Linux:

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start service
sudo systemctl start mongod

# Add to .env.local
# MONGODB_URI=mongodb://localhost:27017/agricommerce
```

---

## Testing Database Connection

After setting `MONGODB_URI`, check the Next.js console:

```
✅ MongoDB connected successfully
```

If you see a warning instead:
```
⚠️  MONGODB_URI not set. Using in-memory storage as fallback.
```

Double-check your `.env.local` file and ensure:
- Environment variable is set
- Connection string is correct
- Network access is allowed
- Database user credentials are valid

---

## Database Structure

### Collections

The application uses three main collections:

#### 1. **orders**
```json
{
  "orderId": "ORD-1234567890",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "NYC",
    "state": "NY",
    "zip": "10001"
  },
  "items": [
    {
      "productId": "p_123",
      "name": "Organic Tomatoes",
      "price": 299,
      "quantity": 2
    }
  ],
  "totals": {
    "subtotal": 598,
    "shipping": 50,
    "tax": 59.8,
    "total": 707.8
  },
  "status": "confirmed",
  "createdAt": "2026-05-08T...",
  "updatedAt": "2026-05-08T..."
}
```

#### 2. **categories**
```json
{
  "id": "fruit_001",
  "name": "Fruits",
  "description": "Fresh tropical fruits",
  "icon": "🍎",
  "image": "/uploads/fruit.jpg",
  "bgColor": "bg-blue-100",
  "createdAt": "2026-05-08T...",
  "updatedAt": "2026-05-08T..."
}
```

#### 3. **products**
```json
{
  "id": "p_001",
  "categoryId": "fruit_001",
  "name": "Organic Tomatoes",
  "price": 299,
  "description": "Fresh organic tomatoes from local farms",
  "stock": 50,
  "unit": "kg",
  "farmer": "Green Valley Farm",
  "image": "/uploads/tomato.jpg",
  "emoji": "🍅",
  "createdAt": "2026-05-08T...",
  "updatedAt": "2026-05-08T..."
}
```

---

## API Endpoints

### Orders API
- **POST** `/api/orders` - Create new order
- **GET** `/api/orders` - Fetch all orders

### Categories API
- **GET** `/api/categories` - Fetch all categories
- **POST** `/api/categories` - Create category
- **DELETE** `/api/categories` - Delete category

### Products API
- **GET** `/api/products` - Fetch all products
- **POST** `/api/products` - Create product
- **DELETE** `/api/products` - Delete product

---

## Migration: LocalStorage to MongoDB

To migrate existing data from browser localStorage to MongoDB:

1. Set up MongoDB and add `MONGODB_URI` to `.env.local`
2. Export data from browser console:
   ```javascript
   // In browser DevTools console
   copy(JSON.stringify({
     categories: JSON.parse(localStorage.getItem('agri_categories')),
     products: JSON.parse(localStorage.getItem('agri_products')),
     orders: JSON.parse(localStorage.getItem('orders'))
   }))
   ```
3. Create migration API endpoint (coming soon)
4. Run migration

---

## Troubleshooting

### Connection Refused
- Check MongoDB service is running
- Verify connection string is correct
- Check firewall settings

### Authentication Failed
- Verify database user credentials
- Check special characters in password (URL encode them)
- Ensure user has correct permissions

### Network Access Denied (Atlas)
- Go to Network Access in Atlas
- Add your IP address or allow all IPs

### Still Using LocalStorage?
- Check `.env.local` file exists
- Restart dev server after adding env var
- Check browser console for error messages

---

## Performance Tips

1. **Indexing**: MongoDB automatically indexes `_id`, but add indexes for:
   - `orderId` (in orders)
   - `categoryId` (in products)
   - `email` (in orders for customer lookups)

2. **Pagination**: For large datasets, implement pagination in list endpoints

3. **Caching**: Use Redis or CDN for frequently accessed data

---

## Next Steps

- ✅ Database setup complete
- 🔲 Add email notifications
- 🔲 Implement payment gateway (Stripe)
- 🔲 Add search and filtering
- 🔲 Create admin order management panel
- 🔲 Set up automated backups

---

For more help, visit:
- [MongoDB Documentation](https://docs.mongodb.com)
- [Next.js MongoDB Guide](https://nextjs.org/learn-pages/basics/data-persistence/mongodb)
