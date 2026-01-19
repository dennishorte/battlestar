import { TyrantsCard } from '../../TyrantsCard.js'
import { cardData as baseCardData } from './base.js'
import { cardData as demonsCardData } from './demons.js'
import { cardData as dragonsCardData } from './dragons.js'
import { cardData as drowCardData } from './drow.js'
import { cardData as elementalCardData } from './elementals.js'
import { cardData as illithidCardData } from './illithid.js'
import { cardData as undeadCardData } from './undead.js'
import type { CardData } from './base.js'
import type { TyrantsCard as TyrantsCardType } from '../../TyrantsCard.js'

interface CardFactory {
  all: TyrantsCardType[]
  byExpansion: Record<string, TyrantsCardType[]>
  byId: Record<string, TyrantsCardType>
  byName: Record<string, TyrantsCardType[]>
}

const baseData: CardData[] = [
  ...baseCardData,
  ...demonsCardData,
  ...dragonsCardData,
  ...drowCardData,
  ...elementalCardData,
  ...illithidCardData,
  ...undeadCardData,
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

export { factory }
export type { CardFactory }
