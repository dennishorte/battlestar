import util from '../../lib/util.js'

interface CardFace {
  name: string
  [key: string]: unknown
}

interface Card {
  _id: string
  name(): string
  numFaces(): number
  faces(): CardFace[]
  [key: string]: unknown
}

interface CardLookup {
  array: Card[]
  byId: Record<string, Card>
  byName: Record<string, Card[]>
  deckJuicer: (cardIds: string[]) => Card[]
}

function create(cards: Card[]): CardLookup {
  const lookup: CardLookup = {
    array: cards,
    byId: util.array.toDict(cards, '_id'),
    byName: util.array.collect(cards, _allCardNames),
    deckJuicer: (cardIds: string[]) => cardIds.map(id => lookup.byId[id]),
  }

  return lookup
}

////////////////////////////////////////////////////////////////////////////////
// Helper functions

function _allCardNames(card: Card): string[] {
  const names = [card.name()]

  if (card.numFaces() > 0) {
    for (const face of card.faces()) {
      names.push(face.name)
    }
  }

  // Add version with accents removed, so the lookup works either way
  for (const name of names) {
    const normalized = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    if (names.indexOf(normalized) === -1) {
      names.push(normalized)
    }
  }

  // Add version with smart quotes removed, so the lookup works either way
  for (const name of names) {
    const normalized = name
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
    if (names.indexOf(normalized) === -1) {
      names.push(normalized)
    }
  }

  return names.map(name => name.toLowerCase())
}

export { create }
export type { CardLookup, Card, CardFace }
