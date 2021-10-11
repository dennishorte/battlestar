const bsg = require('./game.js')
const transitions = require('./transitions.js')


function gameFixture() {
  const lobby = {
    game: 'BattleStar Galactica',
    name: 'Test Lobby',
    options: {
      expansions: ['base game']
    },
    users: [
      { _id: 0, name: 'dennis' },
      { _id: 1, name: 'micah' },
      { _id: 2, name: 'tom' },
    ],
  }

  // Create a new game
  const state = bsg.factory(lobby)
  const game = new bsg.Game()
  game.load(transitions, state, lobby.users[0])

  // Sort the players so they are consistent for testing
  game.state.players.sort((l, r) => l._id - r._id)

  return game
}

function gameFixturePostCharacterSelection() {
  const game = gameFixture()
  game.run()
  game.submit({
    actor: 'dennis',
    name: 'Select Character',
    option: 'Gaius Baltar',
  })
  game.submit({
    actor: 'micah',
    name: 'Select Character',
    option: 'William Adama',
  })
  game.submit({
    actor: 'tom',
    name: 'Select Character',
    option: 'Sharon "Boomer" Valerii',
  })
  return game
}


describe('new game', () => {
  test("first run initializes space zones", () => {
    const game = gameFixture()
    game.run()

    const expected = {
      'space.space0': ['Basestar A', 'raider', 'raider', 'raider'],
      'space.space1': [],
      'space.space2': [],
      'space.space3': ['civilian', 'civilian'],
      'space.space4': ['viper'],
      'space.space5': ['viper'],
    }

    for (const [zoneName, expectedShips] of Object.entries(expected)) {
      const zone = game.getZoneByName(zoneName)
      const shipNames = zone.cards.map(c => c.name).sort()
      expect(shipNames).toStrictEqual(expectedShips)
    }
  })

  test("waits at character selection", () => {
    const game = gameFixture()
    game.run()

    const stackNames = game.sm.stack.map(x => x.name)
    expect(stackNames).toStrictEqual([
      'root',
      'setup',
      'character-selection',
      'character-selection-do',
    ])
    expect(game.getWaiting()).toStrictEqual({
      name: 'dennis',
      actions: [
        {
          name: 'Select Character',
          options: [
            '"Chief" Galen Tyrol',
            'Gaius Baltar',
            'Kara "Starbuck" Thrace',
            'Karl "Helo" Agathon',
            'Laura Roslin',
            'Lee "Apollo" Adama',
            'Saul Tigh',
            'Sharon "Boomer" Valerii',
            'Tom Zarek',
            'William Adama',
          ],
        },
      ]
    })
  })
})

describe('character selection', () => {

  test("first player can choose any character", () => {
    const game = gameFixture()
    game.run()

    expect(game.getWaiting()).toStrictEqual({
      name: 'dennis',
      actions: [
        {
          name: 'Select Character',
          options: [
            '"Chief" Galen Tyrol',
            'Gaius Baltar',
            'Kara "Starbuck" Thrace',
            'Karl "Helo" Agathon',
            'Laura Roslin',
            'Lee "Apollo" Adama',
            'Saul Tigh',
            'Sharon "Boomer" Valerii',
            'Tom Zarek',
            'William Adama',
          ],
        },
      ]
    })
  })

  test("when first player chooses, character card is moved", () => {
    const game = gameFixture()
    game.run()
    game.submit({
      actor: 'dennis',
      name: 'Select Character',
      option: 'Gaius Baltar',
    })
    const player = game.getPlayerAll()[0]

    expect(game.getCardCharacterByPlayer(player).name).toBe('Gaius Baltar')

    const playerHand = game.getZoneByPlayer(player).cards
    const playerHandNames = playerHand.map(c => c.name).sort()
    expect(playerHandNames).toStrictEqual(['Gaius Baltar'])
  })

  test("when first player chooses, pawn is placed", () => {
    const game = gameFixture()
    game.run()
    game.submit({
      actor: 'dennis',
      name: 'Select Character',
      option: 'Gaius Baltar',
    })

    const researchLabZone = game.getZoneByLocationName('Research Lab')
    const researchLabCardNames = researchLabZone.cards.map(c => c.name)
    expect(researchLabCardNames).toStrictEqual(['dennis'])
  })

  test("when first player chooses, advances to next player", () => {
    const game = gameFixture()
    game.run()
    game.submit({
      actor: 'dennis',
      name: 'Select Character',
      option: 'Gaius Baltar',
    })

    expect(game.getWaiting()).toStrictEqual({
      name: 'micah',
      actions: [
        {
          name: 'Select Character',
          options: [
            '"Chief" Galen Tyrol',
            'Kara "Starbuck" Thrace',
            'Karl "Helo" Agathon',
            'Laura Roslin',
            'Lee "Apollo" Adama',
            'Saul Tigh',
            'Sharon "Boomer" Valerii',
            'Tom Zarek',
            'William Adama',
          ],
        },
      ]
    })
  })

  test("second player choices are reflected", () => {
    const game = gameFixture()
    game.run()
    game.submit({
      actor: 'dennis',
      name: 'Select Character',
      option: 'Gaius Baltar',
    })
    game.submit({
      actor: 'micah',
      name: 'Select Character',
      option: 'William Adama',
    })

    const player = game.getPlayerAll()[1]
    const characterName = game.getCardCharacterByPlayer(player).name
    expect(characterName).toBe('William Adama')

    const playerHand = game.getZoneByPlayer(player).cards
    const playerHandNames = playerHand.map(c => c.name).sort()
    expect(playerHandNames).toStrictEqual(['William Adama'])

    const playerZone = game.getZoneByLocationName("Admiral's Quarters")
    const playerZoneCardNames = playerZone.cards.map(c => c.name)
    expect(playerZoneCardNames).toStrictEqual(['micah'])
  })

})

describe('distribute title cards', () => {

  test("automatically executed after character selection", () => {
    const game = gameFixturePostCharacterSelection()
    expect(game.getPlayerWithCard('President').name).toBe('dennis')
    expect(game.getPlayerWithCard('Admiral').name).toBe('micah')
  })

})

describe('distribute loyalty cards', () => {

  test("deals one card to each player", () => {
    const game = gameFixturePostCharacterSelection()
    for (const player of game.getPlayerAll()) {
      const hand = game.getZoneByPlayer(player).cards
      const loyaltyCards = game.getCardsLoyaltyByPlayer(player)

      // Gaius gets an extra card
      if (player.name === 'dennis') {
        expect(loyaltyCards.length).toBe(2)
      }
      else {
        expect(loyaltyCards.length).toBe(1)
      }

      // Number of cards remaining should be 4
      const loyaltyDeck = game.getZoneByName('decks.loyalty')
      expect(loyaltyDeck.cards.length).toBe(4)
    }
  })

  test.skip("adds sympathizer card after dealing initial cards", () => {
    const game = gameFixturePostCharacterSelection()
  })

})
