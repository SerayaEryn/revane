export = Revane;

declare class Revane {
  constructor(options: object);
  initialize(): Promise.<void>;
  get(id: string): any;
  getMultiple(ids: Array.<string>): Array.<any>;
  getByType(type: string): Array.<any>;
}