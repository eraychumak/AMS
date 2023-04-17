function htmlSecondaryBtn(label, href = "#") {
  const a = document.createElement("a");
  const txt = document.createTextNode(label);

  a.appendChild(txt);
  a.classList.add("secondaryBtn");
  a.href = href;

  return a;
}
