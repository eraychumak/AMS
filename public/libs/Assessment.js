import { Mod } from "./Module.js";

/**
 * Provides an interface for interacting with assessments in the database.
 */
export class Assessment {
  /**
   * Init
   * @param {Number} id - the unique identifier for the assessment.
   * @param {String} title - title of the assessment.
   * @param {Number} number - number of the assessment.
   * @param {Array<String>} learningOutcomes list of learning outcomes belonging to the assessment.
   * @param {Number} volume - volume of the assessment.
   * @param {Float} weight - weight of the assessment.
   * @param {Array<Number>} submissionDateIDs - list of submission date ids belonging to the assessment.
   */
  constructor(id, title, number, learningOutcomes, volume, weight, submissionDateIDs) {
    this.id = id;
    this.title = title;
    this.number = number;
    this.learningOutcomes = learningOutcomes;
    this.volume = volume;
    this.weight = weight;
    this.submissionDateIDs = submissionDateIDs
  }

  /**
   * Gets all assessments from the database.
   * @param {Object|undefined} where - apply json-server url filters
   * @returns {Promise<Array<Assessment>>} - list of assessments
   */
  static getAll(where) {
    console.log("[Assessment] getAll");

    return new Promise(async (res, rej) => {
      try {
        let path;

        if (where) {
          let query = [];

          for (const param in where) {
            const val = where[param];
            query.push(`${param}=${val}`);
          }

          path = `/api/assessments?${query.join("&")}`;
        } else {
          path = "/api/assessments";
        }

        const req = await fetch(path);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawAssessments = await req.json();
        const assessments = [];

        for (let x = 0; x < rawAssessments.length; x++) {
          const rawAssessment = rawAssessments[x];

          assessments.push(
            new Assessment(
              rawAssessment.id,
              rawAssessment.title,
              rawAssessment.number,
              rawAssessment.learningOutcomes,
              rawAssessment.volume,
              rawAssessment.weight,
              rawAssessment.submissionDateIDs,
            )
          );
        }

        return res(assessments);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Gets assessment by ID from the database.
   * @returns {Promise<Assessment>} - assessment
   */
  static get(ID) {
    console.log(`[Assessment] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/assessments/${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawAssessment = await req.json();

        return res(
          new Assessment(
            rawAssessment.id,
            rawAssessment.title,
            rawAssessment.number,
            rawAssessment.learningOutcomes,
            rawAssessment.volume,
            rawAssessment.weight,
            rawAssessment.submissionDateIDs,
          )
        );
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Create assessment in the database.
   * @param {String} title - title of the assessment.
   * @param {Number} number - number of the assessment.
   * @param {Array<String>} learningOutcomes list of learning outcomes belonging to the assessment.
   * @param {Number} volume - volume of the assessment.
   * @param {Float} weight - weight of the assessment.
   * @param {Array<Number>} submissionDateIDs - list of submission date ids belonging to the assessment.
   * @param {Number} moduleID - the unique identifier of the module the assessment is assigned to.
   * @returns {Promise<Assessment>} - the new assessment from database.
   */
  static create(title, number, learningOutcomes, volume, weight, submissionDateIDs, moduleID) {
    console.log(`[Assessment] create`);

    const newAssessment = {
      title,
      number,
      learningOutcomes,
      volume,
      weight,
      submissionDateIDs
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/assessments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newAssessment)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new assessment"
          });
        }

        const rawAssessment = await req.json();

        const rawModule = await Mod.get(moduleID);
        await rawModule.addAssessment(rawAssessment.id);

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
   * Update assessment in the database.
   * @param {String} title - title of the assessment.
   * @param {Number} number - number of the assessment.
   * @param {Array<String>} learningOutcomes list of learning outcomes belonging to the assessment.
   * @param {Number} volume - volume of the assessment.
   * @param {Float} weight - weight of the assessment.
   * @param {Array<Number>} submissionDateIDs - list of submission date ids belonging to the assessment.
   * @param {Number} moduleID - the unique identifier of the module the assessment is assigned to.
   * @returns {Promise<Boolean>} - the new assessment from database.
   */
  update(title, number, learningOutcomes, volume, weight, submissionDateIDs) {
    console.log(`[Assessment] [${this.title}] update`);

    const updateAssessment = {
      title,
      number,
      learningOutcomes,
      volume,
      weight,
      submissionDateIDs
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/assessments/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updateAssessment)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update assessment"
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
   * Add submission date to assessment in the database.
   * @param {Number} submissionDateID - the unique identifier of the submission date.
   * @returns {Promise<Boolean>} - status of update
   */
  addSubmissionDate(submissionDateID) {
    console.log(`[Module] [${this.name}] addSubmissionDate:`, submissionDateID);

    return new Promise(async (res, rej) => {
      try {
        const updateStatus = await this.update(
          this.title,
          this.number,
          this.learningOutcomes,
          this.volume,
          this.weight,
          this.submissionDateIDs.concat(submissionDateID)
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
   * Remove submission date from assessment in the database.
   * @param {Number} ID - the unique identifier of the submission date.
   * @returns {Promise<Boolean>} - status of update
   */
  removeSubmissionDate(ID) {
    console.log(`[Module] [${this.name}] removeSubmissionDate:`, ID);

    return new Promise(async (res, rej) => {
      try {
        const updateStatus = await this.update(
          this.title,
          this.number,
          this.learningOutcomes,
          this.volume,
          this.weight,
          this.submissionDateIDs.filter(submissionDateID => submissionDateID !== ID)
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
   * Delete assessment from database.
   * @returns {Promise<Boolean>} - status of success
   */
  delete() {
    console.log(`[Assessment] [${this.title}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/assessments/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the assessment"
          });
        }

        const modules = await Mod.getAll({
          assessmentIDs_like: this.id
        });

        modules.forEach(async (mod) => {
          await mod.removeAssessment(this.id);
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
   * Transforms percentage from decimal to text form with a unit.
   * @param {Float} weight - percentage in decimal form.
   * @returns {String} - percentage in text form
   */
  static textPercent(weight) {
    return Math.round(weight * 100) + "%";
  }

  /**
   * Calculates total assessment weights
   * @param {Array<Assessment>} assessments - list of assessments.
   * @returns {Array} - percentage in text form and float form.
   */
  static calcTotalWeights(assessments) {
    let totalWeight = 0;

    assessments.forEach(assessment => {
      totalWeight += assessment.weight;
    });

    return totalWeight = [this.textPercent(totalWeight), totalWeight];
  }

  /**
   * A HTML checkbox container for the assessment.
   * @param {Boolean} [checked=false] - mark checkbox as checked, false by default.
   * @returns {HTMLDivElement}
   */
  htmlCheckbox(checked = false) {
    const htmlDiv = document.createElement("div");
    const htmlInput = document.createElement("input");
    const htmlLabel = document.createElement("label");
    const htmlLabelText = document.createTextNode(`CIS${this.number} - ${this.title} - ${Assessment.textPercent(this.weight)}`);

    htmlDiv.classList.add("checkboxField");

    htmlInput.type = "checkbox";
    htmlInput.id = this.id;
    htmlInput.dataset.assessementWeight = this.weight;
    htmlInput.name = this.id;
    htmlInput.checked = checked;

    htmlLabel.htmlFor = this.id;
    htmlLabel.appendChild(htmlLabelText);

    htmlDiv.appendChild(htmlInput);
    htmlDiv.appendChild(htmlLabel);

    return htmlDiv;
  }
}
