module.exports = {
  name: `Hot Air Balloon`,
  color: `green`,
  age: 6,
  expansion: `echo`,
  biscuits: `s&h7`,
  dogmaBiscuit: `s`,
  echo: `Draw and score a {7}.`,
  dogma: [
    `You may achieve (if eligible) a top card from any other player's board if they have an achievement of matching value. If you do, transfer your top green card to that player's board. Otherwise, draw and meld a {7}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const candidates = []
      for (const other of game.players.all()) {
        if (other === player) {
          continue
        }

        // The ages of all achievements owned by `other`.
        const ages = game
          .cards.byPlayer(other, 'achievements')
          .filter(card => !!card.getAge())
          .map(card => card.getAge())

        // Top cards owned by `other` that match an age in that player's achievements pile.
        game
          .cards.tops(other)
          .filter(card => ages.includes(card.getAge()))
          .filter(card => game.checkAchievementEligibility(player, card))
          .forEach(card => candidates.push(card))
      }

      const card = game.actions.chooseCard(player, candidates, { min: 0, max: 1 })
      if (card) {
        const owner = game.getPlayerByCard(card)
        game.aClaimAchievement(player, { card })

        const cardToTransfer = game.getTopCard(player, 'green')
        if (cardToTransfer) {
          game.actions.transfer(player, cardToTransfer, game.zones.byPlayer(owner, 'green'))
        }
        else {
          game.log.add({
            template: '{player} has no top green card',
            args: { player }
          })
        }
      }
      else {
        game.actions.drawAndMeld(player, game.getEffectAge(this, 7))
      }
    }
  ],
  echoImpl: (game, player) => {
    game.actions.drawAndScore(player, game.getEffectAge(this, 7))
  },
}
