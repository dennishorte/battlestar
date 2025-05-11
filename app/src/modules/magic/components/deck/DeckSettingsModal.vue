<template>
  <Modal id="deck-settings-modal">
    <template #header>Deck Settings</template>

    <div class="settings-form">
      <div class="form-group mb-3">
        <label for="deck-name" class="form-label">Deck Name</label>
        <input
          type="text"
          id="deck-name"
          class="form-control"
          v-model="deckName"
          placeholder="Enter deck name"
        />
      </div>

      <div class="form-group">
        <label for="deck-format" class="form-label">Format</label>
        <select class="form-select" id="deck-format" v-model="format">
          <option value="custom">Custom</option>
          <option value="draft">Draft</option>
          <option value="standard">Standard</option>
          <option value="modern">Modern</option>
          <option value="legacy">Legacy</option>
          <option value="commander">Commander</option>
          <option value="pioneer">Pioneer</option>
          <option value="vintage">Vintage</option>
          <option value="pauper">Pauper</option>
          <option value="brawl">Brawl</option>
          <option value="historic">Historic</option>
        </select>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" @click="cancel" data-bs-dismiss="modal">Cancel</button>
      <button class="btn btn-primary" @click="saveSettings" data-bs-dismiss="modal">Save</button>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue'

export default {
  name: 'DeckSettingsModal',

  components: {
    Modal
  },

  props: {
    deck: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      deckName: '',
      format: 'custom'
    }
  },

  methods: {
    showModal() {
      this.deckName = this.deck.name
      this.format = this.deck.format || 'custom'
      this.$modal('deck-settings-modal').show()
    },

    async saveSettings() {
      this.deck.setName(this.deckName)
      this.deck.setFormat(this.format)
    }
  }
}
</script>

<style scoped>
.settings-form {
  padding: 0 1rem;
}
</style>
