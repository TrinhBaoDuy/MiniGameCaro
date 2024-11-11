import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export const Scene_NAMES = {
    Home: 'home',
    Playing: 'game'
};

export enum Level {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard'
}

export const EVENT_NAMES = {
    Select: 'Select Box',
    Status: 'Status Active',
    Bot_Turn: 'Bot Turn',
    Retry: 'Retry Game',
    Home: 'Come Home Game',
    TEST: 'TEST',
}

export const Animation_Name = {
    Idle: 'Idle',
    Dying: 'Dying',
    Hurt: 'Hurt',
    Slash: 'Slashing',
    Walk: 'Walking',
}
export enum Active_Status {
    Waiting,
    TimePlay,
    TimeOff,
    Winer,
    Loser,
}

export enum Chooser {
    Null,
    Player,
    Bot
}

export const Bot_name = 'Thua con AI'
export const WINSTREAK = 'WINNIG STREAK : '


