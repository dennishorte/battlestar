<template>
  <div class="achievement">
    <div>
      <div class="achievement-name">{{ ach.name }}</div>
      <div>{{ ach.unlock }}</div>
      <div class="subtext" v-if="claimed">claimed by: {{ username(ach.claimedBy) }}</div>
      <div class="subtext">created by: {{ username(ach.createdBy) }}</div>
      <div class="subtext">age: {{ ach.createdAt }}</div>
    </div>

    <BDropdown>
      <BDropdownItem @click="$emit('edit-achievement', ach)">edit</BDropdownItem>
    </BDropdown>
  </div>
</template>


<script>
import { mapState } from 'vuex'


export default {
  name: 'CubeAchievement',

  emits: ['edit-achievement'],

  inject: ['bus'],

  props: {
    ach: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...mapState('magic', {
      users: 'users',
    }),

    claimed() {
      return Boolean(this.ach.claimedBy)
    },
  },

  methods: {
    username(id) {
      const user = this.users.find(u => u._id === id)
      return user ? user.name : id
    },
  },
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

.achievement-tag {
  margin-left: .5em;
}
</style>
