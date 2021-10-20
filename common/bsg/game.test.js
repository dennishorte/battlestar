const GameFixtureFactory = require('./test/fixture.js')
const util = require('../lib/util.js')

describe('new game', () => {
  test("first run initializes space zones", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('setup').game

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
})

describe('character selection', () => {

  test("first player can choose any character", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('character-selection-do', 'dennis').game
    game.run()

    const waiting = game.getWaiting()
    expect(waiting.name).toBe('dennis')
    expect(waiting.actions).toStrictEqual([
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
    ])
  })

  function _chooseCharacter(name) {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('character-selection-do', 'dennis').game
    game.run()
    game.submit({
      actor: 'dennis',
      name: 'Select Character',
      option: [name],
    })
    return game
  }

  test("when first player chooses, character card is moved", () => {
    const game = _chooseCharacter('Gaius Baltar')
    expect(game.getCardCharacterByPlayer('dennis').name).toBe('Gaius Baltar')

    const playerHand = game.getZoneByPlayer('dennis').cards
    const playerHandNames = playerHand.map(c => c.name).sort()
    expect(playerHandNames).toStrictEqual(['Gaius Baltar'])
  })

  test("when first player chooses, pawn is placed", () => {
    const game = _chooseCharacter('Gaius Baltar')
    const researchLabZone = game.getZoneByLocationName('Research Lab')
    const researchLabCardNames = researchLabZone.cards.map(c => c.name)
    expect(researchLabCardNames).toStrictEqual(['dennis'])
  })

  test("when first player chooses, advances to next player", () => {
    const game = _chooseCharacter('Gaius Baltar')
    const waiting = game.getWaiting()
    expect(waiting.name).toBe('micah')
    expect(waiting.actions).toStrictEqual([
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
    ])
  })

  test("second player choices are reflected", () => {
    const game = _chooseCharacter('Gaius Baltar')
    game.submit({
      actor: 'micah',
      name: 'Select Character',
      option: ['Kara "Starbuck" Thrace'],
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
    const game = _chooseCharacter('Lee "Apollo" Adama')
    expect(game.getWaiting().name).toBe('dennis')

    const action = game.getWaiting().actions[0]
    expect(action.name).toBe('Launch Self in Viper')
  })

})

describe('distribute title cards', () => {

  test("automatically executed after character selection", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn').game

    expect(game.getPlayerWithCard('President').name).toBe('dennis')
    expect(game.getPlayerWithCard('Admiral').name).toBe('micah')
  })

})

describe('distribute loyalty cards', () => {

  test("deals one card to each player", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn').game

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

      // Number of cards remaining should be 4 (one extra due to Sharon)
      const loyaltyDeck = game.getZoneByName('decks.loyalty')
      expect(loyaltyDeck.cards.length).toBe(4)
    }
  })

  test("works when nobody choose Gaius", () => {
    const factory = new GameFixtureFactory()
    factory.options.players[0].character = 'William Adama'
    const game = factory.build().advanceTo('player-turn').game
  })

  test.skip("adds sympathizer card after dealing initial cards", () => {
    const game = gameFixturePostCharacterSelection()
  })

})

describe('receive initial skills', () => {

  test('second player chooses first', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('receive-initial-skills-do').game
    game.run()

    expect(game.getWaiting().name).toBe('micah')
  })

  test('William Adama initial skill options (fixed)', () => {
    const factory = new GameFixtureFactory()
    factory.options.players[1].character = 'William Adama'
    const game = factory.build().advanceTo('receive-initial-skills-do').game
    game.run()

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
    const game = factory.build().advanceTo('receive-initial-skills-do').game
    game.run()

    const action = game.getWaiting().actions[0]
    expect(action.options.sort()).toStrictEqual([
      {
        name: 'Optional Skills',
        options: ['leadership', 'engineering']
      },
      'tactics',
      'tactics',
      'piloting',
      'piloting',
    ].sort())
    expect(action.count).toBe(3)
  })

  test('Submitting initial skill choices (with optionals)', () => {
    const factory = new GameFixtureFactory()
    factory.options.players[1].character = 'Kara "Starbuck" Thrace'
    const game = factory.build().advanceTo('receive-initial-skills-do').game
    game.run()
    game.submit({
      actor: 'micah',
      name: 'Select Starting Skills',
      option: [
        'tactics',
        'piloting',
        {
          name: 'Optional Skills',
          option: ['engineering'],
        }
      ]
    })

    const playerSkillNames = game.getCardsKindByPlayer('skill', 'micah').map(c => {
      return c.deck.replace('decks.', '')
    })
    expect(playerSkillNames.sort()).toStrictEqual(['engineering', 'piloting', 'tactics'])
  })

})

describe('player turn', () => {

  describe('receive skills', () => {

    test('skills dealt automatically for fixed skills', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-receive-skills', 'dennis').game
      game.run()

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
      util.array.swap(factory.options.players, 0, 1)
      const game = factory.build().advanceTo('player-turn-receive-skills', 'micah').game
      game.run()

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Select Skills')
      expect(action.options).toStrictEqual([
        {
          name: 'Optional Skills',
          options: [
            "leadership",
            "engineering",
          ],
        },
      ])
    })

    test('player draws all cards after making optional choices', () => {
      const factory = new GameFixtureFactory()
      util.array.swap(factory.options.players, 0, 1)
      const game = factory.build().advanceTo('player-turn-receive-skills').game
      game.run()
      game.submit({
        actor: 'dennis',
        name: 'Select Skills',
        option: ['engineering'],
      })

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Movement')
    })

    test('player in sickbay draws one card', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-receive-skills').game
      game.rk.sessionStart(session => {
        game.mMovePlayer('dennis', 'locations.sickbay')
      })
      game.run()

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Select Skills')
      expect(action.options).toStrictEqual([
        "politics",
        "leadership",
        "engineering",
      ])
    })

    test('revealed cylons draw two cards', () => {
      const factory = new GameFixtureFactory()
      factory.build().advanceTo('player-turn-receive-skills')
      const game = factory.game

      jest.spyOn(game, 'checkPlayerIsRevealedCylon').mockImplementation(player => {
        return player === 'dennis' || player.name === 'dennis'
      })
      game.run()

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Select Skills')
      expect(action.count).toBe(2)
      expect(action.options).toStrictEqual([
        "engineering",
        "engineering",
        "leadership",
        "leadership",
        "piloting",
        "piloting",
        "politics",
        "politics",
        "tactics",
        "tactics",
      ])
    })

  })

  describe("movement", () => {

    test("player in brig can't move", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      factory.game.rk.sessionStart(session => {
        factory.game.mMovePlayer('dennis', 'locations.brig')
      })
      game.run()

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Action')
    })

    test("player on Galactica asked to move", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting().actions[0]
      expect(game.getWaiting().name).toBe('dennis')
      expect(action.name).toBe('Movement')
      expect(action.options.length).toBe(3)
    })

    test("player on Galactica current location excluded", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting().actions[0]
      const galacticaOptions = action.options.find(o => o.name === 'Galactica').options
      expect(galacticaOptions.length).toBe(7)
      expect(galacticaOptions.includes('Research Lab')).toBe(false)

      // Ensure a galactica location is actually there
      expect(galacticaOptions.includes('Hangar Deck')).toBe(true)
    })

    test("player on Galactica can see Colonial One locations", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting().actions[0]
      const options = action.options.find(o => o.name === 'Colonial One').options
      expect(options.length).toBe(3)
      expect(options.includes('Administration')).toBe(true)
    })

    test("destroyed Colonial One excluded", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.aDestroyColonialOne()
      game.run()

      const action = game.getWaiting().actions[0]
      const galacticaOptions = action.options.find(o => o.name === 'Colonial One')
      expect(galacticaOptions).not.toBeDefined()
    })

    test("revealed cylon player movement options", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game

      jest.spyOn(game, 'checkPlayerIsRevealedCylon').mockImplementation(player => {
        return player === 'dennis' || player.name === 'dennis'
      })
      game.rk.sessionStart(() => {
        game.mMovePlayer('dennis', 'locations.caprica')
      })
      game.run()

      const action = game.getWaiting().actions[0]
      const options = action.options.find(o => o.name === 'Cylon Locations').options
      expect(options.length).toBe(3)
      expect(options.includes('Caprica')).toBe(false)
      expect(options.includes('Cylon Fleet')).toBe(true)
    })

    test("damaged locations excluded", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.aDamageLocationByName('Command')
      game.run()

      const action = game.getWaiting().actions[0]
      const galacticaOptions = action.options.find(o => o.name === 'Galactica').options
      expect(galacticaOptions.length).toBe(6)
      expect(galacticaOptions.includes('Command')).toBe(false)
      expect(galacticaOptions.includes('Research Lab')).toBe(false)
    })

    test("player with no cards can't change ships", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      const playerCards = game.getZoneByPlayer('dennis').cards.filter(c => c.kind === 'skill')
      game.aDiscardSkillCards('dennis', playerCards)
      game.run()

      const action = game.getWaiting().actions[0]
      expect(action.options.length).toBe(2)
      expect(action.options[0].name).toBe('Galactica')
    })

    test("player can choose not to move", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting().actions[0]
      expect(action.options).toEqual(expect.arrayContaining(['Skip Movement']))
    })

    describe("submit movement", () => {

      test("player token is relocated", () => {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-movement').game
        game.run()
        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: [{
            name: 'Galactica',
            option: 'Command',
          }]
        })

        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.command')
      })

      test("for different ship, player is asked to discard a card", () => {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-movement').game
        game.run()
        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: [{
            name: 'Colonial One',
            option: 'Administration',
          }]
        })

        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.administration')
        expect(game.getWaiting().actions[0].name).toBe('Discard Skill Card')
      })

      test("if passing, token isn't moved", () => {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-movement').game
        game.run()

        // Pre-condition
        expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Research Lab')

        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: ['Skip Movement']
        })

        // Post-condition
        expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Research Lab')
        expect(game.getWaiting().actions[0].name).toBe('Action')
      })

    })

    describe("player piloting viper", () => {

      function _playerInSpace() {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-movement').game
        game.rk.sessionStart(() => {
          game.mMovePlayer('dennis', 'space.space5')
        })
        game.run()
        return game
      }

      test("can move to any ship location, by discarding", () => {
        const game = _playerInSpace()
        const action = game.getWaiting().actions[0]

        expect(game.getZoneByName('space.space5').cards.length).toBe(2)

        const galacticaOptions = action.options.find(o => o.name === 'Galactica').options
        expect(galacticaOptions.length).toBe(8)

        const colonialOneOptions = action.options.find(o => o.name === 'Colonial One').options
        expect(colonialOneOptions.length).toBe(3)

        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: [{
            name: 'Colonial One',
            option: 'Administration',
          }]
        })

        expect(game.getZoneByName('space.space5').cards.length).toBe(0)
        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.administration')
        expect(game.getWaiting().actions[0].name).toBe('Discard Skill Card')
      })

      test("can't land viper if no cards in hand", () => {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-movement').game
        game.rk.sessionStart(() => {
          game.mMovePlayer('dennis', 'space.space5')
        })
        const playerCards = game.getZoneByPlayer('dennis').cards.filter(c => c.kind === 'skill')
        game.aDiscardSkillCards('dennis', playerCards)
        game.run()

        const action = game.getWaiting().actions[0]
        expect(action.options.length).toBe(2)
        expect(action.options).toEqual(expect.arrayContaining(['Skip Movement']))

        const moveViperAction = action.options.find(o => o.name === 'Move Viper')
        expect(moveViperAction.name).toBe('Move Viper')
      })

      test("can move to adjacent space zones", () => {
        const game = _playerInSpace()
        const action = game.getWaiting().actions[0]
        const viperMovement = action.options.find(o => o.name === 'Move Viper')

        expect(viperMovement.options).toStrictEqual(['space.space0', 'space.space4'])
      })

      test("submitted space movement move player token and viper", () => {
        const game = _playerInSpace()
        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: [{
            name: 'Move Viper',
            option: 'space.space0',
          }],
        })

        // player and viper moved to new location
        expect(game.getZoneByPlayerLocation('dennis').name).toBe('space.space0')
        expect(game.getZoneByName('space.space5').cards).toStrictEqual([])

        const space0CardNames = game.getZoneByName('space.space0').cards.map(c => c.name)
        expect(space0CardNames).toEqual(expect.arrayContaining(['dennis', 'viper']))

        // Move phase complete; ready for Action phase
        expect(game.getWaiting().actions[0].name).toBe('Action')
      })

    })

  })

})

describe('misc functions', () => {
  describe.skip('aDestroyColonialOne', () => {

    test("Check works correctly", () => {

    })

    test("Players on Colonial One moved to sickbay", () => {

    })

    test("Can't move there anymore", () => {

    })

  })
})
