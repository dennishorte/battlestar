module.exports = {
  name: `Mask of Warka`,
  color: `purple`,
  age: 1,
  expansion: `arti`,
  biscuits: `kkhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Choose a color. Each player reveals their hand. If you are the only player to reveal at least one card of that color, return them and claim all achievements of value matching those cards, ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const color = game.actions.chooseColor(player)
      const revealedBy = []

      for (const plyr of game.players.startingWith(player)) {
        const toReveal = game
          .cards
          .byPlayer(plyr, 'hand')
        const revealed = game.actions.revealMany(plyr, toReveal, { ordered: true })

        const matchingColor = toReveal.filter(card => card.color === color)
        if (matchingColor.length > 0) {
          revealedBy.push(plyr)
        }
      }

      if (revealedBy.length === 1 && revealedBy[0] === player) {
        const toReturn = game
          .cards
          .byPlayer(player, 'hand')
          .filter(card => card.color === color)
        const returned = game.actions.returnMany(player, toReturn)
        const toClaim = toReturn.map(card => card.getAge())
        const available = game
          .getAvailableAchievements(player)
          .filter(card => toClaim.includes(card.getAge()))
          .forEach(card => game.actions.claimAchievement(player, { card }))
      }
    }
  ],
}
