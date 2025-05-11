<template>
  <div class="card-editor" v-if="Boolean(model)">
    <Card
      :size="270"
      :card="editing"
      class="preview"
      :is-editable="true"
      @update-face="updateFace"
    />

    <div class="buttons">
      <button class="btn btn-primary" @click="addFace">Add Face</button>
      <template v-if="model.card_faces.length > 1">
        <button
          v-for="(_, index) in model.card_faces"
          :key="index"
          class="btn btn-warning"
          @click="removeFace(index)"
        >Remove {{ index }}</button>
      </template>
    </div>
  </div>
</template>


<script>
import { magic } from 'battlestar-common'

import Card from './Card.vue'


export default {
  name: 'CardEditor',

  components: {
    Card,
  },

  inject: ['bus'],

  data() {
    return {
      original: null,
      editing: null,
      model: null,

      faceIndex: 0,
      fieldName: '',
    }
  },

  computed: {
    face() {
      return this.model.card_faces[this.faceIndex]
    },
  },

  methods: {
    beginEditing(card) {
      this.original = card
      this.editing = card.clone()
      this.model = this.editing.data
    },

    completeEditing() {
      this.bus.emit('card-editor:complete', this.updated)
    },

    addFace() {
      this.model.card_faces.push(magic.util.card.blankFace())
      this.updateRootValues()
    },

    removeFace(index) {
      this.model.card_faces.splice(index, 1)
      if (this.faceIndex >= this.model.card_faces.length) {
        this.faceIndex = this.model.card_faces.length - 1
      }
      this.updateRootValues()
    },

    updateFace({ index, field, value }) {
      this.model.card_faces[index][field] = value
      this.updateRootValues()
      this.bus.emit('card-editor:updated', this.editing)
    },

    updateRootValues() {
      this.model.cmc = magic.util.card.calculateManaCost(this.model)
      this.model.name = this.model.card_faces.map(face => face.name).join(' // ')
      this.model.type_line = this.model.card_faces.map(face => face.type_line).join(' // ')
      magic.util.card.updateColors(this.model)
    },
  },

  mounted() {
    this.bus.on('card-editor:begin', this.beginEditing)
    this.bus.on('card-editor:update-face', this.updateFace)
  },
}
</script>


<style scoped>
.preview {
  margin-bottom: .5em;
  width: 100%;
}

.ptl {
  display: flex;
  flex-direction: row;
}
</style>
