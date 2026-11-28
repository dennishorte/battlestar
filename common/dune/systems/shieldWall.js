'use strict'

const boardSpaces = require('../res/boardSpaces.js')

/**
 * The Shield Wall blocks sandworms only at a conflict for one of the three
 * protected locations (Arrakeen, Spice Refinery, Imperial Basin). A conflict
 * with no location can still take sandworms while the token is on the board.
 * Once the token is removed, every conflict can take sandworms.
 */
function isConflictProtected(game) {
  if (!game.state.shieldWall) {
    return false
  }
  const currentCard = game.state.conflict?.currentCard
  if (!currentCard || !currentCard.location) {
    return false
  }
  const spaces = boardSpaces.getBoardSpaces(game.settings)
  const locationSpace = spaces.find(s => s.id === currentCard.location)
  return !!(locationSpace && locationSpace.isProtected)
}

/**
 * True when this effect list would summon a sandworm before it takes the
 * Shield Wall down. An option that blows the wall and then summons is legal
 * even at a protected conflict, because the token is gone first.
 */
function summonsSandwormWhileProtected(effects) {
  let wallBroken = false
  for (const effect of effects || []) {
    if (!effect || typeof effect !== 'object') {
      continue
    }
    if (effect.type === 'break-shield-wall') {
      wallBroken = true
      continue
    }
    if (effect.type === 'sandworm') {
      if (!wallBroken) {
        return true
      }
      continue
    }
    if (wallBroken) {
      continue
    }
    if (effect.type === 'conditional' && summonsSandwormWhileProtected(effect.effects)) {
      return true
    }
    if (effect.type === 'choice') {
      for (const choice of effect.choices || []) {
        if (summonsSandwormWhileProtected(choice.effects)) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * Whether a declarative choice option may be offered. Cost, Maker Hook, and
 * the Shield Wall sandworm ban all live here so cards and board spaces share
 * one filter.
 */
function choiceOptionPlayable(game, player, option) {
  if (option.cost) {
    for (const [resource, amount] of Object.entries(option.cost)) {
      if (player.getCounter(resource) < amount) {
        return false
      }
    }
  }
  if (option.requires === 'maker-hook' && !game.state.makerHooks?.[player.name]) {
    return false
  }
  if (isConflictProtected(game) && summonsSandwormWhileProtected(option.effects)) {
    return false
  }
  return true
}

module.exports = {
  isConflictProtected,
  summonsSandwormWhileProtected,
  choiceOptionPlayable,
}
