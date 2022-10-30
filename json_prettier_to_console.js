console.log(
  JSON.stringify(
    JSON.parse(prompt("Enter JSON to make it pretty in console", "")),
    null,
    2
  )
);
