const t = require('../../testutil.js')
const res = require('../index.js')
const minorA = require('./minorA.js')


describe('MinorA Cards', () => {

  describe('card data', () => {
    test('all 84 minor improvements are defined', () => {
      const minors = minorA.getMinorImprovements()
      expect(minors.length).toBe(84)
    })

    test('no occupations in this set', () => {
      const occupations = minorA.getOccupations()
      expect(occupations.length).toBe(0)
    })

    test('getCardById returns correct card', () => {
      const card = res.getCardById('shelter-a001')
      expect(card.name).toBe('Shelter')
      expect(card.type).toBe('minor')
      expect(card.deck).toBe('minorA')
    })

    test('all cards have unique ids', () => {
      const minors = minorA.getMinorImprovements()
      const ids = minors.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all cards have required fields', () => {
      const minors = minorA.getMinorImprovements()
      for (const card of minors) {
        expect(card.id).toBeDefined()
        expect(card.name).toBeDefined()
        expect(card.deck).toBe('minorA')
        expect(card.number).toBeDefined()
        expect(card.type).toBe('minor')
        expect(card.text).toBeDefined()
      }
    })

    test('card numbers are 1-84', () => {
      const minors = minorA.getMinorImprovements()
      const numbers = minors.map(c => c.number).sort((a, b) => a - b)
      for (let i = 1; i <= 84; i++) {
        expect(numbers).toContain(i)
      }
    })
  })

  describe('card set registration', () => {
    test('minorA is registered in cardSets', () => {
      expect(res.cardSets.minorA).toBeDefined()
      expect(res.cardSets.minorA.id).toBe('minorA')
      expect(res.cardSets.minorA.name).toBe('Minor Improvements A')
    })

    test('minorA card counts are correct', () => {
      expect(res.cardSets.minorA.minorCount).toBe(84)
      expect(res.cardSets.minorA.occupationCount).toBe(0)
    })

    test('getMinorImprovements includes minorA cards', () => {
      const minors = res.getMinorImprovements()
      expect(minors.some(c => c.deck === 'minorA')).toBe(true)
    })
  })

  describe('Minor Improvements', () => {

    describe('Shifting Cultivation (A002)', () => {
      test('plows a field on play', () => {
        const card = res.getCardById('shifting-cultivation-a002')
        expect(card.onPlay).toBeDefined()
        expect(card.cost).toEqual({ food: 2 })
        expect(card.text).toContain('plow 1 field')
      })
    })

    describe('Clay Embankment (A005)', () => {
      test('gives bonus clay on play', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            food: 1, // cost
            clay: 5,
            hand: ['clay-embankment-a005'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'clay-embankment-a005')

        const dennis = t.player(game)
        // 5 + floor(5/2) = 7
        expect(dennis.clay).toBe(7)
      })

      test('gives nothing with 0-1 clay', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            food: 1, // cost
            clay: 1,
            hand: ['clay-embankment-a005'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'clay-embankment-a005')

        const dennis = t.player(game)
        // floor(1/2) = 0, so still 1
        expect(dennis.clay).toBe(1)
      })
    })

    describe('Baseboards (A004)', () => {
      test('gives wood for rooms and bonus if rooms > people', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            food: 2,
            grain: 1,
            wood: 0,
            hand: ['baseboards-a004'],
            farmyard: { rooms: 3 },
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'baseboards-a004')

        const dennis = t.player(game)
        // 3 rooms, 2 people -> 3 + 1 = 4 wood
        expect(dennis.wood).toBe(4)
      })
    })

    describe('Young Animal Market (A009)', () => {
      test('exchanges sheep for cattle', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            hand: ['young-animal-market-a009'],
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }], animals: { sheep: 2 } }],
            },
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'young-animal-market-a009')

        const dennis = t.player(game)
        expect(dennis.getTotalAnimals('sheep')).toBe(1) // 2 - 1 cost
        expect(dennis.getTotalAnimals('cattle')).toBe(1) // +1 from card
      })
    })

    describe('Drinking Trough (A012)', () => {
      test('increases pasture capacity by 2', () => {
        const card = res.getCardById('drinking-trough-a012')
        const increased = card.modifyPastureCapacity(null, {}, 4)
        expect(increased).toBe(6)
      })
    })

    describe('Rammed Clay (A016)', () => {
      test('gives 1 clay on play', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            clay: 0,
            hand: ['rammed-clay-a016'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'rammed-clay-a016')

        const dennis = t.player(game)
        expect(dennis.clay).toBe(1)
      })

      test('has modifyFenceCost with alternateResource', () => {
        const card = res.getCardById('rammed-clay-a016')
        const result = card.modifyFenceCost()
        expect(result.alternateResource).toBe('clay')
      })
    })

    describe('Manger (A032)', () => {
      test('gives bonus points for large pastures', () => {
        const card = res.getCardById('manger-a032')
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
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
        // 6 pasture spaces = 1 bonus point
        expect(card.getEndGamePoints(dennis)).toBe(1)
      })

      test('gives 4 points for 10+ spaces', () => {
        const card = res.getCardById('manger-a032')
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            farmyard: {
              pastures: [
                { spaces: [
                  { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
                  { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
                ] },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        expect(card.getEndGamePoints(dennis)).toBe(4)
      })
    })

    describe('Wool Blankets (A038)', () => {
      test('gives 3 points for wooden house', () => {
        const card = res.getCardById('wool-blankets-a038')
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: { roomType: 'wood' },
        })
        game.run()

        const dennis = t.player(game)
        expect(card.getEndGamePoints(dennis)).toBe(3)
      })

      test('gives 2 points for clay house', () => {
        const card = res.getCardById('wool-blankets-a038')
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: { roomType: 'clay' },
        })
        game.run()

        const dennis = t.player(game)
        expect(card.getEndGamePoints(dennis)).toBe(2)
      })

      test('gives 0 points for stone house', () => {
        const card = res.getCardById('wool-blankets-a038')
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: { roomType: 'stone' },
        })
        game.run()

        const dennis = t.player(game)
        expect(card.getEndGamePoints(dennis)).toBe(0)
      })
    })

    describe('Pond Hut (A044)', () => {
      test('schedules 1 food for next 3 rounds', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['pond-hut-a044'],
            occupations: ['wood-cutter', 'firewood-collector'], // Need exactly 2 occupations
          },
          round: 5,
        })
        game.run()

        game.state.round = 5
        t.playCard(game, 'dennis', 'pond-hut-a044')

        const dennis = t.player(game)
        // Should schedule food for rounds 6, 7, 8
        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
      })
    })

    describe('Milk Jug (A050)', () => {
      test('gives card owner 3 food when any player uses cattle market', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['milk-jug-a050'],
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
        // Micah gets 1 food from Milk Jug
        expect(micah.food).toBe(1)
      })
    })

    describe('Corn Scoop (A067)', () => {
      test('gives +1 grain on Grain Seeds action', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['corn-scoop-a067'],
          },
        })
        game.run()

        t.choose(game, 'Grain Seeds')

        const dennis = t.player(game)
        expect(dennis.grain).toBe(2) // 1 base + 1 from Corn Scoop
      })
    })

    describe('Stone Tongs (A080)', () => {
      test('gives +1 stone on quarry action', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['stone-tongs-a080'],
          },
          round: 6, // Need stage 2+ for stone actions
        })
        game.run()

        t.choose(game, 'Western Quarry (1)')

        const dennis = t.player(game)
        expect(dennis.stone).toBe(2) // 1 accumulated + 1 from Stone Tongs
      })
    })

    describe('Canoe (A078)', () => {
      test('gives +1 food and +1 reed on Fishing action', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            minorImprovements: ['canoe-a078'],
          },
        })
        game.run()

        t.choose(game, 'Fishing (1)')

        const dennis = t.player(game)
        expect(dennis.food).toBe(2) // 1 accumulated + 1 from Canoe
        expect(dennis.reed).toBe(1) // +1 from Canoe
      })
    })

    describe('Large Greenhouse (A069)', () => {
      test('schedules vegetables for rounds current+4, +7, +9', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['large-greenhouse-a069'],
            occupations: ['wood-cutter', 'firewood-collector'], // Need 2 occupations
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'large-greenhouse-a069')

        const dennis = t.player(game)
        // Should schedule vegetables for rounds 7, 10, 12
        expect(game.state.scheduledVegetables[dennis.name][7]).toBe(1)
        expect(game.state.scheduledVegetables[dennis.name][10]).toBe(1)
        expect(game.state.scheduledVegetables[dennis.name][12]).toBe(1)
      })
    })

    describe('Handplow (A019)', () => {
      test('schedules a plow for round current+5', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            hand: ['handplow-a019'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'handplow-a019')

        const dennis = t.player(game)
        // Schedules plow for round 8
        expect(game.state.scheduledPlows[dennis.name]).toContain(8)
      })

      test('does not schedule beyond round 14', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            hand: ['handplow-a019'],
          },
          round: 10,
        })
        game.run()

        game.state.round = 10
        t.playCard(game, 'dennis', 'handplow-a019')

        // Round 10+5=15, which is beyond 14 so nothing scheduled
        expect(game.state.scheduledPlows).toBeUndefined()
      })
    })

    describe('Big Country (A033)', () => {
      test('gives bonus points and food based on rounds left', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        // Fill all farmyard spaces to meet prereq
        const fields = []
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 5; col++) {
            if (row === 0 && col === 0) {
              continue
            }
            if (row === 1 && col === 0) {
              continue
            }
            fields.push({ row, col })
          }
        }
        t.setBoard(game, {
          dennis: {
            food: 0,
            hand: ['big-country-a033'],
            farmyard: { fields },
          },
          round: 10,
        })
        game.run()

        game.state.round = 10
        t.playCard(game, 'dennis', 'big-country-a033')

        const dennis = t.player(game)
        // 14 - 10 = 4 rounds left
        expect(dennis.bonusPoints).toBe(4)
        expect(dennis.food).toBe(8) // 4 rounds * 2 food
      })
    })

    describe('Threshing Board (A024)', () => {
      test('triggers bake bread when using Farmland action', () => {
        const card = res.getCardById('threshing-board-a024')
        expect(card.onAction).toBeDefined()

        // Verify it triggers for plow-field and plow-sow
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()
        const dennis = t.player(game)

        // Create mock result tracker
        let bakeCalled = false
        const originalBakeBread = game.actions.bakeBread
        game.actions.bakeBread = () => {
          bakeCalled = true
        }

        card.onAction(game, dennis, 'plow-field')
        expect(bakeCalled).toBe(true)

        bakeCalled = false
        card.onAction(game, dennis, 'plow-sow')
        expect(bakeCalled).toBe(true)

        // Restore
        game.actions.bakeBread = originalBakeBread
      })
    })

    describe('Lumber Mill (A075)', () => {
      test('reduces wood cost of improvements by 1', () => {
        const card = res.getCardById('lumber-mill-a075')
        const modified = card.modifyImprovementCost(null, { wood: 3, clay: 2 })
        expect(modified.wood).toBe(2)
        expect(modified.clay).toBe(2)
      })

      test('does not reduce wood below 0', () => {
        const card = res.getCardById('lumber-mill-a075')
        const modified = card.modifyImprovementCost(null, { clay: 2 })
        // No wood key, so cost unchanged
        expect(modified.clay).toBe(2)
        expect(modified.wood).toBeUndefined()
      })

      test('gives 2 VPs', () => {
        const card = res.getCardById('lumber-mill-a075')
        expect(card.vps).toBe(2)
      })
    })

    describe('Junk Room (A055)', () => {
      test('gives 1 food on play', () => {
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            wood: 1,
            clay: 1,
            food: 0,
            hand: ['junk-room-a055'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'junk-room-a055')

        const dennis = t.player(game)
        // Gets 1 food from onPlay
        expect(dennis.food).toBe(1)
      })

      test('onBuildImprovement gives 1 food', () => {
        const card = res.getCardById('junk-room-a055')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        card.onBuildImprovement(game, dennis)
        expect(dennis.food).toBe(1)

        card.onBuildImprovement(game, dennis)
        expect(dennis.food).toBe(2)
      })
    })

    describe('Claypipe (A053)', () => {
      test('gives 2 food when 7+ building resources gained this round', () => {
        const card = res.getCardById('claypipe-a053')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0
        dennis.resourcesGainedThisRound = { wood: 3, clay: 2, stone: 1, reed: 1 } // total = 7

        card.onReturnHome(game, dennis)

        expect(dennis.food).toBe(2)
      })

      test('gives nothing when fewer than 7 building resources gained', () => {
        const card = res.getCardById('claypipe-a053')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0
        dennis.resourcesGainedThisRound = { wood: 3, clay: 2, stone: 1 } // total = 6

        card.onReturnHome(game, dennis)

        expect(dennis.food).toBe(0)
      })
    })

    describe('Dutch Windmill (A063)', () => {
      test('gives 3 extra food when baking in round after harvest', () => {
        const card = res.getCardById('dutch-windmill-a063')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0
        game.state.lastHarvestRound = 4
        game.state.round = 5

        card.onBake(game, dennis)

        expect(dennis.food).toBe(3)
      })

      test('gives nothing in non-post-harvest round', () => {
        const card = res.getCardById('dutch-windmill-a063')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0
        game.state.lastHarvestRound = 4
        game.state.round = 6

        card.onBake(game, dennis)

        expect(dennis.food).toBe(0)
      })
    })

    describe('Clearing Spade (A071)', () => {
      test('has allowsAnytimeCropMove flag', () => {
        const card = res.getCardById('clearing-spade-a071')
        expect(card.allowsAnytimeCropMove).toBe(true)
      })
    })

    describe('Shepherd\'s Crook (A083)', () => {
      test('onBuildPasture gives sheep for 4+ space pastures', () => {
        const card = res.getCardById('shepherds-crook-a083')
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }] }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const largePasture = {
          spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        }

        card.onBuildPasture(game, dennis, largePasture)

        expect(dennis.getTotalAnimals('sheep')).toBe(2)
      })

      test('does not give sheep for pastures smaller than 4 spaces', () => {
        const card = res.getCardById('shepherds-crook-a083')
        const game = t.fixture({ cardSets: ['minorA'] })
        t.setBoard(game, {
          dennis: {
            farmyard: {
              pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }] }],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const smallPasture = {
          spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }],
        }

        card.onBuildPasture(game, dennis, smallPasture)

        expect(dennis.getTotalAnimals('sheep')).toBe(0)
      })
    })

    describe('Forest Lake Hut (A042)', () => {
      test('gives 1 wood on Fishing action', () => {
        const card = res.getCardById('forest-lake-hut-a042')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()

        const dennis = t.player(game)
        dennis.wood = 0

        card.onAction(game, dennis, 'fishing')

        expect(dennis.wood).toBe(1)
      })

      test('gives 1 food on Forest action', () => {
        const card = res.getCardById('forest-lake-hut-a042')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        card.onAction(game, dennis, 'take-wood')

        expect(dennis.food).toBe(1)
      })
    })

    describe('Drift-Net Boat (A051)', () => {
      test('gives +2 food on Fishing action', () => {
        const card = res.getCardById('drift-net-boat-a051')
        const game = t.fixture({ cardSets: ['minorA'] })
        game.run()

        const dennis = t.player(game)
        dennis.food = 0

        card.onAction(game, dennis, 'fishing')

        expect(dennis.food).toBe(2)
      })
    })

    describe('Debt Security (A031)', () => {
      test('gives bonus points based on major improvements and unused spaces', () => {
        const card = res.getCardById('debt-security-a031')
        expect(card.getEndGamePoints).toBeDefined()

        // Create mock player with specific setup
        const mockPlayer = {
          majorImprovements: ['fireplace-2', 'well', 'pottery'],
          getUnusedFarmyardSpaceCount: () => 5,
        }
        // 3 major improvements, 5 unused spaces -> min(3, 5) = 3
        expect(card.getEndGamePoints(mockPlayer)).toBe(3)

        // Test when unused spaces < majors
        mockPlayer.getUnusedFarmyardSpaceCount = () => 2
        expect(card.getEndGamePoints(mockPlayer)).toBe(2)
      })
    })

    describe('Oriental Fireplace (A060)', () => {
      test('has correct conversion rates', () => {
        const card = res.getCardById('oriental-fireplace-a060')
        expect(card.anytimeConversions).toBeDefined()
        expect(card.anytimeConversions).toContainEqual({ from: 'vegetables', to: 'food', rate: 4 })
        expect(card.anytimeConversions).toContainEqual({ from: 'sheep', to: 'food', rate: 3 })
        expect(card.anytimeConversions).toContainEqual({ from: 'cattle', to: 'food', rate: 5 })
        expect(card.bakingConversion).toEqual({ from: 'grain', to: 'food', rate: 2 })
      })

      test('counts as major or minor', () => {
        const card = res.getCardById('oriental-fireplace-a060')
        expect(card.countsAsMajorOrMinor).toBe(true)
      })
    })
  })
})
