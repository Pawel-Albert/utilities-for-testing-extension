(function () {
  const tagi = document.getElementsByTagName("*");

  for (const tag of tagi) {
    if (tag.style.display == "none") {
      tag.style.display = "block";
      tag.style = tag.style + "; border:7px dashed #ae0000;";
    }
  }
})();
