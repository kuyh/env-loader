import { defaultSchemaStorage } from './sanitizer.storage.service';

import 'reflect-metadata';

import * as _ from 'lodash';
import * as inspector from 'schema-inspector';

function makeDecorator(optionalSchema?: any) {
  return function (object: Object, propertyName: string) {
    const metadata = Reflect.getMetadata("design:type", object, propertyName);
    // console.log(`${propertyName} type: ${metadata.name}`);
    
    let type = '';
    switch (metadata.name) {
      case 'String':
      case 'Number':
      case 'Boolean':
      type = metadata.name.toLowerCase();
      break;
    }
    
    defaultSchemaStorage.addSchemaMetadata(object.constructor, {
      type: type,
      propertyName: propertyName,
      opts: optionalSchema || {}
    });
  };
}

export function LoadEnv(optionalSchema?: any) {
  return makeDecorator(optionalSchema);
}

export class EnvSanitizer {
  private _container: {get(type: Function): any};
  private metadataStorage = defaultSchemaStorage;

  set container(container: {get(type: Function): any}) {
    this._container = container;
  }

  public sanitize(object: any): void {
    const metadata = this.metadataStorage.getSchemasForObject(object.constructor);
    _.forEach(metadata.schema.properties, (v, k) => {
      const defaultValue: any = object[k] || process.env[k] || v.default;
      if (defaultValue === undefined) {
        if (v.required) {
          throw new Error(`required but has no data`);
        } else {
          return;
        }
      }
      object[k] = defaultValue;
    });
    inspector.sanitize(metadata.schema, object);
    inspector.validate(metadata.schema, object);
    // TODO : implemented nested sanitation
  }
}

const sanitizer = new EnvSanitizer();

export default sanitizer;

export function sanitize(object: any): void {
  return sanitizer.sanitize(object);
}