try {
  console.log(
    btoa(
      prompt(
        "Enter String to be encoded(Base64) and printed in to the console",
        ""
      )
    )
  );
} catch (error) {
  alert(`You messed up this time - try again`);
  console.log(error);
}
