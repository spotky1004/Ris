import type PlaceableBase from "./PlaceableBase.js";

interface PlayableMarker extends PlaceableBase {
  move: (x: number, y: number) => any;
  look: (x: number, y: number) => any; 
}

export interface PlayerDataOptions {
  id: string;
  displayName: string;
}

export default class PlayerData {
  readonly id: string;
  readonly displayName: string;
  defeated: boolean;
  marker: PlayableMarker | undefined;

  constructor(options: PlayerDataOptions) {
    this.id = options.id;
    this.displayName = options.displayName;
    this.defeated = false;
  }

  addMarker(marker: PlayableMarker) {
    this.marker = marker;
  }
}
