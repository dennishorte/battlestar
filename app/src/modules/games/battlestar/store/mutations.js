import RecordKeeper from '@/modules/games/common/lib/recordkeeper.js'
import util from '@/util.js'

import * as $ from './helpers.js'
import bsgutil from '../lib/util.js'


function _cardSetVisibilityByZone(card, zone) {
  const zoneVis = zone.visibility || zone.kind

  if (zoneVis === 'open') {
    rk.session.replace(card.visibility, ['all'])
  }
  else if (zoneVis === 'president') {
    rk.session.replace(card.visibility, [$.presidentName(rk.game)])
  }
  else if (zoneVis === 'owner') {
    rk.session.replace(card.visibility, [zone.owner])
  }
  else if (zoneVis === 'deck'
           || zoneVis === 'hidden'
           || zoneVis === 'bag') {
    rk.session.replace(card.visibility, [])
  }
  else {
    throw `Unknown zone visibility (${zoneVis}) for zone ${zone.name}`
  }
}

function pushUnique(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

function _logEnrichArgClasses(msg) {
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

function _log(state, msgObject) {
  _logEnrichArgClasses(msgObject)
  msgObject.actor = state.ui.player.name
  msgObject.id = state.game.log.length

  rk.session.splice(
    state.game.log,
    state.game.log.length,
    0,
    util.deepcopy(msgObject),
  )
}

function _maybeReshuffleDiscard(zone) {
  if (zone.cards.length > 0)
    return

  if (!zone.discard)
    return

  const discardName = zone.name.replace('decks.', 'discard.')
  const discard = $.zoneGet(rk.game, discardName)

  rk.session.replace(zone.cards, discard.cards)
  rk.session.replace(discard.cards, [])
  _shuffle(zone.cards)

  _log(rk.game, {
    template: "Shuffled discard pile back into {zone}",
    classes: ['skill-deck-shuffle'],
    args: {
      zone: zone.name
    },
  })
}

function _move(source, sourceIndex, target, targetIndex) {
  const card = source[sourceIndex]
  rk.session.splice(source, sourceIndex, 1)
  rk.session.splice(target, targetIndex, 0, card)
}

function _moveConvertSourceIndex(data, sourceZone) {
  // Calculate the actual sourceIndex as positive integer (or zero)
  if (data.cardId) {
    data.sourceIndex = sourceZone.cards.findIndex(x => x.id === data.cardId)
  }
  else if (data.sourceIndex === 'top') {
    data.sourceIndex = 0
  }
  else if (data.sourceIndex === 'bottom') {
    data.sourceIndex = sourceZone.cards.length
  }
  else if (data.sourceIndex < 0) {
    data.sourceIndex = sourceZone.cards.length + data.sourceIndex
  }
  else {
    data.sourceIndex = data.sourceIndex || 0
  }
}

function _moveConvertTargetIndex(data, targetZone) {
  // Calculate the actual targetIndex as positive integer (or zero)
  if (data.targetIndex === undefined) {
    data.targetIndex = targetZone.cards.length
  }
  else if (data.targetIndex === 'top') {
    data.targetIndex = 0
  }
  else if (data.targetIndex === 'bottom') {
    data.targetIndex = targetZone.cards.length
  }
  else if (data.targetIndex < 0) {
    data.targetIndex = targetZone.cards.length + data.targetIndex
  }
  else {
    /* data.targetIndex = data.targetIndex */
  }
}

function _moveCommitLog(state, data) {
  const sourceZone = $.zoneGet(state, data.source)
  const targetZone = $.zoneGet(state, data.target)
  const card = targetZone.cards[data.targetIndex]

  let sourceString
  if (sourceZone.kind === 'deck') {
    if (data.sourceIndex === 0) {
      sourceString = `top of ${data.source}`
    }
    else if (data.sourceIndex === sourceZone.cards.length) {
      sourceString = `bottom of ${data.source}`
    }
    else {
      sourceString = `${data.sourceIndex + 1}th from top of ${data.source}`
    }
  }
  else {
    sourceString = data.source
  }

  let targetString
  if (targetZone.kind === 'deck') {
    if (data.targetIndex === 0) {
      targetString = `top of ${data.target}`
    }
    else if (data.targetIndex === targetZone.cards.length - 1) {
      targetString = `bottom of ${data.target}`
    }
    else {
      targetString = `${data.targetIndex + 1}th from top of ${data.target}`
    }
  }
  else {
    targetString = data.target
  }

  _log(state, {
    template: "{card} moved from {source} to {target}",
    classes: ['card-move'],
    args: {
      card,
      source: sourceString,
      target: targetString,
    },
  })
}

function _moveCommit(state, data) {
  const sourceZone = $.zoneGet(state, data.source)
  const targetZone = $.zoneGet(state, data.target)

  _moveConvertSourceIndex(data, sourceZone)
  _moveConvertTargetIndex(data, targetZone)

  _maybeReshuffleDiscard(sourceZone)
  _move(
    sourceZone.cards,
    data.sourceIndex,
    targetZone.cards,
    data.targetIndex,
  )
  _moveCommitLog(state, data)

  // Update the visibility of the card to its new zone
  const card = targetZone.cards[data.targetIndex]
  _cardSetVisibilityByZone(card, targetZone)

  // If the new zone is a 'bag', randomize it automatically
  if (targetZone.kind === 'bag') {
    _shuffle(targetZone.cards)
  }

  // If the new zone is the crisis pool, remember how many cards this player put in.
  if (targetZone.name === 'crisisPool') {
    if (sourceZone.name.startsWith('players')) {
      const playerName = sourceZone.name.slice(8)
      const player = $.playerByName(state, playerName)
      if (player.crisisCount === -1) {
        player.crisisCount = 1
      }
      else {
        player.crisisCount += 1
      }
    }
  }
}

function _phaseSet(state, phaseName) {
  rk.session.put(rk.game, 'phase', phaseName)

  if (phaseName === 'main-crisis') {
    rk.session.put(rk.game, 'crisisStep', 'discuss')

    if ($.zoneGet(state, 'crisisPool').cards.length === 0) {
      for (const player of state.game.players) {
        rk.session.put(player, 'crisisHelp', '')
        rk.session.put(player, 'crisisCount', -1)
        rk.session.put(player, 'crisisDone', false)
        rk.session.put(rk.game, 'crisisDestinyAdded', false)
      }
    }
  }
  else if (phaseName === 'main-prepare-for-jump') {
    rk.session.put(rk.game, 'crisisStep', 'jump')
  }
}

function _resourceChange(state, name, amount) {
  const before = state.game.counters[name]

  rk.session.put(
    state.game.counters,
    name,
    before + amount
  )

  _log(state, {
    template: "{counter} adjusted from {before} to {after}",
    classes: ['counter-change'],
    args: {
      counter: name,
      before: before,
      after: before + amount
    },
  })
}

function _refillDestiny(state) {
  _log(state, {
    template: 'Refilling destiny deck',
    classes: ['admin-action'],
  })

  for (const skill of bsgutil.skillList) {
    for (let i = 0; i < 2; i++) {
      if (skill === 'treachery')
        continue

      _moveCommit(state, {
        source: `decks.${skill}`,
        sourceIndex: 0,
        target: `destiny`,
      })
    }
  }
}


function _shuffle(array) {
  const copy = [...array]
  util.shuffleArray(copy)
  rk.session.replace(array, copy)

  copy.forEach(c => rk.session.replace(c.visibility, []))
}

function _zoneDiscardAll(state, zoneName) {
  const zone = $.zoneGet(state, zoneName)

  _log(state, {
    template: `Discarding all cards from {zone}`,
    classes: [],
    args: {
      zone: zoneName,
    },
  })

  const cardsLength = zone.cards.length
  for (let i = 0; i < cardsLength; i++) {
    const card = zone.cards[0]
    const discardName = $.getDiscardName(state, card.deck)
    const discard = $.zoneGet(state, discardName)
    _move(
      zone.cards, 0,
      discard.cards, discard.cards.length
    )

  }
}


const mutations = {
  addDestinyCards(state) {
    _log(state, {
      template: 'Adding cards from the destiny deck',
      classes: ['admin-action'],
    })

    const destiny = $.zoneGet(state, 'destiny')

    for (let i = 0; i < 2; i++) {
      if (destiny.cards.length === 0) {
        _refillDestiny(state)
      }

      _moveCommit(state, {
        source: 'destiny',
        target: 'crisisPool',
      })
    }

    rk.session.put(rk.game, 'crisisDestinyAdded', true)
  },

  advanceJumpTrack(state) {
    _resourceChange(state, 'jumpTrack', 1)
    rk.session.put(
      rk.game,
      'crisisStep',
      'done',
    )
  },

  characterAssign(state, { characterName, playerName }) {
    _log(state, {
      template: '{player} chooses {character}',
      classes: ['player-action', 'character-assign'],
      args: {
        player: playerName,
        character: characterName,
      },
    })

    // Grab the character card
    const characterZone = $.zoneGet(state, 'decks.character')
    const characterCard = characterZone.cards.find(c => c.name === characterName)
    const characterIndex = characterZone.cards.indexOf(characterCard)

    // Move the character card to the player's hand
    _moveCommit(state, {
      source: 'decks.character',
      sourceIndex: characterIndex,
      target: `players.${playerName}`,
      targetIndex: 0,  // Put it at the top of the player hand
    })

    // Find the player's pawn
    const playerHand = $.zoneGet(state, `players.${playerName}`)
    const pawnIndex = playerHand.cards.findIndex(c => c.kind === 'player-token')

    _moveCommit(state, {
      source: `players.${playerName}`,
      sourceIndex: pawnIndex,
      target: $.locationZoneName(state, characterCard.setup),
    })
  },

  crisisCleanup(state) {
    _log(state, {
      template: 'Cleaning up crisis',
      classes: ['admin-action']
    })

    const crisis = $.commonCrisis(state)
    _moveCommit(state, {
      source: 'common',
      cardId: crisis.id,
      target: 'discard.crisis',
    })

    _zoneDiscardAll(state, 'crisisPool')
  },

  clearSpace(state) {
    _log(state, {
      template: 'Removing all ships',
      classes: ['admin-action'],
      args: {}
    })

    for (const zone of Object.values(state.game.zones.space)) {
      const cardsCopy = [...zone.cards]

      for (const card of cardsCopy) {
        let deck
        if (card.kind.startsWith('ships.')) {
          deck = card.kind
        }
        else if (card.kind === 'player-token') {
          deck = 'locations.galactica.hangarDeck'
        }
        else if (card.kind === 'civilian') {
          deck = 'decks.civilian'
        }
        else {
          alert(`Unknown ship kind '${card.kind}'. Can't clean up. Do not save. Please reload.`)
          return
        }

        _moveCommit(state, {
          source: `space.${zone.name}`,
          cardId: card.id,
          target: deck,
        })
      }
    }
  },

  crisisDoneAdding(state) {
    const player = $.playerByName(state, state.ui.player.name)
    rk.session.put(
      player,
      'crisisDone',
      true,
    )

    if (player.crisisCount < 0) {
      rk.session.put(
        player,
        'crisisCount',
        0,
      )
    }

    _log(state, {
      template: '{player} added {amount} cards',
      classes: [],
      args: {
        player: player.name,
        amount: player.crisisCount,
      }
    })
  },

  crisisHelp(state, { playerName, amount }) {
    const player = $.playerByName(state, playerName)

    rk.session.put(
      player,
      'crisisHelp',
      amount,
    )

    _log(state, {
      template: 'I can help {amount}',
      classes: ['crisis-help'],
      args: { amount },
    })
  },

  crisisStep(state, name) {
    rk.session.put(rk.game, 'crisisStep', name)
    _log(state, {
      template: 'Crisis step set to {step}',
      classes: [],
      args: {
        step: name,
      }
    })
  },

  drawCrisis(state) {
    _moveCommit(state, {
      source: 'decks.crisis',
      target: 'common',
    })
  },

  drawSkills(state, { playerName, kinds }) {
    for (const kind of kinds) {
      const deckName = `decks.${kind}`
      const playerZone = `players.${playerName}`

      _moveCommit(state, {
        source: deckName,
        target: playerZone,
      })
    }
  },

  log(state, msg) {
    _log(state, msg)
  },

  maybeReshuffleDiscard(state, zoneName) {
    const zone = $.zoneGet(state, zoneName)
    _maybeReshuffleDiscard(zone)
  },

  move(state, data) {
    _moveCommit(state, data)
  },

  passTo(state, name) {
    rk.session.put(
      rk.game,
      'waitingFor',
      name,
    )

    _log(state, {
      template: `Pass to {player}`,
      classes: ['pass-priority'],
      args: {
        player: name,
      },
    })
  },

  phaseSet(state, phaseName) {
    _log(state, {
      template: "Phase set to {phase}",
      classes: ['phase-change'],
      args: { phase: phaseName },
    })

    _phaseSet(state, phaseName)
  },

  playerAdvance(state) {
    const activePlayer = $.playerByName(state, state.game.activePlayer)

    rk.session.put(state.game, 'activePlayer', $.playerFollowing(state, activePlayer).name)

    _log(state, {
      template: `Start turn of {player}`,
      classes: ['pass-turn'],
      args: {
        player: state.game.activePlayer,
      },
    })

    _phaseSet(state, 'main-receive-skills')
  },

  refillDestiny(state) {
    _refillDestiny(state)
  },

  resourceChange(state, { name, amount }) {
    _resourceChange(state, name, amount)
  },

  zoneDiscardAll(state, zoneName) {
    _zoneDiscardAll(state, zoneName)
  },

  zoneRevealAll(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      rk.session.replace(card.visibility, ['all'])
    }
  },

  zoneRevealNext(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      if (!$.isRevealed(state, card)) {
        rk.session.replace(card.visibility, ['all'])
        break
      }
    }
  },

  zoneShuffle(state, zoneName) {
    const zone = $.zoneGet(state, zoneName)
    _shuffle(zone.cards)

    _log(state, {
      template: "{zone} shuffled",
      classes: [],
      args: {
        zone: zoneName,
      },
    })
  },

  zoneViewAll(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      if (!$.isVisible(state, card)) {
        rk.session.splice(card.visibility, 0, 0, state.ui.player.name)
      }
    }
  },

  zoneViewNext(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      if (!$.isVisible(state, card)) {
        rk.session.splice(card.visibility, 0, 0, state.ui.player.name)
        break
      }
    }
  },


  ////////////////////////////////////////////////////////////////////////////////
  // undo/redo/etc.

  redo() {
    rk.redo()
  },

  undo() {
    rk.undo()
  },

  load(state, data) {
    state.game = data
    rk = new RecordKeeper('waiting')  // Ensures it is fully reset
    rk.load(data)
    localSession = false
  },
}


let rk = new RecordKeeper('waiting')
let localSession = false
const wrappedMutations = {}

for (const [name, func] of Object.entries(mutations)) {
  wrappedMutations[name] = function() {
    // Initialize record keeper or ensure its state is consistent
    const state = arguments[0]
    if (rk.game === 'waiting') {
      rk.load(state.game)
    }
    else if (rk.game !== state.game) {
      throw "RecordKeeper state doesn't match mutation state."
    }

    // Mark that there are unsaved actions
    if (name !== 'load') {
      console.log('mutation: ', name)
      state.ui.unsavedActions = true
    }

    // Start a session if none is in progress
    if (!rk.session) {
      localSession = true
      rk.sessionStart()
    }

    // Execute the mutation
    const result = func(...arguments)

    // End the session, if it was started inside this function
    if (localSession) {
      rk.session.commit()
    }

    return result
  }
}

export default wrappedMutations
