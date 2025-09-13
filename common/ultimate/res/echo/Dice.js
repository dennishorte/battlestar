module.exports = {
  name: `Dice`,
  color: `blue`,
  age: 1,
  expansion: `echo`,
  biscuits: `h1cc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `Draw and reveal an Echoes {1}. If the card has a bonus, draw and meld a card of value equal to its bonus.`,
    `If Dice was foreseen, draw a {4}, then transfer it to the hand of an opponent with more bonus points than you.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.draw(player, { age: game.getEffectAge(self, 1), exp: 'echo' })
      game.actions.reveal(player, card)
      if (card.checkHasBonus()) {
        const bonus = card.getBonuses()[0]
        game.actions.drawAndMeld(player, bonus)
      }
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        const card = game.actions.draw(player, { age: game.getEffectAge(self, 4) })
        const playerBonusPoints = game.getBonuses(player).reduce((l, r) => l + r, 0)
        const otherBonusPoints = game
          .players.opponentsOf(player)
          .map(opp => {
            const points = game.getBonuses(opp).reduce((l, r) => l + r, 0)
            return { opp, points }
          })

        const choices = otherBonusPoints
          .filter(x => x.points > playerBonusPoints)
          .map(x => x.opp)

        const opp = game.actions.choosePlayer(player, choices, {
          title: 'Choose a player to transfer the drawn card to'
        })

        if (opp) {
          game.actions.transfer(player, card, game.zones.byPlayer(opp, 'hand'))
        }
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
  echoImpl: [],
}
