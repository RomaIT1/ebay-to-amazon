import Controller from "../classes/Controller";
import Util from "chromane/js/Util.js";
(async function () {
  window.util = new Util();
  window.controller = new Controller();
  window.controller.init();
})();
