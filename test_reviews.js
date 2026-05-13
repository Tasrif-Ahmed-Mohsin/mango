const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb+srv://tasrifahmedmohsin:Ta%24rif118377@cluster0.wofvxpb.mongodb.net/mango?retryWrites=true&w=majority&appName=Cluster0');
  await client.connect();
  const db = client.db('mango');
  const products = await db.collection('products').find({ reviews: { $exists: true } }).toArray();
  console.log('Products with reviews:', products.length);
  if (products.length > 0) {
    console.log(JSON.stringify(products[0].reviews, null, 2));
  }
  await client.close();
}
run();
