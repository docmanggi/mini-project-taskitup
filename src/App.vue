<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from './stores/taskStore'
import Sidebar from './components/Sidebar.vue'
import Board from './views/Board.vue'
import Dashboard from './views/Dashboard.vue'
import Auth from './views/Auth.vue'

const store = useTaskStore()
const currentView = ref('board')

// Check if the user is already logged in when the app starts
onMounted(() => {
  store.checkAuth()
})
</script>

<template>
  <Auth v-if="!store.user" />
  
  <div v-else class="app-wrapper">
    <Sidebar :activeView="currentView" @navigate="currentView = $event" />
    <main class="main-view">
      <Dashboard v-if="currentView === 'dashboard'" />
      <Board v-if="currentView === 'board'" />
    </main>
  </div>
</template>

<style>
:root {
  --bg-color: #f4f5f7;
  --card-bg: #ffffff;
  --text-main: #111111;
  --text-muted: #666666;
  --border-color: #e2e2e2;
  
  --accent-color: #673ab7; 
  --accent-hover: #512da8;
  --accent-muted: #f2edf8;
  --radius: 12px;
}

body.dark-theme {
  --bg-color: #0a0a0a;
  --card-bg: #171717;
  --text-main: #eeeeee;
  --text-muted: #999999;
  --border-color: #2e2e2e;
  
  --accent-color: #9575cd; 
  --accent-hover: #b39ddb;
  --accent-muted: #241a3a;
}

body {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  margin: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 100vh;
}

.app-wrapper { 
  display: flex; 
}

.main-view { 
  margin-left: 250px; 
  flex-grow: 1; 
  width: calc(100% - 250px);
}


input[type="text"], 
input[type="email"], 
input[type="password"], 
input[type="date"],
textarea {
  background-color: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-muted);
}

::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

body.dark-theme ::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
}
</style>