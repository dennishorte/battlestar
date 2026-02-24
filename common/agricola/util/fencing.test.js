
describe('fenceUtil', () => {
  const { fenceUtil } = require('../agricola.js')

  describe('areSpacesConnected', () => {
    test('empty array is connected', () => {
      expect(fenceUtil.areSpacesConnected([])).toBe(true)
    })

    test('single space is connected', () => {
      expect(fenceUtil.areSpacesConnected([{ row: 0, col: 0 }])).toBe(true)
    })

    test('two adjacent horizontal spaces are connected', () => {
      const spaces = [{ row: 0, col: 0 }, { row: 0, col: 1 }]
      expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
    })

    test('two adjacent vertical spaces are connected', () => {
      const spaces = [{ row: 0, col: 0 }, { row: 1, col: 0 }]
      expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
    })

    test('two diagonal spaces are not connected', () => {
      const spaces = [{ row: 0, col: 0 }, { row: 1, col: 1 }]
      expect(fenceUtil.areSpacesConnected(spaces)).toBe(false)
    })

    test('L-shaped selection is connected', () => {
      const spaces = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
      ]
      expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
    })

    test('non-contiguous spaces are not connected', () => {
      const spaces = [
        { row: 0, col: 0 },
        { row: 0, col: 2 }, // Gap at col 1
      ]
      expect(fenceUtil.areSpacesConnected(spaces)).toBe(false)
    })

    test('2x2 block is connected', () => {
      const spaces = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ]
      expect(fenceUtil.areSpacesConnected(spaces)).toBe(true)
    })
  })

  describe('calculateFenceEdges', () => {
    test('single corner space needs 4 fences (including board edges)', () => {
      const spaces = [{ row: 0, col: 0 }]
      const edges = fenceUtil.calculateFenceEdges(spaces)

      expect(edges['0,0']).toEqual({
        top: true,     // Board edge needs fence
        right: true,   // Interior edge needs fence
        bottom: true,  // Interior edge needs fence
        left: true,    // Board edge needs fence
      })
    })

    test('single center space needs 4 fences', () => {
      const spaces = [{ row: 1, col: 2 }]
      const edges = fenceUtil.calculateFenceEdges(spaces)

      expect(edges['1,2']).toEqual({
        top: true,
        right: true,
        bottom: true,
        left: true,
      })
    })

    test('two horizontal spaces share inner edge', () => {
      const spaces = [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ]
      const edges = fenceUtil.calculateFenceEdges(spaces)

      // Left space: no right fence (shared with neighbor)
      expect(edges['1,1'].right).toBe(false)
      // Right space: no left fence (shared with neighbor)
      expect(edges['1,2'].left).toBe(false)

      // Both need top and bottom
      expect(edges['1,1'].top).toBe(true)
      expect(edges['1,1'].bottom).toBe(true)
      expect(edges['1,2'].top).toBe(true)
      expect(edges['1,2'].bottom).toBe(true)
    })

    test('2x2 block in bottom-right corner has outer edges including board edges', () => {
      const spaces = [
        { row: 1, col: 3 },
        { row: 1, col: 4 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
      ]
      const edges = fenceUtil.calculateFenceEdges(spaces)

      // Top row: top edges need fences (interior)
      expect(edges['1,3'].top).toBe(true)
      expect(edges['1,4'].top).toBe(true)

      // Bottom row: bottom edges need fences (board edge)
      expect(edges['2,3'].bottom).toBe(true)
      expect(edges['2,4'].bottom).toBe(true)

      // Left side (interior)
      expect(edges['1,3'].left).toBe(true)
      expect(edges['2,3'].left).toBe(true)

      // Right side (board edge)
      expect(edges['1,4'].right).toBe(true)
      expect(edges['2,4'].right).toBe(true)

      // Inner edges are all false
      expect(edges['1,3'].right).toBe(false)
      expect(edges['1,3'].bottom).toBe(false)
      expect(edges['1,4'].left).toBe(false)
      expect(edges['1,4'].bottom).toBe(false)
      expect(edges['2,3'].top).toBe(false)
      expect(edges['2,3'].right).toBe(false)
      expect(edges['2,4'].top).toBe(false)
      expect(edges['2,4'].left).toBe(false)
    })

    test('respects existing fences', () => {
      const spaces = [{ row: 1, col: 2 }]
      const existingFences = [
        { row1: 1, col1: 2, row2: 0, col2: 2 }, // Fence on top
      ]
      const edges = fenceUtil.calculateFenceEdges(spaces, existingFences)

      expect(edges['1,2'].top).toBe(false) // Already has fence
      expect(edges['1,2'].right).toBe(true)
      expect(edges['1,2'].bottom).toBe(true)
      expect(edges['1,2'].left).toBe(true)
    })
  })

  describe('countFencesNeeded', () => {
    test('single corner space needs 4 fences (including board edges)', () => {
      const spaces = [{ row: 0, col: 0 }]
      expect(fenceUtil.countFencesNeeded(spaces)).toBe(4)
    })

    test('single edge space needs 4 fences (including board edge)', () => {
      const spaces = [{ row: 0, col: 2 }] // Top edge, middle column
      expect(fenceUtil.countFencesNeeded(spaces)).toBe(4)
    })

    test('single center space needs 4 fences', () => {
      const spaces = [{ row: 1, col: 2 }]
      expect(fenceUtil.countFencesNeeded(spaces)).toBe(4)
    })

    test('two horizontal adjacent spaces need 6 fences', () => {
      // Two spaces in middle: each needs top, bottom, and one side = 3 each
      // But they share a side, so: 4 + 4 - 2 = 6
      const spaces = [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ]
      expect(fenceUtil.countFencesNeeded(spaces)).toBe(6)
    })

    test('2x2 block in corner needs 8 fences (including board edges)', () => {
      // Bottom-right corner: 2 top + 2 bottom (board) + 2 left + 2 right (board) = 8
      const spaces = [
        { row: 1, col: 3 },
        { row: 1, col: 4 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
      ]
      expect(fenceUtil.countFencesNeeded(spaces)).toBe(8)
    })

    test('existing fences reduce count', () => {
      const spaces = [{ row: 1, col: 2 }]
      const existingFences = [
        { row1: 1, col1: 2, row2: 0, col2: 2 }, // Top
        { row1: 1, col1: 2, row2: 1, col2: 1 }, // Left
      ]
      expect(fenceUtil.countFencesNeeded(spaces, existingFences)).toBe(2)
    })
  })

  describe('validatePastureSelection', () => {
    test('empty selection is invalid', () => {
      const result = fenceUtil.validatePastureSelection([])
      expect(result.valid).toBe(false)
      expect(result.error).toBe('No spaces selected')
    })

    test('valid single space selection', () => {
      const spaces = [{ row: 0, col: 0 }]
      const result = fenceUtil.validatePastureSelection(spaces, { wood: 10 })

      expect(result.valid).toBe(true)
      expect(result.fencesNeeded).toBe(4) // All 4 edges including board edges
      expect(result.fenceEdges['0,0']).toBeDefined()
    })

    test('disconnected spaces are invalid', () => {
      const spaces = [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
      ]
      const result = fenceUtil.validatePastureSelection(spaces, { wood: 10 })

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Spaces must be connected')
    })

    test('insufficient wood is invalid', () => {
      const spaces = [{ row: 1, col: 2 }] // Needs 4 fences
      const result = fenceUtil.validatePastureSelection(spaces, { wood: 2 })

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Need 4 wood (have 2)')
      expect(result.fencesNeeded).toBe(4)
      expect(result.fenceEdges).toBeDefined() // Still provides edges for UI
    })

    test('exceeding fence limit is invalid', () => {
      const spaces = [{ row: 1, col: 2 }] // Needs 4 fences
      const result = fenceUtil.validatePastureSelection(spaces, {
        wood: 10,
        currentFenceCount: 13, // Only 2 remaining
        maxFences: 15,
      })

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Need 4 fences (2 remaining)')
    })

    test('invalid space callback rejects selection', () => {
      const spaces = [{ row: 0, col: 0 }]
      const result = fenceUtil.validatePastureSelection(spaces, {
        wood: 10,
        isSpaceValid: (row, col) => row !== 0 || col !== 0, // Reject (0,0)
      })

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid space selected')
    })
  })
})
