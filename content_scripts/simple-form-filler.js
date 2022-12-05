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

function clearForm() {
  try {
    if (formInputs.email) {
      formInputs.email.setAttribute("value", " ");
    }
    if (formInputs.password) {
      formInputs.password.setAttribute("value", " ");
    }
    if (formInputs.repeatPassword) {
      formInputs.repeatPassword.setAttribute("value", " ");
    }
    if (formInputs.mobile) {
      formInputs.mobile.setAttribute("value", " ");
    }
    if (formInputs.promoCode) {
      formInputs.promoCode.setAttribute("value", " ");
    }
    if (formInputs.firstName) {
      formInputs.firstName.setAttribute("value", " ");
    }
    if (formInputs.lastName) {
      formInputs.lastName.setAttribute("value", " ");
    }
  } catch (error) {
    console.log(error);
  }
}

function fillForm() {
  try {
    if (formInputs.email) {
      formInputs.email.value = "jakismail@wp.pl";
    }
    if (formInputs.password) {
      formInputs.password.value = "Poland1234";
    }
    if (formInputs.repeatPassword) {
      formInputs.repeatPassword.value = "Poland1234";
    }
    if (formInputs.mobile) {
      formInputs.mobile.value = "254158958";
    }
    if (formInputs.promoCode) {
      formInputs.promoCode.value = "promoCodeTest";
    }
    if (formInputs.firstName) {
      formInputs.firstName.value = "PiPI";
    }
    if (formInputs.lastName) {
      formInputs.lastName.value = "PiPi";
    }
  } catch (error) {
    console.log(error);
  }
}
clearForm();

fillForm();

// function clearForm(atribute) {
//   try {
//     formInputs.email.setAttribute(atribute, " ");
//     formInputs.password.setAttribute(atribute, " ");
//     formInputs.repeatPassword.setAttribute(atribute, " ");
//     formInputs.mobile.setAttribute(atribute, " ");
//     formInputs.promoCode.setAttribute(atribute, " ");
//   } catch (error) {
//     console.log(error);
//   }
// }
// let nomm = `${Math.random()}`;
// function fillForm() {
//   try {
//     formInputs.email.value = nomm;
//     formInputs.password.value = nomm;
//     formInputs.repeatPassword.value = nomm;
//     formInputs.mobile.value = nomm;
//     formInputs.promoCode.value = nomm;
//   } catch (error) {
//     console.log(error);
//   }
// }
// clearForm("value");

// fillForm();
