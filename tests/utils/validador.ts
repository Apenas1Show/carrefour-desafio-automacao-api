import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

export class ValidadorSchema {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({ 
      allErrors: true,
      verbose: true,
      strict: false
    });
    addFormats(this.ajv);
  }

  validate(schema: object, data: any): {
    valid: boolean;
    errors: string[];
  } {
    const validate: ValidateFunction = this.ajv.compile(schema);
    const valid = validate(data);

    if (!valid && validate.errors) {
      const errors = validate.errors.map(error => {
        return `${error.instancePath} ${error.message}`;
      });
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  formatErrors(errors: string[]): string {
    return errors.join(', ');
  }
}