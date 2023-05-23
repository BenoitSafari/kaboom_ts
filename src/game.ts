import initKaboom from "kaboom";
import { kaboomCfg } from "./config/kaboomCfg.js";
import { loadGameSprites } from "./config/loader";
import { initScenes } from "./scenes/index";

initKaboom(kaboomCfg);
loadGameSprites();
initScenes();

go("dungeon", { level: 0, score: 0, numBombs: 0, numKeys: 0 });
