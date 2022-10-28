export interface PlayerDataOptions {
  id: string;
  displayName: string;
}

export default class PlayerData {
  readonly id: string;
  readonly displayName: string;

  constructor(options: PlayerDataOptions) {
    this.id = options.id;
    this.displayName = options.displayName;
  }
}
