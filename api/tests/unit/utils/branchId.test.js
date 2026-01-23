import { describe, it, expect } from 'vitest'
import { shouldUpdateBranchId } from '../../../src/utils/branchId.js'

describe('shouldUpdateBranchId', () => {
  describe('when no previous waiting state', () => {
    it('should return true (first save)', () => {
      const result = shouldUpdateBranchId(null, { players: ['player1'], concurrent: false })
      expect(result).toBe(true)
    })

    it('should return true even if current is also null', () => {
      const result = shouldUpdateBranchId(null, null)
      expect(result).toBe(true)
    })
  })

  describe('when game is no longer waiting (game over or no input needed)', () => {
    it('should return true when transitioning to null', () => {
      const previous = { players: ['player1'], concurrent: false }
      const result = shouldUpdateBranchId(previous, null)
      expect(result).toBe(true)
    })
  })

  describe('concurrent mode (drafting)', () => {
    it('should return false when staying in concurrent mode', () => {
      const previous = { players: ['player1', 'player2'], concurrent: true }
      const current = { players: ['player1', 'player2'], concurrent: true }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(false)
    })

    it('should return false when players change but still concurrent', () => {
      const previous = { players: ['player1', 'player2'], concurrent: true }
      const current = { players: ['player2', 'player3'], concurrent: true }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(false)
    })

    it('should return false when players are removed in concurrent mode', () => {
      const previous = { players: ['player1', 'player2', 'player3'], concurrent: true }
      const current = { players: ['player2'], concurrent: true }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(false)
    })

    it('should return true when leaving concurrent mode', () => {
      const previous = { players: ['player1', 'player2'], concurrent: true }
      const current = { players: ['player1'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(true)
    })
  })

  describe('non-concurrent mode (sequential/simultaneous)', () => {
    describe('collecting responses (players being removed)', () => {
      it('should return false when one player responds', () => {
        const previous = { players: ['player1', 'player2'], concurrent: false }
        const current = { players: ['player2'], concurrent: false }
        const result = shouldUpdateBranchId(previous, current)
        expect(result).toBe(false)
      })

      it('should return false when multiple players respond', () => {
        const previous = { players: ['player1', 'player2', 'player3'], concurrent: false }
        const current = { players: ['player3'], concurrent: false }
        const result = shouldUpdateBranchId(previous, current)
        expect(result).toBe(false)
      })

      it('should return false when same players are still waiting', () => {
        const previous = { players: ['player1', 'player2'], concurrent: false }
        const current = { players: ['player1', 'player2'], concurrent: false }
        const result = shouldUpdateBranchId(previous, current)
        expect(result).toBe(false)
      })
    })

    describe('new players added (game advanced)', () => {
      it('should return true when a new player is added', () => {
        const previous = { players: ['player1'], concurrent: false }
        const current = { players: ['player2'], concurrent: false }
        const result = shouldUpdateBranchId(previous, current)
        expect(result).toBe(true)
      })

      it('should return true when multiple new players are added', () => {
        const previous = { players: ['player1'], concurrent: false }
        const current = { players: ['player2', 'player3'], concurrent: false }
        const result = shouldUpdateBranchId(previous, current)
        expect(result).toBe(true)
      })

      it('should return true when some players remain but new one added', () => {
        const previous = { players: ['player1', 'player2'], concurrent: false }
        const current = { players: ['player2', 'player3'], concurrent: false }
        const result = shouldUpdateBranchId(previous, current)
        expect(result).toBe(true)
      })
    })
  })

  describe('real-world scenarios', () => {
    it('Innovation: turn-based should update after each turn', () => {
      // Player1 takes turn, now Player2 is waiting
      const previous = { players: ['player1'], concurrent: false }
      const current = { players: ['player2'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(true)
    })

    it('Innovation: first picks should not update while collecting', () => {
      // Both players need to pick, player1 picks first
      const previous = { players: ['player1', 'player2'], concurrent: false }
      const current = { players: ['player2'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(false)
    })

    it('Innovation: first picks should update when all collected', () => {
      // All picked, game advances to turn phase
      const previous = { players: ['player2'], concurrent: false }
      const current = { players: ['player1'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(true)
    })

    it('Magic Draft: should never update during draft', () => {
      // Player1 drafts, player2 drafts, player3 drafts - all concurrent
      const scenarios = [
        { prev: ['p1', 'p2', 'p3'], curr: ['p1', 'p2', 'p3'] },
        { prev: ['p1', 'p2', 'p3'], curr: ['p2', 'p3'] },
        { prev: ['p2', 'p3'], curr: ['p1', 'p2', 'p3'] },  // Packs passed
        { prev: ['p1', 'p2'], curr: ['p2', 'p3'] },        // Different players waiting
      ]

      for (const { prev, curr } of scenarios) {
        const previous = { players: prev, concurrent: true }
        const current = { players: curr, concurrent: true }
        const result = shouldUpdateBranchId(previous, current)
        expect(result).toBe(false)
      }
    })

    it('Magic Draft: should update when draft ends', () => {
      // Draft phase ends, moving to deck building
      const previous = { players: ['p1', 'p2', 'p3'], concurrent: true }
      const current = { players: ['p1'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle empty player arrays', () => {
      const previous = { players: [], concurrent: false }
      const current = { players: ['player1'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(true)
    })

    it('should handle missing players property', () => {
      const previous = { concurrent: false }
      const current = { players: ['player1'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(true)
    })

    it('should handle undefined players property', () => {
      const previous = { players: undefined, concurrent: false }
      const current = { players: ['player1'], concurrent: false }
      const result = shouldUpdateBranchId(previous, current)
      expect(result).toBe(true)
    })
  })
})
