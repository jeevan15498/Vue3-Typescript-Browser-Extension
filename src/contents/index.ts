import { getName } from '@lib/lib.ts'

import { ExtensionBrowsers } from "@ctechhindi/core-browser-extension/src/utils/enums";
import { ExtensionDriver } from '@ctechhindi/core-browser-extension/src/ExtensionDriver'

var ex = new ExtensionDriver(ExtensionBrowsers.chrome, "1");
console.log("🚀 ~ file: background.ts:8 ~ ex:", ex)

console.log(_env.NODE_ENV)
console.log(getName())