const t = require('../../testutil.js')
const res = require('../index.js')


describe('BaseA Cards', () => {

  describe('card data', () => {
    test('all minor improvements are defined', () => {
      const minors = res.getMinorImprovements()
      expect(minors.length).toBe(24)
    })

    test('all occupations are defined', () => {
      const occupations = res.getOccupations()
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

      dennis.playedOccupations.push('firewood-collector')
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

      dennis.playedOccupations.push('seasonal-worker')
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

      dennis.playedOccupations.push('mushroom-collector')
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
      test('has onPlay that triggers field plowing', () => {
        const card = res.getCardById('shifting-cultivation')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({ food: 2 })
      })

      test('card can be played and cost paid', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 5,
            hand: ['shifting-cultivation'],
          },
        })
        game.run()

        const dennis = t.player(game)
        expect(dennis.canPlayCard('shifting-cultivation')).toBe(true)
        dennis.playCard('shifting-cultivation')

        expect(dennis.food).toBe(3) // Paid 2 food
        expect(dennis.playedMinorImprovements).toContain('shifting-cultivation')
      })
    })

    describe('Clay Embankment', () => {
      test('gives 1 clay per 2 clay in supply', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 5,
            clay: 5,
            hand: ['clay-embankment'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'clay-embankment')

        t.testBoard(game, {
          dennis: {
            food: 4, // Paid 1 food
            clay: 7, // 5 + floor(5/2) = 7
          },
        })
      })

      test('gives nothing with 0-1 clay', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 5,
            clay: 1,
            hand: ['clay-embankment'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'clay-embankment')

        t.testBoard(game, {
          dennis: {
            clay: 1, // No bonus
          },
        })
      })
    })

    describe('Young Animal Market', () => {
      test('exchanges sheep for cattle', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            hand: ['young-animal-market'],
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }], animals: { sheep: 2 } }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        t.playCard(game, 'dennis', 'young-animal-market')

        // Should have lost 1 sheep (cost) and gained 1 cattle
        // 2 sheep - 1 cost = 1 sheep remaining, +1 cattle
        expect(dennis.getTotalAnimals('sheep')).toBe(1)
        expect(dennis.getTotalAnimals('cattle')).toBe(1)
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
      test('gives 1 clay on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            clay: 0,
            hand: ['rammed-clay'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'rammed-clay')

        t.testBoard(game, {
          dennis: {
            clay: 1,
          },
        })
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
    })

    describe('Corn Scoop', () => {
      test('has onAction hook for take-grain', () => {
        const card = res.getCardById('corn-scoop')
        expect(card.onAction).toBeDefined()
      })
    })

    describe('Stone Tongs', () => {
      test('has onAction hook for stone actions', () => {
        const card = res.getCardById('stone-tongs')
        expect(card.onAction).toBeDefined()
      })
    })

    describe('Canoe', () => {
      test('has onAction hook for fishing', () => {
        const card = res.getCardById('canoe')
        expect(card.onAction).toBeDefined()
      })
    })
  })

  describe('Occupations', () => {

    describe('Animal Tamer', () => {
      test('has onPlay effect for resource choice', () => {
        const card = res.getCardById('animal-tamer')
        expect(card.onPlay).toBeDefined()
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
      test('allows direct stone renovation', () => {
        const card = res.getCardById('conservator')
        expect(card.allowDirectStoneRenovation).toBe(true)
      })
    })

    describe('Hedge Keeper', () => {
      test('reduces fence cost by 3', () => {
        const card = res.getCardById('hedge-keeper')
        expect(card.modifyFenceCost(null, 5)).toBe(2)
        expect(card.modifyFenceCost(null, 3)).toBe(0)
        expect(card.modifyFenceCost(null, 2)).toBe(0)
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
    })

    describe('Wood Cutter', () => {
      test('has onAction hook for wood actions', () => {
        const card = res.getCardById('wood-cutter')
        expect(card.onAction).toBeDefined()
      })
    })

    describe('Scythe Worker', () => {
      test('gives 1 grain on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 0,
            hand: ['scythe-worker'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'scythe-worker')

        t.testBoard(game, {
          dennis: {
            grain: 1,
            occupations: ['scythe-worker'],
          },
        })
      })
    })

    describe('Priest', () => {
      test('gives resources if in clay house with 2 rooms', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            roomType: 'clay',
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
            clay: 3,
            reed: 2,
            stone: 2,
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

        t.testBoard(game, {
          dennis: {
            clay: 0,
            reed: 0,
            stone: 0,
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
        dennis.majorImprovements = ['fireplace-2', 'well']
        dennis.playedMinorImprovements = ['corn-scoop', 'stone-tongs', 'canoe']
        expect(card.getEndGamePoints(dennis)).toBe(2)

        // 7 improvements = 4 points
        dennis.playedMinorImprovements.push('drinking-trough', 'rammed-clay')
        expect(card.getEndGamePoints(dennis)).toBe(4)
      })
    })

    describe('Pig Breeder', () => {
      test('gives 1 boar on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            hand: ['pig-breeder'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'pig-breeder')

        t.testBoard(game, {
          dennis: {
            animals: { boar: 1 },
          },
        })
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

      t.testBoard(game, {
        dennis: {
          food: 10,
          wood: 5,
          grain: 3,
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

      t.testBoard(game, {
        dennis: {
          hand: ['shifting-cultivation', 'clay-embankment'],
          occupations: ['wood-cutter'],
          minorImprovements: ['corn-scoop'],
          majorImprovements: ['fireplace-2'],
        },
      })
    })

    test('setBoard sets farmyard correctly', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          farmyard: {
            rooms: 3,
            fields: [{ row: 1, col: 0, crop: 'grain', cropCount: 2 }],
            stables: [{ row: 1, col: 1 }],
          },
        },
      })
      game.run()

      t.testBoard(game, {
        dennis: {
          farmyard: {
            rooms: 3,
            fields: 1,
            stables: 1,
          },
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
