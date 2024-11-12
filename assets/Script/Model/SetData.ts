export class SettingData {
  private static instance: SettingData;
  private sound: boolean;
  private music: boolean;

  private constructor() {
    this.sound = true;
    this.music = false;
  }

  public static getInstance(): SettingData {
    if (!SettingData.instance) {
      SettingData.instance = new SettingData();
    }
    return SettingData.instance;
  }

  public getSound(): boolean {
    return this.sound;
  }

  public setSound(sound: boolean): void {
    this.sound = sound;
  }

  public getMusic(): boolean {
    return this.music;
  }

  public setMusic(music: boolean): void {
    this.music = music;
  }
}

export class UserData {
  private static instance: UserData;
  private _name: string;

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  private _token: string;

  public get token(): string {
    return this._token;
  }
  public set token(value: string) {
    this._token = value;
  }

  private constructor() {
    this.name = '';
    this.token = '';
  }

  public static getInstance(): UserData {
    if (!UserData.instance) {
      UserData.instance = new UserData();
    }
    return UserData.instance;
  }
}