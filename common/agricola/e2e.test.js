/**
 * End-to-end test for a full 3-player Agricola game.
 * Plays through all 14 rounds with harvests and verifies game completion.
 */

const { GameOverEvent, InputRequestEvent } = require('../lib/game.js')
const t = require('./testutil.js')
const res = require('./res/index.js')


describe('Agricola End-to-End', () => {

  /**
   * Helper to respond to an input request and continue game execution.
   */
  function respond(game, selection) {
    const request = game.waiting
    if (!request || !request.selectors) {
      throw new Error('No pending input request')
    }

    const selector = request.selectors[0]

    const result = game.respondToInputRequest({
      actor: selector.actor,
      title: selector.title,
      selection: Array.isArray(selection) ? selection : [selection],
    })

    return result
  }

  /**
   * Helper to find a choice matching a pattern and respond with it.
   */
  function selectMatch(game, pattern) {
    const request = game.waiting
    if (!request || !request.selectors) {
      throw new Error('No pending input request')
    }

    const selector = request.selectors[0]
    const choices = selector.choices || []

    const match = choices.find(choice => {
      const label = typeof choice === 'string' ? choice : String(choice)
      return label.toLowerCase().includes(pattern.toLowerCase())
    })

    if (!match) {
      const availableLabels = choices.slice(0, 15).map(c => typeof c === 'string' ? c : String(c))
      throw new Error(`No choice matching "${pattern}" for ${selector.actor}. Title: "${selector.title}". Available: ${availableLabels.join(', ')}`)
    }

    return respond(game, match)
  }

  /**
   * Get current actor from the waiting request.
   */
  function getCurrentActor(game) {
    const request = game.waiting
    if (!request || !request.selectors) {
      return null
    }
    return request.selectors[0]?.actor
  }


  test('plays a complete 3-player game through all 14 rounds', () => {
    const game = t.fixture({ numPlayers: 3 })
    let result = game.run()

    expect(game.state.initializationComplete).toBe(true)
    expect(game.players.all().length).toBe(3)

    // Play through all 14 rounds
    let iterations = 0
    const maxIterations = 5000 // Safety limit

    while (!(result instanceof GameOverEvent) && iterations < maxIterations) {
      iterations++

      if (!(result instanceof InputRequestEvent)) {
        result = game.run()
        continue
      }

      const selector = result.selectors[0]
      if (!selector) {
        result = game.run()
        continue
      }

      const title = selector.title || ''
      const choices = selector.choices || []

      // Handle different types of input requests
      if (title === 'Choose an action') {
        // Pick a simple resource-gathering action if available
        const preferredActions = [
          'day laborer', 'take wood', 'take clay', 'take reed', 'fishing',
          'take grain', 'take 1 grain', 'take stone', 'take sheep',
          'starting player', 'take vegetable', 'take 1 vegetable',
          'take 3 wood', 'take 1 building', 'clay pit', 'resource market'
        ]

        let picked = false
        for (const preferred of preferredActions) {
          const match = choices.find(c => c.toLowerCase().includes(preferred))
          if (match) {
            result = respond(game, match)
            picked = true
            break
          }
        }

        if (!picked) {
          // Just pick first available action
          result = respond(game, choices[0])
        }
      }
      else if (title.includes('more food')) {
        // Feeding phase - convert grain or say done
        const grainOpt = choices.find(c => c.includes('grain'))
        const vegOpt = choices.find(c => c.includes('vegetable') && !c.includes('Cook'))
        const doneOpt = choices.find(c => c.includes('Done'))

        if (grainOpt) {
          result = respond(game, grainOpt)
        }
        else if (vegOpt) {
          result = respond(game, vegOpt)
        }
        else if (doneOpt) {
          result = respond(game, doneOpt)
        }
        else {
          result = respond(game, choices[0])
        }
      }
      else if (title.includes('field') || title.includes('plow')) {
        // Field selection - pick first or skip if optional
        const skipOpt = choices.find(c => c.includes('Done') || c.includes('Skip') || c.includes('Cancel'))
        result = respond(game, skipOpt || choices[0])
      }
      else if (title.includes('resource') || title.includes('Choose')) {
        // Resource choice - pick first
        result = respond(game, choices[0])
      }
      else {
        // Default: pick first choice
        result = respond(game, choices[0])
      }
    }

    // Verify game completed
    expect(result).toBeInstanceOf(GameOverEvent)
    expect(game.state.round).toBeGreaterThanOrEqual(14)

    // Verify a winner was determined (game stores 'player' not 'winner')
    expect(result.data.player).toBeDefined()
  })


  test('tracks resources correctly through a round', () => {
    const game = t.fixture({ numPlayers: 3 })
    let result = game.run()

    // Helper to get fresh player reference (needed after game.run())
    const getPlayer = (name) => game.players.byName(name)

    // Round 1 starts - wood has accumulated 3
    expect(game.state.actionSpaces['take-wood'].accumulated).toBe(3)

    // Dennis takes wood (first action choice)
    expect(getCurrentActor(game)).toBe('dennis')
    result = selectMatch(game, 'take wood')

    // After the action executes, dennis should have wood (get fresh reference)
    expect(getPlayer('dennis').wood).toBe(3)
    expect(game.state.actionSpaces['take-wood'].accumulated).toBe(0)

    // Now it's Micah's turn
    expect(getCurrentActor(game)).toBe('micah')
    result = selectMatch(game, 'take clay')
    expect(getPlayer('micah').clay).toBe(1)

    // Scott's turn
    expect(getCurrentActor(game)).toBe('scott')
    result = selectMatch(game, 'fishing')
    expect(getPlayer('scott').food).toBe(4) // 3 starting + 1 from fishing
  })


  test('handles harvest feeding phase correctly', () => {
    const game = t.fixture({ numPlayers: 3 })
    let result = game.run()

    // Play through round 4 (first harvest)
    let iterations = 0
    const maxIterations = 500

    while (game.state.round <= 4 && iterations < maxIterations) {
      iterations++

      if (!(result instanceof InputRequestEvent)) {
        result = game.run()
        continue
      }

      const selector = result.selectors[0]
      if (!selector) {
        result = game.run()
        continue
      }

      const title = selector.title || ''
      const choices = selector.choices || []

      if (title === 'Choose an action') {
        // Pick any action
        result = respond(game, choices[0])
      }
      else if (title.includes('more food')) {
        // Feeding phase
        const doneOpt = choices.find(c => c.includes('Done'))
        const grainOpt = choices.find(c => c.includes('grain'))
        if (grainOpt) {
          result = respond(game, grainOpt)
        }
        else if (doneOpt) {
          result = respond(game, doneOpt)
        }
        else {
          result = respond(game, choices[0])
        }
      }
      else {
        result = respond(game, choices[0])
      }
    }

    // After harvest, verify we've completed round 4
    expect(game.state.round).toBeGreaterThanOrEqual(4)
  })


  test('action spaces accumulate resources correctly', () => {
    const game = t.fixture({ numPlayers: 3 })
    let result = game.run()

    // Round 1: Wood should have 3 accumulated
    expect(game.state.actionSpaces['take-wood'].accumulated).toBe(3)

    // Take the wood
    result = selectMatch(game, 'take wood')
    expect(game.state.actionSpaces['take-wood'].accumulated).toBe(0)

    // Complete round 1 by making all other choices
    while (game.state.round === 1 && result instanceof InputRequestEvent) {
      const selector = result.selectors[0]
      const choices = selector.choices || []
      result = respond(game, choices[0])
    }

    // Continue to round 2
    if (!(result instanceof InputRequestEvent)) {
      result = game.run()
    }

    // Round 2: Wood should have accumulated again (3 more)
    expect(game.state.actionSpaces['take-wood'].accumulated).toBe(3)
  })


  test('round cards are revealed progressively', () => {
    const game = t.fixture({ numPlayers: 3 })
    game.run()

    // Round 1: Should have one stage 1 round card active
    const stageOneCards = ['sow-bake', 'take-sheep', 'fencing', 'major-minor-improvement']
    const round1RoundCards = game.state.activeActions.filter(id => stageOneCards.includes(id))
    expect(round1RoundCards.length).toBe(1)

    // The revealed card should be in activeActions
    expect(game.state.activeActions.length).toBeGreaterThan(res.getBaseActions().length)
  })


  test('scoring calculates correctly at end of game', () => {
    // Create a game and set up final state manually
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        food: 10,
        grain: 4,     // 2 points
        vegetables: 2, // 2 points
        familyMembers: 3, // 9 points
        roomType: 'clay', // +1 per room
        farmyard: {
          rooms: 3, // 3 points for clay rooms
          fields: [
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
          ], // 3 fields = 2 points
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const breakdown = dennis.getScoreBreakdown()

    // Verify scoring categories
    expect(breakdown.grain.count).toBe(4)
    expect(breakdown.grain.points).toBe(2) // 4-5 grain = 2 points
    expect(breakdown.vegetables.count).toBe(2)
    expect(breakdown.vegetables.points).toBe(2) // 2 vegetables = 2 points
    expect(breakdown.familyMembers.count).toBe(3)
    expect(breakdown.familyMembers.points).toBe(9) // 3 * 3 = 9 points
    expect(breakdown.fields.count).toBe(3)
    expect(breakdown.fields.points).toBe(2) // 3 fields = 2 points

    // Room points depend on type
    expect(breakdown.rooms.type).toBe('clay')
    expect(breakdown.rooms.points).toBe(3) // 3 clay rooms * 1 = 3 points

    // Total should be calculated
    expect(typeof breakdown.total).toBe('number')
  })


  test('3-player game has additional action spaces', () => {
    const game = t.fixture({ numPlayers: 3 })
    game.run()

    // 3-player games should have: clay-pit, take-1-building-resource, take-3-wood, resource-market
    expect(game.state.activeActions).toContain('clay-pit')
    expect(game.state.activeActions).toContain('take-1-building-resource')
    expect(game.state.activeActions).toContain('take-3-wood')
    expect(game.state.activeActions).toContain('resource-market')
  })


  test('workers are tracked correctly through rounds', () => {
    const game = t.fixture({ numPlayers: 3 })
    let result = game.run()

    // Helper to get fresh player reference (needed after game.run())
    const getPlayer = (name) => game.players.byName(name)

    // Each player starts with 2 workers
    expect(getPlayer('dennis').getAvailableWorkers()).toBe(2)

    // Dennis uses first worker
    result = selectMatch(game, 'take wood')
    expect(getPlayer('dennis').getAvailableWorkers()).toBe(1)

    // Micah and Scott take their turns
    result = selectMatch(game, 'take clay')
    result = selectMatch(game, 'fishing')

    // Dennis uses second worker
    expect(getCurrentActor(game)).toBe('dennis')
    expect(getPlayer('dennis').getAvailableWorkers()).toBe(1)
    result = selectMatch(game, 'day laborer')
    expect(getPlayer('dennis').getAvailableWorkers()).toBe(0)
  })


  test('starting player changes when action is taken', () => {
    const game = t.fixture({ numPlayers: 3 })
    let result = game.run()

    // Helper to get fresh player reference
    const getPlayer = (name) => game.players.byName(name)

    // Dennis is starting player initially
    expect(game.state.startingPlayer).toBe('dennis')

    // Dennis takes wood (not starting player action)
    result = selectMatch(game, 'take wood')

    // Micah takes "Starting Player" action
    expect(getCurrentActor(game)).toBe('micah')
    const micahFoodBefore = getPlayer('micah').food
    result = selectMatch(game, 'starting player')

    // Micah should now be starting player
    expect(game.state.startingPlayer).toBe('micah')

    // Micah should have received 1 food
    expect(getPlayer('micah').food).toBe(micahFoodBefore + 1)
  })


  test('game produces valid final scores for all players', () => {
    const game = t.fixture({ numPlayers: 3 })
    let result = game.run()

    // Play through to game end
    let iterations = 0
    const maxIterations = 5000

    while (!(result instanceof GameOverEvent) && iterations < maxIterations) {
      iterations++

      if (!(result instanceof InputRequestEvent)) {
        result = game.run()
        continue
      }

      const selector = result.selectors[0]
      if (!selector) {
        result = game.run()
        continue
      }

      const choices = selector.choices || []
      result = respond(game, choices[0])
    }

    expect(result).toBeInstanceOf(GameOverEvent)

    // Check all players have valid scores (get fresh references)
    const players = game.players.all()
    for (const player of players) {
      const score = player.calculateScore()
      expect(typeof score).toBe('number')
      expect(score).not.toBeNaN()

      const breakdown = player.getScoreBreakdown()
      expect(breakdown.total).toBe(score)
    }

    // Winner should have highest score (game stores 'player' not 'winner')
    expect(result.data.player).toBeDefined()
    const winnerName = typeof result.data.player === 'string' ? result.data.player : result.data.player.name
    const winner = game.players.byName(winnerName)
    const winnerScore = winner.calculateScore()

    for (const player of players) {
      expect(player.calculateScore()).toBeLessThanOrEqual(winnerScore)
    }
  })

})
