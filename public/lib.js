function htmlSecondaryBtn(label, href = "#") {
  const a = document.createElement("a");
  const txt = document.createTextNode(label);

  a.appendChild(txt);
  a.classList.add("secondaryBtn");
  a.href = href;

  return a;
}

/**
 * Update HTML elements using a dedicated class name that want to use a specific value from an object.
 * @param {String} hookName - HTML element dedicated class name.
 * @param {String} value - the object value.
 */
function updateHTMLHooks(hookName, value) {
  const htmlNameElements = document.getElementsByClassName(hookName);

  // selects all classes that want to use specified value.
  for (const htmlNameElement of htmlNameElements) {
    if (htmlNameElement.tagName === "INPUT") {
      htmlNameElement.value = value;
      continue;
    }

    htmlNameElement.textContent = value;
  }
}
