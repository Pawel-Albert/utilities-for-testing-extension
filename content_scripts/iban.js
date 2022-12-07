import { setNativeValue } from "../utylis/helpers";
import { generateIban } from "./custom_generators_logic/iban_core";

(function () {
  let iban = generateIban();
  console.log(
    `%c Iban: ${iban}`,
    "font-family:monospace; color:DarkGreen;font-size:25px"
  );
  const indicatedElement = document.activeElement;

  setNativeValue(indicatedElement, iban);
  indicatedElement.dispatchEvent(new Event("input", { bubbles: true }));
})();
