import { GameOverEvent } from '../lib/game.js'
import { AgricolaFactory } from './agricola.js'
import TestCommon from '../lib/test_common.js'
import log from '../lib/log.js'

interface FixtureOptions {
  name?: string
  seed?: string
  expansions?: string[]
  numPlayers?: number
  draft?: boolean
  players?: { _id: string; name: string }[]
}

const TestUtil = { ...TestCommon } as Record<string, unknown>


TestUtil.fixture = function(options: FixtureOptions = {}) {
  const fullOptions = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    expansions: ['baseA'],
    numPlayers: 2,
    players: [
      {
        _id: 'dennis_id',
        name: 'dennis',
      },
      {
        _id: 'micah_id',
        name: 'micah',
      },
      {
        _id: 'scott_id',
        name: 'scott',
      },
      {
        _id: 'eliya_id',
        name: 'eliya',
      },
    ]
  }, options)

  fullOptions.players = fullOptions.players.slice(0, fullOptions.numPlayers)

  const game = AgricolaFactory(fullOptions, 'dennis')

  game.testSetBreakpoint('initialization-complete', (game: any) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map((name: string) => game.players.byName(name))
      .filter((p: unknown) => p !== undefined)
  })

  return game
}

export default TestUtil
