module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async up(db, client) {
    await db.createCollection('user')
    await db.createCollection('lobby')
    await db.createCollection('game')
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async down(db, client) {
    await db.collection('game').drop()
    await db.collection('lobby').drop()
    await db.collection('user').drop()
  }
}
