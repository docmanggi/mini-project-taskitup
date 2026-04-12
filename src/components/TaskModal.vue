<script setup>
import { ref, watch } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps(['isOpen', 'editTaskData'])
const emit = defineEmits(['close'])
const store = useTaskStore()

const title = ref('')
const description = ref('')
const deadline = ref('')
const subtasks = ref([])

// Calculate today's date safely for the calendar lock
const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')
const day = String(today.getDate()).padStart(2, '0')
const minDate = `${year}-${month}-${day}`

watch(() => props.editTaskData, (newData) => {
  if (newData) {
    title.value = newData.title
    description.value = newData.description
    deadline.value = newData.deadline || ''
    subtasks.value = newData.subtasks ? JSON.parse(JSON.stringify(newData.subtasks)) : []
  } else {
    resetForm()
  }
}, { immediate: true })

function addSubtask() {
  subtasks.value.push({ id: Date.now(), text: '', isDone: false })
}

function removeSubtask(id) {
  subtasks.value = subtasks.value.filter(st => st.id !== id)
}

function handleDelete() {
  const isConfirmed = confirm("Are you sure you want to delete this task? This cannot be undone.")
  if (isConfirmed) {
    store.removeTask(props.editTaskData.id)
    closeModal()
  }
}

function submitTask() {
  if (!title.value.trim()) return

 
  let currentStatus = props.editTaskData ? props.editTaskData.status : 'todo'


  if (subtasks.value.length > 0) {

    const allCompleted = subtasks.value.every(st => st.isDone)

    if (allCompleted) {
      currentStatus = 'completed' 
    } else if (currentStatus === 'completed' && !allCompleted) {
      currentStatus = 'in-progress' 
    }
  }

 
  const payload = {
    title: title.value,
    description: description.value,
    deadline: deadline.value,
    subtasks: subtasks.value,
    status: currentStatus 
  }


  if (props.editTaskData) {
    store.updateTask(props.editTaskData.id, payload)
  } else {
    store.addTask(payload)
  }
  
  closeModal()
}

function resetForm() {
  title.value = ''
  description.value = ''
  deadline.value = ''
  subtasks.value = []
}

function closeModal() {
  resetForm()
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ editTaskData ? 'Edit Task' : 'Create New Task' }}</h2>
      <div class="input-group">
        <label>Title</label>
        <input type="text" v-model="title" placeholder="e.g., Design Homepage" class="input-field" />
      </div>
      
      <div class="input-group">
        <label>Description</label>
        <textarea v-model="description" rows="3" placeholder="Add details..." class="input-field"></textarea>
      </div>

      <div class="input-group">
        <div class="subtask-header">
          <label>Checklist</label>
          <button type="button" class="add-sub-btn" @click="addSubtask">+ Add Step</button>
        </div>
        
        <div class="subtask-list">
          <div v-for="st in subtasks" :key="st.id" class="subtask-item">
            <input type="checkbox" v-model="st.isDone" class="checkbox" />
            <input type="text" v-model="st.text" placeholder="What needs to be done?" class="input-field subtask-text" />
            <button type="button" class="del-sub-btn" @click="removeSubtask(st.id)">✕</button>
          </div>
        </div>
      </div>
      
      <div class="input-group">
        <label>Deadline (Optional)</label>
        <input type="date" v-model="deadline" class="input-field" :min="minDate" />
      </div>

      <div class="modal-actions">
        <button 
          v-if="editTaskData" 
          type="button" 
          class="delete-btn" 
          @click="handleDelete"
        >
          Delete Task
        </button>
        
        <div class="right-actions">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="save-btn" @click="submitTask">Save Task</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 450px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-content h2 { margin-top: 0; margin-bottom: 24px; color: #1a202c; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #4a5568; }
.input-field {
  width: 100%; padding: 10px; border: 1px solid #cbd5e0;
  border-radius: 6px; box-sizing: border-box; font-family: inherit;
}
.input-field:focus { outline: none; border-color: #2b6cb0; }


.subtask-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.subtask-header label { margin: 0; }
.add-sub-btn { background: none; border: none; color: var(--accent-color); font-weight: 600; cursor: pointer; }
.subtask-list { display: flex; flex-direction: column; gap: 10px; }
.subtask-item { display: flex; align-items: center; gap: 10px; }
.checkbox { width: 18px; height: 18px; cursor: pointer; }
.subtask-text { flex-grow: 1; padding: 8px; }
.del-sub-btn { background: none; border: none; color: #e53e3e; cursor: pointer; font-size: 1.1rem; }

.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
.btn { padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; border: none; }
.cancel-btn { background: #edf2f7; color: #4a5568; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;}
.save-btn { background: var(--accent-color); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;}
.modal-actions { 
  display: flex; 
  justify-content: space-between; /* Pushes delete to the left, save to the right */
  align-items: center;
  margin-top: 30px; 
}
.right-actions {
  display: flex;
  gap: 12px;
}
.delete-btn {
  background: #fff5f5;
  color: #e53e3e;
  padding: 10px 16px;
  border: 1px solid #feb2b2;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.delete-btn:hover {
  background: #e53e3e;
  color: white;
}
</style>