const { BaseActionManager } = require('../lib/game/index.js')

class DuneActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
  }

  /**
   * On rules version 5, a player can play a legal Plot intrigue card beside
   * whatever decision is in front of them. The card is a side answer: the
   * decision is asked again afterwards. Version 4 never attaches that list,
   * so a stored game keeps its original prompts.
   */
  choose(player, choicesOrFn, opts = {}) {
    const playerTurns = require('./phases/playerTurns.js')
    while (true) {
      const produced = typeof choicesOrFn === 'function' ? choicesOrFn() : choicesOrFn
      // A describer may return { choices, count, maxCost, help } so one request
      // can require several groups (troops and dreadnoughts) that stay in sync
      // when a Plot changes what can be deployed.
      const described = produced && !Array.isArray(produced) && Array.isArray(produced.choices)
      const choices = described ? produced.choices : produced
      if (!choices || choices.length === 0) {
        return []
      }

      const plots = playerTurns.legalPlotActions(this.game, player, opts)
      const hasPlots = plots.length > 0
      const title = typeof opts.title === 'function' ? opts.title() : opts.title
      const selectorOpts = {
        ...opts,
        title,
        plotActions: hasPlots ? plots : undefined,
        noAutoRespond: opts.noAutoRespond || hasPlots || undefined,
      }
      if (described) {
        if (produced.count != null) {
          selectorOpts.count = produced.count
        }
        if (produced.maxCost != null) {
          selectorOpts.maxCost = produced.maxCost
        }
        if (produced.help) {
          selectorOpts.help = produced.help
        }
      }
      const result = super.choose(player, choices, selectorOpts)

      if (result && result.action === 'play-plot') {
        playerTurns.playPlot(this.game, player, result.cardId, opts)
        if (opts.allowTurnPass && this.game.state.turnTracking?.passedTurn) {
          return { action: 'turn-passed' }
        }
        continue
      }

      return result
    }
  }
}

module.exports = { DuneActionManager }
