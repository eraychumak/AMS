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

  htmlOption(selected) {
    const htmlOption = document.createElement("option");
    const htmlTxt = document.createTextNode(this.name);

    htmlOption.selected = selected;
    htmlOption.value = this.id;
    htmlOption.appendChild(htmlTxt);

    return htmlOption;
  }
}
