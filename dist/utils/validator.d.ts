import { ValidateOption } from 'validate.js';
type Validator<T, U> = boolean | T | ((value: unknown, fields: U, field: string, options: ValidateOption, constraints: ValidatorConstraints<U>) => Validator<T, U>);
type PresenceValidator = Partial<{
    allowEmpty: boolean;
    message: string;
}>;
type LengthValidator = Partial<{
    is: number;
    maximum: number;
    minimum: number;
    tokenizer: (val: unknown) => unknown;
    wrongLength: string;
    tooShort: unknown;
    tooLong: unknown;
    message: unknown;
}>;
type NumericalityValidator = Partial<{
    strict: boolean;
    onlyInteger: boolean;
    noStrings: boolean;
    greaterThan: number;
    greaterThanOrEqualTo: number;
    equalTo: number;
    lessThan: number;
    lessThanOrEqualTo: number;
    divisibleBy: number;
    odd: boolean;
    even: boolean;
    message: string;
    notInteger: string;
    notValid: string;
    notOdd: string;
    notEven: string;
    notGreaterThanOrEqualTo: string;
    notEqualTo: string;
    notLessThan: string;
    notLessThanOrEqualTo: string;
    notDivisibleBy: string;
}>;
type DateTimeValidator = Partial<{
    earliest: number | string | Date;
    latest: number | string | Date;
    dateOnly: boolean;
    notValid: string;
    message: string;
    tooEarly: string;
    tooLate: string;
}>;
type DateValidator = Omit<DateTimeValidator, 'dateOnly'>;
type FormatValidator = string | RegExp | Partial<{
    pattern: string | RegExp;
    flags: string;
    message: string;
}>;
type InclusionValidator = unknown[] | Partial<{
    within: unknown[] | Record<string, unknown>;
    message: string;
}>;
type EmailValidator = Partial<{
    message: string;
}>;
type EqualityValidator = string | Partial<{
    attribute: string;
    comparator: (v1: string, v2: string) => boolean;
    message: string;
    prettify: (attribute: string) => string;
}>;
type URLValidator = Partial<{
    schemes: string[];
    allowDataUrl: boolean;
    allowLocal: boolean;
    message: string;
}>;
type TypeValidatorType = 'object' | 'array' | 'integer' | 'number' | 'string' | 'date' | 'boolean';
type TypeValidator = TypeValidatorType | ((value: unknown, options: unknown, attribute: string, attributes: Record<string, unknown>, globalOptions: Record<string, unknown>) => unknown) | Partial<{
    type: TypeValidatorType;
    message: unknown;
}>;
type Validators<U> = Partial<{
    presence: Validator<PresenceValidator, U>;
    length: Validator<LengthValidator, U>;
    numericality: Validator<NumericalityValidator, U>;
    datetime: Validator<DateTimeValidator, U>;
    date: Validator<DateValidator, U>;
    format: Validator<FormatValidator, U>;
    inclusion: Validator<InclusionValidator, U>;
    exclusion: Validator<InclusionValidator, U>;
    email: Validator<EmailValidator, U>;
    equality: Validator<EqualityValidator, U>;
    url: Validator<URLValidator, U>;
    type: Validator<TypeValidator, U>;
}>;
type ValidatorConstraintsDef<T> = Partial<Record<keyof T | string, Validator<Validators<T>, T>>>;
export type ValidatorConstraints<T> = ValidatorConstraintsDef<T> | ((fields: T) => ValidatorConstraintsDef<T>);
export declare function validateFields<T>(fields: T, constraints: ValidatorConstraints<T>): Record<keyof T, string>;
export declare function validateFieldsOrThrow<T>(fields: T, constraints: ValidatorConstraints<T>): void;
export {};
//# sourceMappingURL=validator.d.ts.map