<template>
  <span class="player-name" :class="classes" :style="styles">{{ name }}</span>
</template>


<script setup>
import { computed, inject } from 'vue'
import { useGameLog } from '../../composables/useGameLog'

const props = defineProps({
  name: {
    type: String,
    default: 'missing-name',
  },
})

const game = inject('game')
const funcs = useGameLog()

const player = computed(() => game.value?.players?.byName(props.name))

const classes = computed(() => {
  return funcs.playerClasses ? funcs.playerClasses(player.value) : []
})

const styles = computed(() => {
  return funcs.playerStyles ? funcs.playerStyles(player.value) : []
})
</script>


<style scoped>
.player-name {
  display: inline;
}
</style>
