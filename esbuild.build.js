import * as esbuild from "esbuild";
import fs from "fs";

try {
    const build = await esbuild.build({
        bundle: true,
        minify: true,
        splitting: true,
        metafile: true,
        loader: {
            ".html": "copy",
            ".png": "copy",
            ".svg": "copy",
            ".webp": "copy",
            ".jpg": "copy",
            ".ico": "copy",
            ".webmanifest": "copy",
            ".mp4": "copy",
            ".ttf": "copy",
        },
        format: "esm",
        outdir: "dist",
        assetNames: "assets/[name]",
        platform: "browser",
        entryNames: "[dir]/[name]",
        entryPoints: ["index.html", "./src/**", "./public/assets/**"],
        logLevel: "silent",
    });

    fs.writeFile("dist/meta.json", JSON.stringify(build.metafile));
} catch (err) {
    console.error(err);
}
