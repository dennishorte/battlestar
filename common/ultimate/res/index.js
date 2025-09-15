const { UltimateAgeCard } = require('../UltimateAgeCard.js')
const { UltimateAchievement } = require('../UltimateAchievement.js')

// Import here to make migration to ES imports easier.
const baseSet = require('./base')
const echoSet = require('./echo')
const citySet = require('./city')
const useeSet = require('./usee')

const ALL_EXPANSIONS = ['base', 'echo', 'city', 'usee']
const ALL_AGES = [1,2,3,4,5,6,7,8,9,10,11]

const sets = {
  base: baseSet,
  echo: echoSet,
  city: citySet,
  usee: useeSet,
}

function generateCardInstances(game, cardData, achievementData) {
  const cards = cardData.map(data => new UltimateAgeCard(game, data))
  const achievements = achievementData.map(data => new UltimateAchievement(game, data))

  const byName = {}
  for (const card of cards) {
    byName[card.name] = card
  }
  for (const card of achievements) {
    byName[card.name] = card
  }

  const byAge = {}
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


function factory(game) {
  const output = {
    all: {
      byName: {}
    },
  }

  for (const exp of ALL_EXPANSIONS) {
    const { cardData, achievementData } = sets[exp]
    const data = generateCardInstances(game, cardData, achievementData)
    output[exp] = data
    for (const [name, card] of Object.entries(data.byName)) {
      output.all.byName[name] = card
    }
  }

  return output
}

module.exports = {
  factory,
  ALL_AGES,
  ALL_EXPANSIONS,
}
