// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (fruits) => {
  fruitsList.innerHTML = '';
  for (let i = 0; i < fruits.length; i++) {
    let newLi = document.createElement('li');
    if (fruits[i].color === 'фиолетовый') {
      newLi.classList.add('fruit_violet');
    } else if (fruits[i].color === 'зеленый') {
      newLi.classList.add('fruit_green');
    } else if (fruits[i].color === 'розово-красный') {
      newLi.classList.add('fruit_carmazin');
    } else if (fruits[i].color === 'желтый') {
      newLi.classList.add('fruit_yellow');
    } else if (fruits[i].color === 'светло-коричневый') {
      newLi.classList.add('fruit_lightbrown');
    } else (
      newLi.classList.add('fruit_new') // Для новых фруктов, цветов много, я решил сделать 1:)
    )

    newLi.classList.add('fruit__item');
    newLi.style.background = `${fruits[i].color}`;
    newLi.innerHTML = `<div class="fruit__info">
      Index: ${i}
      <br>
      Kind: ${fruits[i].kind}
      <br>
      Color: ${fruits[i].color}
      <br>
      Weight (Кг): ${fruits[i].weight}
    </div>`;
    fruitsList.appendChild(newLi);
  }
};

display(fruits);


/*** ПЕРЕМЕШИВАНИЕ ***/

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleFruits = () => {
  let result = [];
  const origArr = JSON.stringify(fruits);
  while (fruits.length > 0) {
    let randomFruit = fruits[getRandomInt(0, fruits.length - 1)];
    fruits.splice(fruits.indexOf(randomFruit), 1)[0];
    result.push(randomFruit);
  }

  fruits = result;

  if (JSON.stringify(fruits) === origArr) {
    alert("Порядок не изменился! Перемешайте ещё раз!");
  }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const minWeight = document.querySelector('.minweight__input').value; // значение поля min weight
  const maxWeight = document.querySelector('.maxweight__input').value; // значение поля max weight
  const filteredFruits = fruits.filter(fruit => {
  const fruitWeight = fruit.weight;
    if (minWeight === '' || maxWeight === '') {
      return true; // если поля веса не заполнены, оставляем фрукты в результате
    } else {
      return fruitWeight >= minWeight && fruitWeight <= maxWeight;
    }
  });

  display(filteredFruits);
};

// Добавляем обработчик события для кнопки "Фильтровать"
filterButton.addEventListener('click', filterFruits);

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort';
let sortTime = '-';

const comparationColor = (a, b) => {
    const priority = ["желтый", "светло-коричневый", "зеленый", "розово-красный", "фиолетовый"]
    //return priority1 > priority2;
    return priority.indexOf(a.color) - priority.indexOf(b.color);
};

const sortAPI = {
  bubbleSort(arr, comparationColor) {
    let n = arr.length;
  for (let i = 0; i < n-1; i++) {
    for (let j = 0; j < n-i-1; j++) {
      if (comparationColor(arr[j], arr[j+1]) > 0) {
        // меняем элементы местами
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
  return arr;
  },
  
  quickSort(arr, comparationColor) {
    // Самое сложное
    // Сначала объявляем функцию обмена элементов
    function swap(items, firstIndex, secondIndex) {
      const tmp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = tmp;
    };
    // Затем добавляем фунцию разделителя
    function partition(items, firstIndex, lastIndex, comparationColor) {
      const pivot = items[firstIndex];
      let left = firstIndex;
      let right = lastIndex;
      while (left < right) {
        while (comparationColor(items[left], pivot) < 0) {
          left++;
        }
        while (comparationColor(items[right], pivot) > 0) {
          right--;
        }
        if (left < right) {
          swap(items, left, right);
          left++;
          right--;
        }
      }
      swap(items, firstIndex, right);
      return right;
    };
    // Ну и наконец запускаем алгоритм быстрой сортировки
    function quickSort(items, firstIndex, lastIndex, comparationColor) {
      if (firstIndex < lastIndex) {
        const pivotIndex = partition(items, firstIndex, lastIndex, comparationColor);
        quickSort(items, firstIndex, pivotIndex-1, comparationColor);
        quickSort(items, pivotIndex+1, lastIndex, comparationColor);
      }
      return items;
    };
    return quickSort(arr, 0, arr.length-1, comparationColor);
  },
    // Всю голову сломал над этой функцией!
  startSort(sort, arr, comparationColor) {
    const start = new Date().getTime();
    sort(arr, comparationColor);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  if (sortKind == 'bubbleSort') {
    display(sortAPI.bubbleSort(fruits, comparationColor));
    sortTimeLabel.textContent = sortTime;
  } else if (sortKind == 'quickSort') 
  { 
    display(sortAPI.quickSort(fruits, comparationColor));
    sortTimeLabel.textContent = sortTime;
  };
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  let kind = kindInput.value; // получаем название вида фрукта из поля ввода
  let color = colorInput.value; // получаем цвет фрукта из поля ввода
  let weight = weightInput.value; // получаем вес фрукта из поля ввода

  if (kind === "" || color === "" || weight === "") { // проверяем, все ли поля были заполнены
    alert("Пожалуйста, заполните все поля"); // если не все поля заполнены, выводим предупреждение
  } else {
    let newFruit = { // создаем новый объект с данными о фрукте
      kind: kind,
      color: color,
      weight: weight
    };
    fruits.push(newFruit); // добавляем новый фрукт в массив fruits
    display(fruits); // вызываем функцию для отображения обновленного списка фруктов
  }
});