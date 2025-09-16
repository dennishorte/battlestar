module.exports = {
  name: `Mask of Warka`,
  color: `purple`,
  age: 1,
  expansion: `arti`,
  biscuits: `kkhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Choose a color. Each player reveals all cards of that color from their hand. If you are the only player to reveal cards, return them and claim all achievements of value matching those cards, ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const color = game.actions.choose(player, game.utilColors(), { title: 'Choose a Color' })[0]
      const revealedBy = []

      for (const plyr of game.getPlayersStarting(player)) {
        const toReveal = game
          .getCardsByZone(plyr, 'hand')
          .filter(card => card.color === color)
        const revealed = game.actions.revealMany(plyr, toReveal, { ordered: true })
        if (revealed && revealed.length > 0) {
          revealedBy.push(plyr)
        }
      }

      if (revealedBy.length === 1 && revealedBy[0] === player) {
        const toReturn = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.color === color)
        const returned = game.actions.returnMany(player, toReturn)
        const toClaim = toReturn.map(card => card.getAge())
        const available = game
          .getAvailableAchievementsRaw(player)
          .filter(card => toClaim.includes(card.getAge()))
          .forEach(card => game.aClaimAchievement(player, { card }))
      }
    }
  ],
}
