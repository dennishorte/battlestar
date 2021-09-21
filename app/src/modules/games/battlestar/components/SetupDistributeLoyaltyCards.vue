<template>
  <div class="loyalty-setup">
    <b-row class="description">
      <b-col>
        <p>During the game, each player will get two loyalty cards, one during setup, and one when the distance traveled reaches 4 or greater.</p>
        <p>To create the loyalty deck, follow these steps:</p>
        <ul>
          <li>
            3-4 players: Add one "Cylon" card.<br>
            5-6 players: Add two "Cylon" cards.
          </li>

          <li>
            3p: Add 5 "Not a Cylon" cards.<br>
            4p: Add 6 "Not a Cylon" cards.<br>
            5p: Add 8 "Not a Cylon" cards.<br>
            6p: Add 9 "Not a Cylon" cards.
          </li>

          <li>
            Add one "Not a Cylon" card for each of:<br>
            - Gaius Baltar<br>
            - Sharon Valerii
          </li>
        </ul>
        <p>Once built, deal one card to each player. (Gaius Baltar gets a second at this stage.)</p>
        <p>Finally, if you are playing with 4 or 6 players, add the "Sympathizer" card to the deck.</p>
      </b-col>
    </b-row>

  </div>
</template>


<script>

export default {
  name: 'LoyaltySetup',
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}
</style>
