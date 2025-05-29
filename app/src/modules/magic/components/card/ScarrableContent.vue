<template>
  <EditableContent
    v-bind="editor"
    :class="{
      'scar-tape': scarred,
      'original-text': showingOriginalText,
    }"
    @click="handleClick"
  />
</template>


<script setup>
import { computed, unref } from 'vue'
import EditableContent from '@/components/EditableContent.vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
  scarred: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    required: true,
  },
  showingOriginalText: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    required: true,
  },

  handleClick: {
    type: Function,
    required: true
  },
})

const scarred = computed(() => unref(props.scarred))
const showingOriginalText = computed(() => unref(props.showingOriginalText))
</script>


<style scoped>
.original-text {
  position: relative;
  font-weight: normal;
  text-decoration: line-through;
  text-decoration-style: double;
}
</style>
