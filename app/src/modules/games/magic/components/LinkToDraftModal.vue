<template>
  <Modal id="link-to-draft-modal" @ok="link">
    <template #header>Link to Draft</template>

    <div class="modal-body">

      <div v-if="!!existingLink" class="alert alert-primary">
        Currently linked to:
        <button @click="goToDraft" data-bs-dismiss="modal" class="btn btn-link">
          {{ existingLink.settings.name }}
        </button>
      </div>

      <select v-else class="form-select" v-model="draftId">
        <option
          v-for="(draft, index) in drafts"
          :key="draft._id"
          :value="draft._id"
        >
          {{ draft.settings.name }}
        </option>
      </select>

    </div>
  </Modal>
</template>


<script>
import axios from 'axios'

import Modal from '@/components/Modal'


export default {
  name: 'LinkToDraftModal',

  components: {
    Modal,
  },

  inject: ['actor', 'game'],

  data() {
    return {
      draftId: '',
      drafts: [],
      existingLink: null,
    }
  },

  methods: {
    goToDraft() {
      this.$router.push(`/game/${this.existingLink._id}`)
    },


    async link() {
      const requestResult = await axios.post('/api/magic/link/create', {
        gameId: this.game._id,
        draftId: this.draftId,
      })

      if (requestResult.data.status !== 'success') {
        console.log(requestResult.data)
        alert('link failed')
      }
    },

    async fetchDrafts() {
      const requestResult = await axios.post('/api/magic/link/fetchDrafts', {
        userId: this.actor._id,
      })

      if (requestResult.data.status === 'success') {
        this.drafts = requestResult.data.drafts
        this.draftId = this.drafts[0] ? this.drafts[0]._id : ''
      }
      else {
        console.log(requestResult.data)
        alert('Error fetching draft list')
      }
    },

    async fetchExistingLink() {
      if (this.game.settings.linkedDraftId) {
        const requestResult = await axios.post('/api/game/fetch', {
          gameId: this.game.settings.linkedDraftId,
        })

        if (requestResult.data.status === 'success') {
          this.existingLink = requestResult.data.game
        }
        else {
          alert('Error fetching existing link')
        }
      }
    },
  },

  async mounted() {
    this.fetchDrafts()
    this.fetchExistingLink()
  },
}
</script>


<style scoped>
</style>
