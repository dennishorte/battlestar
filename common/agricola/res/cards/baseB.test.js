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
      test('returns fenceOneSpaceFree on play', () => {
        const card = baseB.getCardById('mini-pasture')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({ food: 2 })

        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        const result = card.onPlay(game, dennis)
        expect(result).toEqual({ fenceOneSpaceFree: true })
      })
    })

    describe('Market Stall', () => {
      test('gives 1 vegetable on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 3,
            vegetables: 0,
            hand: ['market-stall'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'market-stall')

        const dennis = t.player(game)
        expect(dennis.vegetables).toBe(1)
        // Cost is 1 grain
        expect(dennis.grain).toBe(2)
      })
    })

    describe('Caravan', () => {
      test('has providesRoom flag', () => {
        const card = baseB.getCardById('caravan')
        expect(card.providesRoom).toBe(true)
        expect(card.cost).toEqual({ wood: 3, food: 3 })
      })
    })

    describe("Carpenter's Parlor", () => {
      test('reduces wooden room cost to 2 wood and 2 reed', () => {
        const card = baseB.getCardById('carpenters-parlor')
        expect(card.modifyBuildCost).toBeDefined()

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
    })

    describe('Mining Hammer', () => {
      test('gives 1 food on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            wood: 3,
            hand: ['mining-hammer'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'mining-hammer')

        const dennis = t.player(game)
        expect(dennis.food).toBe(1)
      })

      test('returns freeStable on renovate', () => {
        const card = baseB.getCardById('mining-hammer')
        expect(card.onRenovate).toBeDefined()

        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        const result = card.onRenovate(game, dennis)
        expect(result).toEqual({ freeStable: true })
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

      test('returns additionalPlow and decrements charges on plow-field action', () => {
        const card = baseB.getCardById('moldboard-plow')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.moldboardPlowCharges = 2

        const result1 = card.onAction(game, dennis, 'plow-field')
        expect(result1).toEqual({ additionalPlow: true })
        expect(dennis.moldboardPlowCharges).toBe(1)

        const result2 = card.onAction(game, dennis, 'plow-field')
        expect(result2).toEqual({ additionalPlow: true })
        expect(dennis.moldboardPlowCharges).toBe(0)

        // No more charges
        const result3 = card.onAction(game, dennis, 'plow-field')
        expect(result3).toBeUndefined()
      })
    })

    describe('Lasso', () => {
      test('has allowDoubleWorkerPlacement with animal market actions', () => {
        const card = baseB.getCardById('lasso')
        expect(card.allowDoubleWorkerPlacement).toEqual(['take-sheep', 'take-boar', 'take-cattle'])
        expect(card.cost).toEqual({ reed: 1 })
      })
    })

    describe('Bread Paddle', () => {
      test('gives 1 food on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            wood: 3,
            hand: ['bread-paddle'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'bread-paddle')

        const dennis = t.player(game)
        expect(dennis.food).toBe(1)
      })

      test('returns additionalBake on occupation play', () => {
        const card = baseB.getCardById('bread-paddle')
        expect(card.onPlayOccupation).toBeDefined()

        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        const result = card.onPlayOccupation(game, dennis)
        expect(result).toEqual({ additionalBake: true })
      })
    })

    describe('Mantlepiece', () => {
      test('gives bonus points based on rounds left and prevents renovation', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            stone: 3,
            roomType: 'clay',
            hand: ['mantlepiece'],
          },
        })
        game.run()

        const dennis = t.player(game)
        game.state.round = 5

        const card = baseB.getCardById('mantlepiece')
        card.onPlay(game, dennis)

        // 14 - 5 = 9 rounds left = 9 bonus points
        expect(dennis.bonusPoints).toBe(9)
        expect(dennis.cannotRenovate).toBe(true)
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
    })

    describe('Loom', () => {
      test('gives food during harvest based on sheep count', () => {
        const card = baseB.getCardById('loom')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }], animals: { sheep: 4 } }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onHarvest(game, dennis)

        // 4 sheep = 2 food
        expect(dennis.food).toBe(2)
      })

      test('gives 1 food for 1-3 sheep during harvest', () => {
        const card = baseB.getCardById('loom')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 1 } }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onHarvest(game, dennis)
        expect(dennis.food).toBe(1)
      })

      test('gives 3 food for 7+ sheep during harvest', () => {
        const card = baseB.getCardById('loom')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }], animals: { sheep: 7 } },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onHarvest(game, dennis)
        expect(dennis.food).toBe(3)
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
    })

    describe('Strawberry Patch', () => {
      test('schedules food on next 3 rounds', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 3,
            hand: ['strawberry-patch'],
          },
        })
        game.run()

        const dennis = t.player(game)
        game.state.round = 5

        const card = baseB.getCardById('strawberry-patch')
        card.onPlay(game, dennis)

        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
      })
    })

    describe('Herring Pot', () => {
      test('schedules food on next 3 rounds when fishing', () => {
        const card = baseB.getCardById('herring-pot')
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 3

        card.onAction(game, dennis, 'fishing')

        expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][5]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
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
        const card = baseB.getCardById('butter-churn')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }], animals: { sheep: 6 } },
                { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], animals: { cattle: 4 } },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onHarvest(game, dennis)

        // floor(6/3) + floor(4/2) = 2 + 2 = 4 food
        expect(dennis.food).toBe(4)
      })

      test('gives no food with few animals', () => {
        const card = baseB.getCardById('butter-churn')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onHarvest(game, dennis)

        // floor(2/3) = 0
        expect(dennis.food).toBe(0)
      })
    })

    describe('Brook', () => {
      test('gives 1 food when using actions above fishing', () => {
        const card = baseB.getCardById('brook')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        card.onAction(game, dennis, 'build-room-stable')
        expect(dennis.food).toBe(1)

        card.onAction(game, dennis, 'starting-player')
        expect(dennis.food).toBe(2)

        card.onAction(game, dennis, 'take-grain')
        expect(dennis.food).toBe(3)

        card.onAction(game, dennis, 'plow-field')
        expect(dennis.food).toBe(4)
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('brook')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        card.onAction(game, dennis, 'take-wood')
        expect(dennis.food).toBe(0)

        card.onAction(game, dennis, 'fishing')
        expect(dennis.food).toBe(0)
      })
    })

    describe('Scullery', () => {
      test('gives 1 food at round start if wooden house', () => {
        const card = baseB.getCardById('scullery')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 0
        dennis.roomType = 'wood'

        card.onRoundStart(game, dennis)
        expect(dennis.food).toBe(1)
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
      test('gives 3 food during harvest with correct field configuration', () => {
        const card = baseB.getCardById('three-field-rotation')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            farmyard: {
              fields: [
                { row: 1, col: 0, crop: 'grain', cropCount: 2 },
                { row: 1, col: 1, crop: 'vegetables', cropCount: 1 },
                { row: 1, col: 2 },  // empty field
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onHarvest(game, dennis)
        expect(dennis.food).toBe(3)
      })

      test('gives no food without all three field types', () => {
        const card = baseB.getCardById('three-field-rotation')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            farmyard: {
              fields: [
                { row: 1, col: 0, crop: 'grain', cropCount: 2 },
                { row: 1, col: 1 },  // empty field (no vegetable field)
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        card.onHarvest(game, dennis)
        expect(dennis.food).toBe(0)
      })
    })

    describe('Pitchfork', () => {
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
      test('schedules grain on rounds 5, 8, 11, 14', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 2

        const card = baseB.getCardById('sack-cart')
        card.onPlay(game, dennis)

        expect(game.state.scheduledGrain[dennis.name][5]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][11]).toBe(1)
        expect(game.state.scheduledGrain[dennis.name][14]).toBe(1)
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
      test('sets beanfieldActive on play', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        const card = baseB.getCardById('beanfield')
        card.onPlay(game, dennis)

        expect(dennis.beanfieldActive).toBe(true)
      })

      test('has providesVegetableField flag', () => {
        const card = baseB.getCardById('beanfield')
        expect(card.providesVegetableField).toBe(true)
        expect(card.vps).toBe(1)
      })
    })

    describe('Thick Forest', () => {
      test('schedules wood on remaining even rounds', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 3

        const card = baseB.getCardById('thick-forest')
        card.onPlay(game, dennis)

        expect(game.state.scheduledWood[dennis.name][4]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][10]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][12]).toBe(1)
        expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
        // Odd rounds should not have scheduled wood
        expect(game.state.scheduledWood[dennis.name][5]).toBeUndefined()
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
      test('gives 3 clay on day-laborer action', () => {
        const card = baseB.getCardById('loam-pit')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.clay = 0

        card.onAction(game, dennis, 'day-laborer')
        expect(dennis.clay).toBe(3)
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
      test('has anytime exchange flag', () => {
        const card = baseB.getCardById('hard-porcelain')
        expect(card.allowsAnytimeExchange).toBe(true)
        expect(card.exchangeRates).toEqual({ clay: 2, stone: 1 })
      })
    })

    describe('Acorns Basket', () => {
      test('schedules boar on next 2 rounds', () => {
        const game = t.fixture()
        game.run()

        const dennis = t.player(game)
        game.state.round = 7

        const card = baseB.getCardById('acorns-basket')
        card.onPlay(game, dennis)

        expect(game.state.scheduledBoar[dennis.name][8]).toBe(1)
        expect(game.state.scheduledBoar[dennis.name][9]).toBe(1)
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
      test('returns mayBuildRoomOrRenovate on day-laborer', () => {
        const card = baseB.getCardById('cottager')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'day-laborer')
        expect(result).toEqual({ mayBuildRoomOrRenovate: true })
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('cottager')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })
    })

    describe('Groom', () => {
      test('gives 1 wood on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 0,
            hand: ['groom'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'groom')

        const dennis = t.player(game)
        expect(dennis.wood).toBe(1)
      })

      test('returns mayBuildStableForWood at round start in stone house', () => {
        const card = baseB.getCardById('groom')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'stone'
        dennis.wood = 1

        const result = card.onRoundStart(game, dennis)
        expect(result).toEqual({ mayBuildStableForWood: true })
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
    })

    describe('Assistant Tiller', () => {
      test('returns additionalPlow on day-laborer', () => {
        const card = baseB.getCardById('assistant-tiller')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'day-laborer')
        expect(result).toEqual({ additionalPlow: true })
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
    })

    describe('Scholar', () => {
      test('returns mayPlayOccupationOrImprovement at round start in stone house', () => {
        const card = baseB.getCardById('scholar')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'stone'

        const result = card.onRoundStart(game, dennis)
        expect(result).toEqual({ mayPlayOccupationOrImprovement: true })
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
    })

    describe('Tutor', () => {
      test('records occupation count on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['wood-cutter', 'firewood-collector'],
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
    })

    describe('Consultant', () => {
      test('gives 3 clay in 2-player game', () => {
        const game = t.fixture({ numPlayers: 2 })
        t.setBoard(game, {
          dennis: {
            clay: 0,
            hand: ['consultant'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'consultant')
        const dennis = t.player(game)
        expect(dennis.clay).toBe(3)
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
    })

    describe('Sheep Walker', () => {
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
    })

    describe('Oven Firing Boy', () => {
      test('returns additionalBake on wood accumulation actions', () => {
        const card = baseB.getCardById('oven-firing-boy')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        expect(card.onAction(game, dennis, 'take-wood')).toEqual({ additionalBake: true })
        expect(card.onAction(game, dennis, 'copse')).toEqual({ additionalBake: true })
      })

      test('does not trigger on non-wood actions', () => {
        const card = baseB.getCardById('oven-firing-boy')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        expect(card.onAction(game, dennis, 'take-clay')).toBeUndefined()
        expect(card.onAction(game, dennis, 'fishing')).toBeUndefined()
      })
    })

    describe('Paper Maker', () => {
      test('returns mayPayWoodForOccupationFood when player has wood', () => {
        const card = baseB.getCardById('paper-maker')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.wood = 3

        const result = card.onPlayOccupation(game, dennis)
        expect(result).toEqual({ mayPayWoodForOccupationFood: true })
      })

      test('does not trigger without wood', () => {
        const card = baseB.getCardById('paper-maker')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0

        const result = card.onPlayOccupation(game, dennis)
        expect(result).toBeUndefined()
      })
    })

    describe('Childless', () => {
      test('gives food and choice when 3+ rooms and 2 people', () => {
        const card = baseB.getCardById('childless')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            familyMembers: 2,
            farmyard: { rooms: 3 },
          },
        })
        game.run()

        const dennis = t.player(game)
        const result = card.onRoundStart(game, dennis)

        expect(dennis.food).toBe(1)
        expect(result).toEqual({ chooseResource: ['grain', 'vegetables'] })
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
            food: 0,
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
      test('gives 1 wood at round start with exactly 2 rooms', () => {
        const card = baseB.getCardById('small-scale-farmer')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0
        // Default 2 rooms

        card.onRoundStart(game, dennis)
        expect(dennis.wood).toBe(1)
      })

      test('does not give wood with more than 2 rooms', () => {
        const card = baseB.getCardById('small-scale-farmer')
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 0,
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
      test('gives 1 clay on Forest and Reed Bank actions', () => {
        const card = baseB.getCardById('geologist')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.clay = 0

        card.onAction(game, dennis, 'take-wood')
        expect(dennis.clay).toBe(1)

        card.onAction(game, dennis, 'take-reed')
        expect(dennis.clay).toBe(2)
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
      test('returns mayPayFoodForStone when player has food', () => {
        const card = baseB.getCardById('roof-ballaster')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.food = 3

        const result = card.onPlay(game, dennis)
        expect(result).toEqual({ mayPayFoodForStone: true })
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
    })

    describe('Carpenter', () => {
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
    })

    describe('House Steward', () => {
      test('gives wood based on rounds left', () => {
        const card = baseB.getCardById('house-steward')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.wood = 0

        // Round 5: 14 - 5 = 9 rounds left -> 4 wood
        game.state.round = 5
        card.onPlay(game, dennis)
        expect(dennis.wood).toBe(4)
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
    })

    describe('Greengrocer', () => {
      test('gives 1 vegetable on take-grain action', () => {
        const card = baseB.getCardById('greengrocer')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.vegetables = 0

        card.onAction(game, dennis, 'take-grain')
        expect(dennis.vegetables).toBe(1)
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
    })

    describe('Storehouse Keeper', () => {
      test('returns chooseResource on resource-market action', () => {
        const card = baseB.getCardById('storehouse-keeper')
        const game = t.fixture({ numPlayers: 4 })
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'resource-market')
        expect(result).toEqual({ chooseResource: ['clay', 'grain'] })
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
    })

    describe('Sheep Whisperer', () => {
      test('schedules sheep at round offsets 2, 5, 8, 10', () => {
        const game = t.fixture({ numPlayers: 4 })
        game.run()

        const dennis = t.player(game)
        game.state.round = 1

        const card = baseB.getCardById('sheep-whisperer')
        card.onPlay(game, dennis)

        expect(game.state.scheduledSheep[dennis.name][3]).toBe(1)  // 1+2
        expect(game.state.scheduledSheep[dennis.name][6]).toBe(1)  // 1+5
        expect(game.state.scheduledSheep[dennis.name][9]).toBe(1)  // 1+8
        expect(game.state.scheduledSheep[dennis.name][11]).toBe(1) // 1+10
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
      test('returns mayBuyAnimal cattle on take-grain with food', () => {
        const card = baseB.getCardById('cattle-feeder')
        const game = t.fixture({ numPlayers: 4 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 3

        const result = card.onAction(game, dennis, 'take-grain')
        expect(result).toEqual({ mayBuyAnimal: 'cattle' })
      })

      test('does not trigger without food', () => {
        const card = baseB.getCardById('cattle-feeder')
        const game = t.fixture({ numPlayers: 4 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        const result = card.onAction(game, dennis, 'take-grain')
        expect(result).toBeUndefined()
      })

      test('does not trigger on other actions', () => {
        const card = baseB.getCardById('cattle-feeder')
        const game = t.fixture({ numPlayers: 4 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 3

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })
    })
  })
})
