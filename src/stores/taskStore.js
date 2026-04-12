import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { supabase } from '../supabase'
import { toast } from 'vue3-toastify'

export const useTaskStore = defineStore('task', () => {
  // Existing state
  const tasks = ref([])
  const isLoading = ref(false)
  const searchQuery = ref('') 
  const selectedDateFilter = ref('') 
  const isDarkMode = ref(false)
  
  // New Auth state
  const user = ref(null)

  const totalTasksCount = computed(() => tasks.value.length)
  const completedTasksCount = computed(() => tasks.value.filter(t => t.status === 'completed').length)

  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      const safeTitle = task.title || ''
      const safeDesc = task.description || ''
      const safeQuery = searchQuery.value || ''

      const matchesSearch = safeTitle.toLowerCase().includes(safeQuery.toLowerCase()) || 
                            safeDesc.toLowerCase().includes(safeQuery.toLowerCase())
      
      const matchesDate = selectedDateFilter.value ? task.deadline === selectedDateFilter.value : true

      return matchesSearch && matchesDate
    })
  })

  const todoTasks = computed(() => filteredTasks.value.filter(t => t.status === 'todo'))
  const inProgressTasks = computed(() => filteredTasks.value.filter(t => t.status === 'in-progress'))
  const completedTasks = computed(() => filteredTasks.value.filter(t => t.status === 'completed'))

  watch(isDarkMode, (newVal) => {
    if (newVal) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  })

  // NEW: Authentication Functions
  async function checkAuth() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user || null
  }

  async function handleAuth(username, password, isSignUp) {
    const formattedEmail = `${username.toLowerCase().trim()}@taskitup.local`
    
    isLoading.value = true
    try {
      let result
      
      // 1. Make the request to Supabase
      if (isSignUp) {
        result = await supabase.auth.signUp({ 
          email: formattedEmail, 
          password: password 
        })
      } else {
        result = await supabase.auth.signInWithPassword({ 
          email: formattedEmail, 
          password: password 
        })
      }

      // 2. CHECK FOR ERRORS FIRST
      if (result.error) throw result.error

      // 3. If we made it past the error check, it is 100% successful! 
      // Now we can safely show the correct popup.
      if (isSignUp) {
        toast.success('Account created successfully.')
      } else {
        toast.success('Welcome back.')
      }

      // 4. Save the user and download their board
      user.value = result.data.user
      await fetchTasks()
      
    } catch (error) {
      // If there was an error, it skips the success messages and lands right here
      toast.error(error.message)
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  async function logOut() {
    await supabase.auth.signOut()
    user.value = null
    tasks.value = [] // Clear the board when logging out
    toast.info('You have logged out.')
  }

  // Existing Database Functions
  async function fetchTasks() {
    isLoading.value = true
    try {
      const { data, error } = await supabase.from('tasks').select('*')
      if (error) throw error
      tasks.value = data
    } catch (error) {
      toast.error('Failed to load tasks.')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  async function addTask(taskData) {
    isLoading.value = true
    try {
      // We combine your task data with the logged-in user's unique ID
      const payload = {
        ...taskData,
        user_id: user.value.id
      }

      const { error } = await supabase.from('tasks').insert([payload])
      if (error) throw error
      
      await fetchTasks()
      toast.success('Task created successfully!')
      
    } catch (error) {
      toast.error('Failed to create task.')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(taskId, updates) {
    isLoading.value = true
    try {
      const { error } = await supabase.from('tasks').update(updates).eq('id', taskId)
      if (error) throw error
      await fetchTasks()
    } catch (error) {
      toast.error('Failed to update task.')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  async function removeTask(taskId) {
    isLoading.value = true
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)
      if (error) throw error
      await fetchTasks()
      toast.success('Task deleted.')
    } catch (error) {
      toast.error('Failed to delete task.')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return { 
    tasks, todoTasks, inProgressTasks, completedTasks, 
    isLoading, searchQuery, selectedDateFilter,
    isDarkMode, totalTasksCount, completedTasksCount,
    user, checkAuth, handleAuth, logOut,
    fetchTasks, addTask, updateTask, removeTask 
  }
})