module.exports = {
  id: "patch-caregiver-b113",
  name: "Patch Caregiver",
  deck: "occupationB",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can choose to buy 1 grain for 1 food, or 1 vegetable for 3 food. This card is a field.",
  isField: true,
  onPlay(game, player) {
    // Add virtual field
    player.addVirtualField({
      cardId: 'patch-caregiver-b113',
      label: 'Patch Caregiver',
      cropRestriction: null,  // Can grow any crop
    })
    game.log.add({
      template: '{player} plays Patch Caregiver, gaining a field',
      args: { player },
    })
    // Offer the purchase choice
    game.actions.offerPatchCaregiverChoice(player, this)
  },
}
