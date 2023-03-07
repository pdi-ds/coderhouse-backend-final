type ValidationData = {
  [key: string]: any;
};
type ValidationDefinition = {
  [key: string]: string | Function;
  field: string;
  validator: Function;
  message: string;
};
type ValidationResult = {
  [key: string]: string | boolean | undefined;
  field: string;
  message?: string;
  valid: boolean;
};
type ValidationResults = {
  [key: string]: Array<ValidationResult>;
  valid: Array<ValidationResult>;
  errors: Array<ValidationResult>;
};
class Validation {
  static validate(
    data: ValidationData,
    validations: Array<ValidationDefinition>
  ): ValidationResults {
    const results: Array<ValidationResult> = validations.map(
      ({ field, validator, message }: ValidationDefinition): ValidationResult =>
        validator.call(null, data[field] || null) === false
          ? { field, message, valid: false }
          : { field, valid: true }
    );
    return {
      valid: results.filter(
        (validation: ValidationResult) => validation.valid === true
      ),
      errors: results.filter(
        (validation: ValidationResult) => validation.valid === false
      ),
    };
  }
  static isValidationResult(test: ValidationResults | boolean): boolean {
    return test !== false && (test as ValidationResults).errors !== undefined;
  }
}

export {
  ValidationData,
  ValidationDefinition,
  ValidationResult,
  ValidationResults,
};
export default Validation;
