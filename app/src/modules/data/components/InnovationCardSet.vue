<template>
  <div class="innovation-card-set">
    <div class="expansion-name">
      {{ expansion }}
    </div>

    <div v-for="age in [1,2,3,4,5,6,7,8,9,10]" :key="age">
      <CardFull v-for="card in cards(age)" :key="card.name" :card="card" />
    </div>

  </div>
</template>


<script>
import { inn } from 'battlestar-common'

import CardFull from '@/modules/games/inn/components/CardFull'

export default {
  name: 'InnovationCardSet',

  components: {
    CardFull
  },

  props: {
    expansion: {
      type: String,
      default: 'base'
    },
  },

  methods: {
    cards(age) {
      const res = inn.res.generate()
      return res[this.expansion].byAge[age].sort((l, r) => {
        if (l.age !== r.age) {
          return l.age - r.age
        }
        else if (l.color !== r.color) {
          return l.color.localeCompare(r.color)
        }
        else {
          return l.name.localeCompare(r.name)
        }
      })
    },
  },
}
</script>


<style scoped>
.expansion-name {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  position: sticky;
  top: 0;
  height: 2em;
  padding: 0 .25em;
  margin-bottom: .25em;
  text-align: center;

  background-color: gray;
  color: white;
  font-size: 1.2em;

  max-width: 300px;
  border-radius: 0 0 .25em .25em;
}
</style>
