module.exports = {
  id: "emergency-seller-e106",
  name: "Emergency Seller",
  deck: "occupationE",
  number: 106,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can immediately turn as many building resources into food as you have people: Each wood or clay is worth 2 food; each reed or stone is worth 3 food.",
  onPlay(game, player) {
    game.actions.offerEmergencySellerConversion(player, this, player.getFamilySize())
  },
}
