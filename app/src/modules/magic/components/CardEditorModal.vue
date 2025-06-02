<template>
  <BModal title="Card Editor" v-model="modalVisible">
    <slot name="before-card"/>

    <CardEditor v-model="cardInEdit" :editable="props.editable" />

    <slot name="after-card"/>

    <template #footer="{ cancel }">
      <slot name="footer">
        <BButton variant="secondary" @click="cancel()">cancel</BButton>
        <BButton
          variant="danger"
          @click="save"
          :disabled="!hasUpdates"
        >save</BButton>
      </slot>
    </template>
  </BModal>
</template>


<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { util } from 'battlestar-common'

import CardEditor from './CardEditor'


const props = defineProps({
  card: {
    type: [Object, null],
    required: true
  },

  editable: {
    type: Boolean,
    default: true,
  },

  // The visibility of the modal
  // It is passed through from the parent down to the actual modal that this component contains,
  // which is required by Bootstrap Vue Next in order to have modals as separate components.
  modelValue: {
    type: Boolean,
    required: true
  },
})

const emit = defineEmits(['update:modelValue'])
const store = useStore()

const originalCard = ref(null)
const cardInEdit = ref(null)

const modalVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

async function save() {
  // Hide this modal
  emit('update:modelValue', false)

  // Handle the new card case.
  if (!originalCard.value.name()) {
    // Only add new cards if the have something written in the name field.
    if (!cardInEdit.value.name()) {
      console.log('no name')
      return
    }

    await store.dispatch('magic/cube/addCard', {
      card: cardInEdit.value,
      comment: 'original card',
    })
    return
  }

  else if (hasUpdates.value) {
    await store.dispatch('magic/cards/update', {
      card: cardInEdit.value,
      comment: 'Updated in the cube card editor',
    })
    return
  }
}

// Initialize cardInEdit when modal opens
watch(() => props.card, (newValue) => {
  if (newValue) {
    cardInEdit.value = newValue.clone()
    originalCard.value = newValue.clone()
  }
})

const hasUpdates = computed(() => {
  if (!cardInEdit.value || !originalCard.value) {
    return false
  }
  return !util.dict.strictEquals(cardInEdit.value, originalCard.value)
})
</script>


<style scoped>
</style>
