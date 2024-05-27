const Fs = require("fs");
const Path = require("path");
const { promisify } = require("util");

const readdir = promisify(Fs.readdir);
const stat = promisify(Fs.stat);
const copyFile = promisify(Fs.copyFile);
const mkdir = promisify(Fs.mkdir);
const unlink = promisify(Fs.unlink);
const rmdir = promisify(Fs.rmdir);

if (process.argv.length < 4) {
  console.error(
    "Usage: node filesHelper.js [-c|-d] <sourcePath> <destinationPath>"
  );
  process.exit(1);
}

const operation = process.argv[2];
if (operation !== "-c" && operation !== "-d") {
  console.error("Invalid operation. Use -c for copy or -d for delete.");
  process.exit(1);
}

if (operation === "-c") {
  const sourcePath = Path.resolve(process.argv[3]);
  const destinationPath = Path.resolve(process.argv[4]);
  if (!Fs.existsSync(sourcePath)) {
    throw new Error("Source folder path is not valid");
  }
  if (!Fs.existsSync(destinationPath)) {
    throw new Error("Destination folder path is not valid");
  }
  copyFolders(sourcePath, destinationPath)
    .then(() => {
      console.log("Copy completed successfully.");
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    });
} else if (operation === "-d") {
  const folderPath = Path.resolve(process.argv[3]);
  if (!Fs.existsSync(folderPath)) {
    throw new Error("Given folder path is not valid");
  }
  deleteFolder(folderPath)
    .then(() => {
      console.log("Delete completed successfully.");
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    });
}

async function copyFolders(source, destination) {
  try {
    await mkdir(destination, { recursive: true });
    const files = await readdir(source);
    for (const file of files) {
      const sourceFilePath = Path.join(source, file);
      const destFilePath = Path.join(destination, file);
      const fileStat = await stat(sourceFilePath);

      if (fileStat.isDirectory()) {
        await copyFolders(sourceFilePath, destFilePath);
      } else {
        await copyFile(sourceFilePath, destFilePath);
      }
    }
  } catch (err) {
    throw err;
  }
}

async function deleteFolder(folderPath) {
  try {
    const files = await readdir(folderPath);
    for (const file of files) {
      const filePath = Path.join(folderPath, file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        await deleteFolder(filePath);
        await rmdir(filePath);
      } else {
        await unlink(filePath);
      }
    }
  } catch (err) {
    throw err;
  }
}
