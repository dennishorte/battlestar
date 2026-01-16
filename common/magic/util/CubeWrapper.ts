const { Serializer } = require('./Serializer.js')
const util = require('../../lib/util.js')

import type { Serializer as SerializerType, SerializerData } from './Serializer.js'
import type { CardFilter } from './CardFilter.js'

interface CubeFlags {
  editable: boolean
  legacy: boolean
}

interface CubeTimestamps {
  created: Date
  updated: Date
}

interface Achievement {
  id: string | null
  name: string
  unlock: string
  hidden: string
  createdAt: Date
  createdBy: string | null
  claimedBy: string | null
  claimedAt: Date | null
}

interface Scar {
  id: string | null
  text: string
  createdAt: Date
  createdBy: string | null
  appliedTo: string | null
  appliedBy: string | null
  appliedAt: Date | null
}

interface CubeCard {
  id: string
  matchesFilters(filters: CardFilter[]): boolean
  [key: string]: unknown
}

interface CubeData extends SerializerData {
  name: string
  userId: string | null
  cardlist: string[]
  scarlist: Scar[]
  achievementlist: Achievement[]
  flags: CubeFlags
  timestamps: CubeTimestamps
}

interface CubeProps {
  cards: CubeCard[] | null
}

class CubeWrapper {
  serializer: SerializerType
  props: CubeProps
  name!: string
  userId!: string | null
  cardlist!: string[]
  scarlist!: Scar[]
  achievementlist!: Achievement[]
  flags!: CubeFlags
  timestamps!: CubeTimestamps

  static blankCube(): CubeData {
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

  constructor(cube: CubeData) {
    this.serializer = new Serializer(this, cube)
    this.serializer.inject()

    this.props = {
      cards: null,
    }
  }

  toJSON(): SerializerData {
    return this.serializer.serialize()
  }

  addCard(card: CubeCard): void {
    this.cardlist.push(card.id)
    this.props.cards!.push(card)
  }

  removeCard(card: CubeCard): void {
    util.array.remove(this.cardlist, card.id)
    util.array.removeByPredicate(this.props.cards, (x: CubeCard) => x.id === card.id)
  }

  cards(): CubeCard[] {
    if (!this.props.cards) {
      throw new Error('card data has not been loaded')
    }
    return [...this.props.cards]
  }

  setCards(data: CubeCard[]): void {
    this.props.cards = [...data]
  }

  applyFilters(filters: CardFilter[]): CubeCard[] {
    return this.cards().filter(card => card.matchesFilters(filters))
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Achievements

  static blankAchievement(): Achievement {
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

  achievements(): Achievement[] {
    return [...this.achievementlist]
  }

  achievementsUnclaimed(): Achievement[] {
    return this.achievements().filter(ach => !ach.claimedAt).sort((l, r) => r.createdAt.getTime() - l.createdAt.getTime())
  }

  achievementsClaimed(): Achievement[] {
    return this.achievements().filter(ach => ach.claimedAt).sort((l, r) => r.claimedAt!.getTime() - l.claimedAt!.getTime())
  }

  deleteAchievement(achievement: Achievement): void {
    const index = this.achievements().findIndex(s => s.id === achievement.id)
    if (index !== -1) {
      this.achievementlist.splice(index, 1)
    }
  }

  getAchievementById(id: string): Achievement | undefined {
    return this.achievements().find(s => s.id === id)
  }

  upsertAchievement(achievement: Achievement): void {
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

  static blankScar(): Scar {
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

  scars(): Scar[] {
    return [...this.scarlist]
  }

  scarsUsed(): Scar[] {
    return this.scars().filter(scar => scar.appliedAt).sort((l, r) => r.appliedAt!.getTime() - l.appliedAt!.getTime())
  }

  scarsUnused(): Scar[] {
    return this.scars().filter(scar => !scar.appliedAt).sort((l, r) => r.createdAt.getTime() - l.createdAt.getTime())
  }

  deleteScar(scar: Scar): void {
    const index = this.scars().findIndex(s => s.text === scar.text)
    if (index !== -1) {
      this.scarlist.splice(index, 1)
    }
  }

  getScarById(id: string): Scar | undefined {
    return this.scars().find(s => s.id === id)
  }

  upsertScar(scar: Scar): void {
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

function _nextAchievementIndex(achs: Achievement[]): number {
  if (achs.length === 0) {
    return 1
  }
  const indices = achs.map(s => s.id!.substring('achievement-'.length)).map(x => parseInt(x))
  return Math.max(...indices) + 1
}

function _nextScarIndex(scars: Scar[]): number {
  if (scars.length === 0) {
    return 1
  }

  const indices = scars.map(s => s.id!.substring('scar-'.length)).map(x => parseInt(x))
  return Math.max(...indices) + 1
}

module.exports = CubeWrapper

export { CubeWrapper, CubeData, CubeCard, Achievement, Scar, CubeFlags, CubeTimestamps }
