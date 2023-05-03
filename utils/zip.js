#!/usr/bin/env node

/**
 * Build Extension Zip
  ---------------------------------------------------------
  node file.js extension_type=dev browser=chrome_dev
  ----------------------------------------------------------
 */

// const fs = require('fs');
var fs = require("fs-extra");
const path = require('path');
const archiver = require('archiver'); // npm i archiver
const del = require('del'); // npm i del@6 (Only 6 Version Support Require)

const extractExtensionData = () => {
  const extPackageJson = require('../package.json');

  return {
    name: extPackageJson.name,
    version: extPackageJson.version
  }
};

const makeDestZipDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const buildZip = (src, dist, zipFilename) => {
  console.info(`\nBuilding ${zipFilename}...`);

  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(path.join(dist, zipFilename));

  return new Promise((resolve, reject) => {
    archive
      .directory(src, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

async function copyFolder(source, destination) {
  await fs.copySync(source, destination);
}

const main = async () => {

  // GET NODE ARGV: 'extension_type' and 'browser'
  const browser = process.env.BROWSER_TYPE;
  if (!browser) throw new Error("Please set browser argument")
  const extensionType = process.env.EXTENSION_TYPE;
  if (!extensionType) throw new Error("Please set extension type argument");

  // Build Folder
  const DEST_DIR = path.join(__dirname, '../dist');
  const DEST_ZIP_DIR = path.join(__dirname, '../build-zip-online/' + browser + "/" + extensionType);

  const { name, version } = extractExtensionData();
  const zipFilename = `${name}-v${version}.zip`;

  makeDestZipDirIfNotExists(DEST_ZIP_DIR);

  // Dist Temp Files Delete
  del(['dist/temp/*']);
  // For Production Version
  del(['dist/scripts/*']);

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
    .then(() => console.info('DONE :)'))
    .catch(console.err);
};

main();