import fs from "fs";
import path from "path";
import GameManager from "./game/core/GameManager.js";
import PlayerData from "./game/core/PlayerData.js";
import * as placeable from "./bundles/placeable.js";
const outDir = path.join("out");
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}
function getFilePath(name) {
    return path.join(outDir, name);
}
function logImage(game, imageName) {
    const board = game.board;
    board.canvas.render();
    const image = board.canvas.toBuffer();
    fs.writeFileSync(getFilePath(imageName) + ".png", image);
}
function error(msg) {
    console.error(msg);
    process.exit(1);
}
function run() {
    const gameManager = new GameManager();
    const playerDatas = [
        new PlayerData({
            id: "1",
            displayName: "Player 1"
        }),
        new PlayerData({
            id: "2",
            displayName: "Player 2"
        })
    ];
    const result = gameManager.createGame(playerDatas);
    const game = gameManager.getGame("game");
    if (!result || typeof game === "undefined") {
        return error("Unexprected error occured while creating the game.");
    }
    const players = [
        new placeable.main.Player({
            game,
            memberId: playerDatas[0].id,
            memberName: playerDatas[0].displayName,
            name: playerDatas[0].displayName,
            x: 1, y: 1,
            status: {
                hp: 3000,
                baseAtk: 2.5
            },
        }),
        new placeable.main.Player({
            game,
            memberId: playerDatas[1].id,
            memberName: playerDatas[1].displayName,
            name: playerDatas[1].displayName,
            x: 5, y: 1,
            status: {
                hp: 3000,
            },
        })
    ];
    game.messageSender.send("Hello, World!");
    game.messageSender.send("t: " + new Date().getTime());
    setInterval(() => {
        players[0].move(1, 0);
        logImage(game, "game");
        players[1].status.baseDef += 0.1;
        game.messageSender.send("Increased Player 2's baseDef by 0.1");
        fs.writeFileSync(getFilePath("message-log.txt"), game.messageSender.messageLog.join("\n"));
    }, 1000);
    return;
}
run();
