Error.stackTraceLimit = 100

const GameFixtureFactory = require('./test/fixture.js')
const bsgutil = require('./util.js')
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
        option: [{
          name: 'Optional Skills',
          option: ['engineering'],
        }]
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
      expect(action.name).not.toBe('Movement')
      expect(action.name).not.toBe('Action')
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
        expect(game.getWaiting('dennis').actions[0].name).toBe('Discard Skill Cards')
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
            option: ['Hangar Deck'],
          }]
        })

        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.hangarDeck')
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
        expect(game.getWaiting('dennis').actions[0].name).toBe('Discard Skill Cards')
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

    function _takeActionWithMove(kind, option, beforeAction) {
      const factory = new GameFixtureFactory()
      if (kind === 'Location Action') {
        factory.options.players[0].movement = {
          name: 'Galactica',
          option: [option]
        }
      }
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

      expect(game.getWaiting('dennis').actions[0].name).not.toBe('Action')
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
          const game = _takeActionWithMove('Location Action', "Admiral's Quarters")
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah', 'tom'])
        })

        test("can't choose Cylons", () => {
          const game = _takeActionWithMove('Location Action', "Admiral's Quarters", (game) => {
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
          const game = _takeActionWithMove('Location Action', "Admiral's Quarters", (game) => {
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
          const game = _takeActionWithMove('Location Action', "Admiral's Quarters")
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
          const game = _takeActionWithMove('Location Action', "Admiral's Quarters")
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
          const game = _takeActionWithMove('Location Action', "Admiral's Quarters")
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

        test.skip('blocked by Jammed Assault crisis effect', () => {

        })

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

  describe('discard-skill-cards-in-parallel', () => {

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

  describe('player-turn-crisis-laura-roslin', () => {
    function _fixtureBeforeChoose() {
      const factory = new GameFixtureFactory()
      factory.options.players[0] = {
        character: 'Laura Roslin',
        movement: 'Skip Movement',
      }
      const game = factory.build().advanceTo('player-turn-action').game
      game.run()
      game.submit({
        actor: 'dennis',
        name: 'Action',
        option: [{
          name: 'Skip Action',
        }]
      })
      return game
    }

    function _fixtureAfterChoose() {
      const game = _fixtureBeforeChoose()
      const chooseId = bsgutil.optionName(game.getWaiting('dennis').actions[0].options[0])
      const otherId = bsgutil.optionName(game.getWaiting('dennis').actions[0].options[1])
      game.submit({
        actor: 'dennis',
        name: 'Religious Visions',
        option: [chooseId]
      })

      return { game, chooseId, otherId }
    }

    test('Gives player a choice between two crisis cards', () => {
      const game = _fixtureBeforeChoose()

      const waiting = game.getWaiting('dennis')
      expect(waiting).toBeDefined()

      const action = waiting.actions[0]
      expect(action.name).toBe('Religious Visions')
      expect(action.options.length).toBe(2)
    })

    test('after choosing, begins crisis phase with chosen crisis', () => {
      const { game, chooseId } = _fixtureAfterChoose()
      expect(game.getCrisis()).toBeDefined()
      expect(game.getCrisis().id).toBe(chooseId)
    })

    test('crisis chosen is moved to keep zone', () => {
      const { game, chooseId } = _fixtureAfterChoose()
      const { zoneName } = game.getCardByPredicate(c => c.id === chooseId)
      expect(zoneName).toBe('keep')
    })

    test('crisis not chosen is discarded', () => {
      const { game, otherId } = _fixtureAfterChoose()
      const { zoneName } = game.getCardByPredicate(c => c.id === otherId)
      expect(zoneName).toBe('discard.crisis')
    })
  })
})

describe('skill checks', () => {

  function _sendTomToBrig(beforeChoose) {
    const factory = new GameFixtureFactory()
    factory.options.players[0].movement = {
      name: 'Galactica',
      option: ["Admiral's Quarters"]
    }
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

  function _postRevealFixture(options) {
    const game = _addCardsFixture(options)
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
      expect(game.getWaiting('tom').actions[0].options).toStrictEqual(['Change Answer'])

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

      const optionNames1 = game.getWaiting('dennis').actions[0].options.map(o => o.name || o)
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

      const optionNames2 = game.getWaiting('dennis').actions[0].options.map(o => o.name || o)
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

    test.skip('Sharon can use her Mysterious Intuition', () => {

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
      const actionOptions = game.getWaiting('micah').actions[0].options[0].options
      const helpOptions = actionOptions.find(o => o.name === 'Help').options
      const hinderOptions = actionOptions.find(o => o.name === 'Hinder').options

      expect(helpOptions.length).toBe(2)
      expect(hinderOptions.length).toBe(1)
    })

    test('added cards are moved to the crisis pool', () => {
      const game = _addCardsFixture()
      const waiting = game.getWaiting('micah')
      const helpCard = waiting.actions[0].options[0].options.find(o => o.name === 'Help').options[0]

      game.submit({
        actor: 'micah',
        name: 'Skill Check - Add Cards',
        option: [{
          name: 'Add Cards to Check',
          option: [{
            name: 'Help',
            option: [helpCard],
          }]
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
        .options[0]
        .options
        .find(o => o.name === 'Help')
        .options
        .find(o => o.startsWith('Scientific') || o.startsWith('Repair'))

      expect(action).toBeDefined()
    })

    test('players in the brig can only add 1 card', () => {
      const game = _addCardsFixture()

      // Skip to Tom, after putting him in the brig
      game.rk.sessionStart(() => {
        game.mMovePlayer('tom', 'locations.brig')
      })
      game.submit({
        actor: 'micah',
        name: 'Skill Check - Add Cards',
        option: ['Do Nothing'],
      })

      const actionOptions = game.getWaiting('tom').actions[0].options
      expect(actionOptions[0].name).toBe('Add Cards to Check')
      expect(actionOptions[0].max).toBe(1)
      expect(actionOptions[0].options[0].max).toBe(1)
      expect(actionOptions[0].options[1].max).toBe(1)
    })

    test.skip('players can pre-enqueue declare emergency', () => {

    })

    test.skip('Chief "Galen" Tyrol can pre-enqueue his Blind Devotion ability', () => {

    })
  })


  describe('skill-check-post-reveal', () => {

    test.skip('William Adama can choose to keep all the skill cards', () => {

    })

  })

})

describe('player-turn-crisis', () => {
  function _crisisFixture(crisisName, func) {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-crisis').game

    const crisisDeck = game.getZoneByName('decks.crisis')
    const crisisCardIndex = crisisDeck.cards.findIndex(c => c.name === crisisName)
    util.assert(crisisCardIndex !== -1, `Unable to find crisis card: ${crisisName}`)

    game.rk.sessionStart(() => {
      game.mMoveByIndices(crisisDeck, crisisCardIndex, crisisDeck, 0)
    })

    if (func) {
      func(game)
    }

    game.run()

    return game
  }

  describe('cylon player', () => {

  })

  describe('choice cards', () => {
    test('Admiral choice cards let admiral choose', () => {
      const game = _crisisFixture('Build Cylon Detector')
      expect(game.getWaiting().length).toBe(1)
      expect(game.getWaiting('micah')).toBeDefined()
    })

    // This isn't a good test, since the president is the first player
    test.skip('President choice cards let the president choose', () => {
      const game = _crisisFixture('Food Shortage')
      expect(game.getWaiting().length).toBe(1)
      expect(game.getWaiting('dennis')).toBeDefined()
    })

    // Only optional skill checks give the current player a choice (at least in the base game)
    test.skip('Current player choice cards let the current player choose', () => {
    })
  })

  describe('cylon attack cards', () => {
    test('activate cylons first', () => {
      const game = _crisisFixture('Ambush', (game) => {
        game.aClearSpace()
        jest.spyOn(game, 'aActivateCylonShips')
        jest.spyOn(game, 'aAttackGalactica')
      })

      expect(game.aActivateCylonShips.mock.calls.length).toBe(1)
      expect(game.aAttackGalactica.mock.calls.length).toBe(0)
    })

    test('deploy the expected units', () => {
      const game = _crisisFixture('Ambush', (game) => game.aClearSpace())

      expect(game.getZoneByName('space.space0').cards.map(c => c.name))
        .toStrictEqual([ 'raider', 'raider', 'raider', 'raider' ])
      expect(game.getZoneByName('space.space1').cards.map(c => c.name))
        .toStrictEqual([])
      expect(game.getZoneByName('space.space2').cards.map(c => c.name))
        .toStrictEqual([ 'civilian' ])
      expect(game.getZoneByName('space.space3').cards.map(c => c.name))
        .toStrictEqual([ 'Basestar A', 'raider', 'raider', 'raider', 'raider' ])
      expect(game.getZoneByName('space.space4').cards.map(c => c.name))
        .toStrictEqual([ 'viper', 'viper', 'civilian' ])
      expect(game.getZoneByName('space.space5').cards.map(c => c.name))
        .toStrictEqual([ 'civilian' ])
    })

    test('card effects stay in play', () => {
      const game = _crisisFixture('Ambush')
      expect(game.checkEffect('Ambush')).toBe(true)
    })

    test('card is in the keep zone, for players to see', () => {
      const game = _crisisFixture('Ambush')
      const zone = game.getZoneByCard('Ambush')
      expect(zone.name).toBe('keep')
    })
  })

  describe('skill check cards', () => {
    test('skill check is launched', () => {
      const game = _crisisFixture('Cylon Accusation')
      const waiting = game.getWaiting()
      expect(waiting.length).toBe(3)
      expect(waiting[0].actions[0].name).toBe('Skill Check - Discuss')
    })
  })

  describe('optional skill check cards', () => {
    test('skill check is launched', () => {
      const game = _crisisFixture('Water Sabotaged')
      const waiting = game.getWaiting()
      expect(waiting.length).toBe(3)
      expect(waiting[0].actions[0].name).toBe('Skill Check - Discuss')
    })

    test.skip('current player has the choice', () => {

    })
  })
})

describe('crisis card effects', () => {

  function _crisisFixture(crisisName, func) {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-crisis').game
    const crisisDeck = game.getZoneByName('decks.crisis')
    const crisisCardIndex = crisisDeck.cards.findIndex(c => c.name === crisisName)
    util.assert(crisisCardIndex !== -1, `Unable to find crisis card: ${crisisName}`)

    game.rk.sessionStart(() => {
      game.mMoveByIndices(crisisDeck, crisisCardIndex, crisisDeck, 0)
    })

    if (func) {
      func(game)
    }

    game.run()

    return game
  }

  describe('A Traitor Accused', () => {
    describe('fail', () => {
      test.skip('Everyone is already in the brig', () => {

      })

      test.skip('Only one player can be chosen', () => {

      })

      test('Must choose someone', () => {
        const game = _crisisFixture('A Traitor Accused')
        game.aSelectSkillCheckResult('fail')

        const action = game.getWaiting('dennis').actions[0]
        expect(action.name).toBe('Choose Player')
        expect(action.options.sort()).toStrictEqual(['dennis', 'micah', 'tom'])
      })

      test("Cylons can't be chosen", () => {
        const game = _crisisFixture('A Traitor Accused', (game) => {
          jest.spyOn(game, 'checkPlayerIsRevealedCylon').mockImplementation(player => {
            return player === 'dennis' || player.name === 'dennis'
          })
        })
        game.aSelectSkillCheckResult('fail')

        const action = game.getWaiting('dennis').actions[0]
        expect(action.name).toBe('Choose Player')
        expect(action.options.sort()).toStrictEqual(['micah', 'tom'])
      })
    })
  })

  describe('Besieged', () => {
    test('Heavy Casualties (no other raiders)', () => {
      const game = _crisisFixture('Besieged', (game) => {
        game.aClearSpace()
        jest.spyOn(game, 'aActivateRaider')
      })

      expect(game.aActivateRaider.mock.calls.length).toBe(4)
    })

    test('Heavy Casualties (other raiders)', () => {
      const game = _crisisFixture('Besieged', (game) => {
        jest.spyOn(game, 'aActivateRaider')
      })

      // Four activations for the new raiders
      // Three activations for the existing raiders
      expect(game.aActivateRaider.mock.calls.length).toBe(7)
    })
  })

  describe('Bomb Threat', () => {
    test.skip('pass', () => {

    })

    test.skip('fail', () => {

    })

    test('option2 die roll 4-', () => {
      const game = _crisisFixture('Bomb Threat')

      // Pre-conditions
      expect(game.getCounterByName('morale')).toBe(10)
      expect(game.getZoneByName('decks.civilian').cards.length).toBe(10)

      jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 4)

      game.submit({
        actor: 'dennis',
        name: 'Skill Check - Discuss',
        option: ['Choose Option 2']
      })

      // Post-conditions
      expect(game.getCounterByName('morale')).toBe(9)
      expect(game.getZoneByName('decks.civilian').cards.length).toBe(9)
    })

    test('option2 die roll 5+', () => {
      const game = _crisisFixture('Bomb Threat')

      // Pre-conditions
      expect(game.getCounterByName('morale')).toBe(10)
      expect(game.getZoneByName('decks.civilian').cards.length).toBe(10)

      jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 5)

      game.submit({
        actor: 'dennis',
        name: 'Skill Check - Discuss',
        option: ['Choose Option 2']
      })

      // Post-conditions
      expect(game.getCounterByName('morale')).toBe(10)
      expect(game.getZoneByName('decks.civilian').cards.length).toBe(10)
    })
  })

  describe('Crippled Raider', () => {
    test('pass', () => {
      const game = _crisisFixture('Crippled Raider')

      expect(game.getCounterByName('jumpTrack')).toBe(0)

      game.aSelectSkillCheckResult('pass')
      game.run()

      expect(game.getCounterByName('jumpTrack')).toBe(1)
    })

    test('fail', () => {
      const game = _crisisFixture('Crippled Raider')

      expect(game.getCounterByName('population')).toBe(12)

      game.aSelectSkillCheckResult('fail')
      game.run()

      expect(game.getCounterByName('population')).toBe(11)
    })

    test('option2', () => {
      const game = _crisisFixture('Crippled Raider', (game) => game.aClearSpace())
      jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 4)

      // Pre-conditions
      expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
      expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)

      game.submit({
        actor: 'dennis',
        name: 'Skill Check - Discuss',
        option: ['Choose Option 2']
      })

      // Post-conditions
      const front = game.getZoneSpaceByIndex(0).cards.map(c => c.name)
      expect(front).toStrictEqual(['raider', 'raider', 'raider'])

      const back = game.getZoneSpaceByIndex(3).cards.map(c => c.name)
      expect(back).toStrictEqual(['civilian'])
    })
  })

  describe('Cylon Screenings', () => {

    test('pass', () => {
      const game = _crisisFixture('Cylon Screenings')
      expect(game.getCounterByName('morale')).toBe(10)
      game.aSelectSkillCheckResult('pass')
      game.run()
      // no effects
    })

    test('fail', () => {
      const game = _crisisFixture('Cylon Screenings')

      expect(game.getCounterByName('morale')).toBe(10)

      game.aSelectSkillCheckResult('fail')
      game.run()

      expect(game.getCounterByName('morale')).toBe(9)
      expect(game.getWaiting('dennis').actions[0].name).toBe('Choose')

      game.submit({
        actor: 'dennis',
        name: 'Choose',
        option: ['Admiral'],
      })

      const admiralLoyaltyCards = game.getCardsLoyaltyByPlayer('micah')
      expect(admiralLoyaltyCards.length).toBe(1)
      expect(admiralLoyaltyCards[0].visibility.sort()).toStrictEqual(['dennis', 'micah'])
    })

    test('option2', () => {
      const game = _crisisFixture('Cylon Screenings')
      expect(game.getCrisis().name).toBe('Cylon Screenings')

      game.submit({
        actor: 'dennis',
        name: 'Skill Check - Discuss',
        option: ['Choose Option 2']
      })

      expect(game.getWaiting().map(w => w.actor).sort()).toStrictEqual(['dennis', 'micah', 'tom'])
      expect(game.getWaiting('dennis').actions[0].name).toBe('Discard Skill Cards')
    })

  })

  describe('Declare Martial Law', () => {
    test('option1', () => {
      const game = _crisisFixture('Declare Martial Law')

      // Pre-conditions
      expect(game.getCounterByName('morale')).toBe(10)
      expect(game.getPlayerPresident().name).toBe('dennis')

      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 1']
      })

      // Post-conditions
      expect(game.getCounterByName('morale')).toBe(9)
      expect(game.getPlayerPresident().name).toBe('micah')
    })

    test('option2', () => {
      const game = _crisisFixture('Declare Martial Law')

      // Pre-conditions
      expect(game.getCounterByName('population')).toBe(12)

      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 2']
      })

      // Post-conditions
      expect(game.getCounterByName('population')).toBe(11)
      expect(game.getWaiting('micah')).toBeDefined()
      expect(game.getWaiting('micah').actions[0].name).toBe('Discard Skill Cards')
      expect(game.getWaiting('micah').actions[0].count).toBe(2)
    })
  })

  describe('Heavy Assault', () => {
    test('effect', () => {
      const game = _crisisFixture('Heavy Assault', (game) => {
        jest.spyOn(game, 'aAttackGalactica')
      })

      // One ship from initial deployment and one (because of max 2) from this crisis
      expect(game.aAttackGalactica.mock.calls.length).toBe(2)
    })
  })

  describe('Requested Resignation', () => {
    test('option 1a: president discards', () => {
      const game = _crisisFixture('Requested Resignation')
      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 1']
      })

      // Post-conditions
      expect(game.getWaiting('dennis')).toBeDefined()
      expect(game.getWaiting('dennis').actions[0].name).toBe('Discard Skill Cards')
      expect(game.getWaiting('dennis').actions[0].count).toBe(2)
    })

    test.skip('option 1b: admiral discards', () => {

    })

    test('option2', () => {
      const game = _crisisFixture('Requested Resignation')
      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 2']
      })

      expect(game.getWaiting('dennis')).toBeDefined()
      expect(game.getWaiting('dennis').actions[0].name).toBe('Choose')
    })

    test('option2a, give away President', () => {
      const game = _crisisFixture('Requested Resignation')
      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 2']
      })
      game.submit({
        actor: 'dennis',
        name: 'Choose',
        option: ['resign'],
      })
      expect(game.getPlayerPresident().name).toBe('micah')
    })

    test('option2b, go to brig', () => {
      const game = _crisisFixture('Requested Resignation')
      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 2']
      })
      game.submit({
        actor: 'dennis',
        name: 'Choose',
        option: ['resist'],
      })
      expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Brig')
    })
  })

  describe('Sleep Deprivation', () => {
    test('option1', () => {
      const game = _crisisFixture('Sleep Deprivation')

      // Pre-conditions
      expect(game.getZoneByName('ships.vipers').cards.length).toBe(4)
      expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Research Lab')

      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 1']
      })

      // Post-conditions
      expect(game.getZoneByName('ships.vipers').cards.length).toBe(6)
      expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Sickbay')
    })

    test('option2', () => {
      const game = _crisisFixture('Sleep Deprivation')

      // Pre-conditions
      expect(game.getCounterByName('morale')).toBe(10)

      game.submit({
        actor: 'micah',
        name: 'Choose',
        option: ['Option 2']
      })

      // Post-conditions
      expect(game.getCounterByName('morale')).toBe(9)
    })

  })

  describe('Tactical Strike', () => {
    test('Hangar Assault', () => {
      const game = _crisisFixture('Tactical Strike')
      expect(game.getZoneByName('ships.damagedVipers').cards.length).toBe(2)
    })
  })

  /*
   * Admiral Grilled
   * Ambush
   * Analyze Enemy Fighter
   * Boarding Parties
   * Build Cylon Detector
   * Colonial Day
   * Crash Landing
   * Cylon Accusation
   * Cylon Swarm
   * Cylon Tracking Device
   * Cylon Virus
   * Detector Sabotage
   * Elections Loom
   * Food Shortage
   * Forced Water Mining
   * Fullfiller of Prophecy
   * Guilt by Collusion
   * Hanger Accident
   * Informing the Public
   * Jammed Assault
   * Jump Computer Failure
   * Keep Tabs on Visitor
   * Legendary Discovery
   * Loss of a Friend
   * Low Supplies
   * Mandatory Testing
   * Missing G4 Explosives
   * Network Computers
   * Prison Labor
   * Prisoner Revolt
   * Raiding Party
   * Rescue Caprica Survivors
   * Rescue Mission
   * Rescue the Fleet
   * Resistance
   * Riots
   * Scouting for Fuel
   * Scouting for Water
   * Security Breach
   * Send Survey Team
   * Surrounded
   * Terrorist Bomber
   * Terrorist Investigations
   * The Olympic Carrier
   * Thirty-Three
   * Unexpected Reunion
   * Unidentified Ship
   * Water Sabotaged
   * Water Shortage
   * Weapon Malfunction
   * Witch Hunt */

  // Super Crises
  /* Massive Assault
   * Bomb on Colonial One
   * Cylon Intruders
   * Fleet Mobilization
   * Inbound Nukes */
})

describe('misc functions', () => {
  describe('aActivateCylonShips', () => {

    function _spaceFixture() {
      const factory = new GameFixtureFactory()
      const game = factory.build().game
      game.run()
      game.aClearSpace()
      return game
    }

    describe('basestar attacks', () => {

      test('each basestar attacks once', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space3', 'basestar')
          game.mDeploy('space.space3', 'basestar')
        })
        jest.spyOn(game, 'aAttackGalactica')
        game.aActivateCylonShips('Basestar Attacks')

        expect(game.aAttackGalactica.mock.calls.length).toBe(2)
      })

      test('disabled weapons do not attack', () => {
        const game = _spaceFixture()
        const damage = game.getCardByName('disabled weapons')
        game.rk.sessionStart(() => {
          game.mDeploy('space.space3', 'basestar')
          game.mDeploy('space.space3', 'basestar')
          game.mMoveCard('decks.damageBasestar', 'ships.basestarB', damage)
        })
        jest.spyOn(game, 'aAttackGalactica')
        game.aActivateCylonShips('Basestar Attacks')

        expect(game.aAttackGalactica.mock.calls.length).toBe(1)
      })

      test('damage is assigned to Galactica', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space3', 'basestar')
        })
        jest.spyOn(game, 'getTokenDamageGalactica').mockImplementation(() => {
          const damageZone = game.getZoneByName('decks.damageGalactica')
          return damageZone.cards.find(c => c.name === 'Damage Armory')
        })
        jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 4)
        game.aActivateBasestarAttacks()
        expect(game.checkLocationIsDamaged('Armory')).toBe(true)
      })

      test('special galactica damage tokens are applied and exiled', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space3', 'basestar')
        })
        jest.spyOn(game, 'getTokenDamageGalactica').mockImplementation(() => {
          const damageZone = game.getZoneByName('decks.damageGalactica')
          return damageZone.cards.find(c => c.name === '-1 fuel')
        })
        jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 8)
        game.aActivateBasestarAttacks()
        expect(game.getCounterByName('fuel')).toBe(7)
      })

    })

    describe('heavy raiders', () => {

      test('centurions advance', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mAddCenturion()
          game.mAddCenturion()
        })

        // They are moved forward
        for (let i = 1; i < 4; i++) {
          game.aActivateCylonShips('Hvy Raiders')
          const prevZone = game.getZoneCenturionsByIndex(i - 1)
          const zone = game.getZoneCenturionsByIndex(i)
          expect(prevZone.cards.length).toBe(0)
          expect(zone.cards.length).toBe(2)
        }

        // If they move onto the last space, the Cylons win
        game.aActivateCylonShips('Hvy Raiders')
        expect(game.getGameResult().winner).toBe('cylons')
        expect(game.getGameResult().reason).toBe('centurions')
      })

      test('heavy raiders move toward closest landing bay 0', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space0', 'heavy raider')
          game.aActivateCylonShips('Hvy Raiders')
        })

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(1)
      })

      test('heavy raiders move toward closest landing bay 1', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space1', 'heavy raider')
          game.aActivateCylonShips('Hvy Raiders')
        })

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(1)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
      })

      test('heavy raiders move toward closest landing bay 2', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space2', 'heavy raider')
          game.aActivateCylonShips('Hvy Raiders')
        })

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(1)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
      })

      test('heavy raiders move toward closest landing bay 3', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space3', 'heavy raider')
          game.aActivateCylonShips('Hvy Raiders')
        })

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(1)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
      })

      test('heavy raiders drop centurions 4', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space4', 'heavy raider')
          game.aActivateCylonShips('Hvy Raiders')
        })

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
        expect(game.getZoneCenturionsByIndex(0).cards.length).toBe(1)
      })

      test('heavy raiders drop centurions 5', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space5', 'heavy raider')
          game.aActivateCylonShips('Hvy Raiders')
        })

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
        expect(game.getZoneCenturionsByIndex(0).cards.length).toBe(1)
      })

      test('heavy raiders are launched if no heavy raiders', () => {
        const game = _spaceFixture()
        game.rk.sessionStart(() => {
          game.mDeploy('space.space3', 'basestar')
          game.mDeploy('space.space3', 'basestar')
          game.aActivateCylonShips('Hvy Raiders')
        })

        const zone = game.getZoneSpaceByIndex(3)
        expect(zone.cards.length).toBe(4)
        expect(zone.cards.filter(c => c.name === 'heavy raider').length).toBe(2)
      })

      test('extra heavy raiders are launched during Cylon Swarm', () => {
        const game = _spaceFixture()
        const swarm = game.getCardByName('Cylon Swarm')
        game.rk.sessionStart(() => {
          game.mMoveCard('decks.crisis', 'keep', swarm)
          game.mDeploy('space.space0', 'basestar')
          game.aActivateCylonShips('Hvy Raiders')
        })

        const zone = game.getZoneSpaceByIndex(0)
        expect(zone.cards.length).toBe(3)
        expect(zone.cards.filter(c => c.name === 'heavy raider').length).toBe(2)
      })

      test('no heavy raiders are launched if the supply is empty', () => {
        const game = _spaceFixture()
        const swarm = game.getCardByName('Cylon Swarm')
        game.rk.sessionStart(() => {
          game.mDeploy('space.space0', 'basestar')
          game.mDeploy('space.space3', 'heavy raider')
          game.mDeploy('space.space3', 'heavy raider')
          game.aActivateCylonShips('Hvy Raiders')
        })

        const zone = game.getZoneSpaceByIndex(0)
        expect(zone.cards.filter(c => c.name === 'heavy raider').length).toBe(0)
      })

      test("basestar with structural damage doesn't launch", () => {
        const game = _spaceFixture()
        const damage = game.getCardByName('disabled hangar')
        game.rk.sessionStart(() => {
          game.mDeploy('space.space2', 'basestar')
          game.mDeploy('space.space3', 'basestar')
          game.mMoveCard('decks.damageBasestar', 'ships.basestarB', damage)
          game.aActivateCylonShips('Hvy Raiders')
        })

        const zone2 = game.getZoneSpaceByIndex(2)
        expect(zone2.cards.filter(c => c.name === 'heavy raider').length).toBe(1)

        const zone3 = game.getZoneSpaceByIndex(3)
        expect(zone3.cards.filter(c => c.name === 'heavy raider').length).toBe(0)
      })

    }) // heavy raiders

    describe('raiders', () => {

      test('primary target: viper', () => {
        const game = _spaceFixture()
        jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 8)
        game.rk.sessionStart(() => {
          game.mDeploy('space.space2', 'raider')
          game.mDeploy('space.space2', 'viper')
          game.mDeploy('space.space2', 'civilian')
          game.aActivateCylonShips('Raiders')
        })

        const spaceZone = game.getZoneSpaceByIndex(2)
        expect(spaceZone.cards.find(c => c.kind === 'ships.vipers')).not.toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'civilian')).toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'ships.raiders')).toBeDefined()
        expect(game.getZoneByName('exile').cards.find(c => c.kind === 'ships.vipers')).toBeDefined()
      })

      test('primary target: viper with pilot', () => {
        const game = _spaceFixture()
        jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 8)
        game.rk.sessionStart(() => {
          game.mMoveCard('players.micah', 'space.space2', 'micah')
          game.mDeploy('space.space2', 'raider')
          game.mDeploy('space.space2', 'viper')
          game.mDeploy('space.space2', 'civilian')
          game.aActivateCylonShips('Raiders')
        })

        const spaceZone = game.getZoneSpaceByIndex(2)
        expect(spaceZone.cards.find(c => c.kind === 'ships.vipers')).not.toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'civilian')).toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'ships.raiders')).toBeDefined()
        expect(game.getZoneByName('exile').cards.find(c => c.kind === 'ships.vipers')).toBeDefined()
        expect(game.getZoneByPlayerLocation('micah').details.name).toBe('Sickbay')
      })

      test('secondary target: civilian', () => {
        const game = _spaceFixture()
        jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 8)
        game.rk.sessionStart(() => {
          game.mDeploy('space.space2', 'raider')
          game.mDeploy('space.space2', 'civilian')
          game.aActivateCylonShips('Raiders')
        })

        const spaceZone = game.getZoneSpaceByIndex(2)
        expect(spaceZone.cards.find(c => c.kind === 'civilian')).not.toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'ships.raiders')).toBeDefined()
        expect(game.getZoneByName('exile').cards.find(c => c.kind === 'civilian')).toBeDefined()
      })

      test('attack galactica', () => {
        const game = _spaceFixture()
        jest.spyOn(game, 'aAttackGalactica')
        game.rk.sessionStart(() => {
          game.mDeploy('space.space2', 'raider')
          game.aActivateCylonShips('Raiders')
        })

        expect(game.aAttackGalactica.mock.calls.length).toBe(1)
      })

      describe('move toward civilan', () => {
        test('clockwise 1', () => {
          const game = _spaceFixture()
          game.rk.sessionStart(() => {
            game.mDeploy('space.space1', 'raider')
            game.mDeploy('space.space2', 'civilian')
            game.aActivateCylonShips('Raiders')
          })
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(2)
        })

        test('clockwise 2', () => {
          const game = _spaceFixture()
          game.rk.sessionStart(() => {
            game.mDeploy('space.space1', 'raider')
            game.mDeploy('space.space3', 'civilian')
            game.mDeploy('space.space4', 'civilian')
            game.aActivateCylonShips('Raiders')
          })
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(1)
          expect(game.getZoneSpaceByIndex(3).cards.length).toBe(1)
        })

        test('counter-clockwise 1', () => {
          const game = _spaceFixture()
          game.rk.sessionStart(() => {
            game.mDeploy('space.space1', 'raider')
            game.mDeploy('space.space0', 'civilian')
            game.aActivateCylonShips('Raiders')
          })
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(0).cards.length).toBe(2)
        })

        test('tied adjacent', () => {
          const game = _spaceFixture()
          game.rk.sessionStart(() => {
            game.mDeploy('space.space1', 'raider')
            game.mDeploy('space.space0', 'civilian')
            game.mDeploy('space.space2', 'civilian')
            game.aActivateCylonShips('Raiders')
          })
          expect(game.getZoneSpaceByIndex(0).cards.length).toBe(1)
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(2)
        })

        test('tied across', () => {
          const game = _spaceFixture()
          game.rk.sessionStart(() => {
            game.mDeploy('space.space1', 'raider')
            game.mDeploy('space.space4', 'civilian')
            game.aActivateCylonShips('Raiders')
          })
          expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(1)
          expect(game.getZoneSpaceByIndex(4).cards.length).toBe(1)
        })

      })

    }) // raiders

  })

  describe.skip('aDeployShips', () => {

  })

  describe.skip('aDestroyColonialOne', () => {

    test("Check works correctly", () => {

    })

    test("Players on Colonial One moved to sickbay", () => {

    })

    test("Can't move there anymore", () => {

    })

  })

  describe.skip('keep cards are cleared appropriately', () => {

  })
})
