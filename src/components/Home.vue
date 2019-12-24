<template>
  <div class="home">
    <div class="text-light text-sm-left m-3 p-2">
      <h4 class="py-2 h-text">Please chose a weekday to see the available courses</h4>

      <select v-model="searchTerm">
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
      </select>
    </div>

    <div class="index container">
      <table class="table text-primary container">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Course</th>
            <th scope="col">Teacher</th>
            <th scope="col">Students</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(course, index) in filteredCourses" :key="index">
            <th>{{ index + 1 }}</th>
            <td>{{ course.title }}</td>
            <td>{{ course.teacherString }}</td>
            <td>{{ course.studentN.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
export default {
  name: "Home",
  data() {
    return {
      courses: [],
      searchTerm: ""
    };
  },
  methods: {},
  created() {
    //fetch DATA from the firestore
    db
      .collection("courses")
      .orderBy("title")
      .get() //return a PROMISE
      .then(snapshot => {
        // snapshot ES6 function
        snapshot.forEach(doc => {
          let course = doc.data();
          course.id = doc.id;
          this.courses.push(course);
        });
      });
  },
  computed: {
    // Create a filter of courses(dayofWeek)
    filteredCourses() {
      return this.courses.filter(course => {
        return course.dofW.match(this.searchTerm);
      });
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .index,
  .dropdown-menu {
    font-size: 0.5rem;
  }
  .h-text {
    font-size: 1.1rem;
  }
}
</style>
