export default () => {
    scene("lose", () => {
        add([text("Game Over"), pos(85, 100)]);
        add([text("Press any key to try again"), pos(20, 115)]);
        onKeyPress(() =>
            go("game", {
                level: 0,
                score: 0,
            })
        );
    });
};
