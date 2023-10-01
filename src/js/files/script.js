// import { isMobile } from "./functions.js";
// Подключение списка активных модулей
// import { flsModules } from "./modules.js";

const categories = document.querySelectorAll('.category');
const green_leaf = document.querySelector('.categories__image-box');
const brown_leaf = document.querySelector('.category__leaf-box');

categories.forEach((item, index) => {
	item.addEventListener('click', () => {
		removeActive();
		item.classList.add('active');

		switch (index) {
			case 0:
				green_leaf.style.transform = "translate(-5px, -5px)";
				brown_leaf.style.transform = "translate(-5px, 0)";
				break;
			case 1:
				green_leaf.style.transform = "translate(5px, 0)";
				brown_leaf.style.transform = "translate(-10px, 0)";
				break;
			case 2:
				green_leaf.style.transform = "translate(15px, 0)";
				brown_leaf.style.transform = "translate(-15px, 0)";
				break;
			case 3:
				green_leaf.style.transform = "translate(25px, 0)";
				brown_leaf.style.transform = "translate(-20px, 0)";
				break;
			default:
				green_leaf.style.transform = "translate(0, 0)";
				brown_leaf.style.transform = "translate(0, 0)";
				break;
		}
	})
});

document.body.addEventListener('click', (e) => {
	if (!e.target.closest('.category')) {
		categories.forEach((item, index) => {
			if (item.classList.contains('active')) {
				switch (index) {
					case 0:
						green_leaf.style.transform = "translate(0px, 0px)";
						brown_leaf.style.transform = "translate(-5px, -5px)";
						break;
					case 1:
						green_leaf.style.transform = "translate(5px, 5px)";
						brown_leaf.style.transform = "translate(-10px, -5px)";
						break;
					case 2:
						green_leaf.style.transform = "translate(15px, 5px)";
						brown_leaf.style.transform = "translate(-15px, -5px)";
						break;
					case 3:
						green_leaf.style.transform = "translate(25px, 5px)";
						brown_leaf.style.transform = "translate(-20px, -5px)";
						break;
					default:
						green_leaf.style.transform = "translate(0, 0)";
						break;
				}
			}
		})
		removeActive();
	}
});

const removeActive = () => {
	categories.forEach(cat => {
		if (cat.classList.contains('active')) {
			cat.classList.remove('active');
		}
	})
}

const form = document.querySelector('.authorization__form');
form.addEventListener('submit', (e) => {
	formAction(e);
})

async function formAction(e) {
	const login = document.querySelector('input[name="login"]');
	const password = document.querySelector('input[name="password"]');
	const btn = document.querySelector('.authorization__btn');
	const message = document.querySelector('.authorization__message');
	const wrapper = document.querySelector('.authorization__wrapper');
	const close = document.querySelector('.authorization__close');

	const addPreloader = () => {
		form.classList.add('_sending');
		login.disabled = true;
		password.disabled = true;
		btn.disabled = true;
		const preloader = document.createElement('div');
		preloader.classList.add('preloader');
		const span = document.createElement('span');
		preloader.append(span, span.cloneNode(true), span.cloneNode(true));
		form.append(preloader);
	}

	const removePreloader = () => {
		const preloader = document.querySelector('.preloader');
		form.classList.remove('_sending');
		login.disabled = false;
		password.disabled = false;
		btn.disabled = false;
		preloader.remove();
	}

	const removeError = () => {
		if (form.classList.contains('_error')) {
			form.classList.remove('_error');
			message.textContent = '';
		}
	}

	const clearForm = () => {
		login.value = '';
		password.value = '';
	}

	login.addEventListener('input', removeError);
	password.addEventListener('input', removeError);
	close.addEventListener('click', () => {
		removeError();
		clearForm();
	});

	e.preventDefault();
	addPreloader();
	const response = await fetch(`https://test-works.pr-uni.ru/api/login/index.php?login=${login.value}&password=${password.value}`);
	if (response.ok) {
		let responseResult = await response.json();
		removePreloader();
		removeError();

		if (responseResult.status === 'ok') {
			form.style.display = 'none';
			const span = document.createElement('span');
			span.textContent = `${responseResult.user.name}, Вы успешно авторизованы!`;
			wrapper.append(span);
			document.cookie = `token=${responseResult.token}`;
			console.log(document.cookie);
			clearForm();
		} else if (responseResult.status === 'error') {
			message.textContent = responseResult.errorMessage;
			form.classList.add('_error');
		}
	} else {
		console.log('Ошибка');
		removePreloader();
		removeError();
	}
}
