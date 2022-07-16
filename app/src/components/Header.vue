<template>
<b-container>
  <b-row>
    <b-col>
      <div class="header text-left">
        <b-dropdown id="header-dropdown" text="menu" right>
          <b-dropdown-item>
            <router-link to="/">home</router-link>
          </b-dropdown-item>

          <b-dropdown-item>
            <router-link to="/lobby/create">new lobby</router-link>
          </b-dropdown-item>

          <b-dropdown-item>
            <router-link to="/data">data</router-link>
          </b-dropdown-item>

          <b-dropdown-divider></b-dropdown-divider>

          <b-dropdown-item>
            <router-link to="/admin">admin</router-link>
          </b-dropdown-item>

          <b-dropdown-item>
            <router-link to="/logout">logout</router-link>
          </b-dropdown-item>
        </b-dropdown>

        <a href="/" class="link-unstyled">
          <h1>Game Center</h1>
        </a>

      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style>
.header {
    text-align: center;
}

#header-dropdown {
    float: right;
    margin: .5em;
}
</style>
