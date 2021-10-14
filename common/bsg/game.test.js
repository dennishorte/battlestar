const bsg = require('./game.js')
const transitions = require('./transitions.js')


function GameFixtureFactory() {
  this.phases = {
    FIRST_RUN: 0,
    POST_CHARACTER_SELECTION: 1,
    POST_SETUP: 2,
  }

  this.lobby = {
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

  this.options = {
    players: [
      {
        character: 'Gaius Baltar',
      },
      {
        character: 'Kara "Starbuck" Thrace',
        startingSkills: ['leadership', 'tactics', 'piloting'],
      },
      {
        character: 'Sharon "Boomer" Valerii',
        startingSkills: ['tactics', 'piloting', 'engineering'],
      },
    ],
  }

  this.phase = -1
  this.game = new bsg.Game()
}

GameFixtureFactory.prototype.build = function() {
  // Create a new game
  const state = bsg.factory(this.lobby)
  this.game.load(transitions, state, this.lobby.users[0])

  // Sort the players so they are consistent for testing
  this.game.state.players.sort((l, r) => l._id - r._id)

  return this
}

GameFixtureFactory.prototype.advance = function(phase) {
  if (!phase) {
    phase = this.phases.FIRST_RUN
  }

  if (this.phase < this.phases.FIRST_RUN && phase >= this.phases.FIRST_RUN) {
    this.phase = this.phases.FIRST_RUN
    this.game.run()
  }

  if (this.phase < this.phases.POST_CHARACTER_SELECTION
      && phase >= this.phases.POST_CHARACTER_SELECTION) {

    this.phase = this.phases.POST_CHARACTER_SELECTION
    for (let i = 0; i < this.game.getPlayerAll().length; i++) {
      const player = this.game.getPlayerByIndex(i)
      this.game.submit({
        actor: player.name,
        name: 'Select Character',
        option: this.options.players[i].character
      })
    }
  }

  if (this.phase < this.phases.POST_SETUP
      && phase >= this.phases.POST_SETUP) {

    this.phase = this.phases.POST_SETUP
    for (let i = 1; i < this.game.getPlayerAll().length; i++) {
      const player = this.game.getPlayerByIndex(i)
      this.game.submit({
        actor: player.name,
        name: 'Select Starting Skills',
        option: this.options.players[i].startingSkills
      })
    }
  }

  return this
}


describe('new game', () => {
  test("first run initializes space zones", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

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
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

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
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

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
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

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
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

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
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

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
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

    game.submit({
      actor: 'dennis',
      name: 'Select Character',
      option: 'Gaius Baltar',
    })
    game.submit({
      actor: 'micah',
      name: 'Select Character',
      option: 'Kara "Starbuck" Thrace',
    })

    const player = game.getPlayerAll()[1]
    const characterName = game.getCardCharacterByPlayer(player).name
    expect(characterName).toBe('Kara "Starbuck" Thrace')

    const playerHand = game.getZoneByPlayer(player).cards
    const playerHandNames = playerHand.map(c => c.name).sort()
    expect(playerHandNames).toStrictEqual(['Kara "Starbuck" Thrace'])

    const playerZone = game.getZoneByLocationName("Hangar Deck")
    const playerZoneCardNames = playerZone.cards.map(c => c.name)
    expect(playerZoneCardNames).toStrictEqual(['micah'])
  })

  test("Lee Adama can choose where to launch his viper", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advance().game

    game.submit({
      actor: 'dennis',
      name: 'Select Character',
      option: 'Lee "Apollo" Adama',
    })

    expect(game.getWaiting().name).toBe('dennis')

    const action = game.getWaiting().actions[0]
    expect(action.name).toBe('Launch Self in Viper')
  })

})

describe('distribute title cards', () => {

  test("automatically executed after character selection", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advance(
      factory.phases.POST_CHARACTER_SELECTION
    ).game

    expect(game.getPlayerWithCard('President').name).toBe('dennis')
    expect(game.getPlayerWithCard('Admiral').name).toBe('micah')
  })

})

describe('distribute loyalty cards', () => {

  test("deals one card to each player", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advance(
      factory.phases.POST_CHARACTER_SELECTION
    ).game

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

describe('receive initial skills', () => {

  test('second player chooses first', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advance(
      factory.phases.POST_CHARACTER_SELECTION
    ).game

    expect(game.getWaiting().name).toBe('micah')
  })

  test('William Adama initial skill options (fixed)', () => {
    const factory = new GameFixtureFactory()
    factory.options.players[1].character = 'William Adama'
    const game = factory.build().advance(
      factory.phases.POST_CHARACTER_SELECTION
    ).game

    const action = game.getWaiting().actions[0]
    expect(action.options).toStrictEqual([
      'leadership',
      'leadership',
      'leadership',
      'tactics',
      'tactics',
    ])
    expect(action.count).toBe(3)
  })

  test('Kara Thrace initial skill options (choices)', () => {
    const factory = new GameFixtureFactory()
    factory.options.players[1].character = 'Kara "Starbuck" Thrace'
    const game = factory.build().advance(
      factory.phases.POST_CHARACTER_SELECTION
    ).game

    const action = game.getWaiting().actions[0]
    expect(action.options.sort()).toStrictEqual([
      { options: ['leadership', 'engineering'] },
      'tactics',
      'tactics',
      'piloting',
      'piloting',
    ].sort())
    expect(action.count).toBe(3)
  })

})

describe('player turn', () => {

  describe('receive skills', () => {

    test('skills dealt automatically for fixed skills', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advance(
        factory.phases.POST_SETUP
      ).game

      const skillKinds = game
        .getCardsKindByPlayer('skill', 'dennis')
        .map(c => c.deck.split('.')[1])
        .sort()
      expect(skillKinds).toStrictEqual(['engineering', 'leadership', 'politics', 'politics'])

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Movement')
    })

    test('player given choice for optional skills', () => {
      const factory = new GameFixtureFactory()
      factory.options.players[0].character = 'Kara "Starbuck" Thrace'
      factory.options.players[1].character = 'Gaius Baltar'
      const game = factory.build().advance(
        factory.phases.POST_SETUP
      ).game

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Select Skills')
      expect(action.options).toStrictEqual([
        {
          "options": [
            "leadership",
            "engineering",
          ],
        },
      ])
    })

    test('player draws all cards after making optional choices', () => {
      const factory = new GameFixtureFactory()
      factory.options.players[0].character = 'Kara "Starbuck" Thrace'
      factory.options.players[1].character = 'Gaius Baltar'
      const game = factory.build().advance(
        factory.phases.POST_SETUP
      ).game

      game.submit({
        actor: 'dennis',
        name: 'Select Skills',
        option: 'engineering',
      })

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Movement')
    })

    test('player in sickbay draws one card', () => {
      const factory = new GameFixtureFactory()
      factory.options.players[0].character = 'Kara "Starbuck" Thrace'
      factory.options.players[1].character = 'Gaius Baltar'
      factory.build().advance(factory.phases.POST_CHARACTER_SELECTION)

      // Move Kara to sickbay
      factory.game.rk.sessionStart(session => {
        factory.game.mMovePlayer('dennis', 'locations.sickbay')
      })

      const game = factory.advance(factory.phases.POST_SETUP).game
      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Select Skills')
      expect(action.options).toStrictEqual([
        "leadership",
        "tactics",
        "piloting",
        "engineering",
      ])
    })

    test.skip('revealed cylons draw two cards', () => {

    })

  })

  describe("movement", () => {

    test("player in brig can't move", () => {
      const factory = new GameFixtureFactory()
      factory.build().advance(factory.phases.POST_CHARACTER_SELECTION)
      factory.game.rk.sessionStart(session => {
        factory.game.mMovePlayer('dennis', 'locations.brig')
      })

      const game = factory.advance(factory.phases.POST_SETUP).game
      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Action')
    })

    test("player on Galactica asked to move", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advance(factory.phases.POST_SETUP).game

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Movement')
      expect(action.options.length).toBe(2)
    })

    test("player on Galactica current location excluded", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advance(factory.phases.POST_SETUP).game

      const action = game.getWaiting().actions[0]
      const galacticaOptions = action.options.find(o => o.name === 'Galactica').options
      expect(galacticaOptions.length).toBe(7)
      expect(galacticaOptions.includes('Research Lab')).toBe(false)

      // Ensure a galactica location is actuall there
      expect(galacticaOptions.includes('Hangar Deck')).toBe(true)
    })

    test("player on Galactica can see Colonial One locations", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advance(factory.phases.POST_SETUP).game

      const action = game.getWaiting().actions[0]
      const galacticaOptions = action.options.find(o => o.name === 'Colonial One').options
      expect(galacticaOptions.length).toBe(3)
      expect(galacticaOptions.includes('Administration')).toBe(true)
    })

    test("damaged locations excluded", () => {
    })

    test("destroyed Colonial One excluded", () => {
      const factory = new GameFixtureFactory()
      factory.build().advance(factory.phases.FIRST_RUN)
      factory.game.rk.sessionStart(() => {
        factory.game.aDestroyColonialOne()
      })
      factory.advance(factory.phases.POST_SETUP)

      const game = factory.game
      const action = game.getWaiting().actions[0]
      const galacticaOptions = action.options.find(o => o.name === 'Colonial One')
      expect(galacticaOptions).not.toBeDefined()
    })

    test.skip("revealed cylon player movement options", () => {

    })

  })

})

describe('misc functions', () => {
  test('aDestroyColonialOne', () => {})
})