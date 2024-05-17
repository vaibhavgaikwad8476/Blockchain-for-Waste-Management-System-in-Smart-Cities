export class WasteType {
  public id?: string;
  public name: string;
  public description?: string;

  constructor(name: string, id?: string, description?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
