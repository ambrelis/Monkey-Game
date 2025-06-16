<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import * as monaco from 'monaco-editor';

const editorContainer = ref(null);
let editorInstance = null;

const initialCodeByLevel = [
  `if ( /* Complète ici */ ) {
    singe.x += 1;
  }`,

  `for (/* Complète ici */) {
    singe.x += 1;
  }`,

  `while ( /* Complète ici */ ) {
    singe.x += 1;
  }`,

  `while (/* Complète ici */) {
    if (grid[singe.y][singe.x + 1] === 0) {
      singe.x += 1;
    } else if (grid[singe.y + 1] && grid[singe.y + 1][singe.x] === 0) {
      singe.y += 1;
    }
  }`
];

const level = ref(1);
const code = ref(initialCodeByLevel[0]);

watch(level, async (newLevel) => {
  code.value = initialCodeByLevel[newLevel - 1] || initialCodeByLevel[0];

  await nextTick();

  if (editorInstance) {
    editorInstance.setValue(code.value);
  }
});

const resizeEditor = () => {
  if (editorInstance) {
    editorInstance.layout();
  }
};

onMounted(() => {
  if (editorContainer.value) {
    editorInstance = monaco.editor.create(editorContainer.value, {
      value: code.value,
      language: 'javascript',
      theme: 'vs-dark',
    });

    editorInstance.onDidChangeModelContent(() => {
      code.value = editorInstance.getValue();
    });

    window.addEventListener("resize", resizeEditor);
  }
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose();
  }
  window.removeEventListener("resize", resizeEditor);
});

const runCode = (grid, singe) => {
  try {
    new Function('grid', 'singe', code.value)(grid, singe);
  } catch (error) {
    console.error("Erreur dans le code :", error);
  }
};

defineExpose({ runCode });
</script>

<template>
  <div>
    <label for="level">Choisir un niveau :</label>
    <select id="level" v-model="level">
      <option :value="1">Niveau 1</option>
      <option :value="2">Niveau 2</option>
      <option :value="3">Niveau 3</option>
      <option :value="4">Niveau 4</option>
    </select>

    <div class="editor-container">
      <div ref="editorContainer" class="editor"></div>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  width: 800px;
  height: 300px; 
  max-height: 500px; 
  border: 1px solid #ccc;
  overflow: hidden;
}

.editor {
  width: 800px;
  height: 100%;
  font-family: monospace;
  text-align: left;
}
</style>
