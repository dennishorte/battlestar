<template>
  <GameLog id="gamelog" :funcs="propFuncs()" :showRematchButton="false" />
</template>

<script>
import GameLog from '@/modules/games/common/components/log/GameLog'

export default {
  name: 'GameLogCubeDraft',

  components: {
    GameLog
  },

  inject: ['game'],

  methods: {
    propFuncs() {
      return {
        lineClasses: this.lineClasses,
      }
    },

    lineClasses(line) {
      return [`indent-${line.indent}`]
    },
  },
}
</script>

<style>
#gamelog:deep() .indent-0 {
  margin: 2em 1em 0 1em;

  color: white;
  background-color: #7db881;
}
</style>
