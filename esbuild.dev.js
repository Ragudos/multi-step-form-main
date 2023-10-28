import * as esbuild from "esbuild";

try {
    const ctx = await esbuild.context({
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
        banner: {
            js: '(() => { (new EventSource("/esbuild")).addEventListener("change", () => location.reload()); })();',
        },
    });

    const r = await ctx.serve({
        servedir: "dist",
        port: 3000,
    });

    console.log(`Development Server Started on ${r.host}:${r.port}`);
} catch (err) {
    console.error(err);
}
