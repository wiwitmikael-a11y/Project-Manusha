export enum CodexEntityType {
    ITEM = 'item',
    CHARACTER = 'character',
    STRUCTURE = 'structure',
    ENVIRONMENT = 'environment',
}

export interface BaseEntity {
    id: string; // Unique instance ID
    type: CodexEntityType;
    codexId: string; // ID from codexData
    x: number;
    y: number;
    hp?: number;
    maxHp?: number;
}
export interface Character extends BaseEntity {
    type: CodexEntityType.CHARACTER;
    action: string;
    name?: string;
}
export interface Structure extends BaseEntity {
    type: CodexEntityType.STRUCTURE;
}
export interface Environment extends BaseEntity {
    type: CodexEntityType.ENVIRONMENT;
}
// An Entity is a BaseEntity that can be rendered on the grid. Items cannot.
export type Entity = Character | Structure | Environment;


export interface GameEvent {
    id: number;
    text: string;
}

export interface GameState {
    day: number;
    time: 'Day' | 'Night';
    ticks: number;
    entities: Entity[];
    event: GameEvent | null;
    eventLog: string[];
}

// Codex Types
export interface CodexEntity {
  id: string;
  name: string;
  description: string;
  type: CodexEntityType;
  category: string;
  svg_code: string;
  attributes?: { [key: string]: any };
  interactions?: { action: string; [key: string]: any }[];
}
