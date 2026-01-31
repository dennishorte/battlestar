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
    })

    describe('Corn Scoop', () => {
      test('has onAction hook for take-grain', () => {
        const card = res.getCardById('corn-scoop')
        expect(card.onAction).toBeDefined()
      })

      test('gives +1 grain when using take-grain action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            grain: 0,
            minorImprovements: ['corn-scoop'],
          },
        })
        game.run()

        const dennis = t.player(game)

        // Directly call the action with the hook active
        game.actions.executeAction(dennis, 'take-grain')

        // Should get base 1 grain + 1 from Corn Scoop
        expect(dennis.grain).toBe(2)
      })
    })

    describe('Stone Tongs', () => {
      test('has onAction hook for stone actions', () => {
        const card = res.getCardById('stone-tongs')
        expect(card.onAction).toBeDefined()
      })

      test('gives +1 stone when using stone accumulation space', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            stone: 0,
            minorImprovements: ['stone-tongs'],
          },
          round: 6, // Need to be in stage 2+ for stone actions
        })
        game.run()

        const dennis = t.player(game)

        // Make sure take-stone-1 action is available and has accumulated
        game.state.actionSpaces['take-stone-1'] = { accumulated: 3 }

        game.actions.executeAction(dennis, 'take-stone-1')

        // Should get accumulated 3 stone + 1 from Stone Tongs
        expect(dennis.stone).toBe(4)
      })
    })

    describe('Canoe', () => {
      test('has onAction hook for fishing', () => {
        const card = res.getCardById('canoe')
        expect(card.onAction).toBeDefined()
      })

      test('gives +1 food and +1 reed when using fishing', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            food: 0,
            reed: 0,
            minorImprovements: ['canoe'],
          },
        })
        game.run()

        const dennis = t.player(game)

        // Set up fishing accumulated resources
        game.state.actionSpaces['fishing'] = { accumulated: 2 }

        game.actions.executeAction(dennis, 'fishing')

        // Should get accumulated 2 food + 1 from Canoe, and +1 reed from Canoe
        expect(dennis.food).toBe(3) // 2 accumulated + 1 from Canoe
        expect(dennis.reed).toBe(1) // Just the Canoe bonus
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
    })

    describe('Handplow', () => {
      test('schedules a plow for current round + 5', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            hand: ['handplow'],
          },
          round: 3,
        })
        game.run()

        game.state.round = 3
        t.playCard(game, 'dennis', 'handplow')

        const dennis = t.player(game)
        // Should schedule a plow for round 8
        expect(game.state.scheduledPlows[dennis.name]).toContain(8)
      })

      test('does not schedule beyond round 14', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
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
      test('returns additionalBake when using plow-field action', () => {
        const card = res.getCardById('threshing-board')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'plow-field')
        expect(result.additionalBake).toBe(true)
      })

      test('returns additionalBake when using plow-sow action', () => {
        const card = res.getCardById('threshing-board')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)

        const result = card.onAction(game, dennis, 'plow-sow')
        expect(result.additionalBake).toBe(true)
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
      test('gives 1 food when played (including itself)', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            wood: 5,
            clay: 5,
            hand: ['junk-room'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'junk-room')

        t.testBoard(game, {
          dennis: {
            food: 1, // 1 from onPlay
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
      test('returns wood-for-food exchange option on take-wood', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            minorImprovements: ['basket'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('basket')

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result.mayExchangeWoodForFood).toEqual({ wood: 2, food: 3 })
      })

      test('returns exchange option on copse action too', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            minorImprovements: ['basket'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('basket')

        const result = card.onAction(game, dennis, 'copse')
        expect(result.mayExchangeWoodForFood).toEqual({ wood: 2, food: 3 })
      })

      test('does not offer exchange with fewer than 2 wood', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 1,
            minorImprovements: ['basket'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('basket')

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result).toBeUndefined()
      })
    })

    describe('Dutch Windmill', () => {
      test('gives 3 extra food when baking in round after harvest', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['dutch-windmill'],
          },
          round: 5,
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('dutch-windmill')

        // Simulate: last harvest was round 4, now it's round 5
        game.state.lastHarvestRound = 4
        game.state.round = 5

        card.onBake(game, dennis)
        expect(dennis.food).toBe(3)
      })

      test('gives nothing when baking in a non-post-harvest round', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            minorImprovements: ['dutch-windmill'],
          },
          round: 6,
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('dutch-windmill')

        // Last harvest was round 4, now it's round 6 (not immediately after)
        game.state.lastHarvestRound = 4
        game.state.round = 6

        card.onBake(game, dennis)
        expect(dennis.food).toBe(0)
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
    })

    describe("Shepherd's Crook", () => {
      test('gives 2 sheep when fencing a pasture of 4+ spaces', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            minorImprovements: ['shepherds-crook'],
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 0 }, { row: 2, col: 1 }] },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('shepherds-crook')

        // Hook is called with the newly-built pasture
        const pasture = dennis.farmyard.pastures[0]
        card.onBuildPasture(game, dennis, pasture)

        expect(dennis.getTotalAnimals('sheep')).toBe(2)
      })

      test('does not give sheep for pastures smaller than 4 spaces', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 5,
            minorImprovements: ['shepherds-crook'],
            farmyard: {
              pastures: [
                { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 0 }] },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('shepherds-crook')

        const pasture = dennis.farmyard.pastures[0]
        card.onBuildPasture(game, dennis, pasture)

        expect(dennis.getTotalAnimals('sheep')).toBe(0)
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

      test('gives +1 wood when using wood accumulation space', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 0,
            occupations: ['wood-cutter'],
          },
        })
        game.run()

        const dennis = t.player(game)

        // Set up wood accumulated resources (take-wood is Forest in Revised Edition)
        game.state.actionSpaces['take-wood'] = { accumulated: 3 }

        game.actions.executeAction(dennis, 'take-wood')

        // Should get accumulated 3 wood + 1 from Wood Cutter
        expect(dennis.wood).toBe(4)
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

      test('gives extra grain during harvest for each grain field', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 0,
            occupations: ['scythe-worker'],
            farmyard: {
              fields: [
                { row: 1, col: 0, crop: 'grain', cropCount: 3 },
                { row: 1, col: 1, crop: 'grain', cropCount: 2 },
              ],
            },
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('scythe-worker')

        // Call onHarvest directly
        card.onHarvest(game, dennis)

        // Should get 2 extra grain (one per grain field)
        expect(dennis.grain).toBe(2)
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
        expect(dennis.food).toBe(4) // 2 starting (first player) + 2 from action
        expect(dennis.grain).toBe(1)
      })

      test('returns resource choice on day-laborer from round 6+', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            grain: 0,
            occupations: ['seasonal-worker'],
          },
          round: 6,
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('seasonal-worker')

        // Test the return value indicates a choice
        const result = card.onAction(game, dennis, 'day-laborer')
        expect(result.chooseResource).toContain('grain')
        expect(result.chooseResource).toContain('vegetables')
      })
    })

    describe('Firewood Collector', () => {
      test('gives +1 wood when using take-grain action', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 0,
            grain: 0,
            occupations: ['firewood-collector'],
          },
        })
        game.run()

        const dennis = t.player(game)
        game.actions.executeAction(dennis, 'take-grain')

        // Should get 1 wood from Firewood Collector + 1 grain from action
        expect(dennis.wood).toBe(1)
        expect(dennis.grain).toBe(1)
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
        t.setPlayerMajorImprovements(game, dennis, ['fireplace-2', 'well'])
        t.setPlayerCards(game, dennis, 'minorImprovements', ['corn-scoop', 'stone-tongs', 'canoe'])
        expect(card.getEndGamePoints(dennis)).toBe(2)

        // 7 improvements = 4 points
        t.setPlayerCards(game, dennis, 'minorImprovements', ['corn-scoop', 'stone-tongs', 'canoe', 'drinking-trough', 'rammed-clay'])
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

    describe('Conjurer (4+ players)', () => {
      test('gives +1 wood and +1 grain when using traveling-players', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            wood: 0,
            grain: 0,
            occupations: ['conjurer'],
          },
        })
        game.run()

        const dennis = t.player(game)

        // Set up traveling-players action space
        game.state.actionSpaces['traveling-players'] = { accumulated: 2 }

        game.actions.executeAction(dennis, 'traveling-players')

        // Should get 2 food from action + 1 wood and 1 grain from Conjurer
        expect(dennis.food).toBe(4) // 2 starting + 2 from action
        expect(dennis.wood).toBe(1)
        expect(dennis.grain).toBe(1)
      })
    })

    describe('Lutenist (4+ players)', () => {
      test('gives card owner food and wood when another player uses traveling-players', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            food: 0,
            wood: 0,
            occupations: ['lutenist'],
          },
          micah: {
            food: 0,
          },
        })
        game.run()

        const dennis = t.player(game)
        const micah = game.players.byName('micah')

        // Set up traveling-players action space
        game.state.actionSpaces['traveling-players'] = { accumulated: 2 }

        // Micah takes the action
        game.actions.executeAction(micah, 'traveling-players')

        // Dennis gets 1 food and 1 wood from Lutenist
        expect(dennis.food).toBe(1)
        expect(dennis.wood).toBe(1)
      })

      test('does not trigger when card owner takes the action', () => {
        const game = t.fixture({ numPlayers: 4 })
        t.setBoard(game, {
          dennis: {
            food: 0,
            wood: 0,
            occupations: ['lutenist'],
          },
        })
        game.run()

        const dennis = t.player(game)

        // Set up traveling-players action space
        game.state.actionSpaces['traveling-players'] = { accumulated: 2 }

        // Dennis takes the action himself
        game.actions.executeAction(dennis, 'traveling-players')

        // Dennis should NOT get the Lutenist bonus (only triggers for other players)
        // Gets only the 2 accumulated food from the action, no Lutenist bonus
        expect(dennis.food).toBe(2)
        expect(dennis.wood).toBe(0)
      })
    })

    describe('Mushroom Collector', () => {
      test('returns wood-for-food exchange option on take-wood', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            wood: 3,
            occupations: ['mushroom-collector'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('mushroom-collector')

        const result = card.onAction(game, dennis, 'take-wood')
        expect(result.mayExchangeWoodForFood).toEqual({ wood: 1, food: 2 })
      })

      test('returns exchange option on copse action', () => {
        const card = res.getCardById('mushroom-collector')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.wood = 2

        const result = card.onAction(game, dennis, 'copse')
        expect(result.mayExchangeWoodForFood).toEqual({ wood: 1, food: 2 })
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
      test('offers plow-for-food when in stone house with food', () => {
        const card = res.getCardById('plow-driver')
        const game = t.fixture()
        game.run()
        const dennis = t.player(game)
        dennis.roomType = 'stone'
        dennis.food = 3

        const result = card.onRoundStart(game, dennis)
        expect(result.mayPlowForFood).toBe(true)
      })

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
    })

    describe('Adoptive Parents', () => {
      test('has allowImmediateOffspringAction flag', () => {
        const card = res.getCardById('adoptive-parents')
        expect(card.allowImmediateOffspringAction).toBe(true)
      })
    })

    describe('Grocer', () => {
      test('initializes goods stack on play', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            hand: ['grocer'],
          },
        })
        game.run()

        t.playCard(game, 'dennis', 'grocer')

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
    })

    describe('Harpooner (3+ players)', () => {
      test('returns mayPayWoodForBonus when using fishing with wood', () => {
        const card = res.getCardById('harpooner')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.wood = 3

        const result = card.onAction(game, dennis, 'fishing')
        expect(result.mayPayWoodForBonus).toBe(true)
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
      test('onAction returns mayBuyAnimal for animal market actions', () => {
        const card = res.getCardById('animal-dealer')

        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 5

        // Test onAction returns mayBuyAnimal
        const result = card.onAction(game, dennis, 'take-sheep')
        expect(result.mayBuyAnimal).toBe('sheep')
      })

      test('returns correct animal type for each market', () => {
        const card = res.getCardById('animal-dealer')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 5

        expect(card.onAction(game, dennis, 'take-sheep').mayBuyAnimal).toBe('sheep')
        expect(card.onAction(game, dennis, 'take-boar').mayBuyAnimal).toBe('boar')
        expect(card.onAction(game, dennis, 'take-cattle').mayBuyAnimal).toBe('cattle')
      })

      test('does not trigger without food', () => {
        const card = res.getCardById('animal-dealer')
        const game = t.fixture({ numPlayers: 3 })
        game.run()
        const dennis = t.player(game)
        dennis.food = 0

        const result = card.onAction(game, dennis, 'take-sheep')
        expect(result).toBeUndefined()
      })
    })

    describe('Roughcaster', () => {
      test('gives 3 food when building clay room', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            occupations: ['roughcaster'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('roughcaster')

        // Directly call the onBuildRoom hook
        card.onBuildRoom(game, dennis, 'clay')

        expect(dennis.food).toBe(3)
      })

      test('does not give food when building wood room', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            occupations: ['roughcaster'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('roughcaster')

        // Directly call the onBuildRoom hook
        card.onBuildRoom(game, dennis, 'wood')

        expect(dennis.food).toBe(0)
      })

      test('gives 3 food when renovating from clay to stone', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            occupations: ['roughcaster'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('roughcaster')

        // Directly call the onRenovate hook
        card.onRenovate(game, dennis, 'clay', 'stone')

        expect(dennis.food).toBe(3)
      })

      test('does not give food when renovating from wood to clay', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            food: 0,
            occupations: ['roughcaster'],
          },
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('roughcaster')

        // Directly call the onRenovate hook
        card.onRenovate(game, dennis, 'wood', 'clay')

        expect(dennis.food).toBe(0)
      })
    })

    describe('Wall Builder', () => {
      test('schedules food on next 4 round spaces when building room', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            occupations: ['wall-builder'],
          },
          round: 5,
        })
        game.run()

        const dennis = t.player(game)
        const card = res.getCardById('wall-builder')

        // Ensure round is set
        game.state.round = 5

        // Directly call the onBuildRoom hook
        card.onBuildRoom(game, dennis)

        // Should schedule food for rounds 6, 7, 8, 9
        expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
        expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
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

        // Ensure round is set
        game.state.round = 12

        // Directly call the onBuildRoom hook
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
            fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 2 }],
            stables: [{ row: 2, col: 1 }],
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
