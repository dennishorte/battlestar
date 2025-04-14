Error.stackTraceLimit = 100

require('dotenv').config({ path: '../.env' })

const databaseClient = require('../src/util/mongo.js').client

const db = require('../src/models/db.js')
const stats = require('../src/util/stats.js')
const { GameOverEvent, inn } = require('battlestar-common')


const statsVersions = {
  Innovation: 4,
}


async function fetchInnovationGames(session) {
  return await db.game.collection.find(
    {
      gameOver: true,
      'settings.game': 'Innovation'
    },
    { session }
  )
}

function needsUpdate(data) {
  // Killed games generate no stats
  if (data.killed) {
    return false
  }

  // Unfinished games aren't ready for stats
  if (!data.gameOver) {
    return false
  }

  return (
    !data.stats
    || data.stats.version !== statsVersions[data.settings.game]
    || (data.gameOver === true && data.stats.gameOver === false)
  )
}

async function saveInnovationStats(data, game, result) {
  if (result === 'error') {
    data.stats.error = true
  }
  else if (result instanceof GameOverEvent) {
    data.stats.gameOver = true
    data.stats.result = result.data
    data.stats.inGame = game.stats
  }

  // The game thinks it is complete, but the running it again didn't get to an end state.
  // Treat this the same as an error.
  else if (data.gameOver) {
    data.stats.error = true
  }

  // The game actually isn't finished.
  else {
    data.stats.gameOver = false
  }

  await db.game.saveStats(data)
}

async function updateInnovationStats() {
  const session = databaseClient.startSession()
  const gameCursor = await fetchInnovationGames(session)

  for await (const data of gameCursor) {
    if (data.stats && data.stats.error) {
      continue
    }

    if (needsUpdate(data)) {
      // Set default values
      data.stats = {
        version: statsVersions[data.settings.game],
        error: false,
        gameOver: false,
        inGame: {},
      }

      // Run the game through to the end
      const game = new inn.Innovation(data)
      try {
        const result = game.run()
        await saveInnovationStats(data, game, result)
      }
      catch {
        await saveInnovationStats(data, game, 'error')
      }
    }
  }

  await session.endSession()
}

async function showStats() {
  const cursor = await db.game.collection.find({
    'settings.game': 'Innovation',
    'settings.players.2': { $exists: false }, // Two player games only
    'stats.error': false,
    gameOver: true,
    killed: false,
  }).project({
    _id: 0,
    stats: 1,
    settings: 1,
  })

  const processed = await stats.processInnovationStats(cursor)
  console.log(processed.reasons.slice(0, 10))
//  console.log(processed.cards.slice(0, 10))
//  console.log(processed.players)
}

async function main() {
  await updateInnovationStats()
  await showStats()
  process.exit(0)
}

main()
