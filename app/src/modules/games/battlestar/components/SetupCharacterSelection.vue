<template>
  <div class="setup-character-selection">
    <b-row class="description">
      <b-col>
        <p>You can see and select characters from the info menu.</p>
        <p>There are four character types: political leader, military leader, pilot, support.</p>
        <p>Starting with the first player ({{ firstPlayer }}), each player chooses from the remaining characters a character of the type that is most plentiful. The exception is that a support character can be chosen at any time.</p>

        <p class="heading">Remaining:</p>
        <b-table small :items="characterTypeCounts"></b-table>
      </b-col>
    </b-row>
  </div>
</template>


<script>
export default {
  name: 'SetupCharacterSelection',

  computed: {
    characterTypeCounts() {
      const players = this.$game.getPlayerAll()
      const playerCharacters = players
        .map(player => {
          const hand = this.$game.getZoneByPlayer(player).cards
          for (const card of hand) {
            if (card.kind === 'character') {
              return card
            }
          }
          return null
        })
        .filter(x => !!x)

      const counts = {
        Politics: 0,
        Military: 0,
        Pilot: 0,
        Support: 0,
      }

      const characterData = this.game.data.filtered.characterCards
      for (const char of characterData) {
        if (!playerCharacters.find(ch => ch.name === char.name)) {
          counts[char['role']] += 1
        }
      }

      const tableItems = Object.entries(counts).map(arr => ({
        role: arr[0],
        count: arr[1]
      }))

      return tableItems
    },

    firstPlayer() {
      return this.$game.getPlayerAll()[0].name
    },

  },
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}
</style>
