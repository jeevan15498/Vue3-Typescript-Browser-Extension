/**
 * JS Code Obfuscator

  @author JEEVAN LAL
  --------------------------
  https://obfuscator.io/
  https://www.npmjs.com/package/glob
  https://www.npmjs.com/package/cli-progress

*/

const fs = require('fs');
var path = require('path');
var JSObfuscator = require('javascript-obfuscator'); // npm install javascript-obfuscator --save-dev 
var glob = require("glob"); // npm i glob
const cliProgress = require('cli-progress'); // npm i cli-progress

// Ignore Paths
const ignorePathsFile = path.join(__dirname, '.obfuscatorignore');

class Obfuscator {

  // Source Folder Path
  _SOURCE_PATH = "./dist/**/*.js";

  // https://github.com/isaacs/node-glob#options
  _GLOB_SETTINGS = {
    ignore: [] //  "./dist/temp/** */
  };

  constructor(sourcePath, options = {}) {

    // Settings
    var _options = {
      isRun: false, // ON/OFF
    };

    this._SOURCE_PATH = sourcePath;
    this.options = Object.assign(_options, options);
  }

  /**
   * Fetch Ignore Paths
   * @returns
   */
  fetchIgnorePaths(ignorePaths) {
    return new Promise((resolve, reject) => {
      fs.readFile(ignorePaths, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
          var paths = data.split("\n")
          var returnPaths = []
          if (!paths === false && paths.length > 0) {
            paths.forEach(path => {
              if (!path.trim() === false) {
                returnPaths.push(path.trim())
              }
            });
            return resolve(returnPaths);
          }
          return resolve([]);
        } else {
          return resolve([]);
        }
      });
    })
  }

  /**
   * Read File
   * @param {String} filePath 
   * @returns 
   */
  readFileContent(filePath) {
    return new Promise((resolve, reject) => {
      var fileFullPath = path.join(__dirname, "../../", filePath);
      fs.readFile(fileFullPath, 'utf8', function read(err, data) {
        if (err) { throw Error(err); }
        resolve(data);
      });
    })
  }

  /**
   * Encode File 
   * @param {String} fileContent 
   * @returns 
   */
  encodeJSFile(fileContent) {
    return new Promise((resolve, reject) => {
      var encode = JSObfuscator.obfuscate(fileContent,
        {
          // Compact code output on one line.
          compact: true,
          // Numbers conversion to expressions
          numbersToExpressions: true,
          // Enables additional code obfuscation through simplification
          simplify: true,
          // Splits literal strings
          splitStrings: true,
          // This option makes it almost impossible to use the debugger function of the Developer Tools 
          debugProtection: true,
          debugProtectionInterval: 0,
          disableConsoleOutput: true,
          // Sets identifier names generator.
          identifierNamesGenerator: 'mangled',
        }
      );
      resolve(encode.getObfuscatedCode())
    });
  }

  /**
   * Write File
   * @param {String} filePath 
   * @param {String} fileContent 
   * @returns 
   */
  writeFile(filePath, fileContent) {
    return new Promise((resolve, reject) => {
      var fileFullPath = path.join(__dirname, "../../", filePath);
      fs.writeFile(fileFullPath, fileContent, function read(err, data) {
        if (err) { throw Error(err); }
        resolve(true);
      });
    })
  }

  /**
   * START
   */
  async start() {

    // Check is Run
    if (this.options.isRun === false) {
      console.log('\x1b[31m%s\x1b[0m', "\nEncryption OFF");
      return false
    }

    console.log('\x1b[36m%s\x1b[0m', "\nStarting Encryption...");

    // Loading Bar
    const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    // Set Ignore Paths
    this._GLOB_SETTINGS.ignore = await this.fetchIgnorePaths(ignorePathsFile)

    // Fetch All JS Files
    glob(this._SOURCE_PATH, this._GLOB_SETTINGS, async (er, files) => {
      if (!files || files.length <= 0) throw Error("Files Not Found. Source Path: " + this._SOURCE_PATH);

      // Start Loading Bar
      console.log("\n")
      loadingBar.start(files.length, 1);

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        var fileContent = await this.readFileContent(file)
        var encodeContent = await this.encodeJSFile(fileContent)
        var isWrite = await this.writeFile(file, encodeContent)
        if (!isWrite) {
          throw Error("ERROR: IN ENCODE");
        } else {
          // console.log("[" + (index + 1) + "/" + files.length + "]: COMPILE DONE");
          loadingBar.update((index + 1));
        }
      }

      loadingBar.stop();
    })
  }
}

export { Obfuscator };
