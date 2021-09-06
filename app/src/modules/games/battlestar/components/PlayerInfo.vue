<template>
  <div class="player-info">

    <b-table-simple borderless small>
      <b-tbody>
        <b-tr>
          <b-th>Player Name</b-th>
          <b-td>{{ player.name }}</b-td>
        </b-tr>

        <b-tr>
          <b-th>Character</b-th>
          <b-td>
            <CharacterLink :v-if="character.name" :name="character.name" />
          </b-td>
        </b-tr>

        <b-tr>
          <b-th>Cards</b-th>
          <b-td>{{ cards.length }}</b-td>
        </b-tr>

      </b-tbody>
    </b-table-simple>

  </div>
</template>


<script>
import CharacterLink from './CharacterLink'

export default {
  name: "PlayerInfo",

  components: {
    CharacterLink,
  },

  computed: {
    character() {
      const characterCards = this.cardsBy('character')
      if (characterCards.length) {
        return characterCards[0]
      }
      else {
        return {}
      }
    },
    cards() {
      return this.$store.getters['bsg/hand'](this.player.name).cards
    },
    player() {
      return this.$store.getters['bsg/playerModal'].player
    },
    viewerIsThisPlayer() {
      return this.player._id === this.$store.getters['auth/userId']
    },
  },

  methods: {
    cardsBy(kind) {
      return this.cards.filter(c => c.kind === kind)
    },
  },
}
</script>


<style scoped>
</style>
