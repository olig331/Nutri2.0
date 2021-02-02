import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { rejects } from "assert";
import { UserInfo } from "../UserInfo/UserInfo";
import { RiDashboardFill } from "react-icons/ri";
import "./settingsForm.css";
import {
	UsersSettingsContext,
	LoggedInUserSettingsContext,
	LoggedInIDContext,
	UserAuthedContext,
} from "../../Context/Context";

export const SettingsForm: React.FC = () => {
	const ageArray: number[] = Array.from(Array(100), (_, i) => i + 1);

	const pageHistory = useHistory();

	//Context
	const { userAuthed } = useContext(UserAuthedContext);
	const { userSettings, setuserSettings } = useContext(UsersSettingsContext);
	const { loggedInUserSettings, setLoggedInUserSettings } = useContext(
		LoggedInUserSettingsContext
	);
	const { loggedInID } = useContext(LoggedInIDContext);

	const handleSettingsOnChange = (e: any): void => {
		var nestedCopy =
			loggedInUserSettings === undefined
				? { ...userSettings.usersPersonalSettings }
				: { ...loggedInUserSettings.usersPersonalSettings };

		//console.log(nestedCopy);
		var fullCopy = { ...userSettings };
		nestedCopy[e.target.name] = e.target.value;
		fullCopy.usersPersonalSettings = nestedCopy;
		setuserSettings(fullCopy);
	};

	// ADD NEW USER TO MONGODB
	const userSetUpComplete = async (): Promise<void> => {
		await fetch("https://nutriserverside.herokuapp.com/createUser", {
			method: "POST",
			body: JSON.stringify(userSettings),
		})
			.then((response) => {
				sendComfEmail();
				pageHistory.replace("/SignUpComplete");
				return response.text();
			})
			.catch((error) => {
				rejects(error);
			});
	};

	const sendComfEmail = async (): Promise<void> => {
		const response = await fetch(
			"https://nutriserverside.herokuapp.com/sendConfEmail",
			{
				method: "POST",
				body: JSON.stringify(userSettings),
			}
		);

		const data = await response.json();
		//console.log(data);
	};

	const saveUserSettings = async (): Promise<void> => {
		//console.log(userSettings.usersPersonalSettings);
		const response = await fetch(
			`https://nutriserverside.herokuapp.com/updateUsersSettings?userId=${loggedInID}`,
			{
				method: "POST",
				body: JSON.stringify(userSettings.usersPersonalSettings),
			}
		);
		const data = await response.json();
		if (data.status === 200) {
			let fullCopy = { ...loggedInUserSettings };
			fullCopy.usersPersonalSettings = userSettings.usersPersonalSettings;
			setLoggedInUserSettings(fullCopy);
		}
		pageHistory.replace("/dashboard");
	};

	return (
		<div className="settings_form_parent">
			{userAuthed ? (
				<>
					<div className="user_info">
						<UserInfo />
					</div>{" "}
					<Link to="/dashboard">
						<div className="dashboard_button">
							<RiDashboardFill />
						</div>
					</Link>
				</>
			) : null}
			<div className="settings_table_container">
				<table>
					{/* GENDER SECTION */}
					<tbody>
						<tr>
							<td className="left_side">Gender</td>
							<td className="right_side">
								<label className="container">
									Male
									<input
										className="radio"
										name="gender"
										value="male"
										type="radio"
										onChange={handleSettingsOnChange}
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.gender === "male"
										}
									/>
									<span className="checkmark"></span>
								</label>

								<label className="container">
									Female
									<input
										className="radio"
										name="gender"
										value="female"
										type="radio"
										onChange={handleSettingsOnChange}
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.gender === "female"
										}
									/>
									<span className="checkmark"></span>
								</label>
							</td>
						</tr>
						{/* AGE SECTION */}
						<tr>
							<td className="left_side">Age</td>
							<td className="right_side">
								<label>
									<select
										className="age_dropdown"
										required
										name="age"
										defaultValue={
											userAuthed
												? loggedInUserSettings
														.usersPersonalSettings
														.age
												: 1
										}
										onChange={handleSettingsOnChange}
									>
										{ageArray.map((x: number) => (
											<option key={x} value={x}>
												{x}
											</option>
										))}
									</select>
								</label>
							</td>
						</tr>
						{/* WEIGHT SECTION */}
						<tr>
							<td className="left_side">Weight</td>
							<td className="right_side">
								<label className="field">
									<input
										type="number"
										name="weight"
										onChange={handleSettingsOnChange}
										required
										defaultValue={
											userAuthed
												? loggedInUserSettings
														.usersPersonalSettings
														.weight
												: 0
										}
									/>
								</label>
								<label className="container">
									LBS
									<input
										className="radio"
										type="radio"
										name="weightUnit"
										value="lbs"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.weightUnit === "lbs"
										}
										onChange={handleSettingsOnChange}
										required
									/>
									<span className="checkmark"></span>
								</label>
								<label className="container">
									KG
									<input
										className="radio"
										type="radio"
										name="weightUnit"
										value="kg"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.weightUnit === "kg"
										}
										onChange={handleSettingsOnChange}
										required
									/>
									<span className="checkmark"></span>
								</label>
							</td>
						</tr>
						{/* HEIGHT SECTION */}
						<tr>
							<td className="left_side">Height</td>
							<td className="right_side">
								<label>
									<input
										type="number"
										name="height"
										onChange={handleSettingsOnChange}
										required
										defaultValue={
											userAuthed
												? loggedInUserSettings
														.usersPersonalSettings
														.height
												: 0
										}
									/>
								</label>
								<label className="container">
									Inch
									<input
										className="radio"
										type="radio"
										name="heightUnit"
										onChange={handleSettingsOnChange}
										required
										value="inches"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.heightUnit === "inches"
										}
									/>
									<span className="checkmark"></span>
								</label>
								<label className="container">
									CM
									<input
										className="radio"
										type="radio"
										name="heightUnit"
										value="cm"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.heightUnit === "cm"
										}
										onChange={handleSettingsOnChange}
										required
									/>
									<span className="checkmark"></span>
								</label>
							</td>
						</tr>
						{/* GOAL SECTION */}
						<tr>
							<td className="left_side">Goal</td>
							<td className="right_side">
								<label className="container">
									Lose
									<input
										className="radio"
										type="radio"
										name="goal"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings.goal ===
												"lose"
										}
										onChange={handleSettingsOnChange}
										value="lose"
										required
									/>
									<span className="checkmark"></span>
								</label>
								<label className="container">
									Maintain
									<input
										className="radio"
										type="radio"
										name="goal"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings.goal ===
												"maintain"
										}
										onChange={handleSettingsOnChange}
										value="maintain"
										required
									/>
									<span className="checkmark"></span>
								</label>
								<label className="container">
									Gain:
									<input
										className="radio"
										type="radio"
										name="goal"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings.goal ===
												"gain"
										}
										onChange={handleSettingsOnChange}
										value="gain"
										required
									/>
									<span className="checkmark"></span>
								</label>
							</td>
						</tr>
						{/* ACTIVITY LEVEL SECTION */}
						<tr>
							<td className="left_side activity">Activity</td>
							<td className="right_side activity">
								<label className="container">
									Sedatory
									<input
										className="radio"
										type="radio"
										name="activityLevel"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.activityLevel === "sedatory"
										}
										onChange={handleSettingsOnChange}
										value="sedatory"
										required
									/>
									<span className="checkmark"></span>
								</label>
								<label className="container">
									Light:
									<input
										className="radio"
										type="radio"
										name="activityLevel"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.activityLevel === "light"
										}
										onChange={handleSettingsOnChange}
										value="light"
										required
									/>
									<span className="checkmark"></span>
								</label>
								<label className="container">
									Medium
									<input
										className="radio"
										type="radio"
										name="activityLevel"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.activityLevel === "medium"
										}
										onChange={handleSettingsOnChange}
										value="medium"
										required
									/>
									<span className="checkmark"></span>
								</label>
								<label className="container">
									High
									<input
										className="radio"
										type="radio"
										name="activityLevel"
										defaultChecked={
											userAuthed &&
											loggedInUserSettings
												.usersPersonalSettings
												.activityLevel === "high"
										}
										onChange={handleSettingsOnChange}
										value="high"
										required
									/>
									<span className="checkmark"></span>
								</label>
							</td>
						</tr>
					</tbody>
				</table>
				<button
					className="finish_button"
					onClick={userAuthed ? saveUserSettings : userSetUpComplete}
				>
					{userAuthed ? "Save Settings" : "Complete Set Up"}
				</button>
			</div>
		</div>
	);
};
