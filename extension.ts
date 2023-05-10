/**
 * ----------------------------
 * Extension Configuration
 * ----------------------------
 */
import { fileURLToPath } from "url";

/**
 * [EXTENSION]: Entires
 */
export const entires = [
  { index: fileURLToPath(new URL('./src/contents/index.ts', import.meta.url)) },
  { fake: fileURLToPath(new URL('./src/contents/fake.ts', import.meta.url)) }
];

/**
 * [PROJECT]: Output Directory
 */
export const outputFolderPath = fileURLToPath(new URL('dist', import.meta.url));

/**
 * [PROJECT]: alias
 */
export const alias = {
  '@src': fileURLToPath(new URL('./src', import.meta.url)),
  '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
  '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
  '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
}

/**
 * [PROJECT]: define
 */
export const define = {
  '_env.NODE_ENV': "'" + process.env.NODE_ENV + "'",
  '_env.MANIFEST_VERSION': "'" + process.env.MANIFEST_VERSION + "'",
  '_env.BROWSER_TYPE': "'" + process.env.BROWSER_TYPE + "'",
  '_env.EXTENSION_TYPE': "'" + process.env.EXTENSION_TYPE + "'",
  '_env.IS_ENCODE_SCRIPTS': "'" + process.env.IS_ENCODE_SCRIPTS + "'",
}

/**
 * [EXTENSION]: Details
 */
export const extensionDetails = {

  // Production
  prod: {
    chrome: {
      stable: {
        id: "abafaagbfhobgjkcepckbnadafflkdea", // Extension ID
      },
      dev: {
        id: "", // Extension ID
      }
    },
    firefox: {
      stable: {
        id: "{d1f8f18f-d7dd-4ae7-b519-564fd10509c2}", // Extension ID
      },
      dev: {
        id: "", // Extension ID
      }
    },
    edge: {
      stable: {
        id: "", // Extension ID
      },
      dev: {
        id: "", // Extension ID
      }
    },
    opera: {
      stable: {
        id: "", // Extension ID
      },
      dev: {
        id: "", // Extension ID
      }
    },
    // Server Site
    // Server Site Match URL
    matchesURL: [
      "https://efiller.netlify.app/*"
    ],
    // Server Site
    optionURL: "https://efiller.netlify.app/"
  },

  // Development
  dev: {
    chrome: {
      id: "bppgodlhjcbgkcpndhokilkpnjbikhcd", // Extension ID
    },
    firefox: {
      id: "902f04acb10967f79b13b935307dff72cf7d8dc3@temporary-addon", // Extension ID
    },
    edge: {
      id: "bppgodlhjcbgkcpndhokilkpnjbikhcd", // Extension ID
    },
    opera: {
      id: "bppgodlhjcbgkcpndhokilkpnjbikhcd", // Extension ID
    },
    // Server Site Match URL
    matchesURL: [
      "https://localhost:3000/*",
      "https://efiller.netlify.app/*"
    ],
    // Server Site
    optionURL: "https://localhost:3000/"
    // optionURL: "https://efiller.netlify.app/"
  }
}

/**
 * [EXTENSION]: Get Extension Details
 * @param {Object} env 
 */
export function getExtensionDetails(env: _env) {

  // Return
  var configObj = {} as {
    id: string
    matchesURL: string[]
    optionURL: string
  };

  // Check Dev Type
  if (env.NODE_ENV === "development") {

    // MODE:: Development

    // URL for Connection
    configObj["matchesURL"] = extensionDetails.dev.matchesURL;
    configObj["optionURL"] = extensionDetails.dev.optionURL;

    // Check Browser Type
    if (env.BROWSER_TYPE === "chrome") {

      // CHROME Development
      configObj["id"] = extensionDetails.dev.chrome.id;

    } else if (env.BROWSER_TYPE === "firefox") {

      // Firefox Development
      configObj["id"] = extensionDetails.dev.firefox.id;

    } else if (env.BROWSER_TYPE === "edge") {

      // Edge Development
      configObj["id"] = extensionDetails.dev.edge.id;

    } else if (env.BROWSER_TYPE === "opera") {

      // Opera Development
      configObj["id"] = extensionDetails.dev.opera.id;

    } else {
      throw new Error("EXTENSION.TS: Please set browser type in the env")
    }

  } else {

    // MODE:: Production

    // URL for Connection
    configObj["matchesURL"] = extensionDetails.prod.matchesURL;
    configObj["optionURL"] = extensionDetails.prod.optionURL;

    // Check Browser Type
    if (env.BROWSER_TYPE === "chrome") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: CHROME DEV VERSION 
        configObj["id"] = extensionDetails.prod.chrome.dev.id;

      } else {

        // Production: CHROME STABLE VERSION 
        configObj["id"] = extensionDetails.prod.chrome.stable.id;
      }

    } else if (env.BROWSER_TYPE === "firefox") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: Firefox DEV VERSION 
        configObj["id"] = extensionDetails.prod.firefox.dev.id;

      } else {

        // Production: Firefox STABLE VERSION 
        configObj["id"] = extensionDetails.prod.firefox.stable.id;
      }

    } else if (env.BROWSER_TYPE === "edge") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: EDGE DEV VERSION 
        configObj["id"] = extensionDetails.prod.edge.dev.id;

      } else {

        // Production: EDGE STABLE VERSION 
        configObj["id"] = extensionDetails.prod.edge.stable.id;
      }

    } else if (env.BROWSER_TYPE === "opera") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: OPERA DEV VERSION 
        configObj["id"] = extensionDetails.prod.opera.dev.id;

      } else {

        // Production: OPERA STABLE VERSION 
        configObj["id"] = extensionDetails.prod.opera.stable.id;
      }

    } else {
      throw new Error("EXTENSION.TS: PLEASE SET BROWSER TYPE")
    }
  }

  return configObj;
}

/**
 * Transform Manifest JSON Object
 * @param json 
 * @returns 
 */
export function manifestTransform(json: ManifestJSON): object {

  // Extension (DEV) Version
  if (process.env.EXTENSION_TYPE === 'DEV') {

    /**
      SET Extension Name, ShortName, Description
      -------------------------------------------------
      name : __MSG_appName__
      short_name : __MSG_appShortName__
      description : __MSG_appDescription__
    */
    json["name"] = "__MSG_appName_DEV__";
    json["short_name"] = "__MSG_appShortName_DEV__";
    json["description"] = "__MSG_appDescription_DEV__";

    /**
     * SET Extension Icon
      --------------------------------
      "action": {
        "default_icon": {
          "16": "icons/16x16.png",
          "24": "icons/24x24.png",
          "32": "icons/32x32.png"
        }
      },
      "icons": {
        "16": "icons/16x16.png",
        "48": "icons/48x48.png",
        "128": "icons/128x128.png"
      },
      */

    // SET Dev Icon
    json["icons"]["16"] = "icons/dev/16x16.png";
    json["icons"]["48"] = "icons/dev/48x48.png";
    json["icons"]["128"] = "icons/dev/128x128.png";

    if (process.env.MANIFEST_VERSION == '2') {

      // Default browser_action Icons
      json["browser_action"]["default_icon"]["16"] = "icons/16x16.png";
      json["browser_action"]["default_icon"]["24"] = "icons/24x24.png";
      json["browser_action"]["default_icon"]["32"] = "icons/32x32.png";

    } else if (process.env.MANIFEST_VERSION == '3') {

      // Default Action Icons
      json["action"]["default_icon"]["16"] = "icons/dev/16x16.png";
      json["action"]["default_icon"]["24"] = "icons/dev/24x24.png";
      json["action"]["default_icon"]["32"] = "icons/dev/32x32.png";

    } else {
      throw new Error("EXTENSION.TS:: PLEASE SET MANIFEST VERSION")
    }

  } else {

    // Default
    json.name = "__MSG_appName__";
    json.short_name = "__MSG_appShortName__";
    json.description = "__MSG_appDescription__";

    // Default Icons
    json["icons"]["16"] = "icons/16x16.png";
    json["icons"]["48"] = "icons/48x48.png";
    json["icons"]["128"] = "icons/128x128.png";

    // @ts-ignore
    if (process.env.MANIFEST_VERSION == 2) {

      // Default browser_action Icons
      json["browser_action"]["default_icon"]["16"] = "icons/16x16.png";
      json["browser_action"]["default_icon"]["24"] = "icons/24x24.png";
      json["browser_action"]["default_icon"]["32"] = "icons/32x32.png";

      // @ts-ignore
    } else if (process.env.MANIFEST_VERSION == 3) {

      // Default Action Icons
      json["action"]["default_icon"]["16"] = "icons/16x16.png";
      json["action"]["default_icon"]["24"] = "icons/24x24.png";
      json["action"]["default_icon"]["32"] = "icons/32x32.png";

    } else {
      throw new Error("EXTENSION.TS:: PLEASE SET MANIFEST VERSION")
    }
  }

  // Get Extension Details
  var exconfig = getExtensionDetails(process.env as unknown as _env)

  // SET: externally_connectable (NOT FOR FIREFOX BROWSER)
  if (process.env.BROWSER_TYPE !== "firefox") {
    if (!exconfig.id === false && !exconfig.matchesURL === false) {
      json.externally_connectable.ids.push(exconfig.id)
      json.externally_connectable.matches = exconfig.matchesURL
    }
  }

  return json
}