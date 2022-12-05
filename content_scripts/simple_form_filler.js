import { setNativeValue } from "../utylis/helpers";

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
};

(function fillForm() {
  try {
    console.log(`dsfdsf`);
    if (formInputs.email) {
      setNativeValue(formInputs.email, "jakismail@wp.pl");
      formInputs.email.dispatchEvent(new Event("input", { bubbles: true }));
      console.log(`sfsdfsdfdsfsd`);
    }
    // if (formInputs.password) {
    //   formInputs.password.value = "Poland1234";
    // }
    // if (formInputs.repeatPassword) {
    //   formInputs.repeatPassword.value = "Poland1234";
    // }
    // if (formInputs.mobile) {
    //   formInputs.mobile.value = "254158958";
    // }
    // if (formInputs.promoCode) {
    //   formInputs.promoCode.value = "promoCodeTest";
    // }
    // if (formInputs.firstName) {
    //   formInputs.firstName.value = "PiPI";
    // }
    // if (formInputs.lastName) {
    //   formInputs.lastName.value = "PiPi";
    // }
  } catch (error) {
    console.log(error);
  }
})();
console.log(`sdfdsfdsfsd`);
