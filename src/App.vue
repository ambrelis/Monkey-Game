<script setup>
import RobotGrid from './components/RobotGrid.vue';
import jungleMusic from '../src/assets/intheair.mp3';
import { ref, onMounted } from 'vue';

const isMuted = ref(false);
const audioRef = ref(null);

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0.5;
    audioRef.value.play().catch((err) => {
      console.warn("L'audio ne peut pas être joué automatiquement :", err);
    });
  }
});


const toggleMute = () => {
  if (audioRef.value && audioRef.value instanceof HTMLAudioElement) {
    isMuted.value = !isMuted.value;
    audioRef.value.muted = isMuted.value;
  }
};

 </script>

<template class="container">
  <div  style="background-color: rgba(247, 242, 242, 0.6)"  >
  <h1 >Monkey Game</h1>
  <h2 style="color: black">Complète le code pour déplacer le singe </h2>
  
  <p style="text-align: center; ">Les cases rouges sont des obstacles. La case verte correspond à l'endroit ou le singe doit se rendre. </p>

  <div class="audio-container">
    <audio ref="audioRef" autoplay loop>
      <source :src="jungleMusic" type="audio/mp3">
      Votre navigateur ne prend pas en charge l'élément audio.
    </audio>
    
    <button style="background-color: white;" @click="toggleMute" class="mute-button">
      <span v-if="isMuted">🔇</span>
      <span v-else>🎵</span>
    </button>
  </div>
  <RobotGrid />
</div>
</template>

<style scoped> 
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: black;
}
p {
  text-align: left;
  margin-bottom: 20px;
  color: black;

}
.audio-container {
  position: fixed;
  top: 10px;
  right: 10px;
}

.mute-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
