class Mop extends Creatures {

	constructor({hp, force, speed, size, x, y}) {

		//наследование свойств у родителя
		super('inherit');

		this.creatures_objects = this.game.creatures.creatures_objects;

		this.DOM_elements_creatures = this.game.creatures.DOM_elements_creatures;

		//характеристики существа
		this.creature_options = this.createCreatureOptions({
			type: 'Mop',
			hp, force, speed, size, x, y,
			new_options: {
				'critical_effect': 'saturate(3000%)',
				'r_attack': 50,
	        	'time_frames': 250,
	        	'creature_sounds': {
		        	'walk': this.game.audio_obj['effects']['Creatures']['Mop_walk'],
		        	'strike': this.game.audio_obj['effects']['Creatures']['Mop_strike'].cloneNode(),
		        	'death': this.game.audio_obj['effects']['Creatures']['Mop_death']
	        	}
			} 
		});

		//создание существа на карте
		this.createCreatureInMap(this.creature_options);

		//запуск мопа
		this.runMop();
	}


	//ЗАПУСК МОПА
	runMop() {

		(function runMop() {


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

							//переход из состояния покоя (Stands) в состояние движения (Walk)
							case 'Stand':

								this.creatures_objects[this.creature_options['type']][this.creature_options['number']] = this;

								this.changeDirectionCreature({
									state: 'Walk', 
									creature_options: this.creature_options
								});
							break;

							//переход из состояния движения (Walk) в состояние укуса (Strike)
							case 'Walk':

								if(this.creature_options['r_with_hero'] < this.creature_options['r_attack']) {

									this.setStrikeStateCreature(this.creature_options);
								}
							break;

							//состояние укуса (Strike)
							case 'StrikeR':
							case 'StrikeL':

								if(this.creature_options['r_with_hero'] > this.creature_options['r_attack']) {

									//переход из состояния укуса (Strike) в состояние движения (Walk)
									this.changeStatesCreatures({
										fromState: 'Strike',
										toState: 'Walk',
										creature_options: this.creature_options
									})

								} else {
									this.setStrikeStateCreature(this.creature_options);
								};
							break;

							//состояние отталкивания (Push)
							case 'PushR':
							case 'PushL':

								//переход из состояния отталкивания (Push) в состояние движения (Walk)
								if(this.creature_options['current_effect'] != 'push') {

									//переход из состояния отталкивания (Push) в состояние движения (Walk)
									this.changeStatesCreatures({
										fromState: 'Push',
										toState: 'Walk',
										creature_options: this.creature_options
									});
								}
							break;

						};

					}

					
					//установка взаимодействия со всеми ударами и способностями героя
					this.setConnectWithHeroSkillsAndStrikes(this.creature_options);

					//установка физического круга взаимодействия с существами
					if(this.creature_options['speed']) {
						this.game.staticObjects.setMovingPhysicCircle(this.creature_options);
					};

					//установка положения существу
					this.setPositionCreature(this.creature_options);

					//установка физического круга взаимодействия с героем					 
					this.game.staticObjects.setMovingPhysicCircleHero(this.creature_options);


					if(this.creature_options['speed'] || this.game.hero.hero_options['timer_hero']) {

						//установка физического круга взаимодействия с неподвижными объектами
						this.game.staticObjects.setStaticPhysicCircle(this.creature_options);
					}
					
								    	
				} else if(this.creature_options['state'] != 'Stand') {

					//переход в состояние покоя
					this.setStandStateCreature(this.creature_options);
				};
			};

			requestAnimationFrame(runMop.bind(this))

		}).call(this)
	}
}