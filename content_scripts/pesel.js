import { generatePesel, sex } from "./generators_logic/pesel_core.js";
import { setNativeValue } from "../utylis/helpers.js";

(function () {
  let pesel = generatePesel(sex);
  console.log(
    `%c Pesel ${pesel}`,
    "font-family:monospace; color:DarkGreen;font-size:25px"
  );
  const indicatedElement = document.activeElement;

  setNativeValue(indicatedElement, pesel);
  indicatedElement.dispatchEvent(new Event("input", { bubbles: true })); // In placess(sites) that this functionality is used, allows user to trigger events recognized by front to treat  this as valid user action
})();
