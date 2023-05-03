#!/usr/bin/env node

// const fs = require('fs');
var fs = require("fs-extra");
const path = require('path');
const archiver = require('archiver');
const del = require('del');

const DEST_DIR = path.join(__dirname, '../dist');
const DIR_FOR_SITE = path.join(__dirname, '../build-for-site');

const extractExtensionData = () => {
  const extPackageJson = require('../package.json');

  return {
    name: extPackageJson.name,
    version: extPackageJson.version
  }
};

const makeDestSiteDirIfNotExists = () => {
  if (!fs.existsSync(DIR_FOR_SITE)) {
    fs.mkdirSync(DIR_FOR_SITE, { recursive: true });
  }
}

async function copyFolder(source, destination) {
  await fs.copySync(source, destination);
}

const main = async () => {
  const { name, version } = extractExtensionData();

  makeDestSiteDirIfNotExists();

  // First Delete Old Folder
  await del(['build-for-site/*']);
  await copyFolder(path.join(__dirname, '../dist/scripts'), path.join(__dirname, '../build-for-site/scripts'));

  // Dist Temp Files Delete
  del(['dist/temp/*']);

  console.info('\n\nProject Ready for Publish in the Site :)')
};

main();