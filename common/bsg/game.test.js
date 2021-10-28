Error.stackTraceLimit = 100

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

    const waiting = game.getWaiting('dennis')
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
    const waiting = game.getWaiting('micah')
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
    const action = game.getWaiting('dennis').actions[0]
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

    expect(game.getWaiting('micah')).toBeDefined()
  })

  test('William Adama initial skill options (fixed)', () => {
    const factory = new GameFixtureFactory()
    factory.options.players[1].character = 'William Adama'
    const game = factory.build().advanceTo('receive-initial-skills-do').game
    game.run()

    const action = game.getWaiting('micah').actions[0]
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

    const action = game.getWaiting('micah').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
      expect(action.name).toBe('Movement')
    })

    test('player given choice for optional skills', () => {
      const factory = new GameFixtureFactory()
      util.array.swap(factory.options.players, 0, 1)
      const game = factory.build().advanceTo('player-turn-receive-skills', 'dennis').game
      game.run()

      const action = game.getWaiting('dennis').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
      expect(action.name).toBe('Movement')
    })

    test('player in sickbay draws one card', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-receive-skills').game
      game.rk.sessionStart(session => {
        game.mMovePlayer('dennis', 'locations.sickbay')
      })
      game.run()

      const action = game.getWaiting('dennis').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
      expect(action.name).toBe('Action')
    })

    test("player on Galactica asked to move", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      expect(action.name).toBe('Movement')
      expect(action.options.length).toBe(3)
    })

    test("player on Galactica current location excluded", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting('dennis').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
      const options = action.options.find(o => o.name === 'Colonial One').options
      expect(options.length).toBe(3)
      expect(options.includes('Administration')).toBe(true)
    })

    test("destroyed Colonial One excluded", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.aDestroyColonialOne()
      game.run()

      const action = game.getWaiting('dennis').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
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

      const action = game.getWaiting('dennis').actions[0]
      expect(action.options.length).toBe(2)
      expect(action.options[0].name).toBe('Galactica')
    })

    test("player can choose not to move", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      expect(action.options).toEqual(expect.arrayContaining(['Skip Movement']))
    })

    test("Helo can't move or act on the first round", () => {
      const factory = new GameFixtureFactory()
      factory.options.players[0].character = 'Karl "Helo" Agathon'
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      expect(action.name).toBe('test')
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
            option: ['Command'],
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
            option: ['Administration'],
          }]
        })

        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.administration')
        expect(game.getWaiting('dennis').actions[0].name).toBe('Discard Skill Card')
      })

      // Added due to a crash caused by this problem
      test("locations with multiple-word name", () => {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-movement').game
        game.run()
        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: [{
            name: 'Galactica',
            option: ['Research Lab'],
          }]
        })

        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.researchLab')
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
        expect(game.getWaiting('dennis').actions[0].name).toBe('Action')
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
        const action = game.getWaiting('dennis').actions[0]

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
            option: ['Administration'],
          }]
        })

        expect(game.getZoneByName('space.space5').cards.length).toBe(0)
        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.administration')
        expect(game.getWaiting('dennis').actions[0].name).toBe('Discard Skill Card')
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

        const action = game.getWaiting('dennis').actions[0]
        expect(action.options.length).toBe(2)
        expect(action.options).toEqual(expect.arrayContaining(['Skip Movement']))

        const moveViperAction = action.options.find(o => o.name === 'Move Viper')
        expect(moveViperAction.name).toBe('Move Viper')
      })

      test("can move to adjacent space zones", () => {
        const game = _playerInSpace()
        const action = game.getWaiting('dennis').actions[0]
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
            option: ['space.space0'],
          }],
        })

        // player and viper moved to new location
        expect(game.getZoneByPlayerLocation('dennis').name).toBe('space.space0')
        expect(game.getZoneByName('space.space5').cards).toStrictEqual([])

        const space0CardNames = game.getZoneByName('space.space0').cards.map(c => c.name)
        expect(space0CardNames).toEqual(expect.arrayContaining(['dennis', 'viper']))

        // Move phase complete; ready for Action phase
        expect(game.getWaiting('dennis').actions[0].name).toBe('Action')
      })

    })

  })

  describe('action', () => {

    function _takeAction(kind, option, beforeAction) {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-action').game
      if (beforeAction) {
        beforeAction(game)
      }
      game.run()
      game.submit({
        actor: 'dennis',
        name: 'Action',
        option: [{
          name: kind,
          option: [option],
        }]
      })
      return game
    }

    test('skip action', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-action').game
      game.run()

      game.submit({
        actor: 'dennis',
        name: 'Action',
        option: ['Skip Action']
      })

      expect(game.getWaiting('dennis').actions[0].name).toBe('test')
    })

    describe.skip('once per game actions', () => {
      test("each player can only use one once per game action", () => {

      })

      describe("Gaius Baltar", () => {

      })

      describe("Laura Roslin", () => {

      })

      describe('Lee "Apollo" Adama', () => {

      })

      describe("Saul Tigh", () => {

      })

      describe("Tom Zarek", () => {

      })
    })

    describe('card actions', () => {
      describe('Consolidate Power', () => {

      })

      describe('Executive Order', () => {

      })

      describe('Launch Scout', () => {

      })

      describe('Maximum Firepower', () => {

      })

      describe('Repair', () => {

      })
    })

    describe('location actions', () => {
      describe("Admiral's Quarters", () => {

        test('choose a player', () => {
          const game = _takeAction('Location Action', "Admiral's Quarters")
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah', 'tom'])
        })

        test("can't choose Cylons", () => {
          const game = _takeAction('Location Action', "Admiral's Quarters", (game) => {
            game.rk.sessionStart(() => {
              game.mSetPlayerIsRevealedCylon('tom')
            })
          })
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah'])
        })

        test("can't choose players already in brig", () => {
          const game = _takeAction('Location Action', "Admiral's Quarters", (game) => {
            game.rk.sessionStart(() => {
              game.mMovePlayer('tom', 'locations.brig')
            })
          })
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah'])
        })

        test('skill check launched', () => {
          const game = _takeAction('Location Action', "Admiral's Quarters")
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })

          const waiting = game.getWaiting()[0]
          const action = waiting.actions[0]
          expect(action.name).toBe('Skill Check - Discuss')
        })

        test.skip('skill check passed moves chosen player to brig', () => {
          const game = _takeAction('Location Action', "Admiral's Quarters")
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })
          game.aSelectSkillCheckResult('pass')

          const playerLocation = game.getZoneByPlayerLocation('tom')
          expect(playerLocation.name).toBe('locations.brig')
        })

        test.skip('skill check failed means nothing happens', () => {
          const game = _takeAction('Location Action', "Admiral's Quarters")
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })
          game.aSelectSkillCheckResult('fail')

          const playerLocation = game.getZoneByPlayerLocation('tom')
          expect(playerLocation.name).toBe('locations.armory')
        })

        test.skip("Saul Tigh can use his Cylon Hatred ability", () => {

        })

        test.skip('William Adama cannot use this action', () => {

        })
      })

      describe("Armory", () => {

      })

      describe("Command", () => {

      })

      describe("Communications", () => {

      })

      describe("FTL Control", () => {

      })

      describe("Hangar Deck", () => {

      })

      describe("Research Lab", () => {

        test('leads to draw cards', () => {
          const game = _takeAction('Location Action', 'Research Lab')
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Draw Skill Cards')
        })

      })

      describe("Weapons Control", () => {

      })

      describe("Brig", () => {

      })

      describe("Administration", () => {

      })

      describe("President's Office", () => {

      })

      describe("Press Room", () => {

      })

      describe("Caprica", () => {

      })

      describe("Cylon Fleet", () => {

      })

      describe("Human Fleet", () => {

      })

      describe("Resurrection Ship", () => {

      })
    })

    describe('quorum actions', () => {
      describe("Accept Prophecy", () => {

      })

      describe("Arrest Order", () => {

      })

      describe("Assign Arbitrator", () => {

      })

      describe("Assign Mission Specialist", () => {

      })

      describe("Assign Vice President", () => {

      })

      describe("Authorization of Brutal Force", () => {

      })

      describe("Encourage Mutiny", () => {

      })

      describe("Food Rationing", () => {

      })

      describe("Inspirational Speech", () => {

      })

      describe("Presidential Pardon", () => {

      })

      describe("Release Cylon Mugshots", () => {

      })
    })

    describe('loyalty actions', () => {
      describe("CAN REDUCE MORALE BY 1", () => {

      })

      describe("CAN SEND A CHARACTER TO SICKBAY", () => {

      })

      describe("CAN SEND A CHARACTER TO THE BRIG", () => {

      })

      describe("CAN DAMAGE GALACTICA", () => {

      })
    })

  })
})

describe('adhoc transitions', () => {

  describe('draw-skill-cards', () => {

  })

  describe('Launch Self on Viper', () => {
    test('vipers on the hangar deck', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('character-selection-do', 'dennis').game
      game.run()
      game.submit({
        actor: 'dennis',
        name: 'Select Character',
        option: ['Lee "Apollo" Adama'],
      })

      expect(game.getWaiting('dennis').actions[0]).toStrictEqual({
        name: 'Launch Self in Viper',
        options: [
          'Lower Left',
          'Lower Right',
        ],
      })

      const numVipersBeforeLaunch = game
        .getZoneByName('space.space4')
        .cards
        .filter(c => c.kind === 'ships.vipers')
        .length
      expect(numVipersBeforeLaunch).toBe(1)

      game.submit({
        actor: 'dennis',
        name: 'Launch Self in Viper',
        option: ['Lower Right'],
      })

      const playerLocation = game.getZoneByPlayerLocation('dennis')
      expect(playerLocation.name).toBe('space.space4')

      const numVipersAtPlayerLocation = playerLocation
        .cards
        .filter(c => c.kind === 'ships.vipers')
        .length
      expect(numVipersAtPlayerLocation).toBe(2)
    })

    test('need to recall a viper', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('character-selection-do', 'dennis').game
      // Launch all of the vipers
      game.rk.sessionStart(() => {
        while (game.getVipersNumAvailable() > 0) {
          game.mLaunchViper('Lower Left')
        }
      })

      // Preconditions
      expect(game.getZoneByName('ships.vipers').cards.length).toBe(0)

      game.run()

      game.submit({
        actor: 'dennis',
        name: 'Select Character',
        option: ['Lee "Apollo" Adama'],
      })

      game.submit({
        actor: 'dennis',
        name: 'Relaunch Viper',
        option: [
          {
            name: 'Recall from',
            option: ['space.space5']
          },
          {
            name: 'Launch to',
            option: ['Lower Right']
          },
        ],
      })

      const playerLocation = game.getZoneByPlayerLocation('dennis')
      expect(playerLocation.name).toBe('space.space4')

      const numVipersAtPlayerLocation = playerLocation
        .cards
        .filter(c => c.kind === 'ships.vipers')
        .length
      expect(numVipersAtPlayerLocation).toBe(2)

      const vipersAtSpace5 = game
        .getZoneByName('space.space5')
        .cards
        .filter(c => c.kind === 'ships.vipers')
        .length
      expect(vipersAtSpace5).toBe(4)
    })

  })
})

describe('skill checks', () => {

  function _sendTomToBrig(beforeChoose) {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-action').game
    game.run()
    game.submit({
      actor: 'dennis',
      name: 'Action',
      option: [{
        name: 'Location Action',
        option: ["Admiral's Quarters"],
      }]
    })
    if (beforeChoose) {
      beforeChoose(game)
    }
    game.submit({
      actor: 'dennis',
      name: 'Choose a Player',
      option: ['tom']
    })

    return game
  }

  function _addCardsFixture(options) {
    options = options || {}

    const game = _sendTomToBrig(options.beforeChoose)
    game.rk.sessionStart(session => {
      if (options.useScientificResearch) {
        session.put(game.getSkillCheck(), 'scientificResearch', true)
      }
      if (options.useInvestigativeCommitee) {
        session.put(game.getSkillCheck(), 'investigativeCommittee', true)
      }
    })

    game.submit({
      actor: 'dennis',
      name: 'Skill Check - Discuss',
      option: [
        {
          name: 'How much can you help?',
          option: ['a little'],
        },
        {
          name: 'Start Skill Check',
          option: ['yes'],
        },
      ],
    })

    return game
  }


  describe('skill-check-discuss', () => {
    test('all players can act simultaneously', () => {
      const game = _sendTomToBrig()
      const waitingActors = game.getWaiting().map(w => w.actor).sort()
      expect(waitingActors).toStrictEqual(['dennis', 'micah', 'tom'])
    })

    test('players can submit in any order', () => {
      const game = _sendTomToBrig()
      game.submit({
        actor: 'tom',
        name: 'Skill Check - Discuss',
        option: [{
          name: 'How much can you help?',
          option: ['a little'],
        }]
      })

      // expect no errors

      game.submit({
        actor: 'micah',
        name: 'Skill Check - Discuss',
        option: [{
          name: 'How much can you help?',
          option: ['none'],
        }]
      })

      // expect no errors
    })

    test('players can cancel their initial selection', () => {
      const game = _sendTomToBrig()
      game.submit({
        actor: 'tom',
        name: 'Skill Check - Discuss',
        option: [{
          name: 'How much can you help?',
          option: ['a little'],
        }],
      })

      expect(game.getWaiting('tom').actions[0].name).toBe('Skill Check - Discuss')
      expect(game.getWaiting('tom').actions[0].options).toStrictEqual([{
        name: 'Change Answer',
        options: ['yes'],
      }])

      game.submit({
        actor: 'tom',
        name: 'Skill Check - Discuss',
        option: [{
          name: 'Change Answer',
          option: ['yes'],
        }]
      })

      expect(game.getWaiting('tom').actions[0].name).toBe('Skill Check - Discuss')
      expect(game.getSkillCheck().discussion['tom'].support).toBe('')
    })

    test('current player can advance to next step', () => {
      const game = _sendTomToBrig()

      const optionNames1 = game.getWaiting('dennis').actions[0].options.map(o => o.name)
      expect(optionNames1).toEqual(expect.arrayContaining(['Start Skill Check']))

      // Can submit plans and still advance to the next step
      game.submit({
        actor: 'dennis',
        name: 'Skill Check - Discuss',
        option: [{
          name: 'How much can you help?',
          option: ['a little'],
        }],
      })

      const optionNames2 = game.getWaiting('dennis').actions[0].options.map(o => o.name)
      expect(optionNames2).toEqual(expect.arrayContaining(['Start Skill Check']))
    })

    test.skip('players can use Scientific Research', () => {

    })

    test.skip('players can use Investigative Committee', () => {

    })

    test.skip('no Scientific Research for skill checks that already have positive blue', () => {

    })

    test.skip('only the first player to use Scientific Research plays a card', () => {

    })

    test.skip('only the first player to use Investigative Committee plays a card', () => {

    })

    test.skip('player can choose non-skill check choice if available', () => {

    })
  })

  describe('skill-check-add-cards', () => {

    test('destiny cards are added', () => {
      const game = _addCardsFixture()
      const crisisPool = game.getZoneByName('crisisPool')
      const destiny = game.getZoneByName('destiny')
      expect(destiny.cards.length).toBe(8)
      expect(crisisPool.cards.length).toBe(2)
    })

    test('the player after the current turn player goes first', () => {
      const game = _addCardsFixture()
      const waiting = game.getWaiting()
      expect(waiting.length).toBe(1)
      expect(waiting[0].actor).toBe('micah')
    })

    test('step ends after each player has submitted', () => {
      const game = _addCardsFixture()
      game.submit({
        actor: 'micah',
        name: 'Skill Check - Add Cards',
        option: ['Do Nothing']
      })
      game.submit({
        actor: 'tom',
        name: 'Skill Check - Add Cards',
        option: ['Do Nothing']
      })
      game.submit({
        actor: 'dennis',
        name: 'Skill Check - Add Cards',
        option: ['Do Nothing']
      })
      const waiting = game.getWaiting()
      expect(waiting[0].actions[0].name).toBe('Skill Check - Post Reveal')
    })

    test('options are separated into positive and negative sections', () => {
      const game = _addCardsFixture()
      const actionOptions = game.getWaiting('micah').actions[0].options
      const helpOptions = actionOptions.find(o => o.name === 'Help').options
      const hinderOptions = actionOptions.find(o => o.name === 'Hinder').options

      expect(helpOptions.length).toBe(2)
      expect(hinderOptions.length).toBe(1)
    })

    test('added cards are moved to the crisis pool', () => {
      const game = _addCardsFixture()
      const waiting = game.getWaiting('micah')
      const helpCard = waiting.actions[0].options.find(o => o.name === 'Help').options[0]

      game.submit({
        actor: 'micah',
        name: 'Skill Check - Add Cards',
        option: [{
          name: 'Help',
          option: [helpCard],
        }]
      })

      const crisisPool = game.getZoneByName('crisisPool')
      expect(crisisPool.cards.length).toBe(3)
    })

    test('investigative committee causes cards to be face up', () => {
      const game = _addCardsFixture({
        useInvestigativeCommitee: true,
      })

      const crisisPool = game.getZoneByName('crisisPool')
      const visibilityLength = crisisPool.cards.map(c => c.visibility.length)
      expect(visibilityLength).toStrictEqual([3, 3])
    })

    test('scientific research causes blue cards to become positive', () => {
      const game = _addCardsFixture({
        useScientificResearch: true,
      })

      // Skip to Tom, who has blue cards in hand.
      game.submit({
        actor: 'micah',
        name: 'Skill Check - Add Cards',
        option: ['Do Nothing'],
      })

      const action = game
        .getWaiting('tom')
        .actions[0]
        .options
        .find(o => o.name === 'Help')
        .options
        .find(o => o.startsWith('Scientific') || o.startsWith('Repair'))

      expect(action).toBeDefined()
    })

    test('players in the brig can only add 1 card', () => {

    })

    test('players can pre-enqueue declare emergency', () => {

    })

    test('Chief "Galen" Tyrol can pre-enqueue his Blind Devotion ability', () => {

    })
  })


  describe('skill-check-post-reveal', () => {

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
