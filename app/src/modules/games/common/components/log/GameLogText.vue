<template>
  <div style="display:inline-block">
    <template v-for="(token, i) in tokens" :key="i">
      <template v-if="token.type === 'text'">{{ token.value }}</template>
      <component v-else :is="componentMap[token.type]" v-bind="token.props" />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameLog } from '../../composables/useGameLog'
import { tokenize, defaultMatchers } from '../../composables/useLogTokenizer'
import CardName from './CardName.vue'
import LocName from './LocName.vue'
import PlayerName from './PlayerName.vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
})

const funcs = useGameLog()

const defaultComponents = {
  card: CardName,
  player: PlayerName,
  loc: LocName,
}

const matchers = computed(() => funcs.tokenMatchers || defaultMatchers)
const componentMap = computed(() => funcs.tokenComponents || defaultComponents)
const tokens = computed(() => tokenize(props.text, matchers.value))
</script>


<style scoped>
.log-text {
  padding-left: 2em;
  text-indent: -2em;
}
</style>
