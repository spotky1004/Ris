import Board from "./Board.js";
import MessageSender from "./MessageSender.js";
export default class Game {
    constructor(channel, playerList, options) {
        this.channel = channel;
        this.sender = new MessageSender(this);
        this.board = new Board(this, options.board);
        this.players = playerList;
    }
}
