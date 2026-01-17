const { TyrantsCard } = require('../../TyrantsCard.js')

const baseExp = require('./base.js')
const demonsExp = require('./demons.js')
const dragonsExp = require('./dragons.js')
const drowExp = require('./drow.js')
const elementalExp = require('./elementals.js')
const illithidExp = require('./illithid.js')
const undeadExp = require('./undead.js')

import type { CardData } from './base.js'
import type { TyrantsCard as TyrantsCardType } from '../../TyrantsCard.js'

interface CardFactory {
  all: TyrantsCardType[]
  byExpansion: Record<string, TyrantsCardType[]>
  byId: Record<string, TyrantsCardType>
  byName: Record<string, TyrantsCardType[]>
}

const baseData: CardData[] = [
  ...baseExp.cardData,
  ...demonsExp.cardData,
  ...dragonsExp.cardData,
  ...drowExp.cardData,
  ...elementalExp.cardData,
  ...illithidExp.cardData,
  ...undeadExp.cardData,
]


function factory(game: unknown): CardFactory {
  const cards: TyrantsCardType[] = []
  const byExpansion: Record<string, TyrantsCardType[]> = {}
  const byId: Record<string, TyrantsCardType> = {}
  const byName: Record<string, TyrantsCardType[]> = {}
  for (const data of baseData) {
    for (let i = 0; i < data.count; i++) {
      const id = data.name.toLowerCase().replaceAll(' ', '-') + '-' + i
      ;(data as any).id = id
      const card = new TyrantsCard(game, data)

      cards.push(card)
      byId[card.id] = card

      if (!Object.hasOwn(byExpansion, card.expansion)) {
        byExpansion[card.expansion] = []
      }
      byExpansion[card.expansion].push(card)

      if (!Object.hasOwn(byName, card.name)) {
        byName[card.name] = []
      }
      byName[card.name].push(card)
    }
  }
  return {
    all: cards,
    byExpansion,
    byId,
    byName,
  }
}

module.exports = {
  factory,
}

export { factory, CardFactory }
