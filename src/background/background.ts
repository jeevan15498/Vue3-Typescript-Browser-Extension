// Background Script
import { getName } from '@lib/lib'

import { ExtensionBrowsers } from "@ctechhindi/core-browser-extension/src/utils/enums";
import { ExtensionDriver } from '@ctechhindi/core-browser-extension/src/ExtensionDriver'

var ex = new ExtensionDriver(ExtensionBrowsers.chrome, "1");
console.log("🚀 ~ file: background.ts:8 ~ ex:", ex)

console.log("Background Script")
console.log(getName())