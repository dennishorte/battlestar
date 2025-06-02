<template>
  <span
    v-for="(part, index) in parsed"
    :key="part.value + index"
  >
    <ManaSymbol v-if="part.type === 'symbol'" :m="part.value" />
    <div v-else-if="part.value === '\n'" class="spacer" />
    <template v-else>{{ part.value }}</template>
  </span>
</template>


<script setup>
import { computed } from 'vue'

import ManaSymbol from './ManaSymbol.vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})

const parsed = computed(() => extractSymbolsFromText(props.text))

function extractSymbolsFromText(text) {
  const tokens = []
  let i = 0
  let currentToken = ''

  while (i < text.length) {
    const char = text[i]

    if (char === '{') {
      // Save any accumulated text before the brace
      if (currentToken) {
        tokens.push(currentToken)
        currentToken = ''
      }

      // Find the matching closing brace
      let j = i + 1
      while (j < text.length && text[j] !== '}') {
        j++
      }

      // Add the entire {content} as a token
      if (j < text.length) {
        tokens.push(text.slice(i, j + 1))
        i = j + 1
      }
      else {
        // No matching closing brace, treat as regular text
        currentToken += char
        i++
      }
    }
    else if (char === '\n') {
      // Save any accumulated text before the newline
      if (currentToken) {
        tokens.push(currentToken)
        currentToken = ''
      }

      // Add newline as its own token
      tokens.push('\n')
      i++
    }
    else {
      // Accumulate regular characters
      currentToken += char
      i++
    }
  }

  // Add any remaining text
  if (currentToken) {
    tokens.push(currentToken)
  }

  return tokens.map(t => {
    if (t.startsWith('{')) {
      return {
        type: 'symbol',
        value: t.slice(1, -1),
      }
    }
    else {
      return {
        type: 'text',
        value: t,
      }
    }
  })
}
</script>

<style scoped>
.spacer {
  min-height: .5em;
}
</style>
