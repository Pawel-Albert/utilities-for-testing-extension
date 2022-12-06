(function () {
  let tags = document.getElementsByTagName("*");
  console.log(`click`);
  let noneTags = [];
  if (noneTags.length === 0) {
    for (const tag of tags) {
      if (tag.style.display == "none") {
        noneTags = [...noneTags, tag];
      }
    }
  }

  let singleTag = noneTags[0];

  if (singleTag.style.display == "none") {
    singleTag.style.display = "block";
    singleTag.style = singleTag.style + "; border:7px dashed #ae0000;";
  } else {
    console.log(
      `%c No more hidden elements`,
      "font-family:monospace; color:DarkGreen;font-size:25px"
    );
  }
})();
