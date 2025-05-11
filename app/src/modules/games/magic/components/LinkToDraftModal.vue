<template>
  <ModalBase id="link-to-draft-modal" @ok="link">
    <template #header>Link to Draft</template>

    <div class="modal-body">

      <div v-if="!!linkedDraft" class="alert alert-primary">
        Currently linked to:
        <button @click="goToDraft" data-bs-dismiss="modal" class="btn btn-link">
          {{ linkedDraft.settings.name }}
        </button>
      </div>

      <select v-else class="form-select" v-model="draftId">
        <option
          v-for="draft in drafts"
          :key="draft._id"
          :value="draft._id"
        >
          {{ draft.settings.name }}
        </option>
      </select>

    </div>
  </ModalBase>
</template>


<script>
import { mapState } from 'vuex'

import ModalBase from '@/components/ModalBase'


export default {
  name: 'LinkToDraftModal',

  components: {
    ModalBase,
  },

  inject: ['actor', 'game'],

  data() {
    return {
      draftId: '',
      drafts: [],
    }
  },

  computed: {
    ...mapState('magic/game', {
      linkedDraft: 'linkedDraft',
    })
  },

  methods: {
    goToDraft() {
      this.$router.push(`/game/${this.linkedDraft._id}`)
    },

    async link() {
      await this.$post('/api/magic/link/create', {
        gameId: this.game._id,
        draftId: this.draftId,
      })

      this.game.settings.linkedDraftId = this.draftId

      await this.$store.dispatch('magic/game/fetchLinkedDraft')
    },

    async fetchDrafts() {
      const { drafts } = await this.$post('/api/magic/link/fetch_drafts', {
        userId: this.actor._id,
      })

      this.drafts = drafts
      this.draftId = this.drafts[0] ? this.drafts[0]._id : ''
    },

  },

  mounted() {
    this.fetchDrafts()
  },
}
</script>


<style scoped>
</style>
