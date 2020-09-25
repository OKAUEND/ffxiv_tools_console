import Vue from "vue";
import Vuex from "vuex";
import icon from "./modules/icon.js";
import log from "./modules/log.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    icon,
    log
  }
});
