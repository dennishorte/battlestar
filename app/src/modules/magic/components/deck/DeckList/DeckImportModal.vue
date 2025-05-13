<template>
  <BaseImportModal
    modalId="deck-import-modal"
    @update="handleUpdate"
  >
    <template #header>List of Cards/Changes</template>
    <template #top-content>
      <div class="alert alert-danger">
        Using this option will overwrite the existing cards in this deck.
      </div>
    </template>
  </BaseImportModal>
</template>

<script setup>
import BaseImportModal from '@/modules/magic/components/BaseImportModal.vue'

const emit = defineEmits(['import-card-updates'])

const handleUpdate = (updates) => {
  emit('import-card-updates', updates)
}
</script>
