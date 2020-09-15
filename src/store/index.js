import Vue from "vue";
import Vuex from "vuex";
import icon from "./modules/icon.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    icon
  }
});
