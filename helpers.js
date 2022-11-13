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
