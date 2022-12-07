import {
  generateRandomInt,
  addLeadingZeros,
  getRandomKey,
} from "../../utylis/helpers";

////////////////////////////////////////////////////////////////////////////////////////
//ID_NUMBER_CONFIG
////////////////////////////////////////////////////////////////////////////////////////
const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const values = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  29, 30, 31, 32, 33, 34, 35,
];
const createObjectTwoArrays = (keys, values) => {
  return Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]));
};
const letersToIntigiersMap = createObjectTwoArrays(keys, values);

const controlSumDevider = 10;
const numberOfLeters = 3; // Proper Id contains 3 letters at the beginning

const leadingZeros = 5;
////////////////////////////////////////////////////////////////////////////////////////
//ID_NUMBER
////////////////////////////////////////////////////////////////////////////////////////
export const generateIdNumber = () => {
  let randomThreeLeters = [];
  for (let i = 1; i <= numberOfLeters; i++) {
    randomThreeLeters = [
      ...randomThreeLeters,
      getRandomKey(letersToIntigiersMap),
    ];
  }
  const idNumberRandomPart = addLeadingZeros(
    generateRandomInt(0, 99999),
    leadingZeros
  );
  const controlDigit =
    (7 * letersToIntigiersMap[randomThreeLeters[0]] +
      3 * letersToIntigiersMap[randomThreeLeters[1]] +
      1 * letersToIntigiersMap[randomThreeLeters[2]] +
      7 * idNumberRandomPart[0] +
      3 * idNumberRandomPart[1] +
      1 * idNumberRandomPart[2] +
      7 * idNumberRandomPart[3] +
      3 * idNumberRandomPart[4]) %
    controlSumDevider;
  return randomThreeLeters.join("") + controlDigit + idNumberRandomPart + "";
};
