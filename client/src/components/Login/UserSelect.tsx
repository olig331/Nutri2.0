import React, { useContext, useState, useEffect } from "react";
import {
	LoggedInUserSettingsContext,
	UserAuthedContext,
	LoggedInIDContext,
	SignedOutContext,
	NavigatedFromLoginContext,
} from "../../Context/Context";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../imgs/NutriLogo.png";
import { RiUserAddLine } from "react-icons/ri";
import "./userSelect.css";
import { LoadingWheel } from "../LoadingWheel/LoadingWheel";
const ipcRenderer = window.require("electron").ipcRenderer;

export const UserSelect: React.FC = () => {
	// const getIp = async () =>{
	//   const response = await fetch("https://ipgeolocation.abstractapi.com/v1/?api_key=13109748f2a64efc9ff327573580b6da")

	//   const data = await response.json();
	//   console.log(data);

	// }

	// getIp()

	// For navigation through the application
	const pageHistory = useHistory();

	//STATE
	const [enterUserName, setenterUserName] = useState<string>("");
	const [password, setpassword] = useState<string>("");
	const [loginattemptfailed, setloginattemptfailed] = useState<boolean>(
		false
	);
	const [renderLoader, setrenderLoader] = useState<boolean>(false);
	//const [forgotPasswordPopUp, setforgotPasswordPopUp] = useState<boolean>(false)

	// CONTEXT
	const { setnavigatedFromLogin } = useContext(NavigatedFromLoginContext);
	const { setloggedInID } = useContext(LoggedInIDContext);
	const { setuserAuthed } = useContext(UserAuthedContext);
	const { setLoggedInUserSettings } = useContext(LoggedInUserSettingsContext);
	const { signedOut } = useContext(SignedOutContext);

	// SETTING STATE FROM LOG IN INPUT
	const enteredUserName = (e: React.FormEvent<HTMLInputElement>): void => {
		setenterUserName(e.currentTarget.value);
		setloginattemptfailed(false);
	};

	// SETTING STATE FOR ENTERED PASSWORD
	const enteredPassword = (e: React.FormEvent<HTMLInputElement>): void => {
		setpassword(e.currentTarget.value);
		setloginattemptfailed(false);
	};

	ipcRenderer.on("protocol-route", function (ev: any, route: any) {
		console.log("protocol-route called from main process");
		console.log(pageHistory);
		pageHistory.push(route);
		console.log(pageHistory);
	});

	// CHECK IF USER EXISTS ON DB ? LOGIN : REJECT
	const login = async (): Promise<void> => {
		setrenderLoader(true);
		const response = await fetch(
			`https://nutriserverside.herokuapp.com/login`,
			{
				method: "POST",
				body: JSON.stringify({
					userName: enterUserName,
					passWord: password,
				}),
			}
		);
		let data = await response.json();
		console.log(data);
		delete data.password;
		if (data !== "401") {
			//console.log("user Found")
			setuserAuthed(true);
			setloggedInID(data._id);
			setLoggedInUserSettings(data);
			setnavigatedFromLogin(true);
			pageHistory.replace("/dashboard"); // will navigate to /dashboard page on succesfull user auth
		} else {
			setloginattemptfailed(true);
		}
	};

	// if user signed out calling refresh to set all app state back to default
	useEffect(() => {
		signedOut ? refreshApp() : console.log("no refresh needed");
	}, []);

	const refreshApp = (): void => {
		window.location.reload();
	};

	return (
		<div className="user_select_parent">
			<div className="login_inputs">
				<img src={Logo} alt="Logo Img" />
				{/* Break quick fix for input bars staying aligned  */}
				<br />
				<input
					style={
						loginattemptfailed
							? { border: "1px solid red" }
							: { outlineColor: "none" }
					}
					type="text"
					name="userName"
					placeholder="Username"
					onChange={enteredUserName}
				/>

				<input
					style={
						loginattemptfailed
							? { border: "1px solid red" }
							: { outlineColor: "none" }
					}
					type="password"
					name="password"
					placeholder="Password"
					onChange={enteredPassword}
				/>

				<button
					className="login_button"
					onClick={() => {
						login();
					}}
				>
					Log In
					{/* {!loginattemptfailed && renderLoader ? <LoadingWheel width={"5px"} height={"5px"}/> : "" } */}
				</button>

				<div className="forgot_buttons">
					<Link to="forgotUserName">
						<button className="forgot_button">
							Forgot Username
						</button>
					</Link>

					<Link to="/forgotPassword">
						<button className="forgot_button">
							Forgot password
						</button>
					</Link>
				</div>

				<Link to="/setup" style={{ textDecoration: "none" }}>
					<div className="create_user">
						<span>
							<RiUserAddLine />
						</span>
						<h5>Sign Up</h5>
					</div>
				</Link>
			</div>
		</div>
	);
};
