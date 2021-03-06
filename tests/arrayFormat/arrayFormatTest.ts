import { assert } from 'chai';
import { Db, MongoClient } from 'mongodb';
import * as path from 'path';
import seedgoose from '../../src';

let db: Db;
let client: MongoClient;

const connectDb = (dbName: string) => async () => {
  const mongoClient = await MongoClient.connect(
    `mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true }
  );
  client = mongoClient;
  db = client.db(dbName);
  await clearDatabase();
};

const clearDatabase = async () => {
  await db.dropDatabase();
};

const disconnectDb = async () => {
  await clearDatabase();
  await client.close();
};

before(connectDb('seedgoose-array-example'));
after(disconnectDb);
it('support array data format', async () => {
  await seedgoose(
    path.resolve(__dirname),
    ['seed', '-S']
  );
  const collection = db.collection('products');
  assert.equal(
    await collection.countDocuments(),
    2,
    'number of records should be 2'
  );
  collection.find().forEach((doc) => {
    assert.include(
      ['Apple iPhone X', 'Apple iPhone Xs'],
      doc.name,
      'value should be one of them'
    );
  });
});
