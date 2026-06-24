const deckEngine = require('./deckEngine.js')

/**
 * Apply the Dice variant at end of recall.
 *
 * Roll two d6. Each die corresponds to a 1-indexed position in the Imperium
 * Row (5 cards). Rules:
 *   - A 6 on either die does nothing by itself.
 *   - Double sixes → clear the entire row.
 *   - Non-6 doubles → remove the card at that position (once, not twice).
 *   - Otherwise → remove the card(s) at the rolled position(s) (up to 2 distinct cards).
 * After removal, refill the row from the deck.
 */
function applyDiceRefresh(game) {
  const testOverride = game.state.testDiceValues
  const die1 = testOverride ? testOverride[0] : Math.floor(game.random() * 6) + 1
  const die2 = testOverride ? testOverride[1] : Math.floor(game.random() * 6) + 1

  game.log.add({
    template: `Imperium Row Refresh (Dice): rolled ${die1} and ${die2}`,
    event: 'step',
  })

  const rowZone = game.zones.byId('common.imperiumRow')
  const trash = game.zones.byId('common.trash')

  if (die1 === 6 && die2 === 6) {
    const cards = rowZone.cardlist()
    game.log.add({ template: 'Double 6 — entire Imperium Row cleared' })
    for (const card of [...cards]) {
      card.moveTo(trash)
      game.log.add({ template: '  {card} removed', args: { card } })
    }
  }
  else {
    // Collect distinct non-6 positions (1-indexed). Doubles = only one removal.
    const positions = []
    if (die1 !== 6) {
      positions.push(die1)
    }
    if (die2 !== 6 && die2 !== die1) {
      positions.push(die2)
    }

    if (positions.length === 0) {
      game.log.add({ template: '  Both dice are 6 — no cards removed' })
    }
    else {
      // Sort descending so removing higher indices first doesn't shift lower ones
      positions.sort((a, b) => b - a)
      for (const pos of positions) {
        const cards = rowZone.cardlist()
        const idx = pos - 1
        if (idx < cards.length) {
          const card = cards[idx]
          card.moveTo(trash)
          game.log.add({
            template: '  Position {pos}: {card} removed from Imperium Row',
            args: { card, pos },
          })
        }
        else {
          game.log.add({ template: `  Position ${pos}: no card (row has fewer than ${pos} cards)` })
        }
      }
    }
  }

  deckEngine.refillImperiumRow(game)
}

/**
 * Apply the Conveyor Belt (Shift) variant at end of recall.
 *
 * The oldest card in the row (the one that has been there the longest,
 * at the tail position) is removed. The row is then refilled by inserting
 * the new card at the head, keeping a consistent newest-at-head ordering.
 */
function applyShiftRefresh(game) {
  const rowZone = game.zones.byId('common.imperiumRow')
  const trash = game.zones.byId('common.trash')
  const cards = rowZone.cardlist()

  if (cards.length === 0) {
    deckEngine.refillImperiumRow(game, { atHead: true })
    return
  }

  const oldest = cards[cards.length - 1]
  oldest.moveTo(trash)
  game.log.add({
    template: '{card} falls off the end of the Imperium Row (Conveyor Belt)',
    args: { card: oldest },
  })

  deckEngine.refillImperiumRow(game, { atHead: true })
}

/**
 * Player uses their Nuke: clears the entire Imperium Row and immediately refills it.
 */
function applyNukeRefresh(game, player) {
  game.state.nukesAvailable[player.name] = false

  const rowZone = game.zones.byId('common.imperiumRow')
  const trash = game.zones.byId('common.trash')

  game.log.add({
    template: '{player} uses their Nuke — Imperium Row cleared!',
    args: { player },
    summary: true,
  })
  game.log.indent()

  for (const card of [...rowZone.cardlist()]) {
    card.moveTo(trash)
    game.log.add({ template: '{card} discarded', args: { card } })
  }

  game.log.outdent()
  deckEngine.refillImperiumRow(game)
}

module.exports = { applyDiceRefresh, applyShiftRefresh, applyNukeRefresh }
