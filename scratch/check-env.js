require('dotenv').config({ path: '.env.local' });
console.log('Original URI from .env.local:');
console.log(process.env.MONGODB_URI);
