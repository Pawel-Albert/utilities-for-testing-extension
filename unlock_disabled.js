(function () {
  const tagi = document.getElementsByTagName("*");
  for (const tag of tagi) {
    tag.removeAttribute("disabled");
  }
  console.log(`Unlocked`);
})();
