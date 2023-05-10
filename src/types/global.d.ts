declare global {

  declare var _env: {
    NODE_ENV: string;
    MANIFEST_VERSION: string;
    BROWSER_TYPE: string;
    EXTENSION_TYPE: string;
    IS_ENCODE_SCRIPTS: string;
  };

  interface _env {
    NODE_ENV: string;
    EXTENSION_TYPE: string;
    MANIFEST_VERSION: string;
    BROWSER_TYPE: string;
    IS_ENCODE_SCRIPTS: string;
  }

  interface ManifestJSON {
    name: string;
    short_name: string;
    description: string;
    icons: typeIcon;
    browser_action: {
      default_icon: typeIcon
    };
    action: {
      default_icon: typeIcon
    };
    externally_connectable: {
      ids: string[]
      matches: string[]
    }
  }

  interface typeIcon {
    "16": string;
    "24": string;
    "32": string;
    "48": string;
    "128": string;
  }
}

/*~ If your module exports nothing, you'll need this line. Otherwise, delete it */
export { };
