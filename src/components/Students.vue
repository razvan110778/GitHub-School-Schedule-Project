<template>
  <div class="students">
    <div class="text-light text-sm-left m-3 p-2">
      <h4 class="py-2 h-text">
        <span class="text-primary font-weight-bolder">Students</span> with their
        assigned Courses
      </h4>
      <br />
    </div>
    <div class="index container">
      <table class="table text-primary container">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Students</th>
            <th scope="col">Courses</th>
            <th scope="col">Courses Name</th>
          </tr>
        </thead>
        <tbody>
          <!-- [00_1]  Line in table as as many total Students are avaialble-->
          <tr
            v-for="(student, index) in students"
            :key="student.id"
            :class="iconClassId(student.id, '')"
          >
            <th>{{ index + 1 }}</th>
            <td>
              {{ student.name }}
            </td>

            <td>
              <!-- <td class="d-flex align-self-sm-center"> -->
              {{ student.course.length }}
              <div class="iconCourses iconHide">
                <!--  -->
                <!-- [1_2], [1_3] -->
                <!-- Dropdown list Courses with teachers -->
                <div class="dropdown-container">
                  <button
                    data-toggle="dropdown"
                    data-display="static"
                    class="btn btn-sm btn-primary ml-2 dropdown-toggle"
                    type="button"
                    @keyup.esc="
                      actualCoursesNameforSpecificStudent(student),
                      needUpdates(student),
                      updateLocalCousesStudentsDB(),
                      dbupdate()
                    "
                    @click="
                      actualCoursesNameforSpecificStudent(student),
                      needUpdates(student),
                      updateLocalCousesStudentsDB(),
                      dbupdate()
                    "
                  ></button>
                  <ul class="dropdown-menu">
                    <li
                      v-for="(course, index) in courses"
                      :key="index"
                      class="list-group-item d-flex justify-content-between"
                    >
                      <div class="font-weight-lighter">
                        <span class="text-primary font-weight-bolder">{{
                          course.title
                        }}</span>
                        held by
                        <span class="text-primary font-weight-bolder">{{
                          course.teacherString
                        }}</span>
                      </div>

                      <!-- [1_4] Inside DROPBOX menu select element (class) -->
                      <!-- UPDATE HERE teacherNameforSpecificCourse-->
                      <input
                        type="checkbox"
                        v-bind:value="course.title"
                        v-model="coursesNameforSpecificStudent"
                        v-bind:class="iconClassId(course.id, '')"
                        @click="selectIdCourseLineClass(student, course)"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </td>
            <td>
              <div class="d-sm-inline-flex">
                {{ student.course.toString() }}
              </div>
            </td>

            <div class="p-1 align-self-start">
              <!-- [1_1] & [2_1] Toggle Edit Line -->
              <i
                class=" fas fa-edit d-inline-block mt-2 text-light"
                @click="toggleEditLine(student.id)"
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
  name: "Students",
  data() {
    return {
      courses: [],
      students: [],
      listOfTotalStudents: [],
      coursesNameforSpecificStudent: [],
      modifyDb: false
    };
  },
  methods: {
    // [Step 00]
    actualCoursesNameforSpecificStudent(student) {
      this.students.forEach(data => {
        if (data.id === student.id) {
          this.coursesNameforSpecificStudent = data.course;
        }
      });
    },
    // [Step 01]
    needUpdates(student) {
      // For Each course
      let countCoursesInital = 0;
      let countCoursesWhenRemoved = 0;
      for (var crNr in this.courses) {
        // if in OLD selected  course it's the name of student
        if (Object.values(this.courses[crNr].studentN).includes(student.name)) {
          // count actual courses who belong to a student
          countCoursesInital++;
          if (
            Object.values(this.coursesNameforSpecificStudent).includes(
              this.courses[crNr].title
            )
          )
            countCoursesWhenRemoved++;
        }
      }
      // either it is ADD or REMOVED from list need modiffy
      if (
        countCoursesWhenRemoved != student.course.length ||
        countCoursesInital != student.course.length
      ) {
        this.modifyDb = true;
      }
    },
    // [Step 02]
    updateLocalCousesStudentsDB() {
      if (this.modifyDb) {
        this.courses.forEach(doc => {
          // suppouse that no student attent any courses
          doc.studentN = [];
          for (var NrCrt in this.students) {
            for (var courseName in this.students[NrCrt].course) {
              if (doc.title == this.students[NrCrt].course[courseName]) {
                doc.studentN.push(this.students[NrCrt].name);
              }
            }
          }
        });
      }
    },
    // [Step 03] Update db
    dbupdate() {
      if (this.modifyDb) {
        this.courses.forEach(course => {
          db
            .collection("courses")
            .doc(course.id)
            .update({
              studentN: course.studentN
            });
        });
      }
    },

    // [01_3]] Inside DROPBOX menu select element (class)
    // [01_3]] UPDATE here coursesNameforSpecificStudent
    selectIdCourseLineClass(student, course) {
      var checkBox = document
        .querySelector(".ClassId-" + student.id)
        .querySelector(".ClassId-" + course.id);
      if (checkBox.checked == true) {
        this.coursesNameforSpecificStudent.push(course.title);
      } else {
        // REMOVE - DELETE a course Object from an Observer
        var index = this.coursesNameforSpecificStudent.indexOf(course.title);
        if (index > -1) {
          this.coursesNameforSpecificStudent.splice(index, 1);
        }
      }
    },

    toggleEditLine(id) {
      this.students.forEach(data => {
        // Courses
        const courseModifyIcon = document
          .querySelector(".ClassId-" + data.id)
          .querySelector(".iconCourses");

        if (data.id === id) {
          courseModifyIcon.style.display = "inline-block";
        } else {
          courseModifyIcon.style.display = "none";
        }
      });
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
        snapshot.forEach(doc => {
          let course = doc.data();
          course.id = doc.id;
          this.courses.push(course);
        });
      });
    // [01_0] GET TOTAL students list with the attended corespondent courses from Students db and course db
    db
      .collection("studentsTotal")
      .orderBy("name")
      .get() //return a PROMISE
      .then(snapshot => {
        snapshot.forEach(doc => {
          let student = doc.data();
          student.id = doc.id;
          // Add for a speciffic student course where he attempted with the teacher name (from courses db)
          let courseArray = [];
          let teacherArray = [];
          this.courses.forEach(data => {
            let Course = [];
            let Teacher = [];
            for (var st in data.studentN) {
              // check if student name from the entire database STUDENTS it attemting it any course
              if (student.name == data.studentN[st]) {
                Course = data.title;
                Teacher = data.teacherString;
                courseArray.push(Course);
                teacherArray.push(Teacher);
              }
            }
          });
          student.course = courseArray;
          student.teacher = teacherArray;
          this.students.push(student);
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
