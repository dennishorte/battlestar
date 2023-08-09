<template>
  <div class="card-editor">
    <Card
      :size="270"
      :card="newCard"
      @click="editField"
      class="preview"
    />

    <div class="buttons">
      <button class="btn btn-info" @click="save">Save</button>
      <button class="btn btn-primary" @click="addFace">Add Face</button>

      <template v-if="newCard.card_faces.length > 1">
        <button
          v-for="(_, index) in newCard.card_faces"
          class="btn btn-warning"
          @click="removeFace(index)"
         >Remove {{ index }}</button>
      </template>

    </div>

    <template v-if="fieldName === 'header'">
      <label class="form-label">Name</label>
      <input class="form-control" v-model="newCard.card_faces[faceIndex].name" />

      <label class="form-label">Mana Cost</label>
      <input
        class="form-control"
        v-model="newCard.card_faces[faceIndex].mana_cost"
        @input="manaCostUpdated"
      />
    </template>

    <template v-if="fieldName === 'type-line'">
      <label class="form-label">Types</label>
      <input class="form-control" v-model="types" />

      <label class="form-label">Sub Types</label>
      <input class="form-control" v-model="subtypes" />

      <label class="form-label">Rarity</label>
      <select class="form-select" v-model="newCard.card_faces[faceIndex].rarity">
        <option>common</option>
        <option>uncommon</option>
        <option>rare</option>
        <option>mythic</option>
      </select>
    </template>

    <template v-if="fieldName === 'image-url'">
      <label class="form-label">Image Url</label>
      <textarea class="form-control" v-model="newCard.card_faces[faceIndex].image_uri"></textarea>

      <label class="form-label">Artist</label>
      <input class="form-control" v-model="newCard.card_faces[faceIndex].artist" />
    </template>

    <template v-if="fieldName === 'text-box'">
      <label class="form-label">Oracle Text</label>
      <textarea class="form-control" v-model="newCard.card_faces[faceIndex].oracle_text"></textarea>

      <label class="form-label">Flavor Text</label>
      <textarea class="form-control" v-model="newCard.card_faces[faceIndex].flavor_text"></textarea>

      <div class="ptl">
        <div>
          <label class="form-label">power</label>
          <input class="form-control" v-model="newCard.card_faces[faceIndex].power" />
        </div>

        <div>
          <label class="form-label">toughness</label>
          <input class="form-control" v-model="newCard.card_faces[faceIndex].toughness" />
        </div>

      </div>

      <div class="ptl">
        <div>
          <label class="form-label">loyalty</label>
          <input class="form-control" v-model="newCard.card_faces[faceIndex].loyalty" />
        </div>

        <div>
          <label class="form-label">defense</label>
          <input class="form-control" v-model="newCard.card_faces[faceIndex].defense" />
        </div>
      </div>

    </template>
  </div>
</template>


<script>
import axios from 'axios'

import { mag, util } from 'battlestar-common'

import Card from './Card.vue'


export default {
  name: 'CardEditor',

  components: {
    Card,
  },

  props: {
    card: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      newCard: this.card ? util.deepcopy(this.card) : mag.util.card.blank(),
      faceIndex: 0,
      fieldName: '',
    }
  },

  computed: {
    face() {
      return this.newCard.card_faces[this.faceIndex]
    },

    types: {
      set(value) {
        const base = this.face.type_line.split(mag.util.card.TYPE_DIVIDER)
        base[0] = value
        this.face.type_line = base.join(mag.util.card.TYPE_DIVIDER)
      },
      get() {
        return this.face.type_line.split(mag.util.card.TYPE_DIVIDER)[0]
      },
    },

    subtypes: {
      set(value) {
        const base = this.face.type_line.split(mag.util.card.TYPE_DIVIDER)
        while (base.length < 2) {
          base.push('')
        }
        base[1] = value
        this.face.type_line = base.join(mag.util.card.TYPE_DIVIDER)
      },
      get() {
        return this.face.type_line.split(mag.util.card.TYPE_DIVIDER)[1] || ''
      },
    },
  },

  methods: {
    addFace() {
      this.newCard.card_faces.push(mag.util.card.blankFace())
    },

    removeFace(index) {
      this.newCard.card_faces.splice(index, 1)
      if (this.faceIndex >= this.newCard.card_faces.length) {
        this.faceIndex = this.newCard.card_faces.length - 1
      }
    },

    editField(event) {
      const face = event.target.closest('.card-container')
      const clickedElement = event.target.closest('.editable')

      if (face && clickedElement) {
        this.faceIndex = face.dataset.faceIndex
        this.fieldName = clickedElement.dataset.editField
      }
    },

    manaCostUpdated() {
      mag.util.card.updateColors(this.newCard)
    },

    save() {
      this.$emit('save', this.newCard)
    },
  },

  watch: {
    card(newValue) {
      if (newValue) {
        this.newCard = newValue
      }
      else {
        this.newCard = mag.util.card.blank()
      }
    },
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


<style>
.editable:after {
  content: '\A';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0,200,255,0.4);
  opacity: 0;
}

.editable:hover:after {
  opacity: 1;
}
</style>
