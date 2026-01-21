/**
 * KarmaMixin - Self-contained interrupt/replacement system for Innovation
 *
 * The Karma system allows cards to intercept and modify game events.
 * Karmas can trigger on various game events (draw, meld, splay, etc.)
 * and can replace or modify the default behavior.
 *
 * Usage: Object.assign(Innovation.prototype, KarmaMixin)
 */

const util = require('../lib/util.js')

const KarmaMixin = {

  _aKarmaHelper(player, infos, opts={}) {
    let info = infos[0]

    if (infos.length === 0) {
      return
    }

    /*
       from the rules:
       In the rare case that multiple "Would" karmas are triggered
       by the same game event, the current player decides which
       karma occurs and ignores the others.
     */
    else if (infos.length > 1) {
      if (info.impl.kind && info.impl.kind.startsWith('would')) {
        this.log.add({
          template: 'Multiple `would` karma effects would trigger, so {player} will choose one',
          args: { player: this.players.current() }
        })

        const infoChoices = infos.map(info => info.card)
        const chosenCard = this.actions.chooseCard(
          this.players.current(),
          infoChoices,
          { title: 'Choose a would karma to trigger' }
        )
        info = infos.find(info => info.card === chosenCard)
      }
      else {
        throw new Error('Multiple non-would Karmas not handled')
      }
    }

    opts = { ...opts, owner: info.owner, self: info.card }

    if (info.impl.kind && info.impl.kind.startsWith('would')) {
      if (opts.trigger === 'splay') {
        this.log.add({
          template: '{player} would splay {color}, triggering...',
          args: {
            player,
            color: opts.direction
          }
        })
      }
      else if (opts.trigger === 'no-share') {
        this.log.add({
          template: '{player} did not draw a sharing bonus, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'dogma') {
        this.log.add({
          template: '{player} would take a Dogma action, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'draw') {
        this.log.add({
          template: '{player} would draw a card, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'draw-action') {
        this.log.add({
          template: '{player} would take a draw action, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'decree') {
        this.log.add({
          template: '{player} would issue a decree, triggering...',
          args: {
            player,
          },
        })
      }
      else if (opts.trigger === 'exchange') {
        this.log.add({
          template: '{player} would exchange cards, triggering...',
          args: {
            player,
          }
        })
      }
      else {
        this.log.add({
          template: '{player} would {trigger} {card}, triggering...',
          args: {
            player,
            trigger: opts.trigger,
            card: opts.card,
          }
        })
      }
    }
    this.log.add({
      template: '{card} karma: {text}',
      args: {
        card: info.card,
        text: info.text
      }
    })
    this.log.indent()
    this._karmaIn()
    const result = this.aCardEffect(player, info, opts)
    this._karmaOut()
    this.log.outdent()

    if (info.impl.kind === 'variable' || info.impl.kind === 'game-over') {
      return result
    }
    else {
      return info.impl.kind
    }
  },

  aKarma(player, kind, opts={}) {
    const infos = this
      .getInfoByKarmaTrigger(player, kind)
      .filter(info => info.impl.matches)
      .filter(info => {
        return info.impl.matches(this, player, { ...opts, owner: info.owner, self: info.card })
      })

    return this._aKarmaHelper(player, infos, { ...opts, trigger: kind })
  },

  checkInKarma() {
    return this.state.karmaDepth > 0
  },

  getInfoByKarmaTrigger(player, trigger) {
    util.assert(typeof player.name === 'string', 'First parameter must be player object')
    util.assert(typeof trigger === 'string', 'Second parameter must be string.')

    // Karmas can't trigger while executing another karma.
    const isTriggeredKarma = !trigger.startsWith('list-') || trigger.endsWith('-effects')

    if (isTriggeredKarma && this.checkInKarma()) {
      return []
    }

    const global = this
      .players
      .other(player)
      .flatMap(opp => this.cards.tops(opp))
      .flatMap(card => card.getKarmaInfo(trigger))
      .filter(info => info.impl.triggerAll)

    const thisPlayer = this
      .cards
      .tops(player)
      .flatMap(card => card.getKarmaInfo(trigger))

    const all = [...thisPlayer, ...global]
      .map(info => ({ ...info, owner: this.players.byOwner(info.card) }))

    return all
  },

  _karmaIn() {
    this.state.karmaDepth += 1
  },

  _karmaOut() {
    util.assert(this.state.karmaDepth > 0, "Stepping out of zero karma")
    this.state.karmaDepth -= 1
  },

}

module.exports = {
  KarmaMixin,
}
