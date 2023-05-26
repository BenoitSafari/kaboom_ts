import dungeonScene from "./dungeon/dungeonScene";
import gameloose from "./game/gameloose";

export const initScenes = () => {
    gameloose();
    dungeonScene();
};
