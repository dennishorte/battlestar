<template>
<div class='admin'>
  <Header />

  <div class="container">
    <div class="row">
      <div class="col">
        <h2>Admin</h2>
      </div>
    </div>


    <div class="row">

      <div class="col-6">
        <CreateUser v-on:user-created="getAllUsers" />
      </div>

      <div class="col-6">
        <UserList :users="users" />
      </div>

    </div>
  </div>

</div>
</template>

<script>
import axios from 'axios'

import Header from '../../../../src/components/Header'

import CreateUser from '../../admin/components/CreateUser'
import UserList from '../../admin/components/UserList'

export default {
  name: 'Admin',
  components: {
    Header,

    CreateUser,
    UserList,
  },
  data() {
    return {
      users: [],
    }
  },
  methods: {
    async getAllUsers() {
      const response = await axios.post('/api/user/all')
      console.log(response)
      this.users = response.data.users
    },
  },

  mounted() {
    this.getAllUsers()
  },
}
</script>
