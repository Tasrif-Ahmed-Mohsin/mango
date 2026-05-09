# AgriCommerce - Mango E-Commerce Platform

A production-ready e-commerce platform connecting farmers to customers for agricultural products, starting with premium mangoes.

## Features

✅ **Frontend**
- Dynamic product catalog with category management
- Advanced shopping cart with persistent storage
- Product filtering and search
- Responsive design (mobile, tablet, desktop)
- Beautiful hero animations and parallax effects
- Real-time order tracking

✅ **Backend**
- RESTful API with secure authentication
- MongoDB database with Mongoose ORM
- JWT-based admin authentication
- Order management system
- Product and category management
- File upload support (Vercel Blob)

✅ **Production Ready**
- TypeScript for type safety
- Environment configuration management
- Error handling and logging
- Performance optimized (Next.js Turbopack)
- Vercel deployment ready

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4, TypeScript
- **Backend**: Node.js, Express (via Next.js API Routes)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with jose
- **Security**: bcryptjs for password hashing
- **Deployment**: Vercel, Docker compatible
- **Payments**: Stripe integration ready

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and secrets

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Vercel account (optional)

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## Deployment

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Tasrif-Ahmed-Mohsin/mango)

### Manual Deployment

Detailed deployment instructions for Vercel, Heroku, Docker, and more are available in [DEPLOYMENT.md](./DEPLOYMENT.md).

```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

## Project Structure

```
src/
├── app/                 # Next.js pages and API routes
│   ├── api/            # REST API endpoints
│   ├── page.tsx        # Homepage
│   ├── admin/          # Admin dashboard
│   ├── checkout/       # Checkout page
│   └── ...
├── components/         # Reusable React components
├── context/            # React Context (Cart, Data)
├── lib/                # Utilities and database
│   ├── mongodb.ts      # MongoDB connection
│   ├── models.ts       # Mongoose schemas
│   └── auth.ts         # JWT authentication
└── data/              # Static data and seed files
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `DELETE /api/products` - Delete product (admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order

### Authentication
- `POST /api/auth/login` - Login (admin)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/check` - Check auth status

### Upload
- `POST /api/upload` - Upload files

## Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add network access for your IP
4. Create database user
5. Copy connection string to `.env.local`

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

## Admin Access

Default admin credentials (should be changed):
- Email: `admin@agricommerce.com`
- Password: `admin123`

⚠️ **Security Note**: Change these credentials immediately in production!

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run setup      # Setup initial data
```

## Key Features Explained

### Real-Time Cart
- Items persist in browser localStorage
- Instant updates across page navigation
- Sync with backend orders

### Product Management
- Full CRUD operations for products
- Category-based organization
- Stock tracking
- Image upload support

### Admin Dashboard
- JWT-protected admin routes
- Manage products and categories
- View orders and customer data
- System analytics

### Responsive Design
- Mobile-first approach
- Optimized for all devices
- Smooth animations and transitions
- Accessible UI components

## Security Features

✅ JWT token-based authentication
✅ Password hashing with bcryptjs
✅ API route protection
✅ Environment variable management
✅ HTTPS ready
✅ CORS configuration ready

## Performance

- ✅ Next.js Turbopack build system (2s builds)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Static generation where possible
- ✅ API route caching ready

## Troubleshooting

### MongoDB Connection Issues
- Verify MONGODB_URI format
- Check IP whitelist in MongoDB Atlas
- Ensure network access is enabled

### Port in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## License

MIT License - feel free to use for commercial projects

## Support & Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Database Setup](./DATABASE_SETUP.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Live Demo

Coming soon... Check back for the deployed version!

---

**Built with ❤️ by Tasrif Ahmed Mohsin**

