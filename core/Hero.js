class Hero {
	
	constructor({health_points, mana_points, energe_points, max_experience, skill_points, characteristic_points}) {

        //ССЫЛКА НА ВСЕ КЛАССЫ
        this.game = game;

		//ХАРАКТЕРИСТИКИ ГЕРОЯ (ОСНОВНЫЕ)
		this.hp = {
			'current': health_points,
			'max': health_points,
			'regen_timer': 0 
		};
		this.mp = {
			'current': mana_points,
			'max': mana_points,
			'regen_timer': 0
		};
		this.ep = {
			'current': energe_points,
			'max': energe_points,
			'regen_timer': 0,
			'regen_delay': 0
		};
		this.ex = {
			'current': 0,
			'max': max_experience
		};
		this.level = {
			'current': 1,
			'max': 'unlimited'
		};
		this.sp = {
			'current': skill_points,
			'max': 'unlimited'
		};
		this.cp = {
			'current': characteristic_points,
			'max': 'unlimited'
		};




		//ДОМ-ЭЛЕМЕНТЫ
    	this.DOM_elements_hero = {
    		'html': document.querySelector('html'),
    		'hero': document.getElementById('Hero'),
	        'main_character': document.getElementById('Main-character'),
	        'hero_strikes': document.getElementById('Hero-strikes'),
	        'hero_skills': document.getElementById('Hero-skills'),
	        'hero_effects': document.getElementById('Hero-effects')
		};


		
		//ХАРАКТЕРИСТИКИ ГЕРОЯ (ДОПОЛНИТЕЛЬНЫЕ)
		this.hero_options = {
	        'hero_walk_sound': this.game.audio_obj['effects']['Hero']['Hero_walk'],
	        'current_music': this.game.audio_obj['music']['Fon-theme'],
	        'start_direction': 'Front-walk',
	        'hero_running': false,
	        'animation_hero': undefined,
	        'animation_frame': undefined,
	        'degen_ep': false,
	        'hero_speed': 5,
	        'const_speed': 5,
	        'timer_hero': undefined,
	        'directions_obj': Prototypes.getDirectionsObj(this.DOM_elements_hero['hero'], 900), 
	        'ep_blink_timer': undefined,
	        'ep_blink_strike': false,
	        'mp_blink_timer': undefined,
	        'hp_blink_timer': undefined,
	        'pause': false,
	        'connect_number': null,
	        'cost_manaElixir': 30,
	        'cost_hpElixir': 15,
	        'regen_hps': 0,
	        'regen_mps': 0.5,
	        'regen_eps': 40,
	        'degen_eps': -30,
	        'plus_characts': {
	        	'hp': 100,
	        	'mp': 50,
	        	'ep': 50,
	        	'level': 1,
	        	'sp': 1,
	        	'cp': 3
	        }
    	};



    	//ПОЗИЦИИ ГЕРОЯ
    	this.hero_position = {
    		'x_center': 55,
	        'y_center': 121,
	        'radius': 16,
	        'x': this.game.save_obj['game_obj']['xStart_hero'] + 55,
	        'y': this.game.save_obj['game_obj']['yStart_hero'] + 121
    	};



    	//ХАРАКТЕРИСТИКИ СПОСОБНОСТЕЙ И УДАРОВ ГЕРОЯ
    	this.skills_obj = {
	        'current_attack': 'Simple-strike',
	        'const_attack': 'Simple-strike',
	        'previous_attack': null,
            'angle_strike': 0,
	        'forse_sword': 20,
	        'critical_chance': 5,
	        'speed_strike': 1,
	        'sound_strike': this.game.Math.randomElem(this.game.audio_obj['effects']['Strikes']['Simple-strike']),
	        'ready_obj': {},
            'active_skills': {},
            'active_strikes': {},
	        'fireball_i': 0,
	        'icelance_i': 0,
	        'fireball_obj': {},
	        'fierytrail_obj': {},
	        'icelance_obj': {},
	        'filter': [],
	        'strikes': Prototypes.getActionObj(document.getElementById('Hero-strikes')),
	        'skills': Prototypes.getActionObj(document.getElementById('Hero-skills')),
	        'effects': Prototypes.getActionObj(document.getElementById('Hero-effects')),
	        'icons': Prototypes.getIconObj(document.getElementById('Icons-skills')),
	        'school': Prototypes.getSchoolObj(document.getElementById('Icons-skills')),
	        'cancel_regen': function() {}
    	}


		//КЛАВИШИ
	    this.hot_keys = this.game.save_obj['settings_obj']['hot_keys_hero'];
	    this.active_keys = {
		    'W': false, 
		    'S': false, 
		    'A': false, 
		    'D': false
		};



		//ПАРАМЕТРЫ ЭКРАНА
		this.screen_obj = {
	        'screenWidth': this.DOM_elements_hero['html'].clientWidth,
	        'screenHeight': this.DOM_elements_hero['html'].clientHeight,
	        'screen_centerX': this.DOM_elements_hero['html'].clientWidth/2 - 
	        				  document.querySelector('.character').clientWidth/2,
	        'screen_centerY': this.DOM_elements_hero['html'].clientHeight/2 - 
	        				  document.querySelector('.character').clientHeight/2
    	};


        //УСТАНОВКА КАРТИНОК ГЕРОЮ
        Prototypes.setCharactersImg('Hero');

		//ЗАПУСК ТАЙМЕРА ВЗАИМОДЕЙСТВИЯ ГЕРОЯ С ОБЪЕКТАМИ ИГРЫ
        this.runConnectTimer();

        //РЕГЕНЕРАЦИЯ ЖИЗНИ ГЕРОЯ
        this.regenCharact('hp');

		//РЕГЕНЕРАЦИЯ МАНЫ ГЕРОЯ
		this.regenCharact('mp');
	}


	//НАЖАТИЕ КЛАВИШИ КЛАВИАТУРЫ
	keydown(e) {

		let hot_keys = this.hot_keys;

		switch(e.keyCode) {

            //движение героя вниз
            case hot_keys['Down_arrow']:
            case hot_keys['S']:
                this.heroMoveDown();
            break;

            //движение героя вверх
            case hot_keys['Up_arrow']:
            case hot_keys['W']:
                this.heroMoveUp();
            break;

            //движение героя вправо
            case hot_keys['Right_arrow']:
            case hot_keys['D']:
                this.heroMoveRight();
            break;

            //движение героя влево
            case hot_keys['Left_arrow']:
            case hot_keys['A']:
                this.heroMoveLeft();
            break;

            //переход героя на бег
            case hot_keys['Shift']:
            case hot_keys['ShiftDouble']:
                this.heroRun();
            break;

            //горячие главиши способностей
            case hot_keys['1']:
            case hot_keys['1Double']:
            case hot_keys['2']:
            case hot_keys['2Double']:
            case hot_keys['3']:
            case hot_keys['3Double']:
            case hot_keys['4']:
            case hot_keys['4Double']:
            case hot_keys['5']:
            case hot_keys['5Double']:
            case hot_keys['6']:
            case hot_keys['6Double']:
            case hot_keys['7']:
            case hot_keys['7Double']:
            	this.activateSkill(e.keyCode);
            break;

            //взаимодействия с объектами действия
            case hot_keys['E']:
            case hot_keys['EDouble']:
                this.game.staticObjects.activateConnectObject(this.hero_options['connect_number']);
            break;

            //открытие мини меню (нажатие escape)
            case hot_keys['Escape']:
            case hot_keys['EscapeDouble']:
                this.game.heroInterface.openMiniMenu();
            break;

        };

        //дегенерация выносливости героя 
        this.degenCharact('ep');

	}


	//ОТПУСКАНИЕ КЛАВИШИ КЛАВИАТУРЫ
	keyup(e) {

		let hot_keys = this.hot_keys;

		switch(e.keyCode) {

            //остановка героя снизу
            case hot_keys['Down_arrow']:
            case hot_keys['S']:
                this.heroStopDown();
            break;

            //остановка героя сверху
            case hot_keys['Up_arrow']:
            case hot_keys['W']:
                this.heroStopUp();
            break;

            //остановка героя справа
            case hot_keys['Right_arrow']:
            case hot_keys['D']:
                this.heroStopRight();
            break;

            //остановка героя слева
            case hot_keys['Left_arrow']:
            case hot_keys['A']:
                this.heroStopLeft();
            break;

            //переход героя на шаг
            case hot_keys['Shift']:
                this.heroStopRun();
            break;

        };

        //регенерация выносливости героя
        this.regenCharact('ep');
	}










	//ФИЗИЧЕСКАЯ АТАКА ГЕРОЯ (НАЖАТИЕ НА ЭКРАН)
	heroClickAttack(e) {

		if(!this.DOM_elements_hero['hero'].hidden || this.skills_obj['ready_obj']['Strike']) {

	        //определяем угол поворота удара в зависимости от координат мыши
	        this.skills_obj['angle_strike'] = this.game.Math.getAngle(
	        	e.pageX - this.hero_position['x'], 
	        	e.pageY - this.hero_position['y']
	        );

	        //выбор атаки в зависимости от текущей атаки
	        switch(this.skills_obj['current_attack']) {

	            //простой удар героя
	            case 'Simple-strike':
	            	this.game.heroStrikes.simpleStrike();          
	            break;

	            //запуск героем огненных шаров
	            case 'Fireball-strike':
	            	this.game.heroStrikes.fireballStrike();          
	            break;

	            //запуск героем ледяных стрел
	            case 'Icelance-strike':
	            	this.game.heroStrikes.icelanceStrike();          
	            break;

                //запуск рывка героем
                case 'Charge-strike':
                    this.game.heroStrikes.chargeStrike();          
                break;
	        };
		} 
	}



	//ДВИЖЕНИЕ ГЕРОЯ ВНИЗ
	heroMoveDown() {

		this.active_keys['S'] = true;
        if(!this.hero_options['timer_hero']) {
            this.direction('Front-walk');
            this.animateMoving('down');
        } else {
            switch(this.hero_options['start_direction']) {

                //быстрый переход вниз
                case 'Back-walk':
                    this.stopAnimate('Back-walk')
                    this.direction('Front-walk');
                    this.animateMoving('down');
                break;

                //быстрый переход на Downright диагональ
                case 'Right-walk':
                    this.stopAnimate('Right-walk');
                    this.direction('Downright-diagonal');
                    this.animateDiagonal('Downright');
                break;

                //быстрый переход на Downleft диагональ
                case 'Left-walk':
                    this.stopAnimate('Left-walk');
                    this.direction('Downleft-diagonal');
                    this.animateDiagonal('Downleft');
                break;

                //быстрый переход с Upright диагонали вниз
                case 'Upright-diagonal':
                    this.stopAnimate('Upright-diagonal');
                    this.direction('Front-walk');
                    this.animateMoving('down');
                break;

                //быстрый переход с Upleft диагональ вниз
                case 'Upleft-diagonal':
                    this.stopAnimate('Upleft-diagonal');
                    this.direction('Front-walk');
                    this.animateMoving('down');
                break;
            }
        }
	}


	//ДВИЖЕНИЕ ГЕРОЯ ВВЕРХ
	heroMoveUp() {

		this.active_keys['W'] = true;
        if(!this.hero_options['timer_hero']) {
            this.direction('Back-walk');
            this.animateMoving('top');
        } else {
            switch(this.hero_options['start_direction']) {

                //быстрый переход вверх
                case 'Front-walk':
                    this.stopAnimate('Front-walk');
                    this.direction('Back-walk');
                    this.animateMoving('top');
                break;

                //быстрый переход на Upright диагональ
                case 'Right-walk':
                    this.stopAnimate('Right-walk');
                    this.direction('Upright-diagonal');
                    this.animateDiagonal('Upright');
                break;

                //быстрый переход на Upleft диагональ
                case 'Left-walk':
                    this.stopAnimate('Left-walk');
                    this.direction('Upleft-diagonal');
                    this.animateDiagonal('Upleft');
                break;

                //быстрый переход с Downright диагонали вверх
                case 'Downright-diagonal':
                    this.stopAnimate('Downright-diagonal');
                    this.direction('Back-walk');
                    this.animateMoving('top');
                break;

                //быстрый переход с Downleft диагонали вверх
                case 'Downleft-diagonal':
                    this.stopAnimate('Downleft-diagonal');
                    this.direction('Back-walk');
                    this.animateMoving('top');
                break;
            }
        }
	}


	//ДВИЖЕНИЕ ГЕРОЯ ВПРАВО
	heroMoveRight() {

		this.active_keys['D'] = true;
        if(!this.hero_options['timer_hero']) {
            this.direction('Right-walk');
            this.animateMoving('right');
        } else {
            switch(this.hero_options['start_direction']) {

                //быстрый переход на Downright диагональ
                case 'Front-walk':
                    this.stopAnimate('Front-walk');
                    this.direction('Downright-diagonal');
                    this.animateDiagonal('Downright');
                break;

                //быстрый переход на Upright диагональ
                case 'Back-walk':
                    this.stopAnimate('Back-walk');
                    this.direction('Upright-diagonal');
                    this.animateDiagonal('Upright');
                break;

                //быстрый переход вправо
                case 'Left-walk':
                    this.stopAnimate('Left-walk');
                    this.direction('Right-walk');
                    this.animateMoving('right');
                break;

                //быстрый переход с Upleft диагонали вправо
                case 'Upleft-diagonal':
                    this.stopAnimate('Upleft-diagonal');
                    this.direction('Right-walk');
                    this.animateMoving('right');
                break;

                //быстрый переход с Downleft диагонали вправо
                case 'Downleft-diagonal':
                    this.stopAnimate('Downleft-diagonal');
                    this.direction('Right-walk');
                    this.animateMoving('right');
                break;

            }
        };
	}


	//ДВИЖЕНИЕ ГЕРОЯ ВЛЕВО
	heroMoveLeft() {

		this.active_keys['A'] = true;
        if(!this.hero_options['timer_hero']) {
            this.direction('Left-walk');
            this.animateMoving('left');
        } else {
            switch(this.hero_options['start_direction']) {

                //быстрый переход на Downleft диагональ
                case 'Front-walk':
                    this.stopAnimate('Front-walk');
                    this.direction('Downleft-diagonal');
                    this.animateDiagonal('Downleft');
                break;

                //быстрый переход на Upleft диагональ
                case 'Back-walk':
                    this.stopAnimate('Back-walk');
                    this.direction('Upleft-diagonal');
                    this.animateDiagonal('Upleft');
                break;

                //быстрый переход влево
                case 'Right-walk':
                    this.stopAnimate('Right-walk');
                    this.direction('Left-walk');
                    this.animateMoving('left');
                break;

                //быстрый переход с Downright диагонали влево
                case 'Downright-diagonal':
                    this.stopAnimate('Downright-diagonal');
                    this.direction('Left-walk');
                    this.animateMoving('left');
                break;

                //быстрый переход с Upright диагонали влево
                case 'Upright-diagonal':
                    this.stopAnimate('Upright-diagonal');
                    this.direction('Left-walk');
                    this.animateMoving('left');
                break;

            }
        }
	}


	//ОСТАНОВКА ГЕРОЯ ПРИ ДВИЖЕНИИ ВНИЗ
	heroStopDown() {
		let active_keys = this.active_keys;

		active_keys['S'] = false;
        switch(this.hero_options['start_direction']) {

            //остановка снизу
            case 'Front-walk': 
                this.stopAnimate('Front-walk');

                if(active_keys['W']) {

                    //быстрый переход снова на Upright диагональ
                    if(active_keys['D']) {
                        this.direction('Upright-diagonal');
                        this.animateDiagonal('Upright');

                    //быстрый переход снова на Upleft диагональ
                    } else if(active_keys['A']) {
                        this.direction('Upleft-diagonal');
                        this.animateDiagonal('Upleft');

                    //быстрый переход снова вверх
                    } else {
                        this.direction('Back-walk');
                        this.animateMoving('top');
                    }
                }
            break;

            //остановка Downright диагонали и быстрый переход вправо
            case 'Downright-diagonal':
                this.stopAnimate('Downright-diagonal');
                this.direction('Right-walk');
                this.animateMoving('right');
            break; 

            //остановка Downleft диагонали и быстрый переход влево
            case 'Downleft-diagonal':
                this.stopAnimate('Downleft-diagonal');
                this.direction('Left-walk');
                this.animateMoving('left');
            break; 
        }  
	}



	//ОСТАНОВКА ГЕРОЯ ПРИ ДВИЖЕНИИ ВВЕРХ
	heroStopUp() {
		let active_keys = this.active_keys;

		active_keys['W'] = false;
        switch(this.hero_options['start_direction']) {

            //остановка сверху
            case 'Back-walk':
                this.stopAnimate('Back-walk');

                if(active_keys['S']) {

                    //быстрый переход снова на Downright диагональ
                    if(active_keys['D']) {
                        this.direction('Downright-diagonal');
                        this.animateDiagonal('Downright');

                    //быстрый переход снова на Downleft диагональ
                    } else if(active_keys['A']) {
                        this.direction('Downleft-diagonal');
                        this.animateDiagonal('Downleft');

                    //быстрый переход снова вниз
                    } else {
                        this.direction('Front-walk');
                        this.animateMoving('down');
                    }

                }
            break;

            //остановка Upright диагонали и быстрый переход вправо
            case 'Upright-diagonal':
                this.stopAnimate('Upright-diagonal');
                this.direction('Right-walk');
                this.animateMoving('right');
            break;

            //остановка Upleft диагонали и быстрый переход влево
            case 'Upleft-diagonal':
                this.stopAnimate('Upleft-diagonal');
                this.direction('Left-walk');
                this.animateMoving('left');
            break;
        }
	}



	//ОСТАНОВКА ГЕРОЯ ПРИ ДВИЖЕНИИ ВПРАВО
	heroStopRight() {
		let active_keys = this.active_keys;

		active_keys['D'] = false;
        switch(this.hero_options['start_direction']) {

            //остановка справа
            case 'Right-walk':
                 this.stopAnimate('Right-walk');

                 if(active_keys['A']) {

                    //быстрый переход снова на Downleft диагональ
                    if(active_keys['S']) {
                        this.direction('Downleft-diagonal');
                        this.animateDiagonal('Downleft');

                    //быстрый переход снова на Upleft диагональ
                    } else if(active_keys['W']) {
                        this.direction('Upleft-diagonal');
                        this.animateDiagonal('Upleft');

                    //быстрый переход снова влево
                    } else {
                        this.direction('Left-walk');
                        this.animateMoving('left');
                    }
                 }
            break;

            //остановка слева
            case 'Left-walk':

                if(active_keys['A']) {

                    //быстрый переход на Downleft диагональ
                    if(active_keys['S']) {
                        this.stopAnimate('Left-walk');
                        this.direction('Downleft-diagonal');
                        this.animateDiagonal('Downleft');

                    //быстрый переход на Upleft диагональ
                    } else if(active_keys['W']) {
                        this.stopAnimate('Left-walk');
                        this.direction('Upleft-diagonal');
                        this.animateDiagonal('Upleft');
                    }
                }
            break;

            //остановка Upright диагонали и быстрый переход вверх
            case 'Upright-diagonal':
                this.stopAnimate('Upright-diagonal');
                this.direction('Back-walk');
                this.animateMoving('top');
            break;

            //остановка Downright диагонали и быстрый переход вниз
            case 'Downright-diagonal':
                this.stopAnimate('Downright-diagonal');
                this.direction('Front-walk');
                this.animateMoving('down');
            break;
        }
	}



	//ОСТАНОВКА ГЕРОЯ ПРИ ДВИЖЕНИИ ВЛЕВО
	heroStopLeft() {
		let active_keys = this.active_keys;

		active_keys['A'] = false;
        switch(this.hero_options['start_direction']) {

            //остановка слева
            case 'Left-walk':
                this.stopAnimate('Left-walk');

                if(active_keys['D']) {

                    //быстрый переход снова на Upright диагональ
                    if(active_keys['W']) {
                        this.direction('Upright-diagonal');
                        this.animateDiagonal('Upright');

                    //быстрый переход снова на Downright диагональ
                    } else if(active_keys['S']) {
                        this.direction('Downright-diagonal');
                        this.animateDiagonal('Downright');

                    //быстрый переход снова вправо
                    } else {
                        this.direction('Right-walk');
                        this.animateMoving('right');
                    }
                }
            break;

            //остановка справа
            case 'Right-walk':

                if(active_keys['D']) {

                    //быстрый переход на Upright диагональ
                    if(active_keys['W']) {
                        this.stopAnimate('Right-walk');
                        this.direction('Upright-diagonal');
                        this.animateDiagonal('Upright');

                    //быстрый переход на Downright диагональ
                    } else if(active_keys['S']) {
                        this.stopAnimate('Right-walk');
                        this.direction('Downright-diagonal');
                        this.animateDiagonal('Downright');
                    }

                }
            break;

            //остановка Upleft диагонали и быстрый переход вверх
            case 'Upleft-diagonal':
                this.stopAnimate('Upleft-diagonal');
                this.direction('Back-walk');
                this.animateMoving('top');
            break;

            //остановка Downleft диагонали и быстрый переход вниз
            case 'Downleft-diagonal':
                this.stopAnimate('Downleft-diagonal');
                this.direction('Front-walk');
                this.animateMoving('down');
            break;
        }
	}


	//ПЕРЕХОД ГЕРОЯ НА БЕГ
	heroRun() {

		let hero_options = this.hero_options;

		if(!hero_options['hero_running']) {
        	hero_options['hero_running'] = true;

            if(this.ep['current'] != 0) {
                hero_options['hero_speed'] *= 1.5;
            };
        }
	}



	//ОСТАНОВКА БЕГА ГЕРОЯ
	heroStopRun() {

		let hero_options = this.hero_options;

		if(hero_options['hero_running']) {
            hero_options['hero_running'] = false;
            hero_options['hero_speed'] = hero_options['const_speed'];
        }
	}




	//АКТИВАЦИЯ СПОСОБНОСТИ ПО ГОРЯЧЕЙ КЛАВИШЕ
	activateSkill(keyCode) {

    	//получение способности
    	for(let [key, value] of this.game.Object.entries(this.hot_keys)) {

    		if(value == keyCode) {

            	for(let school of this.skills_obj['school']) {

		            if(school['num'] == parseInt(key) && school['current-skill']) {

	            		this.game.heroInterface.mousedown({
	            			which: 1,
	            			target: school['current-skill']
	            		})          	
		            };
		        };
    		};
    	};
	}


	//СМЕНА НАПРАВЛЕНИЯ ГЕРОЯ
	direction(direct_name) {

		let hero_options = this.hero_options;
	    let direct = hero_options['directions_obj'][direct_name];

		let count = 0;
	    let obj = direct['frames'];

	    hero_options['directions_obj'][hero_options['start_direction']]['stands_elem'].style.display = 'none';
	    hero_options['start_direction'] = direct['direct_elem'].id;
	    obj[0].style.display = 'block';

	    hero_options['hero_walk_sound'][0].stop();
	    hero_options['hero_walk_sound'][0].play();
	    hero_options['hero_walk_sound'].reverse();


	    (function animateFramesHero() {

	    	hero_options['timer_hero'] = setTimeout(() => {

	            count++;
	            
	            if(count == obj.length) {
	                obj[obj.length-1].style.display = 'none';
	                count = 0;
	            } else {
	                obj[count-1].style.display = 'none';
	            };
	            obj[count].style.display = 'block';
	            hero_options['hero_walk_sound'][0].stop();
	            hero_options['hero_walk_sound'][0].play();
	            hero_options['hero_walk_sound'].reverse();
	            
		        
		        hero_options['animation_frame'] = requestAnimationFrame(animateFramesHero)

		    }, obj[count].timeFrame/hero_options['hero_speed'])

	    })();
	}


	//ЗАДАНИЕ АНИМАЦИИ ДВИЖЕНИЯ ГЕРОЯ ПО 4 ОСНОВНЫМ НАПРАВЛЕНИЯМ
	animateMoving(side) {

		let hero_options = this.hero_options;
		let DOM_elements_hero = this.DOM_elements_hero;

		let speed = 0;
		let mark;

		if(side == 'down' || side == 'right') {
			mark = 1;
		} else {
			mark = -1;
		};

		switch(side) {

			//анимация вниз или вверх
			case 'down':
			case 'top':

				(function animateHero() {

		            if(!DOM_elements_hero['hero'].hidden) {
		                DOM_elements_hero['main_character'].style.top = 
		                parseFloat(DOM_elements_hero['main_character'].style.top) + mark*hero_options['hero_speed'] + 'px';
		            };
		            hero_options['animation_hero'] = requestAnimationFrame(animateHero)

			    })();
			break;

			//анимация влево или вправо
			case 'left':
			case 'right':

				(function animateHero() {

		            if(!DOM_elements_hero['hero'].hidden) {
		                DOM_elements_hero['main_character'].style.left = 
		                parseFloat(DOM_elements_hero['main_character'].style.left) + mark*hero_options['hero_speed'] + 'px';
		            };
		            hero_options['animation_hero'] = requestAnimationFrame(animateHero);

		        })();
			break;
		}
	}


	//ОСТАНОВКА АНИМАЦИИ ГЕРОЯ
	stopAnimate(direct_name) {

		let hero_options = this.hero_options;
		let direct = hero_options['directions_obj'][direct_name];

		cancelAnimationFrame(hero_options['animation_frame']);
	    clearTimeout(hero_options['timer_hero']);
	    cancelAnimationFrame(hero_options['animation_hero']);
	    hero_options['timer_hero'] = undefined;

	    for(let value of direct['frames']) {
	        if(value.style.display == 'block') {
	            value.style.display = 'none';
	            break;
	        }
	    };
	    direct['stands_elem'].style.display = 'block';
	};



	//АНИМАЦИЯ ДВИЖЕНИЕ ГЕРОЯ ПО ДИАГОНАЛИ
	animateDiagonal(side) {

        let math = Math;

		let hero_options = this.hero_options;
		let DOM_elements_hero = this.DOM_elements_hero;

		let mark1, mark2;

		switch(side) {

			//Downright диагональ
			case 'Downright':
				mark1 = 1;
				mark2 = 1;
			break;

			//Downleft диагональ
			case 'Downleft':
				mark1 = 1;
				mark2 = -1;
			break;

			//Upright диагональ
			case 'Upright':
				mark1 = -1;
				mark2 = 1;
			break;

			//Upleft диагональ
			case 'Upleft':
				mark1 = -1;
				mark2 = -1;
			break;
		};

	    (function animateHero() {
	        if(!DOM_elements_hero['hero'].hidden) {

	            DOM_elements_hero['main_character'].style.left = 
	            parseFloat(DOM_elements_hero['main_character'].style.left) + mark2*hero_options['hero_speed']/math.SQRT2 + 'px';

	            DOM_elements_hero['main_character'].style.top = 
	            parseFloat(DOM_elements_hero['main_character'].style.top) + mark1*hero_options['hero_speed']/math.SQRT2 + 'px';
	        };
	        hero_options['animation_hero'] = requestAnimationFrame(animateHero)
	    })();

	};




	//ДЕГЕНЕРАЦИЯ ХАРАКТЕРИСТИКИ ГЕРОЯ 
	degenCharact(charact) {

		switch(charact) {

			case 'ep':
				let hero_options = this.hero_options;

				if(hero_options['hero_running'] && !hero_options['degen_ep']) {
		           
	                if(hero_options['timer_hero'] && !this.DOM_elements_hero['hero'].hidden) {

	                	//остановка увеличения выносливости героя и включение уменьшения выносливости героя 
	                    this.increaseEnergePoints('stop');
	                    this.decreaseEnergePoints();
	                }
		        };
			break;

		}
	}



	//РЕГЕНЕРАЦИЯ ХАРАКТЕРИСТИКИ ГЕРОЯ 
	regenCharact(charact) {

		let hero_options = this.hero_options;

		switch(charact) {

			case 'hp':
			case 'mp':
				(function regen () {

					if(hero_options[`regen_${charact}s`] != 0 && this[charact]['current'] != this[charact]['max']) {
						this.changeCurrentCharact(charact, hero_options[`regen_${charact}s`]/60);
					};

					this[charact]['regen_timer'] = requestAnimationFrame(regen.bind(this));
					
				}).call(this);
			break;

			case 'ep':

				if(hero_options['degen_ep'] && !this.DOM_elements_hero['hero'].hidden) {

	                if( (!hero_options['hero_running'] && hero_options['timer_hero']) || 
	                	(!hero_options['timer_hero'] && hero_options['hero_running']) ) 
	                {
	                	//остановка уменьшения выносливости героя и включение увеличения выносливости героя
	                    this.decreaseEnergePoints('stop');
	                    this.increaseEnergePoints();
	                };
		        };
			break;
		}
	};




	//УСТАНОВКА ИЛИ ОСТАНОВКА ТАЙМЕРА РЕГЕНЕРАЦИИ (УВЕЛИЧЕНИЯ) ВЫНОСЛИВОСТИ
	increaseEnergePoints(stop) {

	    if(stop) {
	    	cancelAnimationFrame(this.ep['regen_timer']);
	        clearTimeout(this.ep['regen_delay']);
	    } else {

	        let hero_options = this.hero_options;
	    	let heroInterface = this.game.heroInterface;

	        clearTimeout(this.ep['regen_delay']);
	        this.ep['regen_delay'] = setTimeout(() => {

	            (function animateEp () {

	                let max = this.ep['max'];
	                let plus = this.ep['current'] + hero_options['regen_eps']/60;

	                if(!this.ep['current']) {
	                    if(hero_options['hero_running']) {
	                        hero_options['hero_speed'] *= 1.5;
	                    };
	                    //отключение таймера лимита ep
	                    heroInterface.stopBlinkBar('ep');
	                };
	                if(plus > max) {
	                    heroInterface.changeDisplayCharact({
	                    	charact: 'ep',
	                    	new_current: max,
	                    	max
	                    });
	                    this.ep['current'] = max;
	                } else {
	                    heroInterface.changeDisplayCharact({
	                    	charact: 'ep',
	                    	new_current: plus,
	                    	max
	                    });
	                    this.ep['current'] = plus;
	                    this.ep['regen_timer'] = requestAnimationFrame(animateEp.bind(this))
	                };
	                    
	            }).call(this);


	        }, 1000)
	    }
	};




	//УСТАНОВКА ИЛИ ОСТАНОВКА ТАЙМЕРА ДЕГЕНЕРАЦИИ (УМЕНЬШЕНИЯ) ВЫНОСЛИВОСТИ
	decreaseEnergePoints(stop) {

	    if(stop) {
	        cancelAnimationFrame(this.ep['regen_timer']);
	        this.hero_options['degen_ep'] = false;
	    } else {

	        let hero_options = this.hero_options;
			let heroInterface = this.game.heroInterface;

	        (function animateEp() {

	            let damage = this.ep['current'] + hero_options['degen_eps']/60;
	            let max = this.ep['max'];

	            //проверка на нулевое значение ep
	            if(damage <= 0) {

	                //отключаем таймер лимита при ударе
	                if(hero_options['ep_blink_strike']) {
	                    cancelAnimationFrame(hero_options['ep_blink_timer']);
	                    hero_options['ep_blink_timer'] = undefined;
	                    hero_options['ep_blink_strike'] = false;
	                };

	                if(!hero_options['ep_blink_timer']) {

	                    hero_options['hero_speed'] /= 1.5;

	                    //таймер мигающей полоски ep
	                    heroInterface.activateBlinkBar('ep');

	                    heroInterface.changeDisplayCharact({
	                    	charact: 'ep',
	                    	new_current: 0,
	                    	max
	                    });
	                    this.ep['current'] = 0;
	                };

	            } else {
	                heroInterface.changeDisplayCharact({
                    	charact: 'ep',
                    	new_current: damage,
                    	max
	                });
	                this.ep['current'] = damage;
	                this.ep['regen_timer'] = requestAnimationFrame(animateEp.bind(this));
	            };


	        }).call(this);

	        hero_options['degen_ep'] = true;
	    }
	};




	//УВЕЛИЧЕНИЕ МАКСИМАЛЬНЫХ ХАРАКТЕРИСТИК ГЕРОЯ
	changeMaxCharact(charact, value) {

		if(this[charact]['current'] != 0) {
	        this[charact]['max'] = this[charact]['max'] + value;
	        this.changeCurrentCharact(charact, value)    
    	} 
	}





	//ИЗМЕНЕНИЕ ОСНОВНЫХ ХАРАКТЕРИСТИК ГЕРОЯ (кроме уровня)
	changeCurrentCharact(charact, value) {

		let current = this[charact]['current'];
		let new_current = current + value;
	    let max = this[charact]['max'];

	    if(new_current < 0) {
	        new_current = 0;
	    } else if(new_current >= max) {

	    	//переход на новый уровень
	    	if(charact == 'ex') {
	    		this.levelUp({
	    			rest_ex: new_current - max
	    		});
	    		return;
	    	} else {
	    		new_current = max;
	    	}
	    };

		//изменение показа иконок на интерфейсе
	    this.game.heroInterface.showChangesCharacts({charact, new_current, max});

	    this[charact]['current'] = new_current;
	}



	//ДОСТИЖЕНИЕ НОВОГО УРОВНЯ ГЕРОЯ
	levelUp({increase_level, rest_ex}) {

		//увеличение уровня по умолчанию
		if(increase_level == undefined) {
			increase_level = this.hero_options['plus_characts']['level'];
		};

		if(increase_level > 0) {

			let hero_options = this.hero_options;

			let new_level = ++this.level['current'];
	        let max = this.ex['max'];

	        if(!rest_ex) {
	        	rest_ex = 0;
	        };

	        //увеличение коэффициентов роста уровня
	        switch(new_level) {

	            case 2:
	            case 3:
	            case 4:
	                max = this.game.Math.ceil(max * 2.5);
	            break;

	            default:
	                max = this.game.Math.ceil(max * 1.5);
	            break;
	        };

	        this.ex['current'] = 0;
	        this.ex['max'] = max;


	        //увеличение очков для характеристик героя
	        this.changeCurrentCharact('cp', hero_options['plus_characts']['cp'])

	        //увеличение очков для способностей
	        this.changeCurrentCharact('sp', hero_options['plus_characts']['sp'])

	        //переход остаточного опыта на следующий уровень и показ нового опыта на интерфейсе
	        this.changeCurrentCharact('ex', rest_ex)

	        //увеличение стоимости эликсиров
	        this.hero_options['cost_manaElixir'] = max * 0.3;
	        this.hero_options['cost_hpElixir'] = max * 0.15;

	        //воспроизведение звука
	        this.game.audio_obj['effects']['Hero']['LevelUp'].play();

	        //показ характеристик на интерфейсе
	      	this.game.heroInterface.showChangesCharacts({
	      		charact: 'level', 
	      		new_current: new_level, 
	      		max 
	      	});

	      	//переход на следующий уровень
	      	increase_level--;
	      	this.levelUp({increase_level, rest_ex})
		}
	}



	//ЗАПУСК ТАЙМЕРА ВЗАИМОДЕЙСТВИЯ ГЕРОЯ С ОБЪЕКТАМИ ИГРЫ
	runConnectTimer() {

        let hero = this;
        let static_objects = this.game.staticObjects;

        let main_character = this.DOM_elements_hero['main_character'];
        let hero_position = this.hero_position;
        let hero_options = this.hero_options;
        let screen_obj = this.screen_obj;

        let x, y, x_hero, y_hero;

        //показать начальный кадр героя
        document.getElementById('Hero-front-stands').style.display = 'block';

        //установка начальных координат герою
        this.DOM_elements_hero['main_character'].style.left = this.game.save_obj['game_obj']['xStart_hero'] + 'px';
        this.DOM_elements_hero['main_character'].style.top  = this.game.save_obj['game_obj']['yStart_hero'] + 'px';

        //установка начальных ближайших объектов
        static_objects.setClosestSO(hero_position['x'], hero_position['y']);

        //искусственная задержка для загрузки классов
        setTimeout(() => {

            (function connectTimer (time) {

                x = parseFloat(main_character.style.left);
                y = parseFloat(main_character.style.top);
                x_hero = x + hero_position['x_center'];
                y_hero = y + hero_position['y_center'];
                hero_position['x'] = x_hero;
                hero_position['y'] = y_hero;

                //центрирование камеры      
                window.scrollTo(x - screen_obj['screen_centerX'], y - screen_obj['screen_centerY']);

                // при движении героя устанавливаем взаимодействия
                if(hero_options['timer_hero']) {

                    //установка в объект SO только ближайшие объекты
                    static_objects.setClosestSO(x_hero, y_hero);

                    //установка физического круга взаимодействия с неподвижными объектами
                    static_objects.setStaticPhysicCircle(hero_position);

                };

                //установка приоритетов видимости (z-index)
                static_objects.setVisibilityPriorities();

                //проверка на смерть героя
                hero.checkDeathHero();

                //проверка FPS
                // console.log(1000/(time-this) || 0);

                requestAnimationFrame(connectTimer.bind(time));

            })();
            
        }, 100)

	};





    //ПРОВЕРКА СМЕРТИ ГЕРОЯ
    checkDeathHero() {

        //смерть героя
        if(this.hp['current'] <= 0) {

            if(this.hero_options['start_direction'] != 'Death-hero') {

                //остановка регенерации
                cancelAnimationFrame(this.hp['regen_timer']);
                cancelAnimationFrame(this.mp['regen_timer']);

                //скрытие всех ударов и способностей
                this.DOM_elements_hero['hero'].hidden = false;
                this.DOM_elements_hero['hero_strikes'].hidden = true;
                this.DOM_elements_hero['hero_skills'].hidden = true;

                //остановка регенерации и дегенерации выносливости
                this.increaseEnergePoints('stop');
                this.decreaseEnergePoints('stop');

                //переход на Death-hero
                this.stopAnimate(this.hero_options['start_direction']);
                this.direction('Death-hero');

                //отключение всех звуков героя
                this.hero_options['hero_walk_sound'].forEach((e) => e.muted = true);
                this.game.audio_obj['effects']['Hero']['Heart_beat'].stop();

                //включение звуков смерти
                this.game.audio_obj['effects']['Hero']['Game-over'].play();
                this.game.audio_obj['effects']['Hero']['Death_hero'].play();

                //отключение событий нажатия и отпускания на клавиатуру и нажатия на интерфейс
                window.onkeydown = function () {};
                window.onkeyup = function () {};
                this.game.heroInterface.DOM_elements_interface['hero-interface'].onmousedown = function () {};


            //последний кадр смерти героя
            } else if(Prototypes.checkDisplayLastFrame(this.hero_options['directions_obj']['Death-hero']['frames'])) {

                if(this.hero_options['timer_hero']) {

                    //кровь герою
                    let hero_blood = this.hero_options['directions_obj']['Hero-blood-big'];
                    hero_blood['direct_elem'].style.display = 'block';
                    this.game.Math.randomElem(hero_blood['frames']).style.display = 'block';

                    //отключение анимации кадров героя
                    cancelAnimationFrame(this.hero_options['animation_frame']);
                    clearTimeout(this.hero_options['timer_hero']);
                    this.hero_options['timer_hero'] = undefined;

                    //открытие мини-меню при смерти героя
                    document.getElementById('Death-menu').style.display = 'block';

                    //создание событий мини-меню при смерти героя
                    document.getElementById('New-game').addEventListener('mousedown', () => {
                        document.location.href = 'Game.html';
                    }, true);

                    document.getElementById('Exit-game').addEventListener('mousedown', () => {

                        this.game.save_obj['game_obj']['play_intro'] = false;
                        Prototypes.save_obj = this.game.save_obj;

                        document.location.href = 'Main-menu.html';
                    }, true);
                };

                this.DOM_elements_hero['main_character'].style.zIndex = 0;
            };
            
        } else {

            let heart_beat = this.game.audio_obj['effects']['Hero']['Heart_beat'];

            //включение присмертного звука
            if(this.hp['current'] <= 100) {

                if(!heart_beat.currentTime) {
                    heart_beat.loop = true;
                    heart_beat.play();
                }

            //отключение присмертного звука
            } else if(heart_beat.currentTime) {
                heart_beat.stop();
            }

        }
    }


}