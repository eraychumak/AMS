window.addEventListener("load", () => {
  const formNewAcademic = document.getElementById("formNewAcademic");

  formNewAcademic.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;

    if (fullName.split(" ").length === 1) {
      alert("Seems like you only entered a first name, please enter your full name.");
      return;
    }

    const newAcademic = {
      fullName
    };

    try {
      await fetch("/api/academics/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAcademic)
      });

      window.location.replace("/");
    } catch (e) {
      alert("Failed to create new academic.");
    }
  });
});
