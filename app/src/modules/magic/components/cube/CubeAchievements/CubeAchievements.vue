<template>
  <div class="achievements">
    <div class="header">
      <button class="btn btn-success" @click="createAchievement">create</button>
    </div>

    <div class="achievement-columns">
      <div class="achievement-column">
        <h3>Unclaimed</h3>
        <CubeAchievement
          v-for="ach in unlinkedAchievements"
          :key="ach.id"
          :ach="ach"
          @edit-achievement="editAchievement"
        />
      </div>

      <div class="achievement-column">
        <h3>Linked</h3>
        <CubeAchievement
          v-for="ach in linkedAchievements"
          :key="ach.id"
          :ach="ach"
          @edit-achievement="editAchievement"
        />
      </div>

      <div class="achievement-column">
        <h3>Claimed</h3>
        <CubeAchievement
          v-for="ach in cube.achievementsClaimed()"
          :key="ach.id"
          :ach="ach"
        />
      </div>
    </div>


    <BModal title="Achievement Editor" @ok="saveAchievement" v-model="achievementModalVis">
      <div v-if="Boolean(editingAchievement)">
        <BFormGroup label="Achievement Name">
          <BFormInput v-model="editingAchievement.name" />
        </BFormGroup>
        <BFormGroup label="Achievement Unlock">
          <BFormInput v-model="editingAchievement.unlock" />
        </BFormGroup>
        <BFormGroup label="Achievement Text">
          <BFormTextarea v-model="editingAchievement.hidden" rows="8" />
        </BFormGroup>
      </div>
      <template #footer="{ cancel, ok }">
        <BButton variant="danger" @click="deleteAchievement">Delete</BButton>
        <BButton variant="secondary" @click="cancel()">Cancel</BButton>
        <BButton variant="primary" @click="ok()">OK</BButton>
      </template>
    </BModal>
  </div>
</template>


<script setup>
import { computed, inject, ref } from 'vue'
import { useStore } from 'vuex'
import { magic } from 'battlestar-common'

import CubeAchievement from './CubeAchievement.vue'

const props = defineProps({
  cube: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
})

const actor = inject('actor')
const store = useStore()

const hasFilters = (ach) => ach.filters && ach.filters.length > 0

const unlinkedAchievements = computed(() =>
  props.cube.achievementsUnclaimed().filter(ach => !hasFilters(ach))
)
const linkedAchievements = computed(() =>
  props.cube.achievementsUnclaimed().filter(ach => hasFilters(ach))
)

const achievementModalVis = ref(false)
const editingAchievement = ref(null)

function createAchievement() {
  editingAchievement.value = magic.util.wrapper.cube.blankAchievement()
  editingAchievement.value.createdBy = actor._id
  achievementModalVis.value = true
}

async function deleteAchievement() {
  await store.dispatch('magic/cube/deleteAchievement', {
    cubeId: props.cube._id,
    achievement: editingAchievement.value,
  })
}

function editAchievement(achievement) {
  editingAchievement.value = achievement
  achievementModalVis.value = true
}

async function saveAchievement() {
  if (!editingAchievement.value) {
    throw new Error('No achievement to save')
  }
  if (!editingAchievement.value.name.trim()) {
    return
  }
  if (!editingAchievement.value.unlock.trim()) {
    return
  }
  if (!editingAchievement.value.hidden.trim()) {
    return
  }
  await store.dispatch('magic/cube/updateAchievement', {
    cubeId: props.cube._id,
    achievement: editingAchievement.value,
  })
}
</script>


<style scoped>
.header {
  margin: .5em 0;
}

.achievement-columns {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

.achievement-column {
  flex: 1;
  min-width: 300px;
}
</style>
