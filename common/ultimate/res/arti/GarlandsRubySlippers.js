module.exports = {
  name: `Garland's Ruby Slippers`,
  color: `purple`,
  age: 8,
  expansion: `arti`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `Meld an {8} from your hand. If the melded card has no effects (of any kind), you win. Otherwise, self-execute it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.chooseAndMeld(
        player,
        game.cards.byPlayer(player, 'hand'),
        { filter: card => card.getAge() === game.getEffectAge(self, 8) },
      )[0]

      if (card) {
        if (
          !card.checkHasDogma()
          && !card.checkHasEcho()
          && !card.checkHasKarma()
        ) {
          game.youWin(player, self.name)
        }

        else {
          game.actions.selfExecute(self, player, card)
        }
      }
    }
  ],
}
