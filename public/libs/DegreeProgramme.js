/**
 * Provides an interface for interacting with degree programmes in the database.
 */
export class DegreeProgramme {
  /**
   * Init
   * @param {Number} id - the unique identifier for the degree programme.
   * @param {String} name - name of the degree programme.
   * @param {Array<String>} learningOutcomes list of learning outcomes belonging to the degree programme.
   * @param {Array<Number>} moduleIDs - list of module ids belonging to the degree programme.
   * @param {Array<Number>} exitAwardIDs - list of exit award ids belonging to the degree programme.
   */
  constructor(id, name, learningOutcomes, moduleIDs, exitAwardIDs) {
    this.id = id;
    this.name = name;
    this.learningOutcomes = learningOutcomes;
    this.moduleIDs = moduleIDs;
    this.exitAwardIDs = exitAwardIDs;
  }

  /**
   * Gets all degree programmes from the database.
   * @param {Object|undefined} where - apply json-server url filters
   * @returns {Promise<Array<DegreeProgramme>>} - list of exit awards
   */
  static getAll(where) {
    console.log("[Degree Programme] getAll:", where);

    return new Promise(async (res, rej) => {
      try {
        let path;

        if (where) {
          let query = [];

          for (const param in where) {
            const val = where[param];
            query.push(`${param}=${val}`);
          }

          path = `/api/degreeProgrammes?${query.join("&")}`;
        } else {
          path = "/api/degreeProgrammes";
        }

        const req = await fetch(path);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawDegreeProgrammes = await req.json();
        const degreeProgrammes = [];

        for (let x = 0; x < rawDegreeProgrammes.length; x++) {
          const rawDegreeProgramme = rawDegreeProgrammes[x];

          degreeProgrammes.push(
            new DegreeProgramme(
              rawDegreeProgramme.id,
              rawDegreeProgramme.name,
              rawDegreeProgramme.learningOutcomes,
              rawDegreeProgramme.moduleIDs,
              rawDegreeProgramme.exitAwardIDs,
            )
          );
        }

        return res(degreeProgrammes);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Get degree programme by ID from the database.
   * @param {Number} ID - the unique identifier of the degree programme.
   * @returns {Promise<DegreeProgramme>} - a degree programme.
   */
  static get(ID) {
    console.log(`[Degree Programme] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/degreeProgrammes?id=${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const degreeProgramme = (await req.json())[0];

        if (!degreeProgramme) {
          return rej({
            err: true,
            msg: "Could not find degree programme by that ID."
          })
        }

        return res(new DegreeProgramme(
          degreeProgramme.id,
          degreeProgramme.name,
          degreeProgramme.learningOutcomes,
          degreeProgramme.moduleIDs,
          degreeProgramme.exitAwardIDs
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
   * Create new degree programme in the database.
   * @param {String} name - name of the degree programme.
   * @param {Array<String>} learningOutcomes - learning outcomes.
   * @param {Array<Number>} moduleIDs - module ids.
   * @param {Array<Number>} exitAwardIDs - exit award ids.
   * @returns {Promise<DegreeProgramme>} - the new degree programme from database.
   */
  static create(name, learningOutcomes, moduleIDs, exitAwardIDs) {
    console.log(`[Degree Programme] [${this.name}] create`);

    const newDegreeProgramme = {
      name,
      learningOutcomes,
      moduleIDs,
      exitAwardIDs
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/degreeProgrammes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newDegreeProgramme)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new degree programme"
          });
        }

        const rawDegreeProgramme = await req.json();

        const degreeProgramme = new DegreeProgramme(
          rawDegreeProgramme.id,
          rawDegreeProgramme.name,
          rawDegreeProgramme.learningOutcomes,
          rawDegreeProgramme.moduleIDs,
          rawDegreeProgramme.exitAwardIDs,
        );

        return res(degreeProgramme);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        });
      }
    });
  }

  /**
   * Add module to degree programme in the database.
   * @param {Number} moduleID - the unique identifier of the module.
   * @returns {Promise<Boolean>} - status of update
   */
  addModule(moduleID) {
    console.log(`[Degree Programme] [${this.name}] addModule:`, moduleID);

    return new Promise(async (res, rej) => {
      try {
        const updateStatus = await this.update(
          this.name,
          this.learningOutcomes,
          this.moduleIDs.concat(moduleID),
          this.exitAwardIDs
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
   * Remove module from degree programme in the database.
   * @param {Number} moduleID - the unique identifier of the module.
   * @returns {Promise<Boolean>} - status of update
   */
  removeModule(moduleID) {
    console.log(`[Degree Programme] [${this.name}] removeModule:`, moduleID);

    return new Promise(async (res, rej) => {
      try {
        const newModuleIDs = this.moduleIDs.filter(mod => {
          return mod !== moduleID
        });

        const updateStatus = await this.update(
          this.name,
          this.learningOutcomes,
          newModuleIDs,
          this.exitAwardIDs,
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
   * Add exit award to degree programme in the database.
   * @param {Number} exitAwardID - the unique identifier of the exit award.
   * @returns {Promise<Boolean>} - status of update
   */
  addExitAward(exitAwardID) {
    console.log(`[Degree Programme] [${this.name}] addExitAward:`, exitAwardID);

    return new Promise(async (res, rej) => {
      try {
        const updateStatus = await this.update(
          this.name,
          this.learningOutcomes,
          this.moduleIDs,
          this.exitAwardIDs.concat(exitAwardID)
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
   * Remove exit award from degree programme in the database.
   * @param {Number} exitAwardID - the unique identifier of the exit award.
   * @returns {Promise<Boolean>} - status of update
   */
  removeExitAward(exitAwardID) {
    console.log(`[Degree Programme] [${this.name}] removeExitAward:`, exitAwardID);

    return new Promise(async (res, rej) => {
      try {
        const newExitAwardIDs = this.exitAwardIDs.filter(exitAward => {
          return exitAward !== exitAwardID
        });

        const updateStatus = await this.update(
          this.name,
          this.learningOutcomes,
          this.moduleIDs,
          newExitAwardIDs
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
   * Update the degree programme in the database.
   * @param {String} name - updated name of the degree programme.
   * @param {Array<String>} learningOutcomes - updated learning outcomes.
   * @param {Array<Number>} moduleIDs - updated module ids.
   * @param {Array<Number>} exitAwardIDs - updated exit award ids.
   * @returns {Promise<Boolean>} - the status of update.
   */
  update(name, learningOutcomes, moduleIDs, exitAwardIDs) {
    console.log(`[Degree Programme] [${this.name}] update:`, name, learningOutcomes, moduleIDs, exitAwardIDs);

    const updatedDegreeProgramme = {
      name,
      learningOutcomes,
      moduleIDs,
      exitAwardIDs
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/degreeProgrammes/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedDegreeProgramme)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update degree programme"
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
   * Delete degree programme from database.
   * @returns {Promise<Boolean>} - status of success
   */
  delete() {
    console.log(`[Degree Programme] [${this.name}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/degreeProgrammes/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the degree programme"
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
}
