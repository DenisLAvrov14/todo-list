import { useContext } from "react";
import { ThemeContext } from "../../providers/ThemeProvider";
import { BiSun, BiMoon } from "react-icons/bi";
import styles from "./ChangeTheme.module.css"

export const ChangeTheme = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <button className={styles.ChangeTheme} onClick={toggleTheme}>
            {theme === "dark" ? <BiSun /> : <BiMoon />}
        </button>
    );
}

export default ChangeTheme;
