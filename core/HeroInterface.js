class HeroInterface {

	constructor() {

		//ССЫЛКА НА ВСЕ КЛАССЫ
		this.game = game;

		//ДОМ-ЭЛЕМЕНТЫ
		this.DOM_elements_interface = {
			'interface': document.getElementById('Interface'),
			'hero-interface': document.getElementById('Hero-interface'),
			'mini-menu': document.getElementById('Mini-menu'),
	        'ep_hero': document.getElementById('Ep-hero'),
	        'amount_ep': document.getElementById('Amount-ep'),
	        'hp_hero': document.getElementById('Hp-hero'),
	        'amount_hp': document.getElementById('Amount-hp'),
	        'mp_hero': document.getElementById('Mp-hero'),
	        'amount_mp': document.getElementById('Amount-mp'),
	        'ex_hero': document.getElementById('Ex-hero'),
	        'amount_ex': document.getElementById('Amount-ex'),
	        'amount_level': document.getElementById('Amount-level'),
	        'sp_hero': document.getElementById('Sp-hero'),
	        'amount_sp': document.getElementById('Amount-sp'),
	        'charact_points': document.querySelectorAll('#Plus-hp, #Plus-mp, #Plus-ep'),
	        'plus_skills': document.querySelectorAll('.plus-skill'),
	        'upgrade_skills': document.querySelectorAll('.upgrade-skill'),
	        'evolution_timer': document.getElementById('Evolution-timer'),
	        'manaElixir': document.querySelectorAll('.cost-manaElixir'),
	        'hpElixir': document.querySelectorAll('.cost-hpElixir'),
	        'description_skills': document.getElementById('Description-skills'),
	        'need_mp': document.getElementById('Need-mp'),
	        'new_level': document.getElementById('New-level'),
	        'next_level': document.getElementById('Next-level'),
	        'description_name': document.getElementById('Description-name'),
	        'cost_mp': document.getElementById('Cost-mp'),
	        'description_skill': document.getElementById('Description-skill')
		};


		//УСТАНОВКА РАЗМЕРОВ ИГРЫ (ВСЕХ DOM-ЭЛЕМЕНТОВ)
		this.setSizeGame()

		//УСТАНОВКА КАРТИНОК ИНТЕРФЕЙСУ
		Prototypes.setStaticImg('Hero-interface');

		//УСТАНОВКА ГРОМКОСТИ
		Prototypes.setVolumeAudio(this.game.audio_obj);

		//УСТАНОВКА ЯЗЫКА В ИГРЕ
		Prototypes.setLanguageGame();

		//ЗАПУСК МУЗЫКЕ В ИГРЕ
		Prototypes.runMusicGame(this.game.audio_obj['music']['Beats-theme']);

	}

	


	//НАЖАТИЕ КНОПКИ МЫШИ
	mousedown(e) {

		//левая кнопка мыши
        if(e.which == 1) {

        	//отбор по id 
        	switch(e.target.id) {




        		//продолжить игру
                case 'Continue':
                case 'ReturnToGame':
                    this.DOM_elements_interface['mini-menu'].style.display = 'none';
                break;

                //сохранения и выход из игры
                case 'Exit':
                case 'ExitFromGame':

                   this.game.save_obj['game_obj']['play_intro'] = false;
                   Prototypes.save_obj = this.game.save_obj;

                   document.location.href = 'Main-menu.html';
                break;







        		//физическая атака героя при нажатии на экран
        		case 'Interface':
        			this.game.hero.heroClickAttack(e);
        		break;




        		//активация способности ярости
                case 'IconRage':
                    this.game.heroSkills.rage();
                break;

                //активация способности огненный шар (только при обычной атаке)
                case 'IconFireball':
                	if(this.game.hero.skills_obj['current_attack'] == this.game.hero.skills_obj['const_attack']) {
                		this.game.heroSkills.fireball();
                	}
                break;

                //активация способности ледяная стрела (только при обычной атаке)
                case 'IconIcelance':
                	if(this.game.hero.skills_obj['current_attack'] == this.game.hero.skills_obj['const_attack']) {
                		this.game.heroSkills.icelance();
                	}
                break;

                //активация способности огненный след
                case 'IconFierytrail':
                	this.game.heroSkills.fierytrail();
                break;

                //активация способности регенерация
                case 'IconRegen':
                	this.game.heroSkills.regen();
                break;

                //активация способности рывок (только при обычной атаке)
                case 'IconCharge':
                	if(this.game.hero.skills_obj['current_attack'] == this.game.hero.skills_obj['const_attack']) {
                		this.game.heroSkills.charge()
                	}
                break;

                //активация способности кража души
                case 'IconSoulsteel':
                	this.game.heroSkills.soulsteel();
                break;

                //активация способности остановка времени
                case 'IconStoptime':
                	this.game.heroSkills.stoptime();
                break;




                //улучшения способности ярость
                case 'Upgrade-rage':
                	this.game.heroSkills.upgradeRage();
                break;

                //улучшение способности огненный шар
                case 'Upgrade-fireball':            	
                	this.game.heroSkills.upgradeFireball();
                break;

                //улучшение способности ледяная стрела
                case 'Upgrade-icelance':
                	this.game.heroSkills.upgradeIcelance();
                break;

                //улучшение способности огненный след
                case 'Upgrade-fierytrail':
                	this.game.heroSkills.upgradeFierytrail();
                break;

                //улучшение способности регенерация
                case 'Upgrade-regen':
                	this.game.heroSkills.upgradeRegen();
                break;

                //улучшение способности рывок
                case 'Upgrade-charge':
                	this.game.heroSkills.upgradeCharge();
                break;

                //улучшение способности кража души
                case 'Upgrade-soulsteel':
                	this.game.heroSkills.upgradeSoulsteel();
                break;

                //улучшение способности остановка времени
                case 'Upgrade-stoptime':
                	this.game.heroSkills.upgradeStoptime();
                break;






                //добавление школ
                case 'Fire-school-plus':
                case 'Water-school-plus':
                case 'Earth-school-plus':
                case 'Air-school-plus':
                case 'Force-school-plus':
                case 'Spirit-school-plus':
                case 'Control-school-plus':
                	this.addSchool(e.target.id.split('-')[0]);
                break;

                //добавление способностей
                case 'Add-fireball':
                case 'Add-fierytrail':
                case 'Add-icelance':
                case 'Add-regen':
                case 'Add-charge':
                case 'Add-rage':
                case 'Add-soulsteel':
                case 'Add-stoptime':
                	let skill = e.target.id.split('-')[1];
                	this.addSkill(skill[0].toUpperCase() + skill.slice(1));
                break;

                //увеличение максимального здоровья, маны и выносливости
                case 'Plus-hp':
                case 'Plus-mp':
                case 'Plus-ep':
                	let charact = e.target.id.split('-')[1];

                	if(this.game.hero[charact]['current'] != 0) {
                		this.game.hero.changeCurrentCharact('cp', -1);
                	};

                	this.game.hero.changeMaxCharact(charact, this.game.hero.hero_options['plus_characts'][charact]);
                break;

                //перемещение способностей (школ) по стрелкам
                case 'Move-left':
                case 'Move-right':
                	this.moveSchool(e.target, e.target.id.split('-')[1])
                break;
        	}


        	//отбор по первому классу
        	switch(e.target.classList[0]) {

        		//воспроизведение звука интерфейса
        		case 'button':
        		case 'plus-points':
       			case 'plus-skill':
        		case 'add-skill':
        		case 'upgrade-skill':
        		case 'move-left':
        		case 'move-right':
        			this.playSoundInterface('Click');
        		break;
        	}

        }
	}




	//НАВЕДЕНИЕ НА ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
	mouseenter(e) {
		
		//отбор по первому классу
		switch(e.target.classList[0]) {

			//показ характеристик способности в сплывающем окне при добавлении
			case 'add-skill':
				this.showCharactSkill({
					skill: e.target,
					showDecription: true
				})
			break;

			//показ характеристик выбранной способности в сплывающем окне без описания
			case 'selected-skill':
				this.showCharactSkill({
					skill: e.target,
					showDecription: false
				})
			break;

			//показ характеристик улучшение способности
			case 'upgrade-skill':
				this.showCharactUpgradeSkill(e.target)
			break;

			//воспроизведение звука при наведении
			case 'button':
				this.playSoundInterface('Hover');
			break;
		}
	}



	//ДВИЖЕНИЕ КУРСОРА ПО ЭЛЕМЕНТАМ ИНТЕРФЕЙСА
	mousemove(e) {

		//отбор по первому классу
		switch(e.target.classList[0]) {

			//движение всплывающего окна характеристик способностей за курсором
			case 'add-skill':
			case 'selected-skill':
			case 'upgrade-skill':
				this.setXYCharactSkills({
					x: e.clientX,
					y: e.clientY,
					offset: 15
				})
			break;
		}
	}




	//ВЫХОД КУРСОРА ИЗ ЭЛЕМЕНТОВ ИНТЕРФЕЙСА
	mouseleave(e) {

		//отбор по первому классу
		switch(e.target.classList[0]) {

			//скрытие окна характеристик способностей
			case 'add-skill':
			case 'selected-skill':
			case 'upgrade-skill':
				this.DOM_elements_interface['description_skills'].style.display = 'none';
			break;
		}
	}






	//ОТКРЫТЬ МИНИ-МЕНЮ
	openMiniMenu() {
                    
        if(getComputedStyle(this.DOM_elements_interface['mini-menu']).display == 'none') {
            this.DOM_elements_interface['mini-menu'].style.display = 'block';
        } else {
             this.DOM_elements_interface['mini-menu'].style.display = 'none';
        };

	}










	//ПОКАЗАТЬ ХАРАКТЕРИСТИКИ СПОСОБНОСТИ
	showCharactSkill({skill, showDecription}) {

		let DOM_elements_interface = this.DOM_elements_interface;
		let icon = this.game.hero.skills_obj['icons'][skill.parentElement.id];

		DOM_elements_interface['description_skills'].style.display = 'block';
		DOM_elements_interface['need_mp'].style.display = 'flex';
		DOM_elements_interface['new_level'].style.display = 'none';

		DOM_elements_interface['description_name'].innerHTML = icon['name-skill'];
		DOM_elements_interface['description_name'].style.color = icon['color-skill'];
		DOM_elements_interface['cost_mp'].innerHTML = icon['cost-skill'];

		if(showDecription) {
			DOM_elements_interface['description_skill'].innerHTML = icon['description'];
		} else {
			DOM_elements_interface['description_skill'].innerHTML = '';
		};
	}



	//ПОКАЗАТЬ ХАРАКТЕРИСТИКИ УЛУЧШЕНИЕ СПОСОБНОСТИ
	showCharactUpgradeSkill(skill) {

		let DOM_elements_interface = this.DOM_elements_interface;
		let icon = this.game.hero.skills_obj['icons'][skill.parentElement.id];

		DOM_elements_interface['description_skills'].style.display = 'block';
		DOM_elements_interface['description_name'].innerHTML = '';
		DOM_elements_interface['need_mp'].style.display = 'none';
		DOM_elements_interface['new_level'].style.display = 'flex';
		DOM_elements_interface['new_level'].style.color = icon['color-skill'];
		DOM_elements_interface['description_skill'].innerHTML = icon[`description${icon['num-level'] + 1}`];
		DOM_elements_interface['next_level'].innerHTML = `&#854${icon['num-level'] + 4};`;
	}




	//УСТАНОВКА КООРДИНАТ ОКНУ ХАРАКТЕРИСТИК СПОСОБНОСТЕЙ
	setXYCharactSkills({x, y, offset}) {

		let description_skills = this.DOM_elements_interface['description_skills'];

		description_skills.style.left = x + offset + 'px';
		description_skills.style.top = y - description_skills.offsetHeight - offset + 'px';
	}



	//ВОСПРОИЗВЕДЕНИЕ ЗВУКА ИНТЕРФЕЙСА
	playSoundInterface(event) {
		this.game.audio_obj['effects']['Interface'][event].stop();
		this.game.audio_obj['effects']['Interface'][event].play();
	}





	//ДОБАВЛЕНИЕ (ОТКРЫТИЕ ИЛИ СКРЫТИЕ) ШКОЛЫ СПОСОБНОСТЕЙ
	addSchool(school_name) {

		let school = this.game.hero.skills_obj['school'][school_name + '-school'];

		if(school['add-skill'].innerHTML == '+') {
	        school['window-school'].style.top = 0;
	        school['add-skill'].innerHTML = '-';
	    } else {
	        school['window-school'].style.top = school['top'];
	        school['add-skill'].innerHTML = '+';
	    }
	}


	//ДОБАВЛЕНИЕ СПОСОБНОСТИ
	addSkill(skill_name) {

		if(this.game.hero.sp['current'] > 0) {

			let school_name = document.querySelector('#' + skill_name).parentElement.id.split('-')[0];
			let school = this.game.hero.skills_obj['school'][school_name + '-school'];

	        this.game.hero.skills_obj['icons'][skill_name]['skill'].style.display = 'block';
	        school['window-school'].style.top = school['top'];
	        school['add-skill'].innerHTML = '+';
	        school['current-skill'] = document.querySelector('#' + school_name + '-skills #Icon' + skill_name);

	        this.game.hero.changeCurrentCharact('sp', -1);
   		}
	}



	//ПЕРЕМЕЩЕНИЕ ШКОЛЫ СПОСОБНОСТЕЙ ПО СТРЕЛКАМ
	moveSchool(arrow, direction) {

		let schools = this.game.hero.skills_obj['school'];
		let school = schools[arrow.getAttribute('school') + '-school'];
	    let num = school['num'];
	    let left = school['left'];
	    let change_school;

	    if(direction == 'right') {
	       
	        for(let key in schools) {
	            if(schools[key]['num'] == num + 1) {
	                change_school = schools[key];
	                break;
	            }
	        };
	        if(change_school == undefined) {
	            return 0
	        };
	        change_school['num']--;
	        school['num']++;

	    } else {

	        for(let key in schools) {
	            if(schools[key]['num'] == num-1) {
	                change_school = schools[key];
	                break;
	            }
	        };
	        if(change_school == undefined) {
	            return 0
	        };
	        change_school['num']++;
	        school['num']--;
	    }

	    change_school['school'].style.left = left;
	    school['school'].style.left = change_school['left'];

	    change_school['left'] = left;
	    school['left'] = school['school'].style.left;
	}



	//ИЗМЕНЕНИЕ РАЗМЕРА ПОЛОСКИ И ЗНАЧЕНИЯ ХАРАКТЕРИСТИК ГЕРОЯ (ЗДОРОВЬЯ, МАНЫ, ВЫНОСЛИВОСТИ)
	changeDisplayCharact({charact, new_current, max}) {
		this.DOM_elements_interface['amount_' + charact].innerHTML = this.game.Math.floor(new_current) + '/' + max;
		this.DOM_elements_interface[charact + '_hero'].style.backgroundSize = new_current * 100 / max + '% 100%';
	}


	//ПОКАЗАТЬ ИЗМЕНЕНИЯ ХАРАКТЕРИСТИК ГЕРОЯ НА ИНТЕРФЕЙСЕ
	showChangesCharacts({charact, new_current, max, current}) {

		let skills_obj = this.game.hero.skills_obj;
		let DOM_elements_interface = this.DOM_elements_interface;

		if(current == undefined) {
			current = this.game.hero[charact]['current'];
		};

		switch(charact) {

			//изменение здоровья, маны, выносливости, опыта
			case 'hp':
			case 'mp':
			case 'ep':
			case 'ex':
			    this.changeDisplayCharact({charact, new_current, max});
			break;

			case 'sp':				
			    DOM_elements_interface['amount_' + charact].innerHTML = new_current;
			    DOM_elements_interface[charact + '_hero'].style.filter = 'brightness(100%)';

			    if(new_current == 0) {

			        DOM_elements_interface[charact + '_hero'].style.filter = 'brightness(50%)';

			        //скрытие плюсов для открытия школ 
			        for(let value of DOM_elements_interface['plus_skills']) {
			            value.style.display = 'none';
			            value.parentElement.style.lineHeight = 
			            	parseFloat(value.parentElement.style.lineHeight) * 1.3 + 'px';
			        };

			        //скрытие плюсов для улучшения способностей
			        for(let value of DOM_elements_interface['upgrade_skills']) {
			            value.style.display = 'none';
			        };

			        //скрытие окон для способностей 
			        for(let key in skills_obj['school']) {
			            skills_obj['school'][key]['window-school'].style.top = skills_obj['school'][key]['top'];
			            skills_obj['school'][key]['add-skill'].innerHTML = '+';
			        };

			    } else if(current == 0) {

			    	//открытие плюсов для открытия школ 
			        for(let value of DOM_elements_interface['plus_skills']) {
			            value.style.display = 'block';
			            value.parentElement.style.lineHeight = 
			            	parseFloat(value.parentElement.style.lineHeight) / 1.3 + 'px';
			        };	

			    	//открытие плюсов для улучшения способностей, кроме максимального
				    for(let value of DOM_elements_interface['upgrade_skills']) {

				        if(skills_obj['icons'][value.parentElement.id]['num-level'] != 
				           skills_obj['icons'][value.parentElement.id]['max-level']) 
				        {
				            value.style.display = 'block';
				        }
				    };  
			    } else {

			    	//скрытие плюсов для улучшения способностей при максимальном уровне
			    	for(let value of DOM_elements_interface['upgrade_skills']) {
			            if(skills_obj['icons'][value.parentElement.id]['num-level'] == 
				           skills_obj['icons'][value.parentElement.id]['max-level']) 
				        {
				            value.style.display = 'none';
				        }
			        };
			    }
			break;

			case 'cp':
				if(new_current == 0) {

					//скрытие плюсов для увеличение характеристик героя
					for(let value of DOM_elements_interface['charact_points']) {
			            value.style.display = 'none';
			        };
				} else if(current == 0) {

					//открытие плюсов для увеличение характеристик героя
					for(let value of DOM_elements_interface['charact_points']) {
			            value.style.display = 'block';
			        };
				}
			break;

			case 'level':
				DOM_elements_interface['amount_level'].innerHTML = new_current;
		        for(let value of DOM_elements_interface['manaElixir']) {
		            value.innerHTML = this.game.hero.hero_options['cost_manaElixir'].toFixed();
		        };
		        for(let value of DOM_elements_interface['hpElixir']) {
		            value.innerHTML = this.game.hero.hero_options['cost_hpElixir'].toFixed();
		        };
			break;
		};
	}


	//АКТИВАЦИЯ МИГАЮЩЕЙ ПОЛОСЫ (ПРИ ПРЕДЕЛЬНОМ ЗНАЧЕНИИ МАНЫ, ВЫНОСЛИВОСТИ, ОПЫТА)
	activateBlinkBar(charact, one_blink) {

		let value = 0;
		let decrease_opacity = false;
		let hero_options = this.game.hero.hero_options;
		let DOM_elements_interface = this.DOM_elements_interface;

		DOM_elements_interface['amount_' + charact].style.color = 'red';

		//таймер лимита при ударе
		if(one_blink) {
			hero_options['ep_blink_strike'] = true;
			this.game.audio_obj['effects']['Hero']['Lock'].play();
		} else {
			this.game.audio_obj['effects']['Hero']['Gasp'].loop = true;
			this.game.audio_obj['effects']['Hero']['Gasp'].play();
		};

		(function limit () {
			DOM_elements_interface[charact + '_hero'].style.backgroundColor = 'rgba(255, 0, 0, ' + value + ')';

			if(decrease_opacity) {
				value -= 0.05;

				if(value <= 0) {
					decrease_opacity = false;

					if(one_blink) {
						hero_options[charact + '_blink_timer'] = undefined;

						switch(charact) {
							case 'mp':
								DOM_elements_interface['amount_mp'].style.color = '#1C69EA';
							break;

							case 'ep':
								DOM_elements_interface['amount_ep'].style.color = '#22EC00';
								hero_options['ep_blink_strike'] = false;
							break;

							case 'ex':
								DOM_elements_interface['amount_ex'].style.color = '#E0E6AF';
							break;
						};
						return 0;
					}
				}
			} else {
				value += 0.05;

				if(value >=1 ) {
					decrease_opacity = true;
				}
			};
				
			hero_options[charact + '_blink_timer'] = requestAnimationFrame(limit)
				
		})()
	}



	//ОСТАНОВКА МИГАЮЩЕЙ ПОЛОСЫ
	stopBlinkBar(charact) {

		let hero_options = this.game.hero.hero_options;
		let DOM_elements_interface = this.DOM_elements_interface;

		switch(charact) {
			case 'mp':
				DOM_elements_interface['amount_mp'].style.color = '#1C69EA';
			break;

			case 'ep':
				DOM_elements_interface['amount_ep'].style.color = '#22EC00';
			break;
		};

		cancelAnimationFrame(hero_options[charact + '_blink_timer']);

		DOM_elements_interface[charact + '_hero'].style.backgroundColor = 'initial';
		hero_options[charact + '_blink_timer'] = undefined;
		this.game.audio_obj['effects']['Hero']['Gasp'].stop();
	}




	//УСТАНОВКА РАЗМЕРОВ ИГРЫ
	setSizeGame() {

		let DOM_elements_interface = this.DOM_elements_interface;

		//установка координат камеры
		DOM_elements_interface['interface'].style.width = this.game.hero.screen_obj['screenWidth'] + 'px';
		DOM_elements_interface['interface'].style.height = this.game.hero.screen_obj['screenHeight'] + 'px';

		Prototypes.setSizeDOMElements([

			//позиционирование приветствия
			{
				arr_elements: document.querySelectorAll('#Greeting'),
				styles: {
					'top': 1, 
					'left': 1, 
					'width': 1, 
					'height': 1, 
					'fontSize': 1, 
					'borderRadius': 1, 
					'lineHeight': 1, 
					'paddingLeft': 1, 
					'paddingRight': 1, 
					'paddingTop': 1, 
					'paddingBottom': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#OK'),
				styles: {
					'bottom': 1
				}
			},

			//позиционирование мини меню
			{
				arr_elements: document.querySelectorAll(
					`#Mini-menu, 
					#Death-menu`
				), 
				styles: {
					'top': 1, 
					'left': 1, 
					'width': 1, 
					'height': 1, 
					'fontSize': 1, 
					'borderRadius': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Continue, 
					#New-game`
				), 
				styles: {
					'top': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Exit, 
					#Exit-game`
				), 
				styles: {
					'bottom': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('.button'), 
				styles: {
					'borderRadius': 1, 
					'width': 1, 
					'left': 1, 
					'paddingLeft': 1, 
					'paddingRight': 1, 
					'paddingTop': 1, 
					'paddingBottom': 1
				}
			},

			//позиционирование способностей и школ
			{
				arr_elements: document.querySelectorAll(
					`.icon, 
					#Icons-skills div[id^=Icon], 
					.add-skill`
				), 
				styles: {
					'width': 1, 
					'height': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Icons-skills > div, 
					.skills-interface .name-level, 
					.upgrade-skill, 
					.skills-interface > div`
				), 
				styles: {
					'top': 1, 
					'left': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('.window-skills'), 
				styles: {
					'top': 1, 
					'width': 1, 
					'height': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`.open-window-skills, 
					.move-left, 
					.move-right`
				), 
				styles: {
					'top': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`.add-skill, 
					.name-school, 
					.name-skill, 
					.move-left, 
					.move-right, 
					.upgrade-skill, 
					.plus-skill, 
					.skills-interface 
					.name-level, 
					#Description-name, 
					#Description-skill, 
					#Need-mp, 
					#New-level, 
					#Next-level`
				), 
				styles: {
					'fontSize': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('.name-skill'), 
				styles: {
					'height': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`.move-left, 
					.move-right`
				), 
				styles: {
					'left': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`.plus-skill, 
					.skills-interface > div, 
					#Icons-skills > div, 
					#Description-skills`
				), 
				styles: {
					'width': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`.open-window-skills, 
					#Description-skills`
				),
				styles: {
					'borderWidth': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`.add-skills, 
					#Description-skills`
				), 
				styles: {
					'lineHeight': 1
				}
			},
			{
				arr_elements: [DOM_elements_interface['description_skills']], 
				styles: {
					'paddingTop': 1, 
					'paddingBottom': 1, 
					'paddingLeft': 1, 
					'paddingRight': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Description-name, 
					#Description-skill`
				), 
				styles: {
					'marginBottom': 1
				}
			},
			{
				arr_elements: [DOM_elements_interface['cost_mp']], 
				styles: {
					'marginLeft': 1
				}
			},
			{
				arr_elements: [DOM_elements_interface['next_level']], 
				styles: {
					'marginRight': 1
				}
			},

			//позиционирование диалогов
			{
				arr_elements: document.querySelectorAll('#Dialog, #Text'), 
				styles: {
					'top': 1, 
					'left': 1,
					'width': 1, 
					'height': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Text'), 
				styles: {
					'paddingRight': 1, 
					'fontSize': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Answer1:not([class]), 
					#Answer2:not([class])`
				), 
				styles: {
					'fontSize': 1, 
					'paddingRight': 1, 
					'top': 1, 
					'width': 1, 
					'borderRadius': 1, 
					'borderWidth': 1, 
					'paddingTop': 1, 
					'paddingBottom': 1, 
					'paddingLeft': 1, 
					'paddingRight': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Answer1:not([class])'), 
				styles: {
					'left': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Answer2:not([class])'), 
				styles: {
					'right': 1
				}
			},

			//позиционирование характеристик героя
			{
				arr_elements: [
					DOM_elements_interface['hp_hero'], 
					DOM_elements_interface['mp_hero'], 
					DOM_elements_interface['ep_hero'], 
					DOM_elements_interface['ex_hero']
				], 
				styles: {
					'top': 1, 
					'left': 1, 
					'width': 1, 
					'height': 1
				}
			},
			{
				arr_elements: [
					DOM_elements_interface['amount_hp'], 
					DOM_elements_interface['amount_ep'], 
					DOM_elements_interface['amount_mp'], 
					DOM_elements_interface['amount_ex'], 
					DOM_elements_interface['amount_level'], 
					DOM_elements_interface['evolution_timer'], 
					DOM_elements_interface['sp_hero']
				], 
				styles: {
					'top': 1, 
					'fontSize': 1
				}
			},
			{
				arr_elements: [DOM_elements_interface['evolution_timer']], 
				styles: {
					'left': 1
				}
			},
			{
				arr_elements: [
					DOM_elements_interface['amount_level'], 
					DOM_elements_interface['sp_hero'], 
					DOM_elements_interface['evolution_timer']
				], 
				styles: {
					'width': 1
				}
			},
			{
				arr_elements: [DOM_elements_interface['amount_level']], 
				styles: {
					'paddingTop': 1, 
					'paddingBottom': 1, 
					'paddingLeft': 1, 
					'paddingRight': 1
				}
			},
			{
				arr_elements: document.querySelectorAll(
					`#Plus-hp, 
					#Plus-mp, 
					#Plus-ep`
				), 
				styles: {
					'fontSize': 1, 
					'top': 1, 
					'right': 1
				}
			},
			{
				arr_elements: document.querySelectorAll('#Name-evolutionTimer'), 
				styles: {
					'fontSize': 1, 
					'top': 1, 
					'left': 1, 
					'width': 1
				}
			}
		]);

		//установка значений характеристик героя
		this.showChangesCharacts({
			charact: 'hp', 
			new_current: this.game.hero.hp['current'], 
			max: this.game.hero.hp['max']
		});
		this.showChangesCharacts({
			charact: 'mp', 
			new_current: this.game.hero.mp['current'], 
			max: this.game.hero.mp['max']
		});
		this.showChangesCharacts({
			charact: 'ep', 
			new_current: this.game.hero.ep['current'], 
			max: this.game.hero.ep['max']
		});
		this.showChangesCharacts({
			charact: 'ex', 
			new_current: this.game.hero.ex['current'], 
			max: this.game.hero.ex['max']
		});
		this.showChangesCharacts({
			charact: 'sp', 
			new_current: this.game.hero.sp['current'], 
			max: this.game.hero.sp['max']
		});
		this.showChangesCharacts({
			charact: 'cp',
			current: 0,
			new_current: this.game.hero.cp['current'], 
			max: this.game.hero.sp['max']
		});
	}


}