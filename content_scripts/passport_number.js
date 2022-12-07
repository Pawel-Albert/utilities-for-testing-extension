import { setNativeValue } from "../utylis/helpers";
import { generatePassportNumber } from "./custom_generators_logic/idnumber_core";

(function () {
  let passportNumber = generatePassportNumber();
  console.log(
    `%c Passport num: ${passportNumber}`,
    "font-family:monospace; color:DarkGreen;font-size:25px"
  );
  const indicatedElement = document.activeElement;

  setNativeValue(indicatedElement, passportNumber);
  indicatedElement.dispatchEvent(new Event("input", { bubbles: true }));
})();
