<template>
  <span
    class="ti-player-token"
    :style="tokenStyle"
  >{{ name }}</span>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
})

const game = inject('game')

const player = computed(() => game.value?.players?.byName(props.name))

function getContrastColor(hexColor) {
  if (!hexColor) {
    return 'black'
  }
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? 'black' : 'white'
}

const tokenStyle = computed(() => {
  const color = player.value?.color
  if (!color) {
    return {}
  }
  return {
    backgroundColor: color,
    color: getContrastColor(color),
  }
})
</script>

<style scoped>
.ti-player-token {
  display: inline;
  font-weight: 600;
  padding: .05em .3em;
  border-radius: .2em;
  font-size: .95em;
}
</style>
