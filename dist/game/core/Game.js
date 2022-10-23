import Board from "./Board.js";
export default class Game {
    constructor(guild, options) {
        this.guild = guild;
        this.board = new Board(this, options.board);
    }
}
