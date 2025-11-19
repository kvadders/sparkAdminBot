import fs from "fs";
import path from "path";
import yaml from "js-yaml";

type NestedMessages = {
  [key: string]: string | string[] | NestedMessages;
};

export type Language = "EN";

const locales: Record<string, NestedMessages> = {};

const localesDir = path.join(__dirname);

fs.readdirSync(localesDir).forEach((file) => {
  if (file.endsWith(".yaml")) {
    const lang = path.basename(file, path.extname(file));
    const filePath = path.join(localesDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    locales[lang] = yaml.load(content) as NestedMessages;
  }
});

function format(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}

function t(key: string, params?: Record<string, string | number>): string {
  const parts = key.split(".");
  let result: string | string[] | NestedMessages | undefined = locales["RU"];

  for (const part of parts) {
    if (typeof result === "object" && result !== null && !Array.isArray(result)) {
      result = result[part] as string | string[] | NestedMessages | undefined;
    } else {
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


export {t, locales};