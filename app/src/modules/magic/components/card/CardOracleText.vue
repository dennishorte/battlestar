<template>
  <div class="card-oracle-text">
    <ScarrableContent v-bind="scarrable">
      <span
        v-for="part of scarredParts"
        :key="part.value"
        :class="{
          'scar-tape': part.added,
          'narrow-tape': part.added,
        }"
      >
        <ParsedOracleText :text="part.value" />
      </span>
    </ScarrableContent>
  </div>
</template>


<script setup>
import { computed } from 'vue'

import { useScarrableContent } from '../../composables/card/useScarrableContent.js'
import ScarrableContent from './ScarrableContent.vue'
import ParsedOracleText from './ParsedOracleText.vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isScarrable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['value-updated'])

const scarrable = useScarrableContent(props.card, props.index, 'oracle_text', emit, {
  multiline: true,
  oldVersions: ['{T}: Add {C}.\n{1}{G}, {T}: Put target non-creature card from your graveyard on top of your library.'],
})

const scarredParts = computed(() => splitPartsWithNewlines(scarrable.scarredParts.value))

function splitPartsWithNewlines(parts) {
  const result = []

  for (const part of parts) {
    if (part.value.includes('\n')) {
      // Split on newlines
      const segments = part.value.split('\n')

      for (let i = 0; i < segments.length; i++) {
        // Only add non-empty segments
        if (segments[i].length > 0) {
          result.push({
            added: part.added,
            value: segments[i]
          })
        }

        // Add newline separator after each segment except the last one
        if (i < segments.length - 1) {
          result.push({
            added: false,
            value: '\n'
          })
        }
      }
    }
    else {
      // No newlines, keep as-is
      result.push(part)
    }
  }

  return result
}
</script>


<style scoped>
.oracle-text-display {
  cursor: pointer;
}

.oracle-text-display:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.error-text {
  font-family: monospace;
}
</style>
