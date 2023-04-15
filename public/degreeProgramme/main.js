const params = new URLSearchParams(window.location.search);

const degreeProgrammeID = params.get("id");

if (degreeProgrammeID === null) {
  window.location.replace("/");
}

window.addEventListener("load", async () => {
  try {
    const req = await fetch(`/api/degreeProgrammes?id=${degreeProgrammeID}`);

    if (req.status !== 200) {
      return;
    }

    const degreeProgramme = (await req.json())[0];

    if (!degreeProgramme) {
      window.location.replace("/");
    }

    const htmlNameElements = document.getElementsByClassName("useDegreeProgrammeName");

    document.title = `AMS - ${degreeProgramme.name}`;

    // selects all classes that want to show full name.
    for (const htmlNameElement of htmlNameElements) {
      if (htmlNameElement.tagName === "INPUT") {
        htmlNameElement.value = degreeProgramme.name;
        continue;
      }

      htmlNameElement.textContent = degreeProgramme.name;
    }

    const htmlLearningOutcomes = document.getElementById("learningOutcomes");
    htmlLearningOutcomes.value = degreeProgramme.learningOutcomes;

    const htmlDelDegreeProgramme = document.getElementById("delDegreeProgramme");
    htmlDelDegreeProgramme.innerText = `Delete '${degreeProgramme.name}' degree programme`;

    // TODO: Include modules and exit awards.
  } catch (e) {
    console.log(e);
  }
});
