// Central data for the 7 levels — bilingual (English + Spanish) with photos.

// Real photos (image bank) that show what each game is about.
export const LEVEL_IMAGES = {
  alphabet: "https://images.pexels.com/photos/4116707/pexels-photo-4116707.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  numbers:  "https://images.pexels.com/photos/311268/pexels-photo-311268.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  colors:   "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  animals:  "https://images.unsplash.com/photo-1620673399859-d7e13565737d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  family:   "https://images.pexels.com/photos/8317785/pexels-photo-8317785.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  food:     "https://images.unsplash.com/photo-1610832958506-aa56368176cf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  quiz:     "https://images.pexels.com/photos/6125928/pexels-photo-6125928.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export const LEVELS = [
  { id: 1, key: "alphabet", title: "Alphabet", titleEs: "Alfabeto", subtitle: "Letras y sonidos",
    desc: "Match each letter with the word that starts with it.", descEs: "Empareja cada letra con la palabra que empieza con ella.", icon: "🔤" },
  { id: 2, key: "numbers",  title: "Numbers", titleEs: "Números", subtitle: "Números 1–20",
    desc: "Match each number with its name in English.", descEs: "Une cada número con su nombre en inglés.", icon: "🔢" },
  { id: 3, key: "colors",   title: "Colors", titleEs: "Colores", subtitle: "Colores básicos",
    desc: "Pick the color that matches the word.", descEs: "Selecciona el color que corresponde a la palabra.", icon: "🎨" },
  { id: 4, key: "animals",  title: "Animals", titleEs: "Animales", subtitle: "Memorama",
    desc: "Find the pairs between the animal and its name.", descEs: "Encuentra las parejas entre el animal y su nombre.", icon: "🐾" },
  { id: 5, key: "family",   title: "Family", titleEs: "La familia", subtitle: "La familia",
    desc: "Match the family members with their word in English.", descEs: "Empareja los miembros de la familia con su palabra en inglés.", icon: "👨‍👩‍👧" },
  { id: 6, key: "food",     title: "Food", titleEs: "Comida", subtitle: "Comida",
    desc: "Choose the correct word for each food.", descEs: "Elige la palabra correcta para cada comida.", icon: "🍎" },
  { id: 7, key: "quiz",     title: "Final Quiz", titleEs: "Reto Final", subtitle: "Evaluación",
    desc: "General review with questions from every topic.", descEs: "Repaso general con preguntas de todos los temas.", icon: "🏆" },
];

/* ---------- Level 1 · Alphabet (A–Z) ---------- */
export const ALPHABET_PAIRS = [
  { letter: "A", word: "Apple",     es: "manzana",  emoji: "🍎" },
  { letter: "B", word: "Ball",      es: "pelota",   emoji: "⚽" },
  { letter: "C", word: "Cat",       es: "gato",     emoji: "🐱" },
  { letter: "D", word: "Dog",       es: "perro",    emoji: "🐶" },
  { letter: "E", word: "Elephant",  es: "elefante", emoji: "🐘" },
  { letter: "F", word: "Fish",      es: "pez",      emoji: "🐟" },
  { letter: "G", word: "Giraffe",   es: "jirafa",   emoji: "🦒" },
  { letter: "H", word: "House",     es: "casa",     emoji: "🏠" },
  { letter: "I", word: "Ice cream", es: "helado",   emoji: "🍦" },
  { letter: "J", word: "Juice",     es: "jugo",     emoji: "🧃" },
  { letter: "K", word: "Kite",      es: "cometa",   emoji: "🪁" },
  { letter: "L", word: "Lion",      es: "león",     emoji: "🦁" },
  { letter: "M", word: "Moon",      es: "luna",     emoji: "🌙" },
  { letter: "N", word: "Nest",      es: "nido",     emoji: "🪺" },
  { letter: "O", word: "Orange",    es: "naranja",  emoji: "🍊" },
  { letter: "P", word: "Pizza",     es: "pizza",    emoji: "🍕" },
  { letter: "Q", word: "Queen",     es: "reina",    emoji: "👑" },
  { letter: "R", word: "Rainbow",   es: "arcoíris", emoji: "🌈" },
  { letter: "S", word: "Sun",       es: "sol",      emoji: "☀️" },
  { letter: "T", word: "Tree",      es: "árbol",    emoji: "🌳" },
  { letter: "U", word: "Umbrella",  es: "paraguas", emoji: "☂️" },
  { letter: "V", word: "Violin",    es: "violín",   emoji: "🎻" },
  { letter: "W", word: "Watch",     es: "reloj",    emoji: "⌚" },
  { letter: "X", word: "Xylophone", es: "xilófono", emoji: "🎼" },
  { letter: "Y", word: "Yo-yo",     es: "yoyo",     emoji: "🪀" },
  { letter: "Z", word: "Zebra",     es: "cebra",    emoji: "🦓" },
];

/* ---------- Level 2 · Numbers (1–20) ---------- */
export const NUMBER_PAIRS = [
  { number: "1",  word: "One",       es: "uno" },
  { number: "2",  word: "Two",       es: "dos" },
  { number: "3",  word: "Three",     es: "tres" },
  { number: "4",  word: "Four",      es: "cuatro" },
  { number: "5",  word: "Five",      es: "cinco" },
  { number: "6",  word: "Six",       es: "seis" },
  { number: "7",  word: "Seven",     es: "siete" },
  { number: "8",  word: "Eight",     es: "ocho" },
  { number: "9",  word: "Nine",      es: "nueve" },
  { number: "10", word: "Ten",       es: "diez" },
  { number: "11", word: "Eleven",    es: "once" },
  { number: "12", word: "Twelve",    es: "doce" },
  { number: "13", word: "Thirteen",  es: "trece" },
  { number: "14", word: "Fourteen",  es: "catorce" },
  { number: "15", word: "Fifteen",   es: "quince" },
  { number: "16", word: "Sixteen",   es: "dieciséis" },
  { number: "17", word: "Seventeen", es: "diecisiete" },
  { number: "18", word: "Eighteen",  es: "dieciocho" },
  { number: "19", word: "Nineteen",  es: "diecinueve" },
  { number: "20", word: "Twenty",    es: "veinte" },
];

/* ---------- Level 3 · Colors ---------- */
export const COLORS_DATA = [
  { word: "Red",       es: "rojo",      hex: "#c0392b" },
  { word: "Blue",      es: "azul",      hex: "#2E86C1" },
  { word: "Yellow",    es: "amarillo",  hex: "#F1C40F" },
  { word: "Green",     es: "verde",     hex: "#27AE60" },
  { word: "Orange",    es: "naranja",   hex: "#E67E22" },
  { word: "Purple",    es: "morado",    hex: "#8E44AD" },
  { word: "Pink",      es: "rosa",      hex: "#F06292" },
  { word: "Brown",     es: "café",      hex: "#795548" },
  { word: "Black",     es: "negro",     hex: "#2C3E50" },
  { word: "White",     es: "blanco",    hex: "#ECF0F1" },
  { word: "Gray",      es: "gris",      hex: "#95A5A6" },
  { word: "Turquoise", es: "turquesa",  hex: "#1ABC9C" },
];

/* ---------- Level 4 · Animals memory ---------- */
export const ANIMAL_PAIRS = [
  { emoji: "🐱", word: "Cat",      es: "gato" },
  { emoji: "🐶", word: "Dog",      es: "perro" },
  { emoji: "🦁", word: "Lion",     es: "león" },
  { emoji: "🐘", word: "Elephant", es: "elefante" },
  { emoji: "🐦", word: "Bird",     es: "pájaro" },
  { emoji: "🐟", word: "Fish",     es: "pez" },
  { emoji: "🐮", word: "Cow",      es: "vaca" },
  { emoji: "🐷", word: "Pig",      es: "cerdo" },
  { emoji: "🐴", word: "Horse",    es: "caballo" },
  { emoji: "🐵", word: "Monkey",   es: "mono" },
  { emoji: "🐸", word: "Frog",     es: "rana" },
  { emoji: "🐢", word: "Turtle",   es: "tortuga" },
];

/* ---------- Level 5 · Family ---------- */
export const FAMILY_PAIRS = [
  { emoji: "👨", word: "Father",  es: "papá" },
  { emoji: "👩", word: "Mother",  es: "mamá" },
  { emoji: "👦", word: "Brother", es: "hermano" },
  { emoji: "👧", word: "Sister",  es: "hermana" },
  { emoji: "👴", word: "Grandpa", es: "abuelo" },
  { emoji: "👵", word: "Grandma", es: "abuela" },
  { emoji: "👶", word: "Baby",    es: "bebé" },
  { emoji: "🧒", word: "Child",   es: "niño" },
  { emoji: "👨‍🦳", word: "Uncle",  es: "tío" },
  { emoji: "👩‍🦰", word: "Aunt",   es: "tía" },
  { emoji: "👨‍👩‍👧‍👦", word: "Family", es: "familia" },
  { emoji: "🐶", word: "Pet",     es: "mascota" },
];

/* ---------- Level 6 · Food (multiple choice) ---------- */
// The emoji is the visual clue; the child chooses the English word.
export const FOOD_QUESTIONS = [
  { emoji: "🍎", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Apple", "Bread", "Milk", "Egg"],        answer: "Apple",      answerEs: "manzana" },
  { emoji: "🍞", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Rice", "Bread", "Meat", "Fish"],        answer: "Bread",      answerEs: "pan" },
  { emoji: "🥛", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Water", "Juice", "Milk", "Tea"],        answer: "Milk",       answerEs: "leche" },
  { emoji: "🥚", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Egg", "Cheese", "Butter", "Chicken"],   answer: "Egg",        answerEs: "huevo" },
  { emoji: "🍚", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Bread", "Pasta", "Rice", "Corn"],       answer: "Rice",       answerEs: "arroz" },
  { emoji: "🍌", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Grape", "Banana", "Orange", "Lemon"],   answer: "Banana",     answerEs: "plátano" },
  { emoji: "🍕", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Pizza", "Salad", "Soup", "Cake"],       answer: "Pizza",      answerEs: "pizza" },
  { emoji: "🧀", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Butter", "Yogurt", "Cheese", "Ham"],    answer: "Cheese",     answerEs: "queso" },
  { emoji: "🍊", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Orange", "Apple", "Lemon", "Peach"],    answer: "Orange",     answerEs: "naranja" },
  { emoji: "🍇", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Cherry", "Grapes", "Plum", "Berry"],    answer: "Grapes",     answerEs: "uvas" },
  { emoji: "🍗", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Fish", "Beef", "Chicken", "Pork"],      answer: "Chicken",    answerEs: "pollo" },
  { emoji: "🐟", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Fish", "Meat", "Egg", "Crab"],          answer: "Fish",       answerEs: "pescado" },
  { emoji: "🥕", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Potato", "Carrot", "Onion", "Pepper"],  answer: "Carrot",     answerEs: "zanahoria" },
  { emoji: "🍅", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Apple", "Tomato", "Cherry", "Pepper"],  answer: "Tomato",     answerEs: "tomate" },
  { emoji: "🍓", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Cherry", "Berry", "Strawberry", "Plum"],answer: "Strawberry", answerEs: "fresa" },
  { emoji: "🍪", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Cake", "Cookie", "Bread", "Candy"],     answer: "Cookie",     answerEs: "galleta" },
  { emoji: "🍫", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Candy", "Chocolate", "Cookie", "Cake"], answer: "Chocolate",  answerEs: "chocolate" },
  { emoji: "🥤", q: "What food is this?", qEs: "¿Qué comida es esta?", options: ["Milk", "Juice", "Soda", "Coffee"],      answer: "Soda",       answerEs: "gaseosa" },
];

/* ---------- Level 7 · Final Quiz ---------- */
export const FINAL_QUIZ = [
  { emoji: "🐱", q: 'How do you say "gato" in English?', qEs: 'Cómo se dice "gato" en inglés', options: ["Cat", "Dog", "Bird", "Fish"],        answer: "Cat" },
  { emoji: "☀️", q: "What color is the sun?",            qEs: "¿De qué color es el sol?",    options: ["Blue", "Yellow", "Purple", "Black"],  answer: "Yellow" },
  { emoji: "3️⃣", q: "How do you write the number 3?",     qEs: "¿Cómo se escribe el número 3?", options: ["Two", "Three", "Four", "Five"],     answer: "Three" },
  { emoji: "🐘", q: 'Which word means "elefante"?',      qEs: 'Qué palabra significa "elefante"', options: ["Lion", "Mouse", "Elephant", "Frog"], answer: "Elephant" },
  { emoji: "🌳", q: "What color are the tree leaves?",   qEs: "¿De qué color son las hojas del árbol?", options: ["Red", "Green", "Orange", "Grey"], answer: "Green" },
  { emoji: "🐦", q: 'Which animal can fly and says "tweet"?', qEs: 'Qué animal vuela y hace "pío"', options: ["Fish", "Bird", "Dog", "Cat"], answer: "Bird" },
  { emoji: "5️⃣", q: "How do you write the number 5?",     qEs: "¿Cómo se escribe el número 5?", options: ["Six", "Five", "Seven", "One"],      answer: "Five" },
  { emoji: "🦁", q: 'Which word means "león"?',          qEs: 'Qué palabra significa "león"',  options: ["Lion", "Tiger", "Bear", "Wolf"],     answer: "Lion" },
  { emoji: "👩", q: 'Which word means "mamá"?',          qEs: 'Qué palabra significa "mamá"',  options: ["Sister", "Mother", "Aunt", "Grandma"], answer: "Mother" },
  { emoji: "🍎", q: 'Which word means "manzana"?',       qEs: 'Qué palabra significa "manzana"', options: ["Apple", "Egg", "Milk", "Bread"],    answer: "Apple" },
  { emoji: "🐶", q: 'How do you say "perro" in English?', qEs: 'Cómo se dice "perro" en inglés', options: ["Dog", "Cat", "Cow", "Pig"],         answer: "Dog" },
  { emoji: "🔴", q: 'What color is this?',                qEs: "¿De qué color es esto?",       options: ["Blue", "Green", "Red", "Pink"],       answer: "Red" },
  { emoji: "🔟", q: "How do you write the number 10?",    qEs: "¿Cómo se escribe el número 10?", options: ["Ten", "Nine", "Twelve", "Twenty"],   answer: "Ten" },
  { emoji: "👨", q: 'Which word means "papá"?',          qEs: 'Qué palabra significa "papá"',  options: ["Brother", "Father", "Uncle", "Son"], answer: "Father" },
  { emoji: "🍌", q: 'Which word means "plátano"?',       qEs: 'Qué palabra significa "plátano"', options: ["Apple", "Banana", "Orange", "Grape"], answer: "Banana" },
  { emoji: "🐟", q: 'How do you say "pez" in English?',   qEs: 'Cómo se dice "pez" en inglés',  options: ["Frog", "Fish", "Bird", "Cow"],       answer: "Fish" },
  { emoji: "🔵", q: "What color is this?",                qEs: "¿De qué color es esto?",       options: ["Blue", "Green", "Yellow", "Brown"],   answer: "Blue" },
  { emoji: "🥛", q: 'Which word means "leche"?',         qEs: 'Qué palabra significa "leche"', options: ["Water", "Milk", "Juice", "Bread"],   answer: "Milk" },
  { emoji: "👵", q: 'Which word means "abuela"?',        qEs: 'Qué palabra significa "abuela"', options: ["Mother", "Sister", "Grandma", "Aunt"], answer: "Grandma" },
  { emoji: "8️⃣", q: "How do you write the number 8?",     qEs: "¿Cómo se escribe el número 8?", options: ["Six", "Seven", "Eight", "Nine"],     answer: "Eight" },
];

export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function calcStars(score, max) {
  const pct = score / max;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  if (pct >= 0.3) return 1;
  return 0;
}
