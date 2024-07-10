import { defineConfig } from "umi";
import routes from "./routes"
import defaultSetting from "./defaultSetting";
export default defineConfig({
    routes,
    npmClient: 'yarn',
    title:defaultSetting?.title,
    base:defaultSetting?.basePath,
    publicPath:defaultSetting?.basePath,
    outputPath:"./dist" + defaultSetting?.basePath,
    plugins:[
        '@umijs/plugins/dist/model',
    ],
    model:{},
    favicons: [
        defaultSetting?.favicons?.toString(),
    ],
    history: {
        type: 'browser'
    },
    hash: true,
});
