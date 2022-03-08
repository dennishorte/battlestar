<template>
  <div
    class="card-full"
    :class="[card.color]"
  >
    <div class="card-top">
      <div class="card-biscuits">
        <div class="card-biscuits-row">
          <CardBiscuit
            v-for="(biscuit, index) in biscuitsTopRow"
            :key="index"
            :biscuit="biscuit"
          />
        </div>
        <div class="card-biscuits-row">
          <CardBiscuit
            v-for="(biscuit, index) in biscuitsBottomRow"
            :key="index"
            :biscuit="biscuit"
          />
        </div>
      </div>

      <div class="card-title">
        {{ card.name }} <CardBiscuit :biscuit="card.dogmaBiscuit" />
      </div>
    </div>

    <div v-for="(effect, index) in effects" class="card-effect" :key="index">
      <CardText :text="effect" />
    </div>
  </div>
</template>


<script>
import CardBiscuit from './CardBiscuit'
import CardText from './CardText'

import { util } from 'battlestar-common'

export default {
  name: 'CardFull',

  components: {
    CardBiscuit,
    CardText,
  },

  props: {
    card: Object,
  },

  computed: {
    biscuitsTopRow() {
      if (this.card.biscuits.length === 4) {
        return [this.card.biscuits[0], '', '']
      }
      else {
        return [this.card.biscuits[0], this.card.biscuits[4], this.card.biscuits[5]]
      }
    },

    biscuitsBottomRow() {
      return [this.card.biscuits[1], this.card.biscuits[2], this.card.biscuits[3]]
    },

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
  margin-bottom: 1px;
}

.card-biscuits {
  margin-top: -5px;
  margin-bottom: 3px;
}

.card-biscuits-row {
  display: flex;
  flex-direction: row;
}

.card-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card-title {
  margin-bottom: 0;
  font-size: .9rem;
}

.card-effect {
  font-size: .8em;
  line-height: 1.2em;
}
</style>