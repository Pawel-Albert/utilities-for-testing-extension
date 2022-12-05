import {
  generateRandomInt,
  addLeadingZeros,
  getRandomKey,
} from "../utylis/helpers";

function passport() {
  ////////////////////////////////////////////////////////////////////////////////////////
  //PASSPORT_NUMBER_CONFIG
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
  const numberOfLeters = 2; // Proper PASSPORT contains 3 letters at the beginning

  const leadingZeros = 6;
  ////////////////////////////////////////////////////////////////////////////////////////
  //PASSSPORT_NUMBER
  ////////////////////////////////////////////////////////////////////////////////////////
  const generatePassportNumber = () => {
    let randomTwoLeters = [];
    for (let i = 1; i <= numberOfLeters; i++) {
      randomTwoLeters = [
        ...randomTwoLeters,
        getRandomKey(letersToIntigiersMap),
      ];
    }
    const passportNumberRandomPart = addLeadingZeros(
      generateRandomInt(0, 999999),
      leadingZeros
    );
    const controlDigit =
      (7 * letersToIntigiersMap[randomTwoLeters[0]] +
        3 * letersToIntigiersMap[randomTwoLeters[1]] +
        1 * passportNumberRandomPart[0] +
        7 * passportNumberRandomPart[1] +
        3 * passportNumberRandomPart[2] +
        1 * passportNumberRandomPart[3] +
        7 * passportNumberRandomPart[4] +
        3 * passportNumberRandomPart[5]) %
      controlSumDevider;
    return (
      randomTwoLeters.join("") + controlDigit + passportNumberRandomPart + ""
    );
  };

  console.log(`passport_number : ${generatePassportNumber()}`);
  document.activeElement.value = generatePassportNumber();
}
passport();
