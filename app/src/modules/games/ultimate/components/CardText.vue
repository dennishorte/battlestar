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
import { tokenize } from '@/modules/games/common/composables/useLogTokenizer'
import CardBiscuit from './CardBiscuit.vue'
import CardNameFull from './CardNameFull.vue'
import CardSquareDetails from './CardSquareDetails.vue'
import PlayerName from './PlayerName.vue'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})

const matchers = [
  {
    pattern: /\{(.)\}/,
    type: 'biscuit',
    props: (match) => ({ biscuit: match[1], inline: true }),
  },
  {
    pattern: /card\(([^()]+)\)/,
    type: 'card',
    props: (match) => ({ name: match[1] }),
  },
  {
    pattern: /\*([^-]+)-([0-9]+)\*/,
    type: 'cardSquare',
    props: (match) => ({ expansion: match[1], name: match[2] }),
  },
  {
    pattern: /player\(([^()]+)\)/,
    type: 'player',
    props: (match) => ({ name: match[1] }),
  },
]

const componentMap = {
  biscuit: CardBiscuit,
  card: CardNameFull,
  cardSquare: CardSquareDetails,
  player: PlayerName,
}

const tokens = computed(() => tokenize(props.text, matchers))
</script>
