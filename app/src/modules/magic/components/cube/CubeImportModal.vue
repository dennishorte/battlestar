<template>
  <BaseImportModal
    modalId="cube-update-modal"
    :collection="cube"
    @update="handleUpdate"
  >
    <template #header>Update Cube</template>
  </BaseImportModal>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import BaseImportModal from '../../components/BaseImportModal.vue'

const store = useStore()
const cube = computed(() => store.state.magic.cube.cube)

const emit = defineEmits(['cube-updates'])

const handleUpdate = (updates) => {
  emit('cube-updates', updates)
}
</script>
