<template>
  <div class="card-editor">
    <template v-if="Boolean(cardInEdit)">
      <MagicCard
        :size="270"
        :card="cardInEdit"
        class="mb-2 w-100"
        :is-editable="true"
        @updateFace="updateFace"
      >
        <template #before-face="{ face, faceIndex }">
          <BFormCheckbox v-model="face.scarred" @change="updateFace({ index: faceIndex, field: 'scarred', value: face.scarred })">
            scarred
          </BFormCheckbox>
        </template>

        <template #after-face="{ faceIndex }">
          <BButton variant="warning" class="mt-2" @click="removeFace(faceIndex)">remove</BButton>
        </template>
      </MagicCard>

      <button class="btn btn-primary" @click="addFace">Add Face</button>
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

import MagicCard from './MagicCard.vue'

const props = defineProps({
  modelValue: {
    type: [Object, null],
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const originalCard = ref(null)
const cardInEdit = ref(null)

// Initialize cardInEdit when modal opens
watch(() => props.modelValue, (newValue) => {
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
