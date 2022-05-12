import React, { useState, useCallback, useContext } from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Menubar from "../Menubar/Menubar";
import Sidebar from "../Sidebar/Sidebar";
import ChirpModal from "./ChirpModal";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
	const [composeNewChirp, setComposeNewChirp] = useState(false);
	const [onExplore, setOnExplore] = useState(false);
	const [showThemeDropdown, setShowThemeDopdown] = useState(false);
	const [checkedTheme, setCheckedTheme] = useState(2);
	const { state } = useContext(AuthContext);

	const onOpenNewChirpHandler = useCallback(() => {
		setComposeNewChirp(true);
	}, []);

	const onCloseNewChirpHandler = useCallback(() => {
		setComposeNewChirp(false);
	}, []);
	const toggleDropdown = () => {
		setShowThemeDopdown(!showThemeDropdown);
	};
	const changeTheme = (index) => {
		console.log(index);
		const container = document.documentElement;
		if (index === 0) {
			container.className = "lightTheme";
		} else if (index === 1) {
			container.className = "dimTheme";
		} else {
			container.className = "darkTheme";
		}
		setCheckedTheme(index);
	};
	const isMobile = window.screen.width < 800;

	return (
		<div className={styles["layout"]}>
			<Menubar
				onOpenModal={onOpenNewChirpHandler}
				showDropdown={showThemeDropdown}
				username={state.user}
				toggleDropdown={toggleDropdown}
				checkedTheme={checkedTheme}
				changeTheme={changeTheme}
			/>
			<main className={styles["layout__main"]}>
				<Outlet context={{ setOnExplore }} />
			</main>
			{!isMobile && <Sidebar onExplore={onExplore} />}
			{composeNewChirp && <ChirpModal onClose={onCloseNewChirpHandler} />}
		</div>
	);
};

export default MainLayout;
