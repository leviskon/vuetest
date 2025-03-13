<template>
  <div class="dashboard">
    <Header />
    
    <main class="main">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка курса...</p>
      </div>
      
      <div v-else-if="course">
        <div class="back-button-container">
          <button class="back-button" @click="$router.push('/dashboard')">
            <span class="back-icon">←</span>
            Вернуться в панель студента
          </button>
        </div>
        
        <div class="course-content">
          <!-- Левая панель с навигацией по курсу -->
          <div class="course-sidebar">
            <div class="course-info">
              <h1>{{ course.title }}</h1>
              <div class="course-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ course.progress }}% завершено</span>
              </div>
            </div>
            
            <div class="course-navigation">
              <div v-for="(module, index) in course.modules" :key="index" class="module">
                <div class="module-header" @click="toggleModule(index)">
                  <span class="module-number">{{ index + 1 }}</span>
                  <h3>{{ module.title }}</h3>
                  <span class="module-status" :class="{ completed: module.completed }">
                    {{ module.completed ? '✓' : '○' }}
                  </span>
                </div>
                
                <div class="module-content" v-if="module.isOpen">
                  <div 
                    v-for="(lesson, lessonIndex) in module.lessons" 
                    :key="lessonIndex"
                    class="lesson-item"
                    :class="{ 
                      'active': currentLesson?.id === lesson.id,
                      'completed': lesson.completed
                    }"
                    @click="selectLesson(lesson)"
                  >
                    <span class="lesson-icon">
                      {{ lesson.type === 'video' ? '🎥' : '📄' }}
                    </span>
                    <span class="lesson-title">{{ lesson.title }}</span>
                    <span class="lesson-duration">{{ lesson.duration }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Основная область контента -->
          <div class="course-main">
            <div v-if="currentLesson" class="lesson-content">
              <div class="lesson-header">
                <h2>{{ currentLesson.title }}</h2>
                <div class="lesson-meta">
                  <span class="lesson-type">
                    {{ currentLesson.type === 'video' ? 'Видеоурок' : 'Лекция' }}
                  </span>
                  <span class="lesson-duration">{{ currentLesson.duration }}</span>
                </div>
              </div>
              
              <div class="lesson-player">
                <div v-if="currentLesson.type === 'video'" class="video-player">
                  <div class="video-container">
                    <video 
                      ref="videoPlayer"
                      class="video-player"
                      controls
                      preload="metadata"
                    >
                      <source src="/videos/lesson_1.mp4" type="video/mp4">
                      Ваш браузер не поддерживает видео тег.
                    </video>
                  </div>
                </div>
                <div v-else class="lecture-content">
                  <div class="lecture-text">
                    {{ currentLesson.content }}
                  </div>
                  <div v-if="currentLesson.attachments" class="lecture-attachments">
                    <h4>Прикрепленные материалы:</h4>
                    <ul>
                      <li v-for="(attachment, index) in currentLesson.attachments" :key="index">
                        <a :href="attachment.url" target="_blank">
                          📎 {{ attachment.name }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="lesson-navigation">
                <button 
                  class="nav-btn prev" 
                  @click="prevLesson"
                  :disabled="!hasPrevLesson"
                >
                  ← Предыдущий урок
                </button>
                <button 
                  class="nav-btn next" 
                  @click="nextLesson"
                  :disabled="!hasNextLesson"
                >
                  Следующий урок →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="error-state">
        <p>Не удалось загрузить данные курса</p>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'CourseContent',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      course: null,
      currentLesson: null,
      isLoading: true,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      volume: 1,
      isFullscreen: false
    }
  },
  computed: {
    hasPrevLesson() {
      if (!this.currentLesson || !this.course) return false
      // Логика проверки наличия предыдущего урока
      return false
    },
    hasNextLesson() {
      if (!this.currentLesson || !this.course) return false
      // Логика проверки наличия следующего урока
      return true
    }
  },
  methods: {
    toggleModule(index) {
      if (!this.course) return
      this.course.modules[index].isOpen = !this.course.modules[index].isOpen
    },
    selectLesson(lesson) {
      this.currentLesson = lesson
    },
    prevLesson() {
      // Логика перехода к предыдущему уроку
    },
    nextLesson() {
      // Логика перехода к следующему уроку
    },
    async loadCourseData() {
      try {
        // Здесь будет запрос к API
        // Временные данные для демонстрации
        this.course = {
          id: this.$route.params.id,
          title: 'Веб-разработка',
          progress: 65,
          modules: [
            {
              title: 'Введение в HTML',
              isOpen: true,
              completed: true,
              lessons: [
                {
                  id: 1,
                  title: 'Что такое HTML?',
                  type: 'video',
                  duration: '15:00',
                  completed: true
                },
                {
                  id: 2,
                  title: 'Структура HTML документа',
                  type: 'lecture',
                  duration: '20 мин',
                  completed: true,
                  content: 'HTML (HyperText Markup Language) - это стандартный язык разметки для создания веб-страниц...',
                  attachments: [
                    { name: 'HTML_cheatsheet.pdf', url: '#' },
                    { name: 'Примеры кода.zip', url: '#' }
                  ]
                }
              ]
            },
            {
              title: 'CSS основы',
              isOpen: false,
              completed: false,
              lessons: [
                {
                  id: 3,
                  title: 'Введение в CSS',
                  type: 'video',
                  duration: '18:00',
                  completed: false
                }
              ]
            }
          ]
        }
        // Устанавливаем первый урок как текущий
        if (this.course.modules[0]?.lessons[0]) {
          this.currentLesson = this.course.modules[0].lessons[0]
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных курса:', error)
      } finally {
        this.isLoading = false
      }
    },
    togglePlay() {
      const video = this.$refs.videoPlayer
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    handleTimeUpdate() {
      const video = this.$refs.videoPlayer
      this.currentTime = video.currentTime
      this.progress = (video.currentTime / video.duration) * 100
    },
    handleVideoEnd() {
      this.isPlaying = false
      this.currentTime = 0
      this.progress = 0
    },
    handlePlay() {
      this.isPlaying = true
    },
    handlePause() {
      this.isPlaying = false
    },
    handleVolumeChange() {
      const video = this.$refs.videoPlayer
      video.volume = this.volume
    },
    toggleFullscreen() {
      const video = this.$refs.videoPlayer
      if (!document.fullscreenElement) {
        video.requestFullscreen()
        this.isFullscreen = true
      } else {
        document.exitFullscreen()
        this.isFullscreen = false
      }
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  },
  async mounted() {
    await this.loadCourseData()
    const video = this.$refs.videoPlayer
    video.addEventListener('loadedmetadata', () => {
      this.duration = video.duration
    })
  }
}
</script>

<style scoped>
.back-button-container {
  max-width: 1400px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--box-shadow);
}

.back-button:hover {
  background-color: #f8f9fa;
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.course-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.course-sidebar {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  height: calc(100vh - 140px);
  overflow-y: auto;
  position: sticky;
  top: 80px;
}

.course-info {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f1f1;
}

.course-info h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.course-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background-color: #f1f1f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #6c757d;
}

.course-navigation {
  padding: 1rem 0;
}

.module {
  border-bottom: 1px solid #f1f1f1;
}

.module-header {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.module-header:hover {
  background-color: #f9f9f9;
}

.module-number {
  width: 24px;
  height: 24px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.module-header h3 {
  flex: 1;
  font-size: 1rem;
  margin: 0;
}

.module-status {
  font-size: 1.2rem;
  color: #adb5bd;
}

.module-status.completed {
  color: #4cc9f0;
}

.module-content {
  padding: 0.5rem 0;
}

.lesson-item {
  padding: 0.75rem 1.5rem 0.75rem 4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lesson-item:hover {
  background-color: #f9f9f9;
}

.lesson-item.active {
  background-color: #f0f7ff;
  color: var(--primary-color);
}

.lesson-item.completed {
  color: #4cc9f0;
}

.lesson-icon {
  font-size: 1.2rem;
}

.lesson-title {
  flex: 1;
}

.lesson-duration {
  font-size: 0.9rem;
  color: #6c757d;
}

.course-main {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.lesson-header {
  margin-bottom: 2rem;
}

.lesson-header h2 {
  margin-bottom: 0.5rem;
}

.lesson-meta {
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.lesson-player {
  margin-bottom: 2rem;
}

.video-player {
  aspect-ratio: 16/9;
  background-color: #000;
  border-radius: var(--border-radius);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-container {
  position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: 16/9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.1s linear;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-container:hover .video-controls {
  opacity: 1;
}

.control-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.control-btn:hover {
  transform: scale(1.1);
}

.time-display {
  color: white;
  font-size: 0.9rem;
  margin-left: auto;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}

.volume-control input[type="range"] {
  width: 100px;
}

.lecture-content {
  line-height: 1.6;
}

.lecture-attachments {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f1f1;
}

.lecture-attachments h4 {
  margin-bottom: 1rem;
}

.lecture-attachments ul {
  list-style: none;
  padding: 0;
}

.lecture-attachments li {
  margin-bottom: 0.5rem;
}

.lecture-attachments a {
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.lecture-attachments a:hover {
  color: var(--accent-color);
}

.lesson-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f1f1f1;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
  transform: translateY(-2px);
}

.nav-btn:disabled {
  background-color: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .course-content {
    grid-template-columns: 1fr;
  }
  
  .course-sidebar {
    position: static;
    height: auto;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #dc3545;
  font-size: 1.2rem;
}
</style> 