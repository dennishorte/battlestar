const t = require('../../testutil.js')
const res = require('../index.js')
const baseB = require('./baseB.js')


describe('BaseB Cards', () => {

  describe('card data', () => {
    test('all minor improvements are defined', () => {
      const minors = baseB.getMinorImprovements()
      expect(minors.length).toBe(24)
    })

    test('all occupations are defined', () => {
      const occupations = baseB.getOccupations()
      expect(occupations.length).toBe(24)
    })

    test('getCardById returns correct card', () => {
      const card = baseB.getCardById('market-stall')
      expect(card.name).toBe('Market Stall')
      expect(card.type).toBe('minor')
    })

    test('getCardsByPlayerCount filters correctly', () => {
      const twoPlayerCards = baseB.getCardsByPlayerCount(2)
      const fourPlayerCards = baseB.getCardsByPlayerCount(4)

      // 4+ player cards should not be in 2 player game
      expect(twoPlayerCards.some(c => c.id === 'cattle-feeder')).toBe(false)
      expect(fourPlayerCards.some(c => c.id === 'cattle-feeder')).toBe(true)

      // 3+ player cards
      expect(twoPlayerCards.some(c => c.id === 'greengrocer')).toBe(false)
      expect(fourPlayerCards.some(c => c.id === 'greengrocer')).toBe(true)
    })

    test('res.getCardById finds baseB cards', () => {
      const card = res.getCardById('market-stall')
      expect(card).toBeDefined()
      expect(card.name).toBe('Market Stall')
    })

    test('res.getAllCards includes baseB cards', () => {
      const all = res.getAllCards()
      expect(all.some(c => c.id === 'market-stall')).toBe(true)
      expect(all.some(c => c.id === 'cottager')).toBe(true)
    })
  })


  describe('Minor Improvements', () => {

    describe('Mini Pasture', () => {
      test('fences a space for free on play', () => {
        const game = t.fixtureMinorImprovement(
          'mini-pasture',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              food: 2,  // cost of mini pasture
            },
          },
        )

        t.choose(game, '0,4')  // Choose location for the pasture.

        t.testIsSecondPlayer(game, 'Choose an action') // The turn has passed to the next player.
        t.testBoard(game, {
          dennis: {
            food: 1, // Started 2, +1 Meeting Place, -2 card cost
            hand: [], // Passed left
            farmyard: {
              pastures: 1,
              fences: 4, // Single corner space (0,4) needs 4 fences
            },
            score: -11,
          },
          micah: {
            hand: ['mini-pasture'], // Was passed left.
          },
        })
      })
    })

    describe('Market Stall', () => {
      test('gives 1 vegetable on play', () => {
        const game = t.fixtureMinorImprovement(
          'market-stall',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              grain: 1,  // cost of market stall
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            food: 1, // +1 from Meeting Place
            grain: 0, // 1 - 1 card cost
            vegetables: 1, // +1 from onPlay
            hand: [], // Passed left
            score: -12, // -14 base + 2 (has 1 vegetable instead of 0)
          },
          micah: {
            hand: ['market-stall'], // Was passed left
          },
        })
      })
    })

    describe('Caravan', () => {
      test('can be played via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'caravan',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              wood: 3,
              food: 3,
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            wood: 0, // 3 - 3 cost
            food: 1, // 3 + 1 MP - 3 cost
            hand: [],
            minorImprovements: ['caravan'],
          },
        })
      })

      test('has providesRoom flag', () => {
        const card = baseB.getCardById('caravan')
        expect(card.providesRoom).toBe(true)
      })
    })

    describe("Carpenter's Parlor", () => {
      test('can be played via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'carpenters-parlor',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              wood: 1,
              stone: 1,
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            wood: 0, // 1 - 1 cost
            stone: 0, // 1 - 1 cost
            food: 1, // +1 MP
            hand: [],
            minorImprovements: ['carpenters-parlor'],
          },
        })
      })

      test('reduces wooden room cost to 2 wood and 2 reed', () => {
        const card = baseB.getCardById('carpenters-parlor')

        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'wood'

        const modified = card.modifyBuildCost(dennis, { wood: 5, reed: 2 }, 'build-room')
        expect(modified).toEqual({ wood: 2, reed: 2 })
      })

      test('does not modify cost for non-wood houses', () => {
        const card = baseB.getCardById('carpenters-parlor')

        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'clay'

        const cost = { clay: 5, reed: 2 }
        const modified = card.modifyBuildCost(dennis, cost, 'build-room')
        expect(modified).toEqual(cost)
      })

      test('reduces room cost when building via Farm Expansion', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            wood: 2,
            reed: 2,
            minorImprovements: ['carpenters-parlor'],
          },
        })
        game.run()

        t.choose(game, 'Farm Expansion')
        t.choose(game, 'Build Room')
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 0,  // 2 - 2 (modified cost)
            reed: 0,  // 2 - 2 (modified cost)
            minorImprovements: ['carpenters-parlor'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Mining Hammer', () => {
      test('gives 1 food on play via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'mining-hammer',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              wood: 1, // cost
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            wood: 0, // 1 - 1 cost
            food: 2, // +1 MP + 1 onPlay
            hand: [],
            minorImprovements: ['mining-hammer'],
          },
        })
      })

      test('has onRenovate hook', () => {
        const card = baseB.getCardById('mining-hammer')
        expect(card.onRenovate).toBeDefined()
      })

      test('offers free stable after renovation via Cottager Day Laborer', () => {
        const game = t.fixture({ cardSets: ['baseA', 'baseB'] })
        t.setBoard(game, {
          dennis: {
            clay: 2,
            reed: 1,
            minorImprovements: ['mining-hammer'],
            occupations: ['cottager'],
          },
        })
        game.run()

        t.choose(game, 'Day Laborer')
        t.choose(game, 'Renovate')
        // Mining Hammer onRenovate fires: choose a stable location
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2,
            roomType: 'clay',
            minorImprovements: ['mining-hammer'],
            occupations: ['cottager'],
            farmyard: { stables: 1 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Moldboard Plow', () => {
      test('sets 2 charges on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['moldboard-plow'],
            occupations: ['wood-cutter'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'moldboard-plow')

        const dennis = t.player(game)
        expect(dennis.moldboardPlowCharges).toBe(2)
      })

      test('plows extra field on Farmland action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['moldboard-plow'],
            occupations: ['wood-cutter'],
          },
        })
        game.run()

        // Round 1: Dennis plays Meeting Place to play Moldboard Plow
        t.choose(game, 'Meeting Place')
        t.choose(game, 'Minor Improvement.Moldboard Plow')

        // Round 1: Micah takes an action
        t.choose(game, 'Grain Seeds')

        // Round 2: Dennis takes Farmland — base plow + moldboard plow hook
        t.choose(game, 'Farmland')
        // Respond to base plow space selection
        t.choose(game, game.waiting.selectors[0].choices[0])
        // Respond to moldboard plow space selection
        t.choose(game, game.waiting.selectors[0].choices[0])

        expect(t.player(game).moldboardPlowCharges).toBe(1)
        t.testBoard(game, {
          dennis: {
            wood: 3, // 5 - 2 cost
            food: 1, // +1 from Meeting Place
            occupations: ['wood-cutter'],
            minorImprovements: ['moldboard-plow'],
            farmyard: { fields: 2 },
            score: -10, // -14 base + 2 fields + other bonuses
          },
          micah: {
            grain: 1, // from Grain Seeds action
            score: -12, // -14 base + grain bonus
          },
        })
      })
    })

    describe('Lasso', () => {
      test('can be played via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'lasso',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              reed: 1, // cost
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            reed: 0, // 1 - 1 cost
            food: 1, // +1 MP
            hand: [],
            minorImprovements: ['lasso'],
          },
        })
      })

      test('has allowDoubleWorkerPlacement with animal market actions', () => {
        const card = baseB.getCardById('lasso')
        expect(card.allowDoubleWorkerPlacement).toEqual(['take-sheep', 'take-boar', 'take-cattle'])
      })
    })

    describe('Bread Paddle', () => {
      test('gives 1 food on play via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'bread-paddle',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              wood: 1, // cost
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            wood: 0, // 1 - 1 cost
            food: 2, // +1 MP + 1 onPlay
            hand: [],
            minorImprovements: ['bread-paddle'],
          },
        })
      })

      test('has onPlayOccupation hook', () => {
        const card = baseB.getCardById('bread-paddle')
        expect(card.onPlayOccupation).toBeDefined()
      })

      test('offers bake bread when playing an occupation', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            grain: 1,
            minorImprovements: ['bread-paddle'],
            majorImprovements: ['fireplace-2'],
            hand: ['seasonal-worker'],
          },
        })
        game.run()

        t.choose(game, 'Lessons A')
        t.choose(game, 'Seasonal Worker')

        // Bread Paddle onPlayOccupation fires: bake bread
        t.choose(game, 'Bake 1 grain')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            grain: 0,
            food: 2, // 1 grain × 2 food (fireplace)
            minorImprovements: ['bread-paddle'],
            majorImprovements: ['fireplace-2'],
            occupations: ['seasonal-worker'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Mantlepiece', () => {
      test('gives bonus points and prevents renovation via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'mantlepiece',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              roomType: 'clay',
              stone: 1, // cost
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        // game.state.round is 2 during the first work phase, so 14 - 2 = 12
        expect(dennis.bonusPoints).toBe(12)
        expect(dennis.cannotRenovate).toBe(true)

        t.testBoard(game, {
          dennis: {
            stone: 0, // 1 - 1 cost
            food: 1, // +1 MP
            hand: [],
            roomType: 'clay',
            minorImprovements: ['mantlepiece'],
            score: -3, // -14 base + clay house bonus + 12 bonus points - 3 mantlepiece vps
          },
        })
      })

      test('gives no bonus points in round 14', () => {
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        game.state.round = 14

        const card = baseB.getCardById('mantlepiece')
        card.onPlay(game, dennis)

        expect(dennis.bonusPoints || 0).toBe(0)
      })
    })

    describe('Bottles', () => {
      test('has 4 vps and special cost', () => {
        const card = baseB.getCardById('bottles')
        expect(card.vps).toBe(4)
        expect(card.cost).toEqual({ special: true })
      })

      test('getSpecialCost returns cost based on family members', () => {
        const card = baseB.getCardById('bottles')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        // Default 2 family members
        expect(card.getSpecialCost(dennis)).toEqual({ clay: 2, food: 2 })

        dennis.familyMembers = 4
        expect(card.getSpecialCost(dennis)).toEqual({ clay: 4, food: 4 })
      })

      test('can be played via Meeting Place paying special cost', () => {
        const game = t.fixtureMinorImprovement(
          'bottles',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              clay: 2,
              food: 2,
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            clay: 0,  // 2 - 2 (2 family members × 1 clay)
            food: 1,  // 2 + 1 (Meeting Place) - 2 (2 family members × 1 food)
            hand: [],
            minorImprovements: ['bottles'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Loom', () => {
      test('gives food during harvest based on sheep count (1 sheep = 1 food)', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 4,
            minorImprovements: ['loom'],
            animals: { sheep: 1 },
          },
          micah: { food: 4 },
          round: 3,
        })
        game.run()

        // Round 4: both players take non-interactive actions
        t.choose(game, 'Day Laborer')   // dennis: +2 food
        t.choose(game, 'Grain Seeds')   // micah: +1 grain
        t.choose(game, 'Forest (3)')    // dennis: +3 wood
        t.choose(game, 'Clay Pit (1)')  // micah: +1 clay

        // Harvest: loom gives 1 food (1 sheep). No breeding (1 sheep, no pair).
        // Feeding: 4 food required per player
        const dennis = t.player(game)
        const micah = t.player(game, 'micah')
        t.testBoard(game, {
          dennis: {
            food: 3,   // 4 + 2 (day laborer) + 1 (loom) - 4 (feeding)
            wood: 3,   // from Forest
            sheep: 1,  // no breeding
            minorImprovements: ['loom'],
            score: dennis.calculateScore(),
          },
          micah: {
            grain: 1,
            clay: 1,
            score: micah.calculateScore(),
          },
        })
      })

      test('gives 2 food for 4-6 sheep during harvest', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 4,
            minorImprovements: ['loom'],
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }], animals: { sheep: 5 } }],
            },
          },
          micah: { food: 4 },
          round: 3,
        })
        game.run()

        t.choose(game, 'Day Laborer')   // dennis: +2 food
        t.choose(game, 'Grain Seeds')   // micah
        t.choose(game, 'Forest (3)')    // dennis: +3 wood
        t.choose(game, 'Clay Pit (1)')  // micah

        // Harvest: loom gives 2 food (5 sheep). Breeding: +1 sheep (pair exists, 4-space pasture holds 8).
        const dennis = t.player(game)
        const micah = t.player(game, 'micah')
        t.testBoard(game, {
          dennis: {
            food: 4,   // 4 + 2 + 2 (loom) - 4 (feeding)
            wood: 3,
            sheep: 6,  // 5 + 1 bred
            minorImprovements: ['loom'],
            farmyard: { pastures: 1 },
            score: dennis.calculateScore(),
          },
          micah: {
            grain: 1,
            clay: 1,
            score: micah.calculateScore(),
          },
        })
      })

      test('gives end game points: 1 per 3 sheep', () => {
        const card = baseB.getCardById('loom')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }], animals: { sheep: 7 } },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        expect(card.getEndGamePoints(dennis)).toBe(2) // floor(7/3) = 2
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['loom'],
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }], animals: { sheep: 6 } },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const scoreWith = dennis.calculateScore()

        t.setPlayerCards(game, dennis, 'minorImprovements', [])
        const scoreWithout = dennis.calculateScore()

        // Loom: 1 vps + floor(6/3) = 3 total bonus points
        expect(scoreWith - scoreWithout).toBe(3)
      })
    })

    describe('Strawberry Patch', () => {
      test('schedules food on next 3 rounds via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'strawberry-patch',
          { cardSets: ['baseB'] },
          {
            dennis: {
              wood: 1, // cost: { wood: 1 }
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        // game.state.round is 2 during first work phase, schedules food for rounds 3, 4, 5
        expect(game.state.scheduledFood[dennis.name][3]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][5]).toBe(1)

        t.testBoard(game, {
          dennis: {
            food: 1, // +1 MP
            hand: [],
            minorImprovements: ['strawberry-patch'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Herring Pot', () => {
      test('schedules food on next 3 rounds on Fishing action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['herring-pot'],
          },
        })
        game.run()

        t.choose(game, 'Fishing (1)')

        const dennis = t.player(game)
        // game.state.round is 2 during first work phase, schedules food for rounds 3, 4, 5
        expect(game.state.scheduledFood[dennis.name][3]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][5]).toBe(1)

        t.testBoard(game, {
          dennis: {
            food: 1, // 1 accumulated from Fishing
            minorImprovements: ['herring-pot'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger on non-fishing actions', () => {
        const card = baseB.getCardById('herring-pot')
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 3

        card.onAction(game, dennis, 'take-wood')

        expect(game.state.scheduledFood).toBeUndefined()
      })
    })

    describe('Butter Churn', () => {
      test('gives food during harvest based on sheep and cattle', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 4,
            minorImprovements: ['butter-churn'],
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }], animals: { sheep: 6 } },
                { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], animals: { cattle: 3 } },
              ],
            },
          },
          micah: { food: 4 },
          round: 3,
        })
        game.run()

        // Round 4: both players take non-interactive actions
        t.choose(game, 'Day Laborer')   // dennis: +2 food
        t.choose(game, 'Grain Seeds')   // micah
        t.choose(game, 'Forest (3)')    // dennis: +3 wood
        t.choose(game, 'Clay Pit (1)')  // micah

        // Harvest field phase: butter-churn gives floor(6/3) + floor(3/2) = 2 + 1 = 3 food
        // Breeding: +1 sheep (6 → 7, pasture capacity 8), +1 cattle (3 → 4, pasture capacity 4)
        const dennis = t.player(game)
        const micah = t.player(game, 'micah')
        t.testBoard(game, {
          dennis: {
            food: 5,   // 4 + 2 (day laborer) + 3 (butter-churn) - 4 (feeding)
            wood: 3,
            sheep: 7,  // 6 + 1 bred
            cattle: 4, // 3 + 1 bred
            minorImprovements: ['butter-churn'],
            farmyard: { pastures: 2 },
            score: dennis.calculateScore(),
          },
          micah: {
            grain: 1,
            clay: 1,
            score: micah.calculateScore(),
          },
        })
      })

      test('gives no food with few animals', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 4,
            minorImprovements: ['butter-churn'],
            animals: { sheep: 1 },
          },
          micah: { food: 4 },
          round: 3,
        })
        game.run()

        t.choose(game, 'Day Laborer')   // dennis
        t.choose(game, 'Grain Seeds')   // micah
        t.choose(game, 'Forest (3)')    // dennis
        t.choose(game, 'Clay Pit (1)')  // micah

        // floor(1/3) + floor(0/2) = 0 food from butter-churn
        const dennis = t.player(game)
        const micah = t.player(game, 'micah')
        t.testBoard(game, {
          dennis: {
            food: 2,   // 4 + 2 (day laborer) + 0 (butter-churn) - 4 (feeding)
            wood: 3,
            sheep: 1,  // no breeding (only 1)
            minorImprovements: ['butter-churn'],
            score: dennis.calculateScore(),
          },
          micah: {
            grain: 1,
            clay: 1,
            score: micah.calculateScore(),
          },
        })
      })
    })

    describe('Brook', () => {
      test('triggers on Forest, Reed Bank, Clay Pit actions', () => {
        const card = baseB.getCardById('brook')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        card.onAction(game, dennis, 'take-wood')
        expect(dennis.food).toBe(1)

        card.onAction(game, dennis, 'take-reed')
        expect(dennis.food).toBe(2)

        card.onAction(game, dennis, 'take-clay')
        expect(dennis.food).toBe(3)
      })

      test('triggers on round 1 card', () => {
        const card = baseB.getCardById('brook')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        // Round 1 card (varies based on shuffle, but should trigger)
        const round1CardId = game.state.roundCardDeck[0].id
        card.onAction(game, dennis, round1CardId)
        expect(dennis.food).toBe(1)
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('brook')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        card.onAction(game, dennis, 'take-grain')
        expect(dennis.food).toBe(0)

        card.onAction(game, dennis, 'fishing')
        expect(dennis.food).toBe(0)

        card.onAction(game, dennis, 'build-room-stable')
        expect(dennis.food).toBe(0)
      })
    })

    describe('Scullery', () => {
      test('gives 1 food at round 2 start in wooden house', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['scullery'],
          },
        })
        game.run()

        // Round 1: both players take actions
        t.choose(game, 'Grain Seeds')   // dennis
        t.choose(game, 'Forest (3)')    // micah

        // Round 2 starts — onRoundStart fires, scullery gives 1 food (wood house)
        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        t.testBoard(game, {
          dennis: {
            food: 1, // from Scullery onRoundStart
            grain: 1, // from Grain Seeds
            minorImprovements: ['scullery'],
            score: dennis.calculateScore(),
          },
          micah: {
            wood: 3, // from Forest
            score: micah.calculateScore(),
          },
        })
      })

      test('does not give food if not wooden house', () => {
        const card = baseB.getCardById('scullery')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0
        dennis.roomType = 'clay'

        card.onRoundStart(game, dennis)
        expect(dennis.food).toBe(0)
      })
    })

    describe('Three-Field Rotation', () => {
      test('gives 3 food during harvest with grain, vegetable, and empty fields', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 4,
            minorImprovements: ['three-field-rotation'],
            farmyard: {
              fields: [
                { row: 2, col: 0, crop: 'grain', cropCount: 3 },
                { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
                { row: 2, col: 2 },  // empty field
              ],
            },
          },
          micah: { food: 4 },
          round: 3,
        })
        game.run()

        // Round 4: both players take non-interactive actions
        t.choose(game, 'Day Laborer')   // dennis: +2 food
        t.choose(game, 'Grain Seeds')   // micah
        t.choose(game, 'Forest (3)')    // dennis: +3 wood
        t.choose(game, 'Clay Pit (1)')  // micah

        // Harvest field phase: harvests 1 grain + 1 veg from fields.
        // After harvest: grain field (cropCount 2), veg field (cropCount 1), empty field.
        // Three-field-rotation: all 3 types present → 3 food.
        // Feeding: 4 food required.
        const dennis = t.player(game)
        const micah = t.player(game, 'micah')
        t.testBoard(game, {
          dennis: {
            food: 5,         // 4 + 2 (day laborer) + 3 (three-field-rotation) - 4 (feeding)
            grain: 1,        // harvested from field
            vegetables: 1,   // harvested from field
            wood: 3,         // from Forest
            minorImprovements: ['three-field-rotation'],
            farmyard: { fields: 3 },
            score: dennis.calculateScore(),
          },
          micah: {
            grain: 1,
            clay: 1,
            score: micah.calculateScore(),
          },
        })
      })

      test('gives no food without all three field types', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 4,
            minorImprovements: ['three-field-rotation'],
            farmyard: {
              fields: [
                { row: 2, col: 0, crop: 'grain', cropCount: 3 },
                { row: 2, col: 1 },  // empty field (no vegetable field)
              ],
            },
          },
          micah: { food: 4 },
          round: 3,
        })
        game.run()

        t.choose(game, 'Day Laborer')   // dennis
        t.choose(game, 'Grain Seeds')   // micah
        t.choose(game, 'Forest (3)')    // dennis
        t.choose(game, 'Clay Pit (1)')  // micah

        // No veg field → three-field-rotation gives 0 food
        const dennis = t.player(game)
        const micah = t.player(game, 'micah')
        t.testBoard(game, {
          dennis: {
            food: 2,    // 4 + 2 (day laborer) + 0 - 4 (feeding)
            grain: 1,   // harvested from field
            wood: 3,
            minorImprovements: ['three-field-rotation'],
            farmyard: { fields: 2 },
            score: dennis.calculateScore(),
          },
          micah: {
            grain: 1,
            clay: 1,
            score: micah.calculateScore(),
          },
        })
      })
    })

    describe('Pitchfork', () => {
      test('gives 3 food on Grain Seeds when Farmland is occupied by another player', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['pitchfork'],
          },
        })
        game.run()

        // Dennis takes Forest first (worker 1)
        t.choose(game, 'Forest (3)')
        // Micah takes Farmland (worker 1) — occupies it
        t.choose(game, 'Farmland')
        t.choose(game, game.waiting.selectors[0].choices[0]) // plow a space
        // Dennis takes Grain Seeds (worker 2) — Farmland is occupied by micah → Pitchfork triggers
        t.choose(game, 'Grain Seeds')

        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        t.testBoard(game, {
          dennis: {
            wood: 3, // from Forest
            grain: 1, // from Grain Seeds
            food: 3, // +3 from Pitchfork (Farmland occupied by micah)
            minorImprovements: ['pitchfork'],
            score: dennis.calculateScore(),
          },
          micah: {
            score: micah.calculateScore(),
            farmyard: { fields: 1 },
          },
        })
      })

      test('gives 3 food on take-grain when farmland is occupied', () => {
        const card = baseB.getCardById('pitchfork')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        // Set plow-field as occupied
        game.state.actionSpaces['plow-field'] = { occupiedBy: 'micah' }

        card.onAction(game, dennis, 'take-grain')
        expect(dennis.food).toBe(3)
      })

      test('gives no food on take-grain when farmland is not occupied', () => {
        const card = baseB.getCardById('pitchfork')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        game.state.actionSpaces['plow-field'] = { occupiedBy: null }

        card.onAction(game, dennis, 'take-grain')
        expect(dennis.food).toBe(0)
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('pitchfork')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        game.state.actionSpaces['plow-field'] = { occupiedBy: 'micah' }

        card.onAction(game, dennis, 'take-wood')
        expect(dennis.food).toBe(0)
      })
    })

    describe('Sack Cart', () => {
      test('schedules grain on rounds 5, 8, 11, 14 via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'sack-cart',
          { cardSets: ['baseB'] },
          {
            dennis: {
              wood: 2, // cost
              occupations: ['cottager', 'groom'], // prereqs: occupations >= 2
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        // game.state.round is 2 during first work phase, schedules grain on future rounds 5, 8, 11, 14
        expect(game.state.scheduledGrain[dennis.name][5]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][11]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][14]).toBe(1)

        t.testBoard(game, {
          dennis: {
            food: 1, // +1 MP
            hand: [],
            occupations: ['cottager', 'groom'],
            minorImprovements: ['sack-cart'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('only schedules future rounds', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 6

        const card = baseB.getCardById('sack-cart')
        card.onPlay(game, dennis)

        expect(game.state.scheduledGrain[dennis.name][5]).toBeUndefined()
        expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][11]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][14]).toBe(1)
      })
    })

    describe('Beanfield', () => {
      test('adds virtual field on play via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'beanfield',
          { cardSets: ['baseB'] },
          {
            dennis: {
              food: 1, // to cover cost: { food: 1 }
              occupations: ['cottager', 'groom'], // prereqs: occupations >= 2
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        expect(dennis.virtualFields).toHaveLength(1)
        expect(dennis.virtualFields[0]).toMatchObject({
          id: 'beanfield',
          cardId: 'beanfield',
          label: 'Beanfield',
          cropRestriction: 'vegetables',
          crop: null,
          cropCount: 0,
        })

        t.testBoard(game, {
          dennis: {
            food: 1, // setBoard food:1, +1 MP, -1 beanfield cost = 1
            hand: [],
            occupations: ['cottager', 'groom'],
            minorImprovements: ['beanfield'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('has providesVegetableField flag', () => {
        const card = baseB.getCardById('beanfield')
        expect(card.providesVegetableField).toBe(true)
        expect(card.vps).toBe(1)
      })
    })

    describe('Thick Forest', () => {
      test('schedules wood on remaining even rounds via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'thick-forest',
          { cardSets: ['baseB'] },
          {
            dennis: {},
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        // game.state.round is 2 during first work phase, schedules wood on even rounds > 2: 4, 6, 8, 10, 12, 14
        expect(game.state.scheduledWood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][10]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][12]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
        // Odd rounds should not have scheduled wood
        expect(game.state.scheduledWood[dennis.name][3]).toBeUndefined()

        t.testBoard(game, {
          dennis: {
            food: 1, // +1 MP
            hand: [],
            minorImprovements: ['thick-forest'],
            score: dennis.calculateScore(),
          },
        })

        // No cost for thick-forest
      })

      test('skips past rounds', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 9

        const card = baseB.getCardById('thick-forest')
        card.onPlay(game, dennis)

        expect(game.state.scheduledWood[dennis.name][4]).toBeUndefined()
        expect(game.state.scheduledWood[dennis.name][6]).toBeUndefined()
        expect(game.state.scheduledWood[dennis.name][8]).toBeUndefined()
        expect(game.state.scheduledWood[dennis.name][10]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][12]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
      })
    })

    describe('Loam Pit', () => {
      test('gives 3 clay on Day Laborer action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['loam-pit'],
          },
        })
        game.run()

        t.choose(game, 'Day Laborer')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            clay: 3, // +3 from Loam Pit
            food: 2, // +2 from Day Laborer
            minorImprovements: ['loam-pit'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('loam-pit')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.clay = 0

        card.onAction(game, dennis, 'take-wood')
        expect(dennis.clay).toBe(0)
      })
    })

    describe('Hard Porcelain', () => {
      test('can be played via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'hard-porcelain',
          {
            cardSets: ['baseB'],
          },
          {
            dennis: {
              clay: 1, // cost
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            clay: 0, // 1 - 1 cost
            food: 1, // +1 MP
            hand: [],
            minorImprovements: ['hard-porcelain'],
          },
        })
      })

      test('has anytime exchange flag', () => {
        const card = baseB.getCardById('hard-porcelain')
        expect(card.allowsAnytimeExchange).toBe(true)
        expect(card.exchangeRates).toEqual({ clay: 2, stone: 1 })
      })
    })

    describe('Acorns Basket', () => {
      test('schedules boar on next 2 rounds via Meeting Place', () => {
        const game = t.fixtureMinorImprovement(
          'acorns-basket',
          { cardSets: ['baseB'] },
          {
            dennis: {
              reed: 1, // cost: { reed: 1 }
              occupations: ['cottager', 'groom', 'greengrocer'], // prereqs: occupations >= 3
            },
          },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        // game.state.round is 2 during first work phase, schedules boar for rounds 3, 4
        expect(game.state.scheduledBoar[dennis.name][3]).toBe(1)
        expect(game.state.scheduledBoar[dennis.name][4]).toBe(1)

        t.testBoard(game, {
          dennis: {
            food: 1, // +1 MP
            hand: [],
            occupations: ['cottager', 'groom', 'greengrocer'],
            minorImprovements: ['acorns-basket'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not schedule past round 14', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 13

        const card = baseB.getCardById('acorns-basket')
        card.onPlay(game, dennis)

        expect(game.state.scheduledBoar[dennis.name][14]).toBe(1)
        expect(game.state.scheduledBoar[dennis.name][15]).toBeUndefined()
      })
    })
  })


  describe('Occupations', () => {

    describe('Cottager', () => {
      test('offers to build a room on Day Laborer', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            reed: 2,
            occupations: ['cottager'],
          },
        })
        game.run()

        t.choose(game, 'Day Laborer')
        t.choose(game, 'Build Room')
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2,
            occupations: ['cottager'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })

      test('offers to renovate on Day Laborer', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            clay: 2,
            reed: 1,
            occupations: ['cottager'],
          },
        })
        game.run()

        t.choose(game, 'Day Laborer')
        t.choose(game, 'Renovate')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2,
            roomType: 'clay',
            occupations: ['cottager'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('skips when player cannot afford either', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['cottager'],
          },
        })
        game.run()

        t.choose(game, 'Day Laborer')

        // No interaction offered — goes straight to next player
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2,
            occupations: ['cottager'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger on other actions', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            reed: 2,
            occupations: ['cottager'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')

        // No build/renovate interaction — cottager only fires on day-laborer
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 5,
            reed: 2,
            grain: 1,
            occupations: ['cottager'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Groom', () => {
      test('gives 1 wood on play', () => {
        const game = t.fixtureOccupation(
          'groom',
          { cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            wood: 1,
            occupations: ['groom'],
          },
        })
      })

      test('does not trigger at round start in non-stone house', () => {
        const card = baseB.getCardById('groom')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'wood'
        dennis.wood = 5

        const result = card.onRoundStart(game, dennis)
        expect(result).toBeUndefined()
      })

      test('does not trigger at round start without wood', () => {
        const card = baseB.getCardById('groom')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'stone'
        dennis.wood = 0

        const result = card.onRoundStart(game, dennis)
        expect(result).toBeUndefined()
      })

      test('offers stable for 1 wood at round start in stone house', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            roomType: 'stone',
            wood: 2,
            occupations: ['groom'],
          },
        })
        game.run()

        // Round 2 starts — Groom onRoundStart fires
        // Accept: build stable for 1 wood
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        expect(dennis.wood).toBe(1) // 2 - 1 paid for stable
        expect(dennis.getStableCount()).toBe(1)
      })
    })

    describe('Assistant Tiller', () => {
      test('plows a field on day-laborer action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['assistant-tiller'],
          },
        })
        game.run()

        // Dennis takes Day Laborer
        t.choose(game, 'Day Laborer')
        // Assistant Tiller triggers: select a space to plow
        t.choose(game, game.waiting.selectors[0].choices[0])

        t.testBoard(game, {
          dennis: {
            food: 2, // +2 from Day Laborer
            occupations: ['assistant-tiller'],
            farmyard: { fields: 1 },
            score: -13, // -14 base + 1 field
          },
        })
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('assistant-tiller')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })
    })

    describe('Master Bricklayer', () => {
      test('can be played via Lessons', () => {
        const game = t.fixtureOccupation(
          'master-bricklayer',
          { cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['master-bricklayer'],
          },
        })
      })

      test('reduces stone cost for major improvements by extra rooms built', () => {
        const card = baseB.getCardById('master-bricklayer')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            farmyard: { rooms: 4 },
          },
        })
        game.run()
        const dennis = t.player(game)

        // 4 rooms - 2 initial = 2 extra rooms
        const modified = card.modifyAnyCost(dennis, { stone: 5, clay: 2 }, 'major-improvement')
        expect(modified.stone).toBe(3) // 5 - 2 = 3
        expect(modified.clay).toBe(2) // unchanged
      })

      test('does not reduce below 0', () => {
        const card = baseB.getCardById('master-bricklayer')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            farmyard: { rooms: 5 },
          },
        })
        game.run()
        const dennis = t.player(game)

        // 5 rooms - 2 = 3 extra, but stone is only 2
        const modified = card.modifyAnyCost(dennis, { stone: 2 }, 'major-improvement')
        expect(modified.stone).toBe(0)
      })

      test('does not modify non-major-improvement costs', () => {
        const card = baseB.getCardById('master-bricklayer')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            farmyard: { rooms: 4 },
          },
        })
        game.run()
        const dennis = t.player(game)

        const cost = { stone: 5 }
        const modified = card.modifyAnyCost(dennis, cost, 'build-room')
        expect(modified).toEqual(cost)
      })

      test('reduces stone cost when buying major improvement with extra rooms', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            occupations: ['master-bricklayer'],
            farmyard: { rooms: 4 },
            // Joinery costs wood:2, stone:2. With 2 extra rooms, stone reduced by 2 → stone:0
            wood: 2,
            stone: 0,
          },
        })
        game.run()

        const dennis = t.player(game)
        // Should be able to afford Joinery (wood:2, stone:2) with 0 stone due to Master Bricklayer
        expect(dennis.canBuyMajorImprovement('joinery')).toBe(true)
      })
    })

    describe('Scholar', () => {
      test('triggers at round start in stone house', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'stone',
            occupations: ['scholar'],
          },
        })
        game.run()

        // Round 2 starts immediately (setBoard defaults round=1, mainLoop increments to 2)
        // Scholar triggers before work phase — offers play occupation or improvement
        const waiting = game.waiting
        expect(waiting).toBeDefined()
        expect(waiting.selectors[0].actor).toBe('dennis')
      })

      test('does not trigger in non-stone house', () => {
        const card = baseB.getCardById('scholar')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'clay'

        const result = card.onRoundStart(game, dennis)
        expect(result).toBeUndefined()
      })
    })

    describe('Organic Farmer', () => {
      test('gives points for pastures with animals and spare capacity', () => {
        const card = baseB.getCardById('organic-farmer')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }], animals: { sheep: 1 } },
                { spaces: [{ row: 2, col: 0 }], animals: { sheep: 1 } },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        // Mock getPastureCapacity
        const origGetPastureCapacity = dennis.getPastureCapacity
        dennis.getPastureCapacity = (pasture) => {
          return pasture.spaces.length * 2 // 2 per space
        }

        // Pasture 1: 3 spaces * 2 = 6 capacity, 1 animal, 5 spare >= 3 -> 1 point
        // Pasture 2: 1 space * 2 = 2 capacity, 1 animal, 1 spare < 3 -> 0 points
        expect(card.getEndGamePoints(dennis)).toBe(1)

        dennis.getPastureCapacity = origGetPastureCapacity
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['organic-farmer'],
            farmyard: {
              // Large pasture: 4 spaces × 2 capacity = 8, with 1 animal → 7 spare ≥ 3
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }], animals: { sheep: 1 } },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const scoreWith = dennis.calculateScore()

        t.setPlayerCards(game, dennis, 'occupations', [])
        const scoreWithout = dennis.calculateScore()

        // 1 qualifying pasture = 1 bonus point from Organic Farmer
        expect(scoreWith - scoreWithout).toBe(1)
      })
    })

    describe('Tutor', () => {
      test('records occupation count on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['wood-cutter', 'firewood-collector'],
            occupationsPlayed: 2,
            hand: ['tutor'],
          },
        })
        game.run()

        const dennis = t.player(game)
        t.playCard(game, 'dennis', 'tutor')

        // playCard increments occupationsPlayed before onPlay runs, so tutor itself is counted
        expect(dennis.tutorOccupationCount).toBe(3)
      })

      test('gives end game points for occupations after tutor', () => {
        const card = baseB.getCardById('tutor')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        dennis.tutorOccupationCount = 2
        dennis.occupationsPlayed = 5

        // 5 - 2 = 3 occupations after tutor
        expect(card.getEndGamePoints(dennis)).toBe(3)
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            occupations: ['tutor', 'consultant', 'greengrocer'],
            occupationsPlayed: 3,
          },
        })
        game.run()

        const dennis = t.player(game)
        // Tutor was played when 1 occupation existed → tutorOccupationCount = 1
        // Then 2 more occupations after Tutor → 2 bonus points
        dennis.tutorOccupationCount = 1

        const scoreWith = dennis.calculateScore()

        t.setPlayerCards(game, dennis, 'occupations', ['consultant', 'greengrocer'])
        const scoreWithout = dennis.calculateScore()

        // 3 occupationsPlayed - 1 tutorOccupationCount = 2 bonus points from Tutor
        expect(scoreWith - scoreWithout).toBe(2)
      })
    })

    describe('Consultant', () => {
      test('gives 3 clay in 2-player game', () => {
        const game = t.fixtureOccupation(
          'consultant',
          { cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            clay: 3,
            occupations: ['consultant'],
          },
        })
      })

      test('gives 2 reed in 3-player game', () => {
        const game = t.fixture({ numPlayers: 3 })
        t.setBoard(game, {
          dennis: {
            reed: 0,
            hand: ['consultant'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'consultant')
        const dennis = t.player(game)
        expect(dennis.reed).toBe(2)
      })

      test('gives 2 grain in 1-player game via Lessons', () => {
        const game = t.fixtureOccupation(
          'consultant',
          { numPlayers: 1, cardSets: ['baseB'] },
          { dennis: {} },
        )

        const dennis = t.player(game)
        expect(dennis.grain).toBe(2)
      })

      test('gives 2 sheep in 4-player game via Lessons', () => {
        const game = t.fixtureOccupation(
          'consultant',
          { numPlayers: 4, cardSets: ['baseB'] },
          {
            dennis: {
              farmyard: {
                pastures: [{ spaces: [{ row: 2, col: 0 }] }],
              },
            },
          },
        )

        const dennis = t.player(game)
        expect(dennis.getTotalAnimals('sheep')).toBe(2)
      })
    })

    describe('Sheep Walker', () => {
      test('can be played via Lessons', () => {
        const game = t.fixtureOccupation(
          'sheep-walker',
          { cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['sheep-walker'],
          },
        })
      })

      test('has anytime exchange options', () => {
        const card = baseB.getCardById('sheep-walker')
        expect(card.allowsAnytimeExchange).toBe(true)
        expect(card.exchangeOptions.from).toBe('sheep')
        expect(card.exchangeOptions.to).toEqual(['boar', 'vegetables', 'stone'])
      })
    })

    describe('Manservant', () => {
      test('schedules 3 food per remaining round when in stone house', () => {
        const card = baseB.getCardById('manservant')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'stone'
        game.state.round = 10

        card.checkTrigger(game, dennis)

        expect(dennis.manservantTriggered).toBe(true)
        expect(game.state.scheduledFood[dennis.name][11]).toBe(3)
        expect(game.state.scheduledFood[dennis.name][12]).toBe(3)
        expect(game.state.scheduledFood[dennis.name][13]).toBe(3)
        expect(game.state.scheduledFood[dennis.name][14]).toBe(3)
      })

      test('does not trigger in non-stone house', () => {
        const card = baseB.getCardById('manservant')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'clay'
        game.state.round = 10

        card.checkTrigger(game, dennis)

        expect(dennis.manservantTriggered).toBeUndefined()
        expect(game.state.scheduledFood).toBeUndefined()
      })

      test('only triggers once', () => {
        const card = baseB.getCardById('manservant')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'stone'
        game.state.round = 10

        card.checkTrigger(game, dennis)
        // Change round and trigger again
        game.state.round = 11
        card.checkTrigger(game, dennis)

        // Should still be 3 for rounds 11-14 (from first trigger)
        expect(game.state.scheduledFood[dennis.name][12]).toBe(3)
      })

      test('delivers food after renovation to stone via Cottager', () => {
        const game = t.fixture({ cardSets: ['baseA', 'baseB'] })
        t.setBoard(game, {
          dennis: {
            stone: 2,
            reed: 1,
            occupations: ['manservant', 'cottager', 'conservator'],
          },
        })
        game.run()

        // Round 2 (setBoard round=1, mainLoop increments to 2)
        // Dennis renovates wood→stone via Cottager + Conservator
        t.choose(game, 'Day Laborer')
        t.choose(game, 'Renovate')
        t.choose(game, 'Renovate to Stone')

        // Finish round 2: remaining 3 actions
        t.choose(game, 'Grain Seeds')   // micah worker 1
        t.choose(game, 'Forest (3)')    // dennis worker 2
        t.choose(game, 'Clay Pit (1)')  // micah worker 2

        // Round 2 end: checkTrigger fires — schedules 3 food per remaining round
        // Round 3 start: scheduled food delivered
        const dennis = t.player(game)
        expect(dennis.roomType).toBe('stone')
        expect(dennis.manservantTriggered).toBe(true)
        expect(dennis.food).toBe(5) // 2 (Day Laborer) + 3 (scheduled food for round 3)
      })
    })

    describe('Oven Firing Boy', () => {
      test('offers bake bread on Forest action and bakes grain into food', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 2,
            occupations: ['oven-firing-boy'],
            majorImprovements: ['fireplace-2'],
          },
        })
        game.run()

        t.choose(game, 'Forest (3)')

        // Oven Firing Boy triggers bake bread offer
        t.choose(game, 'Bake 2 grain')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 3,
            food: 4, // 2 grain × 2 food per grain (fireplace)
            occupations: ['oven-firing-boy'],
            majorImprovements: ['fireplace-2'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('can skip baking', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 1,
            occupations: ['oven-firing-boy'],
            majorImprovements: ['fireplace-2'],
          },
        })
        game.run()

        t.choose(game, 'Forest (3)')
        t.choose(game, 'Do not bake')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 3,
            grain: 1,
            occupations: ['oven-firing-boy'],
            majorImprovements: ['fireplace-2'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger without baking improvement', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 2,
            occupations: ['oven-firing-boy'],
          },
        })
        game.run()

        t.choose(game, 'Forest (3)')

        // No bake interaction — goes straight to next player
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 3,
            grain: 2,
            occupations: ['oven-firing-boy'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger on non-wood actions', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 2,
            occupations: ['oven-firing-boy'],
            majorImprovements: ['fireplace-2'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')

        // No bake interaction
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            grain: 3,
            occupations: ['oven-firing-boy'],
            majorImprovements: ['fireplace-2'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Paper Maker', () => {
      test('offers wood-for-food exchange when playing a second occupation', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            wood: 3,
            food: 1, // cost for second occupation
            hand: ['groom'],
            occupations: ['paper-maker'],
            occupationsPlayed: 1,
          },
        })
        game.run()

        t.choose(game, 'Lessons A')
        t.choose(game, 'Groom')

        // Paper Maker triggers: pay 1 wood for 2 food (2 occupations played)
        t.choose(game, 'Pay 1 wood for 2 food')

        // Groom's onPlay offers wood or grain choice
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: dennis.wood,
            food: dennis.food,
            occupations: ['paper-maker', 'groom'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger without wood', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            food: 1,
            hand: ['groom'],
            occupations: ['paper-maker'],
            occupationsPlayed: 1,
          },
        })
        game.run()

        t.choose(game, 'Lessons A')
        t.choose(game, 'Groom')

        // Paper Maker does not trigger (no wood), goes to Groom's onPlay
        // Groom offers wood or grain
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: dennis.wood,
            food: dennis.food,
            occupations: ['paper-maker', 'groom'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Childless', () => {
      test('gives food and choice at round start with 3 rooms and 2 people', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['childless'],
            farmyard: { rooms: 3 },
          },
        })
        game.run()

        // Round 2 starts immediately (setBoard defaults round=1, mainLoop increments to 2)
        // Childless triggers before work phase — offers grain or vegetable choice
        const waiting = game.waiting
        expect(waiting).toBeDefined()
        expect(waiting.selectors[0].actor).toBe('dennis')
        // Choose grain
        t.choose(game, waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        // Childless gives 1 food + 1 of the chosen resource
        expect(dennis.food).toBeGreaterThanOrEqual(1)
      })

      test('does not trigger with fewer than 3 rooms', () => {
        const card = baseB.getCardById('childless')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0
        // Default 2 rooms, 2 family members

        const result = card.onRoundStart(game, dennis)
        expect(result).toBeUndefined()
        expect(dennis.food).toBe(0)
      })

      test('does not trigger with more than 2 people', () => {
        const card = baseB.getCardById('childless')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            familyMembers: 3,
            farmyard: { rooms: 3 },
          },
        })
        game.run()

        const dennis = t.player(game)
        const result = card.onRoundStart(game, dennis)
        expect(result).toBeUndefined()
        expect(dennis.food).toBe(0)
      })
    })

    describe('Small-scale Farmer', () => {
      test('gives 1 wood at round 2 start', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['small-scale-farmer'],
          },
        })
        game.run()

        // Round 1: both players take actions
        t.choose(game, 'Grain Seeds')   // dennis
        t.choose(game, 'Forest (3)')    // micah

        // Round 2 starts — onRoundStart fires, small-scale-farmer gives 1 wood
        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        t.testBoard(game, {
          dennis: {
            wood: 1, // from small-scale-farmer onRoundStart
            grain: 1, // from Grain Seeds
            occupations: ['small-scale-farmer'],
            score: dennis.calculateScore(),
          },
          micah: {
            wood: 3, // from Forest
            score: micah.calculateScore(),
          },
        })
      })

      test('does not give wood with more than 2 rooms', () => {
        const card = baseB.getCardById('small-scale-farmer')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            farmyard: { rooms: 3 },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onRoundStart(game, dennis)
        expect(dennis.wood).toBe(0)
      })
    })

    describe('Geologist', () => {
      test('gives 1 clay on Forest action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['geologist'],
          },
        })
        game.run()

        t.choose(game, 'Forest (3)')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 3, // from Forest
            clay: 1, // +1 from Geologist
            occupations: ['geologist'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('also triggers on Clay Pit in 3+ player games', () => {
        const card = baseB.getCardById('geologist')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.clay = 0

        card.onAction(game, dennis, 'take-clay')
        expect(dennis.clay).toBe(1)
      })

      test('does not trigger on Clay Pit in 2-player games', () => {
        const card = baseB.getCardById('geologist')
        const game = t.fixture({ numPlayers: 2 })
        game.run()
        const dennis = t.player(game)
        dennis.clay = 0

        card.onAction(game, dennis, 'take-clay')
        expect(dennis.clay).toBe(0)
      })
    })

    describe('Roof Ballaster', () => {
      test('triggers on play when player has food', () => {
        const card = baseB.getCardById('roof-ballaster')
        expect(card.onPlay).toBeDefined()
      })

      test('does not offer exchange without food', () => {
        const card = baseB.getCardById('roof-ballaster')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        const result = card.onPlay(game, dennis)
        expect(result).toBeUndefined()
      })

      test('pays 1 food for stone equal to room count via Lessons', () => {
        const game = t.fixtureOccupation(
          'roof-ballaster',
          { cardSets: ['baseB'] },
          { dennis: { food: 1 } },
        )

        // onPlay fires: pay 1 food for 2 stone (2 rooms)
        t.choose(game, 'Pay 1 food for 2 stone')

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 0,  // 1 - 1 paid for stone
            stone: 2, // 2 rooms × 1 stone
            occupations: ['roof-ballaster'],
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Carpenter', () => {
      test('can be played via Lessons', () => {
        const game = t.fixtureOccupation(
          'carpenter',
          { cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['carpenter'],
          },
        })
      })

      test('reduces room cost to 3 material + 2 reed', () => {
        const card = baseB.getCardById('carpenter')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        dennis.roomType = 'wood'
        expect(card.modifyBuildCost(dennis, { wood: 5, reed: 2 }, 'build-room'))
          .toEqual({ wood: 3, reed: 2 })

        dennis.roomType = 'clay'
        expect(card.modifyBuildCost(dennis, { clay: 5, reed: 2 }, 'build-room'))
          .toEqual({ clay: 3, reed: 2 })

        dennis.roomType = 'stone'
        expect(card.modifyBuildCost(dennis, { stone: 5, reed: 2 }, 'build-room'))
          .toEqual({ stone: 3, reed: 2 })
      })

      test('does not modify non-build-room costs', () => {
        const card = baseB.getCardById('carpenter')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'wood'

        const cost = { wood: 5, reed: 2 }
        expect(card.modifyBuildCost(dennis, cost, 'renovate')).toEqual(cost)
      })

      test('reduces room cost to 3 wood + 2 reed when building via Farm Expansion', () => {
        const game = t.fixture({ cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            wood: 3,
            reed: 2,
            occupations: ['carpenter'],
          },
        })
        game.run()

        t.choose(game, 'Farm Expansion')
        t.choose(game, 'Build Room')
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 0,  // 3 - 3 (modified cost)
            reed: 0,  // 2 - 2 (modified cost)
            occupations: ['carpenter'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('House Steward', () => {
      test('gives wood based on rounds left', () => {
        const game = t.fixtureOccupation(
          'house-steward',
          { numPlayers: 3, cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 4, // 14 - 1 = 13 rounds left -> 4 wood
            occupations: ['house-steward'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('gives 1 wood with 1 round left', () => {
        const card = baseB.getCardById('house-steward')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0

        game.state.round = 13
        card.onPlay(game, dennis)
        expect(dennis.wood).toBe(1)
      })

      test('gives 2 wood with 3-5 rounds left', () => {
        const card = baseB.getCardById('house-steward')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0

        game.state.round = 11 // 3 rounds left
        card.onPlay(game, dennis)
        expect(dennis.wood).toBe(2)
      })

      test('gives 3 wood with 6-8 rounds left', () => {
        const card = baseB.getCardById('house-steward')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0

        game.state.round = 8 // 6 rounds left
        card.onPlay(game, dennis)
        expect(dennis.wood).toBe(3)
      })

      test('has 3+ player requirement', () => {
        const card = baseB.getCardById('house-steward')
        expect(card.players).toBe('3+')
      })

      test('bonus points included in calculateScore', () => {
        const game = t.fixture({ numPlayers: 3 })
        t.setBoard(game, {
          dennis: {
            occupations: ['house-steward'],
            farmyard: { rooms: 3 },
          },
          micah: {
            farmyard: { rooms: 2 },
          },
        })
        game.run()

        const dennis = t.player(game)
        const scoreWith = dennis.calculateScore()

        t.setPlayerCards(game, dennis, 'occupations', [])
        const scoreWithout = dennis.calculateScore()

        // Dennis has 3 rooms (most) = 3 bonus points from House Steward
        expect(scoreWith - scoreWithout).toBe(3)
      })
    })

    describe('Greengrocer', () => {
      test('gives 1 vegetable on Grain Seeds action', () => {
        const game = t.fixture({ numPlayers: 3 })
        t.setBoard(game, {
          dennis: {
            occupations: ['greengrocer'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            vegetables: 1, // +1 from Greengrocer
            grain: 1, // from Grain Seeds
            occupations: ['greengrocer'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('greengrocer')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.vegetables = 0

        card.onAction(game, dennis, 'take-wood')
        expect(dennis.vegetables).toBe(0)
      })
    })

    describe('Brushwood Collector', () => {
      test('can be played via Lessons', () => {
        const game = t.fixtureOccupation(
          'brushwood-collector',
          { numPlayers: 3, cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['brushwood-collector'],
          },
        })
      })

      test('replaces reed with wood for build-room', () => {
        const card = baseB.getCardById('brushwood-collector')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)

        const modified = card.modifyBuildCost(dennis, { wood: 5, reed: 2 }, 'build-room')
        expect(modified.reed).toBe(0)
        expect(modified.wood).toBe(6) // 5 + 1
      })

      test('replaces reed with wood for renovate', () => {
        const card = baseB.getCardById('brushwood-collector')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)

        const modified = card.modifyBuildCost(dennis, { clay: 1, reed: 1 }, 'renovate')
        expect(modified.reed).toBe(0)
        expect(modified.wood).toBe(1)
        expect(modified.clay).toBe(1)
      })

      test('does not modify other action costs', () => {
        const card = baseB.getCardById('brushwood-collector')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)

        const cost = { wood: 2 }
        const modified = card.modifyBuildCost(dennis, cost, 'stable')
        expect(modified).toEqual(cost)
      })

      test('replaces reed with 1 wood when building room via Farm Expansion', () => {
        const game = t.fixture({ numPlayers: 3, cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            wood: 6,  // 5 + 1 (replaces 2 reed)
            reed: 0,  // no reed needed
            occupations: ['brushwood-collector'],
          },
        })
        game.run()

        t.choose(game, 'Farm Expansion')
        t.choose(game, 'Build Room')
        t.choose(game, game.waiting.selectors[0].choices[0])

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            wood: 0,  // 6 - 6 (5 wood + 1 replacing reed)
            reed: 0,
            occupations: ['brushwood-collector'],
            farmyard: { rooms: 3 },
            score: dennis.calculateScore(),
          },
        })
      })
    })

    describe('Storehouse Keeper', () => {
      test('gives extra resource on resource-market action', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            clay: 0,
            grain: 0,
            occupations: ['storehouse-keeper'],
          },
        })
        game.run()

        // Dennis takes Resource Market
        t.choose(game, 'Resource Market')
        // Resource Market gives base resources, then Storehouse Keeper triggers
        // Choose reed or stone from resource market base effect
        t.choose(game, game.waiting.selectors[0].choices[0])
        // Storehouse Keeper: choose clay or grain
        t.choose(game, 'Take 1 clay')

        t.testBoard(game, {
          dennis: {
            food: 1, // from Resource Market base
            reed: 1, // from Resource Market base
            clay: 1, // from Storehouse Keeper choice
            occupations: ['storehouse-keeper'],
          },
        })
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('storehouse-keeper')
        const game = t.fixture({ numPlayers: 4 })
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })

      test('has 4+ player requirement', () => {
        const card = baseB.getCardById('storehouse-keeper')
        expect(card.players).toBe('4+')
      })
    })

    describe('Pastor', () => {
      test('gives resources when only player with 2 rooms', () => {
        const card = baseB.getCardById('pastor')
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          micah: {
            farmyard: { rooms: 3 },
          },
          scott: {
            farmyard: { rooms: 3 },
          },
          eliya: {
            farmyard: { rooms: 3 },
          },
        })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 0
        dennis.clay = 0
        dennis.reed = 0
        dennis.stone = 0

        // Dennis has 2 rooms (default), everyone else has 3
        card.checkTrigger(game, dennis)

        expect(dennis.pastorTriggered).toBe(true)
        expect(dennis.wood).toBe(3)
        expect(dennis.clay).toBe(2)
        expect(dennis.reed).toBe(1)
        expect(dennis.stone).toBe(1)
      })

      test('does not trigger if another player also has 2 rooms', () => {
        const card = baseB.getCardById('pastor')
        const game = t.fixture({ numPlayers: 4 })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 0
        // Both dennis and micah have 2 rooms (default)

        card.checkTrigger(game, dennis)

        expect(dennis.pastorTriggered).toBeUndefined()
        expect(dennis.wood).toBe(0)
      })

      test('only triggers once', () => {
        const card = baseB.getCardById('pastor')
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          micah: { farmyard: { rooms: 3 } },
          scott: { farmyard: { rooms: 3 } },
          eliya: { farmyard: { rooms: 3 } },
        })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 0

        card.checkTrigger(game, dennis)
        expect(dennis.wood).toBe(3)

        dennis.wood = 0
        card.checkTrigger(game, dennis)
        expect(dennis.wood).toBe(0) // Already triggered
      })

      test('delivers resources via e2e when only player with 2 rooms', () => {
        const game = t.fixture({ numPlayers: 4, cardSets: ['baseB'] })
        t.setBoard(game, {
          dennis: {
            hand: ['pastor'],
            wood: 0,
            clay: 0,
            reed: 0,
            stone: 0,
          },
          micah: { farmyard: { rooms: 3 } },
          scott: { farmyard: { rooms: 3 } },
          eliya: { farmyard: { rooms: 3 } },
        })
        game.run()

        // Round: 8 actions (4 players × 2 workers)
        t.choose(game, 'Lessons A')              // dennis — play Pastor
        t.choose(game, 'Pastor')
        t.choose(game, 'Grain Seeds')           // micah
        t.choose(game, 'Forest (3)')            // scott
        t.choose(game, 'Clay Pit (1)')          // eliya
        t.choose(game, 'Day Laborer')           // dennis
        t.choose(game, 'Fishing (1)')           // micah
        t.choose(game, 'Traveling Players (1)') // scott
        t.choose(game, 'Copse (1)')             // eliya

        // checkTrigger fires at round end — dennis is only player with 2 rooms
        const dennis = t.player(game)
        expect(dennis.pastorTriggered).toBe(true)
        expect(dennis.wood).toBe(3)
        expect(dennis.clay).toBe(2)
        expect(dennis.reed).toBe(1)
        expect(dennis.stone).toBe(1)
      })
    })

    describe('Sheep Whisperer', () => {
      test('schedules sheep on play', () => {
        const game = t.fixtureOccupation(
          'sheep-whisperer',
          { numPlayers: 4, cardSets: ['baseB'] },
          { dennis: {} },
        )

        t.testIsSecondPlayer(game, 'Choose an action')
        t.testBoard(game, {
          dennis: {
            occupations: ['sheep-whisperer'],
          },
        })

        const dennis = t.player(game)
        expect(dennis.name in game.state.scheduledSheep).toBe(true)
      })

      test('does not schedule past round 14', () => {
        const game = t.fixture({ numPlayers: 4 })
        game.run()

        const dennis = t.player(game)
        game.state.round = 8

        const card = baseB.getCardById('sheep-whisperer')
        card.onPlay(game, dennis)

        expect(game.state.scheduledSheep[dennis.name][10]).toBe(1) // 8+2
        expect(game.state.scheduledSheep[dennis.name][13]).toBe(1) // 8+5
        // 8+8=16 and 8+10=18 are past round 14
        expect(game.state.scheduledSheep[dennis.name][16]).toBeUndefined()
        expect(game.state.scheduledSheep[dennis.name][18]).toBeUndefined()
      })
    })

    describe('Cattle Feeder', () => {
      test('buys cattle for 1 food on Grain Seeds action', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            food: 3,
            occupations: ['cattle-feeder'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')
        t.choose(game, 'Buy 1 cattle for 1 food')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 2,
            grain: 1,
            cattle: 1,
            occupations: ['cattle-feeder'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('can skip buying cattle', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            food: 3,
            occupations: ['cattle-feeder'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')
        t.choose(game, 'Skip')

        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 3,
            grain: 1,
            occupations: ['cattle-feeder'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger without food', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            occupations: ['cattle-feeder'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')

        // No buy interaction — goes straight to next player
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            grain: 1,
            occupations: ['cattle-feeder'],
            score: dennis.calculateScore(),
          },
        })
      })

      test('does not trigger on other actions', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            food: 3,
            occupations: ['cattle-feeder'],
          },
        })
        game.run()

        t.choose(game, 'Forest (3)')

        // No buy interaction
        const dennis = t.player(game)
        t.testBoard(game, {
          dennis: {
            food: 3,
            wood: 3,
            occupations: ['cattle-feeder'],
            score: dennis.calculateScore(),
          },
        })
      })
    })
  })
})
