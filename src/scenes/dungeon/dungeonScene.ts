import type { Vec2 } from "kaboom";
import { MOVE_SPEED, SKELETOR_SPEED, SLICER_SPEED, SNAKE_SPEED } from "../../config/contants";
import { buildUI } from "../../services/gameUIService";
import { dungeonConfig, dungeonMaps } from "./dungeonMaps";

export default () => {
    scene("dungeon", ({ level, score, numBombs, numKeys }) => {
        const { scoreLabel, keysLabel, bombsLabel } = buildUI({ score, level, numKeys, numBombs });

        layers(["bg", "obj", "ui"], "obj");
        addLevel(dungeonMaps[level], dungeonConfig);
        add([sprite("bg"), layer("bg")]);

        const player = add([
            sprite("sheet", { frame: 14 }), //
            pos(30, 60),
            area(),
            solid(),
            { dir: vec2(1, 0) },
        ]);

        onKeyDown("left", () => {
            player.frame = 15;
            player.move(-MOVE_SPEED, 0);
            player.dir = vec2(-1, 0);
        });

        onKeyDown("right", () => {
            player.frame = 14;
            player.move(MOVE_SPEED, 0);
            player.dir = vec2(1, 0);
        });

        onKeyDown("up", () => {
            player.frame = 13;
            player.move(0, -MOVE_SPEED);
            player.dir = vec2(0, -1);
        });

        onKeyDown("down", () => {
            player.frame = 12;
            player.move(0, MOVE_SPEED);
            player.dir = vec2(0, 1);
        });

        // Attacks

        let attacking = false;
        let attackDir;

        function attack() {
            const playerPos = player.pos;

            const swordFrames = add([
                sprite("sword-sheet", { frame: 0 }),
                "sword",
                pos(playerPos),
                area(),
            ]);

            attacking = true;

            if (player.frame === 13) {
                attackDir = vec2(0, -1);
                swordFrames.frame = 0;
                swordFrames.pos.y -= 12;
            } else if (player.frame === 12) {
                attackDir = vec2(0, 1);
                swordFrames.frame = 1;
                swordFrames.pos.y += 12;
            } else if (player.frame === 15) {
                attackDir = vec2(-1, 0);
                swordFrames.frame = 2;
                swordFrames.pos.x -= 12;
            } else if (player.frame === 14) {
                attackDir = vec2(1, 0);
                swordFrames.frame = 3;
                swordFrames.pos.x += 12;
            }

            wait(0.2, () => {
                attacking = false;
                if (player.frame === 13) {
                    player.frame = 13; // Go back to frame 13 (player look up)
                } else if (player.frame === 12) {
                    player.frame = 12; // Go back to frame 12 (player look down)
                } else {
                    player.frame = player.dir.x === 1 ? 14 : 15;
                }
            });

            wait(0.2, () => {
                destroy(swordFrames);
            });
        }

        onKeyPress("space", () => {
            // bind to the space key
            if (!attacking) {
                // only attack if not already attacking
                attack();
            }
        });

        function dropBomb(dropTarget: Vec2) {
            const bomb = add([sprite("bomb"), pos(player.pos), area(), "bomb"]);

            wait(2, () => {
                destroy(bomb);
                explodeBomb(dropTarget);
            });
            removeBomb();
        }

        onKeyPress("b", () => {
            if (numBombs >= 1) {
                dropBomb(player.pos.add(player.dir.scale(12)));
            }
        });

        function explodeBomb(b: Vec2) {
            const explosionPos = player.pos;

            // Spawn explosion sprite
            const explosion = add([sprite("boom"), pos(explosionPos), area()]);

            // Destroy the bomb and the explosion sprite after a certain time
            wait(1, () => destroy(explosion));

            // Destroy the bombable-block if it collides with the explosion
            explosion.onCollide("bombable-block", e => {
                // destroy(b);
                e.use(sprite("hole"));
            });
        }

        function spawnFire(p: Vec2) {
            const obj = add([sprite("boom"), pos(p), area(), "boom"]);
            wait(1, () => {
                destroy(obj);
            });
        }

        onKeyPress("z", () => {
            spawnFire(player.pos.add(player.dir.scale(12)));
        });

        // Items functions

        function addKey() {
            numKeys++;
            keysLabel.text = "Keys : " + numKeys;
        }

        function addBomb() {
            numBombs++;
            bombsLabel.text = "Bombs : " + numBombs;
        }

        function removeKey() {
            numKeys--;
            keysLabel.text = "Keys : " + numKeys;
        }

        function removeBomb() {
            numBombs--;
            bombsLabel.text = "Bombs : " + numBombs;
        }

        // Enemies

        onUpdate("slicer", s => {
            s.move(s.dir * SLICER_SPEED, 0);
        });

        onCollide("slicer", "wall", s => {
            s.dir = -s.dir;
        });

        onUpdate("snake", s => {
            s.move(s.dir * SNAKE_SPEED, 0);
        });

        onCollide("snake", "wall", s => {
            s.dir = -s.dir;
        });

        onUpdate("skeleton", s => {
            s.move(0, s.dir * SKELETOR_SPEED);
            s.timer -= dt();
            if (s.timer <= 0) {
                s.dir = -s.dir;
                s.timer = rand(5);
            }
        });

        /*
  ------------------
  COLLISIONS
  ------------------
  */

        // Open door

        player.onCollide("locked-door1", l => {
            if (numKeys > 0) {
                l.use(sprite("door-open")),
                    removeKey(),
                    go("game", {
                        level: 2, // go level 2
                        score: scoreLabel.value,
                        numBombs: numBombs,
                        numKeys: numKeys,
                    });
            } else {
                // Player doesn't have the key to open the doom
                // Add a logic here to display a message or do another action
                const textObject = add([
                    pos(20, 180),
                    text("The door is locked. Find a key.", {
                        size: 12, // 12 pixels tall
                        width: 150, // it'll wrap to next line when width exceeds this value
                        font: "sinko", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
                    }),
                ]);
                wait(1, () => {
                    destroy(textObject);
                });
            }
        });

        // Old Man

        player.onCollide("oldman", () => {
            const textObject = add([
                pos(20, 180),
                text("Hahah, wrong way son ! Have you found a bomb ?", {
                    size: 12, // 12 pixels tall
                    width: 150, // it'll wrap to next line when width exceeds this value
                    font: "sinko", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
                }),
            ]);

            wait(1, () => {
                destroy(textObject);
            });
        });

        // Change level

        player.onCollide("next-level", () => {
            go("game", {
                level: level + 1,
                score: scoreLabel.value,
                numBombs: numBombs,
                numKeys: numKeys,
            });
        });

        player.onCollide("go-locked-room", () => {
            go("game", {
                level: level + 2,
                score: scoreLabel.value,
                numBombs: numBombs,
                numKeys: numKeys,
            });
            removeKey();
        });

        player.onCollide("room4", () => {
            go("game", {
                level: level + 3,
                score: scoreLabel.value,
                numBombs: numBombs,
                numKeys: numKeys,
            });
        });

        player.onCollide("previous-level", () => {
            go("game", {
                level: level - 1,
                score: scoreLabel.value,
                numBombs: numBombs,
                numKeys: numKeys,
            });
        });

        player.onCollide("back-main-level", () => {
            go("game", {
                level: level - 2,
                score: scoreLabel.value,
                numBombs: numBombs,
                numKeys: numKeys,
            });
        });

        // Picking items
        player.onCollide("bomb", b => {
            addBomb();
            destroy(b);
        });

        player.onCollide("key", k => {
            addKey();
            destroy(k);
        });
        // Destroy enemies
        onCollide("boom", "skeleton", (b, s) => {
            wait(1, () => {
                destroy(b);
            });
            destroy(s);
            scoreLabel.value++;
            scoreLabel.text = String(scoreLabel.value);
        });

        onCollide("sword", "skeleton", (w, s) => {
            wait(1, () => {
                destroy(w);
            });
            destroy(s);
            scoreLabel.value++;
            scoreLabel.text = String(scoreLabel.value);
        });

        onCollide("boom", "snake", (b, s) => {
            wait(1, () => {
                destroy(b);
            });
            destroy(s);
            scoreLabel.value++;
            scoreLabel.text = String(scoreLabel.value);
        });

        onCollide("sword", "snake", (w, s) => {
            wait(1, () => {
                destroy(w);
            });
            destroy(s);
            scoreLabel.value++;
            scoreLabel.text = String(scoreLabel.value);
        });

        // die
        player.onCollide("dangerous", () => {
            go("lose");
        });
    });
};
