import { GameOverEvent } from '../lib/game.js'
import { TyrantsFactory } from './tyrants.js'
import TestCommon from '../lib/test_common.ts'
import util from '../lib/util.js'

interface Player {
  name: string
  setCounter(name: string, value: number): void
  getCounter(name: string): number
  [key: string]: unknown
}

interface Card {
  name: string
  id: string
  owner: Player | null
  home: Zone
  isTroop: boolean
  isSpy: boolean
  moveTo(zone: Zone, index?: number): void
  moveHome(): void
  getOwnerName(): string
}

interface Zone {
  id: string
  cardlist(): Card[]
  peek(): Card | undefined
  _cards: Card[]
  getSpies(): Card[]
  getTokens(kind: string): Card[]
  name(): string
}

interface Location extends Zone {
  getTroops(): Card[]
}

interface Game {
  players: {
    all(): Player[]
    byName(name: string): Player
  }
  zones: {
    byId(id: string): Zone
    byPlayer(player: Player, zone: string): Zone
  }
  cards: {
    byPlayer(player: Player, zone: string): Card[]
    byZone(zone: string): Card[]
  }
  log: {
    add(entry: { template: string; args?: Record<string, unknown> }): void
    indent(): void
    outdent(): void
  }
  testSetBreakpoint(name: string, fn: (game: Game) => void): void
  run(): InputRequest
  getLocationAll(): Location[]
  getLocationByName(name: string): Location
  getScore(player: Player): number
}

interface InputRequest {
  selectors: Array<{
    actor: string
    title: string
    choices: Array<string | { title: string; choices: string[] }>
    min?: number
    max?: number
    count?: number
  }>
}

interface FixtureOptions {
  name?: string
  seed?: string
  expansions?: string[]
  map?: string
  numPlayers?: number
  chooseColors?: boolean
  players?: Array<{ _id: string; name: string }>
  playerOptions?: { shuffleSeats: boolean }
  devoured?: string[]
  marketDeck?: string[]
  [playerName: string]: unknown
}

interface PlayerSetup {
  hand?: string[]
  innerCircle?: string[]
  deck?: string[]
  discard?: string[]
  played?: string[]
  trophyHall?: string[]
  power?: number
  influence?: number
  points?: number
  troops?: number
}

interface LocationSetup {
  troops?: string[]
  spies?: string[]
}

interface TestState {
  played?: string[] | 'default'
  discard?: string[] | 'default'
  trophyHall?: string[] | 'default'
  hand?: string[] | 'default'
  innerCircle?: string[] | 'default'
  influence?: number
  points?: number
  power?: number
  score?: number
}

interface TestUtil {
  fixture(options?: FixtureOptions): Game
  gameFixture(options: FixtureOptions): Game
  setTroops(game: Game, locId: string, playerNames: string[]): void
  setSpies(game: Game, locId: string, playerNames: string[]): void
  testActionChoices(request: InputRequest, action: string, expected: string[]): void
  testChoices(request: InputRequest, expected: string[], expectedMin?: number, expectedMax?: number): void
  testIsSecondPlayer(request: InputRequest): void
  testGameOver(request: unknown, playerName: string, reason: string): void
  testNotGameOver(request: unknown): void
  testTroops(game: Game, locationName: string, expected: string[]): void
  testBoard(game: Game, expected: Record<string, unknown>): void
  testTableau(game: Game, player: Player, testState: TestState): void
  testLocation(game: Game, location: Location, testState: LocationSetup): void
  choose(game: Game, request: InputRequest, choice: string): InputRequest
  [key: string]: unknown
}

const TestUtil: TestUtil = { ...TestCommon }

TestUtil.fixture = function(options: FixtureOptions = {}): Game {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    expansions: ['drow', 'dragons'],
    map: undefined,
    numPlayers: 2,
    chooseColors: false,
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
    ],
    playerOptions: {
      shuffleSeats: false,
    },
  }, options)

  options.players = options.players!.slice(0, options.numPlayers)
  options.map = options.map || (
    options.numPlayers === 3 ? 'base-3a' : `base-${options.numPlayers}`
  )

  const game = TyrantsFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', (game: Game) => {
    for (const player of game.players.all()) {
      const deck = game.zones.byPlayer(player, 'deck')
      const hand = game.zones.byPlayer(player, 'hand')

      // Return all cards in the player hand to their deck
      for (const card of hand.cardlist()) {
        card.moveTo(deck)
      }

      // Put 5 nobles into the player hand
      while (hand.cardlist().length < 5) {
        const card = deck.cardlist().find(card => card.name === 'Noble')
        card!.moveTo(hand)
      }

      // Put the remainder of the deck into a fixed order
      deck._cards.sort((l: Card, r: Card) => r.name.localeCompare(l.name))

      // Put cards with multiple copies into the market. This makes sure that when we put cards
      // in player hands, we aren't grabbing them from the market.
      const marketDeck = game.zones.byId('marketDeck')
      const market = game.zones.byId('market')
      for (const card of market.cardlist()) {
        card.moveTo(marketDeck)
      }
      const cardNames = [
        'Advocate',
        'Blackguard',
        'Bounty Hunter',
        'Doppelganger',
        'Infiltrator',
        'Spellspinner',
      ]
      for (const name of cardNames) {
        const card = game.zones.byId('marketDeck').cardlist().find((c: Card) => c.name === name)
        card!.moveTo(market)
      }
    }
  })

  return game
}

TestUtil.gameFixture = function(options: FixtureOptions): Game {
  const game = this.fixture(options)

  game.testSetBreakpoint('initialization-complete', (game: Game) => {
    game.log.add({ template: 'SETUP' })
    game.log.indent()

    for (const player of game.players.all()) {
      game.log.add({
        template: '{player} setup',
        args: { player }
      })
      game.log.indent()

      const playerSetup = options[player.name] as PlayerSetup | undefined
      if (playerSetup) {

        for (const key of ['hand', 'innerCircle', 'deck', 'discard', 'played'] as const) {

          if (playerSetup[key]) {
            game.log.add({
              template: '{key}',
              args: { key },
            })
            game.log.indent()

            const zone = game.zones.byPlayer(player, key)

            for (const card of zone.cardlist()) {
              const targetDeck = key === 'deck' ? game.zones.byId('devoured') : card.home
              card.moveTo(targetDeck)
            }

            for (const name of playerSetup[key]!) {
              game.log.add({
                template: '{name}',
                args: { name },
              })

              let card: Card | undefined
              if (name === 'Priestess of Lolth') {
                card = game.zones.byId('priestess').peek()
              }
              else if (name === 'House Guard') {
                card = game.zones.byId('guard').peek()
              }
              else if (name === 'Insane Outcast') {
                card = game.zones.byId('outcast').peek()
              }
              else {
                card = game.cards.byZone('marketDeck').find(card => card.name === name)
                util.assert(!!card, `Card not found: ${name}`)
              }

              card!.moveTo(zone)
              card!.owner = player
            }

            game.log.outdent()
          }
        }

        if (playerSetup.trophyHall) {
          TestUtil.setTroops(game, game.zones.byPlayer(player, 'trophyHall').id, playerSetup.trophyHall)
        }

        if ('power' in playerSetup) {
          player.setCounter('power', playerSetup.power!)
        }
        if ('influence' in playerSetup) {
          player.setCounter('influence', playerSetup.influence!)
        }
        if ('points' in playerSetup) {
          player.setCounter('points', playerSetup.points!)
        }
        if ('troops' in playerSetup) {
          // Need to keep an extra troop for initial location selection.
          const troops = game.cards.byPlayer(player, 'troops').slice(playerSetup.troops! + 1)
          const exile = game.zones.byId('devoured')
          for (const troop of troops) {
            troop.moveTo(exile)
          }
        }
      }

      else {
        game.log.add({ template: 'no setup info' })
      }

      game.log.outdent()
    }

    for (const loc of game.getLocationAll()) {
      const locationSetup = options[loc.name()] as LocationSetup | undefined
      if (locationSetup) {
        game.log.add({ template: loc.name() })
        game.log.indent()

        if (locationSetup.troops) {
          game.log.add({
            template: 'Setting troops at {name} to [{troops}]',
            args: {
              name: loc.name(),
              troops: locationSetup.troops.join(', ')
            }
          })
          TestUtil.setTroops(game, loc.id, locationSetup.troops)
        }

        if (locationSetup.spies) {
          game.log.add({
            template: 'Setting spies at {name} to [{spies}]',
            args: {
              name: loc.name(),
              spies: locationSetup.spies.join(', ')
            }
          })
          TestUtil.setSpies(game, loc.id, locationSetup.spies)
        }

        game.log.outdent()
      }
    }

    if (options.devoured) {
      const devoured = game.zones.byId('devoured')
      const market = game.zones.byId('marketDeck')
      for (const name of options.devoured) {
        const card = market.cardlist().find(card => card.name === name)
        card!.moveTo(devoured)
        game.log.add({
          template: '{card} added to the market',
          args: { card }
        })
      }
    }

    if (options.marketDeck) {
      game.log.add({ template: 'setting up market' })
      game.log.indent()

      const market = game.zones.byId('marketDeck')
      const cards = market.cardlist()
      const toMove: Card[] = []

      for (const name of options.marketDeck) {
        game.log.add({ template: 'searching for: ' + name })
        const card = cards.find(c => c.name === name && !toMove.includes(c))
        if (!card) {
          throw new Error('Unable to find card: ' + name)
        }
        toMove.push(card)
      }

      toMove.reverse()
      for (const card of toMove) {
        game.log.add({
          template: '{card} placed on top of the market deck',
          args: { card }
        })
        card.moveTo(market, 0)
      }

      game.log.outdent()
    }

    game.log.outdent()
  })


  let request = game.run()
  request = this.choose(game, request, 'Ched Nasad')
  request = this.choose(game, request, 'Eryndlyn')
  return game
}

/*
   locName: Either a string matching the name of a location, or a Zone.
 */
TestUtil.setTroops = function(game: Game, locId: string, playerNames: string[]): void {
  if (!locId.includes('.')) {
    locId = 'map.' + locId
  }

  const zone = game.zones.byId(locId)

  for (const card of zone.cardlist()) {
    if (card.isTroop) {
      card.moveHome()
    }
  }

  for (const playerName of playerNames) {
    if (playerName === 'neutral') {
      game.zones.byId('neutrals').peek()!.moveTo(zone)
    }
    else {
      const player = game.players.byName(playerName)
      game.zones.byPlayer(player, 'troops').peek()!.moveTo(zone)
    }
  }
}

TestUtil.setSpies = function(game: Game, locId: string, playerNames: string[]): void {
  if (!locId.includes('.')) {
    locId = 'map.' + locId
  }

  const zone = game.zones.byId(locId)

  for (const card of zone.cardlist()) {
    if (card.isSpy) {
      card.moveHome()
    }
  }

  while (zone.getSpies().length > 0) {
    zone.getSpies()[0].moveHome()
  }

  for (const playerName of util.array.distinct(playerNames)) {
    const player = game.players.byName(playerName)
    game.zones.byPlayer(player, 'spies').peek()!.moveTo(zone)
  }
}


////////////////////////////////////////////////////////////////////////////////
// Tests

TestUtil.testActionChoices = function(request: InputRequest, action: string, expected: string[]): void {
  const actionChoice = request.selectors[0].choices.find(c => typeof c === 'object' && c.title === action) as { title: string; choices: string[] }
  const actionChoices = actionChoice.choices
  expect(actionChoices.sort()).toStrictEqual(expected.sort())
}

TestUtil.testChoices = function(request: InputRequest, expected: string[], expectedMin?: number, expectedMax?: number): void {
  const choices = (request.selectors[0].choices as string[]).filter(c => c !== 'auto').sort()
  expect(choices).toStrictEqual(expected.sort())

  if (expectedMax) {
    const { min, max } = request.selectors[0]
    expect(min).toBe(expectedMin)
    expect(max).toBe(expectedMax)
  }

  // This is actually just count
  else if (expectedMin) {
    expect(request.selectors[0].count).toBe(expectedMin)
  }
}

TestUtil.testIsSecondPlayer = function(request: InputRequest): void {
  const selector = request.selectors[0]
  expect(selector.actor).toBe('micah')
  expect(selector.title).toBe('Choose Action')
}

TestUtil.testGameOver = function(request: unknown, playerName: string, reason: string): void {
  expect(request).toEqual(expect.any(GameOverEvent))
  expect((request as { data: { player: { name: string }; reason: string } }).data.player.name).toBe(playerName)
  expect((request as { data: { player: { name: string }; reason: string } }).data.reason).toBe(reason)
}

TestUtil.testNotGameOver = function(request: unknown): void {
  expect(request).not.toEqual(expect.any(GameOverEvent))
}

TestUtil.testTroops = function(game: Game, locationName: string, expected: string[]): void {
  const location = game.getLocationByName(locationName)
  const troops = location.getTroops().map(t => t.owner!.name).sort()
  expected = expected.sort()

  expect(troops).toStrictEqual(expected)
}

TestUtil.testBoard = function(game: Game, expected: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(expected)) {
    const player = game.players.byName(key)
    const location = game.getLocationByName(key)

    if (player) {
      this.testTableau(game, player, value as TestState)
    }

    else if (location) {
      this.testLocation(game, location, value as LocationSetup)
    }

    else if (key === 'devoured') {
      const actual = game.zones.byId('devoured').cardlist().map(c => c.name).sort()
      const exp = (value as string[]).sort()
      expect(actual).toStrictEqual(exp)
    }

    else if (key === 'market') {
      const actual = game.zones.byId('market').cardlist().map(c => c.name).sort()
      const exp = (value as string[]).sort()
      expect(actual).toStrictEqual(exp)
    }

    else {
      throw new Error(`Unhandled test key: ${key}`)
    }
  }
}

const tableauZones = [
  'played',
  'discard',
  'trophyHall',
  'hand',
  'innerCircle',
] as const

const counters = [
  'influence',
  'points',
  'power',
] as const

TestUtil.testTableau = function(game: Game, player: Player, testState: TestState): void {
  const actual: Record<string, unknown> = {}
  const expected: Record<string, unknown> = {}

  for (const zoneName of tableauZones) {
    actual[zoneName] = game.cards.byPlayer(player, zoneName).map(c => c.name).sort()

    if (!testState[zoneName] || testState[zoneName] === 'default') {
      if (zoneName === 'hand') {
        expected[zoneName] = ['Noble', 'Noble', 'Soldier', 'Soldier', 'Soldier'].sort()
      }
      else {
        expected[zoneName] = []
      }
    }
    else {
      expected[zoneName] = ((testState[zoneName] as string[]) || []).sort()
    }
  }

  for (const key of counters) {
    actual[key] = player.getCounter(key)
    expected[key] = testState[key] || 0
  }

  if ('score' in testState) {
    actual['score'] = game.getScore(player)
    expected['score'] = testState['score']
  }

  expect(actual).toStrictEqual(expected)
}

TestUtil.testLocation = function(game: Game, location: Location, testState: LocationSetup): void {
  const actual: Record<string, unknown> = { name: location.name }
  const expected: Record<string, unknown> = { name: location.name }

  for (const key of ['troops', 'spies'] as const) {
    actual[key] = location.getTokens(key).map(t => t.getOwnerName()).sort()
    expected[key] = (testState[key] || []).sort()
  }

  expect(actual).toStrictEqual(expected)
}

export default TestUtil
