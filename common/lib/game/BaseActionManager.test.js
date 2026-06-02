const { createActionManagerFixture } = require('./testFixture.js')

describe('BaseActionManager', () => {
  // These unit tests exercise the choose() machinery itself with intentionally
  // bare-string choices. The bare-string guard is bypassed via production mode;
  // the _warnOnBareStrings describe block below flips it back to exercise the
  // guard directly.
  const _origNodeEnv = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = _origNodeEnv
  })

  // Helper function to create a unique fixture for each test
  // This ensures no shared state between parallel tests
  function createUniqueFixture() {
    return createActionManagerFixture({
      name: 'test_game',
      seed: 'test_seed',
      players: [
        { _id: 'player1_id', name: 'player1' },
        { _id: 'player2_id', name: 'player2' }
      ]
    })
  }

  describe('choose()', () => {
    describe('basic functionality', () => {
      test('should handle single choice selection', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Queue a response with a single selection
        fixture.queueResponse(player1, ['option2'])

        // Call choose with multiple options, expecting single selection
        const result = actionManager.choose(player1, ['option1', 'option2', 'option3'])

        // Verify the correct choice was returned
        expect(result).toEqual(['option2'])

        fixture.assertAllResponsesConsumed()
      })

      test('should handle multiple choice selection', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Queue a response with multiple selections
        fixture.queueResponse(player1, ['option1', 'option2', 'option4'])

        // Call choose with min/max constraints
        const result = actionManager.choose(player1, ['option1', 'option2', 'option3', 'option4'], { min: 2, max: 3 })

        // Verify all selected choices were returned
        expect(result).toEqual(['option1', 'option2', 'option4'])

        fixture.assertAllResponsesConsumed()
      })
    })

    describe('edge cases', () => {
      test('should return empty array when choices array is empty', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Call choose with empty choices array
        const result = actionManager.choose(player1, [])

        // Verify empty array is returned
        expect(result).toEqual([])

        fixture.assertAllResponsesConsumed()
      })

      test('should handle optional choices (min=0)', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Queue an empty response (no selection)
        fixture.queueResponse(player1, [])

        // Call choose with min=0 (optional)
        const result = actionManager.choose(player1, ['option1', 'option2'], { min: 0 })

        // Verify empty array is returned
        expect(result).toEqual([])

        fixture.assertAllResponsesConsumed()
      })

      test('should add "do nothing" log entry when no selection made', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Queue an empty response
        fixture.queueResponse(player1, [])

        // Call choose with optional constraint
        actionManager.choose(player1, ['option1', 'option2'], { min: 0 })

        // Check that "do nothing" log entry was added
        const lastLog = fixture.getLastLogEntry()
        expect(lastLog).toBeDefined()
        // Note: The exact log structure depends on BaseLogManager implementation

        fixture.assertAllResponsesConsumed()
      })

      test('should add "no effect" log entry when no choices available', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Call choose with empty choices
        actionManager.choose(player1, [])

        // Check that "no effect" log entry was added
        const lastLog = fixture.getLastLogEntry()
        expect(lastLog).toBeDefined()
        // Note: The exact log structure depends on BaseLogManager implementation

        fixture.assertAllResponsesConsumed()
      })
    })

    describe('validation', () => {
      test('should validate minimum selection count', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Queue a response with too few selections
        fixture.queueResponse(player1, [])

        // Expect error when minimum is not met
        expect(() => {
          actionManager.choose(player1, ['option1', 'option2'], { min: 1 })
        }).toThrow('Invalid number of options selected')

        fixture.assertAllResponsesConsumed()
      })

      test('should validate maximum selection count', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Queue a response with too many selections
        fixture.queueResponse(player1, ['option1', 'option2', 'option3'])

        // Expect error when maximum is exceeded
        expect(() => {
          actionManager.choose(player1, ['option1', 'option2', 'option3'], { max: 2 })
        }).toThrow('Invalid number of options selected')

        fixture.assertAllResponsesConsumed()
      })

      test('should throw error when selection count is invalid', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Test both min and max violations
        fixture.queueResponse(player1, ['option1'])

        expect(() => {
          actionManager.choose(player1, ['option1', 'option2', 'option3'], { min: 2, max: 3 })
        }).toThrow('Invalid number of options selected')

        fixture.assertAllResponsesConsumed()
      })
    })

    describe('options handling', () => {
      test('should use custom title from options', () => {
        const { fixture, actionManager, player1, game } = createUniqueFixture()

        // Mock requestInputSingle to capture the selector
        let capturedSelector = null
        game.requestInputSingle = (selector) => {
          capturedSelector = selector
          return ['option1']
        }

        // Call choose with custom title
        actionManager.choose(player1, ['option1', 'option2'], { title: 'Custom Title' })

        // Verify the custom title was used
        expect(capturedSelector.title).toBe('Custom Title')

        fixture.assertAllResponsesConsumed()
      })

      test('should add "(optional)" prefix when min=0', () => {
        const { fixture, actionManager, player1, game } = createUniqueFixture()

        // Mock requestInputSingle to capture the selector
        let capturedSelector = null
        game.requestInputSingle = (selector) => {
          capturedSelector = selector
          return []
        }

        // Call choose with min=0
        actionManager.choose(player1, ['option1', 'option2'], { min: 0, title: 'Select Cards' })

        // Verify the "(optional)" prefix was added
        expect(capturedSelector.title).toBe('(optional) Select Cards')

        fixture.assertAllResponsesConsumed()
      })

      test('should pass through all options to selector', () => {
        const { fixture, actionManager, player1, game } = createUniqueFixture()

        // Mock requestInputSingle to capture the selector
        let capturedSelector = null
        game.requestInputSingle = (selector) => {
          capturedSelector = selector
          return ['option1']
        }

        // Call choose with various options
        const options = {
          title: 'Test Title',
          min: 1,
          max: 2,
          count: undefined,
          customProperty: 'test_value'
        }
        actionManager.choose(player1, ['option1', 'option2'], options)

        // Verify options were passed through
        expect(capturedSelector.actor).toBe(player1.name)
        expect(capturedSelector.title).toBe('Test Title')
        expect(capturedSelector.min).toBe(1)
        expect(capturedSelector.max).toBe(2)
        expect(capturedSelector.customProperty).toBe('test_value')
        expect(capturedSelector.choices).toEqual(['option1', 'option2'])
        expect(capturedSelector.count).toBeUndefined()

        fixture.assertAllResponsesConsumed()
      })
    })
  })

  describe('chooseCard()', () => {
    test('should return single card from chooseCards result', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()

      // Create mock cards
      const cards = fixture.createMockCards(['Card A', 'Card B'])

      // Queue a response selecting Card A
      fixture.queueResponse(player1, ['Card A'])

      // Call chooseCard
      const result = actionManager.chooseCard(player1, cards)

      // Verify it returns the first (and only) card from chooseCards
      expect(result).toBe(cards[0])
      expect(result.name).toBe('Card A')

      fixture.assertAllResponsesConsumed()
    })

    test('should handle card selection with same name', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()

      // Create cards with same name but different objects
      const cards = [
        { name: 'Lightning Bolt', id: 'bolt1' },
        { name: 'Lightning Bolt', id: 'bolt2' },
        { name: 'Fireball', id: 'fireball1' }
      ]

      // Queue response selecting Lightning Bolt
      fixture.queueResponse(player1, ['Lightning Bolt'])

      // Call chooseCard
      const result = actionManager.chooseCard(player1, cards)

      // Should return a Lightning Bolt card (id is undefined)
      expect(result).toBe(cards[0])
      expect(result.name).toBe('Lightning Bolt')

      fixture.assertAllResponsesConsumed()
    })

    test('should pass options through to chooseCards', () => {
      const { fixture, actionManager, player1, game } = createUniqueFixture()

      const cards = fixture.createMockCards(['Card A', 'Card B'])

      // Mock requestInputSingle to capture options
      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return ['Card A']
      }

      // Call chooseCard with options
      actionManager.chooseCard(player1, cards, { title: 'Pick a card', customOpt: 'test' })

      // Verify options were passed through
      expect(capturedSelector.title).toBe('Pick a card')
      expect(capturedSelector.customOpt).toBe('test')

      fixture.assertAllResponsesConsumed()
    })
  })

  describe('chooseCards()', () => {
    describe('basic functionality', () => {
      test('should return selected cards based on name matching', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Create mock cards
        const cards = fixture.createMockCards(['Card A', 'Card B', 'Card C'])

        // Queue response selecting Card A and Card C
        fixture.queueResponse(player1, ['Card A', 'Card C'])

        // Call chooseCards
        const result = actionManager.chooseCards(player1, cards, { max: 2 })

        // Verify correct cards were returned
        expect(result).toEqual([cards[0], cards[2]])

        fixture.assertAllResponsesConsumed()
      })

      test('should handle multiple cards with same name', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Create cards with duplicate names
        const cards = [
          { name: 'Forest', id: 'forest1' },
          { name: 'Forest', id: 'forest2' },
          { name: 'Mountain', id: 'mountain1' },
          { name: 'Forest', id: 'forest3' }
        ]

        // Queue response selecting two Forests
        fixture.queueResponse(player1, ['Forest', 'Forest'])

        // Call chooseCards
        const result = actionManager.chooseCards(player1, cards, { max: 2 })

        // Should return different Forest card instances
        expect(result.length).toBe(2)
        expect(result[0].name).toBe('Forest')
        expect(result[1].name).toBe('Forest')
        expect(result[0]).not.toBe(result[1]) // Different objects

        fixture.assertAllResponsesConsumed()
      })
    })

    describe('edge cases', () => {
      test('should handle empty card choices', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Call chooseCards with empty array
        const result = actionManager.chooseCards(player1, [])

        // Should return empty array
        expect(result).toEqual([])

        fixture.assertAllResponsesConsumed()
      })

      test('should handle selection of all available cards', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        const cards = fixture.createMockCards(['Card1', 'Card2', 'Card3'])

        // Queue response selecting all cards
        fixture.queueResponse(player1, ['Card1', 'Card2', 'Card3'])

        const result = actionManager.chooseCards(player1, cards, { max: 3 })

        // Should return all cards
        expect(result).toEqual(cards)

        fixture.assertAllResponsesConsumed()
      })

      test('should handle selection of zero cards', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        const cards = fixture.createMockCards(['Card1', 'Card2', 'Card3'])

        // Queue response selecting zero cards
        fixture.queueResponse(player1, [])

        const result = actionManager.chooseCards(player1, cards, { max: 3 })

        // Should return empty array
        expect(result).toEqual([])

        fixture.assertAllResponsesConsumed()
      })
    })

    describe('id-based disambiguation', () => {
      test('structured selection with id resolves to the exact matching card', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        // Two cards share a display name but have distinct ids
        const cards = [
          { name: 'Desert Power', id: 'imperium-desert-power' },
          { name: 'Desert Power', id: 'conflict-desert-power' },
          { name: 'Other', id: 'other' },
        ]

        // Selection carries an id — the exact card must come back
        fixture.queueResponse(player1, [
          { title: 'Desert Power', id: 'conflict-desert-power' }
        ])

        const result = actionManager.chooseCards(player1, cards, { max: 1 })

        expect(result).toHaveLength(1)
        expect(result[0]).toBe(cards[1])
        expect(result[0].id).toBe('conflict-desert-power')

        fixture.assertAllResponsesConsumed()
      })

      test('title-only selection still resolves (back-compat with legacy clients)', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        const cards = [
          { name: 'Desert Power', id: 'imperium-desert-power' },
          { name: 'Other', id: 'other' },
        ]

        fixture.queueResponse(player1, ['Desert Power'])

        const result = actionManager.chooseCards(player1, cards, { max: 1 })

        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Desert Power')

        fixture.assertAllResponsesConsumed()
      })

      test('chooseCards emits structured choice objects into the selector', () => {
        const { actionManager, player1, game } = createUniqueFixture()

        const cards = [
          { name: 'Card A', id: 'card-a' },
          { name: 'Card B', id: 'card-b' },
        ]

        let capturedSelector = null
        game.requestInputSingle = (selector) => {
          capturedSelector = selector
          return ['Card A']
        }

        actionManager.chooseCards(player1, cards, { max: 1, kind: 'imperium-card' })

        expect(capturedSelector.choices).toEqual([
          { title: 'Card A', id: 'card-a', kind: 'imperium-card' },
          { title: 'Card B', id: 'card-b', kind: 'imperium-card' },
        ])
      })

      test('selection with mixed id and title entries works in both directions', () => {
        const { fixture, actionManager, player1 } = createUniqueFixture()

        const cards = [
          { name: 'Twin', id: 'twin-a' },
          { name: 'Twin', id: 'twin-b' },
        ]

        fixture.queueResponse(player1, [
          { title: 'Twin', id: 'twin-b' },
          'Twin',
        ])

        const result = actionManager.chooseCards(player1, cards, { max: 2 })

        expect(result).toHaveLength(2)
        // First entry resolves by id
        expect(result[0]).toBe(cards[1])
        // Second entry falls back to name match and takes the remaining twin
        expect(result[1]).toBe(cards[0])
      })
    })
  })

  describe('chooseYesNo()', () => {
    test('should return true when "yes" is selected', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()

      // Queue "yes" response
      fixture.queueResponse(player1, ['yes'])

      // Call chooseYesNo
      const result = actionManager.chooseYesNo(player1, 'Do you want to continue?')

      // Should return true
      expect(result).toBe(true)

      fixture.assertAllResponsesConsumed()
    })

    test('should return false when "no" is selected', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()

      // Queue "no" response
      fixture.queueResponse(player1, ['no'])

      // Call chooseYesNo
      const result = actionManager.chooseYesNo(player1, 'Do you want to continue?')

      // Should return false
      expect(result).toBe(false)

      fixture.assertAllResponsesConsumed()
    })

    test('should use provided title in choice selector', () => {
      const { fixture, actionManager, player1, game } = createUniqueFixture()

      // Mock requestInputSingle to capture selector
      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return ['yes']
      }

      // Call chooseYesNo with custom title
      actionManager.chooseYesNo(player1, 'Confirm action?')

      // Verify title was used
      expect(capturedSelector.title).toBe('Confirm action?')

      fixture.assertAllResponsesConsumed()
    })

    test('should only offer "yes" and "no" as choices', () => {
      const { fixture, actionManager, player1, game } = createUniqueFixture()

      // Mock requestInputSingle to capture selector
      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return ['no']
      }

      // Call chooseYesNo
      actionManager.chooseYesNo(player1, 'Test question?')

      // Structured options carry both title (display) and id (resolution key)
      expect(capturedSelector.choices).toEqual([
        { title: 'yes', id: 'yes' },
        { title: 'no', id: 'no' },
      ])

      fixture.assertAllResponsesConsumed()
    })

    test('accepts structured {id} response', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()
      fixture.queueResponse(player1, [{ title: 'yes', id: 'yes' }])
      expect(actionManager.chooseYesNo(player1, 'Confirm?')).toBe(true)
      fixture.assertAllResponsesConsumed()
    })
  })

  describe('choosePlayer()', () => {
    test('emits structured player options into the selector', () => {
      const { actionManager, player1, player2, game } = createUniqueFixture()

      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return [{ title: 'player2', id: 'player2' }]
      }

      actionManager.choosePlayer(player1, [player1, player2])

      expect(capturedSelector.choices).toEqual([
        { title: 'player1', id: 'player1', kind: 'player' },
        { title: 'player2', id: 'player2', kind: 'player' },
      ])
    })

    test('resolves structured response to the correct player', () => {
      const { fixture, actionManager, player1, player2 } = createUniqueFixture()
      fixture.queueResponse(player1, [{ title: 'player2', id: 'player2' }])
      const result = actionManager.choosePlayer(player1, [player1, player2])
      expect(result).toBe(player2)
      fixture.assertAllResponsesConsumed()
    })

    test('resolves bare-string response (back-compat)', () => {
      const { fixture, actionManager, player1, player2 } = createUniqueFixture()
      fixture.queueResponse(player1, ['player2'])
      const result = actionManager.choosePlayer(player1, [player1, player2])
      expect(result).toBe(player2)
      fixture.assertAllResponsesConsumed()
    })

    test('respects custom opts.title', () => {
      const { actionManager, player1, player2, game } = createUniqueFixture()
      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return [{ id: 'player2' }]
      }
      actionManager.choosePlayer(player1, [player1, player2], { title: 'Pick a target' })
      expect(capturedSelector.title).toBe('Pick a target')
    })
  })

  describe('privateChoice()', () => {
    test('injects "Pass" when choices is empty and still emits a prompt', () => {
      const { actionManager, player1, game } = createUniqueFixture()
      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return ['Pass']
      }
      actionManager.privateChoice(player1, [], { title: 'Decide' })
      expect(capturedSelector.choices).toEqual(['Pass'])
      expect(capturedSelector.noAutoRespond).toBe(true)
    })

    test('sets noAutoRespond so single-option lists still prompt', () => {
      const { actionManager, player1, game } = createUniqueFixture()
      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return ['Only']
      }
      actionManager.privateChoice(player1, ['Only'], { title: 'Decide' })
      expect(capturedSelector.noAutoRespond).toBe(true)
    })

    test('emits a privacy-aware memo: visibility to actor, redacted for opponents', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()
      fixture.queueResponse(player1, ['Pass'])
      actionManager.privateChoice(player1, [], { title: 'Decide' })

      const entry = fixture.getLastLogEntry()
      expect(entry.visibility).toEqual(['player1'])
      expect(entry.redacted).toBe('{player} makes a private decision')
      expect(entry.template).toBe('{player} makes a private decision: {choice}')
      // BaseLogManager wraps primitive args as {value}.
      expect(entry.args.choice.value).toBe('Pass')
      expect(entry.event).toBe('private-choice')

      fixture.assertAllResponsesConsumed()
    })

    test('honours opts.logTemplate / opts.redactedTemplate overrides', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()
      fixture.queueResponse(player1, ['Play'])
      actionManager.privateChoice(player1, ['Play', 'Pass'], {
        title: 'Combat Intrigue',
        logTemplate: '{player} plays {choice}',
        redactedTemplate: '{player} makes a combat decision',
      })

      const entry = fixture.getLastLogEntry()
      expect(entry.template).toBe('{player} plays {choice}')
      expect(entry.redacted).toBe('{player} makes a combat decision')
      expect(entry.args.choice.value).toBe('Play')

      fixture.assertAllResponsesConsumed()
    })

    test('opts.logDecision: false suppresses the memo', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()
      fixture.queueResponse(player1, ['Pass'])
      const beforeCount = fixture.getLogEntries().length

      actionManager.privateChoice(player1, [], { title: 'Decide', logDecision: false })

      const afterCount = fixture.getLogEntries().length
      // No new private-choice entry; do-nothing log from choose() may
      // still have fired for the Pass selection, but no privacy memo.
      const entries = fixture.getLogEntries()
      for (let i = beforeCount; i < afterCount; i++) {
        expect(entries[i].event).not.toBe('private-choice')
      }

      fixture.assertAllResponsesConsumed()
    })

    test('structured selection logs the option title, not the raw object', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()
      fixture.queueResponse(player1, [{ title: 'Card A', id: 'card-a' }])
      actionManager.privateChoice(player1, [
        { title: 'Card A', id: 'card-a', kind: 'card' },
        { title: 'Card B', id: 'card-b', kind: 'card' },
      ])

      const entry = fixture.getLastLogEntry()
      expect(entry.args.choice.value).toBe('Card A')

      fixture.assertAllResponsesConsumed()
    })
  })

  describe('option helpers', () => {
    test('option() builds canonical shape and drops unset fields', () => {
      const { actionManager } = createUniqueFixture()
      expect(actionManager.option({ id: 'a', title: 'Alpha' })).toEqual({
        title: 'Alpha', id: 'a',
      })
      expect(actionManager.option({ id: 'a' })).toEqual({ title: 'a', id: 'a' })
      expect(actionManager.option({ id: 'x', title: 'X', kind: 'k', defId: 'd', meta: { z: 1 } })).toEqual({
        title: 'X', id: 'x', defId: 'd', kind: 'k', meta: { z: 1 },
      })
    })

    test('cardOption() pulls name/id/defId off the card', () => {
      const { actionManager } = createUniqueFixture()
      expect(actionManager.cardOption({ name: 'Spice Hoard', id: 'sh-1', defId: 'spice-hoard' })).toEqual({
        title: 'Spice Hoard', id: 'sh-1', defId: 'spice-hoard', kind: 'card',
      })
      expect(actionManager.cardOption({ name: 'Bare', id: 'b' }, 'imperium-card')).toEqual({
        title: 'Bare', id: 'b', kind: 'imperium-card',
      })
    })

    test('playerOption() builds {title, id, kind:"player"}', () => {
      const { actionManager, player1 } = createUniqueFixture()
      expect(actionManager.playerOption(player1)).toEqual({
        title: 'player1', id: 'player1', kind: 'player',
      })
    })
  })

  describe('_warnOnBareStrings', () => {
    // Override the suite-wide production mode so the guard fires.
    let originalEnv

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'test'
    })

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    test('throws on non-allowlisted bare-string option', () => {
      const { actionManager, player1, game } = createUniqueFixture()
      game.requestInputSingle = () => ['Custom Choice']
      expect(() => {
        actionManager.choose(player1, ['Custom Choice', 'Another One'], { title: 'Pick' })
      }).toThrow(/bare-string option "Custom Choice".*in prompt "Pick"/)
    })

    test('does not throw for allowlisted sentinels', () => {
      const { actionManager, player1, game } = createUniqueFixture()
      game.requestInputSingle = () => ['Pass']
      expect(() => {
        actionManager.choose(player1, ['Pass', 'Skip', 'Done', 'Cancel'], { title: 'Confirm' })
      }).not.toThrow()
    })

    test('does not throw for numeric strings', () => {
      const { actionManager, player1, game } = createUniqueFixture()
      game.requestInputSingle = () => ['2']
      expect(() => {
        actionManager.choose(player1, ['1', '2', '3'], { title: 'Pick a number' })
      }).not.toThrow()
    })

    test('does not throw for structured options', () => {
      const { actionManager, player1, game } = createUniqueFixture()
      game.requestInputSingle = () => [{ id: 'a' }]
      expect(() => {
        actionManager.choose(player1, [
          { title: 'Alpha', id: 'a' },
          { title: 'Beta', id: 'b' },
        ], { title: 'Pick' })
      }).not.toThrow()
    })

    test('NODE_ENV=production skips the check', () => {
      process.env.NODE_ENV = 'production'
      const { actionManager, player1, game } = createUniqueFixture()
      game.requestInputSingle = () => ['Custom']
      expect(() => {
        actionManager.choose(player1, ['Custom'], { title: 'Pick' })
      }).not.toThrow()
    })
  })

  describe('integration with Game instance', () => {
    test('should use game.log for logging', () => {
      const { fixture, actionManager, game } = createUniqueFixture()

      // Verify that actionManager.log is the same as game.log
      expect(actionManager.log).toBe(game.log)

      fixture.assertAllResponsesConsumed()
    })

    test('should call game.requestInputSingle for input', () => {
      const { fixture, actionManager, player1, game } = createUniqueFixture()

      // Track calls to requestInputSingle
      let callCount = 0
      const originalRequestInputSingle = game.requestInputSingle
      game.requestInputSingle = (selector) => {
        callCount++
        return originalRequestInputSingle.call(game, selector)
      }

      // Queue a response and make a choice
      fixture.queueResponse(player1, ['option1'])
      actionManager.choose(player1, ['option1', 'option2'])

      // Verify requestInputSingle was called
      expect(callCount).toBe(1)

      fixture.assertAllResponsesConsumed()
    })

    test('should handle player object correctly', () => {
      const { fixture, actionManager, player1, game } = createUniqueFixture()

      // Mock requestInputSingle to capture selector
      let capturedSelector = null
      game.requestInputSingle = (selector) => {
        capturedSelector = selector
        return ['choice1']
      }

      // Call choose with player object
      actionManager.choose(player1, ['choice1', 'choice2'])

      // Verify player.name is used as actor
      expect(capturedSelector.actor).toBe(player1.name)

      fixture.assertAllResponsesConsumed()
    })
  })

  describe('error handling', () => {
    test('should throw meaningful error for invalid selection count', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()

      // Queue a selection with too many valid options
      fixture.queueResponse(player1, ['option1', 'option2'])

      // Expect specific error message about count
      expect(() => {
        actionManager.choose(player1, ['option1', 'option2'], { max: 1 })
      }).toThrow('Invalid number of options selected')

      fixture.assertAllResponsesConsumed()
    })

    test('should handle missing player gracefully', () => {
      const { fixture, actionManager } = createUniqueFixture()

      // Test with null player - should throw meaningful error
      expect(() => {
        actionManager.choose(null, ['option1', 'option2'])
      }).toThrow()

      fixture.assertAllResponsesConsumed()
    })

    test('should handle malformed choices array', () => {
      const { fixture, actionManager, player1 } = createUniqueFixture()

      // Test with null choices
      expect(() => {
        actionManager.choose(player1, null)
      }).toThrow()

      // Test with undefined choices
      expect(() => {
        actionManager.choose(player1, undefined)
      }).toThrow()

      fixture.assertAllResponsesConsumed()
    })
  })
})
