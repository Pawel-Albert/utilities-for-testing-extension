(function () {
  const timeStampToLocaleDate = (timeStamp) => {
    return new Date(timeStamp).toLocaleDateString("pl-PL", {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "long",
    });
  };

  console.log(
    timeStampToLocaleDate(
      Number(
        prompt(
          "Enter timestamp(example: '1669852799') to print date in console",
          ""
        )
      )
    )
  );
})();
