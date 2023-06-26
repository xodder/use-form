import React from 'react';
import { ValidatorConstraints } from './utils/validator';
type FieldValue = unknown;
type FieldKey<T> = keyof T;
type Fields<T> = Partial<Record<FieldKey<T>, FieldValue>>;
export type UseForm<T> = {
    values: Fields<T>;
    errors: Fields<T>;
    changedValues: Fields<T>;
    value: (fieldKey: FieldKey<T>) => Fields<T>[FieldKey<T>] | '';
    setValue: (fieldKey: FieldKey<T>, value: FieldValue, validate?: boolean) => void;
    error: (fieldKey: FieldKey<T>) => Fields<T>[FieldKey<T>];
    onChanged: (fieldKey: FieldKey<T>) => (e: any) => void;
    field: (fieldKey: FieldKey<T>, helperText?: string) => {
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
declare function useForm<T>(constraints: ValidatorConstraints<Fields<T>>, initialValues?: NoInfer<Fields<T>>): UseForm<T>;
export default useForm;
//# sourceMappingURL=index.d.ts.map