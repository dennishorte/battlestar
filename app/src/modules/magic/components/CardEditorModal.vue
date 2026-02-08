<template>
  <BModal :title="title" v-model="modalVisible">
    <slot name="before-card"/>

    <CardEditor v-model="cardInEdit" :editable="props.editable" />

    <slot name="after-card"/>

    <template #footer="{ cancel }">
      <slot name="footer">
        <div class="footer-left">
          <BButton
            v-if="showDelete"
            variant="outline-danger"
            size="sm"
            @click="confirmDelete"
          >delete</BButton>
          <BButton
            v-if="showDelete && isScarred"
            variant="outline-warning"
            size="sm"
            class="ms-2"
            @click="clearScar"
          >clear scar</BButton>
        </div>
        <BButton variant="secondary" @click="cancel()">cancel</BButton>
        <BButton
          variant="danger"
          @click="save"
          :disabled="!hasUpdates"
        >save</BButton>
      </slot>
    </template>
  </BModal>

  <BModal v-model="deleteConfirmVisible" title="Confirm Delete">
    <p>Are you sure you want to delete this card from the cube?</p>
    <p class="text-muted">This cannot be undone.</p>

    <template #footer>
      <BButton variant="secondary" @click="deleteConfirmVisible = false">Cancel</BButton>
      <BButton variant="danger" @click="deleteCard">Delete</BButton>
    </template>
  </BModal>
</template>


<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { util } from 'battlestar-common'

import CardEditor from './CardEditor.vue'

const bus = inject('bus')

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

  title: {
    type: String,
    default: 'Card Editor',
  },

  showDelete: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'delete'])
const store = useStore()

const originalCard = ref(null)
const cardInEdit = ref(null)
const deleteConfirmVisible = ref(false)

const modalVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

async function save() {
  // Blur any active element to commit pending edits before saving
  document.activeElement?.blur()
  await nextTick()

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

function confirmDelete() {
  deleteConfirmVisible.value = true
}

function deleteCard() {
  deleteConfirmVisible.value = false
  emit('update:modelValue', false)
  emit('delete', originalCard.value)
}

// Initialize cardInEdit when modal opens or card changes
watch([() => props.card, () => props.modelValue], ([card, visible]) => {
  if (visible && card) {
    cardInEdit.value = card.clone()
    originalCard.value = card.clone()
  }
})

// Emit event when card is edited (for external listeners like scar applicator)
watch(cardInEdit, (updated) => {
  if (updated && originalCard.value && bus) {
    bus.emit('card-editor:updated', {
      updated,
      original: originalCard.value,
      hasUpdates: hasUpdates.value,
    })
  }
}, { deep: true })

const hasUpdates = computed(() => {
  if (!cardInEdit.value || !originalCard.value) {
    return false
  }
  return !util.dict.strictEquals(cardInEdit.value, originalCard.value)
})

const isScarred = computed(() => {
  if (!props.card) {
    return false
  }
  return typeof props.card.isScarred === 'function' && props.card.isScarred()
})

async function clearScar() {
  if (!props.card) {
    return
  }

  // Clone the card and clear the changes array
  const cardToClear = props.card.clone()
  cardToClear.changes = []

  // Close the modal first to avoid stale state issues
  emit('update:modelValue', false)

  await store.dispatch('magic/cards/update', {
    card: cardToClear,
    comment: 'Cleared scar history',
  })
}
</script>


<style scoped>
.footer-left {
  margin-right: auto;
}
</style>
