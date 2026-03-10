export interface Point {
  x: number;
  y: number;
}

export interface WallSegment {
  length: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

export interface Furniture {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  imageUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface RoomConfig {
  walls: WallSegment[];
  points: Point[];
}
