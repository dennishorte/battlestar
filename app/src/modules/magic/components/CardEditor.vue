<template>
  <div class="card-editor">
    <template v-if="Boolean(cardInEdit)">
      <BAlert :model-value="!props.editable" variant="warning">Read-Only</BAlert>

      <MagicCard
        :size="270"
        :card="cardInEdit"
        class="mb-2 w-100"
        :is-editable="props.editable"
        :limit-height="props.limitHeight"
        @update-face="updateFace"
      >
        <template #after-face="{ faceIndex }" v-if="props.editable">
          <BButton variant="warning" class="mt-2" @click="removeFace(faceIndex)">remove</BButton>
        </template>
      </MagicCard>

      <button v-if="props.editable" class="btn btn-primary" @click="addFace">Add Face</button>
    </template>

    <template v-else>
      <BAlert variant="danger" :model-value="true">
        Error: No card was provided
      </BAlert>
    </template>

  </div>
</template>


<script setup>
import { ref, watch } from 'vue'

import MagicCard from '@/modules/magic/components/card/MagicCard.vue'

const props = defineProps({
  modelValue: {
    type: [Object, null],
    required: true,
  },

  limitHeight: {
    type: Boolean,
    default: false,
  },

  editable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const originalCard = ref(null)
const cardInEdit = ref(null)

let ignoreUpdate = false

// Initialize cardInEdit when modal opens
watch(() => props.modelValue, (newValue) => {
  if (ignoreUpdate) {
    ignoreUpdate = false
    return
  }

  if (props.modelValue) {
    cardInEdit.value = newValue.clone()
    originalCard.value = newValue.clone()
  }
  else {
    cardInEdit.value = null
    originalCard.value = null
  }
})

function updateFace({ index, field, value }) {
  ignoreUpdate = true
  cardInEdit.value.face(index)[field] = value
  emit('update:modelValue', cardInEdit.value)
}

function addFace() {
  cardInEdit.value.addFace()
  emit('update:modelValue', cardInEdit.value)
}

function removeFace(index) {
  cardInEdit.value.removeFace(index)
  emit('update:modelValue', cardInEdit.value)
}
</script>


<style scoped>
</style>
