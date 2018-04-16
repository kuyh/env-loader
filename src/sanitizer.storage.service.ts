export class SchemaStorage {
  private _schemaMetadata: any[] = [];

  get schemaMetadata(): any[] {
    return this._schemaMetadata;
}

  public addSchemaMetadata(targetConstructor: Function, metadata: any) {
    const { type, propertyName, opts } = metadata;
    let targetMetadata = this.getSchemasForObject(targetConstructor);
    if (targetMetadata) {
      targetMetadata.schema.properties[propertyName] = opts;
      targetMetadata.schema.properties[propertyName].type = type;
    } else {
      targetMetadata = {
        key: targetConstructor,
        schema: {
          type: 'object',
          properties: {}
        }
      };
      targetMetadata.schema.properties[propertyName] = opts;
      targetMetadata.schema.properties[propertyName].type = type;
      this._schemaMetadata.push(targetMetadata);
    }
  }

  public getSchemasForObject(targetConstructor: Function): any {
    return this.schemaMetadata.find((metadata) => {
      if (metadata.key === targetConstructor)
        return true;
      if (metadata.key instanceof Function &&
        !(targetConstructor.prototype instanceof (metadata.key as Function)))
           return false;

      return true;
    });
  }
}

// Singleton
export const defaultSchemaStorage = new SchemaStorage();
