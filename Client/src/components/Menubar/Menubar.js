import React, { useContext } from "react";
import { MenuItemList } from "./MenuItems";
import MenuActions from "./MenuActions";
import { PATHS } from "../../constants/menu";
import styles from "./styles.module.css";
import Theme from "../Themes/Theme";
// import { useThemeContext } from "../../context/ThemeContext";
const Menubar = (props) => {
	const links = Object.keys(PATHS).map((path) => {
		let link = path.toLowerCase();
		if (link === "profile") link = `${props.username}`;
		if (link === "lists") link = "flow/lists";
		if (link === "bookmarks") link = "flow/bookmarks";
		return link;
	});
	const { showDropdown, toggleDropdown, checkedTheme, changeTheme } = props;

	// const test = useThemeContext();
	// console.log(test);

	return (
		<header className={styles.menu}>
			<nav className={styles.menu__nav}>
				<MenuItemList paths={PATHS} links={links} />
				<li className={styles.menu__list} onClick={toggleDropdown}>
					<span className={styles.menu__label}>Theme</span>
				</li>
				{showDropdown && (
					<Theme index={checkedTheme} changeTheme={changeTheme} />
				)}
				<MenuActions onOpenModal={props.onOpenModal} />
			</nav>
		</header>
	);
};

export default Menubar;
