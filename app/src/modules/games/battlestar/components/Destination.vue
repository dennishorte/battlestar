<template>
  <div class="destination">
    <div>
      Distance Traveled: {{ distanceTraveled }}
      <div class="notes">
        <span class="heading">at 4:</span> Deal each player an additional loyalty card.
      </div>
      <div class="notes">
        <span class="heading">at 8:</span> The next time Galactica jumps, the human players win.
      </div>
    </div>

    <hr>

    <div>
      <span class="heading">Chosen Cards</span>
      <div
        v-for="(card, index) in chosen"
        :key="index"
      >
        {{ card.name }}
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Destination',

  props: {
  },

  data() {
    return {
    }
  },

  computed: {
    chosen() {
      return this.$store.state.bsg.game.destination.chosen
    },
    distanceTraveled() {
      return this.$store.getters['bsg/distanceTraveled']
    },
  },

  methods: {
  },
}
</script>


<style scoped>
.notes {
  color: #444;
  font-size: .7em;
  margin-left: 1em;
  margin-right: 1em;
}
</style>
