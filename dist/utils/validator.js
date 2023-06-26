"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFieldsOrThrow = exports.validateFields = void 0;
const set_1 = __importDefault(require("lodash/set"));
const validate_js_1 = __importDefault(require("validate.js"));
function validateFields(fields, constraints) {
    const resolvedConstraints = typeof constraints === 'function' ? constraints(fields) : constraints;
    const errors = (0, validate_js_1.default)(fields, resolvedConstraints);
    for (const field in errors) {
        const error = errors[field][0];
        if (field.indexOf('.') !== -1) {
            delete errors[field];
        }
        (0, set_1.default)(errors, field, error);
    }
    return errors;
}
exports.validateFields = validateFields;
function validateFieldsOrThrow(fields, constraints) {
    const errors = validateFields(fields, constraints);
    if (errors && Object.keys(errors).length) {
        const error = new Error('');
        error.meta = {
            fields: {
                ...errors,
            },
        };
        throw error;
    }
}
exports.validateFieldsOrThrow = validateFieldsOrThrow;
//# sourceMappingURL=validator.js.map