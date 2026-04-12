<script setup>
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()

// These props allow the App.vue file to talk to the sidebar
defineProps(['activeView'])
defineEmits(['navigate'])
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo-box"></div>
      <h2>Taskitup</h2>
    </div>
    
    <nav class="nav-links">
      <a 
        href="#" 
        class="nav-item" 
        :class="{ active: activeView === 'dashboard' }" 
        @click.prevent="$emit('navigate', 'dashboard')"
      >Dashboard</a>
      
      <a 
        href="#" 
        class="nav-item" 
        :class="{ active: activeView === 'board' }" 
        @click.prevent="$emit('navigate', 'board')"
      >Board</a>
    </nav>

    <div class="spacer"></div>

    <div class="sidebar-footer">
      <div class="theme-toggle">
        <label class="toggle-label">
          <input type="checkbox" v-model="store.isDarkMode" />
          Dark Mode
        </label>
      </div>
      <button class="logout" @click="store.logOut">Log Out</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background-color: var(--card-bg);
  border-right: 1px solid var(--border-color);
  color: var(--text-main);
  height: 100vh;
  position: fixed;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}



.brand h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.nav-item {
  color: var(--text-muted);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: block;
  text-decoration: none;
}

.nav-item:hover {
  background-color: var(--border-color);
  color: var(--text-main);
}

.nav-item.active {
  background-color: var(--accent-color);
  color: #ffffff;
  font-weight: 600;
}

/* Push the logout button and dark mode toggle to the bottom */
/* Push the footer to the bottom */
.spacer {
  flex-grow: 1;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.theme-toggle {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--accent-color);
  cursor: pointer;
}

/* Premium Log Out Button */
.logout {
  background-color: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.logout:hover {
  background-color: var(--border-color);
  color: var(--text-main);
}
</style>