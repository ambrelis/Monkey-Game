<script setup>
import { ref, defineEmits } from 'vue';
import CodeEditor from './CodeEditor.vue';

const gridLevels = [
  [
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 1, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 0, 0],
    [1, 1, 0, 0]
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 0, 0]
  ]
];

const userSolution = ref("");
const challengeCompleted = ref(false); 

const failureGifs = [
  new URL("../assets/level1.gif", import.meta.url).href,
  new URL("../assets/level2.gif", import.meta.url).href,
  new URL("../assets/level3.gif", import.meta.url).href,
  new URL("../assets/level4.gif", import.meta.url).href
];


const failureMessages = [
  "Loupé, va reviser les conditions if et essaie encore ! Voici une petite indication pour t'aider : si le singe est sur une case vide, en position x il peut avancer d'une case vers la droite. Bonne chance !",
  "Oups, ce n'était pas la bonne solution ! Avant de réessayer, résous ce défi : quel est le dernier nombre que ce code affiche ?",
  "Dommage ! Tu as besoin de plus d'entrainement pour les boucles while. Va faire des pompes et réessaie ! Voici une indication : tant que le singe n'est pas arrivé à la case verte, il peut avancer d'une case vers la droite.",
  "Presque ! fais une petite partie de janga, et reviens en forme pour résoudre cet énigme."
];

const singe = ref({ x: 0, y: 1 });
const target = ref({ x: 1, y: 1 });
const level = ref(1);
const attempts = ref(0);
const showModal = ref(false);
const showSuccessModal = ref(false);
const showFinalModal = ref(false);
const message = ref("");
const editorRef = ref(null);
const emit = defineEmits(['nextLevel']);

const levelInstructions = [
  "Utilise une condition if pour faire avancer le singe. Le if est une structure conditionnelle qui permet de prendre des décisions dans ton programme. Si la condition que tu écris est vraie, le code à l'intérieur du if est exécuté. Sinon, rien ne se passe ou une autre condition peut être exécutée.",

  "Utilise une boucle for pour faire avancer le singe. La boucle for permet de répéter un bloc de code un certain nombre de fois. Elle est définie avec trois parties : Initialisation : la valeur de départ (souvent une variable de compteur), condition : tant que cette condition est vraie, le code continue à s'exécuter, incrémentation : après chaque exécution, la variable de compteur est mise à jour (souvent incrémentée).",

  "Utilise une boucle while pour faire avancer le singe. La boucle while permet de répéter un bloc de code tant qu'une condition est vraie. Elle fonctionne de la manière suivante : Condition : avant chaque itération, la condition est vérifiée, exécution : si la condition est vraie, le code à l'intérieur de la boucle est exécuté, répétition : après chaque exécution, la condition est vérifiée à nouveau. La boucle continue tant que la condition reste vraie.",

  "Choisi une solution pour faire avancer le singe. Tu peux utiliser le if, le for ou le while. La solution proposée par défaut est le while. Bon courage"
];
const solutions = [
  ["grid[singe.y][singe.x + 1] === 0",
  "grid[singe.y + 1] && grid[singe.y + 1][singe.x] === 0", 
  "grid[singe.y][singe.x - 1] === 0"],

  ["let i = singe.x; singe.x > 1; singe.x-1","let i = singe.x; singe.x < 1; singe.x+1"],

  ["grid[singe.y][singe.x + 1] === 0","singe.x < 1"],

  ["singe.x < 1","singe.x !== target.x || singe.y !== target.y"]
];

const executeCode = () => {
  if (editorRef.value) {
    editorRef.value.runCode(gridLevels[level.value - 1], singe.value);
    if (singe.value.x === target.value.x && singe.value.y === target.value.y) {
      message.value = "🎉 Bravo ! Le singe est bien arrivé.";
      showSuccessModal.value = level.value < 4;
      showFinalModal.value = level.value === 4;
    } else {
      attempts.value += 1;
      message.value = "❌ Essaie encore !";
      if (attempts.value === 2) {
        showModal.value = true;
      }
    }
  }
};

const validateChallenge = () => {
  const correctAnswer = `10`; 
  if (userSolution.value.trim() === correctAnswer.trim()) {
    challengeCompleted.value = true;
    alert("✅ Bien joué ! Tu as réussi. Réessaie maintenant !");
    showModal.value = true;
  } else {
    alert("❌ Ce n'est pas encore ça, réessaie !");
  }
};


const nextLevel = () => {
  if (level.value < 4) {
    level.value += 1;
    singe.value = { x: 0, y: 1 };
    message.value = "";
    attempts.value = 0;
    showSuccessModal.value = false;

    emit("updateLevel", level.value);
  }
};

const retryLevel = () => {
  singe.value = { x: 0, y: 1 };
  attempts.value = 0;
  message.value = "";
  showModal.value = false; 
};

</script>

<template>
  <div class="grid-container">
    <h2>Niveau {{ level }} : {{ levelInstructions[level - 1] }}</h2>
    <div class="grid">
      <div v-for="(row, y) in gridLevels[level - 1]" :key="y" class="row">
        <div v-for="(cell, x) in row" :key="x" class="cell" :class="{ wall: cell === 1, singe: singe.x === x && singe.y === y, target: target.x === x && target.y === y }">
          <span v-if="singe.x === x && singe.y === y">🐒</span>
        </div>
      </div>
    </div>
    <h3>Solutions possibles :</h3>
    <div class="solutions-container">
      <div v-for="(solution, index) in solutions[level - 1]" :key="index" class="solution-card">
        <p class="solution-text">{{ solution }}</p>
      </div>
    </div>


    <button @click="executeCode">Exécuter</button>
    <p>{{ message }}</p>
<CodeEditor ref="editorRef" @updateLevel="level = $event" />
  </div>

  <div v-if="showModal" class="modal">
  <div class="modal-content">
    <span class="close" @click="showModal = false">&times;</span>
      <p>{{ failureMessages[level - 1] }}</p>
      <img :src="failureGifs[level - 1]" alt="Échec" style="max-width: 40%; height: auto; margin-top: 20px; margin-bottom: 40px;">
    <div v-if="level==2 && !challengeCompleted">
      <pre class="code-challenge">for (let i = 1; i < 10; i--) { 
   console.log(i);
}</pre>
      <textarea v-model="userSolution" placeholder="écrit la réponse ici..." class="code-input"></textarea>
      <button @click="validateChallenge">Valider ma réponse</button>
      
    </div>
    <button v-if="challengeCompleted" @click="retryLevel">Réessayer le niveau</button>
  </div>
</div>


  <div v-if="showSuccessModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showSuccessModal = false">&times;</span>
      <p>🎉 Bravo ! Tu as terminé ce niveau.</p>
      <button @click="nextLevel">Passer au niveau suivant</button>
    </div>
  </div>
  
  <div v-if="showFinalModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showFinalModal = false">&times;</span>
      <p>🎉 Félicitations ! Tu as terminé le dernier niveau !</p>
      <img src="../assets/final-level.gif" alt="">
    </div>
  </div>
 </template>

<style scoped>
.code-challenge {
  background: #282c34;
  color: #61dafb;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  text-align: left;
  white-space: pre-wrap;
}

.code-input {
  width: 100%;
  height: 80px;
  padding: 10px;
  font-family: monospace;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  color: black;
}

.grid {
  display: grid;
  gap: 4px;
  margin-bottom: 10px;
}

.row {
  display: flex;
}

.cell {
  width: 70px;
  height: 70px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.wall {
  background-color: #E0745D  ;
}

.target {
  background-color: #7EB77F  ;
}

button {
  margin: 10px;
  padding: 8px;
  cursor: pointer;
  background-color: #D64550 ;

}


p {
  font-weight: bold;
}

.solutions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
}

.solution-card {
  background-color: #f7f7f7;
  padding: 15px;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.solution-card:hover {
  transform: translateY(-5px);
}

.solution-text {
  font-size: 16px;
  font-weight: normal;
  color: #333;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: black;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal-content img {
  max-width: 60%;
  height: auto;
  margin-bottom: 20px;
}

.modal-content button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #D64550;
  color: #F4ECE1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #B63A42;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}

</style>
