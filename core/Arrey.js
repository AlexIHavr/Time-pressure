class Arrey extends Creatures {

	constructor({hp, force, speed, size, x, y}) {

		//наследование свойств у родителя
		super('inherit');

		this.creatures_objects = this.game.creatures.creatures_objects;

		this.DOM_elements_creatures = this.game.creatures.DOM_elements_creatures;

		//характеристики существа
		this.creature_options = this.createCreatureOptions({
			type: 'Arrey',
			hp, force, speed, size, x, y,
			new_options: {
				'critical_effect': 'saturate(500%)',
				'jumpX': 0,
				'jumpY': 0,
				'returnX': 0,
				'returnY': 0,
				'return_timer': undefined,
	        	'check_return': 0,
	        	'jump_strike': false,
		        'r_jump': 200,
		        'r_sprint': 1000,
		        'r_attack': 70,
		        'r_with_toPoint': 1,
		        'speed_jump': 18,
		        'plus_speed_sprint': 3,
	        	'time_frames': 300,
	        	'creature_sounds': {
		        	'walk': this.game.audio_obj['effects']['Creatures']['Arrey_walk'],
		        	'jump': this.game.audio_obj['effects']['Creatures']['Arrey_jump'].cloneNode(),
		        	'strike': this.game.audio_obj['effects']['Creatures']['Arrey_strike'].cloneNode(),
		        	'death': this.game.audio_obj['effects']['Creatures']['Arrey_death']
	        	}
			} 
		});

		//создание существа на карте
		this.createCreatureInMap(this.creature_options);

		//запуск арии
		this.runArrey();
	}


	//ЗАПУСК АРИИ
	runArrey() {

		//Запуск арии
		(function runArrey() {

			//установка координат существу и расстояние между существом и героем
			this.setCoordinatesCreature(this.creature_options);

			//при активации способности остановка времени существу наносится только урон
			if(this.game.hero.hero_options['pause']) {
				this.strikesWithCreature('Simple-strike', this.creature_options);
			} else {

				//начало движения (при замечании героя существом)
				if(this.creature_options['r_with_hero'] < this.creature_options['radius_active']) {

					//выбор точки, куда стремится существо в зависимости от эффекта
					this.setToCoordinatesCreature(this.creature_options);


					//переход в состояние смерти (Death)
					if(this.creature_options['hp'] <= 0) {

						this.setDeathStateCreature(this.creature_options);

						return 0;

					} else {

						switch(this.creature_options['state']) {

							//переход из состояния покоя (Stand)	
							case 'Stand':

								this.creatures_objects[this.creature_options['type']][this.creature_options['number']] = this;

								//в состояние рывка (Sprint)
								if(this.creature_options['r_with_hero'] > this.creature_options['r_sprint']) {

									this.changeDirectionCreature({
										state: 'Sprint',
										creature_options: this.creature_options
									})

								//в состояние движения (Move)
								} else {
									this.changeDirectionCreature({
										state: 'Move',
										creature_options: this.creature_options
									})
								}
							break;

							//состояние рывка (Sprint)
							case 'Sprintdown':
							case 'Sprintup':
							case 'Sprintleft':
							case 'Sprintright':

								if(this.creature_options['r_with_hero'] > this.creature_options['r_jump']) {

									this.changeDirectionCreature({
										state: 'Sprint',
										creature_options: this.creature_options
									})

								//переход из состояния рывка (Sprint) в состояние прыжка (Jump)
								} else {

									this.creature_options['force'] *= 1.5;
									this.creature_options['creature_sounds']['jump'].play();

									this.changeDirectionCreature({
										state: 'Jump',
										creature_options: this.creature_options
									});
								}
							break;

							//состояние движения (Move)
							case 'Movedown':
							case 'Moveup':
							case 'Moveright':
							case 'Moveleft':

								this.changeDirectionCreature({
									state: 'Move',
									creature_options: this.creature_options
								});

								if(this.creature_options['current_effect'] != 'return_sprint') {

									//переход из состояния движения (Move) в состояние рывка (Sprint)
									if(this.creature_options['r_with_hero'] > this.creature_options['r_sprint']) {

										this.changeDirectionCreature({
											state: 'Sprint',
											creature_options: this.creature_options
										});

									//переход из состояния движения (Move) в состояние укуса (Strike)
									} else if(this.creature_options['r_with_hero'] < this.creature_options['r_attack']) {

										this.setStrikeStateCreature(this.creature_options);
									};

								//в состоянии возврата ария переходит в состояния рывка в точке рывка или при столкновении с SO
								} else if(this.creature_options['r_with_toPoint'] < 5 || 
											this.game.staticObjects.setStaticPhysicCircle(this.creature_options)) 
								{
									this.creature_options['current_effect'] = 'none';

									this.changeDirectionCreature({
										state: 'Sprint',
										creature_options: this.creature_options
									});
								}

							break;

							//состояние укуса (Strike)
							case 'StrikeR':
							case 'StrikeL':

								if(this.creature_options['r_with_hero'] > this.creature_options['r_attack']) {

									//переход из состояния укуса (Strike) в состояние движения (Move)
									this.changeStatesCreatures({
										fromState: 'Strike',
										toState: 'Move',
										creature_options: this.creature_options
									})

								} else {
									this.setStrikeStateCreature(this.creature_options);
								}

							break;

							//состояние отталкивания (Push)
							case 'PushR':
							case 'PushL':

								//прерывание таймера или состояния возврата в состоянии отталкивания
								if(this.creature_options['return_timer']) {

									clearInterval(this.creature_options['return_timer']);
									this.creature_options['return_timer'] = undefined;

								} else if(this.creature_options['current_effect'] == 'return_sprint') {
									this.creature_options['current_effect'] = 'none';
								};

								if(this.creature_options['current_effect'] != 'push') {

									//переход из состояния отталкивания (Push) в состояние движения (Move)
									this.changeStatesCreatures({
										fromState: 'Push',
										toState: 'Move',
										creature_options: this.creature_options
									});

									//активация умения возвращение арии на спринт
									this.activateReturnSkill(this.creature_options)
								}
							break;

							//состояние прыжка (Jump)
							case 'Jumpup':
							case 'Jumpdown':
							case 'Jumpright':
							case 'Jumpleft':

								//получение урона герою во время прыжка
								if(!this.creature_options['jump_strike']) {
									this.creature_options['moment_strike'] = true;
								};

								//замедление скорости
								this.creature_options['speed'] -= this.game.Math.pow(this.creature_options['speed_jump'], 2) / 4 / 
																this.creature_options['r_jump'] + 0.05;

								//конец прыжка
								if(this.creature_options['speed' ] <= 0) {

									//переход из состояния прыжка (Jump) в состояние движения (Move)
									this.changeDirectionCreature({
										state: 'Move',
										creature_options: this.creature_options
									});
									
									this.creature_options['current_effect'] = 'none';
									this.creature_options['jump_strike'] = false;
									this.creature_options['force'] /= 1.4;

									//активация умения возвращение арии на спринт
									this.activateReturnSkill(this.creature_options)

								};
								
							break;
						}
					};


					

					//установка взаимодействия со всеми ударами и способностями героя
					this.setConnectWithHeroSkillsAndStrikes(this.creature_options);

					//установка физического круга взаимодействия с существами
					if(this.creature_options['speed'] && this.creature_options['current_effect'] != 'jump') {
						this.game.staticObjects.setMovingPhysicCircle(this.creature_options);
					};

					//установка положения существу
					this.setPositionCreature(this.creature_options);
					

					if(this.creature_options['current_effect'] != 'jump') {

						///установка физического круга взаимодействия с героем					 
						this.game.staticObjects.setMovingPhysicCircleHero(this.creature_options);


						if(this.creature_options['speed'] || this.game.hero.hero_options['timer_hero']) {

							//установка физического круга взаимодействия с неподвижными объектами
							this.game.staticObjects.setStaticPhysicCircle(this.creature_options);
						}

					} else if(this.game.staticObjects.setStaticPhysicCircle(this.creature_options)) {

						this.changeDirectionCreature({
							state: 'Move',
							creature_options: this.creature_options
						});
									
						this.creature_options['current_effect'] = 'none';
						this.creature_options['jump_strike'] = false;
						this.creature_options['force'] /= 1.4;

						//активация умения возвращение арии на спринт
						this.activateReturnSkill(this.creature_options)
					}
					

								    	
				} else if(this.creature_options['state'] != 'Stand') {

					//переход в состояние покоя
					this.setStandStateCreature(this.creature_options);
				};
			};

			requestAnimationFrame(runArrey.bind(this))

		}).call(this)
	}







	//АКТИВАЦИЯ СПОСОБНОСТИ АРИИ ВОЗРАЩАТЬСЯ НА СОСТОЯНИЕ СПРИНТ
	activateReturnSkill(creature_options) {

		this.creature_options['return_timer'] = setInterval(() => {

			//пауза в игре
			if(!this.game.hero.hero_options['pause']) {


				let angle = Math.getAngle(
					this.creature_options['x'] - this.creature_options['left'], 
					this.creature_options['y'] - this.creature_options['top']
				);

				//задание координат точки рывка
				this.creature_options['returnX'] = Math.rFromCenterX(
						this.creature_options['left'], 
						this.creature_options['r_sprint'], 
						this.game.Math.degreeInRan(angle)
					);
				this.creature_options['returnY'] = Math.rFromCenterY(
						this.creature_options['top'], 
						this.creature_options['r_sprint'], 
						this.game.Math.degreeInRan(angle)
					);

				//возвращение арии в состояние движения
				this.changeDirectionCreature({
					state: 'Move',
					creature_options: this.creature_options
				});


				this.creature_options['current_effect'] = 'return_sprint';

				clearInterval(this.creature_options['return_timer']);
				this.creature_options['return_timer'] = undefined;
				

			};

		}, this.game.Math.randomNumber(10000, 15000));
	}
}