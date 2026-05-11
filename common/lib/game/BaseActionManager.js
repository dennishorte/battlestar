const { GameProxy } = require('./GameProxy.js')
const selector = require('../selector.js')

const SAFE_BARE_OPTIONS = new Set([
  'Pass', 'Skip', 'Continue', 'Cancel', 'Done',
  'Yes', 'No', 'yes', 'no',
  'heads', 'tails',
])

class BaseActionManager {
  constructor(game) {
    this.game = game
    return GameProxy.create(this)
  }

  static SAFE_BARE_OPTIONS = SAFE_BARE_OPTIONS

  option({ id, title, kind, defId, meta } = {}) {
    const opt = { title: title ?? String(id) }
    if (id != null) {
      opt.id = id
    }
    if (defId != null) {
      opt.defId = defId
    }
    if (kind != null) {
      opt.kind = kind
    }
    if (meta != null) {
      opt.meta = meta
    }
    return opt
  }

  cardOption(card, kind = 'card') {
    const opt = { title: card.name, id: card.id, kind }
    if (card.defId != null) {
      opt.defId = card.defId
    }
    return opt
  }

  playerOption(player) {
    return { title: player.name, id: player.name, kind: 'player' }
  }

  choose(player, choices, opts={}) {
    if (choices.length === 0) {
      this.log.addNoEffect()
      return []
    }

    let title = opts.title || 'Choose'
    if (opts.min === 0) {
      opts.title = '(optional) ' + title
    }

    this._warnOnBareStrings(choices, opts.title || title)

    const chooseSelector = {
      type: 'select',
      actor: player.name,
      choices: choices,
      ...opts
    }

    const selected = this.game.requestInputSingle(chooseSelector)

    // Action-based responses (e.g. board clicks) return an object, not an array
    if (selected && selected.action) {
      return selected
    }

    this._validateChooseResponse(selected, chooseSelector)

    if (selected.length === 0) {
      this.log.addDoNothing(player, 'make a selection')
      return []
    }
    else {
      return selected
    }
  }

  _validateChooseResponse(selected, chooseSelector) {
    // Build response object in the format selector.validate expects
    const response = {
      title: chooseSelector.title,
      selection: selected,
    }

    const result = selector.validate(chooseSelector, response, { ignoreTitle: !chooseSelector.title })

    if (!result.valid) {
      throw new Error(`Invalid selection: ${result.mismatch}`)
    }

    return true
  }

  // Dev-time warning when a non-structured option slips through. Skips test
  // runs to avoid spamming Jest output; surfaces during dev play through the
  // browser console. Numeric strings are also exempt (1, 2, … are common as
  // count-style selections).
  _warnOnBareStrings(choices, title) {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    if (process.env.NODE_ENV === 'test') {
      return
    }
    for (const c of choices) {
      if (typeof c !== 'string') {
        continue
      }
      if (SAFE_BARE_OPTIONS.has(c)) {
        continue
      }
      if (/^\d+$/.test(c)) {
        continue
      }
      console.warn(
        `[choose] bare-string option "${c}" in prompt "${title ?? 'Choose'}" — emit {title, id, kind?} instead`
      )
    }
  }

  chooseCard(player, choices, opts={}) {
    return this.chooseCards(player, choices, opts)[0]
  }

  chooseCards(player, choices, opts={}) {
    while (true) {
      // Emit structured choice objects carrying both a display title and a stable id,
      // so that name collisions between cards (e.g. two "Desert Power" cards from
      // different decks) resolve deterministically. Responses may still arrive as
      // bare titles from legacy clients — in that case we fall back to name matching,
      // which is non-deterministic under collisions but preserves prior behavior.
      const choiceObjs = choices
        .map(c => {
          const obj = { title: c.name, id: c.id }
          if (c.defId) {
            // Expose the card's definition id so the UI can resolve the
            // display chip without parsing instance-id conventions.
            obj.defId = c.defId
          }
          if (opts.kind) {
            obj.kind = opts.kind
          }
          return obj
        })
        .sort((a, b) => a.title.localeCompare(b.title))
      const selection = this.choose(player, choiceObjs, opts)
      const used = []

      const selectedCards = selection.map(s => {
        const selId = s && typeof s === 'object' ? s.id : null
        const selTitle = s && typeof s === 'object' ? s.title : s
        let card = null
        if (selId) {
          card = choices.find(c => c.id === selId && !used.some(u => u.id === c.id))
        }
        if (!card) {
          card = choices.find(c => c.name === selTitle && !used.some(u => u.id === c.id))
        }
        used.push(card)
        return card
      })

      if (opts.guard && !opts.guard(selectedCards)) {
        this.log.add({ template: 'Invalid selection' })
        continue
      }
      else {
        return selectedCards
      }
    }
  }

  choosePlayer(player, choices, opts={}) {
    const selected = this.choose(
      player,
      choices.map(p => this.playerOption(p)),
      { ...opts, title: opts.title ?? 'Choose Player' },
    )
    const pick = selected[0]
    // `?? pick` keeps back-compat with stored bare-string responses from
    // games recorded before structured options shipped.
    const id = pick?.id ?? pick
    return choices.find(p => p.name === id)
  }

  chooseYesNo(player, title) {
    const choice = this.choose(player, [
      { title: 'yes', id: 'yes' },
      { title: 'no', id: 'no' },
    ], { title, count: 1 })
    const pick = choice[0]
    return (pick?.id ?? pick) === 'yes'
  }

  flipCoin(player) {
    const choice = this.choose(player, ['heads', 'tails'], {
      title: 'Call it...'
    })[0]
    const value = this.game.random() < .5 ? 'heads' : 'tails'

    this.log.add({
      template: '{player} calls {choice}',
      args: { player, choice },
    })

    this.log.add({
      template: '...and the flip comes up: ' + value
    })

    return value === choice
  }

  rollDie(player, faces) {
    const result = Math.floor(this.game.random() * faces) + 1

    const extra = faces === 2
      ? (result === 1 ? ' (heads)' : ' (tails)')
      : ''

    this.log.add({
      template: `{player} rolled ${result} on a d${faces}${extra}`,
      args: { player },
      classes: ['die-roll'],
    })
  }
}

module.exports = {
  BaseActionManager,
}
