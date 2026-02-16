const BUILDING_RESOURCES = ['wood', 'clay', 'reed', 'stone']

function getAllPairs() {
  const pairs = []
  for (let i = 0; i < BUILDING_RESOURCES.length; i++) {
    for (let j = i + 1; j < BUILDING_RESOURCES.length; j++) {
      pairs.push([BUILDING_RESOURCES[i], BUILDING_RESOURCES[j]])
    }
  }
  return pairs
}

function pairLabel(pair) {
  return `${pair[0]} + ${pair[1]}`
}

module.exports = {
  id: "workshop-assistant-c146",
  name: "Workshop Assistant",
  deck: "occupationC",
  number: 146,
  type: "occupation",
  players: "3+",
  text: "Place a unique pair of different building resources on this card for each of your improvements (including this one). Each time another player renovates, you may move one such pair to your supply.",
  onPlay(game, player) {
    this._initializePairs(game, player)
  },

  _initializePairs(game, player) {
    const s = game.cardState(this.id)
    if (s.pairs) {
      return
    }
    const count = player.getImprovementCount() + 1
    const allPairs = getAllPairs()
    s.pairs = allPairs.slice(0, Math.min(count, allPairs.length))
    this._syncPile(game)
    game.log.add({
      template: '{player} places {count} resource pairs on Workshop Assistant',
      args: { player, count: s.pairs.length },
    })
  },

  onBuildImprovement(game, player) {
    this._initializePairs(game, player)
    const s = game.cardState(this.id)
    const allPairs = getAllPairs()
    const usedKeys = new Set(s.pairs.map(p => pairLabel(p)))
    const nextPair = allPairs.find(p => !usedKeys.has(pairLabel(p)))
    if (nextPair) {
      s.pairs.push(nextPair)
      this._syncPile(game)
      game.log.add({
        template: '{player} adds {pair} to Workshop Assistant',
        args: { player, pair: pairLabel(nextPair) },
      })
    }
  },

  onAnyRenovate(game, actingPlayer, cardOwner) {
    this._initializePairs(game, cardOwner)
    const s = game.cardState(this.id)
    if (actingPlayer.name === cardOwner.name || s.pairs.length === 0) {
      return
    }

    const choices = ['Pass', ...s.pairs.map(p => pairLabel(p))]
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Workshop Assistant: Take a resource pair?',
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Pass') {
      const pairIndex = s.pairs.findIndex(p => pairLabel(p) === selection[0])
      if (pairIndex >= 0) {
        const pair = s.pairs.splice(pairIndex, 1)[0]
        cardOwner.addResource(pair[0], 1)
        cardOwner.addResource(pair[1], 1)
        this._syncPile(game)
        game.log.add({
          template: '{player} takes {pair} from Workshop Assistant',
          args: { player: cardOwner, pair: pairLabel(pair) },
        })
      }
    }
  },

  _syncPile(game) {
    const s = game.cardState(this.id)
    s.pile = []
    for (const pair of s.pairs) {
      s.pile.push(pair[0], pair[1])
    }
  },
}
