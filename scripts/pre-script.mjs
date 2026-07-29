import { access, constants, copyFile, mkdir, readdir, rm } from 'fs/promises';
import path from 'path';

const SOURCE_DIR = path.join(process.cwd(), 'contents');
const TARGET_DIR = path.join(process.cwd(), 'public/images');

const exists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const copyImages = async () => {
  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  if (await exists(TARGET_DIR)) await rm(TARGET_DIR, { recursive: true });

  for (const dir of dirs) {
    const sourceDirPath = path.resolve(path.join(SOURCE_DIR, dir));
    const targetDirPath = path.resolve(path.join(TARGET_DIR, dir));
    const entries = await readdir(sourceDirPath, { withFileTypes: true });
    const files = entries.filter((entry) => !entry.isDirectory()).map((entry) => entry.name);
    const imageFiles = files.filter((file) => /\.(png|gif)$/.test(file));

    if (imageFiles.length === 0) continue;

    await mkdir(targetDirPath, { recursive: true });

    await Promise.all(
      imageFiles.map((imageFile) => {
        const sourceFilePath = path.resolve(path.join(sourceDirPath, imageFile));
        const targetFilePath = path.resolve(path.join(targetDirPath, imageFile));

        return copyFile(sourceFilePath, targetFilePath);
      })
    );
  }
};

await copyImages();
