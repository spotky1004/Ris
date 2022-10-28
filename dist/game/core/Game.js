import Board from "./Board.js";
import MessageSender from "./MessageSender.js";
export default class Game {
    constructor(options) {
        this.messageSender = new MessageSender(this, options.discordChannel);
        this.board = new Board(this, options.board);
        this.players = options.players;
    }
}
