import crisisCards from 'crisis.js'
import destinationCards from 'destination.js'
import locationCards from 'location.js'
import loyaltyCards from 'loyalty.js'
import quorumCards from 'quorum.js'
import skillCards from 'skill.js'
import superCrisisCards from 'super_crisis.js'

const Decks = {}
export default Decks


Decks.factory = function(expansions) {
  const makeDeck = makeDeckWithFilter(c => expansions.includes(c.expansion))
  const makeSkillDeck = function(skill, skillCards) {
    const filter = c => expansions.includes(c.expansion) && c[skill]
    const maker = makeDeckWithFilter(filter)
    return maker(skill, skillCards)
  }

  const decks = {
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

    return {
      cards,
      discard: [],
    }
  }
}
