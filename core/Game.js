class Game {

	constructor () {

		//установка прототипов встоенным объектам
    	Prototypes.setPrototypesObjects();

		//при первом запуске создавать сохранения и объект с музыкой и звуками
		if(!Prototypes.save_obj) {
		    Prototypes.setDefaultSettings();
		};

		//запуск игры после загрузки страницы
		window.addEventListener('load', () => {

			//создание объекта сохранений
			this.save_obj = Prototypes.save_obj;

			//создание объекта со звуками и музыкой
			this.audio_obj = Prototypes.audio_obj;

			if(document.getElementById('Main-menu')) {

				//ЗАПУСК ГЛАВНОГО МЕНЮ
				this.startMainMenu();
			} else {
				
				// ЗАПУСК ИГРЫ
				this.startGame();
			}

		})
	}




	//ЗАПУСК ГЛАВНОГО МЕНЮ
	startMainMenu() {

		//класс главного меню
		this.mainMenu = new MainMenu();
	}


	//ЗАПУСК ИГРЫ
	startGame() {

		//ОТМЕНА СОБЫТИЙ БРАУЗЕРА ПО УМОЛЧАНИЮ
	    document.body.addEventListener('dragstart', function (e) { 
	        e.preventDefault();
	    });
	    document.body.addEventListener('mousedown', function (e) { 
	        if(e.which == 2) {
	            e.preventDefault();
	        };
	    });




    	//СОЗДАНИЕ ВСЕХ КЛАССОВ И СОБЫТИЙ К НИМ


    	//класс Prototypes
    	this.Prototypes = Prototypes;



    	//класс Math
		this.Math = Math;



		//класс Object
		this.Object = Object;



    	//класс неподвижных объектов
    	this.staticObjects = new StaticObjects('OrdenCastle');



    	//класс герой
		this.hero = new Hero({
	        health_points: 50000,
	        mana_points: 200,
	        energe_points: 200,
	        max_experience: 100,
	        skill_points: 10,
	        characteristic_points: 10
    	});

		//установка событий клавиатуры
    	window.onkeydown = this.hero.keydown.bind(this.hero);
    	window.onkeyup = this.hero.keyup.bind(this.hero);



    	//класс интерфейс
	    this.heroInterface = new HeroInterface();

	    let hero_interface = this.heroInterface.DOM_elements_interface['hero-interface'];

	    //установка событий мыши
	    hero_interface.onmousedown = this.heroInterface.mousedown.bind(this.heroInterface);
	    hero_interface.addEventListener('mouseenter', this.heroInterface.mouseenter.bind(this.heroInterface), true);
	    hero_interface.addEventListener('mousemove', this.heroInterface.mousemove.bind(this.heroInterface), true);
	    hero_interface.addEventListener('mouseleave', this.heroInterface.mouseleave.bind(this.heroInterface), true);



	    //классы способностей
	    this.heroSkills = new HeroSkills(this.hero);


	    //классы ударов
	    this.heroStrikes = new HeroStrikes(this.hero);


	    //класс существ
	    this.creatures = new Creatures();
	  


		// this.creatures.createCreaturesInRandom({
	 //        type: 'Mop',
	 //        area_options: {
	 //            x: 0,
	 //            y: 0,
	 //            w: 3000,
	 //            h: 3000
	 //        },
	 //        count: 50
	 //    });

	 //    this.creatures.createCreaturesInRandom({
	 //        type: 'Arrey',
	 //        area_options: {
	 //            x: 0,
	 //            y: 0,
	 //            w: 3000,
	 //            h: 3000
	 //        },
	 //        count: 25
	 //    });
	       
	}
};

//СОЗДАНИЕ ИГРЫ
let game = new Game();