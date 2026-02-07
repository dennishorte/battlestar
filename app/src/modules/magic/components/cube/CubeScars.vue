<template>
  <div class="row">
    <div class="mt-2">
      <button class="btn btn-success" @click="createScar">create</button>
    </div>

    <div class="col">
      <h5>Avaiable Scars</h5>

      <div v-for="scar in cube.scarsUnused()" :key="scar.id" class="scar-container vertical">
        <div>{{ scar.text }}</div>
        <div class="scar-info">
          <span class="scar-creator">by {{ getUserNameById(scar.createdBy) }}</span>
          <button class="btn btn-link" @click="editScar(scar)">edit</button>
        </div>
      </div>
    </div>

    <div class="col">
      <h5>Used Scars</h5>
      <div v-for="scar in cube.scarsUsed()" :key="scar.id" class="scar-container vertical">
        <div>{{ scar.text }}</div>
        <div class="scar-applied-info">
          <div
            v-if="getCardById(scar.appliedTo)"
            class="applied-card-link"
            @mouseover="mouseover(getCardById(scar.appliedTo))"
            @mouseleave="mouseleave(getCardById(scar.appliedTo))"
            @mousemove="mousemove"
            @click="cardClicked(getCardById(scar.appliedTo))"
          >
            card: {{ getCardById(scar.appliedTo).name() }}
          </div>
          <div v-else>card: (unknown)</div>
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
import { inject, ref } from 'vue'
import { useStore } from 'vuex'
import { magic } from 'battlestar-common'

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
const bus = inject('bus')
const store = useStore()

const editingScar = ref(null)
const scarModalVis = ref(false)

function getCardById(cardId) {
  return props.cube.cards().find(c => c._id === cardId)
}

function mouseover(card) {
  if (card) {
    store.commit('magic/setMouseoverCard', card)
  }
}

function mouseleave(card) {
  if (card) {
    store.commit('magic/unsetMouseoverCard', card)
  }
}

function mousemove(event) {
  store.commit('magic/setMouseoverPosition', {
    x: event.clientX,
    y: event.clientY,
  })
}

function cardClicked(card) {
  bus.emit('card-clicked', card)
}

function createScar() {
  editingScar.value = magic.util.wrapper.cube.blankScar()
  editingScar.value.createdBy = actor._id
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

.scar-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: .5em;
}

.scar-creator {
  font-size: .8em;
  color: #666;
}

.applied-card-link {
  cursor: pointer;
  color: #0d6efd;
}

.applied-card-link:hover {
  text-decoration: underline;
}
</style>
