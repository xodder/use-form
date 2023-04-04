import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import set from 'lodash/set';
import React, { ChangeEvent } from 'react';
import useRerender from './utils/use-rerender';
import { validateFields, ValidatorConstraints } from './utils/validator';

type FieldValue = unknown;
type FieldKey<T> = keyof T;
type Fields<T> = Partial<Record<FieldKey<T>, FieldValue>>;

export type UseForm<T> = {
  values: Fields<T>;
  errors: Fields<T>;
  changedValues: Fields<T>;
  value: (fieldKey: FieldKey<T>) => Fields<T>[FieldKey<T>] | '';
  setValue: (
    fieldKey: FieldKey<T>,
    value: FieldValue,
    validate?: boolean
  ) => void;
  error: (fieldKey: FieldKey<T>) => Fields<T>[FieldKey<T>];
  onChanged: (fieldKey: FieldKey<T>) => (e: any) => void;
  field: (
    fieldKey: FieldKey<T>,
    helperText?: string
  ) => {
    value: Fields<T>[FieldKey<T>] | '';
    onChange: (e: any) => void;
    error: boolean;
    helperText: React.ReactNode;
  };
  isValidated: (fieldKeys?: FieldKey<T>[]) => boolean;
  changed: () => boolean;
  setErrors: React.Dispatch<React.SetStateAction<Fields<T>>>;
  reInitWith: (values: Partial<Fields<T>>) => void;
  clearChanges: () => void;
  reset: () => void;
};
type NoInfer<T> = [T][T extends any ? 0 : never];

function useForm<T>(
  constraints: ValidatorConstraints<Fields<T>>,
  initialValues: NoInfer<Fields<T>> = {}
): UseForm<T> {
  const rerender = useRerender();
  const initialValuesRef = React.useRef(initialValues);
  const [values, setValues] = React.useState(initialValuesRef.current);
  const [errors, setErrors] = React.useState<Fields<T>>({});
  const changesRef = React.useRef<Fields<T>>({});

  function onValueChanged(
    fieldKey: FieldKey<T>,
    value: FieldValue,
    validate = true
  ) {
    const hasChanged = !isEqual(value, get(initialValuesRef.current, fieldKey));

    (changesRef.current as unknown) = hasChanged
      ? set(changesRef.current, fieldKey, value)
      : omit(changesRef.current, fieldKey);

    setValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    const constraints__ =
      typeof constraints === 'function' ? constraints(values) : constraints;

    if (constraints__[fieldKey] && validate) {
      const updatedValues = {
        ...values,
        [fieldKey]: value,
      } as Fields<T>;

      const constraint = pick(constraints__, [
        fieldKey,
      ]) as typeof constraints__;

      const errors__ = validateFields(updatedValues, constraint) || {};

      setErrors((prev) => ({
        ...prev,
        [fieldKey]: errors__[fieldKey],
      }));
    }
  }

  function createOnChangedHandler(fieldKey: FieldKey<T>) {
    return function (e: ChangeEvent<{ value: unknown }>) {
      onValueChanged(fieldKey, e.target.value || '');
    };
  }

  return {
    values,
    errors,
    changedValues: changesRef.current,
    value: (fieldKey: FieldKey<T>) => get(values, fieldKey) || '',
    setValue: (fieldKey: FieldKey<T>, value: FieldValue, validate = true) =>
      onValueChanged(fieldKey, value, validate),
    error: (fieldKey: FieldKey<T>) => get(errors, fieldKey),
    onChanged: (fieldKey: FieldKey<T>) => createOnChangedHandler(fieldKey),
    field: (fieldKey: FieldKey<T>, helperText = '') => {
      const error = get(errors, fieldKey);

      return {
        value: get(values, fieldKey) || '',
        onChange: createOnChangedHandler(fieldKey),
        error: !!error,
        helperText: (error || helperText) as React.ReactNode,
      };
    },
    isValidated: (fieldKeys?: FieldKey<T>[]) => {
      let errors__: Record<string, string> = {};

      if (fieldKeys) {
        const constraints__ =
          typeof constraints === 'function' ? constraints(values) : constraints;

        errors__ = validateFields(
          pick(values, fieldKeys) as unknown as Fields<T>,
          pick(constraints__, fieldKeys) as typeof constraints__
        );
      } else {
        errors__ = validateFields(values, constraints);
      }

      setErrors((errors__ as unknown as typeof errors) || {});

      return !errors__;
    },
    changed: () => Object.keys(changesRef.current).length > 0,
    setErrors,
    reInitWith: (values__: Partial<Fields<T>>) => {
      initialValuesRef.current = values__;
      changesRef.current = {};
      setValues(values__);
    },
    clearChanges: () => {
      changesRef.current = {};
      rerender();
    },
    reset: () => {
      changesRef.current = {};
      setValues(initialValuesRef.current);
    },
  };
}

export default useForm;
