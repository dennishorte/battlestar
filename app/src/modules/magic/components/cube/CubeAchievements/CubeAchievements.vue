<template>
  <div class="achievements">
    <div class="header">
      <button class="btn btn-success" @click="createAchievement">create</button>
    </div>

    <div class="row">
      <div class="col">
        <h3>Unclaimed Achievements</h3>
        <CubeAchievement
          v-for="ach in cube.achievementsUnclaimed()"
          :key="ach._id"
          :ach="ach"
          @edit-achievement="editAchievement"
        />
      </div>

      <div class="col">
        <h3>Claimed Achievements</h3>
        <CubeAchievement
          v-for="ach in cube.achievementsClaimed()"
          :key="ach._id"
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
import { inject, ref } from 'vue'
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
</style>
