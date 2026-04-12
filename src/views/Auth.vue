<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()
const isSignUp = ref(false)
const username = ref('') // Changed from email
const password = ref('')

function submit() {
  if (!username.value || !password.value) return
  store.handleAuth(username.value, password.value, isSignUp.value)
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="brand">
        <h2>TaskItUp</h2>
      </div>
      
      <h3>{{ isSignUp ? 'Create an Account' : 'Welcome Back' }}</h3>
      <p class="subtitle">Enter your details to continue.</p>

      <form @submit.prevent="submit" class="auth-form">
       <div class="input-group">
          <label>Username</label>
          <input type="text" v-model="username" placeholder="e.g., pons123" required />
        </div>
        
        <div class="input-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="submit-btn" :disabled="store.isLoading">
          {{ store.isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In') }}
        </button>
      </form>

      <div class="toggle-mode">
        <span v-if="!isSignUp">Don't have an account? <a href="#" @click.prevent="isSignUp = true">Sign up</a></span>
        <span v-if="isSignUp">Already have an account? <a href="#" @click.prevent="isSignUp = false">Log in</a></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc;
}
.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
}

.brand h2 { margin: 0; color: #1a202c; font-size: 1.5rem; }
h3 { margin: 0 0 8px 0; color: #2d3748; text-align: center; }
.subtitle { color: #718096; text-align: center; margin-bottom: 24px; font-size: 0.9rem; }
.input-group { margin-bottom: 16px; }
.input-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #4a5568; font-size: 0.9rem; }
input {
  width: 100%; padding: 10px; border: 1px solid #cbd5e0;
  border-radius: 6px; box-sizing: border-box;
}
input:focus { outline: none; border-color: var(--accent-color); }
.submit-btn {
  width: 100%; background: var(--accent-color); color: white; padding: 12px;
  border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
  margin-top: 10px;
}
.submit-btn:disabled { background: #a0aec0; cursor: not-allowed; }
.toggle-mode { text-align: center; margin-top: 20px; font-size: 0.9rem; color: #718096; }
.toggle-mode a { color: var(--accent-color); font-weight: 600; text-decoration: none; }
</style>