import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import React from 'react';
import validate from 'validate.js';

type UseForm = {
  values: Record<string, any>;
  errors: Record<string, any>;
  changes: Record<string, any>;
  value: (field: string) => any;
  setValue: (field: string, value: any, validate?: boolean) => void;
  error: (field: string) => string;
  onChanged: (field: string) => (e: any) => void;
  field: (
    name: string,
    helperText?: string
  ) => {
    value: any;
    onChange: (e: any) => void;
    error: boolean;
    helperText: any;
  };
  isValidated: (fields?: string[]) => boolean;
  changed: () => boolean;
  setErrors: (errors: Record<string, any>) => void;
};

export function useForm(
  constraints: Record<string, any>,
  initialValues?: Record<string, any>
): UseForm {
  const initialValuesRef = React.useRef(initialValues || {});
  const [values, setValues] = React.useState(initialValuesRef.current);
  const [errors, setErrors] = React.useState<Record<string, any>>({});
  const changesRef = React.useRef<Record<string, any>>({});

  function onValueChanged(field: string, value: any) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    const hasChanged = !isEqual(value, initialValuesRef.current[field]);

    if (hasChanged) {
      changesRef.current[field] = value;
    } else {
      delete changesRef.current[field];
    }

    const constraint = constraints[field];

    if (constraint) {
      let dependencies = {};

      if (constraint.equality) {
        let parentField = constraint.equality;
        if (isObject(parentField)) {
          parentField = (parentField as any).attribute;
        }
        dependencies = { [parentField]: values[parentField] };
      }

      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value, constraint, dependencies),
      }));
    }
  }

  function createOnChangedHandler(field: string) {
    return function (e: any) {
      onValueChanged(field, e.target.value);
    };
  }

  return {
    values,
    errors,
    changes: changesRef.current,
    value: (field) => values[field] || '',
    setValue: (field, value) => onValueChanged(field, value),
    error: (field) => errors[field],
    onChanged: (field) => createOnChangedHandler(field),
    field: (name, helperText) => {
      const error = errors[name];
      return {
        value: values[name] || '',
        onChange: createOnChangedHandler(name),
        error: !!error,
        helperText: error || helperText,
      };
    },
    isValidated: (fields) => {
      const errors = fields
        ? validateFields(pick(values, fields), pick(constraints, fields))
        : validateFields(values, constraints);
      setErrors(errors || {});
      return !errors;
    },
    changed: () => {
      return Object.keys(changesRef.current).length > 0;
    },
    setErrors,
  };
}

function validateField(
  field: string,
  value: any,
  constraint: any,
  dependencies?: Record<string, any>
) {
  const attributes = { [field]: value, ...dependencies };
  const errors = validate(attributes, { [field]: constraint });

  if (errors) {
    return errors[field] && errors[field][0];
  }

  return null;
}

function validateFields(
  fields: Record<string, any>,
  constraints: Record<string, any>
) {
  const errors = validate(fields, constraints);

  for (const field in errors) {
    errors[field] = errors[field][0];
  }

  return errors;
}
