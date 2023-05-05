import { Assessment } from "./Assessment.js";
import { DegreeProgramme } from "./DegreeProgramme.js";
import { TimeSlot } from "./TimeSlot.js";

/**
 * Provides an interface for interacting with modules in the database.
 */
export class Mod {
  /**
   * Init
   * @param {Number} id - the unique identifier for the module.
   * @param {String} name - name of the module.
   * @param {Number} hours - amount of hours for the module.
   * @param {Array<String>} learningOutcomes list of learning outcomes belonging to the module.
   * @param {Number} credits - amount of credits for the module.
   * @param {Array<Number>} assessmentIDs - list of assessment ids belonging to the module.
   */
  constructor(id, name, hours, learningOutcomes, credits, assessmentIDs) {
    this.id = id;
    this.name = name;
    this.hours = hours;
    this.learningOutcomes = learningOutcomes;
    this.credits = credits;
    this.assessmentIDs = assessmentIDs;
  }

  /**
   * Gets all modules from the database.
   * @returns {Promise<Array<Mod>>} - list of modules
   */
  static getAll() {
    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/modules");

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawModules = await req.json();
        const modules = [];

        for (let x = 0; x < rawModules.length; x++) {
          const rawModule = rawModules[x];

          modules.push(
            new Mod(
              rawModule.id,
              rawModule.name,
              rawModule.hours,
              rawModule.learningOutcomes,
              rawModule.credits,
              rawModule.assessmentIDs
            )
          );
        }

        return res(modules);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Get module by ID from the database.
   * @returns {Promise<Mod>} - module
   */
  static get(ID) {
    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/modules?id=${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawModule = (await req.json())[0];

        return res(new Mod(
          rawModule.id,
          rawModule.name,
          rawModule.hours,
          rawModule.learningOutcomes,
          rawModule.credits,
          rawModule.assessmentIDs
        ));
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Create module in the database.
   * @param {String} name - name of the module.
   * @param {Number} hours - amount of hours for the module.
   * @param {Array<String>} learningOutcomes list of learning outcomes belonging to the module.
   * @param {Number} credits - amount of credits for the module.
   * @param {Array<Number>} assessmentIDs - list of assessment ids belonging to the module.
   * @return {Promise<Boolean>} - status of creation.
   */
  static create(name, hours, learningOutcomes, credits, assessmentIDs, degreeProgrammeID) {
    console.log(`[Module] create`);

    const newModule = {
      name,
      hours,
      learningOutcomes,
      credits,
      assessmentIDs
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/modules`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newModule)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new module"
          });
        }

        const rawModule = await req.json();

        const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);
        await degreeProgramme.addModule(rawModule.id);

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Add assessment to module in the database.
   * @param {Number} assessmentID - the unique identifier of the assessment.
   * @returns {Promise<Boolean>} - status of update
   */
  addAssessment(assessmentID) {
    console.log(`[Module] [${this.name}] addAssessment:`, assessmentID);

    return new Promise(async (res, rej) => {
      try {
        const updateStatus = await this.update(
          this.name,
          this.hours,
          this.learningOutcomes,
          this.credits,
          this.assessmentIDs.concat(assessmentID)
        );

        return res(updateStatus);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Remove assessment from module in the database.
   * @param {Number} ID - the unique identifier of the assessment.
   * @returns {Promise<Boolean>} - status of update
   */
  removeAssessment(ID) {
    console.log(`[Module] [${this.name}] removeAssessment:`, assessmentID);

    return new Promise(async (res, rej) => {
      try {
        const updateStatus = await this.update(
          this.name,
          this.hours,
          this.learningOutcomes,
          this.credits,
          this.assessmentIDs.filter(assessmentID => assessmentID !== ID)
        );

        return res(updateStatus);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Update module in the database.
   * @param {String} name - name of the module.
   * @param {Number} hours - amount of hours for the module.
   * @param {Array<String>} learningOutcomes list of learning outcomes belonging to the module.
   * @param {Number} credits - amount of credits for the module.
   * @param {Array<Number>} assessmentIDs - list of assessment ids belonging to the module.
   * @returns {Promise<Boolean>} - status of update.
   */
  update(name, hours, learningOutcomes, credits, assessmentIDs) {
    console.log(`[Module] create`);

    const updatedModule = {
      name,
      hours,
      learningOutcomes,
      credits,
      assessmentIDs
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/modules/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedModule)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update module"
          });
        }

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Delete module from database.
   * @returns {Promise<Boolean>} - status of success
   */
  delete() {
    console.log(`[Module] [${this.name}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/modules/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the module"
          });
        }

        const degreeProgrammes = await DegreeProgramme.getAll({
          moduleIDs_like: this.id
        });

        degreeProgrammes.forEach(async (degreeProgramme) => {
          await degreeProgramme.removeModule(this.id);
        });

        const timeslots = await TimeSlot.getAll({
          moduleID: this.id
        });

        timeslots.forEach(async (timeslot) => {
          await timeslot.delete();
        });

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Calculate total weight of assessments in this module.
   * @param {Array<Assessment>} assessments - list of assessments belonging to this module.
   * @returns {Array} - percentage in text form and float form.
   */
  getTotalAssessmentsWeight(assessments) {
    const moduleAssessments = assessments.filter(assessment => this.assessmentIDs.includes(assessment.id));
    return Assessment.calcTotalWeights(moduleAssessments);
  }

  /**
   * A HTML checkbox container for the module.
   * @param {Boolean} [checked=false] - mark checkbox as checked, false by default.
   * @returns {HTMLDivElement}
   */
  htmlCheckbox(checked = false) {
    const htmlID = "module-" + this.id;

    const htmlDiv = document.createElement("div");
    const htmlInput = document.createElement("input");
    const htmlLabel = document.createElement("label");
    const htmlLabelText = document.createTextNode(this.name);

    htmlDiv.classList.add("checkboxField");

    htmlInput.type = "checkbox";
    htmlInput.id = htmlID;
    htmlInput.name = htmlID;
    htmlInput.checked = checked;

    htmlLabel.htmlFor = htmlID;
    htmlLabel.appendChild(htmlLabelText);

    htmlDiv.appendChild(htmlInput);
    htmlDiv.appendChild(htmlLabel);

    return htmlDiv;
  }
}
