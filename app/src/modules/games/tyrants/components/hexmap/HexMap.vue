<template>
  <div class="hex-map">
    <svg class="game-map" width="1000" height="800" ref="gamemap">

      <Hex :cx="300" :cy="300" :sites="testSites" :rotation="0" />


    </svg>
  </div>
</template>


<script>
import Hex from './Hex'


const testSites = [
  {
    name: 'Chaulsin',
    dx: -30,
    dy: +80,
    size: 4,
    value: 1,
  },
  {
    name: 'Caves',
    dx: +60,
    dy: +10,
    size: 6,
    value: 2,
  },
  {
    name: 'Halls of the|Scoured Legion',
    dx: -35,
    dy: -70,
    size: 3,
    value: 3,
  },
  /* {
   *   name: 'Chasmleap|Brdige',
   *   dx: -50,
   *   dy: +0,
   *   size: 5,
   *   value: 4,
   * }, */
]


export default {
  name: 'HexMap',

  components: {
    Hex,
  },

  data() {
    return {
      testSites,
    }
  },
}
</script>


<style scoped>
</style>
