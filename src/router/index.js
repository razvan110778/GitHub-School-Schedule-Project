import Vue from "vue";
import Router from "vue-router";
// import HelloWorld from "@/components/HelloWorld";
import Home from "@/components/Home";
import Courses from "@/components/Courses";
import Teachers from "@/components/Teachers";
import Students from "@/components/Students";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/courses",
      name: "Courses",
      component: Courses
    },
    {
      path: "/teachers",
      name: "Teachers",
      component: Teachers
    },
    {
      path: "/students",
      name: "Students",
      component: Students
    }
  ]
});
