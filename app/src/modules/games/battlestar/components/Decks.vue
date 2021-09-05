<template>
  <div class="decks">
  </div>
</template>


<script>
const Decks = {
  name: 'Decks',

  components: {
  },

  data() {
    return {

    }
  },

  computed: {
  },

  methods: {
    resourceChanged() {
      //
    },
  },
}

const deckNames = [
  'common',
  'exile',

  'crisis.deck',
  'superCrisis.deck',
  'destination.deck',
  'quorum.deck',
  'loyalty.deck',
  'skill.politics.deck',
  'skill.leadership.deck',
  'skill.tactics.deck',
  'skill.piloting.deck',
  'skill.engineering.deck',
]

function initializeDecks() {
  for (const name of deckNames) {
    const safeName = name.replace('.', '_')
    Decks.computed[safeName] = function() {
      return this.$store.getters('bsg/zone_' + safeName)
    }
  }
}



export default Decks
</script>


<style scoped>
</style>
