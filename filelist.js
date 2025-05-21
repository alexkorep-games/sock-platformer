#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";

// Array of directories to scan
const targetDirectories = [
  "./src",
  "./public",
];

// Directories to exclude from scanning
const excludedDirs = [
  // "src/features/credits",
  // "src/features/stats",
  // "src/features/title",
  // "src/features/undocking",
];

// File extensions whose contents will be printed
const allowedExtensions = [".ts", ".tsx", ".html", ".css", ".json", ".js", ".csv", ".ldtk"];

/**
 * Checks if a given path should be excluded based on excludedDirs
 * @param {string} currentPath The path to check
 * @returns {boolean} True if the path should be excluded
 */
function shouldExclude(currentPath) {
  const relativePath = path.relative(process.cwd(), currentPath);
  return excludedDirs.some((dir) =>
    path.normalize(relativePath).startsWith(path.normalize(dir))
  );
}

/**
 * Recursively reads directories, finds files, and prints their content or skip notice.
 * Uses absolute paths internally but prints paths relative to process.cwd().
 * @param {string} currentAbsolutePath The absolute path of the directory currently being scanned.
 */
function readAndPrintFilesRecursive(currentAbsolutePath) {
  try {
    if (shouldExclude(currentAbsolutePath)) {
      return; // Skip excluded directories
    }

    if (!fs.existsSync(currentAbsolutePath)) {
      const relativePath = path.relative(process.cwd(), currentAbsolutePath);
      console.warn(
        `Warning: Path no longer exists during scan, skipping: "${path.normalize(
          relativePath
        )}"`
      );
      return;
    }

    const dirStats = fs.statSync(currentAbsolutePath);
    if (!dirStats.isDirectory()) {
      const relativePath = path.relative(process.cwd(), currentAbsolutePath);
      console.warn(
        `Warning: Path is not a directory, skipping: "${path.normalize(
          relativePath
        )}"`
      );
      return;
    }

    const entries = fs.readdirSync(currentAbsolutePath);

    entries.forEach((entry) => {
      const fullAbsolutePath = path.join(currentAbsolutePath, entry);
      if (shouldExclude(fullAbsolutePath)) {
        return;
      }

      const relativePath = path.relative(process.cwd(), fullAbsolutePath);
      const normalizedRelativePath = path.normalize(relativePath);

      try {
        const stats = fs.statSync(fullAbsolutePath);

        if (stats.isFile()) {
          const ext = path.extname(fullAbsolutePath).toLowerCase();
          if (allowedExtensions.includes(ext)) {
            const content = fs.readFileSync(fullAbsolutePath, "utf8");
            console.log(`${normalizedRelativePath}:`);
            console.log("```");
            console.log(content);
            console.log("```");
            console.log("");
          } else {
            console.log(
              `${normalizedRelativePath}: binary file\n`
            );
          }
        } else if (stats.isDirectory()) {
          readAndPrintFilesRecursive(fullAbsolutePath);
        }
        // Other types (links, devices, etc.) are ignored
      } catch (entryError) {
        console.error(
          `\nError processing entry "${normalizedRelativePath}": ${entryError.message}`
        );
      }
    });
  } catch (dirReadError) {
    const relativeDirPath = path.relative(process.cwd(), currentAbsolutePath);
    console.error(
      `\nFailed to read directory "${path.normalize(relativeDirPath)}": ${
        dirReadError.message
      }`
    );
  }
}

// --- Main Execution ---
for (const targetDir of targetDirectories) {
  const absoluteTargetPath = path.resolve(process.cwd(), targetDir);

  if (!fs.existsSync(absoluteTargetPath)) {
    console.error(
      `Error: Starting directory "${targetDir}" (resolved to "${absoluteTargetPath}") not found.`
    );
    continue;
  }

  if (!fs.statSync(absoluteTargetPath).isDirectory()) {
    console.error(
      `Error: Starting path "${targetDir}" (resolved to "${absoluteTargetPath}") is not a directory.`
    );
    continue;
  }

  console.log(`\n=== Scanning directory: ${targetDir} ===\n`);
  readAndPrintFilesRecursive(absoluteTargetPath);
}
