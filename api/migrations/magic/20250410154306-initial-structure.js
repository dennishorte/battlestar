module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection('counters')
    await db.createCollection('cube')
    await db.createCollection('custom_cards')
    await db.createCollection('deck')
    await db.createCollection('scryfall')
    await db.createCollection('versions')
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('versions').drop()
    await db.collection('scryfall').drop()
    await db.collection('deck').drop()
    await db.collection('custom_cards').drop()
    await db.collection('cube').drop()
    await db.collection('counters').drop()
  }
};
