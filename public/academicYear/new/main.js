window.addEventListener("load", () => {
  const formNewAcademicYear = document.getElementById("formNewAcademicYear");

  formNewAcademicYear.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    const newAcademicYear = {
      name
    };

    try {
      await fetch("/api/academicYears/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAcademicYear)
      });

      window.location.replace("/");
    } catch (e) {
      alert("Failed to create new academic year.");
    }
  });
});
