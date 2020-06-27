import {resolve} from "path";
import typescript from "rollup-plugin-typescript2";
import {terser} from "rollup-plugin-terser";

const input = resolve(__dirname, "src/NativeUi.ts");

const file = (min) => {
    const path = `dist/nativeui/nativeui${min ? ".min" : ""}.js`
    return {
        file: resolve(__dirname, path),
        name: "NativeUI",
        format: "es",
        plugins: [ min ? terser() : void 0 ]
    }
}

export default {
    input,
    output: [
        file(false),
        file(true)
    ],
    external: ["alt-client", "natives"],
    plugins: [
        typescript({useTsconfigDeclarationDir: true, abortOnError: false})
    ]
}; 