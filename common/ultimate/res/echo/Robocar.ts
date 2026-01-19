import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Robocar`,
  color: `green`,
  age: 11,
  expansion: `echo`,
  biscuits: `ffbh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose an opponent. That player chooses a card (unrevealed) in your hand. Meld the chosen card. If you do, and it is your turn, self-execute the card, then repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const opp = game.actions.choosePlayer(player, game.players.opponents(player))
        const card = game.actions.chooseCard(opp, game.cards.byPlayer(player, 'hand'))
        if (!card) {
          game.log.add({
            template: '{player} has no cards in hand',
            args: { player },
          })
          break
        }

        game.log.add({
          template: '{player} chooses {card}',
          args: { player: opp, card }
        })
        const melded = game.actions.meld(player, card)
        if (melded) {
          if (player.id === game.players.current().id) {
            game.aSelfExecute(self, player, melded)
            continue
          }
          else {
            game.log.add({
              template: `It is not {player}'s turn`,
              args: { player }
            })
            break
          }
        }
      }
    }
  ],
} satisfies AgeCardData
