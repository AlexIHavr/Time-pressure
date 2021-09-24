class HeroSkills {

	constructor(hero) {

		//ССЫЛКА НА ВСЕ КЛАССЫ
		this.game = game;

		//ХАРАКТЕРИСТИКИ СПОСОБНОСТЕЙ (cost в единицах маны по умолчанию)
		this.characts_skills = {
			'Fireball': {
				'force': 30,
	            'radius': 18, 
	            'speed': 100,
	            'distance': 50,
	            'radius_explosion': 90,
				'k_speed_strike': 0.67,
				'time_action': 7,
	        	'time_restart': 30,
	        	'cost': 60
			},
	        'Fierytrail': {
	            'force_ps': 13,
	            'radius': 45,
	            'k_speed_hero': 1,
	            'time_action': 10,
	        	'time_restart': 60,
	        	'cost': 100
	        },
	        'Regen': {
	            'hps': 15,
	            'k_speed_hero': 0.5,
	            'cost': 70,
	            'time_restart': 10
	        },
	        'Rage': {
	            'k_force': 1.5,
	            'k_speed_strike': 1.3,
	            'time_action': 10,
	        	'time_restart': 25,
	        	'cost': 40
	        },
	        'Soulsteel': {
	            'hps': 10,
	            'distance': 200,
	            'time_action': 3,
	        	'time_restart': 40,
	        	'cost': 70
	        },
	        'Stoptime': {
	            'time_action': 6,
	            'time_restart': 30,
	            'cost': 50
	        },
	        'Charge': {
	        	'speed': 30,
	            'k_pushtime': 10,
	            'time_restart': 4,
	            'cost': 20
	        },
	        'Icelance': {
	        	'count': 1,
	        	'force': 300,
	        	'size': 50, 
		    	'radius': 18, 
		    	'speed': 30,
		    	'distance': 30,
	            'decrease_size': 10,
	        	'time_restart': 4,
	        	'cost': 30
	        }
    	};

    	//УСТАНОВКА КАРТИНОК СПОСОБНОСТЯМ И ИКОНКАМ
    	Prototypes.setActionImg('Hero-skills');
    	Prototypes.setActionImg('Hero-effects');
    	Prototypes.setIconImg('Icons-skills')
	}





	//ЯРОСТЬ 
	rage() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Rage',
				animate: true,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			let characts_skill = this.characts_skills['Rage'];
			let skills_obj = this.game.hero.skills_obj;
		    let icon = skills_obj['icons']['Rage'];

		    //установка времени активации
		    let end_time_action = new Promise((resolve) => {
		    	this.setTimeAction('Rage', resolve);
		    });

		    this.setEffectHero('saturate(170%)');

		    //увеличение скорости и силы основной атаки
		    skills_obj['speed_strike'] *= characts_skill['k_speed_strike'];
		    skills_obj['forse_sword'] *= characts_skill['k_force'];

		    //действия после конца времени действия способности
		    end_time_action.then(() => {

		    	this.setTimeRestart('Rage');
		    	this.setEffectHero('default');

		        skills_obj['speed_strike'] /= characts_skill['k_speed_strike']
		        skills_obj['forse_sword'] /= characts_skill['k_force'];
		    });
		})
	}





	//ОГНЕННЫЙ ШАР
	fireball() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Fireball', 
				animate: false,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			let characts_skill = this.characts_skills['Fireball'];
			let skills_obj = this.game.hero.skills_obj;
		    let icon = skills_obj['icons']['Fireball'];

		    //установка времени активации
		    let end_time_action = new Promise((resolve) => {
		    	this.setTimeAction('Fireball', resolve);
		    });

		    this.setEffectHero('drop-shadow(0px 0px 10px red)');

		    //герой может запускать огненный шары вместо обычной атаки
		    skills_obj['current_attack'] = 'Fireball-strike';

		    //уменьшение скорости атаки
		    skills_obj['speed_strike'] *= characts_skill['k_speed_strike'];

		    //действия после конца времени действия способности
		    end_time_action.then(() => {

		    	this.setTimeRestart('Fireball');
		    	this.setEffectHero('default');

		        skills_obj['current_attack'] = skills_obj['const_attack'];
		        skills_obj['speed_strike'] /= characts_skill['k_speed_strike'];
		        skills_obj['fireball_i'] = 0;
		    })

		})
	}




	//ЛЕДЯНОЕ КОПЬЕ
	icelance() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Icelance',
				animate: false,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			//герой может запускать ледяные стрелы вместо обычной атаки
		    this.game.hero.skills_obj['current_attack'] = 'Icelance-strike';
		})
	}






	//ОГНЕННЫЙ СЛЕД
	fierytrail() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Fierytrail',
				animate: false,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			let audio_obj = this.game.audio_obj;
			let hero_options = this.game.hero.hero_options;
			let skills_obj = this.game.hero.skills_obj;
			let characts_skill = this.characts_skills['Fierytrail']; 
			let DOM_elements_hero = this.game.hero.DOM_elements_hero;
		    
		    let fierytrail_animation;
		    let timeout_fierytrail;
		    let x_fierytrail;
		    let y_fierytrail;

		    let num_fierytrail = 0;

		    let k_speed_hero = characts_skill['k_speed_hero'];

		    //установка времени активации
		    let end_time_action = new Promise((resolve) => {
		    	this.setTimeAction('Fierytrail', resolve);
		    });

		    //увеличение скорости передвижения героя
		    hero_options['hero_speed']  *= k_speed_hero;
		    hero_options['const_speed'] *= k_speed_hero;
		    
		    (function animateFierytrail () {


		        if(hero_options['timer_hero']) {

		            x_fierytrail = parseFloat(DOM_elements_hero['main_character'].style.left) - 40;
		            y_fierytrail = parseFloat(DOM_elements_hero['main_character'].style.top);

		            //оставить огненный след
		            timeout_fierytrail = setTimeout(() => {

		                let fierytrail_obj = {
		                	'x': x_fierytrail + 95, 
		                	'y': y_fierytrail + 85
		                };

		                let fierytrail = skills_obj['effects']['Fierytrail'];
		                let clone = fierytrail['action_elem'].cloneNode(true);

		                let count = 0;
		                let action_arr = Prototypes.getActionArr(clone);
		                let num = num_fierytrail;

		                if(num == 0) {
		                    audio_obj['effects']['Skills']['Burn'].loop = true;
		                    audio_obj['effects']['Skills']['Burn'].play(); 
		                };

		                audio_obj['effects']['Skills']['Fire'].stop();
		                audio_obj['effects']['Skills']['Fire'].play();

		                DOM_elements_hero['hero_effects'].appendChild(clone);
		                skills_obj['fierytrail_obj'][num] = fierytrail_obj;
		                num_fierytrail++;

		                //метод для остановки статической анимации
		                let stop_static_animation = Prototypes.runStaticAnimation({
		                	frames: action_arr,
		                	times: 80,
		                	infinity: true
		                });

		                //координаты огненного следа
		                clone.style.left = x_fierytrail + 'px';
		                clone.style.top =  y_fierytrail + 'px';
		                // clone.style.zIndex = DOM_elements_hero['main_character'].style.zIndex - 1;

		                fierytrail_animation = requestAnimationFrame(animateFierytrail);

		                //таймер на удаление огненного следа
		                let timeout_delete = setInterval(() => {

		                    if(!hero_options['pause']) {
		                        stop_static_animation();
		                        clearInterval(timeout_delete);
		                        DOM_elements_hero['hero_effects'].removeChild(clone);
		                        delete skills_obj['fierytrail_obj'][num];
		                        if(!Object.keys(skills_obj['fierytrail_obj']).length) {
		                           audio_obj['effects']['Skills']['Burn'].slowStop(); 
		                        };
		                    }

		                }, Math.randomNumber(6000,8000))

		            }, 800/hero_options['hero_speed']);

		        } else {
		            fierytrail_animation = requestAnimationFrame(animateFierytrail)
		        };

		    })();

		    //действия после конца времени действия способности
		    end_time_action.then(() => {

		    	this.setTimeRestart('Fierytrail');

		        cancelAnimationFrame(fierytrail_animation);
		        clearTimeout(timeout_fierytrail);

		        hero_options['hero_speed'] /= k_speed_hero;
		        hero_options['const_speed'] /= k_speed_hero;
		    })
		})
	}





	//РЕГЕНЕРАЦИЯ
	regen() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Regen',
				animate: true,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			let characts_skill = this.characts_skills['Regen'];
			let hero_options = this.game.hero.hero_options; 
			let skills_obj = this.game.hero.skills_obj;

			let k_speed_hero = characts_skill['k_speed_hero'];
			let hps = characts_skill['hps'];

			//увеличение hps героя
			hero_options['regen_hps'] += hps;

			//уменьшение скорости передвижения героя
			hero_options['hero_speed']  *= k_speed_hero;
		    hero_options['const_speed'] *= k_speed_hero;

		    //создание функции для отмены регенерации (при получении урона герою)
		    skills_obj['cancel_regen'] = () => {

		    	hero_options['regen_hps'] -= hps;

				hero_options['hero_speed']  /= k_speed_hero;
			    hero_options['const_speed'] /= k_speed_hero;

			    this.setTimeRestartInstantly('Regen');
		    }

		})
	}




	//РЫВОК
	charge() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Charge',
				animate: false,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			//герой совершает прыжок вместо обычной атаки
		    this.game.hero.skills_obj['current_attack'] = 'Charge-strike';
		})
	}






	//КРАЖА ДУШИ
	soulsteel() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Soulsteel',
				animate: false,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			let skills_obj = this.game.hero.skills_obj;

		    skills_obj['soulsteel_active'] = true;

		    //установка времени активации
		    let end_time_action = new Promise((resolve) => {
		    	this.setTimeAction('Soulsteel', resolve);
		    });

		    //действия после конца времени действия способности
		    end_time_action.then(() => {

		    	skills_obj['soulsteel_active'] = false;
		        this.setTimeRestart('Soulsteel');
		    })
		})
	}





	//ОСТАНОВКА ВРЕМЕНИ
	stoptime() {

		//анимирование способности и иконки
		let end_animation = new Promise((resolve) => {
			this.animateHeroSkill({
				type: 'Stoptime',
				animate: false,
				resolve
			});
		});

		//характеристики способности
		end_animation.then(() => {

			//три секунды задержки перед активацией способности
			setTimeout(() => {

				let hero_options = this.game.hero.hero_options;

				//пауза в игре и остановка музыки
		        hero_options['pause'] = true;
		        hero_options['current_music'].pause();

		        //установка времени активации
			    let end_time_action = new Promise((resolve) => {
			    	this.setTimeAction('Stoptime', resolve);
			    });

			    //действия после конца времени действия способности
			    end_time_action.then(() => {
			    	
			    	hero_options['current_music'].slowPlay();
		            hero_options['pause'] = false;
		            this.setTimeRestart('Stoptime');
			    });
	    	}, 3000)
		})

	}





	//УЛУЧШЕНИЯ СПОСОБНОСТИ ЯРОСТЬ
	upgradeRage() {
		
      	this.increaseLevelSkill('Rage');

        //изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Rage']['num-level']) {

            case 2:
                this.characts_skills['Rage']['k_force'] *= 1.5;
            	this.characts_skills['Rage']['k_speed_strike'] *= 1.23;

            	//увеличение скорости и силы основной атаки
            	this.game.hero.skills_obj['forse_sword'] *= 1.5;
			    this.game.hero.skills_obj['speed_strike'] *= 1.23;
            break;
        };
	}



	//УЛУЧШЕНИЕ СПОСОБНОСТИ ОГНЕННЫЙ ШАР
	upgradeFireball() {

		this.increaseLevelSkill('Fireball');

        //изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Fireball']['num-level']) {

            case 2:

            	let fireball = this.characts_skills['Fireball'];

            	//увеличение силы и радиуса взрыва
               	fireball['force'] *= 1.5;
                fireball['radius_explosion'] *= 1.1;

                //изменение размеров взрыва
                for(let value of this.game.hero.skills_obj['effects']['Explosion']['frames']) {

                    value.style.width = fireball['radius_explosion']*2 + 'px';
                    value.style.height = fireball['radius_explosion']*2 + 'px';
                    value.style.backgroundSize = fireball['radius_explosion']*2 + 'px';
                }
            break;
        };
	}





	//УЛУЧШЕНИЕ СПОСОБНОСТИ ЛЕДЯНОЕ КОПЬЕ
	upgradeIcelance() {

		this.increaseLevelSkill('Icelance');

        //изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Icelance']['num-level']) {

            case 2:
            	//увеличение силы и коэффициента уменьшения размера ледяного копья
               	this.characts_skills['Icelance']['force'] *= 1.5;
                this.characts_skills['Icelance']['decrease_size'] *= 0.5;
            break;

            case 3:
            	//увеличение количества запускаемых ледяных стрел
            	this.characts_skills['Icelance']['count'] += 1;
            break;
        };
	}



	//УЛУЧШЕНИЕ СПОСОБНОСТИ ОГНЕННЫЙ СЛЕД
	upgradeFierytrail() {

		this.increaseLevelSkill('Fierytrail');

        //изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Fierytrail']['num-level']) {

            case 2:
            	//увеличение силы и скорости героя
               	this.characts_skills['Fierytrail']['force_ps'] *= 1.5;
                this.characts_skills['Fierytrail']['k_speed_hero'] *= 1.1;
            break;
        };
	}




	//УЛУЧШЕНИЕ СПОСОБНОСТИ РЕГЕНЕРАЦИЯ
	upgradeRegen() {

		this.increaseLevelSkill('Regen');

		//изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Regen']['num-level']) {

            case 2:
            	//увеличение hps героя и уменьшения скорости героя
               	this.characts_skills['Regen']['hps'] *= 1.5;
                this.characts_skills['Regen']['k_speed_hero'] = 0.9;
            break;
        };
	}





	//УЛУЧШЕНИЕ СПОСОБНОСТИ РЫВОК
	upgradeCharge() {

		this.increaseLevelSkill('Charge');

		//изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Charge']['num-level']) {

            case 2:
            	//увеличение времени оглушения и уменьшение времени перезарядки
               	this.characts_skills['Charge']['k_pushtime'] *= 1.5;
                this.characts_skills['Charge']['time_restart'] /= 2;
            break;
        };
	}




	//УЛУШЕНИЕ СПОСОБНОСТИ КРАЖА ЖИЗНИ
	upgradeSoulsteel() {

		this.increaseLevelSkill('Soulsteel');

		//изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Soulsteel']['num-level']) {

            case 2:
            	//увеличение скорости кражи жизни и дальность ее действия
               	this.characts_skills['Soulsteel']['hps'] *= 1.5;
                this.characts_skills['Soulsteel']['distance'] *= 1.3;
            break;
        };
	}




	//УЛУЧШЕНИЕ СПОСОБНОСТИ ОСТАНОВКА ВРЕМЕНИ
	upgradeStoptime() {

		this.increaseLevelSkill('Stoptime');

		//изменение способности в зависимости от уровня
        switch(this.game.hero['skills_obj']['icons']['Stoptime']['num-level']) {

            case 2:
            	//увеличение времени действия
               	this.characts_skills['Stoptime']['time_action'] *= 1.5;
            break;
        };
	}




	//АНИМИРОВАНИЕ СПОСОБНОСТЕЙ ГЕРОЯ И ИКОНОК
    animateHeroSkill({type, animate, resolve}) {

    	let hero_options = this.game.hero.hero_options;
		let skills_obj = this.game.hero.skills_obj;
		let DOM_elements_hero = this.game.hero.DOM_elements_hero;
		let cost = this.characts_skills[type]['cost'];

		if((skills_obj['ready_obj'][type] || skills_obj['ready_obj'][type] == undefined) && 
			!DOM_elements_hero['hero'].hidden) 
		{

			if(this.game.hero.mp['current'] >= cost) {

		        let icon = skills_obj['icons'][type];

		        this.game.audio_obj['effects']['Skills'][type].play();
		        skills_obj['ready_obj'][type] = false;
		        icon['icon'].style.filter = 'brightness(130%)';

		        //данная способность активирована
		        skills_obj['active_skills'][type] = true;

		        this.game.hero.changeCurrentCharact('mp', -cost);

		        //способность с анимацией
		        if(animate) {

		        	hero_options['hero_walk_sound'][0].muted = true;
		            hero_options['hero_walk_sound'][1].muted = true;

		          	DOM_elements_hero['hero'].hidden = true;
		            this.game.hero.increaseEnergePoints('stop');
		            this.game.hero.decreaseEnergePoints('stop');

		            let count = 0;
		            let obj = skills_obj['skills'][type]['frames'];
		            obj[0].style.display = 'block';

		            (function animateSkill () {

		                setTimeout(() => {

		                    count++;
		                    if(count == obj.length) {
		                        obj[obj.length-1].style.display = 'none';
		                        DOM_elements_hero['hero'].hidden = false;
		                        this.game.hero.increaseEnergePoints();

		                        hero_options['hero_walk_sound'][0].muted = false;
		                        hero_options['hero_walk_sound'][1].muted = false;

		                        resolve();

		                    } else {
		                        obj[count-1].style.display = 'none';
		                        obj[count].style.display = 'block';
		                        requestAnimationFrame(animateSkill.bind(this))
		                    };
		                    
		                }, obj[count].timeFrame);

		            }).call(this);
		            
		        } else {
		        	resolve();
		        }
		        
		    } else if(!hero_options['mp_blink_timer']){
		        this.game.heroInterface.activateBlinkBar('mp', 'one_blink')
		    };
		}
    }




    //УВЕЛИЧЕНИЕ УРОВНЯ СПОСОБНОСТИ ПРИ ЕЁ ПРОКАЧКЕ
    increaseLevelSkill(skill) {

        let current_skill = this.game.hero['skills_obj']['icons'][skill];

        current_skill['num-level']++;

        current_skill['name-level'].innerHTML = `&#854${current_skill['num-level'] + 3};`

        this.game.hero.changeCurrentCharact('sp', -1);
    }




    //УСТАНОВКА ВРЕМЕНИ ДЕЙСТВИЯ СПОСОБНОСТИ (С АНИМИРОВАНИЕМ ИКОНКИ)
	setTimeAction(type, resolve) {

		let time_action = this.characts_skills[type]['time_action'];
		let icon = this.game.hero.skills_obj['icons'][type];

		icon['change-icon'].style.transition = time_action + 's linear';
		icon['change-icon'].style.width = icon['icon'].style.width;

		setTimeout(() => {
			resolve();
		}, time_action * 1000)
	}



	//УСТАНОВКА ВРЕМЕНИ ОТКАТА СПОСОБНОСТИ (С АНИМИРОВАНИЕМ ИКОНКИ)
	setTimeRestart(type) {

		let time_restart = this.characts_skills[type]['time_restart'];
		let icon = this.game.hero.skills_obj['icons'][type];

		icon['icon'].style.filter = 'brightness(100%)';
	    icon['change-icon'].style.transition = time_restart + 's linear';
	    icon['change-icon'].style.width = '0px';

	    this.game.hero.skills_obj['active_skills'][type] = false;

	    setTimeout(() => {
	    	this.game.hero.skills_obj['ready_obj'][type] = true;
	    }, time_restart * 1000);		
	}



	//УСТАНОВКА ВРЕМЕНИ ОТКАТА ДЛЯ СПОСОБНОСТЕЙ БЕЗ ВРЕМЕНИ ИЗ ДЕЙСТВИЯ (МГНОВЕННО)
	setTimeRestartInstantly(type) {

		let icon = this.game.hero.skills_obj['icons'][type];

		icon['change-icon'].style.transition = 'none';
		icon['change-icon'].style.width = icon['icon'].style.width;

		setTimeout(() => {
			this.setTimeRestart(type);
		}, 100);
	}


	//УСТАНОВКА ЭФФЕКТА ГЕРОЮ ОТ СПОСОБНОСТИ (ЛИБО ЗНАЧЕНИЕ ПО УМОЛЧАНИЮ)
	setEffectHero(effect) {

		let skills_obj = this.game.hero.skills_obj;

		if(effect == 'default') {
			skills_obj['filter'].splice(0, 1);
		} else {
			skills_obj['filter'].push(effect);
		};

		this.game.hero.DOM_elements_hero['main_character'].style.filter = skills_obj['filter'].join(' ');

	}

}