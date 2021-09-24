import * as $ from './helpers.js'


const mutations = {
  crisisHelp(state, { playerName, amount }) {
    const player = $.playerByName(state, playerName)
    $.compatCrisisHelp(player)
    player.crisisHelp = amount

    $.log(state, {
      template: `I can help {amount}`,
      classes: ['crisis-help'],
      args: { amount },
    })
  },

  move(state, data) {
    $.moveCard(state, data)
  },

  passTo(state, name) {
    state.game.waitingFor = name
    $.log(state, {
      template: `Pass to {player}`,
      classes: ['pass-priority'],
      args: {
        player: name,
      },
    })
  },

  resourceChange(state, { name, amount }) {
    const before = state.game.counters[name]
    state.game.counters[name] += amount

    $.log(state, {
      template: "{counter} adjusted from {before} to {after}",
      classes: ['counter-change'],
      args: {
        counter: name,
        before: before,
        after: before + amount
      },
    })
  },

  userSet(state, user) {
    state.ui.player = user
  },

  zoneDiscardAll(state, zoneName) {
    const zone = $.zoneGet(state, zoneName)
    for (const card of zone.cards) {
      const discardName = $.getDiscardName(state, card.deck)
      const discard = $.zoneGet(state, discardName)
      discard.cards.push(card)
    }

    zone.cards = []

    $.log(state, {
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
      if (!$.isRevealed(state, card)) {
        $.cardReveal(state, card)
      }
    }
  },

  zoneRevealNext(state, zoneName) {
    const cards = $.zoneGet(state, zoneName).cards
    for (const card of cards) {
      if (!$.isRevealed(state, card)) {
        $.cardReveal(state, card)
        break
      }
    }
  },

  zoneShuffle(state, zoneName) {
    $.zoneShuffle(state, zoneName)

    $.log(state, {
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
}

export default mutations
