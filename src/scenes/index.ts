import dungeonScene from "./dungeon/dungeonScene.js";
import gameloose from "./game/gameloose.js";

export const initScenes = () => {
    gameloose();
    dungeonScene();
};
