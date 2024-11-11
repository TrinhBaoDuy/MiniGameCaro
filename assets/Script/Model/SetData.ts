export class SettingData {
  private static instance: SettingData;
  private sound: boolean;
  private music: boolean;

  private constructor() {
    this.sound = true;
    this.music = true;
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