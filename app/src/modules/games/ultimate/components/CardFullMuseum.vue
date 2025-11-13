<template>
  <div
    class="card-full-museum"
    :class="[card.color]"
  >
    <div class="card-underlay" :class="underlayClasses">
      <div class="card-top">
        <div class="card-title">
          {{ card.name }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import CardText from './CardText'

import { util } from 'battlestar-common'

export default {
  name: 'CardFullMuseum',

  components: {
    CardText,
  },

  props: {
    card: {
      type: Object,
      required: true
    },
  },

  computed: {
    biscuitsTopRow() {
      return []
    },

    biscuitsBottomRow() {
      return []
    },

    underlayClasses() {
      return []
    },

    effects() {
      return []
    },
  },
}
</script>


<style scoped>
.card-full {
  border: 1px solid #7d6c50;
  padding: .2rem;
  margin-bottom: 1px;
  max-width: 300px;
}

.card-age {
  display: flex;
  flex-direction: column;
}

.card-biscuits {
  margin-top: -5px;
  margin-bottom: 3px;
}

.card-biscuits-row {
  display: flex;
  flex-direction: row;
}

.card-text {
  margin-top: 3px;
}

.card-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card-title {
  margin-bottom: 0;
  font-size: .9rem;
  flex-grow: 1;
  text-align: right;
  margin-right: .3em;
}

.card-effect {
  font-size: .8em;
  line-height: 1.2em;
}

.small-card-square {
  height: 1.2em;
  width: 1.2em;
  line-height: 1.15em;
  margin-bottom: 0;
}

.card-age-square {
  margin-top: -2px;
}

.demand {
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 10px,
    rgba(255, 0, 0, .1) 10px,
    rgba(255, 0, 0, .1) 20px
  );
}
</style>
