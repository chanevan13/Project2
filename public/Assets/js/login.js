const form1 = document.querySelector("#login-form");
const signupBtn = document.querySelector("#signup");
const userType1 = document.querySelector("#user-type");
console.log("login js");
const login = async (e) => {
	console.log("hit login script");
	// check if farmer or customer
	e.preventDefault();
	// farmer login
	const response = await fetch("/api/users/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: document.querySelector("#username-input").value,
			password: document.querySelector("#password-input").value,
		}),
	});
	if (response.status === 200) {
		window.location.assign("/dashboard");
	} else {
		alert("wrong credentials buddy");
	}
	// customer login
};

const form = document.querySelector("#login-form");
form.addEventListener("submit", login);

//const userType = document.querySelector("#user-type");

const signup = async (e) => {
	// check if farmer or customer
	event.preventDefault();
	console.log("test");
	// farmer signup
	const response = await fetch("/api/users", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: document.querySelector("#username-signup").value,
			password: document.querySelector("#password-signup").value,
		}),
	});
	if (response.status === 200) {
		window.location.assign("/dashboard");
	} else {
		const { error } = await response.json();
		alert(error);
	}
	// customer signup
};

signupBtn.addEventListener("click", signup);
