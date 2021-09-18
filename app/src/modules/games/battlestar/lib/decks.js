import characterCards from '../res/character.js'
import civilianDistribution from '../res/civilian_ships.js'
import crisisCards from '../res/crisis.js'
import destinationCards from '../res/destination.js'
import loyaltyCards from '../res/loyalty.js'
import quorumCards from '../res/quorum.js'
import skillCards from '../res/skill.js'
import superCrisisCards from '../res/super_crisis.js'
import titleCards from '../res/title.js'

import { shuffleArray } from '@/util.js'

export default {
  factory,
}

/*
Zone Structure
{
   // Required
   name: String                     // Full pathname within the zones dict
   cards: Array[Card]               //
   kind: String                     // 'open', 'hidden', 'hand', 'deck'

   // Optional
   discard: String                  // How to handle discarded cards of this zone
   visibility: String               // Special visibility rules for this zone
}

Card Structure
{
   // Required
   name: String,                    // Possibly not unique
   expansion: String,               // Expansion names, including 'base game'
   kind: String,                    // Just a name
   kindId: Number,                  // Unique by kind.
   id: String,                      // `${kind}-{id}`
   visibility: Array[String],       // player name

   // Additional fields possible per card type
}
*/


function factory(expansions) {
  const expansionFilter = c => expansions.includes(c.expansion)
  const makeDeck = makeDeckWithFilter(expansionFilter)
  const makeLoyaltyDeck = function(cards, options) {
    const kind = options.name
    const filter = c => expansionFilter(c) && c.team.toLowerCase() === kind
    const maker = makeDeckWithFilter(filter)
    return maker(cards, options)
  }
  const makeSkillDeck = function(cards, options) {
    const filter = c => expansionFilter(c) && c.skill === options.name
    const maker = makeDeckWithFilter(filter)
    return maker(cards, options)
  }

  const decks = {
    character: makeDeck(characterCards, {
      name: 'character',
      kind: 'open',
      discard: 'none',
    }),
    civilian: makeDeck(makeCivilians(), {
      name: 'civilian',
      kind: 'bag',
      discard: 'open',
    }),
    crisis: makeDeck(crisisCards, {
      name: 'crisis',
      kind: 'deck',
      discard: 'hidden',
    }),
    damageBasestar: makeDeck(damageBasestar, {
      name: 'damageBasestar',
      kind: 'bag',
    }),
    damageGalactica: makeDeck(damageGalactica, {
      name: 'damageGalactica',
      kind: 'bag',
      discard: 'open',
    }),
    destination: makeDeck(destinationCards, {
      name: 'destination',
      kind: 'deck',
      discard: 'hidden',
    }),
    quorum: makeDeck(quorumCards, {
      name: 'quorum',
      kind: 'deck',
      discard: 'hidden',
    }),
    superCrisis: makeDeck(superCrisisCards, {
      name: 'superCrisis',
      kind: 'deck',
      discard: 'hidden',
    }),
    title: makeDeck(titleCards, {
      name: 'title',
      kind: 'open',
      discard: 'none',
    }),

    // Loyalty Decks
    cylon: makeLoyaltyDeck(loyaltyCards, {
      name: 'cylon',
      cardKind: 'loyalty',
      kind: 'bag',
      discard: 'none',
    }),
    human: makeLoyaltyDeck(loyaltyCards, {
      name: 'human',
      cardKind: 'loyalty',
      kind: 'bag',
      discard: 'none',
    }),
    sympathizer: makeLoyaltyDeck(loyaltyCards, {
      name: 'sympathizer',
      cardKind: 'loyalty',
      kind: 'bag',
      discard: 'none',
    }),

    // Skill Decks
    politics: makeSkillDeck(skillCards, {
      name: 'politics',
      cardKind: 'skill',
      kind: 'deck',
      discard: 'open',
    }),
    leadership: makeSkillDeck(skillCards, {
      name: 'leadership',
      cardKind: 'skill',
      kind: 'deck',
      discard: 'open',
    }),
    tactics: makeSkillDeck(skillCards, {
      name: 'tactics',
      cardKind: 'skill',
      kind: 'deck',
      discard: 'open',
    }),
    piloting: makeSkillDeck(skillCards, {
      name: 'piloting',
      cardKind: 'skill',
      kind: 'deck',
      discard: 'open',
    }),
    engineering: makeSkillDeck(skillCards, {
      name: 'engineering',
      cardKind: 'skill',
      kind: 'deck',
      discard: 'open',
    }),
    treachery: makeSkillDeck(skillCards, {
      name: 'treachery',
      cardKind: 'skill',
      kind: 'deck',
      discard: 'open',
    }),
  }

  return decks
}

////////////////////////////////////////////////////////////////////////////////
// Helper functions

const damageBasestar = makeCards([
  "critical hit (2 damage)",
  "disabled hangar (can't launch)",
  "disabled weapons (can't shoot)",
  "structural damage (+2 to hit)",
])

const damageGalactica = makeCards([
  "-1 fuel",
  "-1 food",
  "Hangar Deck",
  "Armory",
  "Command",
  "Admiral's Quarters",
  "FTL Control",
  "Weapons Control",
])

function makeCivilians() {
  const civilians = []
  for (let j = 0; j < civilianDistribution.length; j++) {
    const { effect, quantity } = civilianDistribution[j]
    for (let i = 0; i < quantity; i++) {
      const ship = {
        name: 'civilian',
        expansion: 'base game',
        effect,
        population: 0,
        morale: 0,
        fuel: 0,
      }
      if (effect === '-1 population') {
        ship.population = -1
      }
      else if (effect === '-2 population') {
        ship.population = -2
      }
      else if (effect === '-1 population, -1 fuel') {
        ship.population = -1
        ship.fuel = 1
      }
      else if (effect === '-1 population, -1 morale') {
        ship.population = -1
        ship.morale = -1
      }
      else if (effect === 'Nothing') {
        // do nothing
      }
      else {
        throw "Unknown ship effect: " + effect
      }
      civilians.push(ship)
    }
  }

  return civilians
}

function makeCards(namelist) {
  return namelist.map(name => ({
    name,
    expansion: 'base game',
  }))
}

function makeDeckWithFilter(filter) {
  return function(cardsIn, options) {
    const deckSuffix = options.name
    const deckName = `decks.${deckSuffix}`

    const cards = cardsIn
      .filter(filter)
      .map((c, idx) => {
        const kind = options.cardKind || options.name

        c.kindId = idx
        c.id = `${deckSuffix}-${idx}`
        c.kind = kind
        c.deck = deckName
        c.visibility = options.kind === 'open' ? 'all' : []
        return c
      })

    shuffleArray(cards)

    options.name = deckName
    return {
      cards,
      ...options,
    }
  }
}
