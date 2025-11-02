module.exports = {
  name: `Martian Internet`,
  color: `blue`,
  age: 11,
  expansion: `arti`,
  biscuits: `ppph`,
  dogmaBiscuit: `p`,
  dogma: [
    `Start a new game, ignoring all players' current cards and without shuffling, each player drawing and melding a {9} to begin, the winner then transfering their cards to this game and junking each other player's other cards from that game.`
  ],
  dogmaImpl: [
    (game, player) => {
      // Set a flag indicating we're playing the Martian Internet game.
      // Store the current state of each player's board.
      // Store the current player and player action number.
      // Store any dogma info for other cards that might have been played.
      // Clear all of the above.

      // Each player draws and melds a 9.
      // The first player is based on the name of that 9 card.


      // Alt idea:
      // Start a new game, but skip the card initialization.
      // Copy the cards from this game to the new game.
      // Have a special start flag to draw 9s instead of 1s.
    },
  ],

  restoreGameCallback(game, winner) {
  },
}
