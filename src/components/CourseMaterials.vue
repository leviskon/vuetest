<template>
  <div class="materials-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка материалов...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="materials.length === 0" class="no-materials">
      <i class="fas fa-book"></i>
      <p>Материалы курса пока не добавлены</p>
    </div>
    
    <div v-else class="materials-list">
      <div v-for="material in materials" :key="material.id" class="material-card">
        <div class="material-header">
          <h3>{{ material.title }}</h3>
          <div class="material-header-actions">
            <span class="material-type" :class="getTypeClass(material.type.id)">
              {{ getTypeName(material.type.id) }}
            </span>
            <button 
              v-if="!isMaterialCompleted(material.id)"
              @click="markMaterialAsCompleted(material.id)"
              class="complete-btn"
              title="Отметить как пройденный"
            >
              <i class="fas fa-check"></i>
              Отметить как пройденный
            </button>
            <span v-else class="completed-badge">
              <i class="fas fa-check-circle"></i>
              Пройдено
            </span>
          </div>
        </div>
        
        <p class="material-description">{{ material.description }}</p>
        
        <div class="material-content">
          <div v-if="material.type.id === 1" class="video-container">
            <video 
              v-if="material.fileUrl"
              :src="material.fileUrl" 
              controls
              controlsList="nodownload"
              preload="auto"
              class="material-video"
            ></video>
            <div v-else class="no-content">
              <button @click="displayMaterial(material, 0)" class="load-btn">
                <i class="fas fa-play"></i>
                Загрузить видео
              </button>
            </div>
          </div>

          <div v-else-if="material.type.id === 2" class="document-container">
            <div v-if="material.files && material.files.length > 0" class="document-list">
              <div v-for="(file, index) in material.files" :key="index" class="file-item compact-file-preview">
                 <div class="file-info">
                    <i :class="getFileIcon(file)"></i>
                    <span class="file-name">{{ file.name }}</span>
                  </div>
                  <template v-if="isPdfFile(file.name)">
                     <button 
                        v-if="material.fileUrl && material.currentFileIndex === index"
                        @click="downloadMaterial(material.id, index)" 
                        class="compact-download-btn"
                      >
                        <i class="fas fa-download"></i> Скачать PDF
                      </button>
                       <button 
                        v-else
                        @click="displayMaterial(material, index)" 
                        class="compact-download-btn"
                      >
                        <i class="fas fa-eye"></i> Просмотреть PDF
                      </button>
                  </template>
                   <button 
                      v-else
                      @click="downloadMaterial(material.id, index)" 
                      class="compact-download-btn"
                    >
                      <i class="fas fa-download"></i> Скачать
                    </button>
              </div>
                 <!-- PDF Viewer if applicable -->
                <div v-if="material.type.id === 2 && material.fileUrl && isPdfFile(material.files[material.currentFileIndex]?.name)" class="pdf-viewer">
                   <object 
                      :data="material.fileUrl" 
                      type="application/pdf" 
                      class="material-document"
                    >
                      <p>Ваш браузер не поддерживает просмотр PDF. <a :href="material.fileUrl" target="_blank" download>Скачайте PDF</a></p>
                    </object>
                </div>

            </div>
            <div v-else class="no-content">
               <i class="fas fa-file"></i>
              <p>Файлы для этого материала пока не добавлены</p>
            </div>
          </div>

          <div v-else class="no-content">
            <p>Неизвестный тип материала</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { materialService } from '@/services/api'

export default {
  name: 'CourseMaterials',
  props: {
    courseId: {
      type: Number,
      required: true
    },
    studentId: {
      type: Number,
      required: true
    },
    initialCompletedMaterialIds: {
      type: Set,
      default: () => new Set()
    }
  },
  data() {
    return {
      materials: [],
      loading: true,
      error: null,
      materialUrls: {},
      completedMaterialIds: new Set()
    }
  },
  created() {
    console.log('CourseMaterials created, courseId:', this.courseId)
    this.loadMaterials()
    this.completedMaterialIds = new Set(this.initialCompletedMaterialIds)
  },
  watch: {
    initialCompletedMaterialIds(newVal) {
      this.completedMaterialIds = new Set(newVal)
    }
  },
  beforeUnmount() {
    Object.values(this.materialUrls).forEach(url => {
      URL.revokeObjectURL(url)
    })
  },
  methods: {
    async loadMaterials() {
      console.log('Начало загрузки материалов для курса:', this.courseId)
      try {
        this.loading = true
        const materials = await materialService.getCourseMaterials(this.courseId)
        console.log('Материалы успешно загружены:', materials)

        this.materials = materials.map(material => ({
          ...material,
          files: material.url ? JSON.parse(material.url).map((url, index) => ({
            name: url.split('/').pop(),
            url: url,
            contentType: this.getContentTypeFromUrl(url),
            index: index
          })) : [],
          fileUrl: null,
          currentFileIndex: 0
        }))

        this.materials.forEach(async material => {
            if (material.type.id === 2) {
                const firstPdfIndex = material.files.findIndex(file =>
                    this.isPdfFile(file.name)
                );
                if (firstPdfIndex !== -1) {
                    await this.displayMaterial(material, firstPdfIndex);
                }
            } else if (material.type.id === 1 && material.files.length > 0) {
                 await this.displayMaterial(material, 0);
            }
        });

        // После загрузки материалов, эмитим их общее количество
        this.$emit('materials-loaded', this.materials.length);

      } catch (error) {
        console.error('Ошибка при загрузке материалов:', error)
        this.error = 'Произошла ошибка при загрузке материалов курса'
      } finally {
        this.loading = false
        console.log('Загрузка материалов завершена, loading:', this.loading)
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
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif'
      };
      return contentTypeMap[extension] || 'application/octet-stream';
    },
    getTypeName(typeId) {
      const types = {
        1: 'Видео',
        2: 'Документ',
        3: 'Домашнее задание',
        4: 'Дополнительный материал'
      }
      return types[typeId] || 'Материал'
    },
    getTypeClass(typeId) {
      const classes = {
        1: 'type-lecture',
        2: 'type-practice',
        3: 'type-homework',
        4: 'type-additional'
      }
      return classes[typeId] || ''
    },
    isPdfFile(fileName) {
      if (!fileName) return false;
      return fileName.toLowerCase().endsWith('.pdf');
    },
     async displayMaterial(material, fileIndex) {
      try {
        console.log('Начало загрузки файла для материала:', material.id, 'Файл индекс:', fileIndex);

        if (!material.files || !material.files[fileIndex]) {
          throw new Error('Файл не найден');
        }

        const file = material.files[fileIndex];

        if (this.materialUrls[material.id]) {
          URL.revokeObjectURL(this.materialUrls[material.id]);
        }

        const response = await fetch(`http://localhost:8080/api/materials/${material.id}/file/${fileIndex}`, {
          credentials: 'include',
           headers: {
            'Accept': file.contentType || 'application/octet-stream'
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке файла');
        }

        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);

        const materialToUpdate = this.materials.find(m => m.id === material.id);
        if (materialToUpdate) {
          materialToUpdate.fileUrl = fileUrl;
          materialToUpdate.currentFileIndex = fileIndex;
          this.materialUrls[material.id] = fileUrl;
        }

        console.log('Создан URL для файла:', fileUrl, 'Имя файла:', file.name);

      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    },
    async downloadMaterial(materialId, fileIndex) {
      try {
        const material = this.materials.find(m => m.id === materialId);
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
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    },
    updateCompletedMaterials(completedIdsSet) {
      console.log('CourseMaterials: updateCompletedMaterials called with', completedIdsSet);
      this.completedMaterialIds = new Set(completedIdsSet);
    },
    
    isMaterialCompleted(materialId) {
      return this.completedMaterialIds.has(materialId);
    },
    
    async markMaterialAsCompleted(materialId) {
      if (this.isMaterialCompleted(materialId)) {
        console.log(`Материал ${materialId} уже отмечен как пройденный.`);
        return;
      }

      try {
        const updatedCompletedIds = Array.from(new Set([...this.completedMaterialIds, materialId]));

        const requestBody = {
          studentId: this.studentId,
          courseId: this.courseId,
          completedMaterials: updatedCompletedIds
        };

        console.log('Отправляем запрос на отметку материала (новый формат):', requestBody);

        const response = await fetch('http://localhost:8080/api/course-progress', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        console.log('Получен ответ на отметку материала:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Текст ошибки:', errorText);
          throw new Error(`Ошибка при отметке материала как пройденного: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log('Материал успешно отмечен на сервере, эмитим material-completed');
        this.$emit('material-completed', materialId);

      } catch (error) {
        console.error('Ошибка при отметке материала как пройденного:', error);
      }
    }
  }
}
</script>

<style scoped>
.materials-container {
  padding: 2rem;
}

.loading, .error, .no-materials {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error i, .no-materials i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #dc3545;
}

.materials-list {
  display: grid;
  gap: 1.5rem;
}

.material-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.material-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.material-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.material-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.material-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.type-lecture {
  background: rgba(76, 201, 240, 0.1);
  color: #4cc9f0;
}

.type-practice {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.type-homework {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.type-additional {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.material-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-left: 4px solid var(--primary-color-light);
  border-radius: 0 8px 8px 0;
}

.material-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  margin-top: 1rem;
}

.video-container {
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-bottom: 56.25%;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-content {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.load-btn {
  padding: 0.75rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.load-btn:hover {
  background-color: var(--primary-color-dark);
}

.document-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.file-item:hover {
  background: #e9ecef;
}

.file-item i {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.file-name {
  font-size: 0.95rem;
  color: #333;
}

.compact-file-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.compact-download-btn {
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.compact-download-btn:hover {
  background-color: var(--primary-color-dark);
}

.compact-download-btn i {
  color: white;
}

.pdf-viewer {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 600px;
  overflow: hidden;
}

.material-document {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
  display: block;
}

.complete-btn {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.complete-btn:hover {
  background: var(--primary-color-dark);
  transform: translateY(-1px);
}

.completed-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 500;
}

.completed-badge i {
  font-size: 1.1rem;
}
</style> 