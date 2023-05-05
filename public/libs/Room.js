import { TimeSlot } from "./TimeSlot.js";

/**
 * Provides an interface for interacting with rooms in the database.
 */
export class Room {
  /**
   * Init
   * @param {Number} id - the unique identifier for the room.
   * @param {String} name - the name of the room.
   * @param {String} location - the location of the room.
   */
  constructor(id, name, location) {
    this.id = id;
    this.name = name;
    this.location = location;
  }

  /**
   * Gets all rooms from the database.
   * @returns {Promise<Array<Room>>} - list of rooms.
   */
  static getAll() {
    console.log("[Room] getAll");

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/rooms");

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawRooms = await req.json();
        const rooms = [];

        for (let x = 0; x < rawRooms.length; x++) {
          const rawRoom = rawRooms[x];

          rooms.push(
            new Room(
              rawRoom.id,
              rawRoom.name,
              rawRoom.location
            )
          );
        }

        return res(rooms);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Gets room by ID from the database.
   * @returns {Promise<Room>} - room.
   */
  static get(ID) {
    console.log(`[Room] [${ID}] get`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/rooms?id=${ID}`);

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to fetch"
          });
        }

        const rawRoom = (await req.json())[0];

        return res(
          new Room(
            rawRoom.id,
            rawRoom.name,
            rawRoom.location
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
   * Create new room in the database.
   * @param {String} name - the name of the room.
   * @param {String} location - the location of the room.
   * @returns {Promise<Boolean>} - status of creation.
   */
  static create(name, location) {
    console.log(`[Room] [${name}] create`);

    const newRoom = {
      name,
      location
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch("/api/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newRoom)
        });

        if (req.status !== 201) {
          return rej({
            err: true,
            msg: "Failed to create new room"
          });
        }

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Update room in the database.
   * @param {String} name - the name of the room.
   * @param {String} location - the location of the room.
   * @returns {Promise<Boolean>} - status of creation.
   */
  update(name, location) {
    console.log(`[Room] [${this.id}] update`);

    const updatedRoom = {
      name,
      location
    };

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/rooms/${this.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedRoom)
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to update the room"
          });
        }

        return res(true);
      } catch (e) {
        return rej({
          err: true,
          msg: e
        })
      }
    });
  }

  /**
   * Delete room from database.
   * @returns {Promise<Boolean>} - status of deletion.
   */
  delete() {
    console.log(`[Room] [${this.id}] delete`);

    return new Promise(async (res, rej) => {
      try {
        const req = await fetch(`/api/rooms/${this.id}`, {
          method: "DELETE"
        });

        if (req.status !== 200) {
          return rej({
            err: true,
            msg: "Failed to delete the academic year"
          });
        }

        const timeslots = await TimeSlot.getAll({
          roomID: this.id
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

  htmlOption(selected) {
    const htmlOption = document.createElement("option");
    const htmlTxt = document.createTextNode(this.name);

    htmlOption.selected = selected;
    htmlOption.value = this.id;
    htmlOption.appendChild(htmlTxt);

    return htmlOption;
  }
}
