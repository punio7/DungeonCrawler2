import { Game } from '../InitGameData';
import { CharacterList } from '../model/CharacterList';
import { ItemList } from '../model/ItemList';
import { Room } from '../model/Room';
import { RoomExit } from '../model/RoomExit';
import { RoomExitsList } from '../model/RoomExitsList';
import { RoomTemplate } from '../templates/RoomTemplate';

export class RoomFactory {
    SpawnRoom(template: RoomTemplate) {
        let room = new Room();
        Object.assign(room, template);
        return room;
    }

    LoadRoomData(room: Room, template: RoomTemplate) {
        let exitsModel = new RoomExitsList();
        template.Exits?.forEach((exit) => {
            let direction = exit.Direction;
            exitsModel[direction] = new RoomExit(exit);
        });
        room.Exits = exitsModel;

        let items = new ItemList();
        items.loadFromTemplate(room.Items);
        room.Items = items;

        if (template.Characters !== undefined) {
            let charactersModel = new CharacterList();
            template.Characters.forEach((characterId) => {
                charactersModel.add(Game.SpawnCharacter(characterId));
            });
            room.Characters = charactersModel;
        }

        room.IsLoaded = true;
    }
}
