<template>
  <div class="achievements">
    <div class="header">
      <button class="btn btn-success" @click="create">create</button>
    </div>

    <div>
      <div v-for="ach in sortedAchievements" class="achievement">
        <div>
          <div class="achievement-name">{{ ach.name }}</div>
          <div>{{ ach.unlock }}</div>
          <div class="subtext">created by: {{ username(ach.creatorId) }}</div>
          <div class="subtext">age: {{ ageString(ach) }}</div>
          <div v-if="ach.tags.length > 0">
            <div
              v-for="tag in ach.tags"
              class="achievement-tag badge text-bg-primary"
            >
              {{ tag }}
            </div>
          </div>
        </div>
        <div>
          <Dropdown :notitle="true">
            <DropdownButton>claim</DropdownButton>
            <DropdownButton @click="editTags(ach)">tags</DropdownButton>
            <DropdownButton @click="edit(ach)">edit</DropdownButton>
            <DropdownDivider />
            <DropdownButton>delete</DropdownButton>
          </Dropdown>
        </div>
      </div>
    </div>

    <Modal id="achievement-editor" @ok="save">
      <template #header>Achievement Editor</template>

      <div class="mb-3">
        <label class="form-label">Achievement Name</label>
        <input class="form-control" v-model="achievement.name" />

        <label class="form-label">Unlock Conditions</label>
        <textarea class="form-control" v-model="achievement.unlock" />

        <label class="form-label">Tags (separated by spaces)</label>
        <input class="form-control" v-model="computedTags" />
      </div>

      <div v-for="(h, index) in achievement.hidden" v-if="showAll">
        <div class="hidden-header">
          <div>Hidden Tab {{ index }}</div>
          <div>
            <button class="btn btn-outline-danger" @click="removeHidden(index)">delete me</button>
          </div>
        </div>

        <div class="alert alert-info">
          <label class="form-label">visible text</label>
          <input class="form-control" v-model="h.name" />

          <label class="form-label">hidden details</label>
          <textarea class="form-control" rows="8" v-model="h.text" />
        </div>
      </div>

      <div v-if="!showAll" class="alert alert-danger">
        Hidden info is hidden
      </div>

      <button class="btn btn-primary" @click="addHidden" v-if="showAll">add hidden tab</button>
    </Modal>
  </div>
</template>


<script>
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import Modal from '@/components/Modal'


export default {
  name: 'Achievements',

  components: {
    Dropdown,
    DropdownButton,
    DropdownDivider,
    Modal,
  },

  inject: ['actor', 'cubeId'],

  props: {
    achievements: {
      type: Array,
      default: [],
    },
    users: Array
  },

  data() {
    return {
      achievement: this.blank(),

      showAll: false,
    }
  },

  computed: {
    computedTags: {
      get() {
        return this.achievement.tags.join(' ')
      },

      set(newValue) {
        this.achievement.tags = newValue.split(' ')
      },
    },

    sortedAchievements() {
      return this
        .achievements
        .sort((l, r) => r.createdTimestamp - l.createdTimestamp)
    },
  },

  methods: {
    addHidden() {
      this.achievement.hidden.push({
        name: '',
        text: '',
      })
    },

    ageString(ach) {
      const millis = Date.now() - ach.createdTimestamp
      const day = 1000 * 60 * 60 * 24
      const days = Math.floor(millis / day)
      return `${days} days`
    },

    blank() {
      return {
        name: '',
        unlock: '',
        hidden: [],
        tags: [],
        starred: [],

        creatorId: this.actor._id,
        cubeId: this.cubeId,
      }
    },

    create() {
      this.achievement = this.blank()
      this.addHidden()
      this.showAll = true
      this.$modal('achievement-editor').show()
    },

    edit(ach) {
      this.achievement = ach
      this.showAll = true
      this.$modal('achievement-editor').show()
    },

    editTags(ach) {
      this.achievement = ach
      this.showAll = false
      this.$modal('achievement-editor').show()
    },

    removeHidden(index) {
      this.achievement.hidden.splice(index, 1)
    },

    username(id) {
      const user = this.users.find(u => u._id === id)
      return user ? user.name : id
    },

    async save() {
      await this.$post('/api/magic/achievement/save', {
        achievement: this.achievement,
      })
      this.$emit('achievements-updated')
    },
  },
}
</script>


<style scoped>
.header {
  margin: .5em 0;
}

.hidden-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

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
