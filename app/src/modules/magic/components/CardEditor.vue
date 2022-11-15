<template>
  <div class="card-editor">
    <Card
      :size="270"
      :card="card"
      @click="editField"
    />
  </div>
</template>


<script>
import cardUtil from '../util/cardUtil.js'

import Card from './Card.vue'


export default {
  name: 'CardEditor',

  components: {
    Card,
  },

  data() {
    return {
      card: cardUtil.blank(),
    }
  },

  methods: {
    editField(event) {
      console.log('edit', event)
      const face = event.target.closest('.card-face-outer-container')
      const faceIndex = face.dataset.faceIndex

      const clickedElement = event.target.closest('.editable-field')
      const fieldName = clickedElement.dataset.editName
      console.log(faceIndex, fieldName, face)
    },
  },
}
</script>


<style scoped>
</style>
