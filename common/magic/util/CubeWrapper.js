const Wrapper = require('./Wrapper.js')
const util = require('../../lib/util.js')

class CubeWrapper extends Wrapper {
  static blankCube() {
    const creationDate = new Date()
    return {
      name: 'New Cube',
      userId: null,
      cardlist: [],
      scarlist: [],
      achievementlist: [],
      flags: {
        editable: false,
        legacy: false,
      },
      timestamps: {
        created: creationDate,
        updated: creationDate,
      },
    }
  }

  constructor(cube) {
    super(cube)
    this.props = {
      cards: null,
    }
  }

  addCard(card) {
    this.cardlist.push(card.id)
    this.props.cards.push(card)
  }

  removeCard(card) {
    util.array.remove(this.cardlist, card.id)
    util.array.removeByPredicate(this.props.cards, (x) => x.id === card.id)
  }

  cards() {
    if (!this.props.cards) {
      throw new Error('card data has not been loaded')
    }
    return [...this.props.cards]
  }

  setCards(data) {
    this.props.cards = [...data]
  }

  applyFilters(filters) {
    return this.cards().filter(card => card.matchesFilters(filters))
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Achievements

  static blankAchievement() {
    return {
      id: null,
      name: '',
      unlock: '',
      hidden: '',
      createdAt: new Date(),
      createdBy: null,
      claimedBy: null,
      claimedAt: null,
    }
  }

  achievements() {
    return [...this.achievementlist]
  }

  achievementsUnclaimed() {
    return this.achievements().filter(ach => !ach.claimedAt).sort((l, r) => r.createdAt - l.createdAt)
  }

  achievementsClaimed() {
    return this.achievements().filter(ach => ach.claimedAt).sort((l, r) => r.claimedAt - l.claimedAt)
  }

  deleteAchievement(achievement) {
    const index = this.achievements().findIndex(s => s.id === achievement.id)
    if (index !== -1) {
      this.achievementlist.splice(index, 1)
    }
  }

  getAchievementById(id) {
    return this.achievements().find(s => s.id === id)
  }

  upsertAchievement(achievement) {
    const existingIndex = this.achievements().findIndex(s => s.id === achievement.id)
    if (achievement.id === null || existingIndex === -1) {
      achievement.id = 'achievement-' + _nextAchievementIndex(this.achievements())
      this.achievementlist.push(achievement)
    }
    else {
      this.achievementlist[existingIndex] = achievement
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Scars

  static blankScar() {
    return {
      id: null,
      text: '',
      createdAt: new Date(),
      createdBy: null,
      appliedTo: null,
      appliedBy: null,
      appliedAt: null,
    }
  }

  scars() {
    return [...this.scarlist]
  }

  scarsUsed() {
    return this.scars().filter(scar => scar.appliedAt).sort((l, r) => r.appliedAt - l.appliedAt)
  }

  scarsUnused() {
    return this.scars().filter(scar => !scar.appliedAt).sort((l, r) => r.createdAt - l.createdAt)
  }

  deleteScar(scar) {
    const index = this.scars().findIndex(s => s.text === scar.text)
    if (index !== -1) {
      this.scarlist.splice(index, 1)
    }
  }

  getScarById(id) {
    return this.scars().find(s => s.id === id)
  }

  upsertScar(scar) {
    const existingIndex = this.scars().findIndex(s => s.id === scar.id)
    if (scar.id === null || existingIndex === -1) {
      scar.id = 'scar-' + _nextScarIndex(this.scars())
      this.scarlist.push(scar)
    }
    else {
      this.scarlist[existingIndex] = scar
    }
  }
}

function _nextAchievementIndex(achs) {
  if (achs.length === 0) {
    return 1
  }
  const indices = achs.map(s => s.id.substring('achievement-'.length)).map(x => parseInt(x))
  return Math.max(...indices) + 1
}

function _nextScarIndex(scars) {
  if (scars.length === 0) {
    return 1
  }

  const indices = scars.map(s => s.id.substring('scar-'.length)).map(x => parseInt(x))
  return Math.max(...indices) + 1
}

module.exports = CubeWrapper
