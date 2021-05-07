// This constant is safe, it's just a string in base 64 that we will use below.
const messageToShow =
  "IyMjIyMjICAjIyMjIyMjIyAjIyMjIyMjIyAgIyMjIyMjIyMgICAgIyMjICAgICMjICAgICAjIyAjIyMjIyMjIyAjIyMjIyMjIyAgICAgIAojIyAgICAjIyAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgICAgIAojIyAgICAgICAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgICMjICAgIyMgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgICAgIAogIyMjIyMjICAgICAjIyAgICAjIyMjIyMjIyAgIyMjIyMjICAgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMgICAjIyMjIyMjIyAgICAgIAogICAgICAjIyAgICAjIyAgICAjIyAgICMjICAgIyMgICAgICAgIyMjIyMjIyMjICAjIyAgICMjICAjIyAgICAgICAjIyAgICMjICAgICAgIAojIyAgICAjIyAgICAjIyAgICAjIyAgICAjIyAgIyMgICAgICAgIyMgICAgICMjICAgIyMgIyMgICAjIyAgICAgICAjIyAgICAjIyAgIyMjIAogIyMjIyMjICAgICAjIyAgICAjIyAgICAgIyMgIyMjIyMjIyMgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAjIyAgICAgIyMgIyMj";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Once we receive a message from the popup
  if (request.msg) {
    // If message has the `action` key `print_in_console`
    if (request.msg.action === "print_in_console") {
      // print awesome text on console
      console.log(`%c ${atob(messageToShow)}`, "color:#38B549;");
    } else if (request.msg.action === "change_body_color") {
      // message contains different `action` key. This time it's a `change_body_color`.
      document.body.style.background = request.msg.value;
    }
  }
});