<template>
  <div class="card-editor" v-if="Boolean(card)">
    <Card
      :size="270"
      :card="card"
      @click="editField"
      class="preview"
    />

    <div class="buttons">
      <button class="btn btn-primary" @click="addFace">Add Face</button>

      <template v-if="card.card_faces.length > 1">
        <button
          v-for="(_, index) in card.card_faces"
          class="btn btn-warning"
          @click="removeFace(index)"
         >Remove {{ index }}</button>
      </template>
    </div>

    <template v-if="fieldName === 'header'">
      <label class="form-label">Name</label>
      <input
        class="form-control"
        v-model="card.card_faces[faceIndex].name"
        @input="updateRootValues"
      />

      <label class="form-label">Mana Cost</label>
      <input
        class="form-control"
        v-model="card.card_faces[faceIndex].mana_cost"
        @input="updateRootValues"
      />
    </template>

    <template v-if="fieldName === 'type-line'">
      <label class="form-label">Types</label>
      <input class="form-control" v-model="types" @input="updateRootValues" />

      <label class="form-label">Sub Types</label>
      <input class="form-control" v-model="subtypes" @input="updateRootValues" />

      <label class="form-label">Rarity</label>
      <select class="form-select" v-model="card.card_faces[faceIndex].rarity">
        <option>common</option>
        <option>uncommon</option>
        <option>rare</option>
        <option>mythic</option>
      </select>
    </template>

    <template v-if="fieldName === 'image-url'">
      <label class="form-label">Image Url</label>
      <textarea class="form-control" v-model="card.card_faces[faceIndex].image_uri"></textarea>

      <label class="form-label">Artist</label>
      <input class="form-control" v-model="card.card_faces[faceIndex].artist" />
    </template>

    <template v-if="fieldName === 'text-box'">
      <label class="form-label">Oracle Text</label>
      <textarea class="form-control" v-model="card.card_faces[faceIndex].oracle_text"></textarea>

      <label class="form-label">Flavor Text</label>
      <textarea class="form-control" v-model="card.card_faces[faceIndex].flavor_text"></textarea>

      <div class="ptl">
        <div>
          <label class="form-label">power</label>
          <input class="form-control" v-model="card.card_faces[faceIndex].power" />
        </div>

        <div>
          <label class="form-label">toughness</label>
          <input class="form-control" v-model="card.card_faces[faceIndex].toughness" />
        </div>

      </div>

      <div class="ptl">
        <div>
          <label class="form-label">loyalty</label>
          <input class="form-control" v-model="card.card_faces[faceIndex].loyalty" />
        </div>

        <div>
          <label class="form-label">defense</label>
          <input class="form-control" v-model="card.card_faces[faceIndex].defense" />
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
    original: {
      type: Object,
      default: null,
    },
  },

  inject: ['bus'],

  data() {
    return {
      card: null,
      faceIndex: 0,
      fieldName: '',
    }
  },

  computed: {
    face() {
      return this.card.card_faces[this.faceIndex]
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
      this.card.card_faces.push(mag.util.card.blankFace())
      this.updateRootValues()
    },

    removeFace(index) {
      this.card.card_faces.splice(index, 1)
      if (this.faceIndex >= this.card.card_faces.length) {
        this.faceIndex = this.card.card_faces.length - 1
      }
      this.updateRootValues()
    },

    originalUpdated() {
      this.card = this.original ? util.deepcopy(this.original) : mag.util.card.blank()
    },

    editField(event) {
      const face = event.target.closest('.card-container')
      const clickedElement = event.target.closest('.editable')

      if (face && clickedElement) {
        this.faceIndex = face.dataset.faceIndex
        this.fieldName = clickedElement.dataset.editField
      }
    },

    updateRootValues() {
      this.card.cmc = mag.util.card.calculateManaCost(this.card)
      this.card.name = this.card.card_faces.map(face => face.name).join(' // ')
      this.card.type_line = this.card.card_faces.map(face => face.type_line).join(' // ')
      mag.util.card.updateColors(this.card)
    },
  },

  watch: {
    card: {
      handler(newValue, oldValue) {
        // Some internal value of the card was changed, so we'll update our parent.
        if (newValue === oldValue) {
          this.bus.emit('card-updated', this.card)
        }

        // The original card has changed, causing this to change. Our parent is already aware of this.
        else {
          // Do nothing
        }
      },
      deep: true,
    },
    original() {
      this.originalUpdated()
    },
  },

  mounted() {
    this.originalUpdated()
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
/* .editable:after {
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
   } */
</style>
