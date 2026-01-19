import util from '../../lib/util.js'

interface PackCard {
  id: string
  name: string
  picker: Player | null
  _id?: string
  [key: string]: unknown
}

interface Player {
  name: string
  [key: string]: unknown
}

interface CardInput {
  name(): string
  _id: string
  rarity(): string
  supertypes(): string[]
  layout(): string
  [key: string]: unknown
}

interface MakePacksOptions {
  packSize: number
  numPacks: number
  numPlayers: number
}

interface DraftGame {
  [key: string]: unknown
}

class Pack {
  game: DraftGame
  id: string | null
  owner: Player | null
  waiting: Player | null
  index: number | null
  cards: PackCard[]
  picked: PackCard[]
  knownCards: Record<string, PackCard[]>
  scars?: unknown[]

  constructor(game: DraftGame, cards: (string | Partial<PackCard>)[]) {
    this.game = game

    this.id = null
    this.owner = null
    this.waiting = null
    this.index = null  // Used for determining pass direction

    this.cards = cards.map(c => {
      if (typeof c === 'string') {
        return {
          id: c,
          name: c,
          picker: null,
        }
      }
      else {
        return Object.assign({
          id: c.id,
          name: c.name,
          picked: null,
        }, c) as PackCard
      }
    })
    this.picked = []
    this.knownCards = {}
  }

  checkCardIsAvailable(card: PackCard): boolean {
    return !this.picked.includes(card)
  }

  checkIsEmpty(): boolean {
    return this.getRemainingCards().length === 0
  }

  checkIsWaitingFor(player: Player): boolean {
    return this.waiting === player
  }

  getCardById(id: string): PackCard | undefined {
    return this.getRemainingCards().find(c => c.id === id)
  }

  getRemainingCards(): PackCard[] {
    return this
      .cards
      .filter(card => !this.picked.includes(card))
  }

  getKnownCards(player: Player): PackCard[] {
    return this.knownCards[player.name]
  }

  getKnownPickedCards(player: Player): PackCard[] {
    const known = this.getKnownCards(player)
    return this.picked.filter(c => known.includes(c))
  }

  getPlayerPicks(player: Player): PackCard[] {
    return this.cards.filter(c => c.picker === player)
  }

  pickCardById(player: Player, cardId: string): void {
    const card = this.cards.find(c => c.id === cardId)

    util.assert(Boolean(card), `Card with id=${cardId} not in this pack`)
    util.assert(!card!.picker, `Card with id=${cardId} is already picked`)

    card!.picker = player
    this.picked.push(card!)
  }

  // If this player has not viewed this pack before, take note of all unpicked cards.
  // This is the set of cards that the player knows are in this pack.
  viewPack(player: Player): void {
    if (player.name in this.knownCards === false) {
      this.knownCards[player.name] = this.getRemainingCards()
    }
  }
}

function _convertCardToPackCard(card: CardInput, index: number): PackCard {
  return {
    id: card.name() + `(${index})`,
    name: card.name(),
    _id: card._id,
    picker: null,
  }
}

/**
 * Creates packs from a cube's card list
 * @param cards - Array of card objects
 * @param options - Options for pack creation
 * @param options.packSize - Number of cards per pack
 * @param options.numPacks - Total number of packs to create
 * @param options.numPlayers - Number of players in the draft
 * @returns Array of packs (each pack is an array of card objects)
 */
function makeCubePacks(cards: CardInput[], options: MakePacksOptions): PackCard[][] {
  const { packSize, numPacks, numPlayers } = options

  // Prepare cards with unique IDs
  const preparedCards = cards.map((card, index) => _convertCardToPackCard(card, index))

  // Shuffle the cards
  util.array.shuffle(preparedCards)

  // Create packs by chunking the cards
  const packs: PackCard[][] = util.array.chunk(preparedCards, packSize)
  const totalPacks = numPlayers * numPacks

  return packs.slice(0, totalPacks)
}

/**
 * Creates packs based on card rarities from a set
 * @param cards - Array of card objects with rarity information
 * @param options - Options for pack creation
 * @param options.numPacks - Total number of packs to create
 * @param options.numPlayers - Number of players in the draft
 * @returns Array of packs (each pack is an array of card objects)
 */
function makeSetPacks(cards: CardInput[], options: MakePacksOptions): PackCard[][] {
  if (!cards || cards.length === 0) {
    throw new Error('No cards provided')
  }

  const { numPacks, numPlayers } = options

  // Filter out basic lands and special layouts
  const filteredCards = cards
    .filter(c => !c.supertypes().includes('basic'))
    .filter(c => c.layout() !== 'meld')

  // Include only one copy of each card, by name
  const uniqueCards = util.array.distinct(filteredCards, (c: CardInput) => c.name())

  // Group cards by rarity
  const rarityPools = util.array.collect(uniqueCards, (c: CardInput) => c.rarity()) as Record<string, CardInput[]>

  // Helper function to get random cards of a specific rarity
  const getCards = (rarity: string, count: number): CardInput[] => util.array.selectMany(rarityPools[rarity] || [], count)

  const totalPacks = numPlayers * numPacks
  let index = 0
  const packs: PackCard[][] = []


  while (packs.length < totalPacks) {
    const pack: CardInput[] = []

    // One rare or mythic card (about 1 in 7.4 packs has a mythic)
    if (rarityPools['mythic'] && Math.random() < .135) {
      getCards('mythic', 1).forEach(card => pack.push(card))
    }
    else {
      getCards('rare', 1).forEach(card => pack.push(card))
    }

    // Add uncommons and commons
    getCards('uncommon', 3).forEach(card => pack.push(card))
    getCards('common', 10).forEach(card => pack.push(card))

    // Prepare cards with unique IDs and extract relevant properties
    const preparedPack = pack.map(card => {
      index += 1
      return _convertCardToPackCard(card, index)
    })

    packs.push(preparedPack)
  }

  return packs
}

export { Pack, makeCubePacks, makeSetPacks }
export type { PackCard, Player, MakePacksOptions }
