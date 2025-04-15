module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async up(db, client) {
    await db.createCollection('notificationThrottle')
    await db.collection('notificationThrottle').createIndex(
      { gameId: 1, userId: 1 },
      { unique: true }
    )
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async down(db, client) {
    await db.collection('notificationThrottle').dropIndex('gameId_1_userId_1')
    await db.collection('notificationThrottle').drop()
  }
}
