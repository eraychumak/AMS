import { DegreeProgramme } from "/libs/DegreeProgramme.js";
import { ExitAward } from "/libs/ExitAward.js";

const params = new URLSearchParams(window.location.search);

const degreeProgrammeID = params.get("degreeProgrammeID");

if (degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    alert(e.msg);
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();

  // ? CREATE NEW EXIT AWARD LOGIC - START
  const formNewExitAward = document.getElementById("formNewExitAward");

  formNewExitAward.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    try {
      const createStatus = await ExitAward.create(name, degreeProgrammeID);

      if (createStatus) {
        window.location.replace(`../../?id=${degreeProgrammeID}`);
      }
    } catch (e) {
      alert(e.msg);
    }
  });
  // ? CREATE NEW EXIT AWARD LOGIC - END
});
