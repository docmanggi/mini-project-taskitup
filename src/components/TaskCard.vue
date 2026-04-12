<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])


const progress = computed(() => {
  if (!props.task.subtasks || props.task.subtasks.length === 0) return 0
  const completed = props.task.subtasks.filter(st => st.isDone).length
  return Math.round((completed / props.task.subtasks.length) * 100)
})


const deadlineStatus = computed(() => {
  if (!props.task.deadline) return 'no-deadline'
  

  if (props.task.status === 'completed') return 'completed-task'


  const today = new Date()
  today.setHours(0, 0, 0, 0)


  const taskDate = new Date(props.task.deadline)
  taskDate.setHours(0, 0, 0, 0)

 
  const diffTime = taskDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays <= 2) return 'due-soon'
  return 'on-track'
})
</script>

<template>
  <div class="task-card" @click="$emit('edit', task)">
    <h4>{{ task.title }}</h4>
    <p v-if="task.description">{{ task.description }}</p>
    
    <div class="progress-wrapper" v-if="task.subtasks && task.subtasks.length > 0">
      <div class="progress-header">
        <span>Progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    
    <div v-if="task.deadline" class="task-date" :class="deadlineStatus">
      📅 {{ task.deadline }}
      <span v-if="deadlineStatus === 'overdue'" class="status-icon">⚠️ Overdue</span>
      <span v-else-if="deadlineStatus === 'due-soon'" class="status-icon">⏳ Due Soon</span>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
  cursor: grab;
  transition: all 0.2s ease;
}

.task-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

body.dark-theme .task-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.task-card:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.task-card h4 {
  margin: 0 0 8px 0;
  color: var(--text-main);
  font-size: 1.05rem;
  font-weight: 600;
}

.task-card {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px;
  margin: 0; 
  cursor: grab;
  transition: all 0.2s ease;
}


.progress-wrapper {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-track {
  width: 100%;
  height: 6px;
  background-color: var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--accent-color);
  border-radius: 10px;
  transition: width 0.4s ease;
}

/* Deadlines */
.task-date {
  font-size: 0.75rem;
  margin-top: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  border: 1px solid transparent;
}

.task-date.on-track, .task-date.no-deadline, .task-date.completed-task {
  color: var(--text-muted);
  background-color: transparent;
  border-color: var(--border-color);
}

.task-date.due-soon {
  color: #c05621;
  background-color: #feebc8;
  border-color: #fbd38d;
}

.task-date.overdue {
  color: #c53030;
  background-color: #fed7d7;
  border-color: #feb2b2;
}

.status-icon {
  font-weight: 700;
  margin-left: 4px;
}
</style>