<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" style="width: 240px; margin-bottom: 20px;">
    <h1>Welcome to Your Trading Journal App</h1>
    <p>
      Use this app to log, review, and analyze your trades.<br>
      <router-link to="/trades">View Trades</router-link> |
      <router-link to="/add">Add New Trade</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 40px;
}
</style>
