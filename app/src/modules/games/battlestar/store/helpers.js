import seedrandom from 'seedrandom'
import Vue from 'vue'

import bsgutil from '../lib/util.js'
import util from '@/util.js'

////////////////////////////////////////////////////////////////////////////////
// Compatibility helpers.
// Can be removed once backwards compatibility is established.

export function compatCrisisHelp(player) {
  if (player.crisisHelp === undefined) {
    Vue.set(player, 'crisisHelp', '')
  }
}


////////////////////////////////////////////////////////////////////////////////
// Private functions

export function admiralName(state) {
  return playerWithCard(state, 'Admiral').name
}

export function cardAdjustVisibility(state, card, zoneName) {
  const zone = zoneGet(state, zoneName)
  const zoneVis = zone.visibility || zone.kind

  if (zoneVis === 'open') {
    card.visibility = 'all'
  }
  else if (zoneVis === 'president') {
    card.visibility = [presidentName(state)]
  }
  else if (zoneVis === 'owner') {
    if (card.visibility !== 'all') {
      pushUnique(card.visibility, zone.owner)
    }
  }
  else if (zoneVis === 'deck'
           || zoneVis === 'hidden'
           || zoneVis === 'bag') {
    card.visibility = []
  }
  else {
    throw `Unknown zone visibility (${zoneVis}) for zone ${zone.name}`
  }
}

export function cardReveal(state, card) {
  card.visibility = state.game.players.map(p => p.name)
}

export function cardView(state, card, player) {
  pushUnique(card.visibility, player.name)
}

export function commonCrisis(state) {
  const zone = zoneGet(state, 'common')
  const crisis = zone.cards.find(c => c.kind === 'crisis' || c.kind === 'superCrisis')
  return crisis
}

export function deckGet(state, deckName) {
  const deck = state.game.zones.decks[deckName]
  if (!deck) {
    throw `Unknown deck name: ${deckName}`
  }
  return deck
}

export function discardGet(state, deckName) {
  const deck = state.game.zones.discard[deckName]
  if (!deck) {
    throw `Unknown deck name: ${deckName}`
  }
  return deck
}

export function getDiscardName(state, deckName) {
  if (deckName.startsWith('decks.')) {
    return deckName.replace('decks.', 'discard.')
  }

  throw `Unable to get discard for ${deckName}`
}

export function getRng(state) {
  const rng = seedrandom(state.game.seed)
  state.game.seed = 'battlestar-galactica' + rng()
  return rng
}

export function grabCancel(state) {
  state.ui.grab.source = ''
  state.ui.grab.index = -1
}

export function isRevealed(state, card) {
  return card.visibility.length === state.game.players.length
}

export function isVisible(state, card) {
  return (
    card.visibility === 'all'
    || (card.visibility === 'president' && presidentName(state) === state.ui.player.name)
    || card.visibility.includes(state.ui.player.name)
  )
}

export function logEnrichArgClasses(msg) {
  if (!msg.args)
    return

  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the dict has a classes entry
    const classes = msg.args[key].classes || []
    msg.args[key].classes = classes

    if (key === 'player') {
      pushUnique(classes, 'player-name')
    }
    else if (key === 'character') {
      pushUnique(classes, 'character-name')
      pushUnique(classes, bsgutil.characterNameToCssClass(msg.args[key].value))
    }
    else if (key === 'location') {
      pushUnique(classes, 'location-name')
    }
    else if (key === 'phase') {
      pushUnique(classes, 'phase-name')
    }
    else if (key === 'title') {
      pushUnique(classes, 'title-name')
    }
    else if (key === 'card') {
      const card = msg.args['card']
      if (typeof card !== 'object') {
        throw `Pass whole card object to log for better logging. Got: ${card}`
      }
      msg.args['card'] = {
        value: card.name,
        visibility: card.visibility,
        kind: card.kind,
        classes: [`card-${card.kind}`],
      }
    }
  }
}

export function log(state, msgObject) {
  if (state.ui.redoing) {
    return
  }

  logEnrichArgClasses(msgObject)
  msgObject.actor = state.ui.player.name

  const log = state.game.log
  msgObject.id = log.length
  log.push(msgObject)

  if (!state.ui.undoing) {
    state.ui.newLogs.push(msgObject)
  }
}

export function maybeReshuffleDiscard(state, zone) {
  if (zone.cards.length > 0)
    return

  if (!zone.discard)
    return

  const discardName = zone.name.replace('decks.', 'discard.')
  const discard = zoneGet(state, discardName)

  zone.cards = shuffleArray(state, [...discard.cards])
  discard.cards = []

  log(state, {
    template: "Shuffled discard pile back into {zone}",
    classes: ['skill-deck-shuffle'],
    args: {
      zone: zone.name
    },
  })
}

export function moveCard(state, data) {
  const sourceZone = zoneGet(state, data.source)
  const targetZone = zoneGet(state, data.target)

  if (data.reshuffle) {
    maybeReshuffleDiscard(state, sourceZone)
  }

  const source = sourceZone.cards
  const target = targetZone.cards

  const sourceIdx = data.cardId
                  ? source.findIndex(x => x.id === data.cardId)
                  : data.sourceIndex
  const targetIdx = data.targetIndex || target.length

  if (sourceIdx === -1) {
    throw `Card not found in source. ${data.cardId}, ${data.source}`
  }

  // The actual state updates
  const card = source.splice(sourceIdx, 1)[0]
  target.splice(targetIdx, 0, card)

  // Adjust the card's visibility based on its new zone
  cardAdjustVisibility(
    state,
    card,
    data.target,
  )

  // If the new zone is a 'bag', randomize it automatically
  if (targetZone.kind === 'bag') {
    zoneShuffle(state, data.target)
  }

  log(state, {
    template: "{card} moved from {source} to {target}",
    classes: ['card-move'],
    args: {
      card,
      source: data.source,
      target: data.target,
    },
  })
}

export function playerCanSeeCard(state, player, card) {
  return card.visibility === 'all'
      || (card.visibility === 'president' && playerIsPresident(state, player))
      || card.visibility.includes(player.name)
}

export function playerIsPresident(state, player) {
  return player.name === presidentName(state)
}

export function playerByName(state, name) {
  return state.game.players.find(p => p.name === name)
}

export function playerCharacter(state, playerName) {
  const hand = playerZone(state, playerName).cards
  for (const card of hand) {
    if (card.kind === 'character') {
      return card
    }
  }
}

export function playerFollowing(state, player) {
  const players = state.game.players
  for (let i = 0; i < players.length; i++) {
    if (players[i].name === player.name) {
      const nextIndex = (i + 1) % players.length
      return players[nextIndex]
    }
  }

  throw `Player not found: ${player.name}`
}

export function playerWithCard(state, cardName) {
  for (const player of state.game.players) {
    const zone = zoneGet(state, `players.${player.name}`)
    if (zone.cards.find(c => c.name === cardName)) {
      return player
    }
  }
  return {}
}

export function playerZone(state, playerName) {
  return state.game.zones.players[playerName]
}

export function presidentName(state) {
  return playerWithCard(state, 'President').name
}

export function pushUnique(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

export function setupInitialShips(state) {
  log(state, {
    template: 'Setting up initial ships',
    classes: ['admin-action'],
    args: {},
  })

  // Raiders
  for (let i = 0; i < 3; i++) {
    moveCard(state, {
      source: 'ships.raiders',
      target: 'space.space0',
    })
  }

  // Basestar
  moveCard(state, {
    source: 'ships.basestarA',
    target: 'space.space0',
  })

  // Vipers
  moveCard(state, {
    source: 'ships.vipers',
    target: 'space.space5',
  })
  moveCard(state, {
    source: 'ships.vipers',
    target: 'space.space4',
  })

  // Civilians
  for (let i = 0; i < 2; i++) {
    moveCard(state, {
      source: 'decks.civilian',
      target: 'space.space3',
    })
  }

}

export function shuffleArray(state, array) {
  return util.shuffleArray(array, getRng(state))
}

export function viewerCanSeeCard(state, card) {
  return playerCanSeeCard(state, state.ui.player, card)
}

export function viewerIsPresident(state) {
  return playerIsPresident(state, state.ui.player)
}

export function zoneGet(state, name) {
  const tokens = name.split('.')
  let zone = state.game.zones
  while (tokens.length) {
    const next = tokens.shift()
    zone = zone[next]
    if (!zone) {
      throw `Error loading ${next} of zone ${name}.`
    }
  }

  return zone
}

export function zoneShuffle(state, zoneName) {
  const cards = zoneGet(state, zoneName).cards
  cards.forEach(c => c.visibility = [])
  shuffleArray(state, cards)
}
