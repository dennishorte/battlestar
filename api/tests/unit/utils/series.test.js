import { describe, it, expect } from 'vitest'
import {
  stripTrailingRematchSuffix,
  seriesDisplayName,
  resolveSeriesFromGame,
  extractWinners,
  gameEntryFromGame,
} from '../../../src/utils/series.js'

describe('series utils', () => {
  describe('stripTrailingRematchSuffix', () => {
    it('strips a trailing -N suffix', () => {
      expect(stripTrailingRematchSuffix('red-cherry-2')).toBe('red-cherry')
      expect(stripTrailingRematchSuffix('red-cherry-12')).toBe('red-cherry')
    })

    it('leaves names without a numeric suffix alone', () => {
      expect(stripTrailingRematchSuffix('red-cherry')).toBe('red-cherry')
      expect(stripTrailingRematchSuffix('brave-meadow')).toBe('brave-meadow')
    })
  })

  describe('seriesDisplayName', () => {
    it('uses the base name for index 1', () => {
      expect(seriesDisplayName('red-cherry', 1)).toBe('red-cherry')
    })

    it('appends the index for rematches', () => {
      expect(seriesDisplayName('red-cherry', 2)).toBe('red-cherry-2')
      expect(seriesDisplayName('red-cherry', 3)).toBe('red-cherry-3')
    })
  })

  describe('resolveSeriesFromGame', () => {
    it('uses the game id as seriesId when unset', () => {
      const game = {
        _id: 'game-1',
        settings: { name: 'red-cherry' },
      }
      expect(resolveSeriesFromGame(game)).toEqual({
        seriesId: 'game-1',
        seriesBaseName: 'red-cherry',
        seriesIndex: 1,
      })
    })

    it('prefers seriesId over linkedDraftId', () => {
      const game = {
        _id: 'game-1',
        settings: {
          name: 'red-cherry-2',
          seriesId: 'series-1',
          linkedDraftId: 'draft-1',
          seriesBaseName: 'red-cherry',
          seriesIndex: 2,
        },
      }
      expect(resolveSeriesFromGame(game)).toEqual({
        seriesId: 'series-1',
        seriesBaseName: 'red-cherry',
        seriesIndex: 2,
      })
    })

    it('falls back to linkedDraftId for Magic games', () => {
      const game = {
        _id: 'game-1',
        settings: {
          name: 'spell-duel',
          linkedDraftId: 'draft-1',
        },
      }
      expect(resolveSeriesFromGame(game)).toEqual({
        seriesId: 'draft-1',
        seriesBaseName: 'spell-duel',
        seriesIndex: 1,
      })
    })
  })

  describe('extractWinners / gameEntryFromGame', () => {
    it('builds a slim series entry', () => {
      const game = {
        _id: 'game-1',
        gameOver: true,
        gameOverData: { winners: ['Alice'] },
        settings: {
          name: 'red-cherry',
          seriesIndex: 1,
          players: [{ _id: 'u1', name: 'Alice', extra: true }],
          createdTimestamp: 123,
        },
      }

      expect(extractWinners(game)).toEqual(['Alice'])
      expect(gameEntryFromGame(game)).toEqual({
        gameId: 'game-1',
        name: 'red-cherry',
        seriesIndex: 1,
        players: [{ _id: 'u1', name: 'Alice' }],
        winners: ['Alice'],
        gameOver: true,
        createdTimestamp: 123,
      })
    })
  })
})
