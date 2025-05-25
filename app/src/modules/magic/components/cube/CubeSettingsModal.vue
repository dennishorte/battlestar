<template>
  <BModal v-model="modalVisible" @ok="save" title="Cube Settings">
    <div class="mb-3">
      <label for="cube-name">Cube Name</label>
      <BFormInput v-model="formData.name" type="text">Cube Name</BFormInput>
    </div>

    <BFormCheckbox v-model="formData.editable">Editable</BFormCheckbox>
    <BFormCheckbox v-model="formData.legacy">Legacy Mode</BFormCheckbox>
  </BModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  cube: {
    type: Object,
    required: true,
  },

  // The visibility of the modal
  // It is passed through from the parent down to the actual modal that this component contains,
  // which is required by Bootstrap Vue Next in order to have modals as separate components.
  modelValue: {
    type: Boolean,
    required: true
  },
})

const formData = ref({
  name: props.cube.name,
  editable: props.cube.flags.editable || false,
  legacy: props.cube.flags.legacy || false,
})

const store = useStore()

async function save() {
  await store.dispatch('magic/cube/updateSettings', {
    cubeId: props.cube._id,
    settings: formData.value,
  })
}

// Track the visibility of the modal via a parent-level v-model directive.
const emit = defineEmits(['update:modelValue'])
const modalVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

watch(() => formData.value.legacy, (newValue) => {
  if (newValue) {
    formData.value.editable = true
  }
})

watch(() => formData.value.editable, (newValue) => {
  if (!newValue) {
    formData.value.legacy = false
  }
})
</script>

<style scoped>
</style>
