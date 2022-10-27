import Board from "./Board.js";
import MessageSender from "./MessageSender.js";
const maxPlayerCount = 4;
export default class Game {
    constructor(channel, playerList, options) {
        this.channel = channel;
        this.sender = new MessageSender(this);
        this.board = new Board(this, options.board);
        this.players = [];
        for (let i = 0; i < Math.min(maxPlayerCount, playerList.length); i++) {
            while (true) {
                const picked = playerList[Math.floor(playerList.length * Math.random())];
                if (this.players.includes(picked))
                    continue;
                this.players.push(picked);
                break;
            }
        }
    }
}
