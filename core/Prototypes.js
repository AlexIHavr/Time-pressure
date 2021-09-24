class Prototypes {

	//ПОЛУЧЕНИЕ ОБЪЕКТА СОХРАНЕНИЙ
	static get save_obj() {
		return JSON.parse(localStorage.getItem('save_obj'));
	}

	//УСТАНОВКА ОБЪЕКТА СОХРАНЕНИЙ
	static set save_obj(save_obj) {
		localStorage.setItem('save_obj', JSON.stringify(save_obj));
	}














	//ЗАДАНИЕ ПРОТОТИПОВ ВСТРОЕННЫМ ОБЪЕКТАМ
	static setPrototypesObjects() {

		//итерируемость объекта через for-of
		Object.prototype[Symbol.iterator] = function* () {
			for(let key in this) {
				yield this[key];
			}
		};

		//определение расстояния между двумя точками
		Math.distance = function (deltaX, deltaY) {
			return Math.pow(Math.pow(deltaX, 2) + Math.pow(deltaY, 2), 0.5);
		};

		//столкновение двух кругов
		Math.isCircle = function (deltaX, deltaY, r1, r2) {
			return Math.distance(deltaX, deltaY) <= r1 + r2
		};

		//нахождение точки в квадрате
		Math.isSquare = function (deltaX, deltaY, a) {
			return (Math.abs(deltaX) < a && Math.abs(deltaY) < a)
		};

		//перевод угла из градусов в радианы (для тригонометрических функций)
		Math.degreeInRan = function (angle) {
			return angle*Math.PI/180
		};

		//определение угла поворота линии, соединяющей две точки (первая - дальняя, вторая - центр вращения)
		Math.getAngle = function (deltaX, deltaY) {

			if(deltaX >= 0 && deltaY >= 0) {
				return Math.atan(Math.abs(deltaY/deltaX))*180/Math.PI;
			} else if(deltaX <=0 && deltaY >= 0) {
				return 90 + Math.atan(Math.abs(deltaX/deltaY))*180/Math.PI;
			} else if(deltaX <=0 && deltaY <= 0) {
				return 180 + Math.atan(Math.abs(deltaY/deltaX))*180/Math.PI;
			} else if (deltaX >= 0 && deltaY <= 0) {
				return 270 + Math.atan(Math.abs(deltaX/deltaY))*180/Math.PI;
			};
		};

		//выбор рандомного целого числа от минимального до максимального
		Math.randomNumber = function (min, max) {
			return Math.floor(Math.random()*(max - min + 1)) + min;
		};

		//выбор рандомного элемента из массива
		Math.randomElem = function (arr) {
			return arr[Math.floor(Math.random()*(arr.length - 1 + 1))];
		};

		//определение координаты x объекта от центра его вращения в зависимости от угла
		Math.rFromCenterX = function (x_center, r, angleInRan) {
			return x_center + r*Math.cos(angleInRan)
		};

		//определение координаты y объекта от центра его вращения в зависимости от угла
		Math.rFromCenterY = function (y_center, r, angleInRan) {
			return y_center + r*Math.sin(angleInRan)
		};

		//определение выпадения с заданной вероятностью
		Math.chance = function (chance) {
			if(chance >= Math.randomNumber(1,100)) {
				return true
			} else {
				return false
			}
		};

		//метод для остановки воспроизведения музыки
		Audio.prototype.stop = function () {
			this.pause();
			this.currentTime = 0;
		};

		//метод для плавной остановки музыки (плавное затихание)
		Audio.prototype.slowStop = function () {

			let audio = this;

			let volume = audio.volume;
			let start_volume = volume;

			(function animateVolume () {

				volume -= 0.01;

				if(volume > 0) {

					audio.volume = volume;
					requestAnimationFrame(animateVolume)
				} else {
					audio.stop();
					audio.volume = start_volume;
				}
			})();
		};

		//метод для плавного воспроизведения музыки 
		Audio.prototype.slowPlay = function () {

			let audio = this;

			let volume = 0;
			let start_volume = this.volume;

			this.play();

			(function animateVolume () {

				volume += 0.01;

				if(volume <= start_volume) {

					audio.volume = volume;
					requestAnimationFrame(animateVolume)
				} else {
					audio.volume = start_volume;
				}
			})();
		};
	}




	//УСТАНОВКА НАСТРОЕК ИГРЫ ПО УМОЛЧАНИЮ
	static setDefaultSettings() {

		let save_obj = {
			'settings_obj': {
				'language': 'ru',
				'package_obj': {
					"main": "Game/Main-menu.html",
					"name": "Game",
					"description": "Dummy demo of nnwjs app",
					"version": "0.0.1",
					"keywords": [ "demo", "nwjs" ],
					"window": {
					  "title": "Game",
					  "icon": "hero.png",
					  "toolbar": false,
					  "frame": true,
					  "width": 1920,
					  "height": 1080,
					  "position": "center",
					  "min_width": 400,
					  "min_height": 200,
					  "max_width": 1920,
					  "max_height": 1080,
					  "fullscreen": true
					},
					"author": "Havr",
					"license": "MIT",
					"dependencies": {
					  "moment": "latest",
					  "handlebars": "^2.0.0"
					}
				},
				'sanek-mode': false,
				'music-volume': 50,
				'effects-volume': 50,
				'hot_keys_hero': {
				    'W': 87,
				    'S': 83,
				    'A': 65,
				    'D': 68,
				    'Up_arrow': 38,
				    'Down_arrow': 40,
				    'Left_arrow': 37,
				    'Right_arrow': 39,
				    'Shift': 16,
				    'ShiftDouble': false,
				    '1': 49,
				    '1Double': false,
				    '2': 50,
				    '2Double': false,
				    '3': 51,
				    '3Double': false,
				    '4': 52,
				    '4Double': false,
				    '5': 53,
				    '5Double': false,
				    '6': 54,
				    '6Double': false,
				    '7': 55,
				    '7Double': false,
				    'Escape': 27,
				    'EscapeDouble': false,
				    'E': 69,
				    'EDouble': false
				},
				'all_keyCodes': {
					87: 'W',
				    83: 'S',
				    65: 'A',
				    68: 'D',
				    38: 'ArrowUp',
				   	40: 'ArrowDown',
				    37: 'ArrowLeft',
				    39: 'ArrowRight',
				    16: 'Shift',
				    49: '1',
				    50: '2',
				    51: '3',
				    52: '4',
				    53: '5',
				    54: '6',
				    55: '7',
				    27: 'Escape',
				    69: 'E'
				}
			},
			'game_obj': {
				'play_intro': true,
				'xStart_hero': 1600,
				'yStart_hero': 800
			}
		};

		this.save_obj = save_obj;
	}







	//ЗАПУСК МУЗЫКИ В ИГРЕ (ПОСЛЕ КОТОРОЙ СКРЫВАЕТСЯ ЗАГРУЗКА)
	static runMusicGame(music) {

		music.addEventListener('canplaythrough', function () {

	        this.play();
	        this.loop = true;
	        document.getElementById('Body').style.opacity = 1;
	        document.getElementById('Body').background = 'initial';
	        document.getElementById('Loading').style.display = 'none';
    	}, {once: true});
	}





	//ПОЛУЧЕНИЕ ОБЪЕКТА С НАПРАВЛЕНИЯМИ ПЕРСОНАЖА
	static getDirectionsObj(character, timeFrame) {

		let directions_obj = {};
	    let arr = [];

	    for(let value of character.children) {

	        for(let value2 of value.lastElementChild.children) {
	            arr.push(value2);
	            value2.timeFrame = value2.getAttribute('time-frame')*1 || timeFrame
	        };
	        directions_obj[value.id] = {
	            'direct_elem': value,
	            'stands_elem': value.firstElementChild,
	            'frames': arr
	        };
	        arr = [];

	    };
	    

	    return directions_obj;
	}



	//ПОЛУЧЕНИЕ ОБЪЕКТА С ИКОНКАМИ СПОСОБНОСТЕЙ
	static getIconObj(id) {

		let icon_obj = {};
	    let settings_obj = this.save_obj['settings_obj'];

	    for(let value of id.children) {

	        for(let value3 of value.lastElementChild.children) {
	            icon_obj[value3.id] = {
	                'skill': value3,
	                'icon': value3.firstElementChild,
	                'change-icon': value3.lastElementChild,
	                'name-level': value3.lastElementChild.previousElementSibling,
	                'num-level': 1,
	                'max-level': 3,
	                'cost-skill': document.getElementById('Cost-' + value3.id).innerHTML,
	                'color-skill': getComputedStyle(document.querySelector('#' + value3.id + ' .name-skill')).color,
	                'name-skill':   document.querySelector('#' + value3.id +   ' .name-skill.' + 
	                	settings_obj['language']).innerHTML,
	                'description':  document.querySelector('#' + value3.id +  ' .description.' + 
	                	settings_obj['language']).innerHTML,
	                'description2': document.querySelector('#' + value3.id + ' .description2.' + 
	                	settings_obj['language']).innerHTML,
	                'description3': document.querySelector('#' + value3.id + ' .description3.' + 
	                	settings_obj['language']).innerHTML
	            }
	        };
	    };

	    return icon_obj;
	}




	//ПОЛУЧЕНИЕ ОБЪЕКТА С ХАРАКТЕРИСТИКАМИ ШКОЛ
	static getSchoolObj(schools) {

		let school_obj = {};
	    let num = 1;

	    for(let value of schools.children) {

	        let first = value.firstElementChild.firstElementChild;
	        let html = document.querySelector('html');

	        school_obj[value.id] = {
	            'school': value,
	            'window-school': first,
	            'add-skill': document.getElementById(value.id + '-plus'),
	            'top': html.clientHeight*parseFloat(getComputedStyle(first).top)/755 + 'px',
	            'left': html.clientWidth*parseFloat(getComputedStyle(value).left)/1536 + 'px',
	            'num': num
	        };

	        num++
	    };

	    return school_obj;
	}





	//ПОЛУЧЕНИЕ ОБЪЕКТА С КАДРАМИ СПОСОБНОСТЕЙ, УДАРОВ, ЭФФЕКТОВ, СУЩЕСТВ
	static getActionObj(action, timeFrame) {

		let action_obj = {};

	    for(let value of action.children) {

	        action_obj[value.id] = {
	            'action_elem': value,
	            'frames': this.getActionArr(value, timeFrame)
	        };
	    };

	    return action_obj;
	}



	//ПОЛУЧЕНИЕ МАССИВА КАДРОВ СПОСОБНОСТЕЙ, УДАРОВ, ЭФФЕКТОВ
	static getActionArr(action, timeFrame) {

		let arr_frames = [];

    	for(let frame of action.children) {
	        arr_frames.push(frame);
	        frame.timeFrame = frame.getAttribute('time-frame')*1 || timeFrame;
	    };

	    return arr_frames;
	}


	//ПОЛУЧЕНИЕ ОБЪЕКТА ДОМ-ЭЛЕМЕНТОВ У УКАЗАННОГО РОДИТЕЛЯ
	static getObjectElements(idParentElem) {

		let objectElements = {};
		for(let elem of document.getElementById(idParentElem).children) {
			objectElements[elem.id] = elem
		};

		return objectElements;
	}



	//ПРОВЕРКА НА ПОКАЗ ПОСЛЕДНЕГО КАДРА В МАССИВЕ КАДРОВ
	static checkDisplayLastFrame(frames) {

		if(getComputedStyle(frames[frames.length - 1]).display == 'block') {
			return true
		} else {
			return false
		}
	}





	//УСТАНОВКА КАРТИНОК ДЛЯ ПЕРСОНАЖЕЙ (id у картинок соответсвуют их названиям)
	static setCharactersImg(id, folder = '') {

		for(let value of document.getElementById(id).children) {
	        let first = value.firstElementChild;
	        if(first.id) {
	            first.style.backgroundImage = 'url(Images/' + folder + id + '/' + value.id + '/' + first.id + '.png)';

	            //исскуственная задержка для загрузки картинки
	            this.setLoadTimeout(first)
	        };
	        for(let value2 of value.lastElementChild.children) {
	        	value2.style.backgroundImage = 'url(Images/' + folder + id + '/' + value.id + '/' + value2.id + '.png)';

	        	//исскуственная задержка для загрузки картинки
	        	this.setLoadTimeout(value2);
	        }
		};
	}



	//УСТАНОВКА КАРТИНОК ДЛЯ СУЩЕСТВ
	static setCreaturesImg(id) {

		for(let value of document.getElementById(id).children) {
			this.setActionImg(value.id)
		}
	}




	//УСТАНОВКА КАРТИНОК ДЛЯ УДАРОВ, СПОСОБНОСТЕЙ, ЭФФЕКТОВ
	static setActionImg(id) {

		for(let value of document.getElementById(id).children) {
			for(let value2 of value.children) {
				value2.style.backgroundImage = 'url(Images/' + id + '/' + value.id + '/' + value2.id + '.png)';

				//исскуственная задержка для загрузки картинки
				this.setLoadTimeout(value2);
			}
		}
	}




	//УСТАНОВКА КАРТИНОК ДЛЯ ИКОНОК
	static setIconImg(id) {

		for(let value of document.getElementById(id).children) {

			for(let value2 of value.firstElementChild.firstElementChild.children) {

				let way = 'url(Images/' + id + '/' + value.id + '/Icon' + value2.id + '.png)';
				for(let icon of document.querySelectorAll('.' + value2.id)) {
					icon.style.backgroundImage = way
				};
			};
		};
	}


	//УСТАНОВКА КАРТИНОК ДЛЯ НЕПОДВИЖНЫХ ОБЪЕКТОВ
	static setStaticImg(id, setLoadTimeout) {

		for(let value of document.getElementById(id).children) {
			if(value.getAttribute('no-img') == null) {
				value.style.backgroundImage = 'url(Images/Texture/' + id + '/' + value.id + '.png)';
			}
		};
	}




	//УСТАНОВКА КАРТИНОК ДЛЯ АНИМИРОВАННЫХ НЕПОДВИЖНЫХ ОБЪЕКТОВ
	static setAnimationImg(id) {

		for(let value of document.getElementById(id).children) {
			
			value.style.backgroundImage = 'url(Images/Animations/' + id + '/' + value.id + '.png)';

			//исскуственная задержка для загрузки картинки
			this.setLoadTimeout(value);		
		};
	}





	//СОЗДАНИЕ ИССКУСТВЕННОЙ ЗАДЕРЖКИ ДЛЯ ЗАГРУЗКИ КАРТИНОК
	static setLoadTimeout(elem) {

		setTimeout(() => {

    		elem.style.opacity = 1;

    		if(elem.style.display != 'block') {
        		elem.style.display = 'none';
    		}
        }, 100)
	}






	//ПОЛУЧЕНИЕ ОБЪЕКТА МУЗЫКИ И ЗВУКОВ
	static get audio_obj() {

		return {

			'music': {
				'Fight-theme1': new Audio('Music/Fight-theme1.mp3'),
				'Fight-theme2': new Audio('Music/Fight-theme2.mp3'),
				'Fight-theme3': new Audio('Music/Fight-theme3.mp3'),
				'Fight-theme4': new Audio('Music/Fight-theme4.mp3'),
				'Fight-theme5': new Audio('Music/Fight-theme5.mp3'),
				'Fight-theme6': new Audio('Music/Fight-theme6.mp3'),
				'Fight-theme7': new Audio('Music/Fight-theme7.mp3'),
				'Fight-theme8': new Audio('Music/Fight-theme8.mp3'),
				'Fight-theme9': new Audio('Music/Fight-theme9.mp3'),
				'Main-theme': new Audio('Music/Main-theme.mp3'),
				'Intro': new Audio('Music/Intro.mp3'),
				'Fon-theme': new Audio('Music/Fon-theme.mp3'),
				'Beats-theme': new Audio('Music/Beats-theme.mp3')
			},
			'effects': {
				'Strikes': {
			    	'Simple-strike': [
			    		new Audio('Music/Strikes/Simple_strike1.mp3'), 
			    		new Audio('Music/Strikes/Simple_strike2.mp3'), 
			    		new Audio('Music/Strikes/Simple_strike3.mp3')
			    	],
			    	'Fireball-strike': [
			    		new Audio('Music/Strikes/Fireball_strike1.mp3'), 
			    		new Audio('Music/Strikes/Fireball_strike2.mp3'), 
			    		new Audio('Music/Strikes/Fireball_strike3.mp3')
			    	],
			    	'Charge-strike': [new Audio('Music/Strikes/Charge-strike.mp3')],
			    	'Icelance-strike': [new Audio('Music/Strikes/Icelance-strike.mp3')]
			    },
			    'Skills': {
			    	'Rage': new Audio('Music/Skills/Rage.mp3'),
			    	'Fireball': new Audio('Music/Skills/Fireball.mp3'),
			    	'Explosion-fireball': new Audio('Music/Skills/Explosion-fireball.mp3'),
			    	'Regen': new Audio('Music/Skills/Regen.mp3'),
			    	'Charge': new Audio('Music/Skills/Charge.mp3'),
			    	'Fierytrail': new Audio('Music/Skills/Fireball.mp3'),
			    	'Fire': new Audio('Music/Skills/Fire.mp3'),
			    	'Burn': new Audio('Music/Skills/Burn.mp3'),
			    	'Soulsteel': new Audio('Music/Skills/Soulsteel.mp3'),
			    	'PopUpLink': new Audio('Music/Skills/PopUpLink.mp3'),
			    	'Icelance': new Audio('Music/Skills/Icelance.mp3'),
			        'Stoptime': new Audio('Music/Skills/Stoptime.mp3')
			    },
			    'Hero': {
			    	'Hero_walk': [
			    		new Audio('Music/Hero/Hero_walk1.mp3'), 
			    		new Audio('Music/Hero/Hero_walk2.mp3')
			    	],
			    	'Death_hero': new Audio('Music/Hero/Death_hero.mp3'),
			    	'Gasp': new Audio('Music/Hero/Gasp.mp3'),
			    	'Heart_beat': new Audio('Music/Hero/Heart_beat.mp3'),
			    	'LevelUp': new Audio('Music/Hero/LevelUp.mp3'),
			    	'Game-over': new Audio('Music/Hero/Game-over.mp3'),
			    	'Lock': new Audio('Music/Hero/Lock.mp3')
			    },
			    'Creatures': {
			    	'Mop_walk': new Audio('Music/Creatures/Mop_walk.mp3'),
			    	'Mop_strike': new Audio('Music/Creatures/Mop_strike.mp3'),
			    	'Mop_death': new Audio('Music/Creatures/Mop_death.mp3'),
			    	'Arrey_walk': new Audio('Music/Creatures/Arrey_walk.mp3'),
			    	'Arrey_jump': new Audio('Music/Creatures/Arrey_jump.mp3'),
			    	'Arrey_strike': new Audio('Music/Creatures/Arrey_strike.mp3'),
			    	'Arrey_death': new Audio('Music/Creatures/Arrey_death.mp3'),
			    	'Warrior_laugh': new Audio('Music/Creatures/Warrior_laugh.mp3')
			    },
			    'Interface': {
			    	'Hover': new Audio('Music/Interface/Hover.mp3'),
			    	'Click': new Audio('Music/Interface/Click.mp3'),
			    	'Evolution_timer': new Audio('Music/Interface/Evolution_timer.mp3')
			    },
			    'Map': {
			    	'Open_gate': new Audio('Music/Map/Open_gate.mp3')
			    }
			}
		}
	}



	//УСТАНОВКА РАЗМЕРОВ DOM-ЭЛЕМЕНТОВ В ЗАВИСИМОСТИ ОТ РАЗМЕРОВ ЭКРАНА
	static setSizeDOMElements(arr_objects) {

		let html = document.querySelector('html');
		let screenWidth = html.clientWidth;
		let screenHeight = html.clientHeight;

		for(let obj of arr_objects) {

			for(let value of obj.arr_elements) {

				let styles_obj = getComputedStyle(value);

				for(let key_style in obj.styles) {

					switch(key_style) {

						case 'top':
						case 'bottom':
						case 'height':
						case 'fontSize':
						case 'paddingTop':
						case 'paddingBottom':
						case 'marginTop':
						case 'marginBottom':
						case 'borderRadius':
						case 'lineHeight':
							value.style[key_style] = screenHeight*parseFloat(styles_obj[key_style])/755 + 'px'
						break;

						case 'left':
						case 'right':
						case 'width':
						case 'paddingLeft':
						case 'paddingRight':
						case 'marginLeft':
						case 'marginRight':
						case 'borderWidth':
						case 'textIndent':
							value.style[key_style] = screenWidth*parseFloat(styles_obj[key_style])/1536 + 'px'
						break;
					}
				}
			}
		}
	}





	//УСТАНОВКА ГРОМКОСТИ МУЗЫКИ И ЗВУКОВ В ИГРЕ
	static setVolumeAudio(audio_obj) {

		let save_obj = this.save_obj;

		//громкость музыки
		for(let key in audio_obj['music']) {
			audio_obj['music'][key].volume = save_obj['settings_obj']['music-volume'] / 100;
		};

		//громкость звуков
		for(let key in audio_obj['effects']) {
			for(let key2 in audio_obj['effects'][key]) {
				if(Array.isArray(audio_obj['effects'][key][key2])) {
					for(let value of audio_obj['effects'][key][key2]) {
						value.volume = save_obj['settings_obj']['effects-volume'] / 100;
					}
				} else {
					audio_obj['effects'][key][key2].volume = save_obj['settings_obj']['effects-volume'] / 100;
				}
			}
		};
	}



	//УСТАНОВКА ЯЗЫКА В ИГРЕ
	static setLanguageGame() {

		let en_elems = document.querySelectorAll('.en');
		let ru_elems = document.querySelectorAll('.ru');

		switch(this.save_obj['settings_obj']['language']) {

			case 'ru':
				for(let value of en_elems) {
					value.style.display = 'none';
				};
				for(let value of ru_elems) {
					value.style.display = 'block';
				}
			break;

			case 'en':
				for(let value of ru_elems) {
					value.style.display = 'none';
				};
				for(let value of en_elems) {
					value.style.display = 'block';
				}
			break;
		};
	}



	//ЗАПУСК СТАТИЧЕСКОЙ АНИМАЦИИ КАДРОВ И ПОЛУЧЕНИЕ МЕТОДА ДЛЯ ЕЕ ОСТАНОВКИ
	static runStaticAnimation({frames, times, infinity, resolve}) {

		let hero = game.hero;

		let count = 0;
		let time;
		let static_animation;

		//время кадра или кадров
		if(Array.isArray(times)) {
			time = function () {
				return times[count]
			};
		} else {
			time = function () {
				return times
			};
		};

		//запуск статической анимации
		frames[count].style.display = 'block';

		(function animationFrames () {

			static_animation = setTimeout(() => {

				if(!hero || !hero['hero_options']['pause']) {

					count++;

					if(count == frames.length) {

						if(!infinity) {

							//Promise для фиксирования окончания анимации
							if(resolve) {
								resolve();
							};
							return 0
						};

						frames[frames.length-1].style.display = 'none';
						count = 0;

					} else {
						frames[count-1].style.display = 'none';
					};
					frames[count].style.display = 'block';
				}

				static_animation = requestAnimationFrame(animationFrames)

			}, time())
		})();

		//получение функции для остановки статической анимации (с помощью замыкания)
		return function () {
			clearInterval(static_animation);
			cancelAnimationFrame(static_animation);
		};
		
	} 



}