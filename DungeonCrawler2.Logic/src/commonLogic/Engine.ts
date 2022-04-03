export class EngineClass {
  DefaultColor: string;
  NonBreakingSpace: string;
  EndLine: string;
  Input: string;

  constructor() {
    this.EndLine = "<br/>";
    this.NonBreakingSpace = "&nbsp;";
    this.DefaultColor = "|W";
  }

  /**
   *
   * @param {string} message
   * @param {boolean} isNewLine
   */
  Output(message: string = "", isNewLine: boolean = true) {
    console.log(message);
  }

  /**
   *
   * @param {string} location
   */
  LoadScript(location: string) {}

  /**
   *
   * @param {string} location Location of a file to load
   * @returns {object}
   */
  LoadData(location: string): any {
    return {};
  }

  Reload() {}

  Exit() {}
}

declare global {
  var Engine: EngineClass;
}
global.Engine = new EngineClass();
