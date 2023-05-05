import { DegreeProgramme } from "../../libs/DegreeProgramme.js";
import { ExitAward } from "../../libs/ExitAward.js";

const params = new URLSearchParams(window.location.search);

const exitAwardID = params.get("id");
const degreeProgrammeID = params.get("degreeProgrammeID");

if (exitAwardID === null || degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);

    if (!degreeProgramme) {
      window.location.replace("/");
      return;
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../?id=${degreeProgramme.id}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    alert(e.msg);
    window.location.replace("/");
  }
}

window.addEventListener("load", async () => {
  updateBreadCrumbs();

  try {
    const exitAward = await ExitAward.get(exitAwardID);

    if (!exitAward) {
      window.location.replace("/");
    }

    document.title = `AMS - ${exitAward.name}`;
    updateHTMLHooks("useExitAwardName", exitAward.name);

    // ? DELETE EXIT AWARD LOGIC - START
    const htmlDelExitAward = document.getElementById("delExitAward");
    htmlDelExitAward.innerText = `Delete '${exitAward.name}' exit award`;

    htmlDelExitAward.addEventListener("click", async (e) => {
      e.preventDefault();
      const msg = window.prompt("Type 'Delete' to confirm.");

      if (msg.toLocaleLowerCase() !== "delete") {
        alert("The exit award was not deleted because you did not enter the confirmation text correctly.");
        return;
      }

      try {
        const delStatus = await exitAward.delete();

        if (delStatus) {
          window.location.replace(`../?id=${degreeProgrammeID}`);
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? DELETE EXIT AWARD LOGIC - END

    // ? UPDATE EXIT AWARD LOGIC - START
    const formUpdateExitAward = document.getElementById("formUpdateExitAward");

    formUpdateExitAward.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;

      try {
        const updateStatus = exitAward.update(name);

        if (updateStatus) {
          window.location.reload();
        }
      } catch (e) {
        alert(e.msg);
      }
    });
    // ? UPDATE EXIT AWARD LOGIC - END
  } catch (e) {
    alert(e.msg);
  }
});
