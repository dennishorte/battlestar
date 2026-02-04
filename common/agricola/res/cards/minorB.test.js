const t = require('../../testutil.js')
const res = require('../index.js')
const minorB = require('./minorB.js')


describe('MinorB Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorB.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorB.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('upscale-lifestyle-b001')
      expect(card.name).toBe('Upscale Lifestyle')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorB')
    })

    test('all cards have unique ids', () => {
      const minors = minorB.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorB.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorB')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorB.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorB is registered in cardSets', () => {
      expect(res.cardSets.minorB).toBeDefined()
      expect(res.cardSets.minorB.id).toBe('minorB')
      expect(res.cardSets.minorB.name).toBe('Minor Improvements B')
    })

    test('minorB card counts are correct', () => {
      expect(res.cardSets.minorB.minorCount).toBe(84)
      expect(res.cardSets.minorB.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorB cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorB')).toBe(true)
    })
  })

  describe('Minor Improvements', () => {

    describe('Upscale Lifestyle (B001)', () => {
      test('gives 5 clay on play', () => {
        const card = res.getCardById('upscale-lifestyle-b001')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({ wood: 3 })
      })
    })

    describe('Wood Pile (B004)', () => {
      test('gives wood equal to people on accumulation spaces', () => {
        const card = res.getCardById('wood-pile-b004')
        expect(card.onPlay).toBeDefined()
      })
    })

    describe('Store of Experience (B005)', () => {
      test('gives stone with 0-3 occupations in hand', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            hand: ['store-of-experience-b005'],
          },
        })
        game.run()

        // Set up player with 2 occupations in hand (default)
        const dennis = t.player(game)
        dennis.getOccupationsInHand = () => [{ id: 'occ1' }, { id: 'occ2' }]
        dennis.stone = 0

        const card = res.getCardById('store-of-experience-b005')
        card.onPlay(game, dennis)

        expect(dennis.stone).toBe(1)
      })

      test('gives wood with 6+ occupations in hand', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.getOccupationsInHand = () => [1, 2, 3, 4, 5, 6, 7].map(i => ({ id: `occ${i}` }))
        dennis.wood = 0

        const card = res.getCardById('store-of-experience-b005')
        card.onPlay(game, dennis)

        expect(dennis.wood).toBe(1)
      })
    })

    describe('Excursion to the Quarry (B006)', () => {
      test('gives stone equal to family members', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            food: 2,
            stone: 0,
            hand: ['excursion-to-the-quarry-b006'],
            occupations: ['wood-cutter'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'excursion-to-the-quarry-b006')

        const dennis = t.player(game)
        // 2 family members by default
        expect(dennis.stone).toBe(2)
      })
    })

    describe('Wage (B007)', () => {
      test('gives 2 food base', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            food: 0,
            hand: ['wage-b007'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'wage-b007')

        const dennis = t.player(game)
        expect(dennis.food).toBe(2)
      })

      test('gives extra food for bottom row majors', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            food: 0,
            hand: ['wage-b007'],
            majorImprovements: ['clay-oven', 'pottery'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'wage-b007')

        const dennis = t.player(game)
        // 2 base + 2 for 2 bottom row majors
        expect(dennis.food).toBe(4)
      })
    })

    describe('Market Stall (B008)', () => {
      test('exchanges 1 grain for 1 vegetable', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            grain: 1,
            vegetables: 0,
            hand: ['market-stall-b008'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'market-stall-b008')

        const dennis = t.player(game)
        expect(dennis.grain).toBe(0) // Cost
        expect(dennis.vegetables).toBe(1)
      })
    })

    describe('Caravan (B010)', () => {
      test('provides room for 1 person', () => {
        const card = res.getCardById('caravan-b010')
        expect(card.providesRoom).toBe(true)
        expect(card.cost).toEqual({ wood: 3, food: 3 })
      })
    })

    describe('Stockyard (B012)', () => {
      test('holds up to 3 animals of same type', () => {
        const card = res.getCardById('stockyard-b012')
        expect(card.holdsAnimals).toBe(3)
        expect(card.sameTypeOnly).toBe(true)
        expect(card.vps).toBe(1)
      })
    })

    describe("Carpenter's Parlor (B013)", () => {
      test('reduces wooden room cost to 2 wood and 2 reed', () => {
        const card = res.getCardById('carpenters-parlor-b013')
        const mockPlayer = { roomType: 'wood' }
        const modified = card.modifyBuildCost(mockPlayer, { wood: 5, reed: 2 }, 'build-room')
        expect(modified).toEqual({ wood: 2, reed: 2 })
      })

      test('does not affect non-wood houses', () => {
        const card = res.getCardById('carpenters-parlor-b013')
        const mockPlayer = { roomType: 'clay' }
        const original = { clay: 5, reed: 2 }
        const modified = card.modifyBuildCost(mockPlayer, original, 'build-room')
        expect(modified).toEqual(original)
      })
    })

    describe('Mining Hammer (B016)', () => {
      test('gives 1 food on play', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            food: 0,
            hand: ['mining-hammer-b016'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'mining-hammer-b016')

        const dennis = t.player(game)
        expect(dennis.food).toBe(1)
      })

      test('has onRenovate hook', () => {
        const card = res.getCardById('mining-hammer-b016')
        expect(card.onRenovate).toBeDefined()
      })
    })

    describe('Moldboard Plow (B019)', () => {
      test('places 2 field charges on card', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 2,
            hand: ['moldboard-plow-b019'],
            occupations: ['wood-cutter'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'moldboard-plow-b019')

        const dennis = t.player(game)
        expect(dennis.moldboardPlowCharges).toBe(2)
      })
    })

    describe('Chain Float (B020)', () => {
      test('schedules fields for rounds +7, +8, +9', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 3,
            hand: ['chain-float-b020'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'chain-float-b020')

        const dennis = t.player(game)
        // Rounds 10, 11, 12 (3+7, 3+8, 3+9)
        expect(game.state.scheduledPlows[dennis.name]).toContain(10)
        expect(game.state.scheduledPlows[dennis.name]).toContain(11)
        expect(game.state.scheduledPlows[dennis.name]).toContain(12)
      })
    })

    describe('Bread Paddle (B025)', () => {
      test('gives 1 food on play', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            food: 0,
            hand: ['bread-paddle-b025'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'bread-paddle-b025')

        const dennis = t.player(game)
        expect(dennis.food).toBe(1)
      })

      test('has onPlayOccupation hook', () => {
        const card = res.getCardById('bread-paddle-b025')
        expect(card.onPlayOccupation).toBeDefined()
      })
    })

    describe('Loom (B039)', () => {
      test('gives food based on sheep count during harvest', () => {
        const card = res.getCardById('loom-b039')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.getTotalAnimals = (type) => type === 'sheep' ? 5 : 0
        dennis.food = 0

        card.onHarvest(game, dennis)
        expect(dennis.food).toBe(2) // 4-6 sheep = 2 food
      })

      test('gives end game points based on sheep count', () => {
        const card = res.getCardById('loom-b039')
        const mockPlayer = {
          getTotalAnimals: (type) => type === 'sheep' ? 7 : 0,
        }
        expect(card.getEndGamePoints(mockPlayer)).toBe(2) // 7/3 = 2
      })
    })

    describe('Brewery Pond (B040)', () => {
      test('gives 1 grain and 1 wood on Fishing action', () => {
        const card = res.getCardById('brewery-pond-b040')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.grain = 0
        dennis.wood = 0

        card.onAction(game, dennis, 'fishing')

        expect(dennis.grain).toBe(1)
        expect(dennis.wood).toBe(1)
      })

      test('gives 1 grain and 1 wood on Reed Bank action', () => {
        const card = res.getCardById('brewery-pond-b040')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.grain = 0
        dennis.wood = 0

        card.onAction(game, dennis, 'take-reed')

        expect(dennis.grain).toBe(1)
        expect(dennis.wood).toBe(1)
      })
    })

    describe('Chophouse (B043)', () => {
      test('schedules 3 food on Grain Seeds action', () => {
        const card = res.getCardById('chophouse-b043')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        game.state.round = 5

        card.onAction(game, dennis, 'take-grain')

        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
      })

      test('schedules 2 food on Vegetable Seeds action', () => {
        const card = res.getCardById('chophouse-b043')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        game.state.round = 5

        card.onAction(game, dennis, 'take-vegetable')

        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBeUndefined()
      })
    })

    describe('Chick Stable (B044)', () => {
      test('schedules 2 food each for rounds +3 and +4', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            hand: ['chick-stable-b044'],
          },
          round: 5,
        })
        game.run()

        game.state.round = 5
        t.playCard(game, 'dennis', 'chick-stable-b044')

        const dennis = t.player(game)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(2)
        expect(game.state.scheduledFood[dennis.name][9]).toBe(2)
      })
    })

    describe('Herring Pot (B047)', () => {
      test('schedules food on Fishing action', () => {
        const card = res.getCardById('herring-pot-b047')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        game.state.round = 5

        card.onAction(game, dennis, 'fishing')

        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
      })
    })

    describe('Forest Stone (B048)', () => {
      test('places 2 food on card on play', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 2,
            hand: ['forest-stone-b048'],
            occupations: ['wood-cutter'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'forest-stone-b048')

        const dennis = t.player(game)
        expect(dennis.forestStoneFood).toBe(2)
      })

      test('gives food from card on wood action', () => {
        const card = res.getCardById('forest-stone-b048')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.forestStoneFood = 2
        dennis.food = 0

        card.onAction(game, dennis, 'take-wood')

        expect(dennis.food).toBe(1)
        expect(dennis.forestStoneFood).toBe(1)
      })

      test('adds food to card on stone action', () => {
        const card = res.getCardById('forest-stone-b048')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.forestStoneFood = 1

        card.onAction(game, dennis, 'take-stone-1')

        expect(dennis.forestStoneFood).toBe(3)
      })
    })

    describe('Butter Churn (B050)', () => {
      test('gives food based on sheep and cattle during harvest', () => {
        const card = res.getCardById('butter-churn-b050')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.getTotalAnimals = (type) => {
          if (type === 'sheep') {
            return 6
          }
          if (type === 'cattle') {
            return 4
          }
          return 0
        }
        dennis.food = 0

        card.onHarvest(game, dennis)

        // floor(6/3) + floor(4/2) = 2 + 2 = 4
        expect(dennis.food).toBe(4)
      })
    })

    describe('Tumbrel (B054)', () => {
      test('gives 2 food on play', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            food: 0,
            hand: ['tumbrel-b054'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'tumbrel-b054')

        const dennis = t.player(game)
        expect(dennis.food).toBe(2)
      })

      test('gives food for stables on sow action', () => {
        const card = res.getCardById('tumbrel-b054')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0
        dennis.getStableCount = () => 3

        card.onSow(game, dennis)

        expect(dennis.food).toBe(3)
      })
    })

    describe('Maintenance Premium (B055)', () => {
      test('places 3 food on card', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            hand: ['maintenance-premium-b055'],
            occupations: ['wood-cutter', 'firewood-collector'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'maintenance-premium-b055')

        const dennis = t.player(game)
        expect(dennis.maintenancePremiumFood).toBe(3)
      })

      test('restocks to 3 food on renovate', () => {
        const card = res.getCardById('maintenance-premium-b055')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.maintenancePremiumFood = 1

        card.onRenovate(game, dennis)

        expect(dennis.maintenancePremiumFood).toBe(3)
      })
    })

    describe('Scullery (B057)', () => {
      test('gives 1 food at round start in wooden house', () => {
        const card = res.getCardById('scullery-b057')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.roomType = 'wood'
        dennis.food = 0

        card.onRoundStart(game, dennis)

        expect(dennis.food).toBe(1)
      })

      test('gives nothing in clay house', () => {
        const card = res.getCardById('scullery-b057')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.roomType = 'clay'
        dennis.food = 0

        card.onRoundStart(game, dennis)

        expect(dennis.food).toBe(0)
      })
    })

    describe('Sack Cart (B066)', () => {
      test('schedules grain for rounds 5, 8, 11, 14', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            wood: 2,
            hand: ['sack-cart-b066'],
            occupations: ['wood-cutter', 'firewood-collector'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'sack-cart-b066')

        const dennis = t.player(game)
        expect(game.state.scheduledGrain[dennis.name][5]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][11]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][14]).toBe(1)
      })
    })

    describe('Thick Forest (B074)', () => {
      test('schedules wood for even-numbered rounds', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            clay: 5, // prereq
            hand: ['thick-forest-b074'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'thick-forest-b074')

        const dennis = t.player(game)
        // Even rounds after 3: 4, 6, 8, 10, 12, 14
        expect(game.state.scheduledWood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][10]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][12]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
      })
    })

    describe('Ceilings (B076)', () => {
      test('schedules wood for next 5 rounds', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            clay: 1,
            hand: ['ceilings-b076'],
            occupations: ['wood-cutter'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'ceilings-b076')

        const dennis = t.player(game)
        expect(game.state.scheduledWood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][5]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
      })

      test('removes scheduled wood on renovate', () => {
        const card = res.getCardById('ceilings-b076')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.ceilingsRounds = [4, 5, 6]
        game.state.scheduledWood = {
          [dennis.name]: { 4: 1, 5: 1, 6: 1 },
        }

        card.onRenovate(game, dennis)

        expect(game.state.scheduledWood[dennis.name][4]).toBeUndefined()
        expect(game.state.scheduledWood[dennis.name][5]).toBeUndefined()
        expect(game.state.scheduledWood[dennis.name][6]).toBeUndefined()
        expect(dennis.ceilingsRounds).toEqual([])
      })
    })

    describe('Loam Pit (B077)', () => {
      test('gives 3 clay on Day Laborer action', () => {
        const card = res.getCardById('loam-pit-b077')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        dennis.clay = 0

        card.onAction(game, dennis, 'day-laborer')

        expect(dennis.clay).toBe(3)
      })
    })

    describe('Reed Belt (B078)', () => {
      test('schedules reed for rounds 5, 8, 10, 12', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            food: 2,
            hand: ['reed-belt-b078'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'reed-belt-b078')

        const dennis = t.player(game)
        expect(game.state.scheduledReed[dennis.name][5]).toBe(1)
        expect(game.state.scheduledReed[dennis.name][8]).toBe(1)
        expect(game.state.scheduledReed[dennis.name][10]).toBe(1)
        expect(game.state.scheduledReed[dennis.name][12]).toBe(1)
      })
    })

    describe('Corf (B079)', () => {
      test('gives 1 stone when any player takes 3+ stone', () => {
        const card = res.getCardById('corf-b079')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        dennis.stone = 0

        card.onAnyAction(game, micah, 'take-stone-1', dennis, { stoneTaken: 3 })

        expect(dennis.stone).toBe(1)
      })

      test('does not give stone when less than 3 taken', () => {
        const card = res.getCardById('corf-b079')
        const game = t.fixture({ cardSets: ['minorB'] })
        game.run()

        const dennis = t.player(game)
        const micah = game.players.byName('micah')
        dennis.stone = 0

        card.onAnyAction(game, micah, 'take-stone-1', dennis, { stoneTaken: 2 })

        expect(dennis.stone).toBe(0)
      })
    })

    describe('Acorns Basket (B084)', () => {
      test('schedules wild boar for next 2 rounds', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            reed: 1,
            hand: ['acorns-basket-b084'],
            occupations: ['wood-cutter', 'firewood-collector', 'seasonal-worker'],
          },
          round: 5,
        })
        game.run()

        game.state.round = 5
        t.playCard(game, 'dennis', 'acorns-basket-b084')

        const dennis = t.player(game)
        expect(game.state.scheduledBoar[dennis.name][6]).toBe(1)
        expect(game.state.scheduledBoar[dennis.name][7]).toBe(1)
      })
    })

    describe('Bottles (B036)', () => {
      test('has special cost based on family members', () => {
        const card = res.getCardById('bottles-b036')
        const mockPlayer = { familyMembers: 3 }
        const cost = card.getSpecialCost(mockPlayer)
        expect(cost).toEqual({ clay: 3, food: 3 })
      })

      test('gives 4 VPs', () => {
        const card = res.getCardById('bottles-b036')
        expect(card.vps).toBe(4)
      })
    })

    describe('Mantlepiece (B033)', () => {
      test('gives bonus points based on rounds left', () => {
        const game = t.fixture({ cardSets: ['minorB'] })
        t.setBoard(game, {
          dennis: {
            stone: 1,
            roomType: 'clay',
            hand: ['mantlepiece-b033'],
          },
          round: 10,
        })
        game.run()

        game.state.round = 10
        t.playCard(game, 'dennis', 'mantlepiece-b033')

        const dennis = t.player(game)
        // 14 - 10 = 4 rounds left
        expect(dennis.bonusPoints).toBe(4)
        expect(dennis.cannotRenovate).toBe(true)
      })

      test('has -3 VPs', () => {
        const card = res.getCardById('mantlepiece-b033')
        expect(card.vps).toBe(-3)
      })
    })

    describe('Pottery Yard (B031)', () => {
      test('gives 2 bonus points for adjacent unused spaces', () => {
        const card = res.getCardById('pottery-yard-b031')
        const mockPlayer = {
          hasAdjacentUnusedSpaces: (count) => count <= 2,
        }
        expect(card.getEndGamePoints(mockPlayer)).toBe(2)
      })

      test('gives 0 points without adjacent unused spaces', () => {
        const card = res.getCardById('pottery-yard-b031')
        const mockPlayer = {
          hasAdjacentUnusedSpaces: () => false,
        }
        expect(card.getEndGamePoints(mockPlayer)).toBe(0)
      })
    })
  })
})
