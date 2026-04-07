<template>
  <nav class="navbar">
    <div class="logo">MySite</div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar { display: flex; justify-content: space-between; padding: 1rem; background: #2c3e50; color: white; }
.nav-links { list-style: none; display: flex; gap: 1rem; }
.nav-links a { color: white; text-decoration: none; }
</style>