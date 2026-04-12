<script setup>
import { useTaskStore } from '../stores/taskStore'
const store = useTaskStore()
</script>

<template>
  <div class="dashboard-container">
    <h1>Project Overview</h1>
    <p class="subtitle">Here is your current progress across all tasks.</p>

    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Total Tasks</h3>
        <span class="number">{{ store.totalTasksCount }}</span>
      </div>

      <div class="metric-card success">
        <h3>Completed</h3>
        <span class="number">{{ store.completedTasksCount }}</span>
      </div>

      <div class="metric-card pending">
        <h3>Pending</h3>
        <span class="number">{{ store.totalTasksCount - store.completedTasksCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 40px;
  background-color: #ffffff;
  min-height: 100vh;
}
h1 {
  font-size: 1.8rem;
  color: #1a202c;
  margin: 0 0 8px 0;
}
.subtitle {
  color: #718096;
  margin-bottom: 32px;
}
.metrics-grid {
  display: flex;
  gap: 24px;
}
.metric-card {
  flex: 1;
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.metric-card h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #4a5568;
}
.number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
}
.success .number {
  color: #38a169;
}
.pending .number {
  color: var(--accent-color);
}
</style>