class Creatures {
	
	constructor (inherit) {

		//ССЫЛКА НА ВСЕ КЛАССЫ
		this.game = game;

		//НЕ НАСЛЕДОВАТЬ ДАННЫЕ СВОЙСТВА
		if(!inherit) {

			//ССЫЛКА НА ЭЛЕМЕНТЫ СУЩЕСТВ
			this.DOM_elements_creatures = Prototypes.getObjectElements('Creatures');

			//ХАРАКТЕРИСТИКИ СУЩЕСТВ
			this.creatures_objects = {
				'Mop': {},
		    	'Arrey': {}
			}

			//УСТАНОВКА КАРТИНОК СУЩЕСТВАМ
			Prototypes.setCreaturesImg('Creatures');
		}
	}



	//СОЗДАНИЕ СУЩЕСТ В СЛУЧАЙНОМ ПОРЯДКЕ НА КАРТЕ
	createCreaturesInRandom({type, area_options, count}) {

		//показать область случайной расстановки неподвижных объектов
		if(area_options['show_area']) {

			let clone = document.getElementById('PhysicRectangle').cloneNode();
			clone.style.cssText = `
				width: ${area_options['w']}px; 
				height: ${area_options['h']}px; 
				left: ${area_options['x']}px;  
				top: ${area_options['y']}px;
			`;
			document.body.appendChild(clone);
		};

		//координаты для случайного размещения неподвижных объектов
		let x_min = area_options['x'];
		let y_min = area_options['y'];

		let a = area_options['w'] / count;
		let b = area_options['h'];

		//исскуственная задержка для загрузки картинок существ
		setTimeout(() => {

			for(let i = 0; i < count; i++) {

				let x = this.game.Math.randomNumber(x_min, x_min + a);
				let y = this.game.Math.randomNumber(y_min, y_min + b);

				let size, hp, force, speed, creature;

				//создание существа
				switch(type) {

					//существо - моп
					case 'Mop':

						size = Math.randomNumber(110, 140);

						hp = 1.5 * size;
						force = 1 * size;
						speed = 4;

						creature = new Mop({hp, force, speed, size, x, y});	
					break;

					//существо - босс-моп
					case 'Mop-boss': 

						size = 200;

						hp = 1.5 * 5 * size;
						force = 3 * size;
						speed = 4;

						creature = new Mop({hp, force, speed, size, x, y});
					break;

					//существо - ария
					case 'Arrey':

						size = Math.randomNumber(120, 150);

						hp = 2 * size;
						force = size;
						speed = 5;

						creature = new Arrey({hp, force, speed, size, x, y});
					break;

					//существо - ария-босс
					case 'Arrey-boss':

						size = 200;

						hp = 5 * size;
						force = 3 * size;
						speed = 5;

						creature = new Arrey({hp, force, speed, size, x, y});
					break;
				};


				//изменение характеристик для существа-босса
				if(type.split('-')[1] == 'boss') {
					this.changeOptionsForBossCreature(creature.creature_options);
				};

				x_min += a;	
			}
		}, 100)
	}





	//ИЗМЕНЕНИЕ ХАРАКТЕРИСТИК ДЛЯ СУЩЕСТВА-БОССА
	changeOptionsForBossCreature(creature_options) {

		//изменение характеристик для босса
		creature_options['speed'] *= 1.3;
    	creature_options['const_speed'] *= 1.3;
    	creature_options['r_attack'] *= 1.3;
    	creature_options['push_time'] /= 3;

    	//изменение размера крови
    	for(let value of creature_options['creature'].querySelectorAll('.mop_blood')) {
    		value.style.top = '90px';
			value.style.backgroundSize = '300px';
    	}
	}








	//СОЗДАНИЕ ХАРАКТЕРИСТИК СУЩЕСТВ
	createCreatureOptions({type, hp, force, speed, size, x, y, new_options}) {

		let creature = this.DOM_elements_creatures[type].cloneNode(true)

		//создание однотипных характеристик существ
		let creature_options = {

			//тип существа
			'type': type,

			//основные характеристики
			'hp': hp,
			'force': force,
			'speed': 0,
	        'const_speed': speed,

	        //координаты 
	        'x': x,
	        'y': y,
	        'x_center': size * (72/140),
	        'y_center': size * (155/140),
	        'radius': size * (27/140),
	        'radius_active': 4000,
	        'r_with_hero': 0,

	        //дополнительные характеристики
	        'number': this.getNextNumberCreature(type),
	        'creature': creature,
	        'size': size,
			'current_effect': 'none',
			'pushX': 0,
			'pushY': 0,
			'push': true,
			'push_timer': undefined,
			'push_r': 50,
	        'push_time': 300,
			'radius_fireball': size * (27/140) + 15,
			'x_fireball': 0,
			'y_fireball': -10,
			'soullink_obj': {},
	        'left': 0,
	        'top': 0,
	        'state': 'Stand',
	        'moment_strike': false,
	        'damage_fire_timer': undefined,
	        'creature_timer': undefined,
	        'animation': undefined,
	        'obj_creature': Prototypes.getActionObj(creature, new_options['time_frames']),
	        'strikes_frames': this.game.heroStrikes.getStrikesFrames() 
		};

		//создание уникальных характеристик существа
		for(let option in new_options) {
			creature_options[option] = new_options[option]
		};

		return creature_options;
	}







	//СОЗДАНИЕ СУЩЕСТВА НА КАРТЕ
	createCreatureInMap(creature_options) {

		//Добавление существа на карту
		this.DOM_elements_creatures[`Class${creature_options['type']}`].appendChild(creature_options['creature']);

		//Установка существа на заданные координаты
		creature_options['creature'].style.left = creature_options['x'] + 'px';
		creature_options['creature'].style.top = creature_options['y'] + 'px';

		//изменение размера существа
		for(let value of creature_options['creature'].querySelectorAll('.monster')) {
			value.style.backgroundSize = creature_options['size'] + 'px';
		};

		//показывать состояние покоя существа
		creature_options['obj_creature']['Stand']['frames'][0].style.display = 'block';

		//установка громкости звуков существ
		for(let sound of creature_options['creature_sounds']) {
			sound.volume = this.game.save_obj['settings_obj']['effects-volume'] / 100;
		};
	}






	//УСТАНОВКА ВЗАИМОДЕЙСТВИЯ СО ВСЕМИ УДАРАМИ И СПОСОБНОСТЯМИ ГЕРОЯ
	setConnectWithHeroSkillsAndStrikes(creature_options) {

		//урон герою
		this.damageHeroFromCreature(creature_options);

		//простой удар героя
		this.strikesWithCreature('Simple-strike', creature_options);

		//удар огненным шаром
		this.fireballWithCreatures(creature_options);

		//удар огненным следом
		this.fierytrailWithCreature(creature_options);

		//урон от ледяного копья
		this.icelanceWithCreature(creature_options);

		//урон от рывка
		this.chargeWithCreature(creature_options);

		//урон от кражи жизни
		this.soulsteelWithCreature(creature_options);
	}








	//ВЗАИМОДЕЙСТВИЕ СУЩЕСТВА С ГЕРОЕМ ПРИ ЕГО УДАРАХ
	strikesWithCreature(strike, creature_options) {

		if(creature_options['strikes_frames'][strike].style.display == 'block') {

			if(creature_options['push']) {
			
				if(creature_options['r_with_hero'] <= 120) {

					//определяем угол удара и новый вектор для существа
					let getAngle = this.game.Math.getAngle(
						creature_options['x'] - this.game.hero.hero_position['x'], 
						creature_options['y'] - this.game.hero.hero_position['y']
					);
					let angle = this.game.Math.abs(getAngle - this.game.hero.skills_obj['angle_strike']);
					let max_angle_strike = this.game.heroStrikes.characts_strikes[strike]['max_angle_strike'];

					//угол попадания по существу
					if(angle < max_angle_strike || angle > (360 - max_angle_strike)) {

						//нанесение критического урона существу
						if(this.game.Math.chance(this.game.hero.skills_obj['critical_chance'])) {

							creature_options['creature'].style.filter = creature_options['critical_effect'];
							creature_options['hp'] -= this.game.hero.skills_obj['forse_sword'] * 2;
							creature_options['push_r'] *= 3;

							//задание существу состояние отталкивания
							this.setPushStateCreature(creature_options);

							creature_options['push_r'] /= 3;

						//нанесение урона существу
						} else {

							creature_options['hp'] -= this.game.hero.skills_obj['forse_sword'];

							//задание существу состояние отталкивания
							this.setPushStateCreature(creature_options);
						};


						if(this.game.hero.skills_obj['active_skills']['Soulsteel']) {

							//создание нити души
							if(!this.game.Object.keys(creature_options['soullink_obj']).length) {
								this.createSoullink(creature_options);
							}
						};			
					}
				}
				creature_options['push'] = false
			}
		} else if(!creature_options['push']) {
			creature_options['push'] = true
		};
	}







	//УСТАНОВКА КООРДИНАТ СУЩЕСТВУ И РАССТОЯНИЕ МЕЖДУ НИМ И ГЕРОЕМ
	setCoordinatesCreature(creature_options) {

		//установка координат существу
		creature_options['x'] = parseFloat(creature_options['creature'].style.left) + creature_options['x_center'];
		creature_options['y'] = parseFloat(creature_options['creature'].style.top) + creature_options['y_center'];

		//расстояние между существом и героем
		creature_options['r_with_hero'] = this.game.Math.distance(
			this.game.hero.hero_position['x'] - creature_options['x'], 
			this.game.hero.hero_position['y'] - creature_options['y']
		);
	}






	//УСТАНОВКА ПОЛОЖЕНИЯ СУЩЕСТВУ 
	setPositionCreature(creature_options) {

		//расстояние от существа до точки его стремления
		let r;

		//расстояние отбирается для плавности отталкивания и оптимизации мопа
		if(!creature_options['r_with_toPoint'] || creature_options['current_effect'] == 'push') {
			r = creature_options['r_with_hero'];
		} else {
			r = creature_options['r_with_toPoint'];		
		};


		creature_options['creature'].style.left = parseFloat(creature_options['creature'].style.left) + 
												creature_options['speed'] * (creature_options['left'] - 
												creature_options['x']) / r + 'px';

		creature_options['creature'].style.top =  parseFloat(creature_options['creature'].style.top) + 
												creature_options['speed'] * (creature_options['top'] - 
												creature_options['y']) / r + 'px';							
	}










	//НАНЕСЕНИЕ СУЩЕСТВОМ ФИЗИЧЕСКОГО УРОНА ГЕРОЮ
	damageHeroFromCreature(creature_options) {

		if(creature_options['moment_strike']) {

			if(creature_options['r_with_hero'] <= creature_options['r_attack']) {

				//нанесение урона герою
				this.game.hero.changeCurrentCharact('hp', -creature_options['force']);

				//отмена способности регенерация героя
				if(this.game.hero['skills_obj']['active_skills']['Regen']) {
					this.game.hero['skills_obj']['cancel_regen']();
				};

				//в состоянии прыжка (Jump) ария наносит один урон
				if(creature_options['current_effect'] == 'jump') {
					creature_options['jump_strike'] = true;
				}
			};

			creature_options['moment_strike'] = false;
		};
	}








	//ЗАДАНИЕ СУЩЕСТВУ СОСТОЯНИЕ ПОКОЯ
	setStandStateCreature(creature_options) {

		this.changeStateCreature({
			state: 'Stand',
			creature_options
		});

		clearInterval(creature_options['creature_timer']);
		cancelAnimationFrame(creature_options['animation']);
		delete this.creatures_objects[creature_options['type']][creature_options['number']];
	}







	//ЗАДАНИЕ СУЩЕСТВУ СОСТОЯНИЕ УКУСА
	setStrikeStateCreature(creature_options) {

		creature_options['speed'] = 0;

		//правая голова
		if(creature_options['x'] - creature_options['left'] < 0) {

			if(creature_options['state'] != 'StrikeR') {

				this.changeStateCreature({
					state: 'StrikeR',
					strike_frame: 1,
					creature_options
				});
			}

		//левая голова
		} else if(creature_options['state'] != 'StrikeL') {

			this.changeStateCreature({
				state: 'StrikeL',
				strike_frame: 1,
				creature_options
			});
		};
	}






	//ЗАДАНИЕ СУЩЕСТВУ СОСТОЯНИЕ СМЕРТИ
	setDeathStateCreature(creature_options) {

		(function deathTimer() {

			if(creature_options['state'] != 'Death') {

				this.changeStateCreature({
					state: 'Death',
					creature_options
				});

				//отключение способностей сущест
				if(creature_options['return_timer']) {
					clearInterval(creature_options['return_timer']);
					creature_options['return_timer'] = undefined;
				};

				creature_options['speed'] = 0;
				creature_options['hp'] = 0;
				creature_options['creature'].style.filter = 'none';

				//отключение всех звуков существа и включение звука смерти
				for(let sound of creature_options['creature_sounds']) {
					sound.stop();
				};
				creature_options['creature_sounds']['death'].play();

				//удаление нитей души
				if(this.game.Object.keys(creature_options['soullink_obj']).length) {
					creature_options['soullink_obj']['delete']()
				};
				
				//получение опыта герою
				this.game.hero.changeCurrentCharact('ex', creature_options['force'] * 2);

			} else if(Prototypes.checkDisplayLastFrame(
					creature_options['obj_creature']['Death']['frames'])) 
				{

				let creature = creature_options['creature'];

				clearInterval(creature_options['creature_timer']);
				cancelAnimationFrame(creature_options['animation']);

				delete this.creatures_objects[creature_options['type']][creature_options['number']];

				creature.style.zIndex = 0;

				//добавляем рандомно кровь
				let blood = this.game.Math.randomElem(creature_options['obj_creature']['Blood']['frames']);
				blood.style.display = 'block';

				let frames_death = creature_options['obj_creature']['Death']['frames'];
				let death_timer = setInterval(() => {

						//пауза в игре
						if(!this.game.hero.hero_options['pause']) {

							let blood_timer = setInterval(() => {

								//пауза в игре
								if(!this.game.hero.hero_options['pause']) {

									//скрытие крови и удаления мопа
						    		blood.style.display = 'none';
						    		creature.parentElement.removeChild(creature);
									clearInterval(blood_timer)
								};

							}, 20000);

							//скрытие мертвого существа
							frames_death[frames_death.length-1].style.display = 'none';
							clearInterval(death_timer)
						};
				}, 10000);

				return 0;
			};

			requestAnimationFrame(deathTimer.bind(this));

		}).call(this);
	}







	//ЗАДАНИЕ СУЩЕСТВУ СОСТОЯНИЯ ОТТАЛКИВАНИЯ
	setPushStateCreature(creature_options, x_hero, y_hero) {

		//не задавать состояние отталкивания при способности остановка времени
		if(!this.game.hero.hero_options['pause']) {

			//явное указание позиции героя (способность рывок)
			if(!x_hero) {
				x_hero = this.game.hero.hero_position['x'];
			};
			if(!y_hero) {
				y_hero = this.game.hero.hero_position['y'];
			};


			let degree = this.game.Math.degreeInRan(this.game.Math.getAngle(
				creature_options['x'] - x_hero, 
				creature_options['y'] - y_hero
			))

			creature_options['current_effect'] = 'push';

			creature_options['left'] = this.game.Math.rFromCenterX(creature_options['x'], creature_options['push_r'], degree);
			creature_options['top'] = this.game.Math.rFromCenterY(creature_options['y'], creature_options['push_r'], degree);

			creature_options['pushX'] = creature_options['left']; 
			creature_options['pushY'] = creature_options['top']

			creature_options['speed'] = creature_options['const_speed'];

			//правый push
			if(creature_options['x'] - this.game.hero.hero_position['x'] > 0) {
				this.changeStateCreature({
					state: 'PushR',
					creature_options
				});

			//левый push
			} else {
				this.changeStateCreature({
					state: 'PushL',
					creature_options
				});
			};

			creature_options['creature_sounds']['strike'].stop();

			clearInterval(creature_options['push_timer']);
			creature_options['push_timer'] = setInterval(() => {

				//пауза в игре
				if(!this.game.hero.hero_options['pause']) {

			    	clearInterval(creature_options['push_timer']);
					creature_options['current_effect'] = 'none';
					creature_options['creature'].style.filter = 'none';
				};

			}, creature_options['push_time']);
		}
	}





	//ИЗМЕНЕНИЕ НАПРАВЛЕНИЯ ДВИЖЕНИЯ СУЩЕСТВА (ОТ УГЛА ПОВОРОТА)
	changeDirectionCreature({state, creature_options}) {



		//задание скорости
		switch(state) {

			case 'Walk':
			case 'Move':
				creature_options['speed'] = creature_options['const_speed'];
			break;

			case 'Sprint':
				creature_options['speed'] = creature_options['const_speed'] + creature_options['plus_speed_sprint'];
			break;

			case 'Jump':
				creature_options['speed'] = creature_options['speed_jump'];	
			break;
		};




		//состояние Walk не учитывает угол поворота
		if(state == 'Walk') {

			this.changeStateCreature({
				state: 'Walk',
				creature_options
			});

		//другие состояния учитывают угол поворота
		} else {

			let angle = Math.getAngle(
				creature_options['left'] - creature_options['x'], 
				creature_options['top'] - creature_options['y']
			);
		
			//направление в зависимости от угла
			if(angle > 45 && angle <= 135) {

				if(creature_options['state'] != `${state}down`) {
					this.changeStateCreature({
						state: `${state}down`,
						creature_options
					})
				}

			} else if(angle > 135 && angle <= 225) {

				if(creature_options['state'] != `${state}left`) {
					this.changeStateCreature({
						state: `${state}left`,
						creature_options
					})
				}

			} else if(angle > 225 && angle <= 315) {

				if(creature_options['state'] != `${state}up`) {
					this.changeStateCreature({
						state: `${state}up`,
						creature_options
					})
				}

			} else if (creature_options['state'] != `${state}right`) {

				this.changeStateCreature({
						state: `${state}right`,
						creature_options
					})
			};

			//состояние прыжка арии
			if(state == 'Jump') {

				//смещение точки героя на r_jump
				creature_options['jumpX'] = Math.rFromCenterX(
						creature_options['left'], 
						creature_options['r_jump'], 
						this.game.Math.degreeInRan(angle)
					);
				creature_options['jumpY'] = Math.rFromCenterY(
						creature_options['top'], 
						creature_options['r_jump'], 
						this.game.Math.degreeInRan(angle)
					);

				creature_options['current_effect'] = 'jump';
			}
		}
	}






	//ИЗМЕНЕНИЕ СОСТОЯНИЯ СУЩЕСТВА
	changeStateCreature({state, strike_frame, creature_options}) {

		let count = 0;
		let direction = creature_options['obj_creature'][state];
		let frames = direction['frames'];

		for(let value of creature_options['obj_creature'][creature_options['state']]['frames']) {

			if(value.style.display == 'block') {
				value.style.display = 'none';
				break;
			}
		};
		frames[0].style.display = 'block';
		creature_options['state'] = direction['action_elem'].id;

		//звуки существ при ходьбе
		if(direction['action_elem'].classList.contains('walk')) {
			creature_options['creature_sounds']['walk'].stop();
		    creature_options['creature_sounds']['walk'].play();
		};

		clearInterval(creature_options['creature_timer']);
		cancelAnimationFrame(creature_options['animation']);

		//анимирование состояния существа
		(function animateState () {
    		
	    	creature_options['creature_timer'] = setTimeout(() => {

	    		if(!this.game.hero.hero_options['pause']) {

	    			count++;

				    if(count == frames.length) {
				        frames[frames.length - 1].style.display = 'none';
				        count = 0;
				    } else {
				        frames[count-1].style.display = 'none';
				    };
				    frames[count].style.display = 'block';

				    if(direction['action_elem'].classList.contains('walk')) {
					    creature_options['creature_sounds']['walk'].play();
					};

				    //момент укуса на определенном кадре
				    if(count == strike_frame) {
				        creature_options['moment_strike'] = true;
				        creature_options['creature_sounds']['strike'].stop();
		    			creature_options['creature_sounds']['strike'].play();
				    };
	    		};

			    creature_options['animation'] = requestAnimationFrame(animateState.bind(this));

	    	}, frames[count].timeFrame);


		}).call(this);
	}






	//ПЕРЕХОД ИЗ ОДНОГО СОСТОЯНИЕ СУЩЕСТВА В ДРУГОЕ
	changeStatesCreatures({fromState, toState, creature_options}) {

		//выбор состояние из которого переходит существо
		switch(fromState) {

			case 'Strike':

				//выбор состояния в которое переходит существо
				switch(toState) {

					case 'Move':
					case 'Walk': 

						//снова запускаем движение после полного укуса
						if(this.game.Prototypes.checkDisplayLastFrame(
							creature_options['obj_creature']['StrikeR']['frames'])||
						   this.game.Prototypes.checkDisplayLastFrame(
							creature_options['obj_creature']['StrikeL']['frames'])) 
						{

							setTimeout(() => {

								creature_options['creature_sounds']['strike'].stop();

								this.changeDirectionCreature({
									state: toState,
									creature_options
								});
								
							}, creature_options['time_frames'])
						}
					break;
				}

			break;

			case 'Push':

				//выбор состояния в которое переходит существо
				switch(toState) {

					case 'Move':
					case 'Walk': 

						this.changeDirectionCreature({
							state: toState,
							creature_options
						});

						//остановка урона от огня (эффекта яда) - от огненого следа
						if(creature_options['damage_fire_timer']) {
							cancelAnimationFrame(creature_options['damage_fire_timer']);
							creature_options['damage_fire_timer'] = undefined;
						};
					break;
				}
			break;
		}

	}






	//УСТАНОВКА КООРДИНАТ ТОЧКИ СТРЕМЛЕНИЯ СУЩЕСТВА В ЗАВИСИМОСТИ ОТ ЭФФЕКТА
	setToCoordinatesCreature(creature_options) {

		switch(creature_options['current_effect']) {

			case 'jump':
				creature_options['left'] = creature_options['jumpX'];
				creature_options['top'] = creature_options['jumpY'];
			break;

			case 'return_sprint':
				creature_options['left'] = creature_options['returnX'];
				creature_options['top'] = creature_options['returnY'];
			break;

			case 'push':
				creature_options['left'] = creature_options['pushX'];
				creature_options['top'] = creature_options['pushY'];
			break;

			case 'none':
				creature_options['left'] = this.game.hero.hero_position['x'];
				creature_options['top'] = this.game.hero.hero_position['y'];
			break;
		};

		//растояние между существом и точкой его стремления (только для сложных существ)
		if(creature_options['r_with_toPoint']) {

			creature_options['r_with_toPoint'] = this.game.Math.distance(
				creature_options['left'] - creature_options['x'], 
				creature_options['top'] - creature_options['y']
			);
		}
	}





	//ПОЛУЧЕНИЕ СЛЕДУЮЩЕГО НОМЕРА СУЩЕСТВА ПО ПОРЯДКУ
	getNextNumberCreature(creature) {

		let arrKeysCreature = this.game.Object.keys(this.creatures_objects[creature]);

		if(arrKeysCreature.length) {
			return arrKeysCreature[arrKeysCreature.length - 1] * 1 + 1;
		} else {
			return 0;
		}
	}






	//ВЗАИМОДЕЙСТВИЕ СУЩЕСТВА СО СПОСОБНОСТЬЮ ОГНЕННЫЙ ШАР
	fireballWithCreatures(creature_options) {

		//проверка на наличие огненных шаров на карте
		if(this.game.Object.keys(this.game.hero.skills_obj['fireball_obj']).length) {

			for(let key in this.game.hero.skills_obj['fireball_obj']) {

				let fireball = this.game.hero.skills_obj['fireball_obj'][key];

				//проверка на столкновения огненного шара с существом
				if(this.game.Math.isCircle(
						creature_options['x'] + creature_options['x_fireball'] - fireball['x'], 
						creature_options['y'] + creature_options['y_fireball'] - fireball['y'], 
						creature_options['radius_fireball'], 
						this.game.heroSkills.characts_skills['Fireball']['radius']
					)) 
				{

					//запуск взрыва
					this.game.heroStrikes.runExplosionSkill('Fireball', key);

					//удаление огненного шара
					fireball['delete']();

					//создание эффектов после взрыва на всех существ
					for(let value of this.creatures_objects) {

						for(let obj of value) {

							let deltaX = obj.creature_options['x'] + obj.creature_options['x_fireball'] - fireball['x'];
							let deltaY = obj.creature_options['y'] + obj.creature_options['y_fireball'] - fireball['y'];

							//проверка на столкновения огненного взрыва с существом
							if(this.game.Math.isCircle(
									deltaX, 
									deltaY, 
									obj.creature_options['radius_fireball'], 
									this.game.heroSkills.characts_skills['Fireball']['radius_explosion']
								)) 
							{

								//нанесение урона существу от огненного взрыва
								obj.creature_options['hp'] -= this.game.heroSkills.characts_skills['Fireball']['force'];
								
								//отталкивание существа
								if(obj.creature_options['hp'] > 0) {

									creature_options['push_r'] *= 2;

									this.setPushStateCreature(obj.creature_options);

									creature_options['push_r'] /= 2;
								}
							}
						}
					}
				}
			}
		}
	}




	//ВЗАИМОДЕЙСТВИЕ СУЩЕСТВА СО СПОСОБНОСТЬЮ ОГНЕННЫЙ СЛЕД
	fierytrailWithCreature(creature_options) {

		//проверка на наличие огненных следов на карте
		if(this.game.Object.keys(this.game.hero.skills_obj['fierytrail_obj']).length) {

			for(let obj of this.game.hero.skills_obj['fierytrail_obj']) {

				//проверка на столкновения огненного следа с существом
				if(this.game.Math.isCircle(
						obj['x'] - creature_options['x'], 
						obj['y'] - creature_options['y'], 
						this.game.heroSkills.characts_skills['Fierytrail']['radius'], 
						creature_options['radius']
					)) 
				{

					//урон от огня каждый промежуток времени (эффект яда)
					if(!creature_options['damage_fire_timer']) {
		
						(function effectPoison() {

							creature_options['hp'] -=  this.game.heroSkills.characts_skills['Fierytrail']['force_ps'] / 60;
							creature_options['damage_fire_timer'] = requestAnimationFrame(effectPoison.bind(this));
						}).call(this);

						creature_options['creature'].style.filter = creature_options['critical_effect'];
					};

					creature_options['push_r'] *= 2;

					this.setPushStateCreature(creature_options);

					creature_options['push_r'] /= 2;
				}
			}
		}

	}




	//ВЗАИМОДЕЙСТВИЕ СУЩЕСТВА СО СПОСОБНОСТЬЮ ЛЕДЯНОЕ КОПЬЕ
	icelanceWithCreature(creature_options) {

		//проверка на наличие ледяных стрел на карте
		if(this.game.Object.keys(this.game.hero.skills_obj['icelance_obj']).length) {

			for(let obj of this.game.hero.skills_obj['icelance_obj']) {

				//проверка на столкновения ледяного копья с существом
				if(this.game.Math.isCircle(
						obj['x'] - creature_options['x'], 
						obj['y'] - creature_options['y'], 
						this.game.heroSkills.characts_skills['Icelance']['radius'], 
						creature_options['radius'] + 10
					)) 
				{

					//урон существу
					creature_options['hp'] -= obj['force'];

					//уменьшение размера и наносимого урона ледяного копья
					obj['force'] /= 1.5;
					obj['size'] -= this.game.heroSkills.characts_skills['Icelance']['decrease_size'];
					for(let value of obj['obj']) {
						value.style.backgroundSize = obj['size'] + 'px';
					};
				};
			}
		}
	}



	//ВЗАИМОДЕЙСТВИЕ СУЩЕСТВА СО СПОСОБНОСТЬЮ РЫВОК
	chargeWithCreature(creature_options) {

		//проверка расстояния между героем и существом при активации рывка
		if(this.game.hero.skills_obj['active_strikes']['Charge-strike']) {

			if(creature_options['r_with_hero'] < 100 && creature_options['current_effect'] != 'push') {

				// угол между существом и героем
				let angle_mop = this.game.Math.getAngle(
						this.game.hero.hero_position['x'] - creature_options['x'], 
						this.game.hero.hero_position['y'] - creature_options['y']
					);

				//угол удара героя
				let hero_angle = this.game.Math.degreeInRan(this.game.hero.skills_obj['angle_strike']);

				//угол относительно перпендикуляра у линии удара
				let normal_angle = this.game.Math.cos(
						this.game.Math.degreeInRan(angle_mop - this.game.hero.skills_obj['angle_strike'] + 180)
					) * creature_options['r_with_hero'];

				//смещенные координаты отталкивания на линии удара, перпендикулярно ей
				let normal_x = this.game.Math.rFromCenterX(this.game.hero.hero_position['x'], normal_angle, hero_angle);
				let normal_y = this.game.Math.rFromCenterY(this.game.hero.hero_position['y'], normal_angle, hero_angle);

				let k_pushtime = this.game.heroSkills.characts_skills['Charge']['k_pushtime'];

				//стан врагов
				creature_options['push_time'] *= k_pushtime;
				creature_options['push_r'] *= 2;

				this.setPushStateCreature(creature_options, normal_x, normal_y);

				creature_options['push_time'] /= k_pushtime;
				creature_options['push_r'] /= 2;
			}
		}
	} 





	//ВЗАИМОДЕЙСТВИЕ СУЩЕСТВА СО СПОСОБНОСТЬЮ КРАЖА ДУШИ
	soulsteelWithCreature(creature_options) {

		//проверка наличия нити души
		if(this.game.Object.keys(creature_options['soullink_obj']).length) {
			
			let obj = creature_options['soullink_obj']['obj'];
			let degree = this.game.Math.getAngle(
					this.game.hero.hero_position['x'] - creature_options['x'], 
					this.game.hero.hero_position['y'] - 40 - creature_options['y']
				);
			let r = this.game.Math.distance(
					this.game.hero.hero_position['x'] - creature_options['x'], 
					this.game.hero.hero_position['y'] - 40 - creature_options['y']
				);

			//задание координат, угла и длину нити души
			obj.style.left = creature_options['x'] + 'px';
			obj.style.top = creature_options['y'] - 10 + 'px';
			obj.style.transform = `rotate(${degree}deg)`;
			obj.style.width = r + 'px';

			//урон существу в секунду
			creature_options['hp'] -= this.game.heroSkills.characts_skills['Soulsteel']['hps'] / 60;

			//в случае удаления героя от существа или смерти героя нить обрывается
			if(r > this.game.heroSkills.characts_skills['Soulsteel']['distance'] || this.game.hero.hp['current'] <= 0) {
				creature_options['soullink_obj']['delete']();
			}
			
		}
	}


	//СОЗДАНИЕ НИТИ ДУШИ
	createSoullink(creature_options) {

		let soullink = this.game.hero.skills_obj['effects']['Soullink'];
		let clone = soullink['action_elem'].cloneNode(true);
		let frames = Prototypes.getActionArr(clone, 80);

		this.game.hero.DOM_elements_hero['hero_effects'].appendChild(clone);

		//анимирование нити души
		let stop_animation = Prototypes.runStaticAnimation({
			frames, 
			times: 80
		});

		let hps = this.game.heroSkills.characts_skills['Soulsteel']['hps'];

		//метод для удаление и остановки нити души
		let delete_soullink = () => {

			stop_animation();
			this.game.hero.DOM_elements_hero['hero_effects'].removeChild(clone);
			creature_options['soullink_obj'] = {};

			this.game.hero.hero_options['regen_hps'] -= hps;

			this.game.audio_obj['effects']['Skills']['PopUpLink'].stop();
			this.game.audio_obj['effects']['Skills']['PopUpLink'].play();
		};

		//увеличение регенерации жизни героя
		this.game.hero.hero_options['regen_hps'] += hps;

		//задание объекта с параметрами нити души
		creature_options['soullink_obj'] = {
			'obj': clone, 
			'delete': delete_soullink
		};
	} 

}