import React from "react";
import "./styles.modules.css";
const themes = ["light", "dim", "dark"];
const Theme = ({ index, changeTheme }) => {
	return (
		<div>
			{themes.map((theme, idx) => {
				return (
					<div key={idx} className='theme-selector'>
						<label htmlFor={`#${theme}`}>{theme}</label>
						<input
							type='radio'
							id={`${theme}`}
							checked={idx === index ? true : false}
							onChange={() => changeTheme(idx)}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default Theme;
