<template>
  <div class="edit-course">
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>
    <div class="edit-course-container">
      <!-- Добавляем кнопку "Назад" -->
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Назад
      </button>

      <!-- Заголовок и основная информация -->
      <div class="course-header">
        <div class="course-info">
          <div class="course-title-wrapper">
            <label>Название курса</label>
            <input 
              type="text" 
              v-model="course.title" 
              class="course-title-input"
              :disabled="!isEditingCourse"
              placeholder="Введите название курса"
            >
            <div class="edit-indicator" v-if="!isEditingCourse">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>
          <div class="course-description-wrapper">
            <label>Описание курса</label>
            <textarea 
              v-model="course.description" 
              class="course-description-input"
              :disabled="!isEditingCourse"
              placeholder="Введите описание курса"
            ></textarea>
            <div class="edit-indicator" v-if="!isEditingCourse">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </div>
          <div class="form-group">
            <label>Категория</label>
            <v-text-field
              v-model="course.category"
              :value="formatCategory(course.category)"
              variant="outlined"
              readonly
              disabled
              density="comfortable"
              class="category-field"
            ></v-text-field>
          </div>
        </div>
        <div class="course-actions">
          <template v-if="!isEditingCourse">
            <button class="edit-course-btn" @click="startEditingCourse">
              <i class="fas fa-edit"></i>
              Редактировать
            </button>
          </template>
          <template v-else>
            <button class="cancel-btn" @click="cancelEditingCourse">
              <i class="fas fa-times"></i>
              Отмена
            </button>
            <button class="save-btn" @click="saveCourse">
              <i class="fas fa-save"></i>
              Сохранить изменения
            </button>
          </template>
        </div>
      </div>

      <div class="course-content">
        <!-- Левая панель с содержимым курса -->
        <div class="content-panel">
          <div class="panel-header panel-header-centered">
            <h2 class="course-content-title">Содержание курса</h2>
            <div class="panel-actions">
              <button class="add-btn" @click="showMaterialModal = true">
                <i class="fas fa-plus"></i>
                Добавить материал
              </button>
              <button class="add-btn assignment-btn" @click="showAssignmentModal = true">
                <i class="fas fa-tasks"></i>
                Добавить задание
              </button>
            </div>
          </div>

          <div class="content-list">
            <h3 class="pseudo-title">Материалы</h3>
            <div ref="materialsList" class="materials-list">
              <div v-for="material in course.materials" :key="material.id" class="material-item">
                <div class="material-header">
                  <i class="fas fa-grip-vertical handle"></i>
                  <div class="material-title-block">
                    <label class="material-label">Название</label>
                    <input 
                      v-model="material.title" 
                      class="material-title-input"
                      :disabled="!editingMaterials.has(material.id)"
                      placeholder="Название материала"
                    >
                  </div>
                  <div class="material-actions">
                    <button 
                      v-if="!editingMaterials.has(material.id)"
                      @click="editMaterial(material)" 
                      class="action-btn edit-btn" 
                      title="Редактировать материал"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <template v-else>
                      <button 
                        @click="editMaterial(material)" 
                        class="action-btn save-btn" 
                        title="Сохранить изменения"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                      <button 
                        @click="cancelEdit(material)" 
                        class="action-btn cancel-btn" 
                        title="Отменить изменения"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </template>
                    <button 
                      @click="deleteMaterial(material.id)" 
                      class="action-btn delete-btn" 
                      title="Удалить материал"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div class="material-description-block">
                  <label class="material-label">Описание</label>
                  <textarea 
                    v-model="material.description" 
                    class="material-description-input"
                    :disabled="!editingMaterials.has(material.id)"
                    placeholder="Описание материала"
                  ></textarea>
                </div>

                <div class="material-content">
                  <div v-if="material.typeId === 1" class="video-container">
                    <video 
                      v-if="material.fileUrl"
                      :src="material.fileUrl" 
                      controls
                      preload="auto"
                      class="material-video"
                    ></video>
                    <div v-else class="no-content">
                      <button @click="displayMaterial(material)" class="load-btn">
                        <i class="fas fa-play"></i>
                        Загрузить видео
                      </button>
                    </div>
                  </div>
                  <div v-else-if="material.typeId === 2" class="document-container">
                    <div class="document-preview">
                      <template v-if="material.files && material.files.length > 0">
                        <div v-for="(file, index) in material.files" :key="index" class="file-preview-container">
                          <div v-if="isPdfFile(file.name) || file.contentType === 'application/pdf'" class="pdf-viewer">
                            <object 
                              v-if="material.fileUrl && material.currentFileIndex === index"
                              :data="material.fileUrl" 
                              type="application/pdf" 
                              class="material-document"
                            >
                              <p>Ваш браузер не поддерживает просмотр PDF. <a @click.prevent="downloadMaterial(material.id, index)" href="#">Скачайте PDF</a></p>
                            </object>
                            <div v-else class="no-content">
                              <button @click="displayMaterial(material, index)" class="load-btn">
                                <i class="fas fa-eye"></i>
                                Просмотреть PDF
                              </button>
                            </div>
                            <div class="document-actions">
                              <button @click="downloadMaterial(material.id, index)" class="download-btn">
                                <i class="fas fa-download"></i>
                                Скачать PDF
                              </button>
                            </div>
                          </div>
                          <div v-else class="compact-file-preview">
                            <div class="file-info">
                              <i :class="getFileIcon(file)"></i>
                              <span>{{ file.name }}</span>
                            </div>
                            <button @click="downloadMaterial(material.id, index)" class="compact-download-btn">
                              <i class="fas fa-download"></i>
                              Скачать
                            </button>
                          </div>
                        </div>
                      </template>
                      <div v-else class="loading-container">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Загрузка файлов...</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="no-content">
                    <p>Неизвестный тип материала</p>
                  </div>
                </div>
              </div>
            </div>
            <h3 class="pseudo-title" style="margin-top: 2.5rem;">Задания</h3>
            <div class="assignments-list">
              <div v-if="assignments.length === 0" class="no-assignments">Нет заданий</div>
              <div v-for="assignment in assignments" :key="assignment.id" class="material-item">
                <div class="material-header">
                  <i class="fas fa-grip-vertical handle"></i>
                  <div class="material-title-block">
                    <label class="material-label">Название</label>
                    <input 
                      v-model="assignment.title" 
                      class="material-title-input"
                      :disabled="!editingAssignments.has(assignment.id)"
                      placeholder="Название задания"
                    >
                  </div>
                  <div class="material-actions">
                    <button 
                      v-if="!editingAssignments.has(assignment.id)"
                      @click="startEditAssignment(assignment)" 
                      class="action-btn edit-btn" 
                      title="Редактировать задание"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <template v-else>
                      <button 
                        @click="saveAssignment(assignment)" 
                        class="action-btn save-btn" 
                        title="Сохранить изменения"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                      <button 
                        @click="cancelEditAssignment(assignment)" 
                        class="action-btn cancel-btn" 
                        title="Отменить изменения"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </template>
                    <button 
                      @click="deleteAssignment(assignment.id)" 
                      class="action-btn delete-btn" 
                      title="Удалить задание"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="material-description-block">
                  <label class="material-label">Описание</label>
                  <textarea 
                    v-model="assignment.description" 
                    class="material-description-input"
                    :disabled="!editingAssignments.has(assignment.id)"
                    placeholder="Описание задания"
                  ></textarea>
                </div>
                <div class="material-content">
                  <div class="document-container">
                    <div class="document-preview">
                      <!-- Блок дедлайна отдельно -->
                      <div class="assignment-deadline-block">
                        <label class="styled-assignment-fields-label">Дедлайн</label>
                        <input type="date" v-model="assignment.dueDate" class="form-input" :disabled="!editingAssignments.has(assignment.id)">
                      </div>
                      <!-- Блок файлов отдельно -->
                      <div v-if="assignment.url" class="assignment-files-block">
                        <div class="assignment-files styled-assignment-files">
                          <span class="assignment-files-label styled-assignment-files-label">Файлы:</span>
                          <div v-for="(fileUrl, idx) in (JSON.parse(assignment.url) || [])" :key="idx" class="file-preview-container">
                            <div v-if="isPdfFile(fileUrl) || getContentTypeFromUrl(fileUrl) === 'application/pdf'" class="pdf-viewer">
                              <object 
                                v-if="assignment.fileUrl && assignment.currentFileIndex === idx"
                                :data="assignment.fileUrl"
                                type="application/pdf"
                                class="material-document"
                              >
                                <p>Ваш браузер не поддерживает просмотр PDF. <a @click.prevent="downloadMaterial(material.id, index)" href="#">Скачайте PDF</a></p>
                              </object>
                              <div v-else class="no-content">
                                <button @click="displayAssignmentFile(assignment, idx)" class="load-btn">
                                  <i class="fas fa-eye"></i>
                                  Просмотреть PDF
                                </button>
                              </div>
                              <div class="document-actions">
                                <button @click="downloadMaterial(material.id, index)" class="download-btn">
                                  <i class="fas fa-download"></i>
                                  Скачать PDF
                                </button>
                              </div>
                            </div>
                            <div v-else class="compact-file-preview">
                              <div class="file-info">
                                <i :class="getFileIcon({ name: fileUrl })"></i>
                                <span class="file-name">{{ fileUrl.split('/').pop() }}</span>
                              </div>
                              <button @click="downloadAssignmentFile(assignment.id, idx)" class="compact-download-btn">
                                <i class="fas fa-download"></i>
                                Скачать
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая панель со статистикой -->
        <div class="stats-panel">
          <div class="panel-header">
            <h2>Статистика курса</h2>
            <button class="refresh-btn" @click="refreshStats">
              <i class="fas fa-sync"></i>
            </button>
          </div>

          <div class="stats-cards">
            <div class="stat-card">
              <i class="fas fa-users"></i>
              <div class="stat-info">
                <h3>Активные студенты</h3>
                <p>{{ course.stats.activeStudents }}</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-chart-line"></i>
              <div class="stat-info">
                <h3>Средний прогресс</h3>
                <p>{{ course.stats.averageProgress }}%</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-star"></i>
              <div class="stat-info">
                <h3>Средняя оценка</h3>
                <p>{{ course.stats.averageRating }}/5</p>
              </div>
            </div>
          </div>

          <div class="enrolled-students">
            <h3>Список студентов</h3>
            <div class="students-list">
              <div v-for="student in course.enrolledStudents" :key="student.id" class="student-item">
                <div class="student-info">
                  <img :src="getImageUrl(student.avatarUrl)" :alt="student.name" class="student-avatar">
                  <span class="student-name">{{ student.name }}</span>
                </div>
                <span class="enrollment-date">{{ formatDate(student.enrollmentDate) }}</span>
                <button @click="confirmUnenroll(student.id, student.name)" class="unenroll-btn" title="Удалить студента">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно добавления материала -->
    <div v-if="showMaterialModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Добавить материал</h2>
          <button class="close-btn" @click="showMaterialModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
            <label>Название материала</label>
              <input 
                type="text" 
              v-model="newMaterial.title" 
                class="form-input"
              placeholder="Введите название материала"
              >
            </div>
            <div class="form-group">
            <label>Описание материала</label>
              <textarea 
              v-model="newMaterial.description" 
                class="form-input"
              placeholder="Введите описание материала"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Тип материала</label>
              <select 
                v-model="newMaterial.typeId" 
                class="form-input"
              >
                <option 
                  v-for="type in materialTypes" 
                  :key="type.id" 
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Файлы материала</label>
              <div class="file-upload-area" @click="$refs.fileInput.click()" @drop.prevent="handleFileDrop" @dragover.prevent>
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileUpload" 
                  class="file-input"
                  style="display: none"
                  multiple
                >
                <div class="file-upload-content">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Перетащите файлы сюда или нажмите для выбора</p>
                  <span class="file-types">Поддерживаемые форматы: PDF, DOC, DOCX, PPT, PPTX, MP4</span>
                </div>
              </div>
              <div v-if="newMaterial.files.length > 0" class="selected-files">
                <div v-for="(file, index) in newMaterial.files" :key="index" class="selected-file">
                  <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span>{{ file.name }}</span>
                  </div>
                  <button class="remove-file" @click="removeFile(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
        </div>
        <div v-if="newMaterial.files.length > 0" class="modal-footer">
          <button class="cancel-btn" @click="showMaterialModal = false">Отмена</button>
          <button class="save-btn" @click="addMaterial">
            <i class="fas fa-save"></i>
            Сохранить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно добавления задания -->
    <div v-if="showAssignmentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Добавить задание</h2>
          <button class="close-btn" @click="showAssignmentModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Название задания</label>
            <input type="text" v-model="newAssignment.title" class="form-input" placeholder="Введите название задания">
          </div>
          <div class="form-group">
            <label>Описание задания</label>
            <textarea v-model="newAssignment.description" class="form-input" placeholder="Введите описание задания"></textarea>
          </div>
          <div class="form-group">
            <label>Дедлайн</label>
            <input type="date" v-model="newAssignment.dueDate" class="form-input">
          </div>
          <div class="form-group">
            <label>Файлы задания</label>
            <div class="file-upload-area" @click="$refs.assignmentFileInput.click()" @drop.prevent="handleAssignmentFileDrop" @dragover.prevent>
              <input 
                type="file" 
                ref="assignmentFileInput" 
                @change="handleAssignmentFileUpload" 
                class="file-input"
                style="display: none"
                multiple
              >
              <div class="file-upload-content">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Перетащите файлы сюда или нажмите для выбора</p>
                <span class="file-types">Поддерживаемые форматы: PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG, PNG</span>
              </div>
            </div>
            <div v-if="newAssignment.files.length > 0" class="selected-files">
              <div v-for="(file, index) in newAssignment.files" :key="index" class="selected-file">
                <div class="file-info">
                  <i class="fas fa-file"></i>
                  <span>{{ file.name }}</span>
                </div>
                <button class="remove-file" @click="removeAssignmentFile(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAssignmentModal = false">Отмена</button>
          <button class="save-btn" @click="addAssignment">
            <i class="fas fa-save"></i>
            Сохранить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования задания -->
    <div v-if="showEditAssignmentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Редактировать задание</h2>
          <button class="close-btn" @click="cancelEditAssignment">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Название задания</label>
            <input type="text" v-model="editedAssignment.title" class="form-input" placeholder="Введите название задания">
          </div>
          <div class="form-group">
            <label>Описание задания</label>
            <textarea v-model="editedAssignment.description" class="form-input" placeholder="Введите описание задания"></textarea>
          </div>
          <div class="form-group">
            <label>Дедлайн</label>
            <input type="date" v-model="editedAssignment.dueDate" class="form-input">
          </div>
          <div class="form-group">
            <label>Файлы задания</label>
            <div class="file-upload-area" @click="$refs.editAssignmentFileInput.click()" @drop.prevent="handleEditAssignmentFileDrop" @dragover.prevent>
              <input 
                type="file" 
                ref="editAssignmentFileInput" 
                @change="handleEditAssignmentFileUpload" 
                class="file-input"
                style="display: none"
                multiple
              >
              <div class="file-upload-content">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Перетащите файлы сюда или нажмите для выбора</p>
                <span class="file-types">Поддерживаемые форматы: PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG, PNG</span>
              </div>
            </div>
            <div v-if="editedAssignment.files && editedAssignment.files.length > 0" class="selected-files">
              <div v-for="(file, index) in editedAssignment.files" :key="index" class="selected-file">
                <div class="file-info">
                  <i class="fas fa-file"></i>
                  <span>{{ file.name }}</span>
                </div>
                <button class="remove-file" @click="removeEditAssignmentFile(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelEditAssignment">Отмена</button>
          <button class="save-btn" @click="saveEditedAssignment">
            <i class="fas fa-save"></i>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import Sortable from 'sortablejs'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'EditCourse',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const courseId = route.params.id
    const materialsList = ref(null)
    const materialUrls = ref({})
    const editingMaterials = ref(new Set())

    onMounted(() => {
      // Инициализация сортировки для материалов
      if (materialsList.value) {
        new Sortable(materialsList.value, {
          group: 'materials',
          animation: 150,
          handle: '.handle',
          onEnd: (evt) => {
            console.log('Material reordered:', evt)
          }
        })
      }
    })

    onBeforeUnmount(() => {
      // Освобождаем все URL при размонтировании компонента
      Object.values(materialUrls.value).forEach(url => {
        URL.revokeObjectURL(url)
      })
    })

    const toggleEdit = (materialId) => {
      if (editingMaterials.value.has(materialId)) {
        editingMaterials.value.delete(materialId)
      } else {
        editingMaterials.value.add(materialId)
      }
    }

    return {
      materialsList,
      courseId,
      router,
      materialUrls,
      editingMaterials,
      toggleEdit
    }
  },
  data() {
    return {
      course: {
        id: null,
        title: '',
        description: '',
        imageUrl: '',
        level: '',
        category: '',
        materials: [],
        stats: {
          activeStudents: 0,
          averageProgress: 0,
          averageRating: 0
        },
        students: [],
        enrolledStudents: []
      },
      isEditingCourse: false,
      materialTypes: [
        { id: 1, name: 'Видео', extensions: ['mp4', 'avi', 'mov', 'wmv'] },
        { id: 2, name: 'Документ', extensions: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'] }
      ],
      newMaterial: {
        title: '',
        description: '',
        files: [],
        typeId: 1
      },
      showMaterialModal: false,
      loading: false,
      showNotification: false,
      notificationMessage: '',
      selectedMaterial: null,
      mimeTypes: {
        'pdf': 'application/pdf',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'ppt': 'application/vnd.ms-powerpoint',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'doc': 'application/msword',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.ms-excel'
      },
      editedMaterial: null,
      showAssignmentModal: false,
      newAssignment: {
        title: '',
        description: '',
        dueDate: '',
        files: []
      },
      assignments: [],
      editedAssignment: null,
      showEditAssignmentModal: false,
      editingAssignments: new Set(),
      editedAssignmentCopy: null,
    }
  },
  async created() {
    const route = useRoute()
    const courseId = route.params.id
    
    try {
      console.log('Загрузка данных курса с ID:', courseId)
      const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
        credentials: 'include'
      })

      if (response.status === 403) {
        console.error('Ошибка доступа: нет прав для доступа к курсу')
        alert('У вас нет прав для доступа к этому курсу')
        this.$router.push('/teacher/dashboard')
        return
      }

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('Получены данные курса:', data)

      this.course = {
        id: data.id,
        title: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        level: data.level,
        category: data.category,
        materials: [],
        stats: {
          activeStudents: data.totalStudents || 0,
          averageProgress: 0,
          averageRating: 0
        },
        students: [],
        enrolledStudents: []
      }

      // Загрузка материалов курса
      await this.loadCourseMaterials()
      // Загрузка заданий курса
      await this.loadAssignments()
      // Загрузка данных о записанных студентах
      await this.loadEnrolledStudents()
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error)
      console.error('Детали ошибки:', {
        message: error.message,
        stack: error.stack
      })
      alert('Не удалось загрузить данные курса')
      this.$router.push('/teacher/dashboard')
    }
  },
  mounted() {
    // ... существующий код ...
    this.$nextTick(() => {
      // Автоматически загружаем PDF для всех заданий, если есть PDF и не загружен
      this.assignments.forEach(assignment => {
        if (assignment.url) {
          const urls = JSON.parse(assignment.url);
          urls.forEach((fileUrl, idx) => {
            if (this.isPdfFile(fileUrl) && (!assignment.fileUrl || assignment.currentFileIndex !== idx)) {
              this.displayAssignmentFile(assignment, idx);
            }
          });
        }
      });
    });
  },
  methods: {
    formatCategory(category) {
      if (!category) return '';
      const categoryMap = {
        'PROGRAMMING': 'Программирование',
        'DESIGN': 'Дизайн',
        'MARKETING': 'Маркетинг',
        'BUSINESS': 'Бизнес',
        'LANGUAGE': 'Языки',
        'OTHER': 'Другое'
      };
      return categoryMap[category.toUpperCase()] || category;
    },
    goBack() {
      this.$router.push('/teacher/dashboard')
    },
    async saveCourse() {
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('name', this.course.title)
        formData.append('description', this.course.description)
        formData.append('level', this.course.level)
        formData.append('category', this.course.category)

        const response = await fetch(`http://localhost:8080/api/courses/${this.course.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Ошибка при сохранении курса')
        }

        this.notificationMessage = 'Курс успешно сохранен'
        this.showNotification = true
        
        setTimeout(() => {
          this.$router.push('/teacher/dashboard')
        }, 1000)
      } catch (error) {
        console.error('Ошибка при сохранении курса:', error)
        this.notificationMessage = 'Не удалось сохранить курс'
        this.showNotification = true
      } finally {
        this.loading = false
      }
    },
    async addMaterial() {
      if (!this.newMaterial.title || this.newMaterial.files.length === 0) {
        alert('Пожалуйста, заполните все поля и добавьте хотя бы один файл');
        return;
      }

      const formData = new FormData();
      formData.append('courseId', this.course.id);
      formData.append('typeId', this.newMaterial.typeId);
      formData.append('title', this.newMaterial.title);
      formData.append('description', this.newMaterial.description);
      
      // Добавляем все файлы
      this.newMaterial.files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      try {
        const response = await fetch('http://localhost:8080/api/materials', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Ошибка при добавлении материала');
        }

        const material = await response.json();
        this.course.materials.push(material);
        this.showMaterialModal = false;
        this.newMaterial = { title: '', description: '', files: [], typeId: 1 };
        
        this.notificationMessage = 'Материал успешно добавлен';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      } catch (error) {
        console.error('Ошибка при добавлении материала:', error);
        this.notificationMessage = 'Не удалось добавить материал';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    },
    async updateMaterial(material) {
      try {
        const formData = new FormData()
        formData.append('title', material.title)
        formData.append('description', material.description)
        
        const response = await fetch(`http://localhost:8080/api/materials/${material.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Ошибка при обновлении материала')
        }

        // Обновляем материал в текущем массиве без изменения порядка
        const index = this.course.materials.findIndex(m => m.id === material.id)
        if (index !== -1) {
          this.$set(this.course.materials, index, { ...this.course.materials[index], ...material })
        }

        this.notificationMessage = 'Материал успешно обновлен'
        this.showNotification = true
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      } catch (error) {
        console.error('Ошибка при обновлении материала:', error)
        this.notificationMessage = 'Не удалось обновить материал'
        this.showNotification = true
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      }
    },
    async deleteMaterial(materialId) {
      if (!confirm('Вы уверены, что хотите удалить этот материал?')) {
        return
      }

      try {
        const response = await fetch(`http://localhost:8080/api/materials/${materialId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Ошибка при удалении материала')
        }

        this.course.materials = this.course.materials.filter(m => m.id !== materialId)
        this.notificationMessage = 'Материал успешно удален'
        this.showNotification = true
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      } catch (error) {
        console.error('Ошибка при удалении материала:', error)
        this.notificationMessage = 'Не удалось удалить материал'
        this.showNotification = true
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      }
    },
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      // Если это видео-расширение, возвращаем тип видео
      if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
          return 1; // Видео
      }
      // Все остальные файлы считаем документами
      return 2; // Документ
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        // Добавляем новые файлы к существующим
        this.newMaterial.files = [...this.newMaterial.files, ...files];
        this.newMaterial.typeId = this.getFileType(files[0].name);
      }
    },
    handleFileDrop(event) {
      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        // Добавляем новые файлы к существующим
        this.newMaterial.files = [...this.newMaterial.files, ...files];
        this.newMaterial.typeId = this.getFileType(files[0].name);
      }
    },
    removeFile(index) {
      this.newMaterial.files.splice(index, 1);
    },
    refreshStats() {
      // Реализация обновления статистики
      console.log('Обновление статистики курса')
    },
    async loadCourseMaterials() {
      try {
        console.log('Начало загрузки материалов для курса:', this.course.id);
        
        const response = await fetch(`http://localhost:8080/api/materials/course/${this.course.id}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка при загрузке материалов');
        }

        const materials = await response.json();
        
        // Сортируем материалы по порядку создания
        materials.sort((a, b) => a.id - b.id);
        
        // Загружаем файлы для всех материалов
        const materialsWithFiles = await Promise.all(materials.map(async material => {
          try {
            material.typeId = material.type.id;
            material.files = []; // Инициализируем пустой массив файлов
            material.currentFileIndex = 0; // Добавляем индекс текущего файла
            
            // Проверяем, есть ли URL в материале
            if (material.url) {
              try {
                // Парсим JSON строку с URL
                const urls = JSON.parse(material.url);
                material.files = urls.map((url, index) => ({
                  name: url.split('/').pop(),
                  url: url,
                  contentType: this.getContentTypeFromUrl(url),
                  index: index
                }));

                // Автоматически загружаем первый PDF файл для отображения
                const firstPdfIndex = material.files.findIndex(file => 
                  file.name.toLowerCase().endsWith('.pdf') || 
                  file.contentType === 'application/pdf'
                );

                if (firstPdfIndex !== -1) {
                  await this.displayMaterial(material, firstPdfIndex);
                }
              } catch (e) {
                console.warn(`Не удалось распарсить URL для материала ${material.id}:`, e);
              }
            }
          } catch (error) {
            console.error(`Ошибка при обработке материала ${material.id}:`, error);
            material.files = [];
          }
          return material;
        }));

        this.course.materials = materialsWithFiles;
      } catch (error) {
        console.error('Ошибка при загрузке материалов:', error);
        this.notificationMessage = error.message || 'Не удалось загрузить материалы курса';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    },
    getContentTypeFromUrl(url) {
      const extension = url.split('.').pop().toLowerCase();
      const contentTypeMap = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'mp4': 'video/mp4',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif'
      };
      return contentTypeMap[extension] || 'application/octet-stream';
    },
    async displayMaterial(material, fileIndex = 0) {
      try {
        console.log('Начало загрузки файла для материала:', material);
        
        // Проверяем наличие файла по индексу
        if (!material.files || !material.files[fileIndex]) {
          throw new Error('Файл не найден');
        }

        const file = material.files[fileIndex];
        
        // Очищаем старый URL, если он есть
        if (this.materialUrls[material.id]) {
          URL.revokeObjectURL(this.materialUrls[material.id]);
        }

        // Загружаем файл через API
        const response = await fetch(`http://localhost:8080/api/materials/${material.id}/file/${fileIndex}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/pdf, */*'
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке файла');
        }

        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);
        material.fileUrl = fileUrl;
        material.currentFileIndex = fileIndex;
        this.materialUrls[material.id] = fileUrl;
        
        console.log('Создан URL для файла:', fileUrl, 'Имя файла:', file.name);
        
        // Обновляем материал с URL файла
        const index = this.course.materials.findIndex(m => m.id === material.id);
        if (index !== -1) {
          this.course.materials[index] = { ...material };
        }
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        this.notificationMessage = error.message || 'Не удалось загрузить файл материала';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    },
    async downloadMaterial(materialId, fileIndex = 0) {
      try {
        const material = this.course.materials.find(m => m.id === materialId);
        if (!material || !material.files || !material.files[fileIndex]) {
          throw new Error('Файл не найден');
        }

        const file = material.files[fileIndex];
        const response = await fetch(`http://localhost:8080/api/materials/${materialId}/file/${fileIndex}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке файла');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name; // Используем оригинальное имя файла
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.notificationMessage = 'Файл успешно загружен';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        this.notificationMessage = error.message || 'Не удалось загрузить файл';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    },
    getFileIcon(file) {
      if (!file || !file.name) return 'fas fa-file';
      
      const extension = file.name.toLowerCase().split('.').pop();
      
      const iconMap = {
        'pdf': 'fas fa-file-pdf',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'xls': 'fas fa-file-excel',
        'xlsx': 'fas fa-file-excel',
        'ppt': 'fas fa-file-powerpoint',
        'pptx': 'fas fa-file-powerpoint',
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image',
        'gif': 'fas fa-file-image',
        'mp4': 'fas fa-file-video',
        'avi': 'fas fa-file-video',
        'mov': 'fas fa-file-video',
        'mp3': 'fas fa-file-audio',
        'wav': 'fas fa-file-audio',
        'zip': 'fas fa-file-archive',
        'rar': 'fas fa-file-archive',
        'html': 'fas fa-file-code',
        'css': 'fas fa-file-code',
        'js': 'fas fa-file-code'
      };

      return iconMap[extension] || 'fas fa-file';
    },
    isPdfFile(fileName) {
      if (!fileName) return false;
      return fileName.toLowerCase().endsWith('.pdf');
    },
    editMaterial(material) {
      this.toggleEdit(material.id)
      if (this.editingMaterials.has(material.id)) {
        // Сохраняем копию для возможной отмены изменений
        this.editedMaterial = { ...material }
      } else {
        // Сохраняем изменения
        this.updateMaterial(material)
      }
    },
    cancelEdit(material) {
      if (this.editedMaterial) {
        Object.assign(material, this.editedMaterial)
      }
      this.toggleEdit(material.id)
      this.editedMaterial = null
    },
    startEditingCourse() {
      this.isEditingCourse = true;
    },
    cancelEditingCourse() {
      this.isEditingCourse = false;
    },
    async loadEnrolledStudents() {
      try {
        // Загружаем данные о зачислениях
        const enrollmentsResponse = await fetch('http://localhost:8080/api/enrollments', {
          credentials: 'include'
        });
        
        if (!enrollmentsResponse.ok) {
          throw new Error('Ошибка при загрузке данных о зачислениях');
        }
        
        const enrollments = await enrollmentsResponse.json();
        
        // Фильтруем зачисления для текущего курса
        const courseEnrollments = enrollments.filter(
          enrollment => enrollment.courseId === this.course.id
        );
        
        // Загружаем данные о пользователях
        const usersResponse = await fetch('http://localhost:8080/api/auth/users', {
          credentials: 'include'
        });
        
        if (!usersResponse.ok) {
          throw new Error('Ошибка при загрузке данных о пользователях');
        }
        
        const users = await usersResponse.json();
        
        // Создаем массив студентов, записанных на курс
        this.course.enrolledStudents = courseEnrollments
          .map(enrollment => {
            const student = users.find(user => user.id === enrollment.studentId);
            if (student) {
              console.log('Обработка студента:', student.name, ', Avatar URL:', student.avatarUrl, ', Дата зачисления:', enrollment.enrolledAt);
            }
            return student ? {
              id: student.id,
              name: student.name,
              avatarUrl: student.avatarUrl,
              enrollmentDate: enrollment.enrolledAt
            } : null;
          })
          .filter(student => student !== null);
        
        // Обновляем количество активных студентов
        this.course.stats.activeStudents = this.course.enrolledStudents.length;
        
      } catch (error) {
        console.error('Ошибка при загрузке данных о студентах:', error);
        this.notificationMessage = 'Не удалось загрузить данные о студентах';
        this.showNotification = true;
      }
    },
    formatDate(dateString) {
      console.log('Форматирование даты, входная строка:', dateString);
      if (!dateString) {
         console.log('Входная строка даты пуста или null');
         return 'Неизвестная дата';
      }
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
           console.error('Не удалось распарсить дату:', dateString);
           return 'Неверная дата';
        }
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
         console.error('Ошибка при форматировании даты:', dateString, e);
         return 'Ошибка формата даты';
      }
    },
    getImageUrl(avatarUrl) {
      if (!avatarUrl) return '/placeholder-avatar.png'; // Путь к дефолтной аватарке
      // Проверяем, является ли URL абсолютным
      if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
        return avatarUrl;
      }
      // Если это относительный путь, добавляем базовый URL сервера
      return `http://localhost:8080${avatarUrl}`;
    },
    async confirmUnenroll(studentId, studentName) {
      if (confirm(`Вы уверены, что хотите удалить студента ${studentName} из курса?`)) {
        await this.unenrollStudent(studentId);
      }
    },
    async unenrollStudent(studentId) {
      try {
        console.log(`Попытка удалить студента ID ${studentId} из курса ID ${this.course.id}`);
        
        // Удаляем прогресс студента по конкретному курсу
        const progressResponse = await fetch(`http://localhost:8080/api/course-progress/student/${studentId}/course/${this.course.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!progressResponse.ok) {
          console.warn(`Не удалось удалить прогресс студента: ${progressResponse.status} ${progressResponse.statusText}`);
        }

        // Затем удаляем студента из курса
        const response = await fetch(`http://localhost:8080/api/enrollments/students/${studentId}/unenroll?courseId=${this.course.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка при удалении студента: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log(`Студент ID ${studentId} успешно удален.`);
        // Удаляем студента из локального списка
        this.course.enrolledStudents = this.course.enrolledStudents.filter(student => student.id !== studentId);
        // Обновляем счетчик студентов
        this.course.stats.activeStudents = this.course.enrolledStudents.length;

        this.notificationMessage = `Студент успешно удален из курса`;
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);

      } catch (error) {
        console.error('Ошибка при удалении студента:', error);
        this.notificationMessage = error.message || 'Не удалось удалить студента';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    handleAssignmentFileUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        this.newAssignment.files = [...this.newAssignment.files, ...files];
      }
    },
    handleAssignmentFileDrop(event) {
      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        this.newAssignment.files = [...this.newAssignment.files, ...files];
      }
    },
    removeAssignmentFile(index) {
      this.newAssignment.files.splice(index, 1);
    },
    async loadAssignments() {
      try {
        const response = await fetch(`http://localhost:8080/api/assignments/course/${this.course.id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Ошибка при загрузке заданий');
        }
        const assignments = await response.json();
        console.log('Ответ сервера на GET /api/assignments/course:', assignments);
        // Форматируем dueDate для отображения в input type=date
        assignments.forEach(a => {
          if (a.dueDate && typeof a.dueDate === 'string' && a.dueDate.includes('T')) {
            a.dueDate = a.dueDate.split('T')[0];
          }
          // Автоматически загружаем первый PDF файл для отображения (как у материалов)
          if (a.url) {
            try {
              const urls = JSON.parse(a.url);
              const firstPdfIndex = urls.findIndex(url => this.isPdfFile(url));
              if (firstPdfIndex !== -1) {
                this.displayAssignmentFile(a, firstPdfIndex);
              }
            } catch (e) {
              console.warn(`Не удалось распарсить URL для задания ${a.id}:`, e);
            }
          }
        });
        // Сортируем по id (или дедлайну, если нужно)
        assignments.sort((a, b) => a.id - b.id);
        this.assignments = assignments;
      } catch (error) {
        console.error('Ошибка при загрузке заданий:', error);
        this.notificationMessage = error.message || 'Не удалось загрузить задания';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    async addAssignment() {
      if (!this.newAssignment.title || !this.newAssignment.description || !this.newAssignment.dueDate) {
        alert('Пожалуйста, заполните все поля задания!');
        return;
      }
      // Преобразуем дату в ISO-8601 с временем 00:00:00
      let isoDueDate = this.newAssignment.dueDate;
      if (isoDueDate && !isoDueDate.includes('T')) {
        isoDueDate = isoDueDate + 'T00:00:00';
      }
      console.log('POST /api/assignments dueDate:', isoDueDate);
      const formData = new FormData();
      formData.append('courseId', this.course.id);
      formData.append('title', this.newAssignment.title);
      formData.append('description', this.newAssignment.description);
      formData.append('dueDate', isoDueDate);
      this.newAssignment.files.forEach(file => {
        formData.append('files', file);
      });
      try {
        const response = await fetch('http://localhost:8080/api/assignments', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Ошибка при добавлении задания');
        }
        const createdAssignment = await response.json();
        console.log('Ответ сервера на POST /api/assignments:', createdAssignment);
        this.notificationMessage = 'Задание успешно добавлено';
        this.showNotification = true;
        this.showAssignmentModal = false;
        this.newAssignment = { title: '', description: '', dueDate: '', files: [] };
        await this.loadAssignments();
        setTimeout(() => { this.showNotification = false; }, 3000);
      } catch (error) {
        console.error('Ошибка при добавлении задания:', error);
        this.notificationMessage = error.message || 'Не удалось добавить задание';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    editAssignment(assignment) {
      this.editedAssignment = {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        files: []
      };
      this.showEditAssignmentModal = true;
    },
    handleEditAssignmentFileUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        this.editedAssignment.files = [...this.editedAssignment.files, ...files];
      }
    },
    handleEditAssignmentFileDrop(event) {
      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        this.editedAssignment.files = [...this.editedAssignment.files, ...files];
      }
    },
    removeEditAssignmentFile(index) {
      this.editedAssignment.files.splice(index, 1);
    },
    cancelEditAssignment() {
      this.showEditAssignmentModal = false;
      this.editedAssignment = null;
    },
    async saveEditedAssignment() {
      if (!this.editedAssignment.title || !this.editedAssignment.description || !this.editedAssignment.dueDate) {
        alert('Пожалуйста, заполните все поля задания!');
        return;
      }
      const formData = new FormData();
      formData.append('title', this.editedAssignment.title);
      formData.append('description', this.editedAssignment.description);
      formData.append('dueDate', this.editedAssignment.dueDate);
      this.editedAssignment.files.forEach(file => {
        formData.append('files', file);
      });
      try {
        const response = await fetch(`http://localhost:8080/api/assignments/${this.editedAssignment.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении задания');
        }
        this.notificationMessage = 'Задание успешно обновлено';
        this.showNotification = true;
        this.showEditAssignmentModal = false;
        this.editedAssignment = null;
        await this.loadAssignments();
        setTimeout(() => { this.showNotification = false; }, 3000);
      } catch (error) {
        console.error('Ошибка при обновлении задания:', error);
        this.notificationMessage = error.message || 'Не удалось обновить задание';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    async deleteAssignment(assignmentId) {
      if (!confirm('Вы уверены, что хотите удалить это задание?')) return;
      try {
        const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Ошибка при удалении задания');
        }
        this.notificationMessage = 'Задание успешно удалено';
        this.showNotification = true;
        await this.loadAssignments();
        setTimeout(() => { this.showNotification = false; }, 3000);
      } catch (error) {
        console.error('Ошибка при удалении задания:', error);
        this.notificationMessage = error.message || 'Не удалось удалить задание';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    startEditAssignment(assignment) {
      this.editingAssignments.add(assignment.id);
      // Сохраняем копию для отмены
      this.editedAssignmentCopy = { ...assignment };
    },
    async saveAssignment(assignment) {
      if (!assignment.title || !assignment.description || !assignment.dueDate) {
        alert('Пожалуйста, заполните все поля задания!');
        return;
      }
      // Преобразуем дату в ISO-8601 с временем 00:00:00, если нужно
      let isoDueDate = assignment.dueDate;
      if (isoDueDate && !isoDueDate.includes('T')) {
        isoDueDate = isoDueDate + 'T00:00:00';
      }
      const formData = new FormData();
      formData.append('title', assignment.title);
      formData.append('description', assignment.description);
      formData.append('dueDate', isoDueDate);
      // Файлы не редактируются инлайн (можно добавить по желанию)
      try {
        const response = await fetch(`http://localhost:8080/api/assignments/${assignment.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении задания');
        }
        this.notificationMessage = 'Задание успешно обновлено';
        this.showNotification = true;
        this.editingAssignments.delete(assignment.id);
        this.editedAssignmentCopy = null;
        await this.loadAssignments();
        setTimeout(() => { this.showNotification = false; }, 3000);
      } catch (error) {
        console.error('Ошибка при обновлении задания:', error);
        this.notificationMessage = error.message || 'Не удалось обновить задание';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    cancelEditAssignment(assignment) {
      // Возвращаем старые значения
      Object.assign(assignment, this.editedAssignmentCopy);
      this.editingAssignments.delete(assignment.id);
      this.editedAssignmentCopy = null;
    },
    isPdfFile(fileName) {
      if (!fileName) return false;
      return fileName.toLowerCase().endsWith('.pdf');
    },
    async displayAssignmentFile(assignment, fileIndex = 0) {
      try {
        console.log('[ASSIGNMENT PDF] Начало загрузки файла для задания:', assignment.id, 'Файл индекс:', fileIndex);
        if (!assignment.url) {
          console.warn('[ASSIGNMENT PDF] Нет url у задания:', assignment.id);
          return;
        }
        const urls = JSON.parse(assignment.url);
        if (!urls[fileIndex]) {
          console.warn('[ASSIGNMENT PDF] Файл не найден по индексу', fileIndex, 'у задания:', assignment.id);
          return;
        }
        // Очищаем старый URL, если он есть
        if (assignment.fileUrl) {
          URL.revokeObjectURL(assignment.fileUrl);
        }
        const response = await fetch(`http://localhost:8080/api/assignments/${assignment.id}/file/${fileIndex}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/pdf, */*' }
        });
        if (!response.ok) {
          console.error('[ASSIGNMENT PDF] Ошибка при загрузке файла:', response.status, response.statusText);
          throw new Error('Ошибка при загрузке файла');
        }
        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);
        assignment.fileUrl = fileUrl;
        assignment.currentFileIndex = fileIndex;
        console.log('[ASSIGNMENT PDF] Создан blob-URL для задания:', assignment.id, 'Файл индекс:', fileIndex, 'URL:', fileUrl);
      } catch (e) {
        console.error('[ASSIGNMENT PDF] Ошибка при загрузке или создании blob-URL:', e);
        this.notificationMessage = e.message || 'Не удалось загрузить файл';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    async downloadAssignmentFile(assignmentId, fileIndex = 0) {
      try {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (!assignment || !assignment.url) return;
        const urls = JSON.parse(assignment.url);
        const fileName = urls[fileIndex] ? urls[fileIndex].split('/').pop() : 'file';
        const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}/file/${fileIndex}`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Ошибка при загрузке файла');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.notificationMessage = 'Файл успешно загружен';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      } catch (e) {
        this.notificationMessage = e.message || 'Не удалось загрузить файл';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    },
    getAssignmentPdfUrl(assignment, fileIndex) {
      // Просто возвращаем прямой API url, чтобы PDF сразу отображался
      const url = `http://localhost:8080/api/assignments/${assignment.id}/file/${fileIndex}`;
      console.log('[ASSIGNMENT PDF] Попытка отобразить PDF для задания:', assignment.id, 'Файл индекс:', fileIndex, 'URL:', url);
      return url;
    },
  },
})
</script>

<style scoped>
.edit-course {
  padding: 2rem;
  background-color: #f3f4f6;
  min-height: 100vh;
}

.edit-course-container {
  max-width: 1400px;
  margin: 0 auto;
}

.course-header {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  transition: all 0.3s ease;
}

.course-header:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.course-info {
  flex: 1;
}

.course-title-wrapper,
.course-description-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
}

.course-title-wrapper label,
.course-description-wrapper label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.course-title-input {
  width: 100%;
  font-size: 1.75rem;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  padding: 0.75rem 0;
  transition: all 0.3s ease;
  background: transparent;
  color: #1f2937;
}

.course-title-input:focus {
  outline: none;
  border-bottom-color: var(--primary-color);
}

.course-description-input {
  width: 100%;
  min-height: 120px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem;
  resize: vertical;
  font-size: 1.1rem;
  line-height: 1.6;
  transition: all 0.3s ease;
  background: #f9fafb;
  color: #1f2937;
}

.course-description-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.1);
}

.course-title-input:disabled,
.course-description-input:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.8;
  border-color: #e2e8f0;
}

.course-title-input:disabled:hover,
.course-description-input:disabled:hover {
  border-color: #e2e8f0;
}

.course-title-input:disabled:focus,
.course-description-input:disabled:focus {
  box-shadow: none;
}

.edit-course-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f8fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-course-btn:hover {
  background: #edf2f7;
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.edit-course-btn i {
  font-size: 1.1rem;
}

.course-actions {
  display: flex;
  gap: 1rem;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.save-btn {
  background: var(--primary-color);
  color: white;
}

.save-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.course-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.content-panel,
.stats-panel {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.content-panel:hover,
.stats-panel:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: white;
  color: #4b5563;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  background: #f9fafb;
  transform: translateX(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  color: var(--primary-color);
}

.back-btn i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.back-btn:hover i {
  transform: translateX(-3px);
}

.course-title-wrapper label,
.course-description-wrapper label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.course-title-input {
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.5rem 0;
  transition: var(--transition);
  background: transparent;
}

.course-title-input:focus {
  outline: none;
  border-bottom-color: var(--primary-color);
}

.course-description-input {
  width: 100%;
  min-height: 100px;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  padding: 0.75rem;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease;
}

.course-description-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.material-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.material-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.material-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.material-title-block, .material-description-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.material-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.material-title-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.material-title-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
  outline: none;
}

.material-title-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.8;
  border-color: #e2e8f0;
}

.material-description-input {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.material-description-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
  outline: none;
}

.material-description-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.8;
  border-color: #e2e8f0;
}

.material-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
  background: #f8f9fa;
}

.edit-btn {
  color: #4a5568;
}

.edit-btn:hover {
  background: #edf2f7;
  color: var(--primary-color);
}

.delete-btn {
  color: #4a5568;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.stat-info h3 {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-info p {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-color);
}

.students-progress {
  margin-top: 1.5rem;
}

.students-progress h3 {
  margin-bottom: 0.75rem;
  text-align: center;
  font-size: 1rem;
}

.student-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  gap: 1rem;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-grow: 1;
}

.student-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.student-name {
  font-weight: 500;
  color: var(--text-color);
  word-break: break-word;
}

.enrollment-date {
  font-size: 0.875rem;
  color: #6c757d;
  flex-shrink: 0;
}

.unenroll-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 50%;
  flex-shrink: 0;
}

.unenroll-btn:hover {
  background-color: #fbe8e8;
  transform: scale(1.1);
}

.unenroll-btn i {
  font-size: 1rem;
}

.panel-actions {
  width: 100%;
  display: flex;
  justify-content: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  margin: 0;
  padding-bottom: 1rem;
  position: relative;
  display: inline-block;
  text-align: center;
  font-size: 1.75rem;
  color: #1a202c;
  font-weight: 700;
}

.modal-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 2px;
}

.modal-body {
  padding: 2rem;
  background: #ffffff;
  overflow-y: auto;
  flex: 1;
  border-radius: 0 0 20px 20px;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

textarea.form-input {
  min-height: 150px;
  resize: vertical;
  line-height: 1.6;
}

.file-upload-area {
  width: 100%;
  padding: 2.5rem;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.file-upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.02);
  transform: translateY(-2px);
}

.file-upload-content {
  text-align: center;
  color: #4a5568;
}

.file-upload-content i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.file-upload-content p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.file-types {
  font-size: 0.875rem;
  color: #718096;
}

.selected-files {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.selected-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.selected-file:hover {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.02);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-info i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.file-info span {
  font-size: 0.95rem;
  color: #2d3748;
}

.remove-file {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file:hover {
  background: #edf2f7;
  color: #e53e3e;
  transform: rotate(90deg);
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.save-btn {
  padding: 0.875rem 2.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.2);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--primary-color-rgb), 0.3);
}

.cancel-btn {
  padding: 0.875rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.cancel-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-2px);
}

.close-btn {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  background: #f7fafc;
  border: none;
  font-size: 1.25rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  background: #edf2f7;
  color: #e53e3e;
  transform: rotate(90deg) scale(1.1);
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #48bb78;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease forwards;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.refresh-btn {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.refresh-btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.refresh-btn:hover {
  background: #edf2f7;
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.1);
}

.refresh-btn:hover i {
  transform: rotate(180deg);
}

.refresh-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.material-content {
  margin: 0;
  padding: 0;
}

.video-container {
  width: 100%;
  background: #000;
  border-radius: var(--border-radius);
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-video {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.document-container {
  margin: 0;
  padding: 0;
}

.document-preview {
  margin: 0;
  padding: 0;
}

.file-preview-container {
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: #ffffff;
  transition: all 0.3s ease;
}

.file-preview-container:last-child {
  margin-bottom: 0;
}

.file-preview-container:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.1);
}

.pdf-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.material-document {
  width: 100%;
  height: 700px;
  border: none;
  background: #fff;
  display: block;
}

.document-actions {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e2e8f0;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.download-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.download-btn i {
  font-size: 1.1rem;
}

.no-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #f8f9fa;
  color: #6c757d;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
}

.load-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.load-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.load-btn i {
  font-size: 1.1rem;
}

.pptx-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  gap: 1rem;
}

.pptx-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
}

.pptx-preview i {
  font-size: 3rem;
  color: #e53e3e;
}

.pptx-preview span {
  font-size: 1.1rem;
  font-weight: 500;
}

.download-only-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  min-height: 300px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  min-height: 300px;
  color: #4a5568;
}

.loading-container i {
  font-size: 2rem;
  color: var(--primary-color);
}

.loading-container span {
  font-size: 1.1rem;
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 200px;
}

.file-preview:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.file-icon {
  font-size: 4rem;
}

.file-icon.text-red-500, .file-icon.text-red-600 {
  color: #dc2626;
}

.file-icon.text-blue-600 {
  color: #2563eb;
}

.file-icon.text-green-600 {
  color: #16a34a;
}

.file-icon.text-purple-600 {
  color: #9333ea;
}

.file-icon.text-gray-600 {
  color: #4b5563;
}

.file-icon.fa-file-pdf {
  color: #dc2626;
}

.file-icon.fa-file-word {
  color: #2563eb;
}

.file-icon.fa-file-excel {
  color: #16a34a;
}

.file-icon.fa-file-powerpoint {
  color: #ea580c;
}

.file-icon.fa-file-image {
  color: #7c3aed;
}

.file-icon.fa-file-video {
  color: #0891b2;
}

.file-icon.fa-file-audio {
  color: #db2777;
}

.file-icon.fa-file-archive {
  color: #854d0e;
}

.file-icon.fa-file-code {
  color: #475569;
}

.file-icon.fa-file {
  color: #64748b;
}

.compact-file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.compact-file-preview:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.file-info i {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.file-name {
  font-size: 0.95rem;
  color: #4a5568;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.compact-download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  flex-shrink: 0;
}

.compact-download-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.2);
}

.compact-download-btn i {
  font-size: 1rem;
}

/* Стили для иконок файлов */
.file-info i.fa-file-pdf {
  color: #dc2626;
}

.file-info i.fa-file-word {
  color: #2563eb;
}

.file-info i.fa-file-excel {
  color: #16a34a;
}

.file-info i.fa-file-powerpoint {
  color: #ea580c;
}

.file-info i.fa-file-image {
  color: #7c3aed;
}

.file-info i.fa-file-video {
  color: #0891b2;
}

.file-info i.fa-file-audio {
  color: #db2777;
}

.file-info i.fa-file-archive {
  color: #854d0e;
}

.file-info i.fa-file-code {
  color: #475569;
}

.file-info i.fa-file {
  color: #64748b;
}

.enrolled-students {
  margin-top: 2rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.enrolled-students h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
  font-size: 1.1rem;
  text-align: center;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.student-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.student-name {
  font-weight: 500;
  color: var(--text-color);
}

.enrollment-date {
  font-size: 0.875rem;
  color: #6c757d;
}

.course-content-title {
  text-align: center;
  width: 100%;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0;
  margin-top: 0;
}

.panel-header-centered {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  gap: 1.5rem;
}

.panel-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.assignment-btn {
  background: linear-gradient(90deg, #7f53ac, #657ced);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(101, 124, 237, 0.15);
  transition: all 0.3s;
}

.assignment-btn:hover {
  background: linear-gradient(90deg, #657ced, #7f53ac);
  transform: translateY(-2px) scale(1.04);
}

.add-btn {
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.15);
  transition: all 0.3s;
  cursor: pointer;
}
.add-btn:hover {
  background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
  transform: translateY(-2px) scale(1.04);
}

.content-list {
  margin-top: 2.5rem;
}

.pseudo-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.2rem;
  margin-top: 1.5rem;
}
.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.assignment-item {
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem;
  margin-bottom: 0.5rem;
}
.assignment-title-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}
.assignment-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.assignment-deadline {
  font-size: 0.95rem;
  color: #e53e3e;
  font-weight: 500;
}
.assignment-description {
  color: #4b5563;
  margin-bottom: 0.5rem;
}
.assignment-files {
  margin-top: 0.5rem;
}
.assignment-files-label {
  font-weight: 600;
  margin-right: 0.5rem;
}
.assignment-file-link {
  color: var(--primary-color);
  margin-right: 1rem;
  text-decoration: underline;
  font-size: 0.98rem;
}
.no-assignments {
  color: #6c757d;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
}
.assignment-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.styled-assignment-item {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
.styled-assignment-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.styled-assignment-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.styled-assignment-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.styled-assignment-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1f2937;
}
.styled-assignment-deadline {
  font-size: 0.95rem;
  color: #e53e3e;
  font-weight: 500;
}
.unknown-date {
  color: #e53e3e;
  font-style: italic;
}
.styled-assignment-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}
.styled-assignment-description {
  color: #4b5563;
  margin-bottom: 1rem;
  font-size: 1rem;
}
.styled-assignment-files {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.styled-assignment-files-label {
  font-weight: 600;
  margin-right: 0.5rem;
}
.styled-file-link-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.25rem 0.75rem;
  margin-right: 0.5rem;
  font-size: 0.98rem;
}
.styled-file-icon {
  font-size: 1.1rem;
  color: var(--primary-color);
}
.styled-assignment-file-link {
  color: var(--primary-color);
  text-decoration: underline;
  font-size: 0.98rem;
}
.styled-assignment-fields-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}
.styled-assignment-fields-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.styled-assignment-fields-label {
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.styled-assignment-title-view {
  font-size: 1.05rem;
  color: #1f2937;
  font-weight: 500;
  padding: 0.25rem 0;
}
.assignment-deadline-block {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.assignment-files-block {
  width: 100%;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
}

.assignment-files {
  width: 100%;
  margin: 0;
  padding: 0;
}

.file-preview-container {
  width: 100%;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: #ffffff;
  transition: all 0.3s ease;
}

.file-preview-container:last-child {
  margin-bottom: 0;
}

.file-preview-container:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.1);
}

.pdf-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.material-document {
  width: 100%;
  height: 700px;
  border: none;
  background: #fff;
  display: block;
}

.document-actions {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e2e8f0;
}

.assignments-list .material-item {
  width: 100%;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.assignments-list .material-content {
  width: 100%;
  margin: 0;
  padding: 0;
}

.assignments-list .document-container {
  width: 100%;
  margin: 0;
  padding: 0;
}

.assignments-list .document-preview {
  width: 100%;
  margin: 0;
  padding: 0;
}

.assignment-files-label {
  display: block;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4a5568;
}

.compact-file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-name {
  font-size: 0.95rem;
  color: #4a5568;
}

.compact-download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.compact-download-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}
</style>