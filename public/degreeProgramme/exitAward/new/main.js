const params = new URLSearchParams(window.location.search);

const degreeProgrammeID = params.get("degreeProgrammeID");

if (degreeProgrammeID === null) {
  window.location.replace("/");
}

async function updateBreadCrumbs() {
  try {
    const reqDegreeProgramme = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`);

    if (reqDegreeProgramme.status !== 200) {
      return;
    }

    const degreeProgramme = (await reqDegreeProgramme.json())[0];

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlA = document.getElementById("degreeProgrammeBreadCrumb");

    htmlA.href = `../../?id=${degreeProgrammeID}`;
    htmlA.innerText = degreeProgramme.name;
  } catch (e) {
    console.log(e);
    // TODO
  }
}

window.addEventListener("load", () => {
  updateBreadCrumbs();

  const formNewExitAward = document.getElementById("formNewExitAward");

  formNewExitAward.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    const newExitAward = {
      name
    };

    try {
      const reqPost = await fetch("/api/exitAwards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExitAward)
      });

      if (reqPost.status !== 201) {
        return;
      }

      const exitAward = await reqPost.json();

      const reqDegreeProgramme = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`)

      if (reqDegreeProgramme.status !== 200) {
        return;
      }

      const degreeProgramme = (await reqDegreeProgramme.json())[0];

      const updatedDegreeProgramme = {
        ...degreeProgramme,
        exitAwardIDs: [
          ...degreeProgramme.exitAwardIDs,
          exitAward.id
        ]
      }

      await fetch(`/api/degreeProgrammes/${degreeProgrammeID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedDegreeProgramme)
      });

      window.location.replace(`../../?id=${degreeProgrammeID}`);
    } catch (err) {
      e.preventDefault();
      alert("Failed to create new exit award.");
    }
  });
});
