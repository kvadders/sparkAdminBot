"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locales = void 0;
exports.t = t;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const locales = {};
exports.locales = locales;
const localesDir = path_1.default.join(__dirname);
fs_1.default.readdirSync(localesDir).forEach((file) => {
    if (file.endsWith(".yaml")) {
        const lang = path_1.default.basename(file, path_1.default.extname(file));
        const filePath = path_1.default.join(localesDir, file);
        const content = fs_1.default.readFileSync(filePath, "utf-8");
        locales[lang] = js_yaml_1.default.load(content);
    }
});
function format(str, params) {
    if (!params)
        return str;
    return str.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}
function t(key, params) {
    const parts = key.split(".");
    let result = locales["RU"];
    for (const part of parts) {
        if (typeof result === "object" && result !== null && !Array.isArray(result)) {
            result = result[part];
        }
        else {
            result = undefined;
            break;
        }
    }
    if (Array.isArray(result)) {
        console.warn(`Key "${key}" is an array, use tArray() instead`);
        return key;
    }
    return typeof result === "string" ? format(result, params) : key;
}
