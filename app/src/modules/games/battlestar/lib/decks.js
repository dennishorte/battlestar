import crisisCards from '../res/crisis.js'
import destinationCards from '../res/destination.js'
import loyaltyCards from '../res/loyalty.js'
import quorumCards from '../res/quorum.js'
import skillCards from '../res/skill.js'
import superCrisisCards from '../res/super_crisis.js'

import { shuffleArray } from '@/util.js'

const Decks = {}
export default Decks


Decks.factory = function(expansions) {
  const makeDeck = makeDeckWithFilter(c => expansions.includes(c.expansion))
  const makeSkillDeck = function(skill, skillCards) {
    const filter = c => expansions.includes(c.expansion) && c[skill]
    const maker = makeDeckWithFilter(filter)
    return maker(skill, skillCards)
  }

  return {
    crisis: makeDeck('crisis', crisisCards),
    destination: makeDeck('destination', destinationCards),
    loyalty: makeDeck('loyalty', loyaltyCards),
    quorum: makeDeck('quorum', quorumCards),
    skill: {
      politics: makeSkillDeck('politics', skillCards),
      leadership: makeSkillDeck('leadership', skillCards),
      tactics: makeSkillDeck('tactics', skillCards),
      piloting: makeSkillDeck('piloting', skillCards),
      engineering: makeSkillDeck('engineering', skillCards),
      treachery: makeSkillDeck('treachery', skillCards),
    },
    superCrisis: makeDeck('super-crisis', superCrisisCards),
  }
}

function makeDeckWithFilter(filter) {
  return function(kind, cardsIn) {
    const cards = cardsIn
      .filter(filter)
      .map(c => {
        c.kind = kind
        return c
      })

    shuffleArray(cards)

    return {
      cards,
      discard: [],
    }
  }
}
