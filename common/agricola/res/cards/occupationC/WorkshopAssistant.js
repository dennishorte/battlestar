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

function unusedPair(pairs) {
  const usedKeys = new Set((pairs || []).map(p => pairLabel(p)))
  return getAllPairs().find(p => !usedKeys.has(pairLabel(p)))
}

function pairCount(game, cardId, player) {
  const pairs = game.cardState(cardId).pairs
  if (pairs) {
    return pairs.length
  }
  return Math.min(player.getImprovementCount(), getAllPairs().length)
}

module.exports = {
  id: "workshop-assistant-c146",
  name: "Workshop Assistant",
  deck: "occupationC",
  number: 146,
  type: "occupation",
  players: "3+",
  text: "Place a unique pair of different building resources on this card for each of your improvements. Each time another player renovates, you may move one such pair to your supply.",
  onPlay(game, player) {
    this._initializePairs(game, player)
  },

  _initializePairs(game, player) {
    const s = game.cardState(this.id)
    if (s.pairs) {
      return
    }
    const count = player.getImprovementCount()
    const allPairs = getAllPairs()
    s.pairs = allPairs.slice(0, Math.min(count, allPairs.length))
    this._syncPile(game)
    if (s.pairs.length > 0) {
      game.log.add({
        template: '{player} places {count} resource pairs on {card}',
        args: { player, count: s.pairs.length, card: this },
      })
    }
  },

  matches_onBuildImprovement(game) {
    return Boolean(unusedPair(game.cardState(this.id).pairs))
  },

  onBuildImprovement(game, player) {
    this._initializePairs(game, player)
    const nextPair = unusedPair(game.cardState(this.id).pairs)
    if (!nextPair) {
      return
    }
    const s = game.cardState(this.id)
    s.pairs.push(nextPair)
    this._syncPile(game)
    game.log.add({
      template: '{player} adds {pair}',
      args: { player, pair: pairLabel(nextPair) },
    })
  },

  matches_onAnyRenovate(game, actingPlayer, cardOwner) {
    return actingPlayer.name !== cardOwner.name && pairCount(game, this.id, cardOwner) > 0
  },

  onAnyRenovate(game, actingPlayer, cardOwner) {
    this._initializePairs(game, cardOwner)
    const s = game.cardState(this.id)
    if (actingPlayer.name === cardOwner.name || s.pairs.length === 0) {
      return
    }

    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...s.pairs.map(p => game.actions.option({ id: `pair-${pairLabel(p)}`, title: pairLabel(p) })),
    ]
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Workshop Assistant: Take a resource pair?',
      min: 1,
      max: 1,
    })

    if (selection[0].id !== 'pass') {
      const pairIndex = s.pairs.findIndex(p => `pair-${pairLabel(p)}` === selection[0].id)
      if (pairIndex >= 0) {
        const pair = s.pairs.splice(pairIndex, 1)[0]
        cardOwner.addResource(pair[0], 1)
        cardOwner.addResource(pair[1], 1)
        this._syncPile(game)
        game.log.add({
          template: '{player} takes {pair}',
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
