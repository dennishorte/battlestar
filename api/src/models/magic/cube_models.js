const databaseClient = require('../../utils/mongo.js').client
const database = databaseClient.db('magic')
const cubeCollection = database.collection('cube')

module.exports = {
  async create(user) {
    const creationDate = new Date()
    const insertResult = await cubeCollection.insertOne({
      name: 'New Cube',
      userId: user._id,
      cardlist: [],
      flags: {
        legacy: false,
      },
      timestamps: {
        created: creationDate,
        updated: creationDate,
      },
    })

    if (!insertResult.insertedId) {
      throw new Error('Cube insertion failed')
    }

    return await this.findById(insertResult.insertedId)
  },

  async delete(id) {
    return await cubeCollection.deleteOne({ _id: id })
  },

  async save(cube) {
    return await cubeCollection.findOneAndUpdate(
      { _id: cube._id },
      {
        $set: {
          name: cube.name,
          cardlist: cube.cardlist,
          flags: cube.flags,
          'timestamps.updated': new Date(),
        },
      },

    )
  },

  async findById(id) {
    return await cubeCollection.findOne({ _id: id })
  },

  async findByUserId(userId) {
    const cubes = await cubeCollection.find({ userId })
    return await cubes.toArray()
  },

  async addCard(cube, card) {
    await cubeCollection.updateOne(
      { _id: cube._id },
      { $push: { cardlist: card._id } }
    )
  },

  async removeCard(cube, card) {
    await cubeCollection.updateOne(
      { _id: cube._id },
      { $pull: { cardlist: card._id } }
    )
  },

  async setFlag(cube, name, value) {
    await cubeCollection.updateOne(
      { _id: cube._id },
      { $set: { [`flags.${name}`]: value } },
    )
  },
}
