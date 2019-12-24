<template>
  <div class="teachers">
    <div class="text-light text-sm-left m-2 p-2">
      <h4 class="py-2 h-text">
        <span class="text-primary font-weight-bolder">Teacher</span> with his
        assigned Courses
      </h4>

      <br />
    </div>

    <div class="index container">
      <table class="table text-primary container">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Teacher</th>
            <th scope="col">Assigned Courses</th>
          </tr>
        </thead>

        <tbody>
          <!-- [00_1]  Line in table as as many total Teacher are avaialble-->
          <tr
            v-for="(teacher, index) in listOfTotalTeachers"
            :key="index"
            :class="iconClassId(teacher.id, '')"
          >
            <th>{{ index + 1 }}</th>
            <td>
              {{ teacher.name }}
            </td>

            <!-- Dropdown list Courses -->
            <td>
              <!-- [01_2]  Get all Courses name who belong to a teacher -->
              <!-- ACTUAL  coursesNameforSpecificTeacher -->
              <div class="dropdown-container">
                {{ teacher.coursesNameArray.length }}
                <button
                  data-toggle="dropdown"
                  data-display="static"
                  class="btn btn-sm btn-primary ml-2 dropdown-toggle"
                  type="button"
                  @click="
                    actualCoursesWhoBelongToSpecificTeacher(teacher),
                    needUpdates(teacher),
                    updateTheRestOfCoursesWhoBelongToOtherTeachers(teacher),
                    updateLocalCousesDB(),
                    dbUpdate()
                  "
                  @keyup.esc="
                    actualCoursesWhoBelongToSpecificTeacher(teacher),
                    needUpdates(teacher),
                    updateTheRestOfCoursesWhoBelongToOtherTeachers(teacher),
                    updateLocalCousesDB(),
                    dbUpdate()
                  "
                ></button>

                <!-- DROPDOWN -->
                <ul class="dropdown-menu">
                  <li
                    v-for="(course, index) in courses"
                    :key="index"
                    class="list-group-item d-flex justify-content-between"
                  >
                    {{ course.title }}
                    <!-- [01_3]] - Inside DROPBOX menu select element (class) -->
                    <!-- UPDATE  HERE coursesNameforSpecificTeacher -->
                    <input
                      type="checkbox"
                      v-bind:value="course.title"
                      v-model="coursesNameforSpecificTeacher"
                      v-bind:class="iconClassId(course.id, '')"
                      @click="selectIdCourseLineClass(teacher, course)"
                    />
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import { constants } from "fs";

export default {
  name: "Teachers",
  data() {
    return {
      courses: [],
      listOfTotalTeachers: [],
      coursesNameforSpecificTeacher: [],
      modifyDb: false
    };
  },
  methods: {
    // [01_2]  Get all Courses name who belong to a teacher
    // coursesNameforSpecificTeacher -- initial value
    // [Step 00]
    actualCoursesWhoBelongToSpecificTeacher(teacher) {
      this.listOfTotalTeachers.forEach(doc => {
        if (doc.id == teacher.id) {
          this.coursesNameforSpecificTeacher = doc.coursesNameArray;
        }
      });
    },
    // [Step 01]
    needUpdates(teacher) {
      // For Each course
      let countCoursesInital = 0;
      let countCoursesWhenRemoved = 0;
      for (var crNr in this.courses) {
        // if in OLD selected  course it's the name of TEACHER
        if (this.courses[crNr].teacherString == teacher.name) {
          countCoursesInital++;
          if (
            Object.values(this.coursesNameforSpecificTeacher).includes(
              this.courses[crNr].title
            )
          )
            countCoursesWhenRemoved++;
        }
      }
      // either it is ADD or REMOVED from list need modiffy
      if (
        countCoursesWhenRemoved != teacher.coursesNameArray.length ||
        countCoursesInital != teacher.coursesNameArray.length
      ) {
        this.modifyDb = true;
      }
    },

    // [Step 03]
    // Any Course linked to a teacher need to be removed from other teacher if it is attached
    updateTheRestOfCoursesWhoBelongToOtherTeachers(teacher) {
      for (var tchObserverLine in this.listOfTotalTeachers) {
        // teachers - one by one  -> this.listOfTotalTeachers
        if (this.listOfTotalTeachers[tchObserverLine].id != teacher.id) {
          // avoid a teacher line (NOT) modiffy (!=) into it
          for (var courseIndex in this.listOfTotalTeachers[tchObserverLine]
            .coursesNameArray) {
            // courses one by one in each teacher array line
            for (var q in this.coursesNameforSpecificTeacher) {
              // courses one by one into the teacher updated list
              if (
                this.listOfTotalTeachers[tchObserverLine].coursesNameArray[
                  courseIndex
                ] == this.coursesNameforSpecificTeacher[q]
              ) {
                // remove course from list for other teachers it there it is any
                this.listOfTotalTeachers[
                  tchObserverLine
                ].coursesNameArray.splice(courseIndex, 1);
              }
            }
          }
        }
      }
    },

    // [Step 04]
    updateLocalCousesDB() {
      if (this.modifyDb) {
        // Update coresponedent Teacher name into the LOCAL courses data base
        this.courses.forEach(doc => {
          // suppouse that no teacher teach any courses
          let oldTeacher = doc.teacherString;
          doc.teacherString = [];
          for (var tchObserverLine in this.listOfTotalTeachers) {
            for (var tchinLine in this.listOfTotalTeachers[tchObserverLine]
              .coursesNameArray) {
              if (
                doc.title ==
                this.listOfTotalTeachers[tchObserverLine].coursesNameArray[
                  tchinLine
                ]
              ) {
                doc.teacherString = this.listOfTotalTeachers[
                  tchObserverLine
                ].name;
              }
            }
          }
        });
      }
    },

    // [Step 05]
    dbUpdate() {
      // Update only any course it's added or removed
      if (this.modifyDb) {
        this.courses.forEach(course => {
          db
            .collection("courses")
            .doc(course.id)
            .update({
              teacherString: course.teacherString
            });
        });
      }
    },

    // [01_3]] Inside DROPBOX menu select element (class)
    // [01_3]] UPDATE here coursesNameforSpecificTeacher
    selectIdCourseLineClass(teacher, course) {
      // Dropbox - courses
      const teacherDropdownCourse = document
        .querySelector(".ClassId-" + teacher.id)
        .querySelector(".ClassId-" + course.id);

      // ADD - REMOVE a COURSE from current - Teacher list
      if (teacherDropdownCourse.checked == true) {
        // Add
        this.coursesNameforSpecificTeacher.push(course.title);

        //
      } else {
        // Remove the selected from the local db
        var index = this.coursesNameforSpecificTeacher.indexOf(course.title);
        if (index > -1) {
          this.coursesNameforSpecificTeacher.splice(index, 1);
        }
      }
    },
    iconClassId(strId, var2) {
      // Build Id class name
      let var1 = "ClassId-" + strId;
      if (var2 != "") {
        return [var1, var2];
      } else {
        return var1;
      }
    }
  },
  computed: {},
  created() {
    //fetch DATA from the firestore
    // [00_0] Import courses[id, teacherString, title,...]
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

    // [01_0] GET TOTAL teachers list with the attached corespondent courses from Teachers db and course db
    db
      .collection("teachersTotal")
      .orderBy("name")
      .get() //return a PROMISE
      .then(snapshot => {
        snapshot.forEach(doc => {
          let teacherName = doc.data();
          teacherName.id = doc.id;
          // Add for a speciffic teacher the corespondent courses
          let courseArray = [];
          this.courses.forEach(data => {
            if (data.teacherString == teacherName.name) {
              courseArray.push(data.title);
            } else {
            }
          });
          teacherName.coursesNameArray = courseArray;
          this.listOfTotalTeachers.push(teacherName);
        });
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iconHide {
  display: none;
}
.dropdown-container {
  position: relative;
}

.dropdown-menu {
  top: 100%; /* Bottom of button */
  left: 50%;
  min-width: 250px;
}
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
