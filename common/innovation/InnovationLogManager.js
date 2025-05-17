import { LogManager } from '../lib/game/LogManager.js'


class InnovationLogManager extends LogManager {
  _postEnrichArgs(entry) {
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
        prev.args.player.value === entry.args.player.value
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
}

module.exports = { InnovationLogManager }
