const { BaseZone } = require('./BaseZone.js')

// Fixture function for creating fresh test data
const createTestFixture = (kind='public') => {
  // Setup mock game object
  const mockGame = {
    random: jest.fn()
  }

  // Setup mock cards
  const mockCard1 = {
    id: 'card1',
    name: 'Card A',
    setHome: jest.fn(),
    setZone: jest.fn(),
    hide: jest.fn(),
    reveal: jest.fn(),
    show: jest.fn(),
    revealed: jest.fn(),
    visible: jest.fn()
  }

  const mockCard2 = {
    id: 'card2',
    name: 'Card B',
    setHome: jest.fn(),
    setZone: jest.fn(),
    hide: jest.fn(),
    reveal: jest.fn(),
    show: jest.fn(),
    revealed: jest.fn(),
    visible: jest.fn()
  }

  const mockCard3 = {
    id: 'card3',
    name: 'Card C',
    setHome: jest.fn(),
    setZone: jest.fn(),
    hide: jest.fn(),
    reveal: jest.fn(),
    show: jest.fn(),
    revealed: jest.fn(),
    visible: jest.fn()
  }

  const zone = new BaseZone(mockGame, 'test-zone', 'Test Zone', kind)

  return {
    mockGame,
    mockCard1,
    mockCard2,
    mockCard3,
    zone
  }
}

describe('BaseZone', () => {
  // ============================================================================
  // CONSTRUCTOR TESTS
  // ============================================================================

  describe('constructor', () => {
    test('should initialize with correct properties', () => {
      const { zone } = createTestFixture()

      expect(zone.id).toBe('test-zone')
      expect(zone._name).toBe('Test Zone')
      expect(zone._kind).toBe('public')
      expect(zone._owner).toBeNull()
      expect(zone._cards).toEqual([])
      expect(zone._initialized).toBe(false)
    })

    test('should set game reference', () => {
      const { mockGame, zone } = createTestFixture()

      expect(zone.game).toBe(mockGame)
    })

    test('should set id, name, kind, and (optionally) owner', () => {
      const mockGame = { random: jest.fn() }
      const mockOwner = { name: 'test-player' }

      const zone = new BaseZone(mockGame, 'my-zone', 'My Zone', 'private', mockOwner)

      expect(zone.id).toBe('my-zone')
      expect(zone._name).toBe('My Zone')
      expect(zone._kind).toBe('private')
      expect(zone._owner).toBe(mockOwner)
    })

    test('should initialize empty cards array', () => {
      const { zone } = createTestFixture()

      expect(zone._cards).toEqual([])
      expect(zone.cards()).toEqual([])
    })

    test('should set owner to null by default', () => {
      const mockGame = { random: jest.fn() }

      const zone = new BaseZone(mockGame, 'test-zone', 'Test Zone', 'public')

      expect(zone._owner).toBeNull()
      expect(zone.owner()).toBeNull()
    })
  })

  // ============================================================================
  // BASIC GETTER TESTS
  // ============================================================================

  describe('cards()', () => {
    test('should return a copy of the cards array', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2])
      const cardsCopy = zone.cards()

      expect(cardsCopy).toEqual([mockCard1, mockCard2])
      expect(cardsCopy).not.toBe(zone._cards) // Should be a different array reference
    })

    test('should return empty array when no cards', () => {
      const { zone } = createTestFixture()

      expect(zone.cards()).toEqual([])
    })

    test('should not allow modification of returned array to affect internal state', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2])
      const cardsCopy = zone.cards()

      // Modify the returned array
      cardsCopy.push({ id: 'new-card', name: 'New Card' })

      // Internal state should remain unchanged
      expect(zone.cards()).toEqual([mockCard1, mockCard2])
      expect(zone._cards).toEqual([mockCard1, mockCard2])
    })
  })

  describe('owner()', () => {
    test('should return the owner', () => {
      const mockGame = { random: jest.fn() }
      const mockOwner = { name: 'test-player' }

      const zone = new BaseZone(mockGame, 'test-zone', 'Test Zone', 'private', mockOwner)

      expect(zone.owner()).toBe(mockOwner)
    })

    test('should return null when no owner set', () => {
      const { zone } = createTestFixture()

      expect(zone.owner()).toBeNull()
    })
  })

  // ============================================================================
  // CARD INITIALIZATION TESTS
  // ============================================================================

  describe('initializeCards()', () => {
    test('should set cards array with provided cards', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      expect(zone._cards).toEqual([mockCard1, mockCard2, mockCard3])
      expect(zone.cards()).toEqual([mockCard1, mockCard2, mockCard3])
    })

    test('should call setHome on each card with zone reference', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2])

      expect(mockCard1.setHome).toHaveBeenCalledWith(zone)
      expect(mockCard2.setHome).toHaveBeenCalledWith(zone)
    })

    test('should call _updateCardVisibility on each card', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      // Spy on the _updateCardVisibility method
      const updateVisibilitySpy = jest.spyOn(zone, '_updateCardVisibility')

      zone.initializeCards([mockCard1, mockCard2])

      expect(updateVisibilitySpy).toHaveBeenCalledWith(mockCard1)
      expect(updateVisibilitySpy).toHaveBeenCalledWith(mockCard2)
      expect(updateVisibilitySpy).toHaveBeenCalledTimes(2)

      updateVisibilitySpy.mockRestore()
    })

    test('should handle empty array', () => {
      const { zone } = createTestFixture()

      zone.initializeCards([])

      expect(zone._cards).toEqual([])
      expect(zone.cards()).toEqual([])
    })

    test('should throw error if called multiple times', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1])

      expect(() => {
        zone.initializeCards([mockCard2])
      }).toThrow('Zone already initialized')
    })
  })

  // ============================================================================
  // CARD MANIPULATION TESTS
  // ============================================================================

  describe('push()', () => {
    describe('without index parameter', () => {
      test('should add card to end of array', () => {
        const { zone, mockCard1, mockCard2 } = createTestFixture()

        zone.initializeCards([mockCard1])
        zone.push(mockCard2)

        expect(zone.cards()).toEqual([mockCard1, mockCard2])
      })

      test('should call _updateCardVisibility on added card', () => {
        const { zone, mockCard1, mockCard2 } = createTestFixture()

        const updateVisibilitySpy = jest.spyOn(zone, '_updateCardVisibility')

        zone.initializeCards([mockCard1])
        zone.push(mockCard2)

        expect(updateVisibilitySpy).toHaveBeenCalledWith(mockCard2)

        updateVisibilitySpy.mockRestore()
      })

      test('should handle multiple cards pushed in sequence', () => {
        const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

        zone.push(mockCard1)
        zone.push(mockCard2)
        zone.push(mockCard3)

        expect(zone.cards()).toEqual([mockCard1, mockCard2, mockCard3])
      })
    })

    describe('with index parameter', () => {
      test('should insert card at specified index', () => {
        const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

        zone.initializeCards([mockCard1, mockCard3])
        zone.push(mockCard2, 1)

        expect(zone.cards()).toEqual([mockCard1, mockCard2, mockCard3])
      })

      test('should insert at beginning when index is 0', () => {
        const { zone, mockCard1, mockCard2 } = createTestFixture()

        zone.initializeCards([mockCard2])
        zone.push(mockCard1, 0)

        expect(zone.cards()).toEqual([mockCard1, mockCard2])
      })

      test('should insert at end when index equals array length', () => {
        const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

        zone.initializeCards([mockCard1, mockCard2])
        zone.push(mockCard3, 2)

        expect(zone.cards()).toEqual([mockCard1, mockCard2, mockCard3])
      })

      test('should call _updateCardVisibility on added card', () => {
        const { zone, mockCard1, mockCard2 } = createTestFixture()

        const updateVisibilitySpy = jest.spyOn(zone, '_updateCardVisibility')

        zone.initializeCards([mockCard1])
        zone.push(mockCard2, 0)

        expect(updateVisibilitySpy).toHaveBeenCalledWith(mockCard2)

        updateVisibilitySpy.mockRestore()
      })

      test('should throw error when index is out of bounds', () => {
        const { zone, mockCard1, mockCard2 } = createTestFixture()

        zone.initializeCards([mockCard1])

        expect(() => {
          zone.push(mockCard2, 3)
        }).toThrow('Index out of bounds: 3')
      })

      test('should handle negative indices correctly', () => {
        const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

        zone.initializeCards([mockCard1, mockCard3])
        zone.push(mockCard2, -1) // Insert before the last element

        expect(zone.cards()).toEqual([mockCard1, mockCard2, mockCard3])
      })
    })
  })

  describe('peek()', () => {
    test('should return top card (index 0) by default', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2])

      expect(zone.peek()).toBe(mockCard1)
    })

    test('should return card at specified index', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      expect(zone.peek(1)).toBe(mockCard2)
      expect(zone.peek(2)).toBe(mockCard3)
    })

    test('should return undefined for out of bounds index', () => {
      const { zone, mockCard1 } = createTestFixture()

      zone.initializeCards([mockCard1])

      expect(zone.peek(5)).toBeUndefined()
    })

    test('should handle negative indices', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      expect(zone.peek(-1)).toBe(mockCard3)
      expect(zone.peek(-2)).toBe(mockCard2)
      expect(zone.peek(-3)).toBe(mockCard1)
    })

    test('should return undefined when zone is empty', () => {
      const { zone } = createTestFixture()

      expect(zone.peek()).toBeUndefined()
      expect(zone.peek(0)).toBeUndefined()
      expect(zone.peek(-1)).toBeUndefined()
    })
  })

  describe('remove()', () => {
    test('should remove specified card from array', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.remove(mockCard2)

      expect(zone.cards()).toEqual([mockCard1, mockCard3])
    })

    test('should throw error when card not found', () => {
      const { zone, mockCard1 } = createTestFixture()
      const nonExistentCard = { id: 'non-existent', name: 'Non Existent' }

      zone.initializeCards([mockCard1])

      expect(() => {
        zone.remove(nonExistentCard)
      }).toThrow('Card (non-existent) not found in zone (test-zone)')
    })

    test('should maintain order of remaining cards', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.remove(mockCard2)

      expect(zone.cards()).toEqual([mockCard1, mockCard3])
    })

    test('should handle removing first card', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.remove(mockCard1)

      expect(zone.cards()).toEqual([mockCard2, mockCard3])
    })

    test('should handle removing last card', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.remove(mockCard3)

      expect(zone.cards()).toEqual([mockCard1, mockCard2])
    })

    test('should handle removing middle card', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.remove(mockCard2)

      expect(zone.cards()).toEqual([mockCard1, mockCard3])
    })
  })

  // ============================================================================
  // MISC TESTS
  // ============================================================================

  describe('random()', () => {
    test('should return a random card from the zone', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.game.random.mockReturnValue(.4)

      const randomCard = zone.random()

      expect(zone.game.random).toHaveBeenCalled()
      expect(randomCard).toBe(mockCard2)
    })

    test('should return undefined when zone is empty', () => {
      const { zone } = createTestFixture()

      expect(zone.random()).toBeUndefined()
    })
  })

  // ============================================================================
  // ORDERING TESTS
  // ============================================================================

  describe('shuffle()', () => {
    test('should shuffle all cards in the zone', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.shuffle()

      // The cards should still be the same, but potentially in different order
      expect(zone.cards()).toHaveLength(3)
      expect(zone.cards()).toEqual(expect.arrayContaining([mockCard1, mockCard2, mockCard3]))
    })

    test('should use game.random for shuffling', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2])

      zone.shuffle()

      expect(zone.game.random).toHaveBeenCalled()
    })

    test('should maintain same number of cards', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      const originalLength = zone.cards().length

      zone.shuffle()

      expect(zone.cards()).toHaveLength(originalLength)
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1])

      expect(() => {
        zone.shuffle()
      }).not.toThrow()

      expect(zone.cards()).toEqual([mockCard1])
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.shuffle()
      }).not.toThrow()

      expect(zone.cards()).toEqual([])
    })
  })

  describe('shuffleTop()', () => {
    test('should shuffle only the top N cards', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      zone.shuffleTop(2)

      // Bottom card should remain in same position
      expect(zone.cards()[2]).toBe(mockCard3)
      // Top 2 cards should still be present but potentially reordered
      expect(zone.cards().slice(0, 2)).toEqual(expect.arrayContaining([mockCard1, mockCard2]))
    })

    test('should maintain order of bottom cards', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      zone.shuffleTop(2)

      // The third card should remain in the same position
      expect(zone.cards()[2]).toBe(mockCard3)
    })

    test('should use game.random for shuffling', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      zone.shuffleTop(2)

      expect(zone.game.random).toHaveBeenCalled()
    })

    test('should throw error for invalid count (0)', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleTop(0)
      }).toThrow('Invalid count: 0')
    })

    test('should throw error for invalid count (negative)', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleTop(-1)
      }).toThrow('Invalid count: -1')
    })

    test('should throw error for count greater than array length', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleTop(5)
      }).toThrow('Invalid count: 5')
    })

    test('should handle count equal to array length', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleTop(2)
      }).not.toThrow()

      expect(zone.cards()).toHaveLength(2)
      expect(zone.cards()).toEqual(expect.arrayContaining([mockCard1, mockCard2]))
    })

    test('should handle count of 1', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      expect(() => {
        zone.shuffleTop(1)
      }).not.toThrow()

      // Only the first card should be affected
      expect(zone.cards()[0]).toBe(mockCard1) // Single card shuffle doesn't change order
      expect(zone.cards()[1]).toBe(mockCard2)
      expect(zone.cards()[2]).toBe(mockCard3)
    })
  })

  describe('shuffleBottom()', () => {
    test('should shuffle only the bottom N cards', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      zone.shuffleBottom(2)

      // Top card should remain in same position
      expect(zone.cards()[0]).toBe(mockCard1)
      // Bottom 2 cards should still be present but potentially reordered
      expect(zone.cards().slice(1, 3)).toEqual(expect.arrayContaining([mockCard2, mockCard3]))
    })

    test('should maintain order of top cards', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      zone.shuffleBottom(2)

      // The first card should remain in the same position
      expect(zone.cards()[0]).toBe(mockCard1)
    })

    test('should use game.random for shuffling', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      zone.shuffleBottom(2)

      expect(zone.game.random).toHaveBeenCalled()
    })

    test('should throw error for invalid count (0)', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleBottom(0)
      }).toThrow('Invalid count: 0')
    })

    test('should throw error for invalid count (negative)', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleBottom(-1)
      }).toThrow('Invalid count: -1')
    })

    test('should throw error for count greater than array length', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleBottom(5)
      }).toThrow('Invalid count: 5')
    })

    test('should handle count equal to array length', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2])

      expect(() => {
        zone.shuffleBottom(2)
      }).not.toThrow()

      expect(zone.cards()).toHaveLength(2)
      expect(zone.cards()).toEqual(expect.arrayContaining([mockCard1, mockCard2]))
    })

    test('should handle count of 1', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.game.random = undefined  // Use Math.random instead of the mock
      zone.initializeCards([mockCard1, mockCard2, mockCard3])

      expect(() => {
        zone.shuffleBottom(1)
      }).not.toThrow()

      // Only the last card should be affected
      expect(zone.cards()[0]).toBe(mockCard1)
      expect(zone.cards()[1]).toBe(mockCard2)
      expect(zone.cards()[2]).toBe(mockCard3) // Single card shuffle doesn't change order
    })
  })

  describe('shuffleBottomVisible()', () => {
    test('should throw "not implemented" error', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.shuffleBottomVisible()
      }).toThrow('not implemented')
    })
  })

  describe('sort()', () => {
    test('should sort cards using provided comparison function', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      // Create cards with numeric values for sorting
      const cardA = { ...mockCard1, value: 3 }
      const cardB = { ...mockCard2, value: 1 }
      const cardC = { ...mockCard3, value: 2 }

      zone.initializeCards([cardA, cardB, cardC])

      zone.sort((a, b) => a.value - b.value)

      expect(zone.cards()).toEqual([cardB, cardC, cardA])
    })

    test('should sort in ascending order with simple numeric comparison', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      const cardA = { ...mockCard1, value: 5 }
      const cardB = { ...mockCard2, value: 2 }
      const cardC = { ...mockCard3, value: 8 }

      zone.initializeCards([cardA, cardB, cardC])

      zone.sort((a, b) => a.value - b.value)

      expect(zone.cards().map(c => c.value)).toEqual([2, 5, 8])
    })

    test('should sort in descending order with reverse comparison', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      const cardA = { ...mockCard1, value: 5 }
      const cardB = { ...mockCard2, value: 2 }
      const cardC = { ...mockCard3, value: 8 }

      zone.initializeCards([cardA, cardB, cardC])

      zone.sort((a, b) => b.value - a.value)

      expect(zone.cards().map(c => c.value)).toEqual([8, 5, 2])
    })

    test('should handle empty array', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.sort((a, b) => a.value - b.value)
      }).not.toThrow()

      expect(zone.cards()).toEqual([])
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture()

      zone.initializeCards([mockCard1])

      expect(() => {
        zone.sort((a, b) => a.name.localeCompare(b.name))
      }).not.toThrow()

      expect(zone.cards()).toEqual([mockCard1])
    })
  })

  describe('sortByName()', () => {
    test('should sort cards alphabetically by name', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      const cardA = { ...mockCard1, name: 'Zebra' }
      const cardB = { ...mockCard2, name: 'Alpha' }
      const cardC = { ...mockCard3, name: 'Beta' }

      zone.initializeCards([cardA, cardB, cardC])

      zone.sortByName()

      expect(zone.cards()).toEqual([cardB, cardC, cardA])
    })

    test('should handle case-sensitive sorting', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      const cardA = { ...mockCard1, name: 'alpha' }
      const cardB = { ...mockCard3, name: 'BETA' }
      const cardC = { ...mockCard2, name: 'Alpha' }

      zone.initializeCards([cardA, cardB, cardC])

      zone.sortByName()

      expect(zone.cards()).toEqual([cardA, cardC, cardB])
    })

    test('should handle empty array', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.sortByName()
      }).not.toThrow()

      expect(zone.cards()).toEqual([])
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture()

      zone.initializeCards([mockCard1])

      expect(() => {
        zone.sortByName()
      }).not.toThrow()

      expect(zone.cards()).toEqual([mockCard1])
    })

    test('should handle cards with same name', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      const cardA = { ...mockCard1, name: 'Same' }
      const cardB = { ...mockCard2, name: 'Same' }
      const cardC = { ...mockCard3, name: 'Different' }

      zone.initializeCards([cardA, cardB, cardC])

      zone.sortByName()

      // Cards with same name should maintain relative order
      expect(zone.cards()[0]).toBe(cardC) // 'Different' comes first
      expect(zone.cards().slice(1)).toEqual(expect.arrayContaining([cardA, cardB]))
    })
  })

  // ============================================================================
  // VISIBILITY TESTS
  // ============================================================================

  describe('hide()', () => {
    test('should call hide() on all cards in zone', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.hide()

      expect(mockCard1.hide).toHaveBeenCalled()
      expect(mockCard2.hide).toHaveBeenCalled()
      expect(mockCard3.hide).toHaveBeenCalled()
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.hide()
      }).not.toThrow()
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture()

      zone.initializeCards([mockCard1])
      zone.hide()

      expect(mockCard1.hide).toHaveBeenCalledTimes(1)
    })

    test('should handle multiple cards', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2])
      zone.hide()

      expect(mockCard1.hide).toHaveBeenCalledTimes(1)
      expect(mockCard2.hide).toHaveBeenCalledTimes(1)
    })
  })

  describe('reveal()', () => {
    test('should call reveal() on all cards in zone', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.reveal()

      expect(mockCard1.reveal).toHaveBeenCalled()
      expect(mockCard2.reveal).toHaveBeenCalled()
      expect(mockCard3.reveal).toHaveBeenCalled()
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.reveal()
      }).not.toThrow()
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture('private')

      zone.initializeCards([mockCard1])
      zone.reveal()

      expect(mockCard1.reveal).toHaveBeenCalledTimes(1)
    })

    test('should handle multiple cards', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture('private')

      zone.initializeCards([mockCard1, mockCard2])
      zone.reveal()

      expect(mockCard1.reveal).toHaveBeenCalledTimes(1)
      expect(mockCard2.reveal).toHaveBeenCalledTimes(1)
    })
  })

  describe('revealNext()', () => {
    test('should reveal first unrevealed card', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture('private')

      // Mock the revealed() method to return different states
      mockCard1.revealed = jest.fn().mockReturnValue(true)
      mockCard2.revealed = jest.fn().mockReturnValue(false)
      mockCard3.revealed = jest.fn().mockReturnValue(false)

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.revealNext()

      expect(mockCard2.reveal).toHaveBeenCalled()
      expect(mockCard3.reveal).not.toHaveBeenCalled()
    })

    test('should do nothing when all cards are already revealed', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture('private')

      mockCard1.revealed = jest.fn().mockReturnValue(true)
      mockCard2.revealed = jest.fn().mockReturnValue(true)

      zone.initializeCards([mockCard1, mockCard2])
      zone.revealNext()

      expect(mockCard1.reveal).not.toHaveBeenCalled()
      expect(mockCard2.reveal).not.toHaveBeenCalled()
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.revealNext()
      }).not.toThrow()
    })

    test('should reveal only one card even if multiple are hidden', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture('private')

      mockCard1.revealed = jest.fn().mockReturnValue(false)
      mockCard2.revealed = jest.fn().mockReturnValue(false)
      mockCard3.revealed = jest.fn().mockReturnValue(false)

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.revealNext()

      expect(mockCard1.reveal).toHaveBeenCalled()
      expect(mockCard2.reveal).not.toHaveBeenCalled()
      expect(mockCard3.reveal).not.toHaveBeenCalled()
    })
  })

  describe('revealRandom()', () => {
    test('should reveal a random card from the zone', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.game.random.mockReturnValue(0.5) // Mock to return middle card

      zone.revealRandom()

      expect(zone.game.random).toHaveBeenCalled()
      expect(mockCard2.reveal).toHaveBeenCalled()
    })

    test('should use game.random for selection', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()

      zone.initializeCards([mockCard1, mockCard2])
      zone.game.random.mockReturnValue(0.0) // Mock to return first card

      zone.revealRandom()

      expect(zone.game.random).toHaveBeenCalled()
      expect(mockCard1.reveal).toHaveBeenCalled()
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()

      expect(() => {
        zone.revealRandom()
      }).toThrow('Cannot read properties of undefined (reading \'reveal\')')
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture()

      zone.initializeCards([mockCard1])
      zone.game.random.mockReturnValue(0.0) // Mock to return first card

      zone.revealRandom()

      expect(mockCard1.reveal).toHaveBeenCalled()
    })
  })

  describe('show()', () => {
    test('should call show(player) on all cards in zone', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.show(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
      expect(mockCard2.show).toHaveBeenCalledWith(mockPlayer)
      expect(mockCard3.show).toHaveBeenCalledWith(mockPlayer)
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      expect(() => {
        zone.show(mockPlayer)
      }).not.toThrow()
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1])
      zone.show(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
    })

    test('should handle multiple cards', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1, mockCard2])
      zone.show(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
      expect(mockCard2.show).toHaveBeenCalledWith(mockPlayer)
    })

    test('should pass correct player parameter', () => {
      const { zone, mockCard1 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1])
      zone.show(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
    })
  })

  describe('showNext()', () => {
    test('should show first card not visible to player', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      mockCard1.visible = jest.fn().mockReturnValue(true)
      mockCard2.visible = jest.fn().mockReturnValue(false)
      mockCard3.visible = jest.fn().mockReturnValue(false)

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.showNext(mockPlayer)

      expect(mockCard2.show).toHaveBeenCalledWith(mockPlayer)
      expect(mockCard3.show).not.toHaveBeenCalled()
    })

    test('should do nothing when all cards are already visible to player', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      mockCard1.visible = jest.fn().mockReturnValue(true)
      mockCard2.visible = jest.fn().mockReturnValue(true)

      zone.initializeCards([mockCard1, mockCard2])
      zone.showNext(mockPlayer)

      expect(mockCard1.show).not.toHaveBeenCalled()
      expect(mockCard2.show).not.toHaveBeenCalled()
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      expect(() => {
        zone.showNext(mockPlayer)
      }).not.toThrow()
    })

    test('should show only one card even if multiple are hidden', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      mockCard1.visible = jest.fn().mockReturnValue(false)
      mockCard2.visible = jest.fn().mockReturnValue(false)
      mockCard3.visible = jest.fn().mockReturnValue(false)

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.showNext(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
      expect(mockCard2.show).not.toHaveBeenCalled()
      expect(mockCard3.show).not.toHaveBeenCalled()
    })

    test('should pass correct player parameter', () => {
      const { zone, mockCard1 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      mockCard1.visible = jest.fn().mockReturnValue(false)

      zone.initializeCards([mockCard1])
      zone.showNext(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
    })
  })

  describe('showRandom()', () => {
    test('should show a random card to the specified player', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1, mockCard2, mockCard3])
      zone.game.random.mockReturnValue(0.5) // Mock to return middle card

      zone.showRandom(mockPlayer)

      expect(zone.game.random).toHaveBeenCalled()
      expect(mockCard2.show).toHaveBeenCalledWith(mockPlayer)
    })

    test('should use game.random for selection', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1, mockCard2])
      zone.game.random.mockReturnValue(0.0) // Mock to return first card

      zone.showRandom(mockPlayer)

      expect(zone.game.random).toHaveBeenCalled()
      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
    })

    test('should handle empty zone', () => {
      const { zone } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      expect(() => {
        zone.showRandom(mockPlayer)
      }).toThrow('Cannot read properties of undefined (reading \'show\')')
    })

    test('should handle single card', () => {
      const { zone, mockCard1 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1])
      zone.game.random.mockReturnValue(0.0) // Mock to return first card

      zone.showRandom(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
    })

    test('should pass correct player parameter', () => {
      const { zone, mockCard1 } = createTestFixture()
      const mockPlayer = { id: 'player1', name: 'Player 1' }

      zone.initializeCards([mockCard1])
      zone.game.random.mockReturnValue(0.0) // Mock to return first card

      zone.showRandom(mockPlayer)

      expect(mockCard1.show).toHaveBeenCalledWith(mockPlayer)
    })
  })

  // ============================================================================
  // PROTECTED METHOD TESTS
  // ============================================================================

  describe('_updateCardVisibility()', () => {
    describe('public zone kind', () => {
      test('should call reveal() on card', () => {
        const { zone, mockCard1 } = createTestFixture('public')

        zone._updateCardVisibility(mockCard1)

        expect(mockCard1.reveal).toHaveBeenCalled()
      })
    })

    describe('private zone kind', () => {
      test('should call show(owner) on card', () => {
        const mockGame = { random: jest.fn() }
        const mockOwner = { id: 'owner1', name: 'Owner' }
        const zone = new BaseZone(mockGame, 'test-zone', 'Test Zone', 'private', mockOwner)
        const { mockCard1 } = createTestFixture()

        zone._updateCardVisibility(mockCard1)

        expect(mockCard1.show).toHaveBeenCalledWith(mockOwner)
      })

      test('should handle undefined owner', () => {
        const { zone, mockCard1 } = createTestFixture('private')

        zone._updateCardVisibility(mockCard1)

        expect(mockCard1.show).toHaveBeenCalledWith(null)
      })
    })

    describe('hidden zone kind', () => {
      test('should call hide() on card', () => {
        const { zone, mockCard1 } = createTestFixture('hidden')

        zone._updateCardVisibility(mockCard1)

        expect(mockCard1.hide).toHaveBeenCalled()
      })
    })

    describe('unknown zone kind', () => {
      test('should throw error for unknown zone kind', () => {
        const mockGame = { random: jest.fn() }
        const zone = new BaseZone(mockGame, 'test-zone', 'Test Zone', 'unknown')
        const { mockCard1 } = createTestFixture()

        expect(() => {
          zone._updateCardVisibility(mockCard1)
        }).toThrow('Unknown zone kind: unknown')
      })
    })
  })

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('integration scenarios', () => {
    test('should handle complete card lifecycle: initialize -> push -> shuffle -> remove', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      // Initialize cards
      zone.initializeCards([mockCard1, mockCard2])
      expect(zone.cards()).toEqual([mockCard1, mockCard2])

      // Push additional card
      zone.push(mockCard3)
      expect(zone.cards()).toEqual([mockCard1, mockCard2, mockCard3])

      // Shuffle cards
      zone.shuffle()
      expect(zone.cards()).toHaveLength(3)
      // Note: We can't reliably test the exact order after shuffle, just that all cards are present

      // Remove a card
      zone.remove(mockCard2)
      expect(zone.cards()).toHaveLength(2)
      expect(zone.cards()).not.toContain(mockCard2)
    })

    test('should maintain visibility state through card operations', () => {
      const { zone, mockCard1, mockCard2 } = createTestFixture('public')

      // Initialize cards (should call reveal due to public zone)
      zone.initializeCards([mockCard1, mockCard2])
      expect(mockCard1.reveal).toHaveBeenCalled()
      expect(mockCard2.reveal).toHaveBeenCalled()

      // Hide all cards
      zone.hide()
      expect(mockCard1.hide).toHaveBeenCalled()
      expect(mockCard2.hide).toHaveBeenCalled()

      // Push new card (should call reveal due to public zone)
      const mockCard3 = {
        id: 'card3',
        name: 'Card C',
        setHome: jest.fn(),
        hide: jest.fn(),
        reveal: jest.fn(),
        show: jest.fn(),
        revealed: jest.fn(),
        visible: jest.fn()
      }
      zone.push(mockCard3)
      expect(mockCard3.reveal).toHaveBeenCalled()
    })

    test('should work with different zone kinds (public, private, hidden)', () => {
      const mockGame = { random: jest.fn() }
      const mockOwner = { id: 'owner1', name: 'Owner' }
      const { mockCard1, mockCard2, mockCard3 } = createTestFixture()

      // Test public zone
      const publicZone = new BaseZone(mockGame, 'public-zone', 'Public Zone', 'public')
      publicZone._updateCardVisibility(mockCard1)
      expect(mockCard1.reveal).toHaveBeenCalled()

      // Test private zone
      const privateZone = new BaseZone(mockGame, 'private-zone', 'Private Zone', 'private', mockOwner)
      privateZone._updateCardVisibility(mockCard2)
      expect(mockCard2.show).toHaveBeenCalledWith(mockOwner)

      // Test hidden zone
      const hiddenZone = new BaseZone(mockGame, 'hidden-zone', 'Hidden Zone', 'hidden')
      hiddenZone._updateCardVisibility(mockCard3)
      expect(mockCard3.hide).toHaveBeenCalled()
    })

    test('should handle complex operations in sequence', () => {
      const { zone, mockCard1, mockCard2, mockCard3 } = createTestFixture()

      // Initialize with cards
      zone.initializeCards([mockCard1, mockCard2])
      expect(zone.cards()).toEqual([mockCard1, mockCard2])

      // Push card at specific index
      zone.push(mockCard3, 1)
      expect(zone.cards()).toEqual([mockCard1, mockCard3, mockCard2])

      // Shuffle top 2 cards
      zone.shuffleTop(2)
      expect(zone.cards()).toHaveLength(3)
      // Note: We can't reliably test the exact order after shuffle, just that all cards are present

      // Sort by name
      zone.sortByName()
      expect(zone.cards()).toHaveLength(3)

      // Remove middle card
      const middleCard = zone.cards()[1]
      zone.remove(middleCard)
      expect(zone.cards()).toHaveLength(2)

      // Peek at top card
      const topCard = zone.peek()
      expect(topCard).toBe(zone.cards()[0])
    })
  })
})
