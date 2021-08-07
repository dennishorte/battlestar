<template>
<div class='user-list'>
  <h3>User List</h3>

  <b-table
    :items="users"
    :fields="fields">
  </b-table>

</div>
</template>

<script>

export default {
  name: 'UserList',
  props: {
    users: Array,
  },
  data() {
    return {
      fields: [
        { key: '_id', sortable: true },
        { key: 'name', sortable: true },
        { key: 'slack', sortable: true },
      ],
    }
  }
}
</script>
