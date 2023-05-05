import { DegreeProgramme } from "./DegreeProgramme.js";

/**
 * Provides an interface for interacting with exit awards in the database
 */
export class ExitAward {
  /**
   * Init
   * @param {Number} id - the unique identifier number of the exit award.
   * @param {String} name - name of the exit award.
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * Gets all exit awards from the database.
   * @returns {Promise<Array<ExitAward>>} - list of exit awards.
   */
  static getAll() {
    console.log(`[Exit Award] getAll`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/exitAwards");

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawExitAwards = await req.json();
        const exitAwards = [];

        for (let x = 0; x < rawExitAwards.length; x++) {
          const rawExitAward = rawExitAwards[x];

          exitAwards.push(
            new ExitAward(rawExitAward.id, rawExitAward.name)
          );
        }

        return res(exitAwards);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Get exit award by ID from the database.
   * @param {Number} ID - the unique identifier of the degree programme.
   * @returns {Promise<ExitAward>} - a exit award.
   */
  static get(ID) {
    console.log(`[Exit Award] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/exitAwards?id=${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const exitAward = (await req.json())[0];

        if (!exitAward) {
          return rej({
            err: true,
            msg: "Could not find exit award by that ID."
          })
        }

        return res(new ExitAward(
          exitAward.id,
          exitAward.name
        ));
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Delete exit award from database.
   * @returns {Promise<Boolean>} - status of success
   */
  delete() {
    console.log(`[Exit Award] [${this.name}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/exitAwards/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the exit award"
          });
        }

        const filters = {
          exitAwardIDs_like: this.id
        };

        const degreeProgrammes = await DegreeProgramme.getAll(filters);

        degreeProgrammes.forEach(async (degreeProgramme) => {
          await degreeProgramme.removeExitAward(this.id);
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
   * Create new exit award in the database.
   * @param {String} name - name of the degree programme.
   * @param {Number} degreeProgrammeID - the associated degree programme ID.
   * @returns {Promise<DegreeProgramme>} - the new degree programme from database.
   */
  static create(name, degreeProgrammeID) {
    console.log(`[Exit Award] create`);

    const newExitAward = {
      name
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/exitAwards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newExitAward)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new exit award"
          });
        }

        const rawExitAward = await req.json();

        const degreeProgramme = await DegreeProgramme.get(degreeProgrammeID);
        await degreeProgramme.addExitAward(rawExitAward.id);

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
   * Update the exit award in the database.
   * @param {String} name - updated name of the degree programme.
   * @returns {Promise<Boolean>} - the status of update.
   */
  update(name) {
    console.log(`[Exit Award] [${this.name}] update:`, name);

    const updatedExitAward = {
      name
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/exitAwards/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedExitAward)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update exit award"
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
   * A HTML checkbox container for the exit award.
   * @param {Boolean} [checked=false] - mark checkbox as checked, false by default.
   * @returns {HTMLDivElement}
   */
  htmlCheckbox(checked = false) {
    const htmlDiv = document.createElement("div");
    const htmlInput = document.createElement("input");
    const htmlLabel = document.createElement("label");
    const htmlLabelText = document.createTextNode(this.name);

    htmlDiv.classList.add("checkboxField");

    htmlInput.type = "checkbox";
    htmlInput.id = "exitAward-" + this.id;
    htmlInput.name = "exitAward-" + this.id;
    htmlInput.checked = checked;

    htmlLabel.htmlFor = "exitAward-" + this.id;
    htmlLabel.appendChild(htmlLabelText);

    htmlDiv.appendChild(htmlInput);
    htmlDiv.appendChild(htmlLabel);

    return htmlDiv;
  }
}
