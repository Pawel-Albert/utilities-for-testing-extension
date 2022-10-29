function pesel() {
  //HELPERS
  const generateRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const addLeadingZeros = (intiger, numberOfZeros) =>
    (intiger + "").padStart(numberOfZeros, "0");

  const randomArrayElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const genDataOnElement = (fnName, el) => {
    el.innerHTML = typeof fnName === "string" ? fnName : fnName();
  };

  const getRandomKey = (object) => {
    const keys = Object.keys(object);
    return keys[Math.floor(Math.random() * keys.length)];
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  const sex = "both"; // Hardcoded - later when UI will be changed this will not be static value
  const leadingZeros = 3;
  // TODO : For learning purposes later implement few options on UI to let user pick age, exact date sex etc.

  const randomTimeStamp = () =>
    new Date() - generateRandomInt(568036800000, 3155760000000); // Placeholder - hardcoded value for age beetwen 18 and 100 years

  const timeStampToLocaleDate = (timeStamp) => {
    return new Date(timeStamp).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // First 6 digits are from birth date - no need for 19 and 22 century cases at they are not possible either way
  const getDatePartPesel = (date) => {
    const digitOneFromYear = date.slice(8, 9);
    const digitTwoFromYear = date.slice(9, 10);
    const milenialPartFromYear = date.slice(6, 8);

    const digitThreeFromYear =
      milenialPartFromYear == 20
        ? parseInt(date.slice(3, 4)) + 2
        : date.slice(3, 4);
    const digitFourFromYear = date.slice(4, 5);
    const digitFiveFromYear = date.slice(0, 1);
    const digitSixFromYear = date.slice(1, 2);
    return (
      digitOneFromYear +
      digitTwoFromYear +
      digitThreeFromYear +
      digitFourFromYear +
      digitFiveFromYear +
      digitSixFromYear
    );
  };

  const peselControlConstants = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];

  const controlDigit = (weights, string) => {
    const stringToArray = [...string];
    let controlSum = 0;
    for (let i = 0; i < stringToArray.length; i++) {
      controlSum += stringToArray[i] * weights[i];
    }
    const controlSumDigitValue = controlSum % 10;
    const controlDigitValue = 10 - controlSumDigitValue;
    return controlDigitValue == 10 ? "0" : controlDigitValue;
  };

  /////////////////////////////////
  const generatePesel = (sex) => {
    const timeStamp = randomTimeStamp();
    const datePart = getDatePartPesel(timeStampToLocaleDate(timeStamp));
    const randomPart = addLeadingZeros(generateRandomInt(0, 999), leadingZeros);
    const sexFieldPart =
      sex === "both"
        ? generateRandomInt(0, 9)
        : sex === "male"
        ? generateRandomInt(0, 4) * 2 + 1
        : generateRandomInt(0, 4) * 2;
    const controlDigitValue = controlDigit(
      peselControlConstants,
      datePart + randomPart + sexFieldPart
    );
    return datePart + randomPart + sexFieldPart + controlDigitValue;
  };
  console.log(`Pesel ${generatePesel(sex)}`);
  document.activeElement.value = generatePesel(sex);
}

pesel();
