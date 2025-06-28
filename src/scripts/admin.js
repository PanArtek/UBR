/**
 * Admin Panel JavaScript
 * Simple admin functionality for UBR project management
 */

class AdminPanel {
  
  static showAddForm() {
    window.location.href = '/UBR/admin/edit/';
  }
  
  static editProject(projectId) {
    window.location.href = `/UBR/admin/edit/?id=${projectId}`;
  }
  
  static deleteProject(projectId) {
    if (confirm('Czy na pewno chcesz usunąć ten projekt?')) {
      // In production, this would make API call to delete project
      this.removeProjectFromStorage(projectId);
      this.showNotification('Projekt został usunięty', 'success');
      
      // Refresh the page to show updated list
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  
  static toggleProjectVisibility(projectId) {
    // In production, this would make API call to toggle visibility
    const projects = this.getProjectsFromStorage();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      project.isVisible = !project.isVisible;
      this.saveProjectsToStorage(projects);
      this.showNotification(
        `Projekt "${project.title}" został ${project.isVisible ? 'opublikowany' : 'ukryty'}`,
        'success'
      );
      
      // Refresh to show changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  
  static handleImageUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    
    if (!preview) return;
    
    // Clear existing preview
    preview.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const div = document.createElement('div');
          div.className = 'relative group bg-gray-100 rounded-lg overflow-hidden';
          div.innerHTML = `
            <img src="${e.target.result}" class="w-full h-24 object-cover" alt="Preview ${index + 1}" />
            <button onclick="this.parentElement.remove()" 
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              ×
            </button>
            <div class="p-2">
              <input type="text" placeholder="Opis zdjęcia..." 
                     class="w-full text-xs p-1 border rounded" 
                     data-image-index="${index}" />
            </div>
          `;
          preview.appendChild(div);
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  static saveProject(formData) {
    // Collect form data
    const projectData = {
      id: formData.get('projectId') || this.generateProjectId(),
      title: formData.get('title'),
      category: formData.get('category'),
      location: formData.get('location'),
      area: formData.get('area'),
      year: formData.get('year') || new Date().getFullYear().toString(),
      description: formData.get('description'),
      scope: formData.get('scope'),
      isVisible: formData.get('isVisible') === 'on',
      createdAt: new Date().toISOString(),
      order: Date.now(),
      images: this.collectImageData()
    };
    
    // Save to localStorage (in production, this would be an API call)
    this.saveProjectToStorage(projectData);
    
    this.showNotification('Projekt został zapisany!', 'success');
    
    // Redirect after save
    setTimeout(() => {
      window.location.href = '/UBR/admin/projects/';
    }, 1500);
  }
  
  static collectImageData() {
    const preview = document.getElementById('imagePreview');
    if (!preview) return [];
    
    const images = [];
    const imageElements = preview.querySelectorAll('img');
    
    imageElements.forEach((img, index) => {
      const descInput = preview.querySelector(`input[data-image-index="${index}"]`);
      images.push({
        id: `img-${Date.now()}-${index}`,
        url: img.src, // In production, this would be the uploaded file URL
        caption: descInput ? descInput.value : '',
        isMain: index === 0,
        order: index + 1
      });
    });
    
    return images;
  }
  
  static generateProjectId() {
    return 'proj-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  // Storage methods (replace with API calls in production)
  static getProjectsFromStorage() {
    try {
      const projects = localStorage.getItem('ubr_projects');
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      console.error('Error reading projects from storage:', error);
      return [];
    }
  }
  
  static saveProjectsToStorage(projects) {
    try {
      localStorage.setItem('ubr_projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to storage:', error);
    }
  }
  
  static saveProjectToStorage(projectData) {
    const projects = this.getProjectsFromStorage();
    const existingIndex = projects.findIndex(p => p.id === projectData.id);
    
    if (existingIndex >= 0) {
      // Update existing project
      projects[existingIndex] = { ...projects[existingIndex], ...projectData };
    } else {
      // Add new project
      projects.push(projectData);
    }
    
    this.saveProjectsToStorage(projects);
  }
  
  static removeProjectFromStorage(projectId) {
    const projects = this.getProjectsFromStorage();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    this.saveProjectsToStorage(filteredProjects);
  }
  
  // Utility methods
  static showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full ${
      type === 'success' ? 'bg-green-600' : 
      type === 'error' ? 'bg-red-600' : 
      type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${this.getNotificationIcon(type)}</span>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
  
  static getNotificationIcon(type) {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
  
  static logout() {
    if (confirm('Czy na pewno chcesz się wylogować?')) {
      // Clear session
      sessionStorage.removeItem('ubr_admin_logged_in');
      sessionStorage.removeItem('ubr_admin_login_time');
      
      // Redirect to login
      window.location.href = '/UBR/admin/';
    }
  }
  
  static isLoggedIn() {
    const isLoggedIn = sessionStorage.getItem('ubr_admin_logged_in');
    const loginTime = sessionStorage.getItem('ubr_admin_login_time');
    
    if (!isLoggedIn || !loginTime) return false;
    
    // Check if session is not older than 8 hours
    const now = Date.now();
    const sessionAge = now - parseInt(loginTime);
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    
    if (sessionAge > maxAge) {
      this.logout();
      return false;
    }
    
    return true;
  }
  
  // Form validation
  static validateProjectForm(formData) {
    const required = ['title', 'category', 'location', 'description'];
    const errors = [];
    
    required.forEach(field => {
      if (!formData.get(field) || formData.get(field).trim() === '') {
        errors.push(`Pole "${field}" jest wymagane`);
      }
    });
    
    if (errors.length > 0) {
      this.showNotification(errors.join(', '), 'error');
      return false;
    }
    
    return true;
  }
  
  // Features management
  static addFeature(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    
    if (!input || !list) return;
    
    const value = input.value.trim();
    if (value === '') return;
    
    // Check if feature already exists
    const existingFeatures = Array.from(list.children).map(child => 
      child.textContent.replace('×', '').trim()
    );
    
    if (existingFeatures.includes(value)) {
      this.showNotification('Ta cecha już istnieje', 'warning');
      return;
    }
    
    // Create feature element
    const featureElement = document.createElement('span');
    featureElement.className = 'bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2';
    featureElement.innerHTML = `
      ${value}
      <button type="button" onclick="this.parentElement.remove()" 
              class="hover:bg-red-200 rounded-full w-5 h-5 flex items-center justify-center text-red-600">
        ×
      </button>
    `;
    
    list.appendChild(featureElement);
    input.value = '';
  }
  
  // Image upload helpers
  static setupImageUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!input || !preview) return;
    
    // File input change
    input.addEventListener('change', (e) => {
      this.handleImageUpload(e);
    });
    
    // Drag and drop setup
    const dropZone = input.parentElement;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('border-blue-400', 'bg-blue-50');
      });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('border-blue-400', 'bg-blue-50');
      });
    });
    
    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      input.files = files;
      this.handleImageUpload({ target: { files } });
    });
  }
}

// Event listeners setup
document.addEventListener('DOMContentLoaded', () => {
  // Setup image upload if elements exist
  AdminPanel.setupImageUpload('imageUpload', 'imagePreview');
  
  // Setup features input
  const featuresInput = document.getElementById('featuresInput');
  if (featuresInput) {
    featuresInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        AdminPanel.addFeature('featuresInput', 'featuresList');
      }
    });
  }
  
  // Setup form submission
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(projectForm);
      
      if (AdminPanel.validateProjectForm(formData)) {
        AdminPanel.saveProject(formData);
      }
    });
  }
});

// Export for global use
window.AdminPanel = AdminPanel;