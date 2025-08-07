const CubeWrapper = require('./CubeWrapper.js')

describe('CubeWrapper', () => {
  describe('card management', () => {
    const createWrapper = () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      wrapper.setCards([{ id: 'card1', name: 'Test Card' }])
      return wrapper
    }

    const createMultiCardWrapper = () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      wrapper.setCards([
        { id: 'card1', name: 'First Card' },
        { id: 'card2', name: 'Middle Card' },
        { id: 'card3', name: 'Last Card' }
      ])
      return wrapper
    }

    test('addCard adds a card to the cube', () => {
      const wrapper = createWrapper()
      const newCard = { id: 'card2', name: 'New Card' }
      wrapper.addCard(newCard)
      expect(wrapper.cards().map(c => c.id).sort()).toEqual(['card1', 'card2'])
    })

    test('removeCard removes a card from the cube', () => {
      const wrapper = createWrapper()
      const cardToRemove = { id: 'card1', name: 'Test Card' }
      wrapper.removeCard(cardToRemove)
      expect(wrapper.cards()).toHaveLength(0)
    })

    test('cards returns a copy of the cards array', () => {
      const wrapper = createWrapper()
      const cards = wrapper.cards()
      expect(cards.map(c => c.id)).toEqual(['card1'])
      cards.push({ id: 'card2' })
      expect(wrapper.cards().map(c => c.id)).toEqual(['card1'])
    })

    test('setCards sets the cards array', () => {
      const wrapper = createWrapper()
      const newCards = [{ id: 'card2', name: 'New Card' }]
      wrapper.setCards(newCards)
      expect(wrapper.cards().map(c => c.id)).toEqual(['card2'])
    })

    test('cards throws error if card data not loaded', () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      expect(() => wrapper.cards()).toThrow('card data has not been loaded')
    })

    test('removeCard removes a card from the middle of the list', () => {
      const wrapper = createMultiCardWrapper()
      const cardToRemove = { id: 'card2', name: 'Middle Card' }
      wrapper.removeCard(cardToRemove)
      expect(wrapper.cards().map(c => c.id).sort()).toEqual(['card1', 'card3'])
    })

    test('removeCard on empty cards does not throw', () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      wrapper.setCards([])
      expect(() => wrapper.removeCard({ id: 'nonexistent' })).not.toThrow()
      expect(wrapper.cards()).toHaveLength(0)
    })

    test('removeCard with nonexistent card does not modify the list', () => {
      const wrapper = createMultiCardWrapper()
      const originalCardIds = wrapper.cards().map(c => c.id).sort()
      wrapper.removeCard({ id: 'nonexistent' })
      expect(wrapper.cards().map(c => c.id).sort()).toEqual(originalCardIds)
    })
  })

  describe('achievement management', () => {
    const createWrapper = () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      wrapper.achievementlist = [{
        id: 'achievement-1',
        name: 'Test Achievement',
        createdAt: new Date(),
      }]
      return wrapper
    }

    const createMultiAchievementWrapper = () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      wrapper.achievementlist = [
        {
          id: 'achievement-1',
          name: 'First Achievement',
          createdAt: new Date(Date.now() - 2000),
        },
        {
          id: 'achievement-2',
          name: 'Middle Achievement',
          createdAt: new Date(Date.now() - 1000),
        },
        {
          id: 'achievement-3',
          name: 'Last Achievement',
          createdAt: new Date(),
        }
      ]
      return wrapper
    }

    test('achievements returns a copy of achievements array', () => {
      const wrapper = createWrapper()
      const achievements = wrapper.achievements()
      expect(achievements.map(a => a.id)).toEqual(['achievement-1'])
      achievements.push({ id: 'achievement-2' })
      expect(wrapper.achievements().map(a => a.id)).toEqual(['achievement-1'])
    })

    test('achievementsUnclaimed returns unclaimed achievements sorted by creation date', () => {
      const wrapper = createMultiAchievementWrapper()
      const unclaimed = { id: 'achievement-2', createdAt: new Date(Date.now() + 1000) }
      wrapper.upsertAchievement(unclaimed)
      expect(wrapper.achievementsUnclaimed().map(a => a.id)).toEqual(['achievement-2', 'achievement-3', 'achievement-1'])
    })

    test('achievementsClaimed returns claimed achievements sorted by claim date', () => {
      const wrapper = createMultiAchievementWrapper()
      const claimed = {
        id: 'achievement-2',
        claimedAt: new Date(Date.now() + 1000),
        createdAt: new Date(),
      }
      wrapper.upsertAchievement(claimed)
      expect(wrapper.achievementsClaimed().map(a => a.id)).toEqual(['achievement-2'])
    })

    test('deleteAchievement removes an achievement', () => {
      const wrapper = createWrapper()
      const achievementToDelete = {
        id: 'achievement-1',
        name: 'Test Achievement',
        createdAt: expect.any(Date),
      }
      wrapper.deleteAchievement(achievementToDelete)
      expect(wrapper.achievements()).toHaveLength(0)
    })

    test('getAchievementById returns the correct achievement', () => {
      const wrapper = createWrapper()
      const achievement = wrapper.getAchievementById('achievement-1')
      expect(achievement.id).toBe('achievement-1')
      expect(achievement.name).toBe('Test Achievement')
      expect(wrapper.getAchievementById('nonexistent')).toBeUndefined()
    })

    test('upsertAchievement adds new achievement with generated id', () => {
      const wrapper = createWrapper()
      const newAchievement = CubeWrapper.blankAchievement()
      wrapper.upsertAchievement(newAchievement)
      expect(wrapper.achievements().map(a => a.id).sort()).toEqual(['achievement-1', 'achievement-2'])
    })

    test('upsertAchievement updates existing achievement', () => {
      const wrapper = createWrapper()
      const updatedAchievement = {
        id: 'achievement-1',
        name: 'Updated Name',
        createdAt: expect.any(Date),
      }
      wrapper.upsertAchievement(updatedAchievement)
      const achievement = wrapper.getAchievementById('achievement-1')
      expect(achievement.name).toBe('Updated Name')
    })

    test('deleteAchievement removes an achievement from the middle of the list', () => {
      const wrapper = createMultiAchievementWrapper()
      const achievementToDelete = {
        id: 'achievement-2',
        name: 'Middle Achievement',
        createdAt: expect.any(Date),
      }
      wrapper.deleteAchievement(achievementToDelete)
      expect(wrapper.achievements().map(a => a.id).sort()).toEqual(['achievement-1', 'achievement-3'])
    })

    test('deleteAchievement on empty achievementlist does not throw', () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      expect(() => wrapper.deleteAchievement({ id: 'nonexistent' })).not.toThrow()
      expect(wrapper.achievements()).toHaveLength(0)
    })

    test('deleteAchievement with nonexistent achievement does not modify the list', () => {
      const wrapper = createMultiAchievementWrapper()
      const originalAchievementIds = wrapper.achievements().map(a => a.id).sort()
      wrapper.deleteAchievement({ id: 'nonexistent' })
      expect(wrapper.achievements().map(a => a.id).sort()).toEqual(originalAchievementIds)
    })

    test('upsertAchievement updates an achievement in the middle of the list', () => {
      const wrapper = createMultiAchievementWrapper()
      const updatedAchievement = {
        id: 'achievement-2',
        name: 'Updated Middle Achievement',
        createdAt: expect.any(Date),
      }
      wrapper.upsertAchievement(updatedAchievement)
      const achievement = wrapper.getAchievementById('achievement-2')
      expect(achievement.name).toBe('Updated Middle Achievement')
    })

    test('upsertAchievement with null id generates new id', () => {
      const wrapper = createWrapper()
      const newAchievement = {
        id: null,
        name: 'New Achievement',
        createdAt: new Date(),
      }
      wrapper.upsertAchievement(newAchievement)
      expect(newAchievement.id).toBe('achievement-2')
      expect(wrapper.achievements().map(a => a.id).sort()).toEqual(['achievement-1', 'achievement-2'])
    })
  })

  describe('scar management', () => {
    const createWrapper = () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      wrapper.scarlist = [{
        id: 'scar-1',
        text: 'Test Scar',
        createdAt: new Date(),
      }]
      return wrapper
    }

    const createMultiScarWrapper = () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      wrapper.scarlist = [
        {
          id: 'scar-1',
          text: 'First Scar',
          createdAt: new Date(Date.now() - 2000),
        },
        {
          id: 'scar-2',
          text: 'Middle Scar',
          createdAt: new Date(Date.now() - 1000),
        },
        {
          id: 'scar-3',
          text: 'Last Scar',
          createdAt: new Date(),
        }
      ]
      return wrapper
    }

    test('scars returns a copy of scars array', () => {
      const wrapper = createWrapper()
      const scars = wrapper.scars()
      expect(scars.map(s => s.id)).toEqual(['scar-1'])
      scars.push({ id: 'scar-2' })
      expect(wrapper.scars().map(s => s.id)).toEqual(['scar-1'])
    })

    test('scarsUsed returns applied scars sorted by application date', () => {
      const wrapper = createMultiScarWrapper()
      const now = new Date()
      const later = new Date(now.getTime() + 1000)
      const evenLater = new Date(now.getTime() + 2000)

      wrapper.scarlist[0].appliedAt = now
      wrapper.scarlist[1].appliedAt = evenLater
      wrapper.scarlist[2].appliedAt = later

      expect(wrapper.scarsUsed().map(s => s.id)).toEqual(['scar-2', 'scar-3', 'scar-1'])
    })

    test('scarsUnused returns unapplied scars sorted by creation date', () => {
      const wrapper = createMultiScarWrapper()
      expect(wrapper.scarsUnused().map(s => s.id)).toEqual(['scar-3', 'scar-2', 'scar-1'])
    })

    test('deleteScar removes a scar', () => {
      const wrapper = createWrapper()
      const scarToDelete = {
        id: 'scar-1',
        text: 'Test Scar',
        createdAt: expect.any(Date),
      }
      wrapper.deleteScar(scarToDelete)
      expect(wrapper.scars()).toHaveLength(0)
    })

    test('getScarById returns the correct scar', () => {
      const wrapper = createWrapper()
      const scar = wrapper.getScarById('scar-1')
      expect(scar.id).toBe('scar-1')
      expect(scar.text).toBe('Test Scar')
      expect(wrapper.getScarById('nonexistent')).toBeUndefined()
    })

    test('upsertScar adds new scar with generated id', () => {
      const wrapper = createWrapper()
      const newScar = CubeWrapper.blankScar()
      wrapper.upsertScar(newScar)
      expect(wrapper.scars().map(s => s.id).sort()).toEqual(['scar-1', 'scar-2'])
    })

    test('upsertScar updates existing scar', () => {
      const wrapper = createWrapper()
      const updatedScar = {
        id: 'scar-1',
        text: 'Updated Text',
        createdAt: expect.any(Date),
      }
      wrapper.upsertScar(updatedScar)
      const scar = wrapper.getScarById('scar-1')
      expect(scar.text).toBe('Updated Text')
    })

    test('deleteScar removes a scar from the middle of the list', () => {
      const wrapper = createMultiScarWrapper()
      const scarToDelete = {
        id: 'scar-2',
        text: 'Middle Scar',
        createdAt: expect.any(Date),
      }
      wrapper.deleteScar(scarToDelete)
      expect(wrapper.scars().map(s => s.id).sort()).toEqual(['scar-1', 'scar-3'])
    })

    test('deleteScar on empty scarlist does not throw', () => {
      const wrapper = new CubeWrapper(CubeWrapper.blankCube())
      expect(() => wrapper.deleteScar({ id: 'nonexistent' })).not.toThrow()
      expect(wrapper.scars()).toHaveLength(0)
    })

    test('deleteScar with nonexistent scar does not modify the list', () => {
      const wrapper = createMultiScarWrapper()
      const originalScarIds = wrapper.scars().map(s => s.id).sort()
      wrapper.deleteScar({ id: 'nonexistent' })
      expect(wrapper.scars().map(s => s.id).sort()).toEqual(originalScarIds)
    })

    test('upsertScar updates a scar in the middle of the list', () => {
      const wrapper = createMultiScarWrapper()
      const updatedScar = {
        id: 'scar-2',
        text: 'Updated Middle Scar',
        createdAt: expect.any(Date),
      }
      wrapper.upsertScar(updatedScar)
      const scar = wrapper.getScarById('scar-2')
      expect(scar.text).toBe('Updated Middle Scar')
    })

    test('upsertScar with null id generates new id', () => {
      const wrapper = createWrapper()
      const newScar = {
        id: null,
        text: 'New Scar',
        createdAt: new Date(),
      }
      wrapper.upsertScar(newScar)
      expect(newScar.id).toBe('scar-2')
      expect(wrapper.scars().map(s => s.id).sort()).toEqual(['scar-1', 'scar-2'])
    })
  })
})
