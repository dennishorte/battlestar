import { UltimateAgeCard } from '../UltimateAgeCard.js'
import { UltimateAchievement } from '../UltimateAchievement.js'
import baseSet from './base/index.js'
import echoSet from './echo/index.js'
import figsSet from './figs/index.js'
import citySet from './city/index.js'
import artiSet from './arti/index.js'
import useeSet from './usee/index.js'

import type { AgeCardData } from '../UltimateAgeCard.js'
import type { AchievementData } from '../UltimateAchievement.js'

const ALL_EXPANSIONS = ['base', 'echo', 'figs', 'city', 'arti', 'usee'] as const
const ALL_AGES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const

interface Card {
  name: string
  age: number
}

interface Achievement {
  name: string
}

interface ExpansionSet {
  cardData: AgeCardData[]
  achievementData: AchievementData[]
}

interface GeneratedData {
  achievements: Achievement[]
  cards: Card[]
  byName: Record<string, Card | Achievement>
  byAge: Record<number, Card[]>
}

interface Game {
  // Game interface
}

const sets: Record<string, ExpansionSet> = {
  arti: artiSet,
  base: baseSet,
  echo: echoSet,
  figs: figsSet,
  city: citySet,
  usee: useeSet,
}

function generateCardInstances(game: Game, cardData: AgeCardData[], achievementData: AchievementData[]): GeneratedData {
  const cards = cardData.map((data: AgeCardData) => new UltimateAgeCard(game, data))
  const achievements = achievementData.map((data: AchievementData) => new UltimateAchievement(game, data))

  const byName: Record<string, Card | Achievement> = {}
  for (const card of cards) {
    byName[card.name] = card
  }
  for (const card of achievements) {
    byName[card.name] = card
  }

  const byAge: Record<number, Card[]> = {}
  for (const i of ALL_AGES) {
    byAge[i] = []
  }
  for (const card of cards) {
    byAge[card.age].push(card)
  }

  return {
    achievements,
    cards,
    byName,
    byAge,
  }
}


function factory(game: Game): Record<string, GeneratedData | { byName: Record<string, Card | Achievement> }> {
  const output: Record<string, GeneratedData | { byName: Record<string, Card | Achievement> }> = {
    all: {
      byName: {}
    },
  }

  for (const exp of ALL_EXPANSIONS) {
    const { cardData, achievementData } = sets[exp]
    const data = generateCardInstances(game, cardData, achievementData)
    output[exp] = data
    for (const [name, card] of Object.entries(data.byName)) {
      (output.all as { byName: Record<string, Card | Achievement> }).byName[name] = card
    }
  }

  return output
}

export { factory, ALL_AGES, ALL_EXPANSIONS }
export default { factory, ALL_AGES, ALL_EXPANSIONS }
