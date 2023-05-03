/**
  Extension Configuration
  --------------------------
*/

const config = {

  // Production
  prod: {
    // CHROME :: Extension
    chrome: {
      stable: {
        id: "abafaagbfhobgjkcepckbnadafflkdea", // Extension ID
      },
      dev: {
        id: "", // Extension ID
      }
    },
    // FIREFOX :: Extension
    firefox: {
      stable: {
        id: "{d1f8f18f-d7dd-4ae7-b519-564fd10509c2}", // Extension ID
      },
      dev: {
        id: "", // Extension ID
      }
    },
    // EDGE :: Extension
    edge: {
      stable: {
        id: "", // Extension ID
      },
      dev: {
        id: "", // Extension ID
      }
    },
    // OPERA :: Extension
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
    // FIREFOX :: Extension
    firefox: {
      id: "902f04acb10967f79b13b935307dff72cf7d8dc3@temporary-addon", // Extension ID
    },
    // EDGE :: Extension
    edge: {
      id: "bppgodlhjcbgkcpndhokilkpnjbikhcd", // Extension ID
    },
    // OPERA :: Extension
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
};

/**
 * Get Extension Configuration
 * @param {Object} env 
  [
    env.NODE_ENV
    env.EXTENSION_TYPE
    env.MANIFEST_VERSION
    env.BROWSER_TYPE
  ]
 */
export function getExtensionConfig(env) {

  // Return
  var configObj = {};

  // Check Dev Type
  if (env.NODE_ENV === "development") {

    // MODE:: Development

    // URL for Connection
    configObj["matchesURL"] = config.dev.matchesURL;
    configObj["optionURL"] = config.dev.optionURL;

    // Check Browser Type
    if (env.BROWSER_TYPE === "chrome") {

      // CHROME Development
      configObj["id"] = config.dev.chrome.id;

    } else if (env.BROWSER_TYPE === "firefox") {

      // Firefox Development
      configObj["id"] = config.dev.firefox.id;

    } else if (env.BROWSER_TYPE === "edge") {

      // Edge Development
      configObj["id"] = config.dev.edge.id;

    } else if (env.BROWSER_TYPE === "opera") {

      // Opera Development
      configObj["id"] = config.dev.opera.id;

    } else {
      throw new Error("EX-CONFIG ERROR: Please set browser type in the env")
    }

  } else {

    // MODE:: Production

    // URL for Connection
    configObj["matchesURL"] = config.prod.matchesURL;
    configObj["optionURL"] = config.prod.optionURL;

    // Check Browser Type
    if (env.BROWSER_TYPE === "chrome") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: CHROME DEV VERSION 
        configObj["id"] = config.prod.chrome.dev.id;

      } else {

        // Production: CHROME STABLE VERSION 
        configObj["id"] = config.prod.chrome.stable.id;
      }

    } else if (env.BROWSER_TYPE === "firefox") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: Firefox DEV VERSION 
        configObj["id"] = config.prod.firefox.dev.id;

      } else {

        // Production: Firefox STABLE VERSION 
        configObj["id"] = config.prod.firefox.stable.id;
      }

    } else if (env.BROWSER_TYPE === "edge") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: EDGE DEV VERSION 
        configObj["id"] = config.prod.edge.dev.id;

      } else {

        // Production: EDGE STABLE VERSION 
        configObj["id"] = config.prod.edge.stable.id;
      }

    } else if (env.BROWSER_TYPE === "opera") {

      // Check Extension (DEV) Version
      if (env.EXTENSION_TYPE === 'DEV') {

        // Production: OPERA DEV VERSION 
        configObj["id"] = config.prod.opera.dev.id;

      } else {

        // Production: OPERA STABLE VERSION 
        configObj["id"] = config.prod.opera.stable.id;
      }

    } else {
      throw new Error("EX-CONFIG ERROR: Please set browser type in the env")
    }
  }

  return configObj;
}