import {
  calculateCardChanges,
  calculateChangesFromOriginal,
  extractOriginalData
} from './card_diff.js'

describe('Card Diff Utilities', () => {
  describe('calculateCardChanges', () => {
    describe('new card creation', () => {
      it('should handle new card creation with no previous data', () => {
        const currentData = {
          name: 'Lightning Bolt',
          card_faces: [
            { name: 'Lightning Bolt', oracle_text: 'Deal 3 damage to any target.' }
          ]
        }

        const result = calculateCardChanges(currentData, null)

        expect(result).toEqual({
          type: 'creation',
          summary: 'Card created',
          changes: [],
          facesAdded: 1,
          facesRemoved: 0,
          fieldsChanged: 0
        })
      })

      it('should handle new card creation with undefined previous data', () => {
        const currentData = {
          name: 'Lightning Bolt',
          card_faces: []
        }

        const result = calculateCardChanges(currentData, undefined)

        expect(result).toEqual({
          type: 'creation',
          summary: 'Card created',
          changes: [],
          facesAdded: 0,
          facesRemoved: 0,
          fieldsChanged: 0
        })
      })
    })

    describe('root field changes', () => {
      it('should detect changes in root fields', () => {
        const previousData = {
          layout: 'normal',
          rarity: 'common',
          set: 'M21',
          collector_number: '123',
          digital: false,
          card_faces: []
        }

        const currentData = {
          layout: 'normal',
          rarity: 'rare',
          set: 'M22',
          collector_number: '124',
          digital: true,
          card_faces: []
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.type).toBe('update')
        expect(result.fieldsChanged).toBe(4)
        expect(result.changes).toHaveLength(4)

        const rarityChange = result.changes.find(c => c.field === 'rarity')
        expect(rarityChange).toEqual({
          type: 'root_field',
          faceIndex: null,
          field: 'rarity',
          oldValue: 'common',
          newValue: 'rare',
          summary: 'Changed rarity: "common" → "rare"'
        })
      })

      it('should ignore unchanged root fields', () => {
        const previousData = {
          layout: 'normal',
          rarity: 'common',
          card_faces: []
        }

        const currentData = {
          layout: 'normal',
          rarity: 'common',
          card_faces: []
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(0)
        expect(result.changes).toHaveLength(0)
        expect(result.summary).toBe('No changes detected')
      })
    })

    describe('face changes', () => {
      it('should detect face additions', () => {
        const previousData = {
          card_faces: [
            { name: 'Front Face', oracle_text: 'Front text' }
          ]
        }

        const currentData = {
          card_faces: [
            { name: 'Front Face', oracle_text: 'Front text' },
            { name: 'Back Face', oracle_text: 'Back text' }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.facesAdded).toBe(1)
        expect(result.facesRemoved).toBe(0)
        expect(result.fieldsChanged).toBe(1)

        const faceAddition = result.changes.find(c => c.type === 'face_added')
        expect(faceAddition).toEqual({
          type: 'face_added',
          faceIndex: 1,
          field: null,
          oldValue: null,
          newValue: 'Back Face',
          summary: 'Added face: Back Face'
        })
      })

      it('should detect face removals', () => {
        const previousData = {
          card_faces: [
            { name: 'Front Face', oracle_text: 'Front text' },
            { name: 'Back Face', oracle_text: 'Back text' }
          ]
        }

        const currentData = {
          card_faces: [
            { name: 'Front Face', oracle_text: 'Front text' }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.facesAdded).toBe(0)
        expect(result.facesRemoved).toBe(1)
        expect(result.fieldsChanged).toBe(1)

        const faceRemoval = result.changes.find(c => c.type === 'face_removed')
        expect(faceRemoval).toEqual({
          type: 'face_removed',
          faceIndex: 1,
          field: null,
          oldValue: 'Back Face',
          newValue: null,
          summary: 'Removed face: Back Face'
        })
      })

      it('should detect face field changes', () => {
        const previousData = {
          card_faces: [
            {
              name: 'Lightning Bolt',
              oracle_text: 'Deal 3 damage to target creature or player.',
              mana_cost: '{R}',
              type_line: 'Instant'
            }
          ]
        }

        const currentData = {
          card_faces: [
            {
              name: 'Lightning Bolt',
              oracle_text: 'Deal 3 damage to any target.',
              mana_cost: '{1}{R}',
              type_line: 'Instant'
            }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(2)
        expect(result.changes).toHaveLength(2)

        const oracleChange = result.changes.find(c => c.field === 'oracle_text')
        expect(oracleChange).toEqual({
          type: 'face_field',
          faceIndex: 0,
          field: 'oracle_text',
          oldValue: 'Deal 3 damage to target creature or player.',
          newValue: 'Deal 3 damage to any target.',
          summary: 'Face 0: Changed rules text: "Deal 3 damage to target creature or player." → "Deal 3 damage to any target."'
        })
      })

      it('should handle faces without names', () => {
        const previousData = {
          card_faces: [
            { oracle_text: 'Some text' }
          ]
        }

        const currentData = {
          card_faces: []
        }

        const result = calculateCardChanges(currentData, previousData)

        const faceRemoval = result.changes.find(c => c.type === 'face_removed')
        expect(faceRemoval.summary).toBe('Removed face: Face 0')
      })
    })

    describe('value normalization', () => {
      it('should treat null, undefined, and empty strings as equivalent', () => {
        const previousData = {
          card_faces: [
            { name: 'Test', oracle_text: null, flavor_text: undefined }
          ]
        }

        const currentData = {
          card_faces: [
            { name: 'Test', oracle_text: '', flavor_text: '   ' }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(0)
        expect(result.changes).toHaveLength(0)
      })

      it('should treat empty arrays as null', () => {
        const previousData = {
          card_faces: [
            { name: 'Test', produced_mana: [] }
          ]
        }

        const currentData = {
          card_faces: [
            { name: 'Test', produced_mana: null }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(0)
      })

      it('should perform case-insensitive string comparisons', () => {
        const previousData = {
          rarity: 'Common',
          card_faces: [
            {
              name: 'Lightning Bolt',
              oracle_text: 'Deal 3 Damage to Any Target.',
              type_line: 'Instant'
            }
          ]
        }

        const currentData = {
          rarity: 'COMMON',
          card_faces: [
            {
              name: 'LIGHTNING BOLT',
              oracle_text: 'deal 3 damage to any target.',
              type_line: 'instant'
            }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(0)
        expect(result.changes).toHaveLength(0)
        expect(result.summary).toBe('No changes detected')
      })

      it('should detect actual changes despite case differences', () => {
        const previousData = {
          card_faces: [
            {
              name: 'Lightning Bolt',
              oracle_text: 'Deal 3 damage to target creature.'
            }
          ]
        }

        const currentData = {
          card_faces: [
            {
              name: 'LIGHTNING BOLT',
              oracle_text: 'Deal 3 damage to ANY target.'
            }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(1)
        expect(result.changes).toHaveLength(1)

        const change = result.changes[0]
        expect(change.field).toBe('oracle_text')
        // Should preserve original case in display values
        expect(change.oldValue).toBe('Deal 3 damage to target creature.')
        expect(change.newValue).toBe('Deal 3 damage to ANY target.')
      })

      it('should handle case-insensitive comparisons in arrays', () => {
        const previousData = {
          card_faces: [
            { name: 'Test', produced_mana: ['Red', 'Green'] }
          ]
        }

        const currentData = {
          card_faces: [
            { name: 'Test', produced_mana: ['red', 'GREEN'] }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(0)
        expect(result.changes).toHaveLength(0)
      })

      it('should handle case-insensitive comparisons in nested objects', () => {
        const previousData = {
          card_faces: [
            {
              name: 'Test',
              image_uri: {
                normal: 'https://example.com/Image.jpg',
                large: 'https://example.com/Large.jpg'
              }
            }
          ]
        }

        const currentData = {
          card_faces: [
            {
              name: 'Test',
              image_uri: {
                normal: 'https://EXAMPLE.com/image.jpg',
                large: 'https://example.com/LARGE.jpg'
              }
            }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(0)
        expect(result.changes).toHaveLength(0)
      })

      it('should preserve original case in change summaries', () => {
        const previousData = {
          card_faces: [
            { name: 'Test', oracle_text: 'Old Text Here' }
          ]
        }

        const currentData = {
          card_faces: [
            { name: 'Test', oracle_text: 'NEW text here' }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(1)
        const change = result.changes[0]
        expect(change.summary).toBe('Face 0: Changed rules text: "Old Text Here" → "NEW text here"')
        expect(change.oldValue).toBe('Old Text Here')
        expect(change.newValue).toBe('NEW text here')
      })

      it('should handle mixed case with whitespace normalization', () => {
        const previousData = {
          card_faces: [
            { name: 'Test', oracle_text: '  Mixed Case Text  ' }
          ]
        }

        const currentData = {
          card_faces: [
            { name: 'Test', oracle_text: 'MIXED case TEXT' }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.fieldsChanged).toBe(0)
        expect(result.changes).toHaveLength(0)
      })
    })

    describe('summary generation', () => {
      it('should generate correct summary for multiple changes', () => {
        const previousData = {
          rarity: 'common',
          card_faces: [
            { name: 'Test', oracle_text: 'Old text' }
          ]
        }

        const currentData = {
          rarity: 'rare',
          card_faces: [
            { name: 'Test', oracle_text: 'New text' },
            { name: 'New Face', oracle_text: 'Face text' }
          ]
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.summary).toBe('1 face added, 2 fields modified')
      })

      it('should handle singular vs plural correctly', () => {
        const previousData = {
          card_faces: [
            { name: 'Test1' },
            { name: 'Test2' }
          ]
        }

        const currentData = {
          card_faces: []
        }

        const result = calculateCardChanges(currentData, previousData)

        expect(result.summary).toBe('2 faces removed')
      })
    })
  })

  describe('calculateChangesFromOriginal', () => {
    it('should handle missing original data', () => {
      const currentData = { name: 'Test Card' }

      const result = calculateChangesFromOriginal(currentData, null)

      expect(result).toEqual({
        type: 'no_original',
        summary: 'No original version available',
        changes: [],
        facesAdded: 0,
        facesRemoved: 0,
        fieldsChanged: 0
      })
    })

    it('should calculate changes from original with modifications', () => {
      const originalData = {
        rarity: 'common',
        card_faces: [
          { name: 'Test', oracle_text: 'Original text' }
        ]
      }

      const currentData = {
        rarity: 'rare',
        card_faces: [
          { name: 'Test', oracle_text: 'Modified text' }
        ]
      }

      const result = calculateChangesFromOriginal(currentData, originalData)

      expect(result.type).toBe('from_original')
      expect(result.fieldsChanged).toBe(2)
      expect(result.summary).toBe('Modified from original: 2 fields modified')
    })

    it('should handle unchanged from original', () => {
      const originalData = {
        rarity: 'common',
        card_faces: [
          { name: 'Test', oracle_text: 'Same text' }
        ]
      }

      const currentData = {
        rarity: 'common',
        card_faces: [
          { name: 'Test', oracle_text: 'Same text' }
        ]
      }

      const result = calculateChangesFromOriginal(currentData, originalData)

      expect(result.type).toBe('from_original')
      expect(result.summary).toBe('Unchanged from original')
    })
  })

  describe('extractOriginalData', () => {
    it('should return null for empty edits array', () => {
      expect(extractOriginalData([])).toBeNull()
      expect(extractOriginalData(null)).toBeNull()
      expect(extractOriginalData(undefined)).toBeNull()
    })

    it('should extract original data from creation edit', () => {
      const edits = [
        {
          action: 'create',
          date: '2023-01-01T00:00:00Z'
        },
        {
          action: 'update',
          date: '2023-01-02T00:00:00Z',
          oldData: { name: 'Original Card', rarity: 'common' }
        }
      ]

      const result = extractOriginalData(edits)

      expect(result).toEqual({ name: 'Original Card', rarity: 'common' })
    })

    it('should extract from oldest update when no creation edit exists', () => {
      const edits = [
        {
          action: 'update',
          date: '2023-01-03T00:00:00Z',
          oldData: { name: 'Later Version', rarity: 'rare' }
        },
        {
          action: 'update',
          date: '2023-01-01T00:00:00Z',
          oldData: { name: 'Original Card', rarity: 'common' }
        },
        {
          action: 'update',
          date: '2023-01-02T00:00:00Z',
          oldData: { name: 'Middle Version', rarity: 'uncommon' }
        }
      ]

      const result = extractOriginalData(edits)

      expect(result).toEqual({ name: 'Original Card', rarity: 'common' })
    })

    it('should handle edits without oldData', () => {
      const edits = [
        {
          action: 'update',
          date: '2023-01-01T00:00:00Z'
          // no oldData
        },
        {
          action: 'update',
          date: '2023-01-02T00:00:00Z',
          oldData: { name: 'Valid Data', rarity: 'common' }
        }
      ]

      const result = extractOriginalData(edits)

      expect(result).toEqual({ name: 'Valid Data', rarity: 'common' })
    })

    it('should return null when no valid data is found', () => {
      const edits = [
        {
          action: 'update',
          date: '2023-01-01T00:00:00Z'
          // no oldData
        },
        {
          action: 'delete',
          date: '2023-01-02T00:00:00Z'
        }
      ]

      const result = extractOriginalData(edits)

      expect(result).toBeNull()
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle cards with no faces', () => {
      const previousData = { rarity: 'common' }
      const currentData = { rarity: 'rare' }

      const result = calculateCardChanges(currentData, previousData)

      expect(result.facesAdded).toBe(0)
      expect(result.facesRemoved).toBe(0)
      expect(result.fieldsChanged).toBe(1)
    })

    it('should dynamically detect new root fields', () => {
      const previousData = {
        rarity: 'common',
        existing_field: 'old_value'
      }

      const currentData = {
        rarity: 'common',
        existing_field: 'old_value',
        new_field: 'new_value',
        another_new_field: 42
      }

      const result = calculateCardChanges(currentData, previousData)

      expect(result.fieldsChanged).toBe(2)
      expect(result.changes).toHaveLength(2)

      const newFieldChange = result.changes.find(c => c.field === 'new_field')
      expect(newFieldChange).toEqual({
        type: 'root_field',
        faceIndex: null,
        field: 'new_field',
        oldValue: null,
        newValue: 'new_value',
        summary: 'Added new field: "new_value"'
      })

      const anotherNewFieldChange = result.changes.find(c => c.field === 'another_new_field')
      expect(anotherNewFieldChange).toEqual({
        type: 'root_field',
        faceIndex: null,
        field: 'another_new_field',
        oldValue: null,
        newValue: 42,
        summary: 'Added another new field: "42"'
      })
    })

    it('should dynamically detect new face fields', () => {
      const previousData = {
        card_faces: [
          {
            name: 'Test Card',
            oracle_text: 'Some text'
          }
        ]
      }

      const currentData = {
        card_faces: [
          {
            name: 'Test Card',
            oracle_text: 'Some text',
            new_face_field: 'face_value',
            numeric_field: 123
          }
        ]
      }

      const result = calculateCardChanges(currentData, previousData)

      expect(result.fieldsChanged).toBe(2)
      expect(result.changes).toHaveLength(2)

      const newFaceFieldChange = result.changes.find(c => c.field === 'new_face_field')
      expect(newFaceFieldChange).toEqual({
        type: 'face_field',
        faceIndex: 0,
        field: 'new_face_field',
        oldValue: null,
        newValue: 'face_value',
        summary: 'Face 0: Added new face field: "face_value"'
      })
    })

    it('should detect removed fields', () => {
      const previousData = {
        rarity: 'common',
        deprecated_field: 'old_value',
        card_faces: [
          {
            name: 'Test',
            deprecated_face_field: 'face_value'
          }
        ]
      }

      const currentData = {
        rarity: 'common',
        card_faces: [
          {
            name: 'Test'
          }
        ]
      }

      const result = calculateCardChanges(currentData, previousData)

      expect(result.fieldsChanged).toBe(2)

      const removedRootField = result.changes.find(c => c.field === 'deprecated_field')
      expect(removedRootField.summary).toBe('Removed deprecated field: "old_value"')

      const removedFaceField = result.changes.find(c => c.field === 'deprecated_face_field')
      expect(removedFaceField.summary).toBe('Face 0: Removed deprecated face field: "face_value"')
    })

    it('should handle complex nested objects in fields', () => {
      const previousData = {
        card_faces: [
          {
            name: 'Test',
            image_uri: { normal: 'url1', large: 'url2' }
          }
        ]
      }

      const currentData = {
        card_faces: [
          {
            name: 'Test',
            image_uri: { normal: 'url3', large: 'url2' }
          }
        ]
      }

      const result = calculateCardChanges(currentData, previousData)

      expect(result.fieldsChanged).toBe(1)
      const imageChange = result.changes.find(c => c.field === 'image_uri')
      expect(imageChange).toBeDefined()
    })

    it('should handle very long text values in summaries', () => {
      const longText = 'A'.repeat(100)
      const previousData = {
        card_faces: [
          { name: 'Test', oracle_text: 'Short' }
        ]
      }

      const currentData = {
        card_faces: [
          { name: 'Test', oracle_text: longText }
        ]
      }

      const result = calculateCardChanges(currentData, previousData)

      const change = result.changes[0]
      expect(change.summary).toContain('...')
      expect(change.summary.length).toBeLessThan(200)
    })

    it('should handle array fields correctly', () => {
      const previousData = {
        card_faces: [
          { name: 'Test', produced_mana: ['R', 'G'] }
        ]
      }

      const currentData = {
        card_faces: [
          { name: 'Test', produced_mana: ['R', 'G', 'U'] }
        ]
      }

      const result = calculateCardChanges(currentData, previousData)

      expect(result.fieldsChanged).toBe(1)
      const change = result.changes[0]
      expect(change.oldValue).toEqual(['R', 'G'])
      expect(change.newValue).toEqual(['R', 'G', 'U'])
    })
  })
})
