module.exports = {
  id: "field-caretaker-b141",
  name: "Field Caretaker",
  deck: "occupationB",
  number: 141,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you can immediately exchange 0/1/3 clay for 1/2/3 grain. This card is a field.",
  isField: true,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'field-caretaker-b141',
      label: 'Field Caretaker',
      cropRestriction: null,
    })
    game.log.add({
      template: '{player} plays Field Caretaker, gaining a field',
      args: { player },
    })
    game.actions.offerFieldCaretakerExchange(player, this)
  },
}
