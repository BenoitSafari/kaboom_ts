interface IBuildUIParams {
    score: number;
    numKeys: number;
    level: number;
    numBombs: number;
}

export const buildUI = ({ score, numKeys, level, numBombs }: IBuildUIParams) => {
    const scoreLabel = add([text("0"), pos(200, 180), layer("ui"), { value: score }, 0.7]);
    const keysLabel = add([
        text("Keys : "),
        pos(200, 200),
        layer("ui"),
        { value: numKeys },
        scale(0.7),
    ]);
    const levelLabel = add([
        text(`Room ${Number(level) + 1}`), //
        pos(200, 215),
        scale(0.7),
    ]);
    const bombsLabel = add([
        text("Bombs : "), //
        pos(200, 230),
        layer("ui"),
        { value: numBombs },
        scale(0.7),
    ]);

    return {
        scoreLabel,
        keysLabel,
        levelLabel,
        bombsLabel,
    };
};
