export function admiralName(state) {
  return playerWithCard(state, 'Admiral').name
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

export function playerNext(state) {
  const currentName = state.game.activePlayer
  const currentIndex = state.game.players.findIndex(p => p.name === currentName)
  const nextIndex = (currentIndex + 1) % state.game.players.length
  return state.game.players[nextIndex]
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
