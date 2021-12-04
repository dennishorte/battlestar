Error.stackTraceLimit = 100

const GameFixtureFactory = require('./test/fixture.js')
const bsgutil = require('./util.js')
const util = require('../lib/util.js')

function _deepLog(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

function _postRevealFixture(dennisWillAddManually, setupFunc) {
  const factory = new GameFixtureFactory()
  factory.options.crisis = 'The Olympic Carrier'
  factory.options.players[0].character = 'Tom Zarek'
  factory.options.players[0].hand = [
    { kind: 'skill', skill: 'leadership', name: 'Declare Emergency', value: 4 },
    { kind: 'skill', skill: 'leadership', name: 'Declare Emergency', value: 3 },
    { kind: 'skill', skill: 'politics', name: 'Investigative Committee', value: 5 },
    { kind: 'skill', skill: 'politics', name: 'Consolidate Power', value: 2 },
    { kind: 'skill', skill: 'tactics', name: 'Launch Scount', value: 1 },
  ]
  factory.options.players[1].hand = [
    { kind: 'skill', skill: 'leadership', name: 'Declare Emergency', value: 3 },
  ]
  factory.options.players[2].character = 'William Adama'
  factory.options.players[2].startingSkills = ['leadership', 'leadership', 'tactics']
  factory.options.players[2].hand = []

  // Neutral outcome from destiny deck (net zero)
  factory.options.destiny = [
    { kind: 'skill', skill: 'leadership', name: 'Executive Order', value: 1 },
    { kind: 'skill', skill: 'engineering', name: 'Repair', value: 1 },
  ]

  if (setupFunc) {
    setupFunc(factory.game)
  }

  const game = factory.build().advanceTo('skill-check-add-cards').game
  game.run()

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

  if (!dennisWillAddManually) {
    game.submit({
      actor: 'dennis',
      name: 'Skill Check - Add Cards',
      option: ['Do Nothing']
    })
  }

  return game
}

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

  test('President is given a quorum card', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn').game

    expect(game.getCardsKindByPlayer('quorum', 'dennis').length).toBe(1)
  })

})

describe('distribute loyalty cards', () => {

  test("deals one card to each player", () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn').game

    for (const player of game.getPlayerAll()) {
      const hand = game.getZoneByPlayer(player).cards
      const loyaltyCards = game.getCardsLoyaltyByPlayer(player)

      expect(loyaltyCards.length).toBe(1)

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
        name: 'Optional Skills 1',
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
          name: 'Optional Skills 1',
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
      expect(skillKinds).toStrictEqual(['leadership', 'leadership', 'politics', 'politics', 'tactics'])

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
          name: 'Optional Skills 1',
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
          name: 'Optional Skills 1',
          option: ['engineering'],
        }]
      })

      const action = game.getWaiting('dennis').actions[0]
      expect(action.name).toBe('Movement')
    })

    test('player in sickbay draws one card', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-receive-skills').game
      game.mMovePlayer('dennis', 'locations.sickbay')
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      expect(action.name).toBe('Select Skills')
      expect(action.options).toStrictEqual([
        "politics",
        "leadership",
        "tactics",
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
      factory.game.mMovePlayer('dennis', 'locations.brig')
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

    test("player on Colonial One current location excluded", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      const colonialOneOptions = action.options.find(o => o.name === 'Colonial One').options
      expect(colonialOneOptions.length).toBe(2)

      // Ensure a colonialOne location is actually there
      expect(colonialOneOptions.includes('Press Room')).toBe(true)
    })

    test("player on Colonial One can see Galactica locations", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      const options = action.options.find(o => o.name === 'Galactica').options
      expect(options.length).toBe(8)
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
      game.mMovePlayer('dennis', 'locations.caprica')
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      const options = action.options.find(o => o.name === 'Cylon Locations').options
      expect(options.length).toBe(3)
      expect(options.includes('Caprica')).toBe(false)
      expect(options.includes('Cylon Fleet')).toBe(true)
    })

    test("player with no cards can't change ships", () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game
      const playerCards = game.getZoneByPlayer('dennis').cards.filter(c => c.kind === 'skill')
      game.aDiscardSkillCards('dennis', playerCards)
      game.run()

      const action = game.getWaiting('dennis').actions[0]
      expect(action.options.length).toBe(2)
      expect(action.options[0].name).toBe('Colonial One')
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
      expect(game.getWaiting('dennis')).not.toBeDefined()
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
            name: 'Galactica',
            option: ['Armory'],
          }]
        })

        expect(game.getZoneByPlayerLocation('dennis').name).toBe('locations.armory')
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
        expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Administration')

        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: ['Skip Movement']
        })

        // Post-condition
        expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Administration')
        expect(game.getWaiting('dennis').actions[0].name).toBe('Action')
      })

    })

    describe("player piloting viper", () => {

      function _playerInSpace() {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-movement').game
        game.mMovePlayer('dennis', 'space.space5')
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
        game.mMovePlayer('dennis', 'space.space5')
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

        expect(viperMovement.options).toStrictEqual(['clockwise', 'counter-clockwise'])
      })

      test("submitted space movement move player token and viper", () => {
        const game = _playerInSpace()
        game.submit({
          actor: 'dennis',
          name: 'Movement',
          option: [{
            name: 'Move Viper',
            option: ['clockwise'],
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

    function _prepareActionWithMove(ship, locationName) {
      const factory = new GameFixtureFactory()
      factory.options.players[0].movement = {
        name: ship,
        option: [locationName]
      }
      return factory.build().advanceTo('player-turn-action').game
    }

    function _takeActionWithMove(kind, locationInfo, beforeAction) {
      const factory = new GameFixtureFactory()
      if (kind === 'Location Action') {
        factory.options.players[0].movement = locationInfo
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
          option: [locationInfo.option[0]],
        }]
      })
      return game
    }

    function _takeAction(kind, option, beforeAction) {
      const factory = new GameFixtureFactory()
      if (kind === 'Play Skill Card') {
        factory.options.players[0].hand = [option]
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
          option: [option.name || option],
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

      expect(game.getWaiting('dennis')).not.toBeDefined()
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

        function _consolidatePowerFixture(setupFunc) {
          return _takeAction(
            'Play Skill Card',
            {
              kind: 'skill',
              skill: 'politics',
              name: 'Consolidate Power',
              value: 1
            },
            setupFunc
          )
        }

        test('player can draw two skill cards', () => {
          const game = _consolidatePowerFixture()
          expect(game.getWaiting('dennis')).toBeDefined()

          const action = game.getWaiting('dennis').actions[0]
          expect(action.name).toBe('Consolidate Power')
          expect(action.count).toBe(2)
          expect(action.options.length).toBe(10)
        })

      })

      describe('Executive Order', () => {

        function _executiveOrderFixture(setupFunc) {
          return _takeAction(
            'Play Skill Card',
            {
              kind: 'skill',
              skill: 'leadership',
              name: 'Executive Order',
              value: 1
            },
            setupFunc
          )
        }

        test('current player chooses another player', () => {
          const game = _executiveOrderFixture()
          expect(game.getWaiting('dennis')).toBeDefined()
          expect(game.getWaiting('dennis').actions[0].name).toBe('Choose a Player')
        })

        test('first choice is movement or action', () => {
          const game = _executiveOrderFixture()
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })

          expect(game.getWaiting('tom')).toBeDefined()
          expect(game.getWaiting('tom').actions[0].name).toBe('First Choice')
        })

        test('second choice is only actions', () => {
          const game = _executiveOrderFixture()
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })
          game.submit({
            actor: 'tom',
            name: 'First Choice',
            option: ['Movement'],
          })
          game.submit({
            actor: 'tom',
            name: 'Movement',
            option: ['Skip Movement']
          })
          expect(game.getWaiting('tom')).toBeDefined()
          expect(game.getWaiting('tom').actions[0].name).toBe('Action')
        })
      })

      describe('Launch Scout', () => {

        test('can only be used if Galactica has raptors remaining', () => {
          const factory = new GameFixtureFactory()
          factory.options.players[0].hand = [
            {
              kind: 'skill',
              skill: 'tactics',
              name: 'Launch Scout',
              value: 1
            },
            {
              kind: 'skill',
              skill: 'leadership',
              name: 'Executive Order',
              value: 1
            },
          ]
          const game = factory.build().advanceTo('player-turn-action').game
          game.mAdjustCounterByName('raptors', -4)
          game.run()

          expect(game.getWaiting('dennis')).toBeDefined()

          const skillOption = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === "Play Skill Card")
          expect(skillOption).toBeDefined()
          expect(skillOption.options).toStrictEqual(['Executive Order'])
        })

        test('player can choose between crisis and destination deck', () => {
          const cardOption = {
            kind: 'skill',
            skill: 'tactics',
            name: 'Launch Scout',
            value: 1
          }
          const game = _takeAction('Play Skill Card', cardOption, () => {
            jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 3)
          })
          expect(game.getWaiting('dennis')).toBeDefined()
          expect(game.getWaiting('dennis').actions[0].name).toBe('Select Deck')
        })

        test('player can choose between top and bottom', () => {
          const cardOption = {
            kind: 'skill',
            skill: 'tactics',
            name: 'Launch Scout',
            value: 1
          }
          const game = _takeAction('Play Skill Card', cardOption, () => {
            jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 3)
          })
          game.submit({
            actor: 'dennis',
            name: 'Select Deck',
            option: ['destination']
          })
          expect(game.getWaiting('dennis')).toBeDefined()
          expect(game.getWaiting('dennis').actions[0].name).toBe('Top or Bottom')
        })

        test('failed roll causes raptor to be destroyed', () => {
          const cardOption = {
            kind: 'skill',
            skill: 'tactics',
            name: 'Launch Scout',
            value: 1
          }
          const game = _takeAction('Play Skill Card', cardOption, () => {
            jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 2)
          })
          expect(game.getCounterByName('raptors')).toBe(3)
        })
      })

      describe('Maximum Firepower', () => {
        function _maximumFirepowerFixture(setupFunc) {
          const cardOption = {
            kind: 'skill',
            skill: 'piloting',
            name: 'Maximum Firepower',
            value: 3
          }
          return _takeAction('Play Skill Card', cardOption, setupFunc)
        }

        // This will automatically cover having the player be in a viper
        test('can only be played if there is a valid target to attack', () => {
          const factory = new GameFixtureFactory()
          factory.options.players[0].hand = [
            {
              kind: 'skill',
              skill: 'tactics',
              name: 'Launch Scout',
              value: 1
            },
            {
              kind: 'skill',
              skill: 'piloting',
              name: 'Maximum Firepower',
              value: 3
            },
          ]
          const game = factory.build().advanceTo('player-turn-action').game
          game.mMovePlayer('dennis', 'space.space5')
          game.run()

          expect(game.getWaiting('dennis')).toBeDefined()

          const skillOption = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === "Play Skill Card")
          expect(skillOption).toBeDefined()
          expect(skillOption.options).toStrictEqual(['Launch Scout'])
        })

        test('automatically attacks if only one kind of target', () => {
          const game = _maximumFirepowerFixture((game) => {
            game.mMovePlayer('dennis', 'space.space5')
            game.aDeployShips([
              [], [], [],
              [], [], ['raider', 'raider', 'raider', 'raider', 'raider',]
            ])
            jest.spyOn(game, 'aAttackCylonWithViperByKind')
          })
          expect(game.aAttackCylonWithViperByKind.mock.calls.length).toBe(4)
        })

        test('asks which to attack if multiple possible targets', () => {
          const game = _maximumFirepowerFixture((game) => {
            game.mMovePlayer('dennis', 'space.space5')
            game.aDeployShips([
              [], [], [],
              [], [], ['raider', 'heavy raider']
            ])
            jest.spyOn(game, 'aAttackCylonWithViperByKind')
          })
          expect(game.aAttackCylonWithViperByKind.mock.calls.length).toBe(0)
          expect(game.getWaiting('dennis')).toBeDefined()

          const choices = game.getWaiting('dennis').actions[0].options
          expect(choices.sort()).toStrictEqual(['heavy raider', 'raider'])
        })
      })

      describe('Repair', () => {

        describe('repair vipers', () => {
          function _repairFixture(options) {
            options = Object.assign({
              damageVipersCount: 2,
              damageHangarBay: false,
              moveLocation: 'Hangar Deck',
            }, options)

            const factory = new GameFixtureFactory()
            factory.options.players[0].movement = {
              name: 'Galactica',
              option: [options.moveLocation]
            }
            factory.options.players[0].hand = [
              { // This card will be discarded to move
                kind: 'skill',
                skill: 'leadership',
                name: 'Executive Order',
                value: 1
              },
              {
                kind: 'skill',
                skill: 'engineering',
                name: 'Repair',
                value: 1
              },
              { // This card will make sure there is a "Play Skill Card" option
                kind: 'skill',
                skill: 'leadership',
                name: 'Executive Order',
                value: 1
              },
            ]
            const game = factory.build().advanceTo('player-turn-action').game
            if (options.damageVipersCount) {
              for (let i = 0; i < options.damageVipersCount; i++) {
                game.aDamageViperInReserve()
              }
            }
            if (options.damageHangarDeck) {
              const damage = game.getCardByName('Damage Hangar Deck')
              game.mMoveCard('decks.damageGalactica', 'locations.hangarDeck', damage)
            }
            game.run()
            return game
          }

          test('can only be done at the hangar deck', () => {
            const game = _repairFixture({ moveLocation: 'Armory' })
            expect(game.getWaiting('dennis')).toBeDefined()
            const skillCardOptions = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .find(o => o.name === 'Play Skill Card')
              .options
            expect(skillCardOptions.find(o => o === 'Repair')).not.toBeDefined()
          })

          test('can only be done if vipers are damaged', () => {
            const game = _repairFixture({ damageVipersCount: 0 })
            expect(game.getWaiting('dennis')).toBeDefined()
            const skillCardOptions = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .find(o => o.name === 'Play Skill Card')
              .options
            expect(skillCardOptions.find(o => o === 'Repair')).not.toBeDefined()
          })

          test('can only be done if hangar deck is not damaged', () => {
            const game = _repairFixture({ damageHangarDeck: true })
            game.submit({
              actor: 'dennis',
              name: 'Action',
              option: [{
                name: 'Play Skill Card',
                option: ['Repair']
              }]
            })
            expect(game.getDamagedVipersCount()).toBe(2)
            expect(game.checkLocationIsDamaged('Hangar Deck')).toBe(false)
          })

          test('repairs up to two vipers', () => {
            const game = _repairFixture({ damageVipersCount: 3 })
            game.submit({
              actor: 'dennis',
              name: 'Action',
              option: [{
                name: 'Play Skill Card',
                option: ['Repair']
              }]
            })
            expect(game.getDamagedVipersCount()).toBe(1)
          })
        })

        describe('repair locations', () => {
          function _repairFixture(damageLocation) {
            const factory = new GameFixtureFactory()
            factory.options.players[0].movement = {
              name: 'Galactica',
              option: ['Armory']
            }
            factory.options.players[0].hand = [
              { // This card will be discarded to move
                kind: 'skill',
                skill: 'leadership',
                name: 'Executive Order',
                value: 1
              },
              {
                kind: 'skill',
                skill: 'engineering',
                name: 'Repair',
                value: 1
              },
              { // This card will make sure there is a "Play Skill Card" option
                kind: 'skill',
                skill: 'leadership',
                name: 'Executive Order',
                value: 1
              },
            ]
            const game = factory.build().advanceTo('player-turn-action').game
            if (damageLocation) {
              const armoryDamage = game.getCardByName('Damage Armory')
              game.mMoveCard('decks.damageGalactica', 'locations.armory', armoryDamage)
            }
            game.run()
            return game
          }

          test('cannot use at undamaged locations', () => {
            const game = _repairFixture(false)
            expect(game.getWaiting('dennis')).toBeDefined()

            const skillOption = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .find(o => o.name === "Play Skill Card")
            expect(skillOption).toBeDefined()
            expect(skillOption.options).toStrictEqual(['Executive Order'])
          })

          test('can use at damaged locations', () => {
            const game = _repairFixture(true)
            expect(game.getWaiting('dennis')).toBeDefined()

            const skillOption = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .find(o => o.name === "Play Skill Card")
            expect(skillOption).toBeDefined()
            expect(skillOption.options).toStrictEqual(['Executive Order', 'Repair'])
          })

          test('repairs current location', () => {
            const game = _repairFixture(true)
            game.submit({
              actor: 'dennis',
              name: 'Action',
              option: [{
                name: 'Play Skill Card',
                option: ['Repair']
              }]
            })
            expect(game.checkLocationIsDamaged('locations.armory')).toBe(false)
          })
        })

      })
    })

    describe('location actions', () => {
      describe("Admiral's Quarters", () => {

        function _admiralsQuartersFixture(beforeFunc) {
          return _takeActionWithMove(
            'Location Action',
            {
              name: 'Galactica',
              option: ["Admiral's Quarters"]
            },
            beforeFunc
          )
        }

        test('choose a player', () => {
          const game = _admiralsQuartersFixture()
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah', 'tom'])
        })

        test("can't choose Cylons", () => {
          const game = _admiralsQuartersFixture((game) => {
            game.mSetPlayerIsRevealedCylon('tom')
          })
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah'])
        })

        test("can't choose players already in brig", () => {
          const game = _admiralsQuartersFixture((game) => {
            game.mMovePlayer('tom', 'locations.brig')
          })
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah'])
        })

        test('skill check launched', () => {
          const game = _admiralsQuartersFixture()
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })

          const waiting = game.getWaiting()[0]
          const action = waiting.actions[0]
          expect(action.name).toBe('Skill Check - Discuss')
        })

        test('Accept Prophecy raises the difficulty against President', () => {
          const game = _admiralsQuartersFixture()
          jest.spyOn(game, 'checkEffect').mockImplementation(name => {
            return name === 'Accept Prophecy'
          })
          jest.spyOn(game, 'checkPlayerIsPresident').mockImplementation(player => {
            return player === 'tom' || player.name === 'tom'
          })
          jest.spyOn(game, 'mDiscard')
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })

          expect(game.getSkillCheck().passValue).toBe(9)

          // Ensure Accept Prophecy isn't kept after being used
          expect(game.mDiscard.mock.calls.length).toBe(1)
          expect(game.mDiscard.mock.calls[0][0].name).toBe('Accept Prophecy')
        })

        describe('Assign Arbitrator effect', () => {
          function _arbitrationFixture() {
            const game = _admiralsQuartersFixture()
            jest.spyOn(game, 'checkPlayerIsArbitrator').mockImplementation(player => {
              return player === 'tom' || player.name === 'tom'
            })
            game.submit({
              actor: 'dennis',
              name: 'Choose a Player',
              option: ['tom']
            })
            return game
          }

          test('arbitrator can adjust the difficulty', () => {
            const game = _arbitrationFixture()

            expect(game.getWaiting('tom')).toBeDefined()
            const action = game.getWaiting('tom').actions[0]
            expect(action.name).toBe('Adjust Difficulty')

            const arbitrate = action.options.find(o => o.name === 'Arbitrate')
            expect(arbitrate).toBeDefined()
            expect(arbitrate.options.map(o => o.name || o).sort()).toStrictEqual([
              'against accused',
              'in favor of accused',
            ])
          })

          test('arbitrator effect is lost after use', () => {
            const game = _arbitrationFixture()
            jest.spyOn(game, 'mSetPlayerFlag')
            game.submit({
              actor: 'tom',
              name: 'Adjust Difficulty',
              option: [{
                name: 'Arbitrate',
                option: ['against accused']
              }]
            })

            expect(game.mSetPlayerFlag.mock.calls.length).toBe(1)
            expect(game.mSetPlayerFlag.mock.calls[0][0].name).toBe('tom')
            expect(game.mSetPlayerFlag.mock.calls[0][1]).toBe('isArbitrator')
            expect(game.mSetPlayerFlag.mock.calls[0][2]).toBe(false)
          })

          test('arbitrator card is moved from exile to discard after use', () => {
            const game = _arbitrationFixture()
            game.submit({
              actor: 'tom',
              name: 'Adjust Difficulty',
              option: [{
                name: 'Arbitrate',
                option: ['against accused']
              }]
            })

            const { zoneName } = game.getCardByPredicate(c => c.name === 'Assign Arbitrator')
            expect(zoneName).toBe('discard.quorum')
          })

          test('in favor raises difficulty 3', () => {
            const game = _arbitrationFixture()
            game.submit({
              actor: 'tom',
              name: 'Adjust Difficulty',
              option: [{
                name: 'Arbitrate',
                option: ['in favor of accused']
              }]
            })

            expect(game.getSkillCheck().passValue).toBe(10)
          })

          test('against lowers difficulty 3', () => {
            const game = _arbitrationFixture()
            game.submit({
              actor: 'tom',
              name: 'Adjust Difficulty',
              option: [{
                name: 'Arbitrate',
                option: ['against accused']
              }]
            })

            expect(game.getSkillCheck().passValue).toBe(4)
          })
        })

        test.skip('skill check passed moves chosen player to brig', () => {
        })

        test.skip('skill check failed means nothing happens', () => {
        })

        test.skip("Saul Tigh can use his Cylon Hatred ability", () => {
        })

        test("Kara Thrace causes the passValue to drop", () => {
          const game = _admiralsQuartersFixture()
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['micah']
          })
          expect(game.getSkillCheck().passValue).toBe(4)
        })

        test('William Adama cannot use this action', () => {
          const factory = new GameFixtureFactory()
          factory.options.players[0].character = 'William Adama'
          const game = factory.build().advanceTo('player-turn-action').game
          game.run()
          expect(game.getWaiting('dennis')).toBeDefined()

          const locationActions = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === 'Location Action')
          expect(locationActions).not.toBeDefined()
        })
      })

      describe("Armory", () => {
        test.skip('not available if no centurions', () => {
        })

        test.skip('attacks a centurion', () => {
          // ensure aAttackCenturion is called
        })
      })

      describe("Command", () => {

        function _commandFixture(setupFunc) {
          return _takeActionWithMove(
            'Location Action',
            {
              name: 'Galactica',
              option: ['Command'],
            },
            setupFunc
          )
        }

        describe('launch viper', () => {
          test('no launch viper if no vipers available', () => {
            const game = _commandFixture(game => {
              const vipers = game.getZoneByName('ships.vipers').cards
              while (vipers.length > 0) {
                game.mMoveCard('ships.vipers', 'ships.damagedVipers')
              }
            })

            expect(game.getWaiting('dennis')).toBeDefined()
            expect(game.getWaiting('dennis').actions[0].name).toBe('command action')

            const optionNames = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .map(o => o.name)
              .sort()
            expect(optionNames).toStrictEqual(['select a viper to activate'])
          })

          test('can choose to launch a viper', () => {
            const game = _commandFixture()
            const optionNames = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .map(o => o.name)
              .sort()
            expect(optionNames).toStrictEqual(['launch a viper', 'select a viper to activate'])
          })
        })

        describe('activate viper', () => {
          test('can choose a viper from any zone', () => {
            const game = _commandFixture()
            const activate = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .find(o => o.name === 'select a viper to activate')
              .options
            expect(activate).toStrictEqual(['space.space4', 'space.space5'])
          })

          test('can move chosen viper', () => {
            const game = _commandFixture()
            game.submit({
              actor: 'dennis',
              name: 'command action',
              option: [{
                name: 'select a viper to activate',
                option: ['space.space4'],
              }]
            })
            game.submit({
              actor: 'dennis',
              name: 'Activate Viper',
              option: [{
                name: 'Move Viper',
                option: ['clockwise']
              }]
            })
            const vipers = game.getZoneSpaceByIndex(5).cards.filter(c => c.name === 'viper')
            expect(vipers.length).toBe(2)
          })

          test('can attack with chosen viper', () => {
            const game = _commandFixture(game => {
              game.aDeployShips([
                [], [], [],
                [], [], ['raider']
              ])
              jest.spyOn(game, 'aAttackCylonWithViperByKind')
            })
            game.submit({
              actor: 'dennis',
              name: 'command action',
              option: [{
                name: 'select a viper to activate',
                option: ['space.space5'],
              }]
            })
            game.submit({
              actor: 'dennis',
              name: 'Activate Viper',
              option: [{
                name: 'Attack with Viper',
                option: ['raider']
              }]
            })
            expect(game.aAttackCylonWithViperByKind.mock.calls.length).toBe(1)
          })

          test('can choose whom to attack', () => {
            const game = _commandFixture(game => {
              game.aDeployShips([
                [], [], [],
                [], [], ['raider', 'basestar']
              ])
              jest.spyOn(game, 'aAttackCylonWithViperByKind')
            })
            game.submit({
              actor: 'dennis',
              name: 'command action',
              option: [{
                name: 'select a viper to activate',
                option: ['space.space5'],
              }]
            })
            const attackOptions = game
              .getWaiting('dennis')
              .actions[0]
              .options
              .find(o => o.name === 'Attack with Viper')
              .options
              .sort()
            expect(attackOptions).toStrictEqual(['Basestar B', 'raider'])
          })
        })
      })

      describe("Communications", () => {

        function _communicationsFixture(beforeFunc) {
          return _takeActionWithMove(
            'Location Action',
            {
              name: 'Galactica',
              option: ["Communications"]
            },
            beforeFunc
          )
        }

        test('blocked by Jammed Assault crisis effect', () => {
          const factory = new GameFixtureFactory()
          factory.options.players[0].movement = {
            name: 'Galactica',
            option: ["Communications"]
          }
          const game = factory.build().advanceTo('player-turn-action').game
          jest.spyOn(game, 'checkEffect').mockImplementation(name => {
            return name === 'Jammed Assault'
          })
          game.run()

          expect(game.getWaiting('dennis')).toBeDefined()

          const locationActions = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === 'Location Action')
          expect(locationActions).not.toBeDefined()
        })

        test('can choose which civilian to look at', () => {
          const game = _communicationsFixture()
          const action = game.getWaiting('dennis').actions[0]
          expect(action.name).toBe('View Civilian')
          expect(action.options.length).toBe(2)
        })

        test('can choose to move the viewed civilian', () => {
          const game = _communicationsFixture()
          const option0 = game.getWaiting('dennis').actions[0].options[0].name
          game.submit({
            actor: 'dennis',
            name: 'View Civilian',
            option: [option0]
          })
          const action = game.getWaiting('dennis').actions[0]
          expect(action.name).toBe('Move Civilian')
          expect(action.options).toStrictEqual(['clockwise', 'counter-clockwise', 'do nothing'])
        })

        test('can choose and move the same civilian twice', () => {
          const game = _communicationsFixture()
          const option0 = game.getWaiting('dennis').actions[0].options[0].name
          game.submit({
            actor: 'dennis',
            name: 'View Civilian',
            option: [option0]
          })
          game.submit({
            actor: 'dennis',
            name: 'Move Civilian',
            option: ['clockwise']
          })
          const action = game.getWaiting('dennis').actions[0]
          expect(action.name).toBe('View Civilian')
          expect(action.options.find(o => o.name === option0)).toBeDefined()
        })
      })

      describe("FTL Control", () => {

        function _ftlFixture(beforeFunc) {
          return _takeActionWithMove(
            'Location Action',
            {
              name: 'Galactica',
              option: ['FTL Control']
            },
            beforeFunc
          )
        }

        test('is not available if jump prep track is too low', () => {
          const game = _prepareActionWithMove('Galactica', 'FTL Control')
          game.run()
          expect(game.getWaiting('dennis')).toBeDefined()

          const locationActions = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === 'Location Action')
          expect(locationActions).not.toBeDefined()
        })

        test('puts jump-the-fleet on the stack', () => {
          const game = _ftlFixture(game => {
            game.mAdjustCounterByName('jumpTrack', 2)
          })
          expect(game.getTransition().name).toBe('jump-choose-destination')
        })
      })

      describe("Hangar Deck", () => {

        function _hangarDeckFixture(beforeFunc) {
          const factory = new GameFixtureFactory()

          // Make sure player 0 has the piloting skill
          const players = factory.options.players
          const tmp = players[0]
          players[0] = players[2]
          players[2] = tmp

          // Move player 0 to the hangar deck
          factory.options.players[0].movement = {
            name: 'Galactica',
            option: ['Hangar Deck']
          }

          const game = factory.build().advanceTo('player-turn-action').game

          game.run()
          game.submit({
            actor: 'dennis',
            name: 'Action',
            option: [{
              name: 'Location Action',
              option: ['Hangar Deck']
            }]
          })

          return game
        }

        test('cannot use without piloting skill', () => {
          const game = _prepareActionWithMove('Galactica', 'Hangar Deck')
          game.run()
          expect(game.getWaiting('dennis')).toBeDefined()
          const locationActions = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === 'Location Action')
          expect(locationActions).not.toBeDefined()
        })

        test("Can't use if all vipers are destroyed", () => {
          const factory = new GameFixtureFactory()

          // Make sure player 0 has the piloting skill
          const players = factory.options.players
          const tmp = players[0]
          players[0] = players[2]
          players[2] = tmp

          // Move player 0 to the hangar deck
          factory.options.players[0].movement = {
            name: 'Galactica',
            option: ['Hangar Deck']
          }

          const game = factory.build().advanceTo('player-turn-action').game

          // Destroy all the vipers
          const allVipers = game.getCardsByPredicate(c => c.name === 'viper')
          for (const viper of allVipers) {
            game.mExile(viper.card)
          }

          game.run()

          expect(game.getWaiting('dennis')).toBeDefined()
          const locationActions = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === 'Location Action')
          expect(locationActions).not.toBeDefined()
        })

        test('launch-self-in-viper transition is kicked off', () => {
          const game = _hangarDeckFixture()
          expect(game.getWaiting('dennis')).toBeDefined()
          expect(game.getTransition().name).toBe('launch-self-in-viper')
        })

        test('can then take another action', () => {
          const game = _hangarDeckFixture()
          game.submit({
            actor: 'dennis',
            name: 'Launch Self in Viper',
            option: ['Lower Right']
          })
          expect(game.getWaiting('dennis')).toBeDefined()
          expect(game.getTransition().name).toBe('player-turn-action')
        })
      })

      describe("Research Lab", () => {

        test('leads to draw cards', () => {
          const game = _takeActionWithMove('Location Action', {
            name: 'Galactica',
            option: ['Research Lab']
          })
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Research Lab')
        })

      })

      describe("Weapons Control", () => {
        test('not available if there are no enemy ships in space', () => {
          const game = _prepareActionWithMove('Galactica', 'Weapons Control')
          game.aClearSpace()
          game.run()

          expect(game.getWaiting('dennis')).toBeDefined()
          const locationActions = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === 'Location Action')
          expect(locationActions).not.toBeDefined()
        })

        test('can choose target', () => {
          const game = _takeActionWithMove('Location Action', {
            name: 'Galactica',
            option: ['Weapons Control']
          })
          expect(game.getWaiting('dennis')).toBeDefined()
          const action = game.getWaiting('dennis').actions[0]
          expect(action.name).toBe('Weapons Control: Select Target')
          expect(action.options.length).toBe(4)
        })
      })

      describe("Brig", () => {
        function _brigFixture() {
          const factory = new GameFixtureFactory()
          const game = factory.build().advanceTo('player-turn-action').game
          game.mMovePlayer('dennis', game.getZoneByLocationName('Brig'))
          game.run()
          game.submit({
            actor: 'dennis',
            name: 'Action',
            option: [{
              name: 'Location Action',
              option: ['Brig']
            }]
          })
          return game
        }

        test('starts skill check', () => {
          const game = _brigFixture()
          expect(game.getTransition().name).toBe('skill-check-discuss')
          expect(game.getSkillCheck().name).toBe('Release dennis from the brig')
        })

        test('fail causes no change', () => {
          const game = _brigFixture()
          game.aSelectSkillCheckResult('fail')
          game.run()
          expect(game.getTransition().name).toBe('player-turn-receive-skills')
          expect(game.getTransition().data.playerName).toBe('micah')
          expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Brig')
        })

        test('pass allows player to move to any Galactica location', () => {
          const game = _brigFixture()
          game.aSelectSkillCheckResult('pass')
          game.run()
          expect(game.getTransition().name).toBe('leave-brig')
        })
      })

      describe("Administration", () => {

        test('choose a player', () => {
          const game = _takeAction('Location Action', "Administration")
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah', 'tom'])
        })

        test("can't choose Cylons", () => {
          const game = _takeAction('Location Action', "Administration", (game) => {
            game.mSetPlayerIsRevealedCylon('tom')
          })
          const waiting = game.getWaiting('dennis')
          const action = waiting.actions[0]
          expect(action.name).toBe('Choose a Player')
          expect(action.options.sort()).toStrictEqual(['micah'])
        })

        test('skill check launched', () => {
          const game = _takeAction('Location Action', "Administration")
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })
          const waiting = game.getWaiting()[0]
          const action = waiting.actions[0]
          expect(action.name).toBe('Skill Check - Discuss')
        })

        test('pass', () => {
          const game = _takeAction('Location Action', "Administration")
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })
          game.aSelectSkillCheckResult('pass')
          expect(game.getPlayerPresident().name).toBe('tom')
        })

        test('fail', () => {
          const game = _takeAction('Location Action', "Administration")
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })
          game.aSelectSkillCheckResult('fail')
          expect(game.getPlayerPresident().name).toBe('dennis')
        })

        test('Accept Prophecy raises the difficulty', () => {
          const game = _takeAction('Location Action', "Administration")
          jest.spyOn(game, 'checkEffect').mockImplementation(name => {
            return name === 'Accept Prophecy'
          })
          jest.spyOn(game, 'checkPlayerIsPresident').mockImplementation(player => {
            return player === 'tom' || player.name === 'tom'
          })
          jest.spyOn(game, 'mDiscard')
          game.submit({
            actor: 'dennis',
            name: 'Choose a Player',
            option: ['tom']
          })
          expect(game.getSkillCheck().passValue).toBe(9)

          // Card is not kept afterwards
          expect(game.mDiscard.mock.calls.length).toBe(1)
          expect(game.mDiscard.mock.calls[0][0].name).toBe('Accept Prophecy')
        })

      })

      describe("President's Office", () => {
        test('only the president can activate', () => {
          const factory = new GameFixtureFactory()

          // Make sure player 0 is not the president
          const players = factory.options.players
          const tmp = players[0]
          players[0] = players[2]
          players[2] = tmp

          // Move player 0 to the President's Office
          factory.options.players[0].movement = {
            name: 'Colonial One',
            option: ["President's Office"]
          }

          const game = factory.build().advanceTo('player-turn-action').game
          game.run()

          expect(game.getWaiting('dennis')).toBeDefined()
          const locationActions = game
            .getWaiting('dennis')
            .actions[0]
            .options
            .find(o => o.name === 'Location Action')
          expect(locationActions).not.toBeDefined()
        })

        test('President first draws one card', () => {
          const game = _takeActionWithMove('Location Action', {
            name: 'Colonial One',
            option: ["President's Office"]
          })
          // One at start of game when becoming president, one for taking action
          expect(game.getCardsKindByPlayer('quorum', 'dennis').length).toBe(2)
        })

        test('can choose to play a quorum card or draw another quorum card', () => {
          const game = _takeActionWithMove('Location Action', {
            name: 'Colonial One',
            option: ["President's Office"]
          })
          const action = game.getWaiting('dennis').actions[0]
          expect(action.name).toBe('Play or Draw')
        })

        test('draw gets you a quorum card', () => {
          const game = _takeActionWithMove('Location Action', {
            name: 'Colonial One',
            option: ["President's Office"]
          })
          game.submit({
            actor: 'dennis',
            name: 'Play or Draw',
            option: [{ name: 'Draw a Quorum Card' }]
          })
          expect(game.getCardsKindByPlayer('quorum', 'dennis').length).toBe(3)
        })

        test.skip('play actually plays the card', () => {
        })
      })

      describe("Press Room", () => {
        test('player draws two politics cards', () => {
          const game = _takeActionWithMove('Location Action', {
            name: 'Colonial One',
            option: ["Press Room"]
          })
          // Started with 5 as Tom Zarek
          // Drew two more
          expect(game.getCardsKindByPlayer('skill', 'dennis').length).toBe(7)
        })
      })

      describe.skip("Caprica", () => {

      })

      describe.skip("Cylon Fleet", () => {

      })

      describe.skip("Human Fleet", () => {

      })

      describe.skip("Resurrection Ship", () => {

      })
    })

    describe('loyalty actions', () => {
      describe.skip("CAN REDUCE MORALE BY 1", () => {

      })

      describe.skip("CAN SEND A CHARACTER TO SICKBAY", () => {

      })

      describe.skip("CAN SEND A CHARACTER TO THE BRIG", () => {

      })

      describe.skip("CAN DAMAGE GALACTICA", () => {

      })
    })

    describe('activate viper actions', () => {
      function _viperActionFixture(setupFunc) {
        const factory = new GameFixtureFactory()
        const game = factory.build().advanceTo('player-turn-action').game
        game.mMovePlayer('dennis', 'space.space5')
        if (setupFunc) {
          setupFunc(game)
        }
        game.run()
        return game
      }

      describe('move', () => {
        test('viper movement options are available', () => {
          const game = _viperActionFixture()
          expect(game.getWaiting('dennis')).toBeDefined()

          const moveOptions = game.getWaiting('dennis').actions[0].options
          const viperOptions = moveOptions.find(o => o.name === 'Move Viper')
          expect(viperOptions).toBeDefined()
          expect(viperOptions.options.length).toBe(2)
        })

        test('move clockwise moves player', () => {
          const game = _viperActionFixture()
          game.submit({
            actor: 'dennis',
            name: 'Action',
            option: [{
              name: 'Move Viper',
              option: ['clockwise']
            }]
          })

          expect(game.getZoneByPlayerLocation('dennis').name).toBe('space.space0')
        })

        test('move counterclockwise moves player', () => {
          const game = _viperActionFixture()
          game.submit({
            actor: 'dennis',
            name: 'Action',
            option: [{
              name: 'Move Viper',
              option: ['counter-clockwise']
            }]
          })

          expect(game.getZoneByPlayerLocation('dennis').name).toBe('space.space4')
        })
      })

      describe('attack', () => {
        test('viper attack options are available', () => {
          const game = _viperActionFixture((game) => {
            game.aDeployShips([
              [], [], [],
              [], [], ['raider', 'heavy raider', 'basestar']
            ])
          })
          expect(game.getWaiting('dennis')).toBeDefined()

          const attackOptions = game.getWaiting('dennis').actions[0].options
          const viperOptions = attackOptions.find(o => o.name === 'Attack with Viper')
          expect(viperOptions).toBeDefined()
          expect(viperOptions.options.length).toBe(3)
        })

        test('attack raider', () => {
          // just make sure the appropriate function is called
          const game = _viperActionFixture((game) => {
            game.aDeployShips([
              [], [], [],
              [], [], ['raider', 'heavy raider', 'basestar']
            ])
            jest.spyOn(game, 'aAttackCylonWithViperByKind')
          })

          game.submit({
            actor: 'dennis',
            name: 'Action',
            option: [{
              name: 'Attack with Viper',
              option: ['raider']
            }]
          })

          expect(game.aAttackCylonWithViperByKind.mock.calls.length).toBe(1)
          expect(game.aAttackCylonWithViperByKind.mock.calls[0][0].name).toBe('dennis')
          expect(game.aAttackCylonWithViperByKind.mock.calls[0][2]).toBe('raider')
        })

        test('attack heavy raider', () => {
          // just make sure the appropriate function is called
          const game = _viperActionFixture((game) => {
            game.aDeployShips([
              [], [], [],
              [], [], ['raider', 'heavy raider', 'basestar']
            ])
            jest.spyOn(game, 'aAttackCylonWithViperByKind')
          })

          game.submit({
            actor: 'dennis',
            name: 'Action',
            option: [{
              name: 'Attack with Viper',
              option: ['heavy raider']
            }]
          })

          expect(game.aAttackCylonWithViperByKind.mock.calls.length).toBe(1)
          expect(game.aAttackCylonWithViperByKind.mock.calls[0][0].name).toBe('dennis')
          expect(game.aAttackCylonWithViperByKind.mock.calls[0][2]).toBe('heavy raider')
        })

        test('attack basestar', () => {
          // just make sure the appropriate function is called
          const game = _viperActionFixture((game) => {
            game.aDeployShips([
              [], [], [],
              [], [], ['raider', 'heavy raider', 'basestar']
            ])
            jest.spyOn(game, 'aAttackCylonWithViperByKind')
          })

          game.submit({
            actor: 'dennis',
            name: 'Action',
            option: [{
              name: 'Attack with Viper',
              option: ['Basestar B']
            }]
          })

          expect(game.aAttackCylonWithViperByKind.mock.calls.length).toBe(1)
          expect(game.aAttackCylonWithViperByKind.mock.calls[0][0].name).toBe('dennis')
          expect(game.aAttackCylonWithViperByKind.mock.calls[0][2]).toBe('Basestar B')
        })
      })
    })

  })
})

describe('adhoc transitions', () => {

  describe.skip('draw-skill-cards', () => {

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
      while (game.getVipersNumAvailable() > 0) {
        game.mLaunchViper('Lower Left')
      }

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

  describe("Gaius Baltar's delusional intuition", () => {
    test.skip('can draw a card before starting the crisis', () => {

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
    if (options.useScientificResearch) {
      game.rk.put(game.getSkillCheck(), 'scientificResearch', true)
    }
    if (options.useInvestigativeCommitee) {
      game.rk.put(game.getSkillCheck(), 'investigativeCommittee', true)
    }

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
      expect(game.getSkillCheck().flags['tom'].support).toBe('')
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

      expect(game.getTransition().name).toBe('player-turn-receive-skills')
      expect(game.getWaiting('dennis')).not.toBeDefined()
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
      game.mMovePlayer('tom', 'locations.brig')
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

    describe('declare emergency is appropriately applied', () => {

      test('declare emergency cannot help', () => {
        const game = _postRevealFixture(false)
        expect(game.getTransition().name).toBe('skill-check-command-authority')
      })

      test('declare emergency can give pass', () => {
        const game = _postRevealFixture(true)
        game.submit({
          actor: 'dennis',
          name: 'Skill Check - Add Cards',
          option: [{
            name: 'Add Cards to Check',
            option: [{
              name: 'Help',
              option: ['Investigative Committee,5', 'Declare Emergency,4']
            }]
          }]
        })
        expect(game.getTransition().name).toBe('skill-check-declare-emergency')
        expect(game.getWaiting('dennis').actions[0].options).toStrictEqual([
          'Use Declare Emergency', 'Do Nothing'
        ])
        expect(game.getWaiting('micah').actions[0].options).toStrictEqual([
          'Use Declare Emergency', 'Do Nothing'
        ])
        expect(game.getWaiting('tom')).not.toBeDefined()
      })

      test('declare emergency can give partial pass', () => {
        const game = _postRevealFixture(true)
        game.submit({
          actor: 'dennis',
          name: 'Skill Check - Add Cards',
          option: [{
            name: 'Add Cards to Check',
            option: [{
              name: 'Help',
              option: ['Investigative Committee,5', 'Consolidate Power,2']
            }]
          }]
        })
        expect(game.getTransition().name).toBe('skill-check-declare-emergency')
        expect(game.getWaiting('dennis').actions[0].name).toBe('Use Declare Emergency')
        expect(game.getWaiting('dennis').actions[0].options).toStrictEqual([
          'Use Declare Emergency', 'Do Nothing'
        ])
        expect(game.getWaiting('micah').actions[0].options).toStrictEqual([
          'Use Declare Emergency', 'Do Nothing'
        ])
        expect(game.getWaiting('tom')).not.toBeDefined()
      })

      test('declare emergency was pre-declared', () => {
        const game = _postRevealFixture(true)
        game.submit({
          actor: 'dennis',
          name: 'Skill Check - Add Cards',
          option: [
            {
              name: 'Add Cards to Check',
              option: [{
                name: 'Help',
                option: ['Investigative Committee,5', 'Declare Emergency,4']
              }],
            },
            { name: 'Use Declare Emergency' },
          ],
        })
        expect(game.getSkillCheck().result).toBe('pass')
      })

      test('first player in add-card order puts their card in', () => {
        const game = _postRevealFixture(true)
        game.submit({
          actor: 'dennis',
          name: 'Skill Check - Add Cards',
          option: [{
            name: 'Add Cards to Check',
            option: [{
              name: 'Help',
              option: ['Investigative Committee,5', 'Declare Emergency,4']
            }]
          }]
        })
        game.submit({
          actor: 'dennis',
          name: 'Use Declare Emergency',
          option: ['Use Declare Emergency']
        })
        game.submit({
          actor: 'micah',
          name: 'Use Declare Emergency',
          option: ['Use Declare Emergency']
        })

        expect(game.getCardsKindByPlayer('skill', 'micah').length).toBe(0)
        expect(game.getCardsKindByPlayer('skill', 'dennis').length).toBe(3)
        expect(game.getSkillCheck().result).toBe('pass')
      })

    })

    test.skip('players can see what cards were added to the skill check', () => {

    })

  })

  describe('skill-check-cleanup', () => {

    test('William Adama can choose to keep all the skill cards', () => {
      const game = _postRevealFixture(false)
      expect(game.getTransition().name).toBe('skill-check-command-authority')
      expect(game.getWaiting('tom')).toBeDefined()
      expect(game.getWaiting('tom').actions[0].name).toBe('Use Command Authority')
    })

    test('Command Authority actually moves all cards to player hand', () => {
      const game = _postRevealFixture(false)
      game.submit({
        actor: 'tom',
        name: 'Use Command Authority',
        option: ['Yes']
      })
      expect(game.getCardsKindByPlayer('skill', 'tom').length).toBe(2)
      expect(game.getZoneByName('crisisPool').cards.length).toBe(0)
    })

    test('Command Authority marks once per game ability on player', () => {
      const game = _postRevealFixture(false)
      game.submit({
        actor: 'tom',
        name: 'Use Command Authority',
        option: ['Yes']
      })
      expect(game.checkPlayerHasUsedOncePerGame('tom')).toBe(true)
    })

    test('no more active skill check', () => {
      const game = _postRevealFixture(false)
      game.submit({
        actor: 'tom',
        name: 'Use Command Authority',
        option: ['No']
      })
      expect(game.getSkillCheck()).not.toBeDefined()
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

    game.mMoveByIndices(crisisDeck, crisisCardIndex, crisisDeck, 0)

    if (func) {
      func(game)
    }

    game.run()

    return game
  }

  describe('cylon player', () => {
    test('cylon players do not have a crisis phase', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-action').game
      jest.spyOn(game, 'checkPlayerIsRevealedCylon').mockImplementation(player => {
        return player === 'dennis' || player.name === 'dennis'
      })
      game.run()

      game.submit({
        actor: 'dennis',
        name: 'Action',
        option: ['Skip Action']
      })

      expect(game.getTransition().name).toBe('player-turn-receive-skills')
      expect(game.getWaiting('dennis')).not.toBeDefined()
    })
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

    test('cylon activation and jump prep take place after choice', () => {
      const game = _crisisFixture('Food Shortage', (game) => {
        game.aClearSpace()
        jest.spyOn(game, 'aActivateCylonShips')
        jest.spyOn(game, 'aPrepareForJump')
      })

      game.submit({
        actor: 'dennis',
        name: 'Choose',
        option: ['Option 1'],
      })

      expect(game.aActivateCylonShips.mock.calls.length).toBe(1)
      expect(game.aPrepareForJump.mock.calls.length).toBe(1)
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

    test('cylon activation and jump prep take place after skill check', () => {
      const game = _postRevealFixture(false, (game) => {
        jest.spyOn(game, 'aActivateCylonShips')
        jest.spyOn(game, 'aPrepareForJump')
      })

      // Skip past command authority
      game.submit({
        actor: 'tom',
        name: 'Use Command Authority',
        option: ['No']
      })

      expect(game.aActivateCylonShips.mock.calls.length).toBe(1)
      expect(game.aPrepareForJump.mock.calls.length).toBe(1)
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

    test.skip('cylon activation and jump prep take place after skill check', () => {
      const game = _postRevealFixture(false, (game) => {
        jest.spyOn(game, 'aActivateCylonShips')
        jest.spyOn(game, 'aPrepareForJump')
      })

      // Skip past command authority
      game.submit({
        actor: 'tom',
        name: 'Use Command Authority',
        option: ['No']
      })

      expect(game.aActivateCylonShips.mock.calls.length).toBe(1)
      expect(game.aPrepareForJump.mock.calls.length).toBe(1)
    })

    test.skip('cylon activation and jump prep take place after choosing option 2', () => {
      const game = _postRevealFixture(false, (game) => {
        jest.spyOn(game, 'aActivateCylonShips')
        jest.spyOn(game, 'aPrepareForJump')
      })

      // Skip past command authority
      game.submit({
        actor: 'tom',
        name: 'Use Command Authority',
        option: ['No']
      })

      expect(game.aActivateCylonShips.mock.calls.length).toBe(1)
      expect(game.aPrepareForJump.mock.calls.length).toBe(1)
    })
  })
})

describe('player-turn-cleanup', () => {
  test.skip('hand limit is 10', () => {

  })

  test.skip('"Chief" Galen Tyrol hand limit is 8', () => {

  })

  test('check for Cylon victory by food', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-cleanup').game
    game.mAdjustCounterByName('food', -8)
    game.run()
    expect(game.getWinners()).toBe('cylons')
  })

  test('check for Cylon victory by fuel', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-cleanup').game
    game.mAdjustCounterByName('fuel', -8)
    game.run()
    expect(game.getWinners()).toBe('cylons')
  })

  test('check for Cylon victory by morale', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-cleanup').game
    game.mAdjustCounterByName('morale', -10)
    game.run()
    expect(game.getWinners()).toBe('cylons')
  })

  test('check for Cylon victory by population', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-cleanup').game
    game.mAdjustCounterByName('population', -12)
    game.run()
    expect(game.getWinners()).toBe('cylons')
  })

  test('next player begins turn', () => {
    const factory = new GameFixtureFactory()
    const game = factory.build().advanceTo('player-turn-cleanup').game
    game.run()
    expect(game.getWaiting('micah')).toBeDefined()
    expect(game.getWaiting('micah').actions[0].name).toBe('Select Skills')
  })
})

describe('jump-the-fleet', () => {
  function _jumpFixture(jumpTrack, func) {
    const factory = new GameFixtureFactory()
    factory.options.players[0].movement = {
      name: 'Galactica',
      option: ['FTL Control']
    }
    const game = factory.build().advanceTo('player-turn-action').game
    if (func) {
      func(game)
    }
    game.mAdjustCounterByName('jumpTrack', jumpTrack)
    game.run()
    game.submit({
      actor: 'dennis',
      name: 'Action',
      option: [{
        name: 'Location Action',
        option: [{ name: 'FTL Control' }]
      }]
    })
    return game
  }

  test('population loss if jump track is too low', () => {
    const game = _jumpFixture(2, (game) => {
      jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 6)
    })
    expect(game.getCounterByName('population')).toBe(9)
  })

  test('clears all ships in space', () => {
    const game = _jumpFixture(4, (game) => {
      jest.spyOn(game, 'aClearSpace')
    })
    expect(game.aClearSpace.mock.calls.length).toBe(1)
  })

  test('jump-choose-destination is put on stack', () => {
    const game = _jumpFixture(4)
    expect(game.getTransition().name).toBe('jump-choose-destination')
  })

  test('human victory', () => {
    const game = _jumpFixture(4, (game) => {
      game.mAdjustCounterByName('distance', 8)
    })
    expect(game.checkGameIsFinished()).toBe(true)
    expect(game.getWinners()).toBe('humans')
  })
})

describe.skip('jump-choose-destination', () => {
  test('admiral chooses between two destination cards', () => {

  })

  test('mission specialist overrides admiral choice', () => {

  })
})

describe('crisis card effects', () => {

  function _crisisFixture(crisisName, func) {
    const factory = new GameFixtureFactory()
    factory.options.crisis = crisisName
    const game = factory.build().advanceTo('player-turn-crisis').game

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
            return player === 'micah' || player.name === 'micah'
          })
        })
        game.aSelectSkillCheckResult('fail')

        const action = game.getWaiting('dennis').actions[0]
        expect(action.name).toBe('Choose Player')
        expect(action.options.sort()).toStrictEqual(['dennis', 'tom'])
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
      jest.spyOn(game, 'aDestroyCivilian').mockImplementation(() => {})

      game.submit({
        actor: 'dennis',
        name: 'Skill Check - Discuss',
        option: ['Choose Option 2']
      })

      // Post-conditions
      expect(game.getCounterByName('morale')).toBe(9)
      expect(game.aDestroyCivilian.mock.calls.length).toBe(1)
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

      // It goes up once for passing, and again during the prepare for jump phase
      expect(game.getCounterByName('jumpTrack')).toBe(2)
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
      expect(game.getZoneByPlayerLocation('dennis').details.name).toBe('Administration')

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
        game.mDeploy('space.space3', 'basestar')
        game.mDeploy('space.space3', 'basestar')
        jest.spyOn(game, 'aAttackGalactica')
        game.aActivateCylonShips('Basestar Attacks')

        expect(game.aAttackGalactica.mock.calls.length).toBe(2)
      })

      test('disabled weapons do not attack', () => {
        const game = _spaceFixture()
        const damage = game.getCardByName('disabled weapons')
        game.mDeploy('space.space3', 'basestar')
        game.mDeploy('space.space3', 'basestar')
        game.mMoveCard('decks.damageBasestar', 'ships.basestarB', damage)
        jest.spyOn(game, 'aAttackGalactica')
        game.aActivateCylonShips('Basestar Attacks')

        expect(game.aAttackGalactica.mock.calls.length).toBe(1)
      })

      test('damage is assigned to Galactica', () => {
        const game = _spaceFixture()
        game.mDeploy('space.space3', 'basestar')
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
        game.mDeploy('space.space3', 'basestar')
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
        game.mAddCenturion()
        game.mAddCenturion()

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
        game.mDeploy('space.space0', 'heavy raider')
        game.aActivateCylonShips('Hvy Raiders')

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(1)
      })

      test('heavy raiders move toward closest landing bay 1', () => {
        const game = _spaceFixture()
        game.mDeploy('space.space1', 'heavy raider')
        game.aActivateCylonShips('Hvy Raiders')

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(1)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
      })

      test('heavy raiders move toward closest landing bay 2', () => {
        const game = _spaceFixture()
        game.mDeploy('space.space2', 'heavy raider')
        game.aActivateCylonShips('Hvy Raiders')

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(1)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
      })

      test('heavy raiders move toward closest landing bay 3', () => {
        const game = _spaceFixture()
        game.mDeploy('space.space3', 'heavy raider')
        game.aActivateCylonShips('Hvy Raiders')

        expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(2).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(3).cards.length).toBe(0)
        expect(game.getZoneSpaceByIndex(4).cards.length).toBe(1)
        expect(game.getZoneSpaceByIndex(5).cards.length).toBe(0)
      })

      test('heavy raiders drop centurions 4', () => {
        const game = _spaceFixture()
        game.mDeploy('space.space4', 'heavy raider')
        game.aActivateCylonShips('Hvy Raiders')

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
        game.mDeploy('space.space5', 'heavy raider')
        game.aActivateCylonShips('Hvy Raiders')

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
        game.mDeploy('space.space3', 'basestar')
        game.mDeploy('space.space3', 'basestar')
        game.aActivateCylonShips('Hvy Raiders')

        const zone = game.getZoneSpaceByIndex(3)
        expect(zone.cards.length).toBe(4)
        expect(zone.cards.filter(c => c.name === 'heavy raider').length).toBe(2)
      })

      test('extra heavy raiders are launched during Cylon Swarm', () => {
        const game = _spaceFixture()
        const swarm = game.getCardByName('Cylon Swarm')
        game.mMoveCard('decks.crisis', 'keep', swarm)
        game.mDeploy('space.space0', 'basestar')
        game.aActivateCylonShips('Hvy Raiders')

        const zone = game.getZoneSpaceByIndex(0)
        expect(zone.cards.length).toBe(3)
        expect(zone.cards.filter(c => c.name === 'heavy raider').length).toBe(2)
      })

      test('no heavy raiders are launched if the supply is empty', () => {
        const game = _spaceFixture()
        const swarm = game.getCardByName('Cylon Swarm')
        game.mDeploy('space.space0', 'basestar')
        game.mDeploy('space.space3', 'heavy raider')
        game.mDeploy('space.space3', 'heavy raider')
        game.aActivateCylonShips('Hvy Raiders')

        const zone = game.getZoneSpaceByIndex(0)
        expect(zone.cards.filter(c => c.name === 'heavy raider').length).toBe(0)
      })

      test("basestar with structural damage doesn't launch", () => {
        const game = _spaceFixture()
        const damage = game.getCardByName('disabled hangar')
        game.mDeploy('space.space2', 'basestar')
        game.mDeploy('space.space3', 'basestar')
        game.mMoveCard('decks.damageBasestar', 'ships.basestarB', damage)
        game.aActivateCylonShips('Hvy Raiders')

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
        game.mDeploy('space.space2', 'raider')
        game.mDeploy('space.space2', 'viper')
        game.mDeploy('space.space2', 'civilian')
        game.aActivateCylonShips('Raiders')

        const spaceZone = game.getZoneSpaceByIndex(2)
        expect(spaceZone.cards.find(c => c.kind === 'ships.vipers')).not.toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'civilian')).toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'ships.raiders')).toBeDefined()
        expect(game.getZoneByName('exile').cards.find(c => c.kind === 'ships.vipers')).toBeDefined()
      })

      test('primary target: viper with pilot', () => {
        const game = _spaceFixture()
        jest.spyOn(bsgutil, 'rollDie').mockImplementation(() => 8)
        game.mMoveCard('players.micah', 'space.space2', 'micah')
        game.mDeploy('space.space2', 'raider')
        game.mDeploy('space.space2', 'viper')
        game.mDeploy('space.space2', 'civilian')
        game.aActivateCylonShips('Raiders')

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
        game.mDeploy('space.space2', 'raider')
        game.mDeploy('space.space2', 'civilian')
        game.aActivateCylonShips('Raiders')

        const spaceZone = game.getZoneSpaceByIndex(2)
        expect(spaceZone.cards.find(c => c.kind === 'civilian')).not.toBeDefined()
        expect(spaceZone.cards.find(c => c.kind === 'ships.raiders')).toBeDefined()
        expect(game.getZoneByName('exile').cards.find(c => c.kind === 'civilian')).toBeDefined()
      })

      test('attack galactica', () => {
        const game = _spaceFixture()
        jest.spyOn(game, 'aAttackGalactica')
        game.mDeploy('space.space2', 'raider')
        game.aActivateCylonShips('Raiders')

        expect(game.aAttackGalactica.mock.calls.length).toBe(1)
      })

      describe('move toward civilan', () => {
        test('clockwise 1', () => {
          const game = _spaceFixture()
          game.mDeploy('space.space1', 'raider')
          game.mDeploy('space.space2', 'civilian')
          game.aActivateCylonShips('Raiders')
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(2)
        })

        test('clockwise 2', () => {
          const game = _spaceFixture()
          game.mDeploy('space.space1', 'raider')
          game.mDeploy('space.space3', 'civilian')
          game.mDeploy('space.space4', 'civilian')
          game.aActivateCylonShips('Raiders')
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(1)
          expect(game.getZoneSpaceByIndex(3).cards.length).toBe(1)
        })

        test('counter-clockwise 1', () => {
          const game = _spaceFixture()
          game.mDeploy('space.space1', 'raider')
          game.mDeploy('space.space0', 'civilian')
          game.aActivateCylonShips('Raiders')
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(0).cards.length).toBe(2)
        })

        test('tied adjacent', () => {
          const game = _spaceFixture()
          game.mDeploy('space.space1', 'raider')
          game.mDeploy('space.space0', 'civilian')
          game.mDeploy('space.space2', 'civilian')
          game.aActivateCylonShips('Raiders')
          expect(game.getZoneSpaceByIndex(0).cards.length).toBe(1)
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(2)
        })

        test('tied across', () => {
          const game = _spaceFixture()
          game.mDeploy('space.space1', 'raider')
          game.mDeploy('space.space4', 'civilian')
          game.aActivateCylonShips('Raiders')
          expect(game.getZoneSpaceByIndex(0).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(1).cards.length).toBe(0)
          expect(game.getZoneSpaceByIndex(2).cards.length).toBe(1)
          expect(game.getZoneSpaceByIndex(4).cards.length).toBe(1)
        })

      })

    }) // raiders

})

  describe.skip('aAttackCylonWithViperByKind', () => {
    describe('raider', () => {

    })

    describe('heavy raider', () => {

    })

    describe('basestar', () => {

    })
  })

  describe('aDamageGalactica', () => {

    test('the sixth damage destroys Galactica', () => {
      const factory = new GameFixtureFactory()
      const game = factory.build().advanceTo('player-turn-movement').game

      // Remove the non-damage tokens from the bag
      const damageTokens = game.getZoneByName('decks.damageGalactica').cards
      for (let i = damageTokens.length - 1; i >= 0; i--) {
        const token = damageTokens[i]
        if (token.name.startsWith('-')) {
          game.mDiscard(token)
        }
      }

      game.aDamageGalactica()
      game.aDamageGalactica()
      game.aDamageGalactica()
      game.aDamageGalactica()
      game.aDamageGalactica()

      expect(game.getLocationsDamaged().length).toBe(5)
      expect(game.checkGameIsFinished()).toBe(false)
      expect(game.aDamageGalactica.bind(game)).toThrow(bsgutil.GameOverTrigger)
    })

    test.skip('token is placed on the appropriate location', () => {

    })

    test.skip('damaged locations cannot be used', () => {

    })
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

  describe.skip('aRevealLoyaltyCards', () => {
    test('detector sabotage prevents this action', () => {
    })
  })

  describe.skip('keep cards are cleared appropriately', () => {

  })

  describe('calculateCheckValue', () => {
    function _card(skill, value) {
      return { skill, value }
    }

    function _checkFixture(options) {
      return Object.assign({
        declareEmergency: false,
        inspirationalLeader: false,
        scientificResearch: false,
        skills: ['leadership', 'tactics'],
      }, options)
    }

    test('basic counting', () => {
      expect(bsgutil.calculateCheckValue(
        [
          _card('piloting', 1)
        ],
        _checkFixture()
      )).toBe(-1)

      expect(bsgutil.calculateCheckValue(
        [
          _card('piloting', 5),
          _card('politics', 3),
        ],
        _checkFixture()
      )).toBe(-8)

      expect(bsgutil.calculateCheckValue(
        [
          _card('leadership', 1)
        ],
        _checkFixture()
      )).toBe(1)

      expect(bsgutil.calculateCheckValue(
        [
          _card('tactics', 1),
          _card('piloting', 4),
        ],
        _checkFixture()
      )).toBe(-3)

      expect(bsgutil.calculateCheckValue(
        [
          _card('leadership', 5),
          _card('leadership', 5),
          _card('leadership', 5),
        ],
        _checkFixture()
      )).toBe(15)
    })

    test('declare emergency', () => {
      expect(bsgutil.calculateCheckValue(
        [
          _card('leadership', 5),
          _card('leadership', 2),
        ],
        _checkFixture({ declareEmergency: true })
      )).toBe(9)
    })

    test('scientific research', () => {
      expect(bsgutil.calculateCheckValue(
        [
          _card('leadership', 5),
          _card('engineering', 2),
          _card('piloting', 1),
        ],
        _checkFixture({ scientificResearch: true })
      )).toBe(6)
    })

    test('William Adama, Inspirational Leader', () => {
      expect(bsgutil.calculateCheckValue(
        [
          _card('leadership', 5),
          _card('engineering', 2),
          _card('piloting', 1),
        ],
        _checkFixture({ inspirationalLeader: true })
      )).toBe(4)
    })
  })
})
