const { BaseLogManager } = require('../lib/game/index.js')


class UltimateLogManager extends BaseLogManager {
  constructor(game, chat, viewerName) {
    super(game, chat, viewerName)
    this._registerUltimateHandlers()
    this._pendingColorChoice = null
    this._addingColorChoice = false
  }

  reset() {
    super.reset()
    this._pendingColorChoice = null
    this._addingColorChoice = false
  }

  // Remember which color was picked. The line stays unless a following log
  // already names that color (a splay, an unsplay, or an explicit "chooses"
  // line). If the next log does not name it — Ninja, when no card comes
  // back — the line remains so the choice is visible.
  noteColorChoice(player, colors) {
    if (!colors || colors.length === 0) {
      return
    }

    const args = { player }
    let template
    if (colors.length === 1) {
      template = '{player} chooses {color}'
      args.color = colors[0]
    }
    else if (colors.length === 2) {
      template = '{player} chooses {color1} and {color2}'
      args.color1 = colors[0]
      args.color2 = colors[1]
    }
    else {
      template = '{player} chooses {colors}'
      args.colors = `${colors.slice(0, -1).join(', ')}, and ${colors[colors.length - 1]}`
    }

    this._addingColorChoice = true
    try {
      this.add({
        template,
        args,
        classes: ['faded-text'],
      })
    }
    finally {
      this._addingColorChoice = false
    }

    const entry = this._log[this._log.length - 1]
    this._pendingColorChoice = {
      entry,
      colors: [...colors],
    }
  }

  _registerUltimateHandlers() {
    // Override the default card handler with Ultimate-specific logic
    this.registerHandler('card*', (card) => {
      let name
      if (card.isSpecialAchievement || card.isDecree) {
        name = card.name
      }
      else {
        const viewerCanSee = Boolean(card.visibility.find(player => player.name === this._viewerName))
        name = viewerCanSee ? card.name : card.getHiddenName(this._name)
      }

      const classes = ['card']
      if (!card.isSpecialAchievement && card.getAge()) {
        classes.push(`card-age-${card.visibleAge || card.getAge()}`)
      }
      if (card.expansion) {
        classes.push(`card-exp-${card.expansion}`)
      }
      if (name === 'hidden') {
        classes.push('card-hidden')
      }

      return {
        value: name,
        classes,
        card,
      }
    })

    this.registerHandler('biscuit*', (biscuit) => {
      if (biscuit.length === 1) {
        return {
          value: this._game.util.biscuitIconToName(biscuit),
          classes: ['biscuit'],
        }
      }
      else {
        return {
          value: biscuit,
          classes: ['biscuit'],
        }
      }
    })
  }

  _postEnrichArgs(entry) {
    const absorbed = this._combineWithPreviousDraw(entry)
    this._retirePendingColorChoice(entry)
    return absorbed
  }

  _combineWithPreviousDraw(entry) {
    // Attempt to combine this entry with the previous entry.

    if (this.getLog().length === 0) {
      return false
    }

    const prev = this.getLog().slice(-1)[0]

    if (!prev.args) {
      return
    }

    const combinable = ['foreshadows', 'melds', 'returns', 'tucks', 'reveals', 'scores', 'junks']
    const entryAction = entry.template.split(' ')[1]

    const entryIsCombinable = combinable.includes(entryAction)
    const prevWasDraw = (
      prev.template === '{player} draws {card}'
      || prev.template === '{player} draws and reveals {card}'
    )

    if (entryIsCombinable && prevWasDraw) {
      const argsMatch = (
        prev.args.player && entry.args.player
        && prev.args.player.value === entry.args.player.value
        && prev.args.card && entry.args.card
        && prev.args.card.card === entry.args.card.card
      )

      if (argsMatch) {
        prev.template = prev.template.slice(0, -6) + 'and ' + entryAction + ' {card}'
        prev.args.card = entry.args.card
        return true
      }
    }

    return false
  }

  _retirePendingColorChoice(entry) {
    const pending = this._pendingColorChoice
    if (!pending) {
      return
    }

    // A new color choice closes the previous one. Keep that earlier line;
    // this entry is not the effect that followed it.
    if (this._addingColorChoice) {
      this._pendingColorChoice = null
      return
    }

    const remaining = []
    let mentionedAny = false
    for (const color of pending.colors) {
      if (this._entryMentionsColor(entry, color)) {
        mentionedAny = true
      }
      else {
        remaining.push(color)
      }
    }

    if (!mentionedAny) {
      this._pendingColorChoice = null
      return
    }

    if (remaining.length === 0) {
      const idx = this._log.indexOf(pending.entry)
      if (idx >= 0) {
        this._log.splice(idx, 1)
      }
      this._pendingColorChoice = null
      return
    }

    pending.colors = remaining
  }

  _entryMentionsColor(entry, color) {
    const pattern = new RegExp(`\\b${String(color).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (pattern.test(entry.template || '')) {
      return true
    }
    return Object.values(entry.args || {}).some(arg => this._argMentionsColor(arg, pattern))
  }

  _argMentionsColor(arg, pattern) {
    if (arg == null) {
      return false
    }
    if (typeof arg === 'string' || typeof arg === 'number') {
      return pattern.test(String(arg))
    }
    if (Array.isArray(arg)) {
      return arg.some(item => this._argMentionsColor(item, pattern))
    }
    if (typeof arg === 'object') {
      if (arg.value != null && pattern.test(String(arg.value))) {
        return true
      }
    }
    return false
  }

  addForeseen(wasForeseen, card) {
    if (wasForeseen) {
      this.add({
        template: '{card} was foreseen',
        args: { card }
      })
    }
    else {
      this.add({
        template: '{card} was NOT foreseen',
        args: { card }
      })
    }
  }
}

module.exports = { UltimateLogManager }
