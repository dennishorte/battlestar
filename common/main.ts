import { GameOverEvent } from './lib/game.js'
import * as magic from './magic/magic.js'
import * as tyrants from './tyrants/tyrants.js'
import * as ultimate from './ultimate/innovation.js'
import log from './lib/log.js'
import selector from './lib/selector.js'
import util from './lib/util.js'

// Backwards compatibility aliases
const mag = magic
const tyr = tyrants

interface GameData {
  settings: {
    game: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface Lobby {
  game: string
  [key: string]: unknown
}

interface GameModule {
  constructor: new (gameData: GameData, viewerName?: string) => unknown
  factory: (lobby: Lobby) => unknown
}

const Games: Record<string, GameModule> = {
  'Innovation: Ultimate': ultimate as unknown as GameModule,
  'Magic': magic as unknown as GameModule,
  'Tyrants of the Underdark': tyrants as unknown as GameModule,
  'Set Draft': (magic as any).draft.cube as GameModule,
  'Cube Draft': (magic as any).draft.cube as GameModule,
}

function fromData(gameData: GameData, viewerName?: string): unknown {
  const name = gameData.settings.game
  if (name in Games) {
    const constructor = Games[name].constructor
    return new constructor(gameData, viewerName)
  }
  else {
    throw new Error(`No constructor for game: ${name}`)
  }
}

function fromLobby(lobby: Lobby): unknown {
  const name = lobby.game
  if (name in Games) {
    const factory = Games[name].factory
    return factory(lobby)
  }
  else {
    throw new Error(`No factory for game: ${name}`)
  }
}

export {
  GameOverEvent,
  magic,
  tyrants,
  ultimate,
  mag,
  tyr,
  log,
  selector,
  util,
  fromData,
  fromLobby,
}
