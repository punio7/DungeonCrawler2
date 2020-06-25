"use strict";

class RoomFactory {
    SpawnRoom(template) {
        let room = new Room();
        Object.assign(room, template);
        return room;
    }

    LoadRoomData(room) {
        let exitsModel = {};
        room.Exits.forEach(exit => {
            let direction = exit.Direction;
            exitsModel[direction] = new RoomExit(exit);
        });
        room.Exits = exitsModel;

        let items = new ItemList();
        items.LoadFromTemplate(room.Items);
        room.Items = items;

        if (room.Characters !== undefined) {
            let charactersModel = new CharacterList();
            room.Characters.forEach(characterId => {
                charactersModel.add(Game.SpawnCharacter(characterId));
            });
            room.Characters = charactersModel;
        }

        room.IsLoaded = true;
    }
}
