import { setNativeValue } from "../utylis/helpers";
import { generatePesel, sex } from "./custom_generators_logic/pesel_core.js";

const formInputs = {
  ...(document.querySelector("input[name*=mail]") && {
    email: document.querySelector("input[name*=mail]"),
  }),
  ...(document.querySelector("input[name*=password]") && {
    password: document.querySelector("input[name*=password]"),
  }),
  ...(document.querySelector("input[name*=password]") && {
    repeatPassword: document.querySelector("input[name*=password]"),
  }),
  ...(document.querySelector("input[name*=mobile]") && {
    mobile: document.querySelector("input[name*=mobile]"),
  }),
  ...(document.querySelector("input[name*=promoCode]") && {
    promoCode: document.querySelector("input[name*=promoCode]"),
  }),
  ...(document.querySelector("input[name*=firstName]") && {
    firstName: document.querySelector("input[name*=firstName]"),
  }),
  ...(document.querySelector("input[name*=lastName]") && {
    lastName: document.querySelector("input[name*=lastName]"),
  }),
  ...(document.querySelector("input[name*=personal]") && {
    pesel: document.querySelector("input[name*=personal]"),
  }),
};

(function fillForm() {
  try {
    if (formInputs.email) {
      setNativeValue(formInputs.email, "jakismail@wp.pl");
      formInputs.email.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (formInputs.password) {
      setNativeValue(formInputs.password, "Poland1234");
      formInputs.password.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (formInputs.repeatPassword) {
      setNativeValue(formInputs.repeatPassword, "Poland1234");
      formInputs.repeatPassword.dispatchEvent(
        new Event("input", { bubbles: true })
      );
    }
    if (formInputs.mobile) {
      setNativeValue(formInputs.mobile, "254158958");
      formInputs.mobile.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (formInputs.promoCode) {
      setNativeValue(formInputs.promoCode, "promoCodeTest");
      formInputs.promoCode.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (formInputs.firstName) {
      setNativeValue(formInputs.firstName, "Stefan");
      formInputs.firstName.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (formInputs.lastName) {
      setNativeValue(formInputs.lastName, "Frankowski");
      formInputs.lastName.dispatchEvent(new Event("input", { bubbles: true }));
    }

    if (formInputs.pesel) {
      setNativeValue(formInputs.pesel, generatePesel(sex));
      formInputs.pesel.dispatchEvent(new Event("input", { bubbles: true }));
    }
    console.log(
      `%c Filled something for sure...but what?`,
      "font-family:monospace; color:pink;font-size:20px"
    );
  } catch (error) {
    console.log(error);
  }
})();
