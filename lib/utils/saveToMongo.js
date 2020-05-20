module.exports = function saveToMongo(document) {
  const db = this.mongoClient.db(process.env.MONGO_DATABASE_NAME);
  const collection = db.collection(process.env.MONGO_INGESTED_COLLECTION);
  return collection.insertOne(document);
};
