const extensionEntryPattern = "extensions/**/src/extension.ts";
const extensionEntrySuffix = "/src/extension.ts";
const extensionOutput = "extension.cjs";
const packageRoot = `${import.meta.dir}/..`;
const production = Bun.argv.includes("--production");

async function deleteIfExists(filePath: string) {
  try {
    await Bun.file(filePath).delete();
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }
}

const entryGlob = new Bun.Glob(extensionEntryPattern);
const extensionEntries: string[] = [];

for await (const entry of entryGlob.scan({
  cwd: packageRoot,
  onlyFiles: true,
  absolute: false,
})) {
  extensionEntries.push(entry);
}

extensionEntries.sort();

if (extensionEntries.length === 0) {
  throw new Error(`[build-extensions] no entries matched ${extensionEntryPattern}`);
}

for (const entry of extensionEntries) {
  if (!entry.endsWith(extensionEntrySuffix)) {
    throw new Error(`[build-extensions] unexpected extension entry: ${entry}`);
  }

  const extensionDir = entry.slice(0, -extensionEntrySuffix.length);
  const extensionName = extensionDir.slice("extensions/".length);
  const outdir = `${packageRoot}/${extensionDir}/dist`;

  await deleteIfExists(`${outdir}/extension.js`);
  await deleteIfExists(`${outdir}/extension.js.map`);
  await deleteIfExists(`${outdir}/${extensionOutput}`);
  await deleteIfExists(`${outdir}/${extensionOutput}.map`);

  const result = await Bun.build({
    entrypoints: [`${packageRoot}/${entry}`],
    outdir,
    packages: "bundle",
    format: "cjs",
    naming: {
      entry: extensionOutput,
    },
    target: "node",
    minify: production,
    sourcemap: production ? "none" : "external",
  });

  for (const log of result.logs) {
    console.error(log);
  }

  if (!result.success) {
    throw new Error(`[build-extensions] failed to build ${extensionName}`);
  }

  console.log(
    `[build-extensions] built ${extensionName} -> ${extensionDir}/dist/${extensionOutput}`,
  );
}
