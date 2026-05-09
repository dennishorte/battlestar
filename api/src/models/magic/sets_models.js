import axios from 'axios'

import { client as databaseClient } from '../../utils/mongo.js'

const database = databaseClient.db('magic')
const setsCollection = database.collection('sets')


const Sets = {}

Sets.fetchAll = async function() {
  const cursor = setsCollection.find({})
  return await cursor.toArray()
}

Sets.replaceAll = async function(sets) {
  await setsCollection.deleteMany({})
  if (sets.length > 0) {
    await setsCollection.insertMany(sets, { ordered: true })
  }
}

Sets.fetchFromScryfall = async function() {
  const result = await axios.get('https://api.scryfall.com/sets', {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 0,
  })

  if (result.status !== 200) {
    throw new Error('Scryfall returned non-200: ' + result.statusText)
  }

  const sets = result.data.data
  sets.sort((l, r) => (r.released_at < l.released_at ? -1 : r.released_at > l.released_at ? 1 : 0))
  return sets
}

Sets.update = async function() {
  const sets = await Sets.fetchFromScryfall()
  await Sets.replaceAll(sets)
  return { count: sets.length }
}

export default Sets
