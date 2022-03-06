<template>
  <div
    class="card-full"
    :class="[card.color]"
  >
    <div class="card-title">
      {{ card.name }} {{ card.dogmaBiscuit }}
    </div>
    <div v-for="(effect, index) in effects" class="card-effect" :key="index">
      {{ effect }}
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'CardFull',

  props: {
    card: Object,
  },

  computed: {
    effects() {
      const above = []
        .concat(util.getAsArray(this.card, 'echo'))
        .concat(util.getAsArray(this.card, 'inspire'))
        .filter(line => !!line)

      const below = []
        .concat(util.getAsArray(this.card, 'karma'))
        .concat(util.getAsArray(this.card, 'dogma'))
        .filter(line => !!line)

      if (above.length > 0) {
        return []
          .concat(above)
          .concat(['---'])
          .concat(below)
      }
      else {
        return above.concat(below)
      }
    },
  },
}
</script>


<style scoped>
.card-full {
  border: 1px solid black;
  padding: .2rem;
}

.card-title {
  margin-bottom: 0;
}

.card-effect {
  font-size: .8em;
  line-height: 1.2em;
}
</style>
