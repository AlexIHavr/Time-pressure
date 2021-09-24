class HeroStrikes {

	
	constructor(hero) {

		//ССЫЛКА НА ВСЕ КЛАССЫ
		this.game = game;

		//ХАРАКТЕРИСТИКИ УДАРОВ (cost в единицах маны по умолчанию либо в единицах charact)
		this.characts_strikes = {
			'Simple-strike': {
				'charact': 'ep',
				'max_angle_strike': 60,
				'strike_frame': 3,
				'cost': 20
			},
			'Fireball-strike': {
				'strike_frame': 2
			},
			'Icelance-strike': {
				'strike_frame': 2
			},
			'Charge-strike': {
				'strike_frame': 3
			}
		};

		//УСТАНОВКА КАРТИНОК УДАРАМ
		Prototypes.setActionImg('Hero-strikes');
	}



	//ПРОСТОЙ УДАР ГЕРОЯ
	simpleStrike() {

		//анимирование удара
		let moment_strike = new Promise((resolve) => {
			this.animateHeroStrike({
				type: 'Simple-strike',
				resolve
			})
		});
	};





	//ЗАПУСК ГЕРОЕМ ОГНЕННЫХ ШАРОВ
	fireballStrike() {

		//анимирование удара
		let moment_strike = new Promise((resolve) => {
			this.animateHeroStrike({
				type: 'Fireball-strike',
				resolve
			})
		});

		//нанесение удара в момент удара
		moment_strike.then(() => {
			this.runFlyingSkill('Fireball');
		})
	}





	//ЗАПУСК ГЕРОЕМ ЛЕДЯНЫХ СТРЕЛ
	icelanceStrike() {

		//анимирование удара
		let moment_strike = new Promise((resolve) => {
			this.animateHeroStrike({
				type: 'Icelance-strike',
				resolve
			})
		});

		//нанесение удара в момент удара
		moment_strike.then(() => {

			let skills_obj = this.game.hero.skills_obj;
			let characts_skill = this.game.heroSkills.characts_skills['Icelance'];

			this.runFlyingSkill('Icelance');

			//при достижении максимального количества снарядов - рестарт способности
			if(skills_obj['icelance_i'] == characts_skill['count']) {

			    skills_obj['current_attack'] = skills_obj['const_attack'];
			    skills_obj['icelance_i'] = 0;

			    this.game.heroSkills.setTimeRestartInstantly('Icelance')
			}
		})
	}





	//ЗАПУСК РЫВКА ГЕРОЕМ
	chargeStrike() {

		//анимирование удара
		let moment_strike = new Promise((resolve) => {
			this.animateHeroStrike({
				type: 'Charge-strike',
				resolve
			})
		});

		let hero = this.game.hero;
		let math = this.game.Math;
		let static_objects = this.game.staticObjects;
		let DOM_elements_hero = hero.DOM_elements_hero;
		let angleInRad = this.game.Math.degreeInRan(hero.skills_obj['angle_strike']);
    	let speed = this.game.heroSkills.characts_skills['Charge']['speed'];
    	let animateSpeedFunc;

    	//функция остановки рывка
    	let stopAnimateSpeedUp = () => {
	    	
	    	//остановка рывка
			cancelAnimationFrame(animateSpeedFunc);

			//рестарт способности
			hero.skills_obj['current_attack'] = hero.skills_obj['const_attack'];
			this.game.heroSkills.setTimeRestartInstantly('Charge')
	    };

		//анимация увеличения скорости при рывке
	    (function animateSpeedUp () {

	    	//установка ближайших от героя неподвжиных объектов
	    	static_objects.setClosestSO(hero.hero_position['x'], hero.hero_position['y']);

	    	if(!static_objects.setStaticPhysicCircle(hero.hero_position, hero)) {

	    		 DOM_elements_hero['main_character'].style.left = math.rFromCenterX(
		        	parseFloat(DOM_elements_hero['main_character'].style.left), 
		        	speed, 
		        	angleInRad
		        ) + 'px';
		        DOM_elements_hero['main_character'].style.top = math.rFromCenterY(
		        	parseFloat(DOM_elements_hero['main_character'].style.top), 
		        	speed, 
		        	angleInRad
		        ) + 'px';

		        animateSpeedFunc = requestAnimationFrame(animateSpeedUp);

		    //врезание в неподвжиный объект
	    	} else {

	    		//остановить рывок
				stopAnimateSpeedUp();
	    	};
	    })();


	    //нанесение удара в момент удара
		moment_strike.then(() => {

			//остановить рывок
			stopAnimateSpeedUp();
		});
		
	}





	//ЗАПУСК ЛЕТЯЩЕГО УДАРА СПОСОБНОСТИ (ОГНЕННОГО ШАРА, ЛЕДЯНОЙ СТРЕЛЫ)
	runFlyingSkill(type) {

		let hero = this.game.hero;

		let type_lowercase = type.toLowerCase();

		let math = this.game.Math;
		let skills_obj = hero.skills_obj;
		let DOM_elements_hero = hero.DOM_elements_hero;
		let characts_skill = this.game.heroSkills.characts_skills[type];

	    let clone = skills_obj['effects'][type]['action_elem'].cloneNode(true);
	    let count = 0;
	    let animation_moving;
	    let action_arr = Prototypes.getActionArr(clone);

	    let skill_obj = {

	    	//индивидуальные характеристики каждого снаряда
	   		'obj': action_arr,
	   		'x': 0,
	   		'y': 0,

	   		//дополнительные характеристики каждого снаряда
	   		'force': characts_skill['force'],
	   		'size': characts_skill['size']
	    };

	    DOM_elements_hero['hero_effects'].appendChild(clone);

	    let index = skills_obj[`${type_lowercase}_i`];

	    skills_obj[`${type_lowercase}_obj`][index] = skill_obj;
	    skills_obj[`${type_lowercase}_i`]++;

	    //метод для остановки статической анимации
	    let stop_static_animation = Prototypes.runStaticAnimation({
	    	frames: action_arr,
	    	times: 80,
	    	infinity: true
	    });


	    //угол выстрела
	    let angle = this.game.Math.degreeInRan(skills_obj['angle_strike']);

	    //время выстрела
	    let start_time = performance.now();

	    //расстояние прохождение выстрела
	    let r = 0;

	    //координаты снаряда в центра вращения удара героя
	    let x0 = hero.hero_position['x'] - 25;
	    let y0 = hero.hero_position['y'] - 60;

	    //координаты снаряда (в руке героя)
	    let x0r = this.game.Math.rFromCenterX(x0, 20, angle) + 25;
	    let y0r = this.game.Math.rFromCenterY(y0, 20, angle)

	    //координаты центра вращения снаряда
	    let x1 = this.game.Math.rFromCenterX(x0 + 22, 20, angle);
	    let y1 = this.game.Math.rFromCenterY(y0 + 42, 20, angle);

	    //координаты центра физического круга снаряда
	    skill_obj['x'] = this.game.Math.rFromCenterX(x1, 32, angle + 0.75);
	    skill_obj['y'] = this.game.Math.rFromCenterY(y1, 32, angle + 0.75);

	    clone.style.cssText = 'transform: rotate(' + (skills_obj['angle_strike'] + 90) + `deg); 
										  left:` + x0r + `px; 
										  top:` + y0r + 'px;'


	    //метод для удаление снаряда
	    skill_obj['delete'] = () => {
	        stop_static_animation();
	        cancelAnimationFrame(animation_moving);
	        delete skills_obj[`${type_lowercase}_obj`][index];
	        DOM_elements_hero['hero_effects'].removeChild(clone);
	    };

	    //анимация движения снаряда
	    (function animateFly (time) {

	        if(!hero.hero_options['pause']) {

	        	//проверка на размер снаряда (при его наличии)
	        	if(skill_obj['size'] <= 0) {
	        		skill_obj['delete']();
	                return 0;
	        	};

	        	//проверка на достижения максимального расстояния снаряда
	        	r = characts_skill['speed'] * ((time - start_time) || 0) / 1000;

	            if(r < characts_skill['distance']) {

	                clone.style.left = math.rFromCenterX(parseFloat(clone.style.left), r, angle) + 'px';
	                clone.style.top = math.rFromCenterY(parseFloat(clone.style.top), r, angle) + 'px';

	                skill_obj['x'] = math.rFromCenterX(skill_obj['x'], r, angle);
	                skill_obj['y'] = math.rFromCenterY(skill_obj['y'], r, angle);

	                // document.getElementById('PhysicCircle2').style.cssText = 'top:' + (skill_obj['y'] - skill_obj['radius']) + 'px; left:' + (skill_obj['x'] - skill_obj['radius']) + 'px; width:' + (skill_obj['radius']*2) + 'px; height:' + (skill_obj['radius']*2) + 'px;'
	            } else {
	                skill_obj['delete']();
	                return 0;
	            };

	        } else {
	        	start_time = time;
	        };

	        animation_moving = requestAnimationFrame(animateFly) 
	    })();
	}



	//ЗАПУСК ВЗРЫВА СПОСОБНОСТИ (ОГНЕННОГО ШАРА)
	runExplosionSkill(type, index) {

		let skills_obj = this.game.hero.skills_obj;

		let explosion = skills_obj['effects']['Explosion'];
	    let clone = explosion['action_elem'].cloneNode(true);
	    let r = this.game.heroSkills.characts_skills[type]['radius_explosion'];

	    let type_lowercase = type.toLowerCase();

	    //добавление элемента взрыва на карту
	    this.game.hero.DOM_elements_hero['hero_effects'].appendChild(clone);
	    clone.style.left = skills_obj[`${type_lowercase}_obj`][index]['x'] - r + 'px';
	    clone.style.top = skills_obj[`${type_lowercase}_obj`][index]['y'] - r + 'px';

	    //звук при взрыве
	    this.game.audio_obj['effects']['Skills'][`Explosion-${type_lowercase}`].stop();
	    this.game.audio_obj['effects']['Skills'][`Explosion-${type_lowercase}`].play();

	    let end_animation = new Promise((resolve) => {

	    	//запуск анимации взрыва
	    	Prototypes.runStaticAnimation({
		    	frames: Prototypes.getActionArr(clone),
		    	times: 100,
		    	resolve
	    	})
	    });

	    //удаление элемента взрыва в конце анимации
	    end_animation.then(() => {
	    	this.game.hero.DOM_elements_hero['hero_effects'].removeChild(clone);
	    })
	}







	//ПОЛУЧЕНИЕ ОБЪЕКТА С КАДРАМИ МОМЕНТОВ УДАРОВ
	getStrikesFrames() {

		let obj = {};

		for(let key in this.characts_strikes) {
			obj[key] = document.getElementById(key).children[
											this.characts_strikes[key]['strike_frame']]
		};

		return obj;
	}







	//АНИМИРОВАНИЕ УДАРА ГЕРОЯ
	animateHeroStrike({type, resolve}) {

		let charact = this.characts_strikes[type]['charact'] || 'mp';
		let cost = this.characts_strikes[type]['cost'] || 0;

		if(this.game.hero[charact]['current'] >= cost) {

			let skills_obj = this.game.hero.skills_obj;
			let hero_options = this.game.hero.hero_options;
			let DOM_elements_hero = this.game.hero.DOM_elements_hero;

			//номер кадра удара
			let strike_frame = this.characts_strikes[type]['strike_frame'];

	        //непрерывный удар героя
	        if(skills_obj['ready_obj']['Strike']) {

	            let hide_arr = skills_obj['strikes'][skills_obj['previous_attack']]['frames'];

	            clearTimeout(skills_obj['ready_obj']['Strike']);
	            hide_arr[hide_arr.length-1].style.display = 'none';
	            skills_obj['ready_obj']['Strike'] = undefined;
	        };

	        //герой находится в процессе удара
	        skills_obj['active_strikes'][type] = true;

	        skills_obj['sound_strike'].stop();
	        skills_obj['sound_strike'] = this.game.Math.randomElem(this.game.audio_obj['effects']['Strikes'][type]);
	        skills_obj['sound_strike'].play();
	        DOM_elements_hero['hero'].hidden = true;
	        DOM_elements_hero['hero_strikes'].style.transform = 
	        	'rotate(' + (skills_obj['angle_strike'] + 90) + 'deg) scale(2.2)';

	        //удар для прерывания
	        skills_obj['previous_attack'] = type;


	        hero_options['hero_walk_sound'][0].muted = true;
	        hero_options['hero_walk_sound'][1].muted = true;
	        
	        this.game.hero.increaseEnergePoints('stop');
	        this.game.hero.decreaseEnergePoints('stop');

	        let count = 0;
	        let obj = skills_obj['strikes'][type]['frames'];
	        obj[0].style.display = 'block';

	        (function animateStrike () {

	            setTimeout(() => {

	                count++;

	                if(count == strike_frame) {
	                	this.game.hero.changeCurrentCharact(charact, -cost);
	                    resolve();
	                };

	                if(count == obj.length) {

	                    skills_obj['ready_obj']['Strike'] = setTimeout(() => {

	                        obj[obj.length-1].style.display = 'none';
	                        DOM_elements_hero['hero'].hidden = false;
	                        this.game.hero.increaseEnergePoints();
	                        skills_obj['ready_obj']['Strike'] = undefined;
	                        hero_options['hero_walk_sound'][0].muted = false;
	                        hero_options['hero_walk_sound'][1].muted = false;
	                    }, 250);

	                    //герой не находится в процессе удара
	                    skills_obj['active_strikes'][type] = false;
	                } else {
	                    obj[count-1].style.display = 'none';
	                    obj[count].style.display = 'block';
	                    requestAnimationFrame(animateStrike.bind(this))
	                };
	            
	            }, obj[count].timeFrame / skills_obj['speed_strike']);

	        }).call(this)
	        
	    } else if(!this.game.hero.hero_options['ep_blink_timer']) {
	        this.game.heroInterface.activateBlinkBar(charact, 'one_blink');
	    };
	}
}