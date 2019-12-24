<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <div class="container">
      <li class="nav-item">
        <router-link class="navbar-brand" :to="{ name: 'Home' }">
          <div>
            <span class="text-primary logo">
              <i class="fas fa-book-open"></i> Primary </span
            >School
          </div>
        </router-link>
      </li>

      <!-- Hamburger menu small screen-->
      <button
        class="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarCollapse"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Courses' }"
              >Courses</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Teachers' }"
              >Teachers</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Students' }"
              >Students</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      userIds: ["1", "2", "3", "4"]
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: "Home" });
    },
    goBack() {
      this.$router.go(-1);
    },
    goForeward() {
      this.$router.go(1);
    }
  }
};
</script>

<style>
body {
  background: #333;
  color: #fff;
}

.navbar {
  border-bottom: #008ed6 3px solid;
  opacity: 0.8;
}
</style>
