const mongoose = require("mongoose");

const {
  DB_USER,
  DB_PASS,
  DB_TEST,
  DB_HOST,
} = process.env;

const removeAllCollections = async (mongoose) => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

const connectTestDB = async () => {
  const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_TEST}`;
  db = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  return db
}

module.exports = {
  connectTestDB,
  removeAllCollections
}