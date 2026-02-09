const t = require('../../testutil.js')
const res = require('../index.js')
const baseA = require('./baseA.js')


describe('BaseA Cards', () => {

  describe('card data', () => {
    test('all minor improvements are defined', () => {
      const minors = baseA.getMinorImprovements()
      expect(minors.length).toBe(24)
    })

    test('all occupations are defined', () => {
      const occupations = baseA.getOccupations()
      expect(occupations.length).toBe(24)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('shifting-cultivation')
      expect(card.name).toBe('Shifting Cultivation')
      expect(card.type).toBe('minor')
    })

    test('getCardsByPlayerCount filters correctly', () => {
      const twoPlayerCards = res.getCardsByPlayerCount(2)
      const fourPlayerCards = res.getCardsByPlayerCount(4)

      // 4+ player cards should not be in 2 player game
      expect(twoPlayerCards.some(c => c.id === 'conjurer')).toBe(false)
      expect(fourPlayerCards.some(c => c.id === 'conjurer')).toBe(true)
    })
  })

  describe('card prerequisites', () => {
    test('meetsCardPrereqs checks occupation count', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          hand: ['threshing-board'],
          occupations: ['wood-cutter'],
        },
      })
      game.run()

      const dennis = t.player(game)
      // Needs 2 occupations, has 1
      expect(dennis.meetsCardPrereqs('threshing-board')).toBe(false)

      t.setPlayerCards(game, dennis, 'occupations', ['wood-cutter', 'firewood-collector'])
      expect(dennis.meetsCardPrereqs('threshing-board')).toBe(true)
    })

    test('meetsCardPrereqs checks exact occupation count', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          hand: ['pond-hut'],
          occupations: ['wood-cutter', 'firewood-collector'],
        },
      })
      game.run()

      const dennis = t.player(game)
      // Needs exactly 2 occupations
      expect(dennis.meetsCardPrereqs('pond-hut')).toBe(true)

      t.setPlayerCards(game, dennis, 'occupations', ['wood-cutter', 'firewood-collector', 'seasonal-worker'])
      expect(dennis.meetsCardPrereqs('pond-hut')).toBe(false)
    })

    test('meetsCardPrereqs checks at most occupation count', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          hand: ['lumber-mill'],
          occupations: ['wood-cutter', 'firewood-collector', 'seasonal-worker'],
        },
      })
      game.run()

      const dennis = t.player(game)
      // Needs at most 3 occupations
      expect(dennis.meetsCardPrereqs('lumber-mill')).toBe(true)

      t.setPlayerCards(game, dennis, 'occupations', ['wood-cutter', 'firewood-collector', 'seasonal-worker', 'mushroom-collector'])
      expect(dennis.meetsCardPrereqs('lumber-mill')).toBe(false)
    })

    test('meetsCardPrereqs checks sheep count', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          hand: ['wool-blankets'],
          farmyard: {
            pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 4 } }],
          },
        },
      })
      game.run()

      const dennis = t.player(game)
      // Needs 5 sheep, has 4
      expect(dennis.meetsCardPrereqs('wool-blankets')).toBe(false)

      // Add pet sheep
      dennis.pet = 'sheep'
      expect(dennis.meetsCardPrereqs('wool-blankets')).toBe(true)
    })
  })

  describe('card costs', () => {
    test('canAffordCard checks food cost', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          food: 1,
          hand: ['shifting-cultivation'],
        },
      })
      game.run()

      const dennis = t.player(game)
      // Needs 2 food, has 1
      expect(dennis.canAffordCard('shifting-cultivation')).toBe(false)

      dennis.food = 2
      expect(dennis.canAffordCard('shifting-cultivation')).toBe(true)
    })

    test('canAffordCard checks animal cost', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          hand: ['young-animal-market'],
        },
      })
      game.run()

      const dennis = t.player(game)
      // Needs 1 sheep, has 0
      expect(dennis.canAffordCard('young-animal-market')).toBe(false)

      dennis.pet = 'sheep'
      expect(dennis.canAffordCard('young-animal-market')).toBe(true)
    })

    test('payCardCost deducts resources', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          food: 5,
          hand: ['shifting-cultivation'],
        },
      })
      game.run()

      const dennis = t.player(game)
      dennis.payCardCost('shifting-cultivation')
      expect(dennis.food).toBe(3)
    })
  })

  describe('Minor Improvements', () => {

    describe('Shifting Cultivation', () => {
      test('plows a field on play via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'shifting-cultivation',
          {},
          {
            dennis: {
              food: 2, // cost
            },
          },
        )

        // onPlay triggers plowField — choose a space
        t.choose(game, game.waiting.selectors[0].choices[0])

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            food: 1, // 2 + 1 MP - 2 cost
            hand: [], // passed left
            farmyard: { fields: 1 },
            score: -13, // -14 base + 1 field
          },
          micah: {
            hand: ['shifting-cultivation'],
          },
        })
      })
    })

    describe('Clay Embankment', () => {
      test('gives bonus clay on play via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'clay-embankment',
          {},
          {
            dennis: {
              food: 1, // cost
              clay: 5,
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            food: 1, // 1 + 1 MP - 1 cost
            clay: 7, // 5 + floor(5/2) = 7
            hand: [], // passed left
          },
          micah: {
            hand: ['clay-embankment'],
          },
        })
      })

      test('gives nothing with 0-1 clay', () => {
        const game = t.fixtureMinorImprovement(
          'clay-embankment',
          {},
          {
            dennis: {
              food: 1, // cost
              clay: 1,
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            food: 1, // 1 + 1 MP - 1 cost
            clay: 1, // No bonus (floor(1/2) = 0)
            hand: [],
          },
          micah: {
            hand: ['clay-embankment'],
          },
        })
      })
    })

    describe('Young Animal Market', () => {
      test('exchanges sheep for cattle via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'young-animal-market',
          {},
          {
            dennis: {
              farmyard: {
                pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }], animals: { sheep: 2 } }],
              },
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            food: 1, // +1 MP
            hand: [], // passed left
            animals: { sheep: 1, cattle: 1 }, // 2 - 1 cost + 1 onPlay
            score: -7, // -14 base + pasture/animals/fences bonuses
          },
          micah: {
            hand: ['young-animal-market'],
          },
        })
      })
    })

    describe('Drinking Trough', () => {
      test('increases pasture capacity by 2', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            clay: 5,
            hand: ['drinking-trough'],
          },
        })
        game.run()

        const dennis = t.player(game)
        t.playCard(game, 'dennis', 'drinking-trough')

        // Card effect tested through modifyPastureCapacity
        const card = res.getCardById('drinking-trough')
        const increased = card.modifyPastureCapacity(dennis, {}, 4)
        expect(increased).toBe(6)
      })
    })

    describe('Rammed Clay', () => {
      test('gives 1 clay on play via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'rammed-clay',
          {},
          {
            dennis: {},
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            food: 1, // +1 MP (free cost)
            clay: 1, // +1 onPlay
            hand: [],
            minorImprovements: ['rammed-clay'],
          },
        })
      })

      test('enables alternate fence resource via canUseAlternateFenceResource', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['rammed-clay'],
          },
        })
        game.run()

        const dennis = t.player(game)
        expect(dennis.canUseAlternateFenceResource()).toBe('clay')
      })

      test('canUseAlternateFenceResource returns null without Rammed Clay', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        expect(dennis.canUseAlternateFenceResource()).toBeNull()
      })
    })

    describe('Manger', () => {
      test('gives bonus points for large pastures', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['manger'],
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }] },
                { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        t.playCard(game, 'dennis', 'manger')

        // 6 pasture spaces = 1 bonus point
        const card = res.getCardById('manger')
        expect(card.getEndGamePoints(dennis)).toBe(1)

        // Add more pasture spaces to test thresholds
        dennis.farmyard.pastures.push({
          id: 2,
          spaces: [{ row: 0, col: 2 }],
          animalType: null,
          animalCount: 0,
        })
        expect(card.getEndGamePoints(dennis)).toBe(2) // 7 spaces

        dennis.farmyard.pastures.push({
          id: 3,
          spaces: [{ row: 0, col: 3 }],
          animalType: null,
          animalCount: 0,
        })
        expect(card.getEndGamePoints(dennis)).toBe(3) // 8 spaces
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['manger'],
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }] },
                { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }] },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const scoreWith = dennis.calculateScore()

        // Remove the card and recalculate
        t.setPlayerCards(game, dennis, 'minorImprovements', [])
        const scoreWithout = dennis.calculateScore()

        // 7 pasture spaces = 2 bonus points from Manger
        expect(scoreWith - scoreWithout).toBe(2)
      })
    })

    describe('Wool Blankets', () => {
      test('gives 3 points for wooden house', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'wood',
            minorImprovements: ['wool-blankets'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('wool-blankets')
        expect(card.getEndGamePoints(dennis)).toBe(3)
      })

      test('gives 2 points for clay house', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'clay',
            minorImprovements: ['wool-blankets'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('wool-blankets')
        expect(card.getEndGamePoints(dennis)).toBe(2)
      })

      test('gives 0 points for stone house', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'stone',
            minorImprovements: ['wool-blankets'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('wool-blankets')
        expect(card.getEndGamePoints(dennis)).toBe(0)
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'clay',
            minorImprovements: ['wool-blankets'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const scoreWith = dennis.calculateScore()

        t.setPlayerCards(game, dennis, 'minorImprovements', [])
        const scoreWithout = dennis.calculateScore()

        // Clay house = 2 bonus points from Wool Blankets
        expect(scoreWith - scoreWithout).toBe(2)
      })
    })

    describe('Milk Jug', () => {
      test('gives card owner 3 food when any player uses cattle market', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['milk-jug'],
          },
          micah: {
            food: 0,
          },
        })
        game.run()

        const dennis = t.player(game)
        const micah = game.players.byName('micah')

        // Set up cattle action space
        game.state.actionSpaces['take-cattle'] = { accumulated: 1 }

        // Micah takes cattle action
        game.actions.executeAction(micah, 'take-cattle')

        // Dennis (card owner) gets 3 food
        expect(dennis.food).toBe(3)
        // Micah gets 1 food from Milk Jug (started with 0)
        expect(micah.food).toBe(1)
      })

      test('gives all other players 1 food', () => {
        const game = t.fixture({ numPlayers: 3 })
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['milk-jug'],
          },
          micah: {
            food: 0,
          },
          scott: {
            food: 0,
          },
        })
        game.run()

        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        const scott = game.players.byName('scott')

        // Set up cattle action space
        game.state.actionSpaces['take-cattle'] = { accumulated: 1 }

        // Scott takes cattle action
        game.actions.executeAction(scott, 'take-cattle')

        // Dennis gets 3 food (card owner, started with 0)
        expect(dennis.food).toBe(3)
        // Micah gets 1 food (other player, started with 0)
        expect(micah.food).toBe(1)
        // Scott also gets 1 food (started with 0)
        expect(scott.food).toBe(1)
      })

      test('triggers when another player takes Cattle Market via game flow', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['milk-jug'],
          },
          micah: {
            food: 0,
          },
          actionSpaces: ['Cattle Market'],
        })
        game.run()

        // Dennis takes a non-interactive action first
        t.choose(game, 'Grain Seeds')
        // Micah takes Cattle Market (after replenish: accumulated = 1)
        t.choose(game, 'Cattle Market')

        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        // Dennis (card owner) gets 3 food, micah gets 1 food from Milk Jug
        expect(dennis.food).toBe(3)
        expect(micah.food).toBe(1)
      })
    })

    describe('Corn Scoop', () => {
      test('gives +1 grain on Grain Seeds action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['corn-scoop'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            grain: 2, // 1 base + 1 from Corn Scoop
            minorImprovements: ['corn-scoop'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Stone Tongs', () => {
      test('gives +1 stone on Western Quarry action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['stone-tongs'],
          },
          round: 6, // Need stage 2+ for stone actions
        })
        game.run()

        t.choose(game, 'Western Quarry')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            stone: 2, // 1 accumulated + 1 from Stone Tongs
            minorImprovements: ['stone-tongs'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Canoe', () => {
      test('gives +1 food and +1 reed on Fishing action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['canoe'],
          },
        })
        game.run()

        t.choose(game, 'Fishing')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2, // 1 accumulated + 1 from Canoe
            reed: 1, // +1 from Canoe
            minorImprovements: ['canoe'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Pond Hut', () => {
      test('schedules 1 food for next 3 rounds', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['pond-hut'],
            occupations: ['wood-cutter', 'firewood-collector'], // Need exactly 2 occupations
          },
          round: 5,
        })
        game.run()

        game.state.round = 5
        t.playCard(game, 'dennis', 'pond-hut')

        const dennis = t.player(game)
        // Should schedule food for rounds 6, 7, 8
        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
      })

      test('delivers scheduled food at round start', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            food: 0,
            minorImprovements: ['pond-hut'],
            occupations: ['wood-cutter', 'firewood-collector'],
          },
        })
        // Manually schedule food for round 2 (simulating card was played round 1)
        game.testSetBreakpoint('initialization-complete', (game) => {
          game.state.scheduledFood = { dennis: { 2: 1, 3: 1, 4: 1 } }
        })
        game.run()

        // Round 2 start: scheduled food delivered
        const dennis = t.player(game)
        expect(dennis.food).toBe(1) // 1 scheduled food for round 2
      })
    })

    describe('Large Greenhouse', () => {
      test('schedules vegetables for rounds current+4, +7, +9', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['large-greenhouse'],
            occupations: ['wood-cutter', 'firewood-collector'], // Need 2 occupations
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'large-greenhouse')

        const dennis = t.player(game)
        // Should schedule vegetables for rounds 7, 10, 12
        expect(game.state.scheduledVegetables[dennis.name][7]).toBe(1)
        expect(game.state.scheduledVegetables[dennis.name][10]).toBe(1)
        expect(game.state.scheduledVegetables[dennis.name][12]).toBe(1)
      })

      test('does not schedule beyond round 14', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['large-greenhouse'],
            occupations: ['wood-cutter', 'firewood-collector'],
          },
          round: 8,
        })
        game.run()

        game.state.round = 8
        t.playCard(game, 'dennis', 'large-greenhouse')

        const dennis = t.player(game)
        // Round 8+4=12 (valid), 8+7=15 (invalid), 8+9=17 (invalid)
        expect(game.state.scheduledVegetables[dennis.name][12]).toBe(1)
        expect(game.state.scheduledVegetables[dennis.name][15]).toBeUndefined()
        expect(game.state.scheduledVegetables[dennis.name][17]).toBeUndefined()
      })

      test('delivers scheduled vegetables at round start', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            vegetables: 0,
            minorImprovements: ['large-greenhouse'],
            occupations: ['wood-cutter', 'firewood-collector'],
          },
        })
        // Manually schedule vegetables for round 2 (simulating earlier play)
        game.testSetBreakpoint('initialization-complete', (game) => {
          game.state.scheduledVegetables = { dennis: { 2: 1 } }
        })
        game.run()

        // Round 2 start: scheduled vegetables delivered
        const dennis = t.player(game)
        expect(dennis.vegetables).toBe(1)
      })
    })

    describe('Handplow', () => {
      test('schedules a plow for round 6 when played in round 1', () => {
        const game = t.fixtureMinorImprovement(
          'handplow',
          {},
          {
            dennis: {
              wood: 1, // cost
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        // fixtureMinorImprovement uses default round, game.state.round is 2 during play
        // Schedules plow for round 2+5 = 7
        expect(game.state.scheduledPlows[dennis.name]).toContain(7)

        t.testBoard(game, {
          dennis: {
            food: 1, // +1 from Meeting Place
            hand: [],
            minorImprovements: ['handplow'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not schedule beyond round 14', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            hand: ['handplow'],
          },
          round: 10,
        })
        game.run()

        game.state.round = 10
        t.playCard(game, 'dennis', 'handplow')

        // Round 10+5=15, which is beyond 14 so nothing scheduled
        expect(game.state.scheduledPlows).toBeUndefined()
      })
    })

    describe('Threshing Board', () => {
      test('triggers bake bread when using Farmland action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 3,
            minorImprovements: ['threshing-board'],
            majorImprovements: ['fireplace-2'],
          },
        })
        game.run()

        // Dennis picks Farmland (plow-field)
        t.choose(game, 'Farmland')
        // Select a space to plow
        t.choose(game, game.waiting.selectors[0].choices[0])
        // Threshing Board triggers bake bread — choose to bake grain
        t.choose(game, game.waiting.selectors[0].choices.find(c => typeof c === 'string' && c.includes('grain')) || game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: dennis.food,
            grain: dennis.grain,
            minorImprovements: ['threshing-board'],
            majorImprovements: ['fireplace-2'],
            farmyard: { fields: 1 },
            score: dennis.calculateScore(),
          },
        })
        // Should have gained food from baking (and lost grain)
        expect(dennis.grain).toBeLessThan(3)
      })

      test('does not trigger for other actions', () => {
        const card = res.getCardById('threshing-board')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })
    })

    describe('Sleeping Corner', () => {
      test('has allowOccupiedFamilyGrowth flag', () => {
        const card = res.getCardById('sleeping-corner')
        expect(card.allowOccupiedFamilyGrowth).toBe(true)
      })

      test('has grainFields prerequisite', () => {
        const card = res.getCardById('sleeping-corner')
        expect(card.prereqs.grainFields).toBe(2)
      })

      test('costs 1 wood and gives 1 VP', () => {
        const card = res.getCardById('sleeping-corner')
        expect(card.cost).toEqual({ wood: 1 })
        expect(card.vps).toBe(1)
      })
    })

    describe('Big Country', () => {
      test('gives bonus points and food based on rounds left', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            hand: ['big-country'],
          },
          round: 10,
        })
        game.run()

        game.state.round = 10
        t.playCard(game, 'dennis', 'big-country')

        const dennis = t.player(game)
        // 14 - 10 = 4 rounds left
        expect(dennis.bonusPoints).toBe(4)
        expect(dennis.food).toBe(8) // 4 rounds * 2 food
      })

      test('gives nothing when played in round 14', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            hand: ['big-country'],
          },
          round: 14,
        })
        game.run()

        game.state.round = 14
        t.playCard(game, 'dennis', 'big-country')

        const dennis = t.player(game)
        // 14 - 14 = 0 rounds left
        expect(dennis.bonusPoints || 0).toBe(0)
        expect(dennis.food).toBe(0)
      })

      test('can be played via Meeting Place when all farmyard spaces are used', () => {
        // 3x5 grid = 15 spaces. 2 rooms at (0,0) and (1,0), fill rest with fields.
        const fields = []
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 5; col++) {
            if (row === 0 && col === 0) {
              continue // room
            }
            if (row === 1 && col === 0) {
              continue // room
            }
            fields.push({ row, col })
          }
        }

        const game = t.fixtureMinorImprovement('big-country', {}, {
          dennis: {
            food: 0,
            farmyard: { fields },
          },
          round: 10,
        })

        const dennis = t.player(game)
        // 14 - 11 = 3 rounds left (fixtureMinorImprovement starts at round+1)
        expect(dennis.bonusPoints).toBe(3)
        expect(dennis.food).toBe(7) // 1 from Meeting Place + 3 rounds * 2 food
      })
    })

    describe('Claypipe', () => {
      test('gives 2 food when 7+ building resources gained this round', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['claypipe'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('claypipe')

        // Simulate gaining building resources this round
        dennis.resourcesGainedThisRound = { wood: 3, clay: 2, stone: 1, reed: 1 } // total = 7

        card.onReturnHome(game, dennis)

        expect(dennis.food).toBe(2)
      })

      test('gives nothing when fewer than 7 building resources gained', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['claypipe'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('claypipe')

        // Only 6 building resources
        dennis.resourcesGainedThisRound = { wood: 3, clay: 2, stone: 1 }

        card.onReturnHome(game, dennis)

        expect(dennis.food).toBe(0)
      })
    })

    describe('Junk Room', () => {
      test('gives 1 food on play via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'junk-room',
          {},
          {
            dennis: {
              wood: 1,
              clay: 1, // cost
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            wood: 0, // 1 - 1 cost
            clay: 0, // 1 - 1 cost
            food: 3, // +1 MP + 1 onPlay + 1 onBuildImprovement (self-triggers)
            hand: [],
            minorImprovements: ['junk-room'],
          },
        })
      })

      test('gives 1 food on subsequent improvement builds', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['junk-room'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('junk-room')

        card.onBuildImprovement(game, dennis)
        expect(dennis.food).toBe(1)

        card.onBuildImprovement(game, dennis)
        expect(dennis.food).toBe(2)
      })
    })

    describe('Basket', () => {
      test('exchanges wood for food on take-wood', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 0,
            food: 0,
            minorImprovements: ['basket'],
          },
        })
        game.run()

        // Dennis takes Forest (take-wood) — gets 3 wood from accumulation
        t.choose(game, 'Forest')
        // Basket triggers: offer to exchange 2 wood for 3 food
        t.choose(game, 'Exchange 2 wood for 3 food')

        t.testBoard(game, {
          dennis: {
            wood: 1,  // 3 gained - 2 exchanged
            food: 3,  // 3 from exchange
            minorImprovements: ['basket'],
          },
        })
      })

      test('can skip wood-for-food exchange', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 0,
            food: 0,
            minorImprovements: ['basket'],
          },
        })
        game.run()

        t.choose(game, 'Forest')
        // Skip the exchange
        t.choose(game, 'Skip')

        t.testBoard(game, {
          dennis: {
            wood: 3,
            food: 0,
            minorImprovements: ['basket'],
          },
        })
      })

      test('does not offer exchange with fewer than 2 wood', () => {
        const card = res.getCardById('basket')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.wood = 1

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })
    })

    describe('Dutch Windmill', () => {
      test('gives 3 extra food when baking in round after harvest', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 2,
            minorImprovements: ['dutch-windmill'],
            majorImprovements: ['fireplace-2'],
          },
        })
        // Set lastHarvestRound in breakpoint so it survives run() resets
        game.testSetBreakpoint('initialization-complete', (game) => {
          game.state.lastHarvestRound = 1
        })
        game.run()

        t.choose(game, 'Grain Utilization')
        // No fields to sow, so goes straight to baking
        t.choose(game, 'Bake 2 grain')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 7, // 2 grain × 2 food (fireplace) + 3 (dutch windmill)
            minorImprovements: ['dutch-windmill'],
            majorImprovements: ['fireplace-2'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('gives nothing when baking in a non-post-harvest round', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 1,
            minorImprovements: ['dutch-windmill'],
            majorImprovements: ['fireplace-2'],
          },
        })
        game.run()

        // lastHarvestRound defaults to 0, current round is 2 (not 0 + 1)
        t.choose(game, 'Grain Utilization')
        t.choose(game, 'Bake 1 grain')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2, // 1 grain × 2 food (fireplace), no dutch windmill bonus
            minorImprovements: ['dutch-windmill'],
            majorImprovements: ['fireplace-2'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Clearing Spade', () => {
      test('has allowsAnytimeCropMove flag', () => {
        const card = res.getCardById('clearing-spade')
        expect(card.allowsAnytimeCropMove).toBe(true)
      })

      test('costs 1 wood', () => {
        const card = res.getCardById('clearing-spade')
        expect(card.cost).toEqual({ wood: 1 })
      })
    })

    describe('Lumber Mill', () => {
      test('reduces wood cost of improvements by 1', () => {
        const card = res.getCardById('lumber-mill')
        const modified = card.modifyImprovementCost(null, { wood: 3, clay: 2 })
        expect(modified.wood).toBe(2)
        expect(modified.clay).toBe(2)
      })

      test('does not reduce wood below 0', () => {
        const card = res.getCardById('lumber-mill')
        const modified = card.modifyImprovementCost(null, { clay: 2 })
        // No wood key, so cost unchanged
        expect(modified.clay).toBe(2)
        expect(modified.wood).toBeUndefined()
      })

      test('gives 2 VPs', () => {
        const card = res.getCardById('lumber-mill')
        expect(card.vps).toBe(2)
      })

      test('reduces wood cost when buying major improvement', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['lumber-mill'],
            occupations: ['wood-cutter', 'firewood-collector', 'seasonal-worker'], // prereq met
            // Joinery costs wood:2, stone:2. With Lumber Mill, wood reduced by 1 → wood:1
            wood: 1,
            stone: 2,
          },
        })
        game.run()

        const dennis = t.player(game)
        expect(dennis.canBuyMajorImprovement('joinery')).toBe(true)

        // Without lumber mill, would need 2 wood
        dennis.wood = 0
        expect(dennis.canBuyMajorImprovement('joinery')).toBe(false)
      })
    })

    describe("Shepherd's Crook", () => {
      test('gives 2 sheep when fencing a 4-space pasture via Fencing action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 15,
            minorImprovements: ['shepherds-crook'],
          },
          actionSpaces: ['Fencing'],
        })
        game.run()

        t.choose(game, 'Fencing')

        // Select 4 empty spaces for pasture via action response
        const sel = game.waiting.selectors[0]
        game.respondToInputRequest({
          actor: sel.actor,
          title: sel.title,
          selection: {
            action: 'build-pasture',
            spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
          },
        })
        t.choose(game, 'Done building fences')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 7, // 15 - 8 fences
            sheep: 2,
            minorImprovements: ['shepherds-crook'],
            farmyard: { pastures: 1 },
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not give sheep for pastures smaller than 4 spaces', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 15,
            minorImprovements: ['shepherds-crook'],
          },
          actionSpaces: ['Fencing'],
        })
        game.run()

        t.choose(game, 'Fencing')

        // Select 2 empty spaces for a small pasture
        const sel = game.waiting.selectors[0]
        game.respondToInputRequest({
          actor: sel.actor,
          title: sel.title,
          selection: {
            action: 'build-pasture',
            spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }],
          },
        })
        t.choose(game, 'Done building fences')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 9, // 15 - 6 fences
            minorImprovements: ['shepherds-crook'],
            farmyard: { pastures: 1 },
            score: dennis.calculateScore(),
          },
        })
      })
    })
  })

  describe('Occupations', () => {

    describe('Animal Tamer', () => {
      test('offers wood or grain on play', () => {
        const game = t.fixtureOccupation(
          'animal-tamer',
          {},
          { dennis: {} },
        )

        t.choose(game, game.waiting.selectors[0].choices[0])

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: dennis.wood,
            grain: dennis.grain,
            occupations: ['animal-tamer'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('modifies house animal capacity', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['animal-tamer'],
            farmyard: { rooms: 3 },
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('animal-tamer')
        // 3 rooms = 3 animals can live in house
        expect(card.modifyHouseAnimalCapacity(dennis, 1)).toBe(3)
      })
    })

    describe('Conservator', () => {
      test('can be played via Lessons', () => {
        const game = t.fixtureOccupation(
          'conservator',
          {},
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['conservator'],
          },
        })
      })

      test('allows direct stone renovation', () => {
        const card = res.getCardById('conservator')
        expect(card.allowDirectStoneRenovation).toBe(true)
      })

      test('player with conservator canRenovateDirectlyToStone returns true', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['conservator'],
            roomType: 'wood',
          },
        })
        game.run()

        const dennis = t.player(game)
        expect(dennis.canRenovateDirectlyToStone()).toBe(true)
      })

      test('player without conservator canRenovateDirectlyToStone returns false', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        expect(dennis.canRenovateDirectlyToStone()).toBe(false)
      })

      test('can renovate wood directly to stone via Cottager Day Laborer', () => {
        const game = t.fixture({ cardSets: ['baseA', 'baseB'] })
        t.setBoard(game, {
          dennis: {
            stone: 2,
            reed: 1,
            occupations: ['conservator', 'cottager'],
          },
        })
        game.run()

        t.choose(game, 'Day Laborer')
        t.choose(game, 'Renovate')
        t.choose(game, 'Renovate to Stone')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2,  // +2 Day Laborer
            stone: 0, // 2 - 2 (1 per room × 2 rooms)
            reed: 0,  // 1 - 1
            roomType: 'stone',
            occupations: ['conservator', 'cottager'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('canRenovate returns true when only stone path is affordable', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['conservator'],
            roomType: 'wood',
            clay: 0,
            stone: 2,
            reed: 1,
          },
        })
        game.run()

        const dennis = t.player(game)
        // Can't afford wood→clay (need 2 clay + 1 reed), but can afford wood→stone (2 stone + 1 reed)
        expect(dennis.canRenovate()).toBe(true)
        expect(dennis.canRenovate('stone')).toBe(true)
      })
    })

    describe('Hedge Keeper', () => {
      test('can be played via Lessons', () => {
        const game = t.fixtureOccupation(
          'hedge-keeper',
          {},
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['hedge-keeper'],
          },
        })
      })

      test('reduces fence cost by 3', () => {
        const card = res.getCardById('hedge-keeper')
        expect(card.modifyFenceCost(null, 5)).toBe(2)
        expect(card.modifyFenceCost(null, 3)).toBe(0)
        expect(card.modifyFenceCost(null, 2)).toBe(0)
      })

      test('builds a pasture paying less wood via Fencing action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 1,  // Only 1 wood, but 3 fences are free
            occupations: ['hedge-keeper'],
          },
          actionSpaces: ['Fencing'],
        })
        game.run()

        t.choose(game, 'Fencing')

        // Build a single-space pasture at corner (4 fences needed, 3 free → pay 1 wood)
        const sel = game.waiting.selectors[0]
        game.respondToInputRequest({
          actor: sel.actor,
          title: sel.title,
          selection: {
            action: 'build-pasture',
            spaces: [{ row: 0, col: 4 }],
          },
        })
        t.choose(game, 'Done building fences')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 0,  // 1 - 1 (4 fences needed, 3 free)
            occupations: ['hedge-keeper'],
            farmyard: {
              pastures: 1,
              fences: 4,
            },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Stable Architect', () => {
      test('gives points for unfenced stables', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['stable-architect'],
            farmyard: {
              stables: [{ row: 1, col: 0 }, { row: 1, col: 1 }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('stable-architect')
        expect(card.getEndGamePoints(dennis)).toBe(2)
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['stable-architect'],
            farmyard: {
              stables: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const scoreWith = dennis.calculateScore()

        t.setPlayerCards(game, dennis, 'occupations', [])
        const scoreWithout = dennis.calculateScore()

        // 3 unfenced stables = 3 bonus points from Stable Architect
        expect(scoreWith - scoreWithout).toBe(3)
      })
    })

    describe('Wood Cutter', () => {
      test('gives +1 wood on Forest action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['wood-cutter'],
          },
        })
        game.run()

        t.choose(game, 'Forest')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 4, // 3 accumulated + 1 from Wood Cutter
            occupations: ['wood-cutter'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Scythe Worker', () => {
      test('gives 1 grain on play', () => {
        const game = t.fixtureOccupation(
          'scythe-worker',
          {},
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            grain: 1,
            occupations: ['scythe-worker'],
            score: -12,
          },
        })
      })

      test('gives extra grain during harvest for each grain field', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 4,
            occupations: ['scythe-worker'],
            farmyard: {
              fields: [
                { row: 2, col: 0, crop: 'grain', cropCount: 3 },
                { row: 2, col: 1, crop: 'grain', cropCount: 2 },
              ],
            },
          },
          micah: { food: 4 },
          round: 3,
        })
        game.run()

        // Round 4: both players take non-interactive actions
        t.choose(game, 'Day Laborer')   // dennis: +2 food
        t.choose(game, 'Grain Seeds')   // micah: +1 grain
        t.choose(game, 'Forest')    // dennis: +3 wood
        t.choose(game, 'Clay Pit')  // micah: +1 clay

        // Harvest fires: fieldPhase harvests 2 grain (1 per field),
        // then scythe-worker gives 2 extra grain (1 per grain field)
        // Feeding: 4 food required per player (2 members × 2 food each)
        const dennis = t.player(game)
        const micah = t.player(game, 'micah')
        t.testBoard(game, {
          dennis: {
            food: 2,   // 4 + 2 (day laborer) - 4 (feeding)
            grain: 4,  // 2 (harvested) + 2 (scythe-worker bonus)
            wood: 3,   // from Forest
            occupations: ['scythe-worker'],
            farmyard: { fields: 2 },
            score: dennis.calculateScore(),
          },
          micah: {
            grain: 1,  // from Grain Seeds
            clay: 1,   // from Clay Pit
            farmyard: {},
            score: micah.calculateScore(),
          },
        })
      })
    })

    describe('Seasonal Worker', () => {
      test('gives +1 grain when using day-laborer before round 6', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 0,
            occupations: ['seasonal-worker'],
          },
          round: 3,
        })
        game.run()

        const dennis = t.player(game)
        game.actions.executeAction(dennis, 'day-laborer')

        // Day Laborer gives 2 food base
        // Seasonal Worker adds 1 grain before round 6
        expect(dennis.food).toBe(2) // 0 starting + 2 from Day Laborer
        expect(dennis.grain).toBe(1)
      })

      test('offers resource choice on day-laborer from round 6+', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 0,
            vegetables: 0,
            occupations: ['seasonal-worker'],
          },
          round: 6,
        })
        game.run()

        // Dennis takes Day Laborer
        t.choose(game, 'Day Laborer')
        // Seasonal Worker triggers: choose grain or vegetables
        t.choose(game, 'Take 1 grain')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2, // Day Laborer gives 2 food
            grain: 1, // from Seasonal Worker choice
            occupations: ['seasonal-worker'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Firewood Collector', () => {
      test('gives +1 wood on Grain Seeds action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['firewood-collector'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 1, // +1 from Firewood Collector
            grain: 1, // from Grain Seeds action
            occupations: ['firewood-collector'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('onAction triggers for farming-related actions', () => {
        const card = res.getCardById('firewood-collector')

        // Verify the trigger conditions
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        // Test onAction returns undefined for non-matching actions
        const result1 = card.onAction(game, dennis, 'fishing')
        expect(result1).toBeUndefined()

        // Test onAction for matching actions
        const woodBefore = dennis.wood
        card.onAction(game, dennis, 'plow-field')
        expect(dennis.wood).toBe(woodBefore + 1)

        card.onAction(game, dennis, 'sow-bake')
        expect(dennis.wood).toBe(woodBefore + 2)

        card.onAction(game, dennis, 'plow-sow')
        expect(dennis.wood).toBe(woodBefore + 3)
      })
    })

    describe('Priest', () => {
      test('gives resources if in clay house with 2 rooms', () => {
        const game = t.fixtureOccupation(
          'priest',
          {},
          { dennis: { roomType: 'clay' } },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            roomType: 'clay',
            clay: 3,
            reed: 2,
            stone: 2,
            occupations: ['priest'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('gives nothing if not in clay house', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'wood',
            clay: 0,
            reed: 0,
            stone: 0,
            hand: ['priest'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'priest')

        t.testBoard(game, {
          dennis: {
            clay: 0,
            reed: 0,
            stone: 0,
            occupations: ['priest'],
          },
        })
      })

      test('gives nothing if more than 2 rooms', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'clay',
            farmyard: { rooms: 3 },
            clay: 0,
            reed: 0,
            stone: 0,
            hand: ['priest'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'priest')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            roomType: 'clay',
            clay: 0,
            reed: 0,
            stone: 0,
            occupations: ['priest'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Braggart', () => {
      test('gives bonus points based on improvement count', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('braggart')

        // 0 improvements
        expect(card.getEndGamePoints(dennis)).toBe(0)

        // 5 improvements = 2 points
        t.setPlayerMajorImprovements(game, dennis, ['fireplace-2', 'well'])
        t.setPlayerCards(game, dennis, 'minorImprovements', ['corn-scoop', 'stone-tongs', 'canoe'])
        expect(card.getEndGamePoints(dennis)).toBe(2)

        // 7 improvements = 4 points
        t.setPlayerCards(game, dennis, 'minorImprovements', ['corn-scoop', 'stone-tongs', 'canoe', 'drinking-trough', 'rammed-clay'])
        expect(card.getEndGamePoints(dennis)).toBe(4)
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['braggart'],
            minorImprovements: ['corn-scoop', 'stone-tongs', 'canoe'],
            majorImprovements: ['fireplace-2', 'well'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const scoreWith = dennis.calculateScore()

        t.setPlayerCards(game, dennis, 'occupations', [])
        const scoreWithout = dennis.calculateScore()

        // 5 improvements (3 minor + 2 major) = 2 bonus points from Braggart
        expect(scoreWith - scoreWithout).toBe(2)
      })
    })

    describe('Pig Breeder', () => {
      test('gives 1 boar on play', () => {
        const game = t.fixtureOccupation(
          'pig-breeder',
          { numPlayers: 4 },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            animals: { boar: 1 },
            occupations: ['pig-breeder'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('breeds boar at end of round 12', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            occupations: ['pig-breeder'],
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }], animals: { boar: 2 } }],
            },
          },
          round: 11,
        })
        game.run()

        // Round 12: 8 actions (4 players × 2 workers), all non-interactive
        t.choose(game, 'Day Laborer')            // dennis
        t.choose(game, 'Grain Seeds')             // micah
        t.choose(game, 'Forest')              // scott
        t.choose(game, 'Clay Pit')            // eliya
        t.choose(game, 'Fishing')             // dennis
        t.choose(game, 'Copse')               // micah
        t.choose(game, 'Grove')               // scott
        t.choose(game, 'Traveling Players')   // eliya

        // Round 12 end: Pig Breeder breeds 1 boar (2 boar → 3)
        const dennis = t.player(game)
        expect(dennis.getTotalAnimals('boar')).toBe(3) // 2 original + 1 bred
      })
    })

    describe('Conjurer (4+ players)', () => {
      test('gives +1 wood and +1 grain on Traveling Players action', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            occupations: ['conjurer'],
          },
        })
        game.run()

        t.choose(game, 'Traveling Players')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 1, // 1 accumulated from Traveling Players
            wood: 1, // +1 from Conjurer
            grain: 1, // +1 from Conjurer
            occupations: ['conjurer'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Lutenist (4+ players)', () => {
      test('gives dennis food and wood when micah uses Traveling Players', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            occupations: ['lutenist'],
          },
        })
        game.run()

        // Dennis takes a non-traveling-players action first
        t.choose(game, 'Grain Seeds')
        // Micah takes Traveling Players
        t.choose(game, 'Traveling Players')

        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        t.testBoard(game, {
          dennis: {
            food: 1, // +1 from Lutenist (micah used Traveling Players)
            wood: 1, // +1 from Lutenist
            grain: 1, // from Grain Seeds
            occupations: ['lutenist'],
            score: dennis.calculateScore(),
          },
          micah: {
            food: 1, // from Traveling Players accumulated
            score: micah.calculateScore(),
          },
        })
      })

      test('does not trigger when card owner takes the action', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            occupations: ['lutenist'],
          },
        })
        game.run()

        t.choose(game, 'Traveling Players')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 1, // only from Traveling Players accumulated, no Lutenist bonus
            occupations: ['lutenist'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Mushroom Collector', () => {
      test('exchanges wood for food on take-wood', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 0,
            food: 0,
            occupations: ['mushroom-collector'],
          },
        })
        game.run()

        // Dennis takes Forest (take-wood) — gets 3 wood
        t.choose(game, 'Forest')
        // Mushroom Collector: exchange 1 wood for 2 food
        t.choose(game, 'Exchange 1 wood for 2 food')

        t.testBoard(game, {
          dennis: {
            wood: 2,  // 3 gained - 1 exchanged
            food: 2,  // 2 from exchange
            occupations: ['mushroom-collector'],
          },
        })
      })

      test('does not offer exchange with 0 wood', () => {
        const card = res.getCardById('mushroom-collector')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })

      test('does not trigger for non-wood actions', () => {
        const card = res.getCardById('mushroom-collector')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.wood = 5

        const result = card.onAction(game, dennis, 'take-grain')
        expect(result).toBeUndefined()
      })
    })

    describe('Plow Driver', () => {
      test('does not trigger when not in stone house', () => {
        const card = res.getCardById('plow-driver')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'clay'
        dennis.food = 3

        const result = card.onRoundStart(game, dennis)
        expect(result).toBeUndefined()
      })

      test('does not trigger when no food', () => {
        const card = res.getCardById('plow-driver')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'stone'
        dennis.food = 0

        const result = card.onRoundStart(game, dennis)
        expect(result).toBeUndefined()
      })

      test('offers plow for food at round start in stone house', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'stone',
            food: 3,
            occupations: ['plow-driver'],
          },
        })
        game.run()

        // Round 2 starts (setBoard round=1, mainLoop increments to 2)
        // Plow Driver onRoundStart fires immediately
        t.choose(game, 'Plow 1 field for 1 food')
        // Select a space to plow
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2,   // 3 - 1 paid for plow
            roomType: 'stone',
            occupations: ['plow-driver'],
            farmyard: { fields: 1 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Adoptive Parents', () => {
      test('can be played via Lessons', () => {
        const game = t.fixtureOccupation(
          'adoptive-parents',
          {},
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['adoptive-parents'],
          },
        })
      })

      test('has allowImmediateOffspringAction flag', () => {
        const card = res.getCardById('adoptive-parents')
        expect(card.allowImmediateOffspringAction).toBe(true)
      })

      test('player.canAdoptNewborn returns true with newborn and food', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        dennis.newborns = [3]
        dennis.food = 1

        expect(dennis.canAdoptNewborn()).toBe(true)
      })

      test('player.canAdoptNewborn returns false without food', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        dennis.newborns = [3]
        dennis.food = 0

        expect(dennis.canAdoptNewborn()).toBe(false)
      })

      test('player.canAdoptNewborn returns false without newborn', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        dennis.newborns = []
        dennis.food = 5

        expect(dennis.canAdoptNewborn()).toBe(false)
      })

      test('player.adoptNewborn deducts food and adds worker', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        dennis.newborns = [3]
        dennis.food = 5
        dennis.availableWorkers = 0

        const result = dennis.adoptNewborn()

        expect(result).toBe(true)
        expect(dennis.food).toBe(4)
        expect(dennis.availableWorkers).toBe(1)
        expect(dennis.newborns).toEqual([])
      })

      test('game.canUseAdoptiveParents returns true when conditions met', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 1,
            occupations: ['adoptive-parents'],
          },
        })
        game.run()

        const dennis = t.player(game)
        dennis.newborns = [3]
        dennis.availableWorkers = 0

        expect(game.canUseAdoptiveParents(dennis)).toBe(true)
      })

      test('game.canUseAdoptiveParents returns false without the card', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 1,
          },
        })
        game.run()

        const dennis = t.player(game)
        dennis.newborns = [3]
        dennis.availableWorkers = 0

        expect(game.canUseAdoptiveParents(dennis)).toBe(false)
      })

      test('game.canUseAdoptiveParents returns false with available workers', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 1,
            occupations: ['adoptive-parents'],
          },
        })
        game.run()

        const dennis = t.player(game)
        dennis.newborns = [3]
        dennis.availableWorkers = 1

        expect(game.canUseAdoptiveParents(dennis)).toBe(false)
      })

      test('game.canUseAdoptiveParents returns false without food', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            occupations: ['adoptive-parents'],
          },
        })
        game.run()

        const dennis = t.player(game)
        dennis.newborns = [3]
        dennis.availableWorkers = 0

        expect(game.canUseAdoptiveParents(dennis)).toBe(false)
      })

      test('adopted newborn needs 2 food during harvest (not 1)', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            familyMembers: 3,
            food: 10,
            occupations: ['adoptive-parents'],
          },
        })
        game.run()

        const dennis = t.player(game)
        // Simulate newborn
        dennis.newborns = [3]
        dennis.availableWorkers = 0

        // Adopt the newborn
        const adopted = dennis.adoptNewborn()
        expect(adopted).toBe(true)

        // After adoption, newborns should be empty
        expect(dennis.newborns).toEqual([])

        // Calculate food required - should be 6 (3 adults × 2 food each)
        // because the adopted child is no longer in newborns array
        expect(dennis.getFoodRequired()).toBe(6)
      })

      test('non-adopted newborn only needs 1 food during harvest', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            familyMembers: 3,
          },
        })
        game.run()

        const dennis = t.player(game)
        // Simulate newborn (not adopted)
        dennis.newborns = [3]

        // Calculate food required - should be 5 (2 adults × 2 food + 1 newborn × 1 food)
        expect(dennis.getFoodRequired()).toBe(5)
      })
    })

    describe('Grocer', () => {
      test('initializes goods stack on play', () => {
        const game = t.fixtureOccupation(
          'grocer',
          {},
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['grocer'],
          },
        })

        const dennis = t.player(game)
        expect(dennis.grocerGoods).toEqual([
          'wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables',
        ])
      })

      test('has allowsAnytimePurchase flag', () => {
        const card = res.getCardById('grocer')
        expect(card.allowsAnytimePurchase).toBe(true)
      })
    })

    describe('Clay Hut Builder', () => {
      test('schedules 2 clay for 5 rounds when room type is not wood', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('clay-hut-builder')

        // Set up: player has clay room, round is 4
        dennis.roomType = 'clay'
        game.state.round = 4

        card.checkTrigger(game, dennis)

        // Should schedule 2 clay for rounds 5-9
        expect(game.state.scheduledClay[dennis.name][5]).toBe(2)
        expect(game.state.scheduledClay[dennis.name][6]).toBe(2)
        expect(game.state.scheduledClay[dennis.name][7]).toBe(2)
        expect(game.state.scheduledClay[dennis.name][8]).toBe(2)
        expect(game.state.scheduledClay[dennis.name][9]).toBe(2)
      })

      test('does not trigger when still in wood house', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('clay-hut-builder')

        dennis.roomType = 'wood'
        game.state.round = 4

        card.checkTrigger(game, dennis)

        expect(game.state.scheduledClay).toBeUndefined()
      })

      test('only triggers once', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('clay-hut-builder')

        dennis.roomType = 'clay'
        game.state.round = 4

        card.checkTrigger(game, dennis)
        card.checkTrigger(game, dennis) // second call should be ignored

        // Still only 2 clay per round (not 4)
        expect(game.state.scheduledClay[dennis.name][5]).toBe(2)
      })

      test('delivers clay after renovation via Cottager Day Laborer', () => {
        const game = t.fixture({ cardSets: ['baseA', 'baseB'] })
        t.setBoard(game, {
          dennis: {
            clay: 2,
            reed: 1,
            occupations: ['clay-hut-builder', 'cottager'],
          },
        })
        game.run()

        // Round 2 (setBoard round=1, mainLoop increments to 2)
        // Dennis renovates wood→clay via Cottager Day Laborer
        t.choose(game, 'Day Laborer')
        t.choose(game, 'Renovate')

        // Finish round 2: remaining 3 actions
        t.choose(game, 'Grain Seeds')   // micah worker 1
        t.choose(game, 'Forest')    // dennis worker 2
        t.choose(game, 'Clay Pit')  // micah worker 2

        // Round 2 end: checkTrigger fires — schedules 2 clay for rounds 3-7
        // Round 3 start: scheduled clay delivered
        const dennis = t.player(game)
        expect(dennis.roomType).toBe('clay')
        expect(dennis.clay).toBe(2) // 2 - 2 (renovation cost) + 2 (scheduled clay delivered round 3)
        expect(dennis.clayHutBuilderTriggered).toBe(true)
      })
    })

    describe('Frame Builder', () => {
      test('modifies build cost to allow wood substitution', () => {
        const card = res.getCardById('frame-builder')
        const modified = card.modifyBuildCost(null, { clay: 5, reed: 2 }, 1)
        expect(modified.allowWoodSubstitution).toBe(1)
      })

      test('substitution count matches room count', () => {
        const card = res.getCardById('frame-builder')
        const modified = card.modifyBuildCost(null, { stone: 5, reed: 2 }, 3)
        expect(modified.allowWoodSubstitution).toBe(3)
      })

      test('getRoomCost includes allowWoodSubstitution when active', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['frame-builder'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const cost = dennis.getRoomCost()
        // Frame Builder adds allowWoodSubstitution to the cost object
        expect(cost.allowWoodSubstitution).toBeDefined()
      })
    })

    describe('Stonecutter (3+ players)', () => {
      test('reduces stone cost by 1', () => {
        const card = res.getCardById('stonecutter')
        const modified = card.modifyAnyCost(null, { stone: 3, reed: 1 })
        expect(modified.stone).toBe(2)
        expect(modified.reed).toBe(1)
      })

      test('does not reduce stone below 0', () => {
        const card = res.getCardById('stonecutter')
        const modified = card.modifyAnyCost(null, { wood: 3 })
        // No stone key, so cost unchanged
        expect(modified.wood).toBe(3)
      })

      test('does not affect items without stone cost', () => {
        const card = res.getCardById('stonecutter')
        const modified = card.modifyAnyCost(null, { clay: 5, reed: 2 })
        expect(modified.clay).toBe(5)
        expect(modified.reed).toBe(2)
      })

      test('reduces stone room cost when building via Farm Expansion', () => {
        const game = t.fixture({ numPlayers: 3 })
        t.setBoard(game, {
          dennis: {
            roomType: 'stone',
            stone: 4,   // 5 - 1 (Stonecutter discount)
            reed: 2,
            occupations: ['stonecutter'],
          },
        })
        game.run()

        t.choose(game, 'Farm Expansion')
        t.choose(game, 'Build Room')
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            stone: 0,  // 4 - 4 (5 base - 1 Stonecutter)
            reed: 0,   // 2 - 2
            roomType: 'stone',
            occupations: ['stonecutter'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Harpooner (3+ players)', () => {
      test('pays wood for food and reed bonus on fishing', () => {
        const game = t.fixture({ numPlayers: 3 })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            food: 0,
            reed: 0,
            occupations: ['harpooner'],
          },
        })
        game.run()

        // Dennis takes Fishing
        t.choose(game, 'Fishing')
        // Harpooner triggers: pay 1 wood for 2 food and 1 reed (2 family members)
        t.choose(game, game.waiting.selectors[0].choices.find(c => typeof c === 'string' && c.includes('Pay')))

        const dennis = t.player(game)
        expect(dennis.wood).toBe(0)  // 1 - 1 paid
        expect(dennis.food).toBeGreaterThanOrEqual(3)  // 1 from fishing + 2 from harpooner
        expect(dennis.reed).toBe(1)
      })

      test('does not trigger without wood', () => {
        const card = res.getCardById('harpooner')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0

        const result = card.onAction(game, dennis, 'fishing')
        expect(result).toBeUndefined()
      })

      test('does not trigger for non-fishing actions', () => {
        const card = res.getCardById('harpooner')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.wood = 3

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })
    })

    describe('Animal Dealer (3+ players)', () => {
      test('does not trigger without food', () => {
        const card = res.getCardById('animal-dealer')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        const result = card.onAction(game, dennis, 'take-sheep')
        expect(result).toBeUndefined()
      })

      test('does not trigger on non-animal-market actions', () => {
        const card = res.getCardById('animal-dealer')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 5

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })

      test('offers to buy extra sheep on Sheep Market action', () => {
        const game = t.fixture({ numPlayers: 3 })
        t.setBoard(game, {
          dennis: {
            food: 1,
            occupations: ['animal-dealer'],
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }], animals: {} }],
            },
          },
          actionSpaces: ['Sheep Market'],
        })
        game.run()

        // After replenish, Sheep Market has 1 accumulated
        t.choose(game, 'Sheep Market')
        // Animal Dealer triggers: buy 1 sheep for 1 food
        t.choose(game, 'Buy 1 sheep for 1 food')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 0,   // 1 - 1 paid
            sheep: 2,  // 1 from market + 1 from Animal Dealer
            occupations: ['animal-dealer'],
            farmyard: { pastures: 1 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Roughcaster', () => {
      test('gives 3 food when building clay room via Building action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'clay',
            clay: 5,
            reed: 2,
            occupations: ['roughcaster'],
          },
        })
        game.run()

        t.choose(game, 'Farm Expansion')
        t.choose(game, 'Build Room')
        t.choose(game, game.waiting.selectors[0].choices[0]) // pick room location

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 3, // from Roughcaster
            clay: 0, // 5 - 5 cost
            roomType: 'clay',
            occupations: ['roughcaster'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not give food when building wood room', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['roughcaster'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('roughcaster')

        card.onBuildRoom(game, dennis, 'wood')

        expect(dennis.food).toBe(0)
      })

      test('gives 3 food when renovating from clay to stone', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['roughcaster'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('roughcaster')

        card.onRenovate(game, dennis, 'clay', 'stone')

        expect(dennis.food).toBe(3)
      })

      test('does not give food when renovating from wood to clay', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['roughcaster'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('roughcaster')

        card.onRenovate(game, dennis, 'wood', 'clay')

        expect(dennis.food).toBe(0)
      })
    })

    describe('Wall Builder', () => {
      test('schedules food on next 4 rounds when building room via Building action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            reed: 2,
            occupations: ['wall-builder'],
          },
        })
        game.run()

        t.choose(game, 'Farm Expansion')
        t.choose(game, 'Build Room')
        t.choose(game, game.waiting.selectors[0].choices[0]) // pick room location

        const dennis = t.player(game)
        // game.state.round is 2 during the first work phase, so schedules food for rounds 3, 4, 5, 6
        expect(game.state.scheduledFood[dennis.name][3]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][5]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)

        t.testBoard(game, {
          dennis: {
            wood: 0, // 5 - 5 cost
            occupations: ['wall-builder'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not schedule food beyond round 14', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['wall-builder'],
          },
          round: 12,
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('wall-builder')

        game.state.round = 12
        card.onBuildRoom(game, dennis)

        // Should only schedule food for rounds 13, 14 (not beyond 14)
        expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
      })
    })
  })

  describe('setBoard/testBoard', () => {
    test('setBoard sets resources correctly', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          food: 10,
          wood: 5,
          grain: 3,
        },
      })
      game.run()

      const dennis = t.player(game)
      t.testBoard(game, {
        dennis: {
          food: 10,
          wood: 5,
          grain: 3,
          score: dennis.calculateScore(),
        },
      })
    })

    test('setBoard sets cards correctly', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          hand: ['shifting-cultivation', 'clay-embankment'],
          occupations: ['wood-cutter'],
          minorImprovements: ['corn-scoop'],
          majorImprovements: ['fireplace-2'],
        },
      })
      game.run()

      const dennis = t.player(game)
      t.testBoard(game, {
        dennis: {
          hand: ['shifting-cultivation', 'clay-embankment'],
          occupations: ['wood-cutter'],
          minorImprovements: ['corn-scoop'],
          majorImprovements: ['fireplace-2'],
          score: dennis.calculateScore(),
        },
      })
    })

    test('setBoard sets farmyard correctly', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          farmyard: {
            rooms: 3,
            fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 2 }],
            stables: [{ row: 2, col: 1 }],
          },
        },
      })
      game.run()

      const dennis = t.player(game)
      t.testBoard(game, {
        dennis: {
          farmyard: {
            rooms: 3,
            fields: 1,
            stables: 1,
          },
          score: dennis.calculateScore(),
        },
      })
    })

    test('testBoard throws on mismatch', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: { food: 5 },
      })
      game.run()

      expect(() => {
        t.testBoard(game, {
          dennis: { food: 10 },
        })
      }).toThrow(/food: expected 10, got 5/)
    })
  })
})
