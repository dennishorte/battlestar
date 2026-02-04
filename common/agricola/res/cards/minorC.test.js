const t = require('../../testutil.js')
const res = require('../index.js')
const minorC = require('./minorC.js')


describe('MinorC Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorC.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorC.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('overhaul-c001')
      expect(card.name).toBe('Overhaul')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorC')
    })

    test('all cards have unique ids', () => {
      const minors = minorC.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorC.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorC')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorC.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorC is registered in cardSets', () => {
      expect(res.cardSets.minorC).toBeDefined()
      expect(res.cardSets.minorC.id).toBe('minorC')
      expect(res.cardSets.minorC.name).toBe('Minor Improvements C')
    })

    test('minorC card counts are correct', () => {
      expect(res.cardSets.minorC.minorCount).toBe(84)
      expect(res.cardSets.minorC.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorC cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorC')).toBe(true)
    })
  })

  describe('Minor Improvements', () => {

    describe('Stable (C002)', () => {
      test('has onPlay that builds free stable', () => {
        const card = res.getCardById('stable-c002')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({ wood: 1 })
      })
    })

    describe('Writing Boards (C004)', () => {
      test('gives wood equal to occupations played', () => {
        const card = res.getCardById('writing-boards-c004')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.occupationsPlayed = 3
        dennis.food = 1
        dennis.wood = 0

        card.onPlay(game, dennis)

        expect(dennis.wood).toBe(3)
      })
    })

    describe('Remodeling (C005)', () => {
      test('gives clay for clay rooms and major improvements', () => {
        const card = res.getCardById('remodeling-c005')
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            roomType: 'clay',
            farmyard: { rooms: 3 },
            majorImprovements: ['fireplace-2', 'well'],
          },
        })
        game.run()

        const dennis = t.player(game)
        dennis.food = 1
        dennis.clay = 0

        card.onPlay(game, dennis)

        // 3 clay rooms + 2 major improvements = 5 clay
        expect(dennis.clay).toBe(5)
      })

      test('gives no clay for non-clay rooms', () => {
        const card = res.getCardById('remodeling-c005')
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            roomType: 'wood',
            farmyard: { rooms: 3 },
            majorImprovements: ['fireplace-2'],
          },
        })
        game.run()

        const dennis = t.player(game)
        dennis.food = 1
        dennis.clay = 0

        card.onPlay(game, dennis)

        // 0 clay rooms + 1 major improvement = 1 clay
        expect(dennis.clay).toBe(1)
      })
    })

    describe('Bunk Beds (C010)', () => {
      test('modifies house capacity when 4+ rooms', () => {
        const card = res.getCardById('bunk-beds-c010')
        const mockPlayer = { getRoomCount: () => 4 }
        const capacity = card.modifyHouseCapacity(mockPlayer, 4)
        expect(capacity).toBe(5)
      })

      test('does not modify capacity with fewer than 4 rooms', () => {
        const card = res.getCardById('bunk-beds-c010')
        const mockPlayer = { getRoomCount: () => 3 }
        const capacity = card.modifyHouseCapacity(mockPlayer, 3)
        expect(capacity).toBe(3)
      })
    })

    describe('Wildlife Reserve (C011)', () => {
      test('holds 1 of each animal type', () => {
        const card = res.getCardById('wildlife-reserve-c011')
        expect(card.holdsAnimals).toEqual({ sheep: 1, boar: 1, cattle: 1 })
        expect(card.mixedAnimals).toBe(true)
        expect(card.vps).toBe(1)
      })
    })

    describe('Straw-thatched Roof (C014)', () => {
      test('removes reed from build room cost', () => {
        const card = res.getCardById('straw-thatched-roof-c014')
        const modified = card.modifyBuildCost(null, { wood: 5, reed: 2 }, 'build-room')
        expect(modified).toEqual({ wood: 5 })
        expect(modified.reed).toBeUndefined()
      })

      test('removes reed from renovation cost', () => {
        const card = res.getCardById('straw-thatched-roof-c014')
        const modified = card.modifyBuildCost(null, { clay: 5, reed: 1 }, 'renovate')
        expect(modified).toEqual({ clay: 5 })
        expect(modified.reed).toBeUndefined()
      })
    })

    describe('Swing Plow (C019)', () => {
      test('places 4 field tiles on card', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            wood: 3,
            hand: ['swing-plow-c019'],
            occupations: ['wood-cutter', 'firewood-collector', 'seasonal-worker'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'swing-plow-c019')

        const dennis = t.player(game)
        expect(dennis.swingPlowCharges).toBe(4)
      })
    })

    describe('Flail (C026)', () => {
      test('gives 2 food on play', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            food: 0,
            hand: ['flail-c026'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'flail-c026')

        const dennis = t.player(game)
        expect(dennis.food).toBe(2)
      })

      test('has onAction for plow-field', () => {
        const card = res.getCardById('flail-c026')
        expect(card.onAction).toBeDefined()
      })
    })

    describe('Half-Timbered House (C030)', () => {
      test('gives points for stone rooms', () => {
        const card = res.getCardById('half-timbered-house-c030')
        const mockPlayer = {
          roomType: 'stone',
          getRoomCount: () => 4,
        }
        expect(card.getEndGamePoints(mockPlayer)).toBe(4)
      })

      test('gives no points for non-stone rooms', () => {
        const card = res.getCardById('half-timbered-house-c030')
        const mockPlayer = {
          roomType: 'clay',
          getRoomCount: () => 4,
        }
        expect(card.getEndGamePoints(mockPlayer)).toBe(0)
      })
    })

    describe('Writing Chamber (C031)', () => {
      test('gives bonus points equal to negative points', () => {
        const card = res.getCardById('writing-chamber-c031')
        const mockPlayer = {
          calculateNegativePoints: () => -5,
        }
        expect(card.getEndGamePoints(mockPlayer)).toBe(5)
      })

      test('caps at 7 bonus points', () => {
        const card = res.getCardById('writing-chamber-c031')
        const mockPlayer = {
          calculateNegativePoints: () => -10,
        }
        expect(card.getEndGamePoints(mockPlayer)).toBe(7)
      })
    })

    describe('Greening Plan (C033)', () => {
      test('gives bonus points based on empty fields', () => {
        const card = res.getCardById('greening-plan-c033')

        expect(card.getEndGamePoints({ getEmptyFieldCount: () => 6 })).toBe(5)
        expect(card.getEndGamePoints({ getEmptyFieldCount: () => 5 })).toBe(3)
        expect(card.getEndGamePoints({ getEmptyFieldCount: () => 4 })).toBe(2)
        expect(card.getEndGamePoints({ getEmptyFieldCount: () => 2 })).toBe(1)
        expect(card.getEndGamePoints({ getEmptyFieldCount: () => 1 })).toBe(0)
      })
    })

    describe('Christianity (C038)', () => {
      test('gives other players 1 food each', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            hand: ['christianity-c038'],
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 1 } }],
            },
          },
          micah: {
            food: 0,
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'christianity-c038')

        const micah = game.players.byName('micah')
        expect(micah.food).toBe(1)
      })
    })

    describe('Chicken Coop (C044)', () => {
      test('schedules food for next 8 rounds', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            wood: 2,
            reed: 1,
            hand: ['chicken-coop-c044'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'chicken-coop-c044')

        const dennis = t.player(game)
        // Should schedule food for rounds 4-11
        for (let r = 4; r <= 11; r++) {
          expect(game.state.scheduledFood[dennis.name][r]).toBe(1)
        }
      })
    })

    describe('Stew (C045)', () => {
      test('schedules 4 food on Day Laborer action', () => {
        const card = res.getCardById('stew-c045')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        game.state.round = 5

        card.onAction(game, dennis, 'day-laborer')

        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
      })
    })

    describe('Garden Claw (C047)', () => {
      test('schedules food based on planted fields', () => {
        const card = res.getCardById('garden-claw-c047')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.getPlantedFields = () => [{ crop: 'grain' }, { crop: 'vegetables' }]
        game.state.round = 10

        card.onPlay(game, dennis)

        // 2 planted fields * 3 = 6, but only 4 rounds left (11, 12, 13, 14)
        expect(game.state.scheduledFood[dennis.name][11]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][12]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
      })
    })

    describe('Woodcraft (C058)', () => {
      test('gives 1 food when wood <= 5 after taking wood', () => {
        const card = res.getCardById('woodcraft-c058')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 3
        dennis.food = 0

        card.onAction(game, dennis, 'take-wood')

        expect(dennis.food).toBe(1)
      })

      test('does not give food when wood > 5', () => {
        const card = res.getCardById('woodcraft-c058')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 8
        dennis.food = 0

        card.onAction(game, dennis, 'take-wood')

        expect(dennis.food).toBe(0)
      })
    })

    describe('Schnapps Distillery (C059)', () => {
      test('gives bonus points for 5th and 6th vegetable', () => {
        const card = res.getCardById('schnapps-distillery-c059')
        expect(card.getEndGamePoints({ vegetables: 6 })).toBe(2)
        expect(card.getEndGamePoints({ vegetables: 5 })).toBe(1)
        expect(card.getEndGamePoints({ vegetables: 4 })).toBe(0)
      })
    })

    describe("Small Potter's Oven (C060)", () => {
      test('gives 5 food on play', () => {
        const card = res.getCardById('small-potters-oven-c060')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        card.onPlay(game, dennis)

        expect(dennis.food).toBe(5)
      })

      test('has 5 VPs and isOven', () => {
        const card = res.getCardById('small-potters-oven-c060')
        expect(card.vps).toBe(5)
        expect(card.isOven).toBe(true)
      })
    })

    describe('Granary (C065)', () => {
      test('schedules grain for rounds 8, 10, 12', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            wood: 3,
            hand: ['granary-c065'],
          },
          round: 5,
        })
        game.run()

        game.state.round = 5
        t.playCard(game, 'dennis', 'granary-c065')

        const dennis = t.player(game)
        expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][10]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][12]).toBe(1)
      })
    })

    describe('Eternal Rye Cultivation (C066)', () => {
      test('gives grain with 3+ grain after harvest', () => {
        const card = res.getCardById('eternal-rye-cultivation-c066')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.grain = 4

        card.onHarvestEnd(game, dennis)

        expect(dennis.grain).toBe(5)
      })

      test('gives food with exactly 2 grain after harvest', () => {
        const card = res.getCardById('eternal-rye-cultivation-c066')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.grain = 2
        dennis.food = 0

        card.onHarvestEnd(game, dennis)

        expect(dennis.food).toBe(1)
        expect(dennis.grain).toBe(2)
      })
    })

    describe('Bookcase (C068)', () => {
      test('gives 1 vegetable after playing occupation', () => {
        const card = res.getCardById('bookcase-c068')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.vegetables = 0

        card.onPlayOccupation(game, dennis)

        expect(dennis.vegetables).toBe(1)
      })
    })

    describe('Private Forest (C074)', () => {
      test('schedules wood for even-numbered rounds', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            food: 2,
            hand: ['private-forest-c074'],
            occupations: ['wood-cutter'],
          },
          round: 5,
        })
        game.run()

        game.state.round = 5
        t.playCard(game, 'dennis', 'private-forest-c074')

        const dennis = t.player(game)
        // Even rounds after 5: 6, 8, 10, 12, 14
        expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][10]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][12]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
      })
    })

    describe('Firewood (C075)', () => {
      test('accumulates wood on returning home', () => {
        const card = res.getCardById('firewood-c075')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.firewoodWood = 2

        card.onReturnHome(game, dennis)

        expect(dennis.firewoodWood).toBe(3)
      })
    })

    describe('Wood Cart (C076)', () => {
      test('gives +2 wood on wood accumulation actions', () => {
        const card = res.getCardById('wood-cart-c076')
        const game = t.fixture({ cardSets: ['minorC'] })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 5

        card.onAction(game, dennis, 'take-wood')

        expect(dennis.wood).toBe(7)
      })
    })

    describe('Stone Cart (C079)', () => {
      test('schedules stone for even-numbered rounds', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            wood: 2,
            hand: ['stone-cart-c079'],
            occupations: ['wood-cutter', 'firewood-collector'],
          },
          round: 5,
        })
        game.run()

        game.state.round = 5
        t.playCard(game, 'dennis', 'stone-cart-c079')

        const dennis = t.player(game)
        // Even rounds after 5: 6, 8, 10, 12, 14
        expect(game.state.scheduledStone[dennis.name][6]).toBe(1)
        expect(game.state.scheduledStone[dennis.name][8]).toBe(1)
        expect(game.state.scheduledStone[dennis.name][10]).toBe(1)
        expect(game.state.scheduledStone[dennis.name][12]).toBe(1)
        expect(game.state.scheduledStone[dennis.name][14]).toBe(1)
      })
    })

    describe('Hardware Store (C082)', () => {
      test('has onAction for day-laborer', () => {
        const card = res.getCardById('hardware-store-c082')
        expect(card.onAction).toBeDefined()
        expect(card.vps).toBe(1)
      })
    })

    describe('Early Cattle (C083)', () => {
      test('gives 2 cattle and has -3 VPs', () => {
        const card = res.getCardById('early-cattle-c083')
        expect(card.onPlay).toBeDefined()
        expect(card.vps).toBe(-3)
      })
    })

    describe('Abort Oriel (C032)', () => {
      test('has 3 VPs', () => {
        const card = res.getCardById('abort-oriel-c032')
        expect(card.vps).toBe(3)
      })
    })

    describe('Lantern House (C035)', () => {
      test('has 7 VPs and penalty for cards in hand', () => {
        const card = res.getCardById('lantern-house-c035')
        expect(card.vps).toBe(7)
        const mockPlayer = { getHandSize: () => 3 }
        expect(card.getEndGamePoints(mockPlayer)).toBe(-3)
      })
    })

    describe('Dwelling Mound (C037)', () => {
      test('has 3 VPs', () => {
        const card = res.getCardById('dwelling-mound-c037')
        expect(card.vps).toBe(3)
        expect(card.prereqs.maxRound).toBe(3)
      })
    })

    describe('Stable Yard (C050)', () => {
      test('gives food based on rounds left', () => {
        const game = t.fixture({ cardSets: ['minorC'] })
        t.setBoard(game, {
          dennis: {
            hand: ['stable-yard-c050'],
            farmyard: {
              stables: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
              pastures: [
                { spaces: [{ row: 1, col: 0 }] },
                { spaces: [{ row: 1, col: 1 }] },
                { spaces: [{ row: 1, col: 2 }] },
              ],
            },
          },
          round: 10,
        })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0
        game.state.round = 10

        const card = res.getCardById('stable-yard-c050')
        card.onPlay(game, dennis)

        // 14 - 10 = 4 rounds left
        expect(dennis.food).toBe(4)
      })
    })
  })
})
