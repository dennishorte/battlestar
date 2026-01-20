import {
  Game,
  GameFactory,
  GameOverEvent,
  SerializedGame,
  GameState,
  GameSettings,
  SelectorInput,
  PlayerData,
} from '../../lib/game.js'
import { BasePlayerManager } from '../../lib/game/index.js'

import { Pack } from './pack.js'
import util from '../../lib/util.js'

import { CubeDraftPlayerManager } from './CubeDraftPlayerManager.js'

import type { Pack as PackType, PackCard, Player as PackPlayer } from './pack.js'

interface CubeDraftPlayer extends PackPlayer {
  name: string
  unopenedPacks: PackType[]
  waitingPacks: PackType[]
  nextRoundPacks: PackType[]
  picked: PackCard[]
  draftComplete: boolean
  scarredRounds: number[]
  scarredCardId: string | null
}

interface CubeDraftSettings extends GameSettings {
  packs: unknown[][]
  cubeName: string | null
  set: { name: string } | null
  numPacks: number
  packSize: number
  scarRounds: number[]
  scars: unknown[]
}

interface CubeDraftState extends GameState {
  initializationComplete?: boolean
  packs: PackType[]
}

interface LogEntry {
  template: string
  args?: Record<string, unknown>
  classes?: string[]
}

interface LogArg {
  value: unknown
  cardId?: string
  classes?: string[]
}

interface ActionResponse {
  actor: string
  title: string
  selection: (string | { title: string })[]
  noUndo?: boolean
  [key: string]: unknown
}

interface PlayerOption {
  actor: string
  title: string
  choices: unknown[]
}

interface LobbyData {
  game: string
  name: string
  users: unknown[]
  seed: string
  options: {
    cubeId?: string
    cubeName?: string
    set?: unknown
    packSize?: number
    numPacks?: number
    scarRounds?: string
  }
  packs: unknown[][]
}

interface SerializedCubeDraft extends SerializedGame {
  waiting?: unknown
  gameOver?: boolean
  gameOverData?: unknown
}

class CubeDraft extends Game<CubeDraftState, CubeDraftSettings> {
  cardsById: Record<string, PackCard> = {}
  declare random: () => number

  constructor(serialized_data: SerializedGame, viewerName?: string) {
    super(serialized_data, viewerName, {
      PlayerManager: CubeDraftPlayerManager as unknown as typeof BasePlayerManager,
    })
  }

  // Helper method to get properly typed players
  getAllPlayers(): CubeDraftPlayer[] {
    return this.players.all() as unknown as CubeDraftPlayer[]
  }

  // Helper method to get typed player by name
  getPlayerByName(name: string): CubeDraftPlayer {
    return this.players.byName(name) as unknown as CubeDraftPlayer
  }

  serialize(): SerializedCubeDraft {
    const base = super.serialize() as SerializedCubeDraft

    // Include these because Magic doesn't run on the backend when saving,
    // so can't calculate these values.
    base.waiting = this.waiting
    base.gameOver = this.gameOver
    base.gameOverData = this.gameOverData

    return base
  }

  _mainProgram(): void {
    this.initialize()
    this.log.add({ template: "Draft Begins" })

    // Open the first pack for each player.
    this.log.indent()
    this.getAllPlayers()
      .forEach(player => this.aOpenNextPack(player))

    this.mainLoop()
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Initialization

  initialize(): void {
    this.log.add({ template: 'Initializing' })
    this.log.indent()

    this.initializePacks()
    this.initializeScars()

    this.log.outdent()

    this.state.initializationComplete = true
    this._breakpoint('initialization-complete')
  }

  initializePacks(): void {
    this.state.packs = this.settings.packs.map(packData => new Pack(this, packData as (string | Partial<PackCard>)[]))
    this.cardsById = {}

    this.log.add({ template: 'Passing out packs' })
    this.log.indent()

    if (this.settings.cubeName !== null) {
      this.log.add({ template: 'cube name: ' + this.settings.cubeName })
      this.log.add({ template: 'number of packs: ' + this.settings.numPacks })
      this.log.add({ template: 'cards per pack: ' + this.settings.packSize })
    }
    else if (this.settings.set) {
      this.log.add({ template: 'set name: ' + this.settings.set.name })
    }
    this.log.outdent()

    let packIndex = 0

    for (const player of this.getAllPlayers()) {
      for (let p_i = 0; p_i < this.settings.numPacks; p_i++) {
        const pack = this.state.packs[packIndex]
        pack.index = p_i
        pack.owner = player
        pack.id = player.name + '-' + p_i
        player.unopenedPacks.push(pack)
        packIndex += 1

        for (const card of pack.cards) {
          this.cardsById[card.id] = card
        }
      }
    }
  }

  initializeScars(): void {
    if (!this.settings.scarRounds || !this.settings.scarRounds.length) {
      return
    }

    const scars = util.array.shuffle([...this.settings.scars], this.random)
    const pairs = util.array.chunk(scars, 2)

    for (const pack of this.state.packs) {
      if (this.settings.scarRounds.includes(pack.index! + 1)) {
        if (pairs.length === 0) {
          console.log(0, this.settings.scars)
          console.log(1, pack)
          throw new Error('Not enough scars for all packs')
        }
        pack.scars = pairs.pop()
      }
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Main

  mainLoop(): void {
    while (!this.checkGameComplete()) {
      const playerOptions = this.getAllPlayers()
        .filter(p => this.checkPlayerHasOption(p))
        .map(p => this.getPlayerOptions(p)) as PlayerOption[]
      const action = this.requestInputAny(playerOptions as unknown as SelectorInput[])
      const player = this.getPlayerByName(action.actor)

      switch (action.title) {
        case 'Apply Scar':
          this.aApplyScar(player, action.selection[0] as unknown as { cardId: string })
          break

        case 'Draft Card':
          this.aDraftCard(player, this.getNextPackForPlayer(player)!, action.selection[0] as string | { title: string })
          break

        default:
          this.log.add({ template: `Unknown action: ${action.title}` })
          break
      }
    }

    throw new GameOverEvent({
      player: 'everyone',
      reason: 'Draft is complete'
    })
  }

  aApplyScar(player: CubeDraftPlayer, data: { cardId: string }): void {
    this.log.add({
      template: '{player} applied a scar',
      args: { player },
    })

    const pack = this.getNextPackForPlayer(player)!
    const packRound = pack.index! + 1

    // Mark that this player has applied scars for this round
    player.scarredRounds.push(packRound)

    // Mark the card so this player can't draft it this round
    player.scarredCardId = data.cardId
  }

  aDraftCard(player: CubeDraftPlayer, pack: PackType, cardId: string | { title: string }): void {
    util.assert(this.getNextPackForPlayer(player) === pack, "This pack isn't ready for this player")

    cardId = (cardId as { title: string }).title ? (cardId as { title: string }).title : cardId as string

    if (cardId === player.scarredCardId) {
      throw new Error('Player tried to draft the card they scarred')
    }

    const card = pack.getCardById(cardId as string)
    util.assert(pack.checkCardIsAvailable(card!), "The selected card is not in the pack.")

    // Clear draft blocks caused by scarring
    player.scarredCardId = null

    this.log.add({
      template: '{player} drafted a card',
      args: { player },
    })
    pack.pickCardById(player, cardId as string)
    player.picked.push(card!)
    player.waitingPacks.shift() // remove this pack from the front of the player queue

    if (pack.checkIsEmpty()) {
      // Do not pass this pack to the next player.
      // Open the next pack if one is available.
      pack.waiting = null
      this.aOpenNextPack(player)
    }
    else {
      // Pass this pack to the next player.
      const nextPlayer = this.getNextPlayerForPack(pack)
      const nextPlayerPackIndex = this.getPackIndexForPlayer(nextPlayer)

      if (nextPlayerPackIndex === pack.index) {
        nextPlayer.waitingPacks.push(pack)
      }
      else {
        nextPlayer.nextRoundPacks.push(pack)
      }

      pack.waiting = nextPlayer
      pack.viewPack(nextPlayer)
    }
  }

  aOpenNextPack(player: CubeDraftPlayer): void {
    const pack = player.unopenedPacks.shift()
    const packNum = this.settings.numPacks - player.unopenedPacks.length

    if (pack) {
      this.log.add({
        template: '{player} opens pack {count}',
        args: { player, count: packNum }
      })

      player.waitingPacks.push(pack)
      pack.waiting = player
      pack.viewPack(player)

      // Move all the next round packs that piled up into the waiting packs queue
      while (player.nextRoundPacks.length > 0) {
        player.waitingPacks.push(player.nextRoundPacks.shift()!)
      }
    }

    // Player has no remaining packs.
    // They are done unless some draft matters event happens that affects them.
    else {
      player.draftComplete = true
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Checkers

  checkForWaitingPack(player: CubeDraftPlayer): boolean {
    return Boolean(this.getNextPackForPlayer(player))
  }

  checkGameComplete(): boolean {
    return this.getAllPlayers()
      .every(player => !this.getNextPackForPlayer(player))
  }

  checkIsScarAction(player: CubeDraftPlayer): boolean {
    const pack = this.getNextPackForPlayer(player)
    if (pack) {
      const packRound = pack.index! + 1
      return (
        this.settings.scarRounds
        && this.settings.scarRounds.includes(packRound)
        && !player.scarredRounds.includes(packRound)
      )
    }
    else {
      return false
    }
  }

  checkPlayerHasOption(player: CubeDraftPlayer): boolean {
    return (
      this.checkIsScarAction(player)
      || this.checkForWaitingPack(player)
    )
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  getPicksByPlayer(player: CubeDraftPlayer): PackCard[] {
    return player.picked
  }

  getNextPackForPlayer(player: CubeDraftPlayer): PackType | undefined {
    const nextPack = this.getWaitingPacksForPlayer(player)[0]
    const playerPackIndex = this.getPackIndexForPlayer(player)

    if (nextPack && nextPack.index === playerPackIndex) {
      return nextPack
    }
    else {
      return undefined
    }
  }

  getPacks(): PackType[] {
    return this.state.packs
  }

  getPackIndexForPlayer(player: CubeDraftPlayer): number {
    return Math.floor(player.picked.length / this.settings.packSize)
  }

  getNextPlayerForPack(pack: PackType): CubeDraftPlayer {
    util.assert(Boolean(pack.waiting), 'pack does not have a waiting player')

    const direction = pack.index! % 2
    const waitingPlayer = pack.waiting as unknown as Parameters<typeof this.players.following>[0]
    if (direction === 0) {
      return this.players.following(waitingPlayer) as unknown as CubeDraftPlayer
    }
    else {
      return this.players.preceding(waitingPlayer) as unknown as CubeDraftPlayer
    }
  }

  getPlayerOptions(player: CubeDraftPlayer): PlayerOption | never[] {
    if (this.checkIsScarAction(player)) {
      const pack = this.getNextPackForPlayer(player)!
      pack.viewPack(player)

      return {
        actor: player.name,
        title: 'Apply Scar',
        choices: pack.scars || [],
      }
    }

    else if (this.checkForWaitingPack(player)) {
      const pack = this.getNextPackForPlayer(player)!
      pack.viewPack(player)
      return {
        actor: player.name,
        title: 'Draft Card',
        choices: pack
          .getRemainingCards()
          .filter(c => c.id !== player.scarredCardId)
          .map(c => c.id)
      }
    }

    else {
      return []
    }
  }

  getResultMessage(): string {
    if (this.checkGameIsOver()) {
      return 'Draft Complete'
    }
    else {
      return 'in progress'
    }
  }

  getWaitingPacksForPlayer(player: CubeDraftPlayer): PackType[] {
    return player.waitingPacks
  }

  getCardById(cardId: string): PackCard {
    return this.cardsById[cardId]
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Private mutators

  mPushWaitingPack(player: CubeDraftPlayer, pack: PackType): void {
    player.waitingPacks.push(pack)
    pack.waiting = player
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Utils

  _enrichLogArgs(msg: LogEntry): void {
    if (!msg.args) return

    for (const key of Object.keys(msg.args)) {
      if (key === 'players') {
        const players = msg.args[key] as CubeDraftPlayer[]
        msg.args[key] = {
          value: players.map(p => p.name).join(', '),
          classes: ['player-names'],
        }
      }
      else if (key.startsWith('player')) {
        const player = msg.args[key] as CubeDraftPlayer
        msg.args[key] = {
          value: player.name,
          classes: ['player-name']
        }
      }
      else if (key.startsWith('card')) {
        const card = msg.args[key] as PackCard
        const isHidden = false

        if (isHidden) {
          msg.args[key] = {
            value: 'a card',
            classes: ['card-hidden'],
          }
        }
        else {
          msg.args[key] = {
            value: card.name,
            cardId: card.id,  // Important in some UI situations.
            classes: ['card-name'],
          }
        }
      }
      // Convert string args to a dict
      else if (typeof msg.args[key] !== 'object') {
        msg.args[key] = {
          value: msg.args[key],
        }
      }
    }
  }

  _responseReceived(response: ActionResponse): void {
    if (response.title === 'Apply Scar') {
      response.noUndo = true
    }
  }
}

function CubeDraftFactory(settings: unknown, viewerName?: string): CubeDraft {
  const data = GameFactory(settings as Partial<GameSettings>)
  return new CubeDraft(data.serialize(), viewerName)
}

function factoryFromLobby(lobby: LobbyData): unknown {
  return GameFactory({
    game: lobby.game,
    name: lobby.name,
    players: lobby.users as PlayerData[],
    seed: lobby.seed,

    cubeId: lobby.options.cubeId,
    cubeName: lobby.options.cubeName,
    set: lobby.options.set,

    packSize: lobby.options.packSize,
    numPacks: lobby.options.numPacks,
    packs: lobby.packs,

    scarRounds: (lobby.options.scarRounds || '').split(',').filter((x: string) => x).map((x: string) => parseInt(x)),
    scars: [],
  })
}

export {
  GameOverEvent,
  CubeDraft,
  CubeDraftFactory,

  CubeDraft as constructor,
  factoryFromLobby as factory,
}
