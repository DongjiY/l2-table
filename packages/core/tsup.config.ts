import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "iife"],
  dts: true,
  outDir: "dist",
  sourcemap: true,
  clean: true,
  globalName: "L2Table",
  esbuildPlugins: [
    {
      name: "inline-worker",
      setup(build) {
        build.onLoad({ filter: /src\/worker\/entrypoint-inline\.ts$/ }, async (args) => {
          const result = await build.esbuild.build({
            entryPoints: [args.path.replace("entrypoint-inline", "entrypoint")],
            bundle: true,
            write: false,
            format: "esm",
          });
          const code = result.outputFiles[0].text;
          return {
            contents: `export default ${JSON.stringify(code)}`,
            loader: "js",
          };
        });
      },
    },
  ]
});
