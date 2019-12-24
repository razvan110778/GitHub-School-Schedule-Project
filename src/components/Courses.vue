<template>
  <div class="courses">
    <div class="text-light text-sm-left m-3 p-2">
      <h4 class="py-2 h-text">
        <span class="text-primary font-weight-bolder">Courses</span> with their
        assigned Teacher and Students
      </h4>

      <br />
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
          <tr
            v-for="(course, index) in courses"
            :key="index"
            :class="iconClassId(course.id, '')"
          >
            <th>{{ index + 1 }}</th>
            <td>{{ course.title }}</td>

            <td>
              <div class="d-sm-inline-flex">
                {{ course.teacherString }}
                <div class="iconTeachers iconHide ">
                  <!-- Dropdown list Teachers -->
                  <!-- [1_2] Get Teacher Name who lead the ACTUAL course -->
                  <!-- [1_3] Update Database with NEW actualStudentsNameForSpecificCourse -->
                  <div class="dropdown-container">
                    <button
                      data-toggle="dropdown"
                      data-display="static"
                      class="btn btn-sm btn-primary ml-2 dropdown-toggle"
                      type="button"
                      @keyup.esc="
                        actualCourseTeacherNameList(course.id),
                          dbUpdateTeacherList(course.id)
                      "
                      @click="
                        actualCourseTeacherNameList(course.id),
                          dbUpdateTeacherList(course.id)
                      "
                    ></button>
                    <ul class="dropdown-menu">
                      <li
                        v-for="(teacherName, index) in orderedTeachers"
                        :key="index"
                        class="list-group-item d-flex justify-content-between"
                      >
                        {{ teacherName.name }}

                        <!-- [1_4] - Inside DROPBOX menu select element -->
                        <!-- UPDATE HERE teacherNameforSpecificCourse-->
                        <input
                          type="radio"
                          v-bind:value="teacherName.name"
                          v-model="teacherNameforSpecificCourse"
                          v-bind:class="iconClassId(teacherName.id, '')"
                          @click="selectIdTeacherLineClass(course, teacherName)"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>

            <td>
              <!--  -->
              {{ course.studentN.length }}
              <div class="iconStudents iconHide ">
                <!-- Dropdown list Students -->
                <!-- [2_2], [2_3] -->
                <div class="dropdown-container">
                  <button
                    data-toggle="dropdown"
                    data-display="static"
                    class="btn btn-sm btn-primary ml-2 dropdown-toggle"
                    type="button"
                    @keyup.esc="
                      actualCourseStudentNameList(course.id),
                        dbUpdateStudentsList(course.id)
                    "
                    @click="
                      actualCourseStudentNameList(course.id),
                        dbUpdateStudentsList(course.id)
                    "
                  ></button>
                  <ul class="dropdown-menu">
                    <li
                      v-for="(studentName, index) in orderedStudents"
                      :key="index"
                      class="list-group-item d-flex justify-content-between"
                    >
                      {{ studentName.name }}
                      <!-- UPDATE HERE studentsNameforSpecificCourse -->
                      <input
                        type="checkbox"
                        v-bind:value="studentName.name"
                        v-model="studentsNameforSpecificCourse"
                        v-bind:class="iconClassId(studentName.id, '')"
                        @click="selectIdStudentLineClass(course, studentName)"
                      />
                    </li>
                  </ul>
                </div>
                <!--  -->
              </div>
            </td>
            <div class="p-1 align-self-start">
              <!-- modiffy Table line Atributes (NONE -- IN LINE BLOCK)  -->
              <!-- [1_1] & [2_1] Toggle Edit Line -->
              <i
                class=" fas fa-edit d-inline-block mt-2 text-light"
                @click="toggleEditLine(course.id)"
              ></i>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
export default {
  name: "Courses",
  data() {
    return {
      courses: [],
      orderedTeachers: [],
      orderedStudents: [],
      studentsNameforSpecificCourse: [], // all students in real time
      teacherNameforSpecificCourse: []
    };
  },
  methods: {
    // STUDENTS State Flow Process
    //
    // [1_1] & [2_1]  Toggle Edit Line
    toggleEditLine(id) {
      this.courses.forEach(data => {
        // Teachers
        const teacherModifyIcon = document
          .querySelector(".ClassId-" + data.id)
          .querySelector(".iconTeachers");

        // Students
        const studentsModifyIcon = document
          .querySelector(".ClassId-" + data.id)
          .querySelector(".iconStudents");
        if (data.id === id) {
          // Show (activate) iccon with inline right selectror
          studentsModifyIcon.style.display = "inline-block";
          teacherModifyIcon.style.display = "inline-block";
        } else {
          // Hide (deactivate)  the rest of the iccons
          studentsModifyIcon.style.display = "none";
          teacherModifyIcon.style.display = "none";
        }
      });
    },
    // [1_2] Get Teacher Name who lead the ACTUAL course
    actualCourseTeacherNameList(id) {
      // this.courses.forEach(data => {
      this.courses.forEach(data => {
        if (data.id === id) {
          this.teacherNameforSpecificCourse = data.teacherString;
        }
      });
    },
    // [1_3] - Update Database with NEW actualTeacherNameForSpecificCourse
    // only when EXIT from FROM  DROPDOWN
    // RADIO Button
    dbUpdateTeacherList(id) {
      // Actual Database Teacher --> list
      db
        .collection("courses")
        .doc(id)
        .get() //return a PROMISE
        .then(doc => {
          // Database id -> studentN
          let teacher = doc.data().teacherString;
          if (this.teacherNameforSpecificCourse != teacher) {
            // Update Database
            db
              .collection("courses")
              .doc(id)
              .update({
                teacherString: this.teacherNameforSpecificCourse
              })
              .then(() => {
                // can redirect for other page or display a message
              })
              .catch(err => {
                console.log(err);
              });
            // End Update DataBase
          }
        });
      //
    },
    // [1_4] Inside DROPBOX menu select element (class)
    // teacherNameforSpecificCourse HERE !!!!
    selectIdTeacherLineClass(course, teacher) {
      //
      var checkBox = document
        .querySelector(".ClassId-" + course.id)
        .querySelector(".ClassId-" + teacher.id);

      if (checkBox.checked == true) {
        this.teacherNameforSpecificCourse = teacher.name;
      }

      this.courses.forEach(data => {
        if (data.id === course.id) {
          data.teacherString = this.teacherNameforSpecificCourse;
        }
      });
    },

    // STUDENTS State Flow Process
    //
    // [2_2] Get Total Students who attended to ACTUAL course  ->
    actualCourseStudentNameList(id) {
      this.courses.forEach(data => {
        if (data.id === id) {
          // Put into temporary student list the students ARRAY who are related with a speciffic course
          this.studentsNameforSpecificCourse = data.studentN;
        }
      });
    },
    // [2_3] - Update Database with NEW actualStudentsNameForSpecificCourse
    // CHECKBOX Button
    dbUpdateStudentsList(id) {
      // Actual Database studentN --> list

      db
        .collection("courses")
        .doc(id)
        .get() //return a PROMISE
        .then(doc => {
          // Database id -> studentN
          let idstudentN = doc.data().studentN;
          if (
            JSON.stringify(
              JSON.parse(JSON.stringify(this.studentsNameforSpecificCourse))
            ) != JSON.stringify(idstudentN)
          ) {
            // Update StudentsN
            // Update Database
            db
              .collection("courses")
              .doc(id)
              .update({
                studentN: this.studentsNameforSpecificCourse
              })
              .then(() => {
                //
              })
              .catch(err => {
                console.log(err);
              });
            // End Update DataBase
          }
        });
    },
    // [2_4]
    // UPDATE here studentsNameforSpecificCourse
    selectIdStudentLineClass(course, student) {
      var checkBox = document
        .querySelector(".ClassId-" + course.id)
        .querySelector(".ClassId-" + student.id);

      // If the checkbox is checked
      if (checkBox.checked == true) {
        //Update studentsNameforSpecificCourse
        // Add a NEW student in the list
        this.studentsNameforSpecificCourse.push(student.name);
      } else {
        // REMOVE - DELETE a student Object from an Observer
        var index = this.studentsNameforSpecificCourse.indexOf(student.name);
        if (index > -1) {
          this.studentsNameforSpecificCourse.splice(index, 1);
        }
      }
    },
    // Build class realted with db id elements
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
    //
    // [1_0] - GET and SORT teachers from Teachers db
    db
      .collection("teachersTotal")
      .orderBy("name")
      .get() //return a PROMISE
      .then(snapshot => {
        snapshot.forEach(doc => {
          let teacherName = doc.data();
          teacherName.id = doc.id;
          this.orderedTeachers.push(teacherName);
        });
      });

    // [2_0] GET Student from Students db
    db
      .collection("studentsTotal")
      .orderBy("name")
      .get() //return a PROMISE
      .then(snapshot => {
        snapshot.forEach(doc => {
          let studentName = doc.data();
          studentName.id = doc.id;
          this.orderedStudents.push(studentName);
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
