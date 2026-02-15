module.exports = {
  id: "clutterer-b100",
  name: "Clutterer",
  deck: "occupationB",
  number: 100,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each card played after this one that has \"accumulation space(s)\" in its text.",
  onPlay(game, player) {
    const state = game.cardState(this.id)
    state.occupationCount = player.playedOccupations.length
    state.minorCount = player.playedMinorImprovements.length
  },
  getEndGamePoints(player, game) {
    const state = game.cardState(this.id)
    if (!state) {
      return 0
    }

    let count = 0
    const occs = player.playedOccupations
    for (let i = state.occupationCount; i < occs.length; i++) {
      const card = player.cards.byId(occs[i])
      if (card && card.definition && card.definition.text && card.definition.text.toLowerCase().includes('accumulation space')) {
        count++
      }
    }
    const minors = player.playedMinorImprovements
    for (let i = state.minorCount; i < minors.length; i++) {
      const card = player.cards.byId(minors[i])
      if (card && card.definition && card.definition.text && card.definition.text.toLowerCase().includes('accumulation space')) {
        count++
      }
    }
    return count
  },
}
