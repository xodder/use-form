"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("lodash/get"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const omit_1 = __importDefault(require("lodash/omit"));
const pick_1 = __importDefault(require("lodash/pick"));
const set_1 = __importDefault(require("lodash/set"));
const react_1 = __importDefault(require("react"));
const use_rerender_1 = __importDefault(require("./utils/use-rerender"));
const validator_1 = require("./utils/validator");
function useForm(constraints, initialValues = {}) {
    const rerender = (0, use_rerender_1.default)();
    const initialValuesRef = react_1.default.useRef(initialValues);
    const [values, setValues] = react_1.default.useState(initialValuesRef.current);
    const [errors, setErrors] = react_1.default.useState({});
    const changesRef = react_1.default.useRef({});
    function onValueChanged(fieldKey, value, validate = true) {
        const hasChanged = !(0, isEqual_1.default)(value, (0, get_1.default)(initialValuesRef.current, fieldKey));
        changesRef.current = hasChanged
            ? (0, set_1.default)(changesRef.current, fieldKey, value)
            : (0, omit_1.default)(changesRef.current, fieldKey);
        setValues((prev) => ({
            ...prev,
            [fieldKey]: value,
        }));
        const constraints__ = typeof constraints === 'function' ? constraints(values) : constraints;
        if (constraints__[fieldKey] && validate) {
            const updatedValues = {
                ...values,
                [fieldKey]: value,
            };
            const constraint = (0, pick_1.default)(constraints__, [
                fieldKey,
            ]);
            const errors__ = (0, validator_1.validateFields)(updatedValues, constraint) || {};
            setErrors((prev) => ({
                ...prev,
                [fieldKey]: errors__[fieldKey],
            }));
        }
    }
    function createOnChangedHandler(fieldKey) {
        return function (e) {
            onValueChanged(fieldKey, e.target.value || '');
        };
    }
    return {
        values,
        errors,
        changedValues: changesRef.current,
        value: (fieldKey) => (0, get_1.default)(values, fieldKey) || '',
        setValue: (fieldKey, value, validate = true) => onValueChanged(fieldKey, value, validate),
        error: (fieldKey) => (0, get_1.default)(errors, fieldKey),
        onChanged: (fieldKey) => createOnChangedHandler(fieldKey),
        field: (fieldKey, helperText = '') => {
            const error = (0, get_1.default)(errors, fieldKey);
            return {
                value: (0, get_1.default)(values, fieldKey) || '',
                onChange: createOnChangedHandler(fieldKey),
                error: !!error,
                helperText: (error || helperText),
            };
        },
        isValidated: (fieldKeys) => {
            let errors__ = {};
            if (fieldKeys) {
                const constraints__ = typeof constraints === 'function' ? constraints(values) : constraints;
                errors__ = (0, validator_1.validateFields)((0, pick_1.default)(values, fieldKeys), (0, pick_1.default)(constraints__, fieldKeys));
            }
            else {
                errors__ = (0, validator_1.validateFields)(values, constraints);
            }
            setErrors(errors__ || {});
            return !errors__;
        },
        changed: () => Object.keys(changesRef.current).length > 0,
        setErrors,
        reInitWith: (values__) => {
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
exports.default = useForm;
//# sourceMappingURL=index.js.map