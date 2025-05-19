<template>
  <div class="row">
    <div class="mt-2">
      <button class="btn btn-success" @click="createScar">create</button>
    </div>

    <div class="col">
      <h5>Avaiable Scars</h5>

      <div v-for="scar in scarsUnused" :key="scar.id" class="scar-container">
        <div>{{ scar.text }}</div>
        <div>
          <button class="btn btn-link" @click="editScar(scar)">edit</button>
        </div>
      </div>
    </div>

    <div class="col">
      <h5>Used Scars</h5>
      <div v-for="scar in scarsUsed" :key="scar.id" class="scar-container vertical">
        <div>{{ scar.text }}</div>
        <div class="scar-applied-info">
          <div
            @mouseover="mouseover(scar.appliedTo)"
            @mouseleave="mouseleave(scar.appliedTo)"
            @mousemove="mousemove"
          >
            card: {{ scar.appliedTo.name }}
          </div>
          <div>user: {{ getUserNameById(scar.appliedBy) }}</div>
        </div>
      </div>
    </div>

    <BModal title="Scar Editor" @ok="save" v-model="scarModalVis">
      <BFormGroup label="Scar Text" v-if="Boolean(editingScar)">
        <BFormTextarea v-model="editingScar.text" rows="8" />
      </BFormGroup>

      <template #footer="{ cancel, ok }">
        <BButton variant="danger" @click="deleteScar">Delete</BButton>
        <BButton variant="secondary" @click="cancel()">Cancel</BButton>
        <BButton variant="primary" @click="ok()">OK</BButton>
      </template>
    </BModal>
  </div>
</template>


<script setup>
import { computed, inject, ref, toRef } from 'vue'
import { useStore } from 'vuex'

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

const editingScar = ref(null)
const scarModalVis = ref(false)
const scarlist = toRef(props.cube.scarlist)

const scarsUsed = computed(() => scarlist.value.filter(s => s.appliedTo))
const scarsUnused = computed(() => scarlist.value.filter(s => !s.appliedTo))

function createScar() {
  const blankScar = {
    id: null,
    text: '',
    createdAt: new Date(),
    createdBy: actor._id,
    appliedTo: null,
    appliedBy: null,
    appliedAt: null,
  }
  editingScar.value = blankScar
  scarModalVis.value = true
}

function editScar(scar) {
  editingScar.value = scar
  scarModalVis.value = true
}

function getUserNameById(id) {
  const user = props.users.find(u => u._id === id)
  return user ? user.name : id
}

async function deleteScar() {
  await store.dispatch('magic/cube/deleteScar', {
    cubeId: props.cube._id,
    scar: editingScar.value,
  })
}

async function save() {
  if (!editingScar.value) {
    throw new Error('No scar to save')
  }
  if (!editingScar.value.text.trim()) {
    return
  }
  await store.dispatch('magic/cube/updateScar', {
    cubeId: props.cube._id,
    scar: editingScar.value,
  })
}
</script>


<style scoped>
.scar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
  border: 1px solid #ddd;
  padding-left: .5em;
  margin-top: .25em;
}

.scar-container.vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.scar-applied-info {
  font-size: .8em;
  color: #333;
  margin-left: .5em;
}
</style>
