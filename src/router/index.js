import Vue from "vue";
import VueRouter from "vue-router";

import Singin from "@/components/Console/singin.vue";
import Console from "@/components/Console/Console.vue";
import LogRegister from "@/components/Console/LogRegister.vue";
import IconManagement from "@/components/Console/IconManagement.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Singin",
    component: Singin
  },
  {
    path: "/Console",
    name: "Console",
    component: Console,
    children: [
      {
        path: "/",
        component: LogRegister
      },
      {
        path: "/IconManagement",
        component: IconManagement
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
