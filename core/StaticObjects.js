class StaticObjects {
	
	constructor (locationName) {

		//ССЫЛКА НА ВСЕ КЛАССЫ
		this.game = game;

		//ХАРАКТЕРИСТИКИ НЕПОДВИЖНЫХ ОБЪЕКТОВ
		this.SO_options = {};

		//ХАРАКТЕРИСТИКИ БЛИЖАЙШИХ К ГЕРОЮ НЕПОДВИЖНЫХ ОБЪЕКТОВ
		this.closestSO_options = {};

		//СОЗДАНИЕ ВСЕХ НЕПОДВИЖНЫХ ОБЪЕКТОВ В ДАННОЙ ЛОКАЦИИ
		this.createSOinLocation(locationName)
	}





	//СОЗДАНИЕ ВСЕХ НЕПОДВИЖНЫХ ОБЪЕКТОВ В ДАННОЙ ЛОКАЦИИ
	createSOinLocation(locationName) {

		switch(locationName) {

			//ЛОКАЦИЯ - ЗАМОК ОРДЕНА
			case 'OrdenCastle':
				this.createStaticObjects([

					//установка периметра карты
					{
						type: 'innerRect',
						w: 3000,
						h: 3000,
						x: 0,
						y: 0
					},

					//установка бочек в случайном порядке на карте
					{
						id: 'Barrel',
						type: 'circle',
						w: 100,
						h: 100,
						size: 80,
						area_options: {
							x: 0,
							y: 0,
							w: 3000,
							h: 3000
						},
						connect: {
							connectObject: 'barrel',
							connectX: 40,
							connectY: 40,
							connectR: 100,
							idImgAfterConnect: 'Barrel_open'
						},
						count: 100
					},

					//установка крыши
					{
						id: 'Roof1',
						type: 'roof',
						typeRoof: 'circle',
						x: 300,
						y: 1600,
						w: 750,
						h: 750,
						size: 750,
						r: 300,
						offsetX: 100,
						offsetY: 65
					}
				], locationName);
			break;
		}

	}



	//СОЗДАНИЕ НЕПОДВИЖНЫХ ОБЪЕКТОВ НА КАРТЕ
	createStaticObjects(arrSO_options, locationName) {

		let static_objects = document.getElementById('Static-objects');

		//координаты для случайного размещения неподвижных объектов
		let x_min, y_min, a, b;

		for (let so_options of arrSO_options) {



			//присвоение случайных координат в заданных квадратах внутри переданной области
			if(so_options.area_options) {

				//показать область случайной расстановки неподвижных объектов
				if(so_options.area_options['show_area']) {

					let clone = document.getElementById('PhysicRectangle').cloneNode();
					clone.style.cssText = `
						width: ${so_options.area_options['w']}px; 
						height: ${so_options.area_options['h']}px; 
						left: ${so_options.area_options['x']}px;  
						top: ${so_options.area_options['y']}px;
					`;
					static_objects.appendChild(clone);
				};

				x_min = so_options.area_options['x'];
				y_min = so_options.area_options['y'];

				a = (so_options.area_options['w'] - so_options['w']) / so_options.count;
				b = (so_options.area_options['h'] - so_options['h']);
			};



			//создание неподвижных объектов
			for(let i = 0; i < (so_options.count || 1); i++) {

				//номер статического объекта
				let number = this.game.Object.keys(this.SO_options).length;

				//создание элемента
				let static_object = document.createElement('div');

				//свойство - размер элемента
				let background_size;
				if(!so_options.size) {
					background_size = 'auto';
				} else {
					background_size = `${so_options.size}px`;
				};

				//свойство - картинка элемента
				let background_image;
				if(!so_options.id) {
					background_image = 'none';
				} else {
					background_image = `url(Images/Texture/Static-objects/${locationName}/${so_options.id}.png)`;
				};

				//координаты
				if(so_options.area_options) {
					so_options.x = this.game.Math.randomNumber(x_min, x_min + a);
					so_options.y = this.game.Math.randomNumber(y_min, y_min + b);

					x_min += a;	
				};

				//задание стилей элементу
				static_object.style.cssText = `
					width: ${so_options.w}px; 
					height: ${so_options.h}px; 
					background-size: ${background_size}; 
					left: ${so_options.x}px;  
					top: ${so_options.y}px; 
					background-image: ${background_image}; 
					transform: rotate(${so_options.degreeRotate || 0}deg);
				`;

				//создание элемента на карте
				static_objects.appendChild(static_object);


				//занесение данного элемента в SO_options для взаимодействия с ним
				if(so_options.type) {

					let SO_option = {
						'static_object': static_object,
						'type': so_options.type,
						'number': number
					};

					this.SO_options[number] = SO_option;

					//добавление элементу радиуса взаимодействия с ним
					if(so_options.w > so_options.h) {
						SO_option['visible_r'] = so_options.w + 250;
					} else {
						SO_option['visible_r'] = so_options.h + 250;
					};

					//взаимодействие с крышей
					if(so_options.typeRoof) {
						SO_option['typeRoof'] = so_options.typeRoof;
					};

					//характеристики статического объекта
					let offsetX = so_options.offsetX || 0;
					let offsetY = so_options.offsetY || 0;
					let offsetX2 = so_options.offsetX2 || so_options.w;
					let offsetY2 = so_options.offsetY2 || so_options.h;

					//создание характеристик взаимодействия статического объекта
					switch(so_options.typeRoof || so_options.type) {

						//круг
						case 'circle':

							let r = so_options.r || so_options.w / 2;

							//показать физический радиус
							if(so_options.show_physic) {
								let clone = document.getElementById('PhysicCircle').cloneNode();
								clone.style.cssText = `
									width: ${r * 2}px; 
									height: ${r * 2}px; 
									left: ${offsetX}px;  
									top: ${offsetY}px;
								`;
								static_object.appendChild(clone);
							};

							//добавление характеристик статическому объекту
							SO_option['x'] = so_options.x + offsetX + r;
							SO_option['y'] = so_options.y + offsetY + r;
							SO_option['r'] = r;
						break;

						//прямоугольник и внутренний прямоугольник
						case 'rect':
						case 'innerRect':

							//показать физический радиус
							if(so_options.show_physic) {
								let clone = document.getElementById('PhysicRectangle').cloneNode();
								clone.style.cssText = clone.style.cssText = `
									left: ${offsetX}px; 
									top: ${offsetY}px; 
									width: ${offsetX2}px; 
									height: ${offsetY2}px;
								`;
								static_object.appendChild(clone);
							};

							//добавление характеристик статическому объекту
							SO_option['x'] = so_options.x + offsetX;
							SO_option['y'] = so_options.y + offsetY;
							SO_option['x2'] = so_options.x + offsetX + offsetX2;
							SO_option['y2'] = so_options.y + offsetY + offsetY2;

							//создание двери
							if(so_options.door) {
								SO_option['doorSide'] = so_options.door.doorSide;
								SO_option['door1'] = so_options.door.door1;
								SO_option['door2'] = so_options.door.door2;
								SO_option['inside'] = false;
							};
						break;

						//наклоненный прямоугольник
						case 'rotateRect':

							let degreeRotate = so_options.degreeRotate || 0;

							let degree = this.game.Math.degreeInRan(degreeRotate);
							let cos = this.game.Math.cos(degree);
							let sin = this.game.Math.sin(degree);
							let x = so_options.x + offsetX * cos - offsetY * sin;
							let y = so_options.y + offsetX * sin + offsetY * cos;
							let x2 = offsetX2 * cos + x;
							let y2 = offsetX2 * sin + y;

							//показать физический радиус
							if(so_options.show_physic) {
								let clone = document.getElementById('PhysicRectangle').cloneNode();
								clone.style.cssText = `
									left: ${offsetX}px; 
									top: ${offsetY}px; 
									width: ${offsetX2}px; 
									height: ${offsetY2}px;
								`;
								static_object.appendChild(clone);
							};

							//добавление характеристик статическому объекту
							SO_option['x'] = x;
							SO_option['y'] = y;
							SO_option['x2'] = x2;
							SO_option['y2'] = y2;
							SO_option['x3'] = x2 - sin * offsetY2;
							SO_option['y3'] = y2 + cos * offsetY2;
							SO_option['x4'] = x - sin * offsetY2;
							SO_option['y4'] = y + cos * offsetY2;
							SO_option['tan'] = this.game.Math.tan(degree);

							//переназначение радиуса взаимодействия статического объекта
							if(SO_option['y3'] - SO_option['y'] > SO_option['visible_r']) {
								SO_option['visible_r'] = SO_option['y3'] - SO_option['y'] + 50;
							}
						break;
					}


					//добавление круга взаимодействия с героем
					if(so_options.connect) {

						SO_option['connectObject'] = so_options.connect.connectObject;

						SO_option['connectX'] = so_options.x + (so_options.connect.connectX || 0);
						SO_option['connectY'] = so_options.y + (so_options.connect.connectY || 0);
						SO_option['connectR'] = so_options.connect.connectR;
						SO_option['underRoof'] = false;

						SO_option['visible_r'] += so_options.connect.connectR;

						//картинка после взаимодействия с объектом
						SO_option['imgAfterConnect'] = `url(Images/Texture/Static-objects/${locationName}/${so_options.connect.idImgAfterConnect}.png)`;

						//показать радиус взаимодействия
						if(so_options.connect.show_physic) {

							let clone = document.getElementById('PhysicCircle').cloneNode();
							clone.style.cssText = `
								left: ${(so_options.connect.connectX || 0) - SO_option['connectR']}px; 
								top: ${(so_options.connect.connectY || 0) - SO_option['connectR']}px; 
								width: ${SO_option['connectR'] * 2}px; 
								height: ${SO_option['connectR'] * 2}px;
							`;
							static_object.appendChild(clone);
						}
					};
				}
			}

			
		}
	}




	//УСТАНОВКА БЛИЖАЙШИХ ОТ ЭЛЕМЕНТА ХАРАКТЕРИСТИК НЕПОДВИЖНЫХ ОБЪЕКТОВ
	setClosestSO(xElem, yElem) {

		for(let key in this.SO_options) {

			if(this.game.Math.isSquare(
					this.SO_options[key]['x'] - xElem,
					this.SO_options[key]['y'] - yElem, 
					this.SO_options[key]['visible_r']
				)) 
			{
				if(!this.closestSO_options[key]) {
					this.closestSO_options[key] = this.SO_options[key]
				}
			} else if(this.closestSO_options[key]) {
				delete this.closestSO_options[key]
			};
		};
	}




	//УСТАНОВКА ПРИОРИТЕТОВ ВИДИМОСТИ (СВОЙСТВО Z-INDEX)
	setVisibilityPriorities() {

		let z_index = 1;
		let visible_obj = {};

		//герой
		visible_obj[this.game.hero.hero_position['y']] = this.game.hero.DOM_elements_hero['main_character'];

		//персонажи
		// for(let key in Characts) {
		// 	visible_obj[Characts[key]['y']] = Characts[key]['character']
		// };


		//неподвижные объекты
		for(let value of this.closestSO_options) {

			visible_obj[value['y']] = value['static_object'];

			//прозрачность неподвижных объктов (кроме крыш)
			if(!value['typeRoof']) {

				if(this.game.hero.hero_position['y'] <= value['y']) {
					value['static_object'].style.opacity = 0.9
				} else {
					value['static_object'].style.opacity = 1
				}
			}
		};

		
		//существа
		for(let value of this.game.creatures.creatures_objects) {

			for(let value2 of value) {
				visible_obj[value2.creature_options['y']] = value2.creature_options['creature'];
			};

		};

		//сортировка y по возрастанию и их установка
		for(let value of this.game.Object.keys(visible_obj).sort((a, b) => a-b)) {
			visible_obj[value].style.zIndex = z_index;
			z_index++;
		};
	}




	//УСТАНОВКА ФИЗИЧЕСКОГО КРУГА ВЗАИМОДЕЙСТВИЯ ГЕРОЮ С СУЩЕСТВАМИ
	setMovingPhysicCircleHero(creature_options) {

		if(this.game.hero.hero_options['timer_hero']) {

			let vector_hero = creature_options['radius'] + this.game.hero.hero_position['radius'] - 
						  creature_options['r_with_hero'];

			if(vector_hero >= 0) {

				let x_vector = vector_hero / creature_options['r_with_hero'] * 
						   (creature_options['x'] - this.game.hero.hero_position['x']);
				let y_vector = vector_hero / creature_options['r_with_hero'] * 
						   (creature_options['y'] - this.game.hero.hero_position['y']);

				let main_character = this.game.hero.DOM_elements_hero['main_character'];
				
				creature_options['creature'].style.left = parseFloat(creature_options['creature'].style.left) + x_vector + 'px';
				creature_options['creature'].style.top = parseFloat(creature_options['creature'].style.top) + y_vector + 'px';

				main_character.style.left = parseFloat(main_character.style.left) - x_vector / 2 + 'px';
				main_character.style.top = parseFloat(main_character.style.top) - y_vector / 2 + 'px';
			};
		};
	}





	//УСТАНОВКА ФИЗИЧЕСКОГО КРУГА ВЗАИМОДЕЙСТВИЯ С СУЩЕСТВАМИ
	setMovingPhysicCircle(creature_options) {

		let sumx = 0;
		let sumy = 0;

		//установка векторов взаимодействия 
		for(let value of this.game.creatures.creatures_objects) {

			for(let obj of value) {

				let r = this.game.Math.distance(
						creature_options['x'] - obj.creature_options['x'], 
						creature_options['y'] - obj.creature_options['y']
					);
				let k = creature_options['radius'] + obj.creature_options['radius'] - r;

				if(k > 0 && r != 0) {
					let func = 7 * k / r
					sumx += func * (creature_options['x'] - obj.creature_options['x']);
					sumy += func * (creature_options['y'] - obj.creature_options['y']);
				};	
			}
		};

		creature_options['top'] = creature_options['top'] + sumy;
		creature_options['left'] = creature_options['left'] + sumx;
	}









	//УСТАНОВКА ФИЗИЧЕСКОГО КРУГА ВЗАИМОДЕЙСТВИЯ С НЕПОДВИЖНЫМИ ОБЪЕКТАМИ
	setStaticPhysicCircle(object_options) {

		//объекты пересечения
		let cross_objects;
		let i = 0;

		for(let static_object of this.closestSO_options) {

			//объект пересечения
			let cross_object;

			//взаимодействие с неподвижным объектом в зависимости от типа объекта
			switch(static_object['type']) {

				//круг
				case 'circle':
					if(static_object['r']) {
						cross_object = this.collusionWithCircle(static_object, object_options);
					};
				break;

				//прямоугольники
				case 'rect':

					//прямоугольник с дверью 
					if(static_object['doorSide']) {
						cross_object = this.collusionWithDoorRect(static_object, object_options);

					//прямоугольник
					} else {
						cross_object = this.collusionWithRect(static_object, object_options);
					}	
				break;

				//внутренний прямоугольник
				case 'innerRect':
					cross_object = this.collusionWithInnerRect(static_object, object_options);
				break;

				//наклоненный прямоугольник
				case 'rotateRect':
					cross_object = this.collusionWithRotateRect(static_object, object_options);
				break;

				//крыша (только с героем)
				case 'roof':
					if(!object_options['creature']) {
						this.collusionWithRoof(static_object, object_options);
					};
				break;

			};

			//взаимодействие с объектами действия (только для героя)
			if(!object_options['creature'] && static_object['connectObject']) {			
				this.collusionWithConnect(static_object, object_options)
			};


			//при пересечении запоминаем его
			if(cross_object) {

				//при первом заполнение создаем объект
				if(!cross_objects) {
					cross_objects = {}
				};
					
				cross_objects[i] = cross_object;
				i++;
				
			};

		};

		return cross_objects;
	}




	//СТОЛКНОВЕНИЕ С КРУГОМ
	collusionWithCircle(static_object, object_options) {

		let r = this.game.Math.distance(object_options['x'] - static_object['x'], object_options['y'] - static_object['y']);
		let vector = object_options['radius'] + static_object['r'] - r;

		if(vector > 0) {

			//объект взаимодействия (по умолчанию - герой)
			let object = object_options['creature'] || this.game.hero.DOM_elements_hero['main_character'];

			object.style.left = parseFloat(object.style.left) + vector * (object_options['x'] - static_object['x']) / r + 'px';
			object.style.top  = parseFloat(object.style.top)  + vector * (object_options['y'] - static_object['y']) / r + 'px';

			return static_object;
		};
	}




	//СТОЛКНОВЕНИЕ С ПРЯМОУГОЛЬНИКОМ
	collusionWithRect(static_object, object_options) {

		let vector1 = object_options['y'] - static_object['y']  + object_options['radius'];
		let vector2 = static_object['y2'] - object_options['y'] + object_options['radius'];
		let vector3 = static_object['x2'] - object_options['x'] + object_options['radius'];
		let vector4 = object_options['x'] - static_object['x']  + object_options['radius'];

		if(vector1 > 0 && vector2 > 0 && vector3 > 0 && vector4 > 0) {

			//объект взаимодействия (по умолчанию - герой)
			let object = object_options['creature'] || this.game.hero.DOM_elements_hero['main_character'];

			let vector_obj = {};
			vector_obj[vector1] = 'vector1';
			vector_obj[vector2] = 'vector2';
			vector_obj[vector3] = 'vector3';
			vector_obj[vector4] = 'vector4';

			let vector_arr = this.game.Object.keys(vector_obj).sort((a, b) => a-b);

			switch(vector_obj[vector_arr[0]]) {

				case 'vector1':
					object.style.top = parseFloat(object.style.top) - vector1 + 'px';
					return static_object;
				break;

				case 'vector2':
					object.style.top = parseFloat(object.style.top) + vector2 + 'px';
					return static_object;
				break;

				case 'vector3':
					object.style.left = parseFloat(object.style.left) + vector3 + 'px';
					return static_object;
				break;

				case 'vector4':
					object.style.left = parseFloat(object.style.left) - vector4 + 'px';
					return static_object;
				break;
			};
		};
	}




	//СТОЛКНОВЕНИЕ С ВНУТРЕННИМ ПРЯМОУГОЛЬНИКОМ
	collusionWithInnerRect(static_object, object_options) {

		//объект взаимодействия (по умолчанию - герой)
		let object = object_options['creature'] || this.game.hero.DOM_elements_hero['main_character'];

		let cross;
		let vector1 = object_options['y'] - static_object['y']  - object_options['radius'];
		let vector2 = static_object['y2'] - object_options['y'] - object_options['radius'];
		let vector3 = static_object['x2'] - object_options['x'] - object_options['radius'];
		let vector4 = object_options['x'] - static_object['x']  - object_options['radius'];

		if(vector1 < 0) {
			object.style.top = parseFloat(object.style.top) - vector1 + 'px';
			cross = static_object;
		};
		if(vector2 < 0) {
			object.style.top = parseFloat(object.style.top) + vector2 + 'px';
			cross = static_object;
		};
		if(vector3 < 0) {
			object.style.left = parseFloat(object.style.left) + vector3 + 'px';
			cross = static_object;
		};
		if(vector4 < 0) {
			object.style.left = parseFloat(object.style.left) - vector4 + 'px';
			cross = static_object;
		};

		return cross;
	}




	//СТОЛКНОВЕНИЕ С НАКЛОНЕННЫМ ПРЯМОУГОЛЬНИКОМ
	collusionWithRotateRect(static_object, object_options) {

		let vector1 = (object_options['y'] - static_object['y']) - (object_options['x'] - static_object['x']) * 
					  static_object['tan'] + object_options['radius'];
		let vector2 = (static_object['y4'] - object_options['y']) + (object_options['x'] - static_object['x4']) * 
					  static_object['tan'] + object_options['radius'];
		let vector3 = (static_object['x2'] - object_options['x']) + (static_object['y2'] - object_options['y']) * 
					  static_object['tan'] + object_options['radius'];
		let vector4 = (object_options['x'] - static_object['x']) - (static_object['y'] - object_options['y']) * 
					  static_object['tan'] + object_options['radius'];

		if(vector1 > 0 && vector2 > 0 && vector3 > 0 && vector4 > 0) {

			//объект взаимодействия (по умолчанию - герой)
			let object = object_options['creature'] || this.game.hero.DOM_elements_hero['main_character'];

			let vector_obj = {};
			vector_obj[vector1] = 'vector1';
			vector_obj[vector2] = 'vector2';
			vector_obj[vector3] = 'vector3';
			vector_obj[vector4] = 'vector4';

			let vector_arr = this.game.Object.keys(vector_obj).sort((a, b)=>a-b);

			switch(vector_obj[vector_arr[0]]) {

				case 'vector1':
					object.style.top = parseFloat(object.style.top) - vector1 + 'px';
					object.style.left = parseFloat(object.style.left) + vector1 + 'px';
					return static_object;
				break;

				case 'vector2':
					object.style.top = parseFloat(object.style.top) + vector2 + 'px';
					object.style.left = parseFloat(object.style.left) - vector2 + 'px';
					return static_object;
				break;

				case 'vector3':
					object.style.top = parseFloat(object.style.top) + vector3 + 'px';
					object.style.left = parseFloat(object.style.left) + vector3 + 'px';
					return static_object;
				break;

				case 'vector4':
					object.style.top = parseFloat(object.style.top) - vector4 + 'px';
					object.style.left = parseFloat(object.style.left) - vector4 + 'px';
					return static_object;
				break;
			};
		};
	}





	//СТОЛКНОВЕНИЕ С ПРЯМОУГОЛЬНИКОМ С ДВЕРЬЮ
	collusionWithDoorRect(static_object, object_options) {

		//объект взаимодействия (по умолчанию - герой)
		let object = object_options['creature'] || this.game.hero.DOM_elements_hero['main_character'];

		let cross;

		//проверка на нахождении внутри объекта
		if(object_options['x']  >= static_object['x'] && 
			object_options['x'] <= static_object['x2'] && 
			object_options['y'] >= static_object['y'] && 
			object_options['y'] <= static_object['y2']) 
		{
			if(!static_object['inside']) {
				static_object['inside'] = true
			}
		} else if(static_object['inside']) {
			static_object['inside'] = false
		};



		if(object_options['x'] >= static_object['x'] && object_options['x'] <= static_object['x2']) {

			let vector = object_options['radius'] - this.game.Math.abs(static_object['y'] - object_options['y']);

			if(vector >= 0) {

				if(static_object['doorSide'] == 'top') {

					if(!(object_options['x'] > static_object['door1'] && object_options['x'] < static_object['door2'])) {

						if(!static_object['inside']) {
							object.style.top = parseFloat(object.style.top) - vector + 'px';
							cross = static_object;
						} else {
							object.style.top = parseFloat(object.style.top) + vector + 'px';
							cross = static_object;
						}
					}

				} else {

					if(!static_object['inside']) {
						object.style.top = parseFloat(object.style.top) - vector + 'px';
						cross = static_object;
					} else {
						object.style.top = parseFloat(object.style.top) + vector + 'px';
						cross = static_object;
					}
				}

			} else {

				vector = object_options['radius'] - this.game.Math.abs(static_object['y2'] - object_options['y']);

				if(vector >= 0) {

					if(static_object['doorSide'] == 'right') {

						if(!(object_options['y'] > static_object['door1'] && object_options['y'] < static_object['door2'])) {

							if(!static_object['inside']) {
								object.style.top = parseFloat(object.style.top) + vector + 'px';
								cross = static_object;
							} else {
								object.style.top = parseFloat(object.style.top) - vector + 'px';
								cross = static_object;
							}
						}
					} else {

						if(!static_object['inside']) {
							object.style.top = parseFloat(object.style.top) + vector + 'px';
							cross = static_object;
						} else {
							object.style.top = parseFloat(object.style.top) - vector + 'px';
							cross = static_object;
						}
					}
				}
			}
		};

		if(object_options['y'] >= static_object['y'] && object_options['y'] < static_object['y2']) {

			let vector = object_options['radius'] - this.game.Math.abs(static_object['x2'] - object_options['x']);

			if(vector >= 0) {

				if(static_object['doorSide'] == 'down') {

					if(!(object_options['x'] > static_object['door1'] && object_options['x'] < static_object['door2'])) {

						if(!static_object['inside']) {
							object.style.left = parseFloat(object.style.left) + vector + 'px';
							cross = static_object;
						} else {
							object.style.left = parseFloat(object.style.left) - vector + 'px';
							cross = static_object;
						}
					}

				} else {

					if(!static_object['inside']) {
						object.style.left = parseFloat(object.style.left) + vector + 'px';
						cross = static_object;
					} else {
						object.style.left = parseFloat(object.style.left) - vector + 'px';
						cross = static_object;
					}
				}
			} else {

				vector = object_options['radius'] - this.game.Math.abs(static_object['x'] - object_options['x']);

				if(vector >= 0) {

					if(static_object['doorSide'] == 'left') {

						if(!(object_options['y'] > static_object['door1'] && object_options['y'] < static_object['door2'])) {

							if(!static_object['inside']) {
								object.style.left = parseFloat(object.style.left) - vector + 'px';
								cross = static_object;
							} else {
								object.style.left = parseFloat(object.style.left) + vector + 'px';
								cross = static_object;
							}
						}
					} else {

						if(!static_object['inside']) {
							object.style.left = parseFloat(object.style.left) - vector + 'px';
							cross = static_object;
						} else {
							object.style.left = parseFloat(object.style.left) + vector + 'px';
							cross = static_object;
						}
					}
				};
			};
		};

		return cross;
	}





	//СТОЛКНОВЕНИЕ С КРЫШЕЙ
	collusionWithRoof(static_object, object_options) {

		switch(static_object['typeRoof']) {

			case 'circle':
				if(this.game.Math.isCircle(
						object_options['x'] - static_object['x'], 
						object_options['y'] - static_object['y'], 
						object_options['radius'], 
						static_object['r']
					)) 
				{
					if(!static_object['underRoof']) {
						static_object['static_object'].style.opacity = 0.5;
						static_object['underRoof'] = true
					}
				} else if(static_object['underRoof']) {
					static_object['static_object'].style.opacity = 1;
					static_object['underRoof'] = false
				}
			break;

			case 'rect':
				if(object_options['x']  >= static_object['x'] && 
					object_options['x'] <= static_object['x2'] && 
					object_options['y'] >= static_object['y'] && 
					object_options['y'] <= static_object['y2']) 
				{
					if(!static_object['underRoof']) {
						static_object['static_object'].style.opacity = 0.5;
						static_object['underRoof'] = true
					}
				} else if(static_object['underRoof']) {
					static_object['static_object'].style.opacity = 1;
					static_object['underRoof'] = false
				};
			break;
		}
	}




	//СТОЛКНОВЕНИЕ С ОБЪЕКТАМИ ДЕЙСТВИЯ
	collusionWithConnect(static_object, object_options) {

		//пересечение круга героя и объекта взаимодействия
		if(this.game.Math.isCircle(
				object_options['x'] - static_object['connectX'], 
				object_options['y'] - static_object['connectY'], 
				object_options['radius'], 
				static_object['connectR']
			)) 
		{

			//при пустом объекте взаимодействия заполняем его 
			if(this.game.hero.hero_options['connect_number'] == null) {
				static_object['static_object'].style.filter = 'brightness(150%)';
				this.game.hero.hero_options['connect_number'] = static_object['number'];
				static_object['brightness'] = true;
			};


		//отключение осветления объекта
		} else if(static_object['brightness']) {
			static_object['static_object'].style.filter = 'brightness(100%)';
			static_object['brightness'] = false;
			this.game.hero.hero_options['connect_number'] = null;
		};			
	}




	//АКТИВАЦИЯ ОБЪЕКТА ВЗАИМОДЕЙСТВИЯ
	activateConnectObject(numberSO) {

		if(numberSO != null) {

            let static_object = this.closestSO_options[numberSO];

            switch(static_object['connectObject']) {

                //взаимодействие с бочками
                case 'barrel':
                    this.connectWithBarrels(static_object);
                break;

                //взаимодействия с сундуками
                case 'chest':
                    this.connectWithChests(static_object);
                break;
            };

            //очищаем данный объект взаимодействия
            static_object['static_object'].style.filter = 'brightness(100%)';
            delete static_object['connectObject'];
            this.game.hero.hero_options['connect_number'] = null;

            //активируем ближайшие объекты взаимодействия
            this.setStaticPhysicCircle(this.game.hero.hero_position);
        };
	}




	//ВЗАИМОДЕЙСТВИЕ С БОЧКАМИ
	connectWithBarrels(static_object) {

		//рандом нахождение предметов в бочке
	    switch(this.game.Math.randomNumber(0,5)) {

	    	//увеличение жизни
	        case 1:
	            this.game.hero.changeCurrentCharact('hp', this.game.hero.level['current'] * this.game.Math.randomNumber(50, 100));
	        break;

	        //увеличение маны
	        case 2:
	            this.game.hero.changeCurrentCharact('mp', this.game.hero.level['current'] * this.game.Math.randomNumber(10, 20));
	        break;

	        //увеличение жизни и маны
	        case 3:
	            this.game.hero.changeCurrentCharact('hp', this.game.hero.level['current'] * this.game.Math.randomNumber(50, 100));
	            this.game.hero.changeCurrentCharact('mp', this.game.hero.level['current'] * this.game.Math.randomNumber(10, 20));
	        break;

	        //увеличение опыта
	        case 4:
	        	this.game.hero.changeCurrentCharact('ex', this.game.hero.ex['max'] * 0.2);
	        break;

	        //создание мопа
	        case 5:
	        	new Mop ({
	        		hp: 100, 
	        		force: 10, 
	        		speed: 3, 
	        		size: 140, 
	        		x: static_object['x'] - 72, 
	        		y: static_object['y'] - 155
	        	});
	        break;
	    };

	    static_object['static_object'].style.backgroundImage = static_object['imgAfterConnect'];
	}


	//ВЗАИМОДЕЙСТВИЕ С СУНДУКАМИ
	connectWithChests(static_object) {

		switch(this.game.Math.randomNumber(0,2)) {

	        case 1:
	            this.game.hero.changeCurrentCharact('cp', 3);
	        break;

	        case 2:
	            this.game.hero.changeCurrentCharact('sp', 1);
	        break;
	    };

	    static_object['static_object'].style.backgroundImage = static_object['imgAfterConnect'];
	}
}