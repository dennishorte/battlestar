<template>
  <ModalBase id="achievement-search-linker-modal">
    <template #header>Link Search to Achievement</template>

    <label class="form-label">Achievement to Link</label>
    <select class="form-select mb-3" v-model="selectedId">
      <option
        v-for="ach in sortedAchievements"
        :key="ach.id"
        :value="ach.id"
      >
        {{ ach.name }}
      </option>
    </select>

    <template v-if="selectedAch">
      <CubeAchievement :ach="selectedAch" :hide-menu="true" class="mb-3" />

      <div>Existing Search</div>

      <CardFilterList
        class="border-top"
        :filters="selectedAchFilter"
        :no-header="true"
        :allow-edit="false" />

    </template>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
      <button class="btn btn-info" @click="view" data-bs-dismiss="modal">view</button>
      <button class="btn btn-primary" @click="link">link</button>
    </template>

  </ModalBase>
</template>


<script>
import CubeAchievement from './CubeAchievements/CubeAchievement.vue'
import CardFilterList from '../CardFilterList.vue'
import ModalBase from '@/components/ModalBase.vue'


export default {
  name: 'AchievementViewerModal',

  components: {
    CubeAchievement,
    CardFilterList,
    ModalBase,
  },

  props: {
    achievements: {
      type: Array,
      required: true
    },
    filters: {
      type: Array,
      required: true,
    },
  },

  data: () => {
    return {
      selectedId: null,
    }
  },

  computed: {
    selectedAch() {
      return this.achievements.find(ach => ach.id === this.selectedId)
    },

    selectedAchFilter() {
      if (this.selectedAch) {
        return this.selectedAch.filters ? this.selectedAch.filters : []
      }
      else {
        return []
      }
    },

    sortedAchievements() {
      return [...this.achievements]
        .sort((l, r) => l.name.localeCompare(r.name))
    },
  },

  methods: {
    async link() {
      const achievement = { ...this.selectedAch, filters: this.filters }
      const cubeId = this.$store.state.magic.cube.cube._id
      await this.$store.dispatch('magic/cube/updateAchievement', { cubeId, achievement })
    },

    view() {

    },
  },
}
</script>


<style scoped>
</style>
