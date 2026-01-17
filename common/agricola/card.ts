export interface CardCost {
  food?: string | number
  wood?: string | number
  clay?: string | number
  reed?: string | number
  stone?: string | number
  grain?: string | number
  sheep?: string | number
  special?: string
}

export interface CardImpl {
  trigger: string
  func: (game: unknown, player?: unknown) => void
}

export interface CardData {
  expansion?: string
  deck?: string
  type?: string
  stage?: number
  numPlayers?: number
  id?: string
  name?: string
  vps?: number
  passLeft?: boolean
  cost?: CardCost | CardCost[]
  prereqs?: string[]
  text?: string[]
  impl?: CardImpl[]
  players?: number
}

export class Card {
  expansion: string = 'revised'
  deck: string = 'undefined'
  type: string = 'undefined'

  // Used for the action cards
  stage: number = -1

  // Used by professions. 1 = 1 or more players; 3 = 3 or more players; etc.
  numPlayers: number = 1

  id: string = 'invalid_id'
  name: string = 'Card Name'
  vps: number = 0
  passLeft: boolean = false

  // Costs are stated in objects; multiple objects implies "or" costs.
  // example: [{ clay: 4 }, { special: 'return an oven' }] mean pay 2 clay OR return an oven
  cost: CardCost[] = []
  prereqs: string[] = []

  text: string[] = []
  impl: CardImpl[] = []
}

export function fromObject(obj: CardData): Card {
  const card = new Card()
  Object.assign(card, obj)
  return card
}
