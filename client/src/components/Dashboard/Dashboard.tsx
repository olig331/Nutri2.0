import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
	LoggedInUserSettingsContext,
	LoggedInIDContext,
	NavigatedFromTrackerContext,
	SignedOutContext,
	NavigatedFromLoginContext,
} from "../../Context/Context";
import { UserInfo } from "../UserInfo/UserInfo";
import { BsPencilSquare, BsCalendar } from "react-icons/bs";
import { GiCog } from "react-icons/gi";
import { FaUserAlt } from "react-icons/fa";
import "./dashboard.css";

export const Dashboard: React.FC = () => {
	// PAGE HISTORY HOOK FOR NAVIGATION
	const pageHistory: any = useHistory();
	//Date Variable for checking if dailyFood needs to be History
	const todaysDate = new Date().toLocaleDateString();

	// Toggle Pop Up State
	const [showPopUp, setshowpopUp] = useState<boolean>(false);
	const [finishLoad, setfinishLoad] = useState<boolean>(false);

	//CONTEXT
	const { navigatedFromTracker, setnavigatedFromTracker } = useContext(
		NavigatedFromTrackerContext
	);
	const { loggedInID } = useContext(LoggedInIDContext);
	const { loggedInUserSettings, setLoggedInUserSettings } = useContext(
		LoggedInUserSettingsContext
	);
	const { setsignedOut } = useContext(SignedOutContext);
	const { navigatedFromLogin, setnavigatedFromLogin } = useContext(
		NavigatedFromLoginContext
	);

	// IF USER HAS NAVIGATED FROM TRACKER USER DATA WILL BE UPDATED
	useEffect(() => {
		if (navigatedFromTracker) {
			reFetchUserData();
		}
	}, []);

	// FUNCTION TO UPDATE DATA
	const reFetchUserData = async (): Promise<void> => {
		const response = await fetch(
			`https://nutriserverside.herokuapp.com/refetchUserData?userId=${loggedInID}`,
			{
				method: "GET",
			}
		);
		const data = await response.json();
		setLoggedInUserSettings(data);
		setnavigatedFromTracker(false);
	};

	//when logout button is clicked state for displaying log out confirmation
	const togglePopUp = (): void => {
		showPopUp ? setshowpopUp(false) : setshowpopUp(true);
	};

	// When History tab is clicked this function will update the databse and set the previous days DailyFood to the history
	const updateHistory = async (): Promise<void> => {
		await fetch(
			`https://nutriserverside.herokuapp.com/updateUserHistory?userId=${loggedInID}`,
			{
				method: "POST",
				body: JSON.stringify(loggedInUserSettings.usersDailyFood),
			}
		)
			.then((response) => {
				pageHistory.replace("/history");
				return response.text();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// Resetting the Databses DailyFood to empty Array when it is no longer the same day.
	const resetFood = async (): Promise<void> => {
		await fetch(
			`https://nutriserverside.herokuapp.com/resetFood?userId=${loggedInID}`,
			{
				method: "POST",
				body: JSON.stringify([]),
			}
		)
			.then((response) => {
				pageHistory.replace("/tracker");
				console.log(response.text());
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// useEffect(() => {
	//   console.log(finishLoad)
	//   console.log(navigatedFromLogin)
	//   if (!finishLoad && navigatedFromLogin === true) {
	//     setTimeout(() => {
	//       setfinishLoad(true)
	//       setnavigatedFromLogin(false)
	//     }, 1500);
	//   };
	// }, []);

	return (
		<div className="dashboard_parent">
			<div className="user_info">
				<UserInfo />
			</div>
			<div className="inner_dash">
				<div
					className="tracker menu_item"
					onClick={() =>
						loggedInUserSettings.usersDailyFood[0] === todaysDate
							? pageHistory.replace("/tracker")
							: resetFood()
					}
				>
					<BsPencilSquare />
					<span>Tracker</span>
				</div>

				<div
					className="history menu_item"
					onClick={() => {
						loggedInUserSettings.usersDailyFood[0] !== todaysDate &&
						loggedInUserSettings.usersDailyFood.length > 0
							? updateHistory()
							: pageHistory.replace("/history");
					}}
				>
					<BsCalendar />
					<span>History</span>
				</div>
				<br />
				<div
					className="settings menu_item"
					onClick={() => pageHistory.replace("/settings")}
				>
					<GiCog />
					<span>Settings</span>
				</div>

				<div className="change_user menu_item" onClick={togglePopUp}>
					<FaUserAlt />
					<span>Change User</span>
				</div>
			</div>

			<div>
				{showPopUp ? (
					<div className="log_out_popup">
						<h5>Are you sure you want to log out?</h5>
						<Link to="/">
							<button onClick={setsignedOut(true)}>
								Log Out
							</button>
						</Link>
						<button onClick={togglePopUp}>Go Back</button>
					</div>
				) : null}
			</div>
		</div>
	);
};
