import {useState} from "react";
import {theme} from "antd";

// 获取风格
const getTheme = (): any => {
    return {
        token: {
            colorPrimary: "rgba(7,53,237,1)",
            colorInfo: "rgba(7,53,237,1)",
        },
        algorithm: [theme.compactAlgorithm],
    }
}
/**
 * 获取主题模式
 */
const getMode = (): string => {
    // return "dark"
    const mode = localStorage?.getItem("theme")
    if (mode == "light" || mode == "dark") {
        return mode;
    }
    return "auto"
}
/**
 * 设置主题模式
 * @param mode 模式
 */
const setMode = (mode): void => {
    localStorage?.setItem("theme", mode);
}

export default () => {
    const [themes, setThemes] = useState<any>(getTheme());//系统主题
    const [mode, setMode2] = useState<any>(getMode());//系统主题模式
    const [appearance, setAppearance] = useState<any>(null);//当前主题风格

    const lightMode = "light";//亮色

    const darkMode = "dark";//暗色

    const autoMode = "auto";//跟随系统

    /**
     * 设置模式名称
     */
    const getModeName = (mode) => {
        if (mode == lightMode) {
            return "亮色风格";
        }
        if (mode == darkMode) {
            return "暗色风格";
        }
        return "跟随系统";
    }

    /**
     * 设置亮色模式
     */
    const setLightMode = () => {
        setMode(lightMode);
        setMode2(lightMode)
        setAppearance(lightMode);
    }

    /**
     * 设置暗色模式
     */
    const setDarkMode = () => {
        setMode(darkMode);
        setMode2(darkMode);
        setAppearance(darkMode);
    }

    /**
     * 设置跟随系统模式
     */
    const setAutoMode = () => {
        setMode(autoMode);
        setMode2(autoMode);
        setAppearance(null);
    }

    /**
     * 是否为亮色模式
     */
    const isLightMode = () => {
        return mode == lightMode;
    }

    /**
     * 是否为暗色模式
     */
    const isDarkMode = () => {
        return mode == darkMode;
    }

    /**
     * 是否为跟随系统模式
     */
    const isAutoMode = () => {
        return mode == autoMode;
    }

    /**
     * 当前是否为亮色风格
     */
    const isLightTheme = () => {
        return appearance == lightMode;
    }

    /**
     * 当前是否为暗色风格
     */
    const isDarkTheme = () => {
        return appearance == darkMode;
    }

    /**
     * 模式切换
     */
    const toggle = () => {
        if (isAutoMode()) {
            setLightMode();
        } else if (isLightMode()) {
            setDarkMode();
        } else {
            setAutoMode();
        }
    }

    return {
        themes,
        setThemes,
        appearance,
        setAppearance,
        mode,
        getModeName,
        lightMode,
        darkMode,
        autoMode,
        setLightMode,
        setDarkMode,
        setAutoMode,
        isLightMode,
        isDarkMode,
        isAutoMode,
        isLightTheme,
        isDarkTheme,
        toggle
    };
};
