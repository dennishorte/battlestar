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
    rk.session.replace(card.visibility, [$.presidentName(rk.state)])
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
    msgObject,
  )
}

function _maybeReshuffleDiscard(zone) {
  if (zone.cards.length > 0)
    return

  if (!zone.discard)
    return

  const discardName = zone.name.replace('decks.', 'discard.')
  const discard = $.zoneGet(rk.state, discardName)

  rk.session.replace(zone.cards, discard.cards)
  rk.session.replace(discard.cards, [])
  _shuffle(zone.cards)

  _log(rk.state, {
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

function _moveCommit(state, data) {
  const sourceZone = $.zoneGet(state, data.source)
  const targetZone = $.zoneGet(state, data.target)

  // Calculate the actual sourceIndex as positive integer (or zero)
  let sourceIndex
  if (data.cardId) {
    sourceIndex = sourceZone.cards.findIndex(x => x.id === data.cardId)
  }
  else if (data.sourceIndex < 0) {
    sourceIndex = sourceZone.cards.length + data.sourceIndex
  }
  else {
    sourceIndex = data.sourceIndex || 0
  }

  // Calculate the actual targetIndex as positive integer (or zero)
  let targetIndex
  if (data.targetIndex === undefined) {
    targetIndex = targetZone.cards.length
  }
  else if (data.targetIndex < 0) {
    targetIndex = targetZone.cards.length + data.targetIndex
  }
  else {
    targetIndex = data.targetIndex
  }

  /* console.log({
   *   sourceZone,
   *   sourceIndex,
   *   targetZone,
   *   targetIndex,
   * }) */

  _maybeReshuffleDiscard(sourceZone)
  _move(
    sourceZone.cards,
    sourceIndex,
    targetZone.cards,
    targetIndex,
  )

  // Update the visibility of the card to its new zone
  const card = targetZone.cards[targetIndex]
  _cardSetVisibilityByZone(card, targetZone)

  // If the new zone is a 'bag', randomize it automatically
  if (targetZone.kind === 'bag') {
    _shuffle(targetZone.cards)
  }

  _log(state, {
    template: "{card} moved from {source} to {target}",
    classes: ['card-move'],
    args: {
      card,
      source: data.source,
      target: data.target,
    },
  })
}

function _phaseSet(phaseName) {
  rk.session.put(rk.state, 'phase', phaseName)
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

  crisisHelp(state, { playerName, amount }) {
    const player = $.playerByName(state, playerName)

    rk.session.put(
      player,
      'crisisHelp',
      amount,
    )

    _log(state, {
      template: `I can help {amount}`,
      classes: ['crisis-help'],
      args: { amount },
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
      state,
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

    _phaseSet(phaseName)

    if (phaseName === 'main-crisis') {
      if ($.zoneGet(state,'crisisPool').cards.length === 0) {
        for (const player in state.game.players) {
          rk.session.put(player, 'crisisHelp', '')
        }
      }
    }
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

    _phaseSet('main-receive-skills')
  },

  refillDestiny(state) {
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
  },

  resourceChange(state, { name, amount }) {
    const before = state.game.counters[name]

    rk.session.put(
      state.game.counters,
      name,
      state.game.counters[name] + amount
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
        $.cardView(state, card, state.ui.player)
      }
    }
  },

  zoneViewNext(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      if (!$.isVisible(state, card)) {
        $.cardView(state, card, state.ui.player)
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
    rk.loadState(data)
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
    if (rk.state === 'waiting') {
      rk.loadState(state.game)
    }
    else if (rk.state !== state.game) {
      throw "RecordKeeper state doesn't match mutation state."
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
