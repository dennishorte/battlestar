<template>
  <div class="cube-drafts">
    <table v-if="drafts.length" class="table table-light">
      <thead>
        <tr class="table-head">
          <th>name</th>
          <th>players</th>
          <th>status</th>
          <th>active games</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="draft in drafts" :key="draft._id">
          <td>
            <router-link :to="`/game/${draft._id}`">
              {{ draftName(draft) }}
            </router-link>
          </td>
          <td>{{ playerNames(draft) }}</td>
          <td>{{ draftStatus(draft) }}</td>
          <td>{{ draft.activeGameCount || 0 }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="loaded">No drafts found for this cube.</p>
  </div>
</template>


<script>
export default {
  name: 'CubeDrafts',

  props: {
    cube: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      drafts: [],
      loaded: false,
    }
  },

  methods: {
    async fetchDrafts() {
      const { drafts } = await this.$post('/api/magic/link/fetch_drafts_by_cube', {
        cubeId: this.cube._id,
      })
      this.drafts = drafts
      this.loaded = true
    },

    draftName(draft) {
      return draft.settings ? draft.settings.name : draft.name
    },

    playerNames(draft) {
      if (!draft.settings || !draft.settings.players) {
        return ''
      }
      return draft.settings.players.map(p => p.name).join(', ')
    },

    draftStatus(draft) {
      return draft.gameOver ? 'complete' : 'in progress'
    },
  },

  created() {
    this.fetchDrafts()
  },
}
</script>
