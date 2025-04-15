const escapeStringRegexp = require('escape-string-regexp-node')


module.exports = function({ collection, createFields }) {

  return {
    collection,

    create: async function(file) {
      if (file._id) {
        delete file._id
      }

      if (createFields) {
        for (const [key, value] of Object.entries(createFields())) {
          if (!(key in file)) {
            file[key] = value
          }
        }
      }

      const creationDate = Date.now()
      const insertResult = await collection.insertOne({
        ...file,
        name: await getUniqueFileName(collection, file.userId, file.name, file.path),
        path: file.path || '/',
        createdTimestamp: creationDate,
        updatedTimestamp: creationDate,
      })

      if (!insertResult.insertedId) {
        throw new Error('File insertion failed')
      }

      return insertResult.insertedId
    },

    'delete': async function(id) {
      return await collection.deleteOne({ _id: id })
    },

    duplicate: async function(id) {
      const file = await this.findById(id)
      return this.create(file)
    },

    save: async function(file) {
      return await collection.replaceOne({ _id: file._id }, file)
    },



    findById: async function(id) {
      return await collection.findOne({ _id: id })
    },

    findByUserId: async function(userId) {
      const files = await collection.find({ userId })
      return await files.toArray()
    },
  }
}



async function getUniqueFileName(collection, userId, name, path) {
  const cursor = await collection.find({
    userId,
    name: new RegExp(escapeStringRegexp(name) + '.*'),
    path,
  })
  const files = await cursor.toArray()

  let testName = name
  let index = 0
  while (files.find(d => d.name === testName)) {
    index += 1
    testName = name + ' (' + index + ')'
  }

  return testName
}
