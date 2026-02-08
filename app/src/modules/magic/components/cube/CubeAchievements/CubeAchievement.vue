<template>
  <div class="achievement">
    <div>
      <div class="achievement-name">{{ ach.name }}</div>
      <div>{{ ach.unlock }}</div>
      <div class="subtext" v-if="ach.claimedBy">claimed by: {{ username(ach.claimedBy) }}</div>
      <div class="subtext">created by: {{ username(ach.createdBy) }}</div>

      <div v-if="ach.claimedBy" class="subtext">claimed: {{ ach.claimedAt }}</div>
      <div v-else class="subtext">age: {{ ach.createdAt }}</div>
    </div>

    <BDropdown v-if="!hideMenu">
      <BDropdownItem @click="viewerModalVis = true">reveal</BDropdownItem>

      <template v-if="!ach.claimedBy">
        <BDropdownItem @click="$emit('edit-achievement', ach)">edit</BDropdownItem>
        <BDropdownDivider />
        <BDropdownItem @click="claimAchievement">claim</BDropdownItem>
      </template>
    </BDropdown>

    <BModal title="Achievement Viewer" v-model="viewerModalVis" :lazy="true">
      <div class="achievement-name">{{ ach.name }}</div>
      <div>{{ ach.unlock }}</div>
      <hr />
      <div class="achievement-hidden">{{ ach.hidden }}</div>
    </BModal>

  </div>
</template>


<script setup>
import { inject, ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  ach: {
    type: Object,
    required: true
  },
  hideMenu: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit-achievement'])

const actor = inject('actor')
const cubeId = inject('cubeId')
const store = useStore()

const viewerModalVis = ref(false)

async function claimAchievement() {
  await store.dispatch('magic/cube/claimAchievement', {
    cubeId,
    achievement: props.ach,
    user: actor,
  })
}

function username(id) {
  const user = store.state['magic'].users.find(u => u._id === id)
  return user ? user.name : id
}

</script>


<style scoped>
.achievement {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  border: 1px solid #999;
  border-radius: .5em;
  padding: .25em .5em;
}

.achievement:not(:first-of-type) {
  margin-top: .5em;
}

.achievement-name {
  font-weight: bold;
}

.subtext {
  font-size: .8em;
  font-color: #333;
  margin-left: .5em;
}

.achievement-hidden {
  white-space: pre-wrap;
}
</style>
