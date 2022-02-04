function getProgressBar(surveyData, state) {
	const $progressBar = document.createElement("div");

	surveyData.forEach(function (q, index) {
		const $progressItem = document.createElement("button");
		$progressItem.dataset.id = index;

		if (state.qurrentQuestion === index) {
			$progressItem.className = "current";
		}

		if (index > 0 && typeof surveyData[index - 1].answer === "undefined") {
			$progressItem.disabled = "disabled";
		}

		$progressBar.appendChild($progressItem);
	});

	return $progressBar;
}

function getCurrentQuestion(q, state) {
	const $question = document.createElement("div");
	$question.id = "question";

	const $title = document.createElement("h3");
	$title.appendChild(document.createTextNode(q.question));
	$question.appendChild($title);

	const $options = document.createElement("div");
	$options.className = "options";

	q.answers.forEach(function (option, index) {
		const $optionWrap = document.createElement("div");
		const $option = document.createElement("input");
		const $optionLabel = document.createElement("label");

		$option.type = "radio";
		$option.name = state.qurrentQuestion;
		$option.value = index;
		$option.id = index;

		if (q.answer === index) {
			$option.checked = true;
		}

		$optionLabel.htmlFor = index;
		$optionLabel.appendChild(document.createTextNode(option));

		$optionWrap.appendChild($option);
		$optionWrap.appendChild($optionLabel);

		$options.appendChild($optionWrap);
	});

	$question.appendChild($options);

	return $question;
}

function getCurrentNav(q, state) {
	const $nav = document.createElement("div");
	$nav.id = "nav";

	if (state.nav.prev.exists) {
		const $prev = document.createElement("button");
		$prev.id = "prev";
		$prev.appendChild(document.createTextNode("Prev"));

		if (state.nav.prev.disabled) {
			$prev.disabled = "disabled";
		}

		$nav.appendChild($prev);
	}

	if (state.nav.next.exists) {
		const $next = document.createElement("button");
		$next.id = "next";
		$next.appendChild(document.createTextNode("Next"));

		if (state.nav.next.disabled) {
			$next.disabled = "disabled";
		}

		$nav.appendChild($next);
	}

	if (state.nav.submit.exists) {
		const $submit = document.createElement("button");
		$submit.id = "submit";
		$submit.appendChild(document.createTextNode("Submit"));

		if (state.nav.submit.disabled) {
			$submit.disabled = "disabled";
		}

		$nav.appendChild($submit);
	}

	return $nav;
}

function getFinalScreen(surveyData) {
	const $finalScreen = document.createElement("div");
	$finalScreen.id = "final";

	const $mainTitle = document.createElement("h2");
	$mainTitle.id = "main-title";
	$mainTitle.appendChild(document.createTextNode("Your answers"));
	$finalScreen.appendChild($mainTitle);

	surveyData.forEach(function (q, index) {
		const $question = document.createElement("div");
		$question.id = "question";

		const $title = document.createElement("h3");
		$title.appendChild(document.createTextNode(q.question));
		$question.appendChild($title);

		const $options = document.createElement("div");
		$options.className = "options";

		q.answers.forEach(function (option, index) {
			const $option = document.createElement("div");
			$option.appendChild(document.createTextNode(option));

			if (q.answer === index) {
				$option.className = "selected";
			}

			$options.appendChild($option);
		});

		$question.appendChild($options);

		$finalScreen.appendChild($question);
	});

	return $finalScreen;
}

function getCurrentState(state, surveyData) {
	if (state.qurrentQuestion === 0 && state.surveyLength !== 1) {
		// first question
		state.nav = {
			prev: {
				exists: false,
				disabled: true,
			},
			next: {
				exists: true,
				disabled:
					typeof surveyData[state.qurrentQuestion].answer !==
					"undefined"
						? false
						: true,
			},
			submit: {
				exists: false,
				disabled: true,
			},
		};
	} else if (
		(state.qurrentQuestion > 0 &&
			state.qurrentQuestion === state.surveyLength - 1) ||
		state.surveyLength === 1
	) {
		// last question
		state.nav = {
			prev: {
				exists: state.surveyLength === 1 ? false : true,
				disabled: false,
			},
			next: {
				exists: false,
				disabled: true,
			},
			submit: {
				exists: true,
				disabled:
					typeof surveyData[state.qurrentQuestion].answer !==
					"undefined"
						? false
						: true,
			},
		};
	} else {
		state.nav = {
			prev: {
				exists: true,
				disabled: false,
			},
			next: {
				exists: true,
				disabled:
					typeof surveyData[state.qurrentQuestion].answer !==
					"undefined"
						? false
						: true,
			},
			submit: {
				exists: false,
				disabled: true,
			},
		};
	}

	return state;
}

fetch("input_data.json")
	.then((res) => res.json())
	.then((surveyData) => {
		const $progress = document.querySelector("#progress");
		const $survey = document.querySelector("#survey");
		const $navWrap = document.querySelector("#nav-wrap");

		let state = {
			nav: {
				prev: {
					exists: false,
					disabled: true,
				},
				next: {
					exists: true,
					disabled: true,
				},
				submit: {
					exists: false,
					disabled: true,
				},
			},
			surveyLength: surveyData.length,
			qurrentQuestion: 0, // current question index
		};

		if (state.surveyLength === 1) {
			state.nav = {
				prev: {
					exists: false,
					disabled: true,
				},
				next: {
					exists: false,
					disabled: true,
				},
				submit: {
					exists: true,
					disabled: true,
				},
			};
		}

		let $progressBar = getProgressBar(surveyData, state);
		let $question = getCurrentQuestion(
			surveyData[state.qurrentQuestion],
			state
		);
		let $nav = getCurrentNav(surveyData[state.qurrentQuestion], state);

		$progress.replaceChildren($progressBar);
		$survey.replaceChildren($question);
		$navWrap.replaceChildren($nav);

		$progress.addEventListener("click", function (e) {
			if (e.target.dataset.id) {
				state.qurrentQuestion = parseInt(e.target.dataset.id);

				state = getCurrentState(state, surveyData);

				let $progressBar = getProgressBar(surveyData, state);
				let $question = getCurrentQuestion(
					surveyData[state.qurrentQuestion],
					state
				);
				let $nav = getCurrentNav(
					surveyData[state.qurrentQuestion],
					state
				);

				$progress.replaceChildren($progressBar);
				$survey.replaceChildren($question);
				$navWrap.replaceChildren($nav);
			}
		});

		$navWrap.addEventListener("click", function (e) {
			if (e.target) {
				if (e.target.id === "submit") {
					fetch("submit.php", {
						method: "post",
						body: JSON.stringify(surveyData),
						headers: {
							"Content-Type": "application/json",
						},
					})
						.then((res) => res.json())
						.then((response) => {
							if (response) {
								let $finalScreen = getFinalScreen(surveyData);

								$progress.innerHTML = "";
								$navWrap.innerHTML = "";
								$survey.replaceChildren($finalScreen);
							}
						})
						.catch((error) => console.log(error));

					return;
				}

				if (e.target.id === "prev") {
					state.qurrentQuestion--;
					state = getCurrentState(state, surveyData);
				} else if (e.target.id === "next") {
					state.qurrentQuestion++;
					state = getCurrentState(state, surveyData);
				}

				let $progressBar = getProgressBar(surveyData, state);
				let $question = getCurrentQuestion(
					surveyData[state.qurrentQuestion],
					state
				);
				let $nav = getCurrentNav(
					surveyData[state.qurrentQuestion],
					state
				);

				$progress.replaceChildren($progressBar);
				$survey.replaceChildren($question);
				$navWrap.replaceChildren($nav);
			}
		});

		$survey.addEventListener("change", function (e) {
			if (e.target && e.target.tagName.toLowerCase() === "input") {
				surveyData[state.qurrentQuestion]["answer"] = parseInt(
					e.target.value
				);

				state = getCurrentState(state, surveyData);

				let $progressBar = getProgressBar(surveyData, state);
				let $nav = getCurrentNav(
					surveyData[state.qurrentQuestion],
					state
				);

				$progress.replaceChildren($progressBar);
				$navWrap.replaceChildren($nav);
			}
		});
	})
	.catch((err) => console.error(err));
