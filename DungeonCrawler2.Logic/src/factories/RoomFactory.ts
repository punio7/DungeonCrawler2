import { Game } from '../InitGameData';
import { CharacterList } from '../model/CharacterList';
import { ItemList } from '../model/ItemList';
import { Room } from '../model/Room';
import { RoomExit } from '../model/RoomExit';
import { RoomExitsList } from '../model/RoomExitsList';
import { RoomTemplate } from '../templates/RoomTemplate';
import { RoomDoor } from '../model/RoomDoor';
import { GameData } from '../model/GameData';

export class RoomFactory {
    spawnRoom(template: RoomTemplate) {
        let room = new Room();
        room.Id = template.Id;
        return room;
    }

    loadFromData(room: Room) {
        const template = GameData.RoomTemplates.getTemplate(room.Id);
        let exitsModel = new RoomExitsList();
        template.Exits?.forEach((exit) => {
            let direction = exit.Direction;
            let roomExit = new RoomExit(exit);
            if (exit.Door !== undefined) {
                roomExit.Door = new RoomDoor(exit.Door);
            }
            exitsModel[direction] = roomExit;
        });
        room.Exits = exitsModel;

        let items = new ItemList();
        items.loadFromTemplate(template.Items);
        room.Items = items;

        if (template.Characters !== undefined) {
            let charactersModel = new CharacterList();
            template.Characters.forEach((characterId) => {
                charactersModel.add(Game.spawnCharacter(characterId));
            });
            room.Characters = charactersModel;
        }
    }
}
