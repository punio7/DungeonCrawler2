import { Game } from '../InitGameData';
import { CharacterList } from '../model/CharacterList';
import { ItemList } from '../model/ItemList';
import { Room } from '../model/Room';
import { RoomExit } from '../model/RoomExit';
import { RoomExitsList } from '../model/RoomExitsList';
import { RoomData } from '../data/RoomData';
import { RoomDoor } from '../model/RoomDoor';
import { Data } from '../data/Data';

export class RoomFactory {
    spawnRoom(template: RoomData) {
        let room = new Room();
        room.Id = template.Id;
        return room;
    }

    loadFromData(room: Room) {
        const template = Data.RoomTemplates.getTemplate(room.Id);
        let exitsModel = new RoomExitsList();
        template.Exits?.forEach((exit) => {
            let direction = exit.Direction;
            let roomExit = new RoomExit();
            roomExit.RoomId = exit.RoomId;
            roomExit.IsHidden = exit.isHidden;
            if (exit.Door !== undefined) {
                let door = (roomExit.Door = new RoomDoor());
                door.IsLocked = exit.Door.IsLocked;
                door.IsClosed = exit.Door.IsClosed;
                door.KeyId = exit.Door.KeyId;

                if (door.IsLocked === undefined && door.KeyId !== undefined) {
                    door.IsLocked = true;
                    door.IsClosed = true;
                }
            }
            exitsModel[direction] = roomExit;
        });
        room.Exits = exitsModel;

        room.Items = Game.ItemFactory.loadListFromTemplate(template.Items);

        if (template.Characters !== undefined) {
            let charactersModel = new CharacterList();
            template.Characters.forEach((characterId) => {
                charactersModel.add(Game.spawnCharacter(characterId));
            });
            room.Characters = charactersModel;
        }
    }
}
