import civilianDistribution from '../res/civilian_ships.js'
import crisisCards from '../res/crisis.js'
import destinationCards from '../res/destination.js'
import loyaltyCards from '../res/loyalty.js'
import quorumCards from '../res/quorum.js'
import skillCards from '../res/skill.js'
import superCrisisCards from '../res/super_crisis.js'

import { shuffleArray } from '@/util.js'

export default {
  factory,
}


function factory(expansions) {
  const makeDeck = makeDeckWithFilter(c => expansions.includes(c.expansion))
  const makeSkillDeck = function(skill, skillCards) {
    const filter = c => expansions.includes(c.expansion) && c[skill]
    const maker = makeDeckWithFilter(filter)
    return maker(skill, skillCards)
  }

  const decks = {
    civilians: makeDeck('civilians', makeCivilians()),
    crisis: makeDeck('crisis', crisisCards),
    damageBasestar: makeDeck('damageBasestar', damageBasestar),
    damageGalactica: makeDeck('damageGalactica', damageGalactica),
    destination: makeDeck('destination', destinationCards),
    loyalty: makeDeck('loyalty', loyaltyCards),
    quorum: makeDeck('quorum', quorumCards),
    superCrisis: makeDeck('super-crisis', superCrisisCards),

    politics: makeSkillDeck('politics', skillCards),
    leadership: makeSkillDeck('leadership', skillCards),
    tactics: makeSkillDeck('tactics', skillCards),
    piloting: makeSkillDeck('piloting', skillCards),
    engineering: makeSkillDeck('engineering', skillCards),
    treachery: makeSkillDeck('treachery', skillCards),
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
    console.log('making civilians: ', quantity, effect)
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
  return function(kind, cardsIn) {
    const cards = cardsIn
      .filter(filter)
      .map((c, idx) => {
        c.kindId = idx
        c.id = `${kind}-${idx}`,
        c.kind = kind
        c.visibility = []
        return c
      })

    shuffleArray(cards)
    return cards
  }
}
