class MainMenu {
	
	constructor() {

		//ССЫЛКА НА ВСЕ КЛАССЫ
        this.game = game;

        //ДОМ-ЭЛЕМЕНТЫ
		this.DOM_elements_mainMenu = {
			'window_settings': document.getElementById('Window-settings'),
			'base_settings': document.getElementById('Base-settings'),
			'settings_base': document.getElementById('Settings-base'),
			'sound_settings': document.getElementById('Sound-settings'),
			'settings_sound': document.getElementById('Settings-sound'),
			'key_settings': document.getElementById('Key-settings'),
			'settings_key': document.getElementById('Settings-key'),
			'ru_language': document.getElementById('Ru-language'),
			'en_language': document.getElementById('En-language'),
			'ru_elems': document.querySelectorAll('.ru'),
			'en_elems': document.querySelectorAll('.en'),
			'on_fullscreen': document.getElementById('On-fullscreen'),
			'off_fullscreen': document.getElementById('Off-fullscreen'),
			'attention_window': document.getElementById('Attention-window'),
			'on_sanekmode': document.getElementById('On-sanekmode'),
			'off_sanekmode': document.getElementById('Off-sanekmode'),
			'music_volume': document.getElementById('Change-musicvolume'),
			'effects_volume': document.getElementById('Change-effectsvolume'),
			'volume_sound': document.getElementById('Volume-sound'),
			'window_changekey': document.getElementById('Window-changekey'),
			'change_keys': document.querySelectorAll('#Table-key .button')
		};



		//УСТАНОВКА КАРТИНОК ФОНУ
		Prototypes.setAnimationImg('Fon');

		//УСТАНОВКА РАЗМЕРОВ ГЛАВНОГО МЕНЮ
		this.setSizeMainMenu();

		//ПРИМЕНЕНИЕ НАСТРОЕК
		this.applySettings();

		//УСТАНОВКА СОБЫТИЙ НА ГЛАВНОМ МЕНЮ
		this.setEventsMainMenu();

		//ЗАПУСК ИНТРО
		this.playIntro();
	}






	//УСТАНОВКА СОБЫТИЙ НА ГЛАВНОМ МЕНЮ
	setEventsMainMenu() {

		//объект в Node.js
		// let fs = require("fs");

		//объект сохранений
		let save_obj = this.game.save_obj;

		//объект музыки и звуков
		let audio_obj = this.game.audio_obj;

		//ДОМ-элементы главного меню
		let DOM_elements_mainMenu = this.DOM_elements_mainMenu;



		//НАЧАЛО ИГРЫ
		document.getElementById('Start-game').onclick = function () {
			document.location.href = 'Game.html';
		};

		//НАСТРОЙКИ
		document.getElementById('Settings').onclick = function () {
			DOM_elements_mainMenu['window_settings'].style.display = 'block';
		};

		//ВЫХОД
		document.getElementById('Exit').onclick = function () {

			//сохранение текущего состояния игры
			Prototypes.save_obj = save_obj;

			//закрытие игры
			window.close();
		};



		//СОХРАНЕНИЕ НАСТРОЕК
		document.getElementById('Safe-settings').onclick = function () {

			//закрытие всплывающего окна
			DOM_elements_mainMenu['attention_window'].style.display = 'none';

			//изменение package.json
			// fs.writeFile('package.json', JSON.stringify(save_obj['settings_obj']['package_obj']));

			//сохранение текущего состояния игры
			Prototypes.save_obj = save_obj;

			//закрытие окна настроек
			DOM_elements_mainMenu['window_settings'].style.display = 'none';
		};

		//ЗАКРЫТЬ ВСПЛЫВАЮЩЕЕ ОКНО
		document.getElementById('Close-attention').onclick = function () {
			DOM_elements_mainMenu['attention_window'].style.display = 'none';
		};

		//НАСТРОЙКИ ПО УМОЛЧАНИЮ
		document.getElementById('Default-settings').onclick = () => {

			//установка настроек по умолчанию
			Prototypes.setDefaultSettings();

			this.game.save_obj = Prototypes.save_obj;

			save_obj = this.game.save_obj;

			//применение настроек
			this.applySettings();
		};





		//ОСНОВНЫЕ НАСТРОЙКИ
		DOM_elements_mainMenu['base_settings'].onclick = function () {

			//закрытие всплывающего окна
			DOM_elements_mainMenu['attention_window'].style.display = 'none';

			if(getComputedStyle(DOM_elements_mainMenu['settings_sound']).display == 'block') {

				DOM_elements_mainMenu['settings_sound'].style.display = 'none';
				DOM_elements_mainMenu['sound_settings'].classList.remove('selected')

			} else if(getComputedStyle(DOM_elements_mainMenu['settings_key']).display == 'block') {

				DOM_elements_mainMenu['settings_key'].style.display = 'none';
				DOM_elements_mainMenu['key_settings'].classList.remove('selected');
			};
			
			if(getComputedStyle(DOM_elements_mainMenu['settings_base']).display == 'none') {

				DOM_elements_mainMenu['settings_base'].style.display = 'block';
				this.classList.add('selected');
			}
		};


		//ЗВУКОВЫЕ НАСТРОЙКИ
		DOM_elements_mainMenu['sound_settings'].onclick = function () {

			//закрытие всплывающего окна
			DOM_elements_mainMenu['attention_window'].style.display = 'none';

			if(getComputedStyle(DOM_elements_mainMenu['settings_base']).display == 'block') {

				DOM_elements_mainMenu['settings_base'].style.display = 'none';
				DOM_elements_mainMenu['base_settings'].classList.remove('selected');

			} else if(getComputedStyle(DOM_elements_mainMenu['settings_key']).display == 'block') {

				DOM_elements_mainMenu['settings_key'].style.display = 'none';
				DOM_elements_mainMenu['key_settings'].classList.remove('selected');
			};
			
			if(getComputedStyle(DOM_elements_mainMenu['settings_sound']).display == 'none') {

				DOM_elements_mainMenu['settings_sound'].style.display = 'block';
				this.classList.add('selected');
			}
		};


		//НАСТРОЙКИ УПРАВЛЕНИЯ
		DOM_elements_mainMenu['key_settings'].onclick = function () {

			//закрытие всплывающего окна
			DOM_elements_mainMenu['attention_window'].style.display = 'none';

			if(getComputedStyle(DOM_elements_mainMenu['settings_base']).display == 'block') {

				DOM_elements_mainMenu['settings_base'].style.display = 'none';
				DOM_elements_mainMenu['base_settings'].classList.remove('selected');

			} else if(getComputedStyle(DOM_elements_mainMenu['settings_sound']).display == 'block') {

				DOM_elements_mainMenu['settings_sound'].style.display = 'none';
				DOM_elements_mainMenu['sound_settings'].classList.remove('selected');
			};
			
			if(getComputedStyle(DOM_elements_mainMenu['settings_key']).display == 'none') {

				DOM_elements_mainMenu['settings_key'].style.display = 'block';
				this.classList.add('selected');
			}
		};




		//ВЫБОР АНГЛИЙСКОГО ЯЗЫКА
		DOM_elements_mainMenu['en_language'].onclick = function () {

			if(save_obj['settings_obj']['language'] == 'ru') {

				this.classList.add('selected');
				DOM_elements_mainMenu['ru_language'].classList.remove('selected');

				save_obj['settings_obj']['language'] = 'en';

				for(let value of DOM_elements_mainMenu['ru_elems']) {
					value.style.display = 'none';
				};

				for(let value of DOM_elements_mainMenu['en_elems']) {
					value.style.display = 'block';
				}
			}
		};

		//ВЫБОР РУССКОГО ЯЗЫКА
		DOM_elements_mainMenu['ru_language'].onclick = function () {

			if(save_obj['settings_obj']['language'] == 'en') {

				this.classList.add('selected');
				DOM_elements_mainMenu['en_language'].classList.remove('selected');

				save_obj['settings_obj']['language'] = 'ru';

				for(let value of DOM_elements_mainMenu['en_elems']) {
					value.style.display = 'none';
				};

				for(let value of DOM_elements_mainMenu['ru_elems']) {
					value.style.display = 'block';
				}
			}
		};





		//ВКЛЮЧЕНИЕ ПОЛНОЭКРАННОГО РЕЖИМА
		DOM_elements_mainMenu['on_fullscreen'].onclick = function () {

			if(!save_obj['settings_obj']['package_obj']['window']['fullscreen']) {

				this.classList.add('selected');

				DOM_elements_mainMenu['off_fullscreen'].classList.remove('selected');

				save_obj['settings_obj']['package_obj']['window']['fullscreen'] = true;

				//открытие всплывающего окна
				DOM_elements_mainMenu['attention_window'].style.display = 'block';
			}
		};

		//ОТКЛЮЧЕНИЕ ПОЛНОЭКРАННОГО РЕЖИМА
		DOM_elements_mainMenu['off_fullscreen'].onclick = function () {

			if(save_obj['settings_obj']['package_obj']['window']['fullscreen']) {

				this.classList.add('selected');

				DOM_elements_mainMenu['on_fullscreen'].classList.remove('selected');

				save_obj['settings_obj']['package_obj']['window']['fullscreen'] = false;

				//открытие всплывающего окна
				DOM_elements_mainMenu['attention_window'].style.display = 'block';
			}
		};




		//ВКЛЮЧЕНИЕ РЕЖИМА САНЬКА
		DOM_elements_mainMenu['on_sanekmode'].onclick = function () {

			if(!save_obj['settings_obj']['sanek-mode']) {

				this.classList.add('selected');

				DOM_elements_mainMenu['off_sanekmode'].classList.remove('selected');

				save_obj['settings_obj']['sanek-mode'] = true
			}
		};


		//ОТКЛЮЧЕНИЕ РЕЖИМА САНЬКА
		DOM_elements_mainMenu['off_sanekmode'].onclick = function () {

			if(save_obj['settings_obj']['sanek-mode']) {

				this.classList.add('selected');

				DOM_elements_mainMenu['on_sanekmode'].classList.remove('selected');
				save_obj['settings_obj']['sanek-mode'] = false;
			}
		};


		//ИЗМЕНЕНИЕ ГРОМКОСТИ МУЗЫКИ
		DOM_elements_mainMenu['music_volume'].onmousedown = function (e) {

			if(e.which == 1) {

				let volume_width = parseFloat(getComputedStyle(DOM_elements_mainMenu['volume_sound']).width);

				let volume_left = e.clientX - (volume_width * save_obj['settings_obj']['music-volume'] / 100);
				
				window.onmousemove = (e) => {

					let per_cent = (e.clientX - volume_left) / volume_width * 100;

					if(per_cent >= 0 && per_cent <= 100) {

						this.style.left = per_cent + '%';

						for(let value of audio_obj['music']) {
							value.volume = per_cent / 100;
						};

						save_obj['settings_obj']['music-volume'] = per_cent;
					};
				};

				window.onmouseup = (e) => {

					if(e.which == 1) {
						window.onmousemove = function () {};
					}
				}

			}

		};

		//ИЗМЕНЕНИЕ ГРОМКОСТИ ЭФФЕКТОВ
		DOM_elements_mainMenu['effects_volume'].onmousedown = function (e) {

			if(e.which == 1) {

				let volume_width = parseFloat(getComputedStyle(DOM_elements_mainMenu['volume_sound']).width);

				let volume_left = e.clientX - (volume_width * save_obj['settings_obj']['effects-volume'] / 100);

				window.onmousemove = (e)=> {

					let per_cent = (e.clientX - volume_left) / volume_width * 100;

					if(per_cent >= 0 && per_cent <= 100) {

						this.style.left = per_cent + '%';

						for(let value of audio_obj['effects']) {

							for(let value2 of value) {

								if(Array.isArray(value2)) {

									for(let value3 of value2) {
										value3.volume = per_cent / 100;
									}

								} else {
									value2.volume = per_cent / 100;
								}
							}
						};

						save_obj['settings_obj']['effects-volume'] = per_cent;
					};
				};

				window.onmouseup = function (e) {

					if(e.which == 1) {
						window.onmousemove = function () {};
					}
				}

			}

		};


		//ИЗМЕНЕНИЕ ГОРЯЧИХ КЛАВИШ
		for(let value of DOM_elements_mainMenu['change_keys']) {

			value.onclick = function () {

				DOM_elements_mainMenu['window_changekey'].style.display = 'block';

				window.onkeydown = (e)=> {

					let key_name = e.key[0].toUpperCase() + e.key.slice(1);

					for(let value of DOM_elements_mainMenu['change_keys']) {

						if(value.innerHTML == key_name) {
							value.innerHTML='';
						}
					};

					
					this.innerHTML = key_name;
					window.onkeydown = function () {};

					DOM_elements_mainMenu['window_changekey'].style.display = 'none';

					save_obj['settings_obj']['hot_keys_hero'][this.getAttribute('key')] = e.keyCode;
					save_obj['settings_obj']['all_keyCodes'][e.keyCode] = key_name;

				};
			}
		};

		//ЗВУК ПРИ НАЖАТИИ И НАВЕДЕНИИ НА КНОПКИ
		for(let value of document.querySelectorAll('.button')) {

			//звук кнопок при наведении
			value.onmouseenter = function () {
				audio_obj['effects']['Interface']['Hover'].stop();
				audio_obj['effects']['Interface']['Hover'].play();
			};

			//звук кнопок при клике
			value.onmousedown = function (e) {

				if(e.which == 1) {
					audio_obj['effects']['Interface']['Click'].stop();
					audio_obj['effects']['Interface']['Click'].play();
				}
			}
		};
	}




	//ПРИМЕНЕНИЕ НАСТРОЕК
	applySettings() {

		//установка языка в игре
		Prototypes.setLanguageGame();

		//изменение кнопки языка
		switch(this.game.save_obj['settings_obj']['language']) {

			case 'ru':
				this.DOM_elements_mainMenu['ru_language'].classList.add('selected');
				this.DOM_elements_mainMenu['en_language'].classList.remove('selected');
			break;

			case 'en':
				this.DOM_elements_mainMenu['en_language'].classList.add('selected');
				this.DOM_elements_mainMenu['ru_language'].classList.remove('selected');
			break;
		};

		//установка громкости
		Prototypes.setVolumeAudio(this.game.audio_obj);

		//установка ползунка громкости
		this.DOM_elements_mainMenu['music_volume'].style.left = this.game.save_obj['settings_obj']['music-volume'] + '%';
		this.DOM_elements_mainMenu['effects_volume'].style.left = this.game.save_obj['settings_obj']['effects-volume'] + '%';

		//установка полноэкранного режима
		switch(this.game.save_obj['settings_obj']['package_obj']['window']['fullscreen']) {

			case false:
				this.DOM_elements_mainMenu['off_fullscreen'].classList.add('selected');
				this.DOM_elements_mainMenu['on_fullscreen'].classList.remove('selected');
			break;

			case true:
				this.DOM_elements_mainMenu['on_fullscreen'].classList.add('selected');
				this.DOM_elements_mainMenu['off_fullscreen'].classList.remove('selected');
			break;
		};

		//установка мода санька
		switch(this.game.save_obj['settings_obj']['sanek-mode']) {

			case false:
				this.DOM_elements_mainMenu['off_sanekmode'].classList.add('selected');
				this.DOM_elements_mainMenu['on_sanekmode'].classList.remove('selected');
			break;

			case true:
				this.DOM_elements_mainMenu['on_sanekmode'].classList.add('selected');
				this.DOM_elements_mainMenu['off_sanekmode'].classList.remove('selected');
			break;

		};

		//установка горячих клавиш
		for(let value of this.DOM_elements_mainMenu['change_keys']) {

			let keyCode = this.game.save_obj['settings_obj']['hot_keys_hero'][value.getAttribute('key')];

			if(keyCode) {
				value.innerHTML = this.game.save_obj['settings_obj']['all_keyCodes'][keyCode];
			} else {
				value.innerHTML = '';
			}
		};
	}






	//ЗАПУСК ИНТРО
	playIntro() {

		let audio_obj = this.game.audio_obj;

		let intro1 = document.getElementById('Intro1');
		let intro2 = document.getElementById('Intro2');
		let opacity = 0.01;
		let speed = 0.011;
		let show_intro2 = false;
		let intro_animation;

		//включаем интро после его загрузки
		audio_obj['music']['Intro'].addEventListener('canplaythrough', () => {

			//показывать интро при запуске игры
			if(this.game.save_obj['game_obj']['play_intro']) {

				audio_obj['music']['Intro'].play();

				(function animateIntro () {

					if(show_intro2 && opacity <= 0) {
						this.showMainMenu();
					} else {

						if(opacity >= 1) {
							speed = -speed;

						} else if(opacity <= 0) {

							speed = -speed;
							show_intro2 = true;
							opacity = 0;
						};

						if(show_intro2) {
							intro2.style.opacity = opacity;
						} else {
							intro1.style.opacity = opacity;
						};

						opacity += speed;
						
						intro_animation = requestAnimationFrame(animateIntro.bind(this))
					}
				}).call(this);

				//при нажатии мыши пропускается интро
				window.addEventListener('mousedown', () => {

					intro1.style.opacity = 0;
					intro2.style.opacity = 0;

					audio_obj['music']['Intro'].stop();

					cancelAnimationFrame(intro_animation);

					this.showMainMenu();

				}, {once: true});

			//не показывать интро при выходе в главное меню из основной игры
			} else {

				this.showMainMenu();

				this.game.save_obj['game_obj']['play_intro'] = true;

				Prototypes.save_obj = this.game.save_obj;
			}


			

		}, {once: true});
	}




	//ПОКАЗАТЬ ГЛАВНОЕ МЕНЮ
	showMainMenu() {

		document.getElementById('Main-menu').style.display = 'block';
		document.getElementById('Game-name').style.display = 'flex';

		this.game.audio_obj['music']['Main-theme'].play();
		this.game.audio_obj['music']['Main-theme'].loop = true;

		//запуск анимирования фона
		Prototypes.runStaticAnimation({
			frames: document.querySelectorAll('#Fon > div'),
			times: 200,
			infinity: true
		})
	}




	//УСТАНОВКА РАЗМЕРОВ ГЛАВНОГО МЕНЮ
	setSizeMainMenu() {

		Prototypes.setSizeDOMElements([

			//позиционирование имя игры
			{
				arr_elements: document.querySelectorAll('#Game-name'),
				styles: {
					'width': 1, 
					'top': 1, 
					'fontSize': 1
				}
			},

			//позиционирование фона
			{
				arr_elements: document.querySelectorAll('#Fon > div'), 
				styles: {
					'width': 1, 
					'height': 1
				}
			},

			//позиционирование главного меню
			{
				arr_elements: document.querySelectorAll('#Main-menu > div'), 
				styles: {
					'width': 1, 
					'height': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Main-menu'), 
				styles: {
					'left': 1, 
					'top': 1, 
					'fontSize': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Intro'), 
				styles: {
					'width': 1, 
					'top': 1, 
					'fontSize': 1
				}
			},

			//позиционирование настроек
			{
				arr_elements: document.querySelectorAll(
					`#Window-settings, 
					#Menu-settings, 
					#Attention-window, 
					#Volume-sound, 
					#Volume-effects, 
					#Change-musicvolume, 
					#Change-effectsvolume, 
					#Table-key, 
					#Window-changekey`
				), 
				styles: {
					'width': 1, 
					'height': 1, 
					'top': 1, 
					'left': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Name-settings'), 
					styles: {
						'top': 1, 
						'fontSize': 1
					}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Default-settings,  
					#Language, 
					#Change-music, 
					#Fullscreen, 
					#Change-effects, 
					#Ru-language, 
					#En-language, 
					#On-fullscreen, 
					#Off-fullscreen, 
					#Name-sanekmode, 
					#On-sanekmode, 
					#Off-sanekmode`
				), 
				styles: {
					'top': 1, 
					'fontSize': 1, 
					'width': 1,
					'left': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(`#Safe-settings`), 
				styles: {
					'top': 1, 
					'fontSize': 1, 
					'width': 1,
					'right': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Base-settings, 
					#Sound-settings, 
					#Key-settings, 
					#Table-key th, 
					#Table-key td`
				), 
				styles: {
					'width': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Attention-window, 
					#Table-key th, 
					#Table-key td, 
					#Window-changekey, 
					#Menu-settings`
				), 
				styles: {
					'fontSize': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Close-attention'), 
				styles: {
					'width': 1, 
					'top': 1, 
					'left': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Table-key th, 
					#Table-key td`
				), 
				styles: {
					'height': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Window-changekey'), 
				styles: {
					'paddingTop': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Base-settings, 
					#Sound-settings, 
					#Key-settings`
				), 
				styles: {
					'marginLeft': 1, 
					'marginRight': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('.button'), 
				styles: {
					'paddingTop': 1, 
					'paddingBottom': 1, 
					'paddingLeft': 1, 
					'paddingRight': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`.button, 
					#Window-settings, 
					#Volume-sound,
					#Volume-effects, 
					#Table-key, 
					#Table-key th, 
					#Table-key td, 
					#Window-changekey,
					#Attention-window`
				), 
				styles: {
					'borderRadius': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Main-menu > div'), 
				styles: {
					'lineHeight': 1, 
					'marginBottom': 1
				}
			}
		]);



	}
}