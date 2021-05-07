//(async () => {

$(document).off("cut copy paste", "**");
$(document).mouseover(function (e) {
  if (e && e.target.tagName === "A") {
    //   e.target.disabled = true;
    console.log(e.target.href)
    window.open({ url: encodeURI(e.target.href) });
    e.target.removeAttribute("href");
  } else {
    let currentElement = e.target
    while (currentElement && currentElement.parentElement) {
      let parentElement = currentElement.parentElement;
      if (parentElement.tagName === "A") {
        console.log(parentElement.href)
        window.open({ url: encodeURI(parentElement.href) });
        parentElement.removeAttribute("href");
        break;
      }
      currentElement = parentElement
    }
  }
})
//})