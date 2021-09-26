import RecordKeeper from '@/lib/recordkeeper.js'
import { shuffleArray } from '@/util.js'

import * as $ from './helpers.js'
import bsgutil from '../lib/util.js'


function _cardSetVisibilityByZone(card, zone) {
  const zoneVis = zone.visibility || zone.kind

  if (zoneVis === 'open') {
    rk.session.replace(card.visibility, 'all')
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

function pushUnique() {}

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

function _shuffle(array) {
  const copy = [...array]
  shuffleArray(copy)
  rk.session.replace(array, copy)

  copy.forEach(c => rk.session.replace(c.visibility, []))

  /* _log(state, {
   *   template: "{zone} shuffled",
   *   classes: [],
   *   args: {
   *     zone: zoneName,
   *   },
   * }) */
}


const mutations = {
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

  log(state, msg) {
    _log(state, msg)
  },

  maybeReshuffleDiscard(state, zoneName) {
    const zone = $.zoneGet(state, zoneName)
    _maybeReshuffleDiscard(zone)
  },

  move(state, data) {
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
      targetIndex = 0
    }
    else if (data.targetIndex < 0) {
      targetIndex = targetZone.cards.length + data.targetIndex
    }
    else {
      targetIndex = data.targetIndex
    }

    _maybeReshuffleDiscard(sourceZone)
    _move(
      sourceZone.cards,
      sourceIndex,
      targetZone.cards,
      targetIndex,
    )

    // Update the visibility of the card to its new zone
    console.log('move', {data, sourceZone, sourceIndex, targetZone, targetIndex})
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
  },

  passTo(state, name) {
    rk.session.put(
      state.game,
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
    const zone = $.zoneGet(state, zoneName)
    for (let i = 0; i < zone.cards.length; i++) {
      const card = zone.cards[0]
      const discardName = $.getDiscardName(state, card.deck)
      const discard = $.zoneGet(state, discardName)
      _move(
        zone.cards, 0,
        discard.cards, discard.cards.length
      )

    }

    _log(state, {
      template: `All cards from {zone} discarded`,
      classes: [],
      args: {
        zone: zoneName,
      },
    })
  },

  zoneRevealAll(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      rk.session.replace(card.visibility, 'all')
    }
  },

  zoneRevealNext(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      if (!$.isRevealed(state, card)) {
        rk.session.replace(card.visibility, 'all')
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
}


const rk = new RecordKeeper('waiting')
const wrappedMutations = {}

for (const [name, func] of Object.entries(mutations)) {
  wrappedMutations[name] = function() {
    const state = arguments[0]
    if (rk.state === 'waiting') {
      rk.loadState(state.game)
    }
    else if (rk.state !== state.game) {
      throw "RecordKeeper state doesn't match mutation state."
    }

    let localSession = false
    if (!rk.session) {
      localSession = true
      rk.sessionStart()
    }

    const result = func(...arguments)

    if (localSession) {
      rk.session.commit()
    }

    console.log(rk)

    return result
  }
}

export default wrappedMutations
