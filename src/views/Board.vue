<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from '../components/TaskCard.vue'
import TaskModal from '../components/TaskModal.vue'
import draggable from 'vuedraggable'


const store = useTaskStore()
const showModal = ref(false)
const taskToEdit = ref(null)

function openModal(task = null) {
  taskToEdit.value = task
  showModal.value = true
}
onMounted(() => {
  store.fetchTasks()
})

/* Vue Draggable needs to modify arrays when you move items. 
  Because our store uses read-only computed arrays, we create local writable 
  versions here to prevent Vue from throwing console warnings.
*/
const todoList = computed({ get: () => store.todoTasks, set: () => {} })
const inProgressList = computed({ get: () => store.inProgressTasks, set: () => {} })
const completedList = computed({ get: () => store.completedTasks, set: () => {} })

// When a card is dropped into a new column, tell the database to update its status
function onDragChange(event, newStatus) {
  if (event.added) {
    const taskId = event.added.element.id
    store.updateTask(taskId, { status: newStatus })
  }
}
</script>

<template>
  <div class="board-container">
    
    <header class="board-header">
      <div class="header-title">
        <h1>Board</h1>
        <span v-if="store.isLoading" class="loader"></span>
      </div>
      
      <div class="header-controls">
        <input 
          type="text" 
          v-model="store.searchQuery" 
          placeholder="Search tasks..." 
          class="search-bar"
        />
        <div class="calendar-filter">
  <label for="board-date">Filter by Date:</label>
  <input 
    type="date" 
    id="board-date"
    v-model="store.selectedDateFilter" 
    class="date-input"
  />
  <button v-if="store.selectedDateFilter" @click="store.selectedDateFilter = ''" class="clear-btn">Clear</button>
</div>
      </div>
    </header>

    <div class="board-columns">
      
      <div class="column">
        <div class="col-header">
          <h3>To Do</h3>
          <button class="add-btn" @click="openModal(null)">+</button>
        </div>
        
        <draggable 
          class="draggable-zone"
          v-model="todoList" 
          group="tasks" 
          item-key="id"
          @change="onDragChange($event, 'todo')"
        >
          <template #item="{ element }">
            <TaskCard :key="element.id" :task="element" @edit="openModal" />
          </template>
        </draggable>
      </div>

      <div class="column">
        <div class="col-header">
          <h3>In Progress</h3>
        </div>
        
        <draggable 
          class="draggable-zone"
          v-model="inProgressList" 
          group="tasks" 
          item-key="id"
          @change="onDragChange($event, 'in-progress')"
        >
          <template #item="{ element }">
            <TaskCard :key="element.id" :task="element" @edit="openModal"/>
          </template>
        </draggable>
      </div>

      <div class="column">
        <div class="col-header">
          <h3>Completed</h3>
        </div>
        
        <draggable 
          class="draggable-zone"
          v-model="completedList" 
          group="tasks" 
          item-key="id"
          @change="onDragChange($event, 'completed')"
        >
          <template #item="{ element }">
            <TaskCard :key="element.id" :task="element" @edit="openModal"/>
          </template>
        </draggable>
      </div>

    </div>

    <TaskModal :isOpen="showModal" :editTaskData="taskToEdit" @close="showModal = false" />
    
  </div>
</template>

<style scoped>
.board-wrapper {
  padding: 40px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.board-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--text-main);
}

.board-columns {
  display: flex;
  flex-direction: row;
  gap: 24px; /* Slightly wider gap between columns */
  align-items: flex-start;
  width: 100%;
}

.column {
  flex: 1; 
  min-width: 300px; /* Stops columns from squishing on small screens */
  max-width: 400px; /* Stops columns from stretching too wide on large screens */
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.col-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--accent-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px; /* Forces every header to be exactly the same height */
  box-sizing: border-box; /* Ensures padding doesn't break the height limit */
}

.col-header h3 {
  margin: 0;
  color: var(--accent-color);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.draggable-zone { 
  padding: 16px; 
  flex-grow: 1;
  min-height: 150px;
  /* This forces a strict 16px gap between every card no matter what */
  display: flex;
  flex-direction: column;
  gap: 16px; 
}
.header-controls {
  display: flex;
  align-items: center;
  gap: 20px; 
}

.calendar-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}
.add-btn {
  background-color: var(--card-bg);
  color: var(--accent-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background-color: var(--accent-color);
  color: #fff;
  border-color: var(--accent-color);
  transform: scale(1.05);
}
/* Prevent the filter text from stacking on top of itself */
.calendar-filter label {
  white-space: nowrap;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Stop the search bar from shrinking too much when zoomed out */
.search-bar {
  min-width: 250px;
}
.board-container {
  padding: 40px;
}
</style>