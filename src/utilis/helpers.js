//HELPERS
export const generateRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const addLeadingZeros = (intiger, numberOfZeros) =>
  (intiger + "").padStart(numberOfZeros, "0");

export const randomArrayElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const genDataOnElement = (fnName, el) => {
  el.innerHTML = typeof fnName === "string" ? fnName : fnName();
};

export const getRandomKey = (object) => {
  const keys = Object.keys(object);
  return keys[Math.floor(Math.random() * keys.length)];
};

export const setNativeValue = (el, insertedValue) => {
  const { set: valueSetter } =
    Object.getOwnPropertyDescriptor(el, "value") || {};
  const prototype = Object.getPrototypeOf(el);
  const { set: prototypeValueSetter } =
    Object.getOwnPropertyDescriptor(prototype, "value") || {};

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(el, insertedValue);
  } else if (valueSetter) {
    valueSetter.call(el, insertedValue);
  } else {
    throw new Error("Provided element doesn't have a value setter");
  }
};

export const generateRandomBirthDate = (minAge = 18, maxAge = 100) => {
  const today = new Date()

  const maxBirthDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDay()    
  )

  const minBirthDate = new Date(
    today.getFullYear() - maxAge,
    today.getMonth(),
    today.getDate()
  )

  const getRandomTimestamp = minBirthDate.getTime() + Math.random() * (maxBirthDate.getTime() - minBirthDate.getTime())
  const randomBirthDate = new Date(getRandomTimestamp)
  return randomBirthDate.toISOString().split('T')[0]
}
