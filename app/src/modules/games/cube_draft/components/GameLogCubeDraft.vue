<template>
  <GameLog id="gamelog" :showRematchButton="false" />
</template>

<script setup>
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'

useGameLogProvider({
  lineClasses(line) {
    return [`indent-${line.indent}`]
  },
})
</script>

<style>
#gamelog :deep(.indent-0) {
  margin: 2em 1em 0 1em;

  color: white;
  background-color: #7db881;
}
</style>
