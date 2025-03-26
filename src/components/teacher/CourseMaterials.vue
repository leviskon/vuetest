<template>
  <div class="materials-container">
    <div class="materials-header">
      <h3>Материалы курса</h3>
      <button class="add-material-btn" @click="showCreateMaterialModal">
        <i class="fas fa-plus"></i> Добавить материал
      </button>
    </div>

    <div class="materials-list">
      <draggable 
        v-model="materials" 
        @end="handleDragEnd"
        item-key="id"
        handle=".drag-handle"
      >
        <template #item="{ element }">
          <div class="material-item">
            <div class="material-drag-handle drag-handle">
              <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="material-info">
              <h4>{{ element.title }}</h4>
              <p>{{ element.description }}</p>
              <div class="material-meta">
                <span class="material-type">
                  <i class="fas" :class="getTypeIcon(element.type.name)"></i>
                  {{ element.type.name }}
                </span>
                <span class="material-duration">
                  <i class="fas fa-clock"></i>
                  {{ element.duration }} мин
                </span>
              </div>
            </div>
            <div class="material-actions">
              <button class="edit-btn" @click="editMaterial(element)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" @click="deleteMaterial(element.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Модальное окно для создания/редактирования материала -->
    <MaterialModal
      v-if="showMaterialModal"
      :material="editingMaterial"
      :courseId="courseId"
      @close="closeMaterialModal"
      @save="saveMaterial"
    />
  </div>
</template>

<script>
import { materialService } from '@/services/api';
import MaterialModal from './MaterialModal.vue';
import draggable from 'vuedraggable';

export default {
  name: 'CourseMaterials',
  components: {
    MaterialModal,
    draggable
  },
  props: {
    courseId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      materials: [],
      showMaterialModal: false,
      editingMaterial: null,
      loading: false,
      error: null
    };
  },
  created() {
    this.loadMaterials();
  },
  methods: {
    async loadMaterials() {
      try {
        this.loading = true;
        this.error = null;
        this.materials = await materialService.getCourseMaterials(this.courseId);
      } catch (error) {
        this.error = error.response?.data?.message || 'Ошибка при загрузке материалов';
        console.error('Error loading materials:', error);
      } finally {
        this.loading = false;
      }
    },
    showCreateMaterialModal() {
      this.editingMaterial = null;
      this.showMaterialModal = true;
    },
    editMaterial(material) {
      this.editingMaterial = { ...material };
      this.showMaterialModal = true;
    },
    async deleteMaterial(materialId) {
      if (confirm('Вы уверены, что хотите удалить этот материал?')) {
        try {
          this.loading = true;
          this.error = null;
          await materialService.deleteMaterial(materialId);
          this.materials = this.materials.filter(m => m.id !== materialId);
        } catch (error) {
          this.error = error.response?.data?.message || 'Ошибка при удалении материала';
          console.error('Error deleting material:', error);
        } finally {
          this.loading = false;
        }
      }
    },
    async saveMaterial(materialData) {
      try {
        this.loading = true;
        this.error = null;
        if (this.editingMaterial) {
          const updatedMaterial = await materialService.updateMaterial(
            this.editingMaterial.id,
            materialData
          );
          const index = this.materials.findIndex(m => m.id === this.editingMaterial.id);
          this.materials[index] = updatedMaterial;
        } else {
          const newMaterial = await materialService.createMaterial(materialData);
          this.materials.push(newMaterial);
        }
        this.closeMaterialModal();
      } catch (error) {
        this.error = error.response?.data?.message || 'Ошибка при сохранении материала';
        console.error('Error saving material:', error);
      } finally {
        this.loading = false;
      }
    },
    closeMaterialModal() {
      this.showMaterialModal = false;
      this.editingMaterial = null;
      this.error = null;
    },
    handleDragEnd() {
      // Здесь можно добавить логику сохранения нового порядка материалов
      console.log('Materials reordered:', this.materials);
    },
    getTypeIcon(typeName) {
      const icons = {
        'video': 'fa-video',
        'task': 'fa-tasks',
        'quiz': 'fa-question-circle',
        'file': 'fa-file-alt'
      };
      return icons[typeName.toLowerCase()] || 'fa-file';
    }
  }
};
</script>

<style scoped>
.materials-container {
  padding: 2rem;
}

.materials-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-material-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-material-btn:hover {
  background: #0056b3;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.material-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.material-drag-handle {
  color: #666;
  cursor: move;
}

.material-info {
  flex: 1;
}

.material-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.material-info p {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.material-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.material-type,
.material-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.material-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
}

.edit-btn:hover {
  background: #e9ecef;
  color: #007bff;
}

.delete-btn:hover {
  background: #e9ecef;
  color: #dc3545;
}
</style> 