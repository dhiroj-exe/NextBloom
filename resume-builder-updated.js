// Enhanced Resume Builder JavaScript with Custom Template Support
class ResumeBuilder {
  constructor() {
    this.selectedTemplate = 'modern';
    this.resumeData = {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: []
    };
    this.zoomLevel = 1;
    this.customTemplates = this.loadCustomTemplates();
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadUserData();
    this.loadCustomTemplatesUI();
    this.updatePreview();
  }

  bindEvents() {
    try {
      // Template selection
      document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const template = card.dataset.template;
          if (template) {
            this.selectTemplate(template);
          }
        });
      });

      // Custom template upload
      const uploadBtn = document.getElementById('uploadTemplate');
      const fileInput = document.getElementById('templateFileInput');
      
      if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
          fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
          this.handleTemplateUpload(e);
        });

        // Add drag and drop functionality
        uploadBtn.addEventListener('dragover', (e) => {
          e.preventDefault();
          uploadBtn.classList.add('dragover');
        });

        uploadBtn.addEventListener('dragleave', (e) => {
          e.preventDefault();
          uploadBtn.classList.remove('dragover');
        });

        uploadBtn.addEventListener('drop', (e) => {
          e.preventDefault();
          uploadBtn.classList.remove('dragover');
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            this.handleTemplateFile(files[0]);
          }
        });
      }

      // Auto-fill button
      const autoFillBtn = document.getElementById('autoFillBtn');
      if (autoFillBtn) {
        autoFillBtn.addEventListener('click', () => {
          this.autoFillFromDashboard();
        });
      }

      // Save button
      const saveBtn = document.getElementById('saveBtn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          this.saveResume();
        });
      }

      // Download button
      const downloadBtn = document.getElementById('downloadBtn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          this.downloadPDF();
        });
      }

      // Form inputs
      const personalInputs = ['firstName', 'lastName', 'email', 'phone', 'address', 'summary'];
      personalInputs.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
          input.addEventListener('input', (e) => {
            this.resumeData.personalInfo[field] = e.target.value;
            this.updatePreview();
          });
        }
      });

      // Add buttons
      const addExperienceBtn = document.getElementById('addExperience');
      if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', () => {
          this.addExperienceItem();
        });
      }

      const addEducationBtn = document.getElementById('addEducation');
      if (addEducationBtn) {
        addEducationBtn.addEventListener('click', () => {
          this.addEducationItem();
        });
      }

      const addProjectBtn = document.getElementById('addProject');
      if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
          this.addProjectItem();
        });
      }

      // Skills
      const addSkillBtn = document.getElementById('addSkill');
      const skillInput = document.getElementById('skillInput');
      
      if (addSkillBtn && skillInput) {
        addSkillBtn.addEventListener('click', () => {
          this.addSkill();
        });

        skillInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.addSkill();
          }
        });
      }

      // AI buttons
      const generateSummaryBtn = document.getElementById('generateSummary');
      if (generateSummaryBtn) {
        generateSummaryBtn.addEventListener('click', () => {
          this.generateAISummary();
        });
      }

      const suggestSkillsBtn = document.getElementById('suggestSkills');
      if (suggestSkillsBtn) {
        suggestSkillsBtn.addEventListener('click', () => {
          this.suggestSkills();
        });
      }

      // Zoom controls
      const zoomInBtn = document.getElementById('zoomIn');
      const zoomOutBtn = document.getElementById('zoomOut');
      
      if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
          this.zoomIn();
        });
      }

      if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
          this.zoomOut();
        });
      }

      // Modal close buttons
      const closeSuccessModal = document.getElementById('closeSuccessModal');
      if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', () => {
          this.hideModal('successModal');
        });
      }

      const closeErrorModal = document.getElementById('closeErrorModal');
      if (closeErrorModal) {
        closeErrorModal.addEventListener('click', () => {
          this.hideModal('errorModal');
        });
      }

    } catch (error) {
      console.error('Error binding events:', error);
    }
  }

  selectTemplate(templateName) {
    try {
      // Remove selected class from all templates
      document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
      });

      // Add selected class to clicked template
      const selectedCard = document.querySelector(`[data-template="${templateName}"]`);
      if (selectedCard) {
        selectedCard.classList.add('selected');
      }

      this.selectedTemplate = templateName;
      this.updatePreview();
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  }

  handleTemplateUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    this.handleTemplateFile(file);
  }

  handleTemplateFile(file) {
    // Validate file type
    const allowedTypes = ['text/html', 'application/json', 'text/plain'];
    const allowedExtensions = ['.html', '.htm', '.json'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      this.showErrorMessage('Please upload a valid HTML or JSON file.');
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      this.showErrorMessage('File size must be less than 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let templateData;
        
        if (file.type === 'application/json' || fileExtension === '.json') {
          templateData = JSON.parse(e.target.result);
          // Validate JSON structure
          if (!templateData.name || !templateData.html) {
            throw new Error('Invalid JSON template format. Must include "name" and "html" fields.');
          }
        } else {
          // HTML template
          const htmlContent = e.target.result;
          
          // Basic HTML validation
          if (!htmlContent.includes('<html') && !htmlContent.includes('<div')) {
            throw new Error('Invalid HTML template format.');
          }
          
          templateData = {
            name: file.name.replace(/\.[^/.]+$/, ""),
            html: htmlContent,
            type: 'html'
          };
        }

        this.saveCustomTemplate(templateData);
        this.loadCustomTemplatesUI();
        this.showSuccessMessage('Custom template uploaded successfully!');
      } catch (error) {
        console.error('Error uploading template:', error);
        this.showErrorMessage(`Error uploading template: ${error.message}`);
      }
    };

    reader.onerror = () => {
      this.showErrorMessage('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  }

  saveCustomTemplate(templateData) {
    const customTemplates = this.loadCustomTemplates();
    const templateId = 'custom_' + Date.now();
    
    customTemplates[templateId] = {
      ...templateData,
      id: templateId,
      uploadDate: new Date().toISOString()
    };

    localStorage.setItem('customResumeTemplates', JSON.stringify(customTemplates));
    this.customTemplates = customTemplates;
  }

  loadCustomTemplates() {
    try {
      const stored = localStorage.getItem('customResumeTemplates');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading custom templates:', error);
      return {};
    }
  }

  loadCustomTemplatesUI() {
    const customTemplatesGrid = document.getElementById('customTemplatesGrid');
    const customTemplatesSection = document.getElementById('customTemplatesSection');
    
    if (!customTemplatesGrid || !customTemplatesSection) return;

    const templates = Object.values(this.customTemplates);
    
    if (templates.length === 0) {
      customTemplatesSection.classList.add('hidden');
      return;
    }

    customTemplatesSection.classList.remove('hidden');
    customTemplatesGrid.innerHTML = '';

    templates.forEach(template => {
      const templateCard = this.createCustomTemplateCard(template);
      customTemplatesGrid.appendChild(templateCard);
    });
  }

  createCustomTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card rounded-xl shadow-lg overflow-hidden relative';
    card.dataset.template = template.id;
    
    card.innerHTML = `
      <div class="h-48 bg-gradient-to-br from-purple-500 to-blue-600 p-4 text-white relative">
        <button class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors" onclick="resumeBuilder.deleteCustomTemplate('${template.id}')">
          <i class="fas fa-times"></i>
        </button>
        <div class="text-sm font-semibold mb-2">${template.name}</div>
        <div class="text-xs opacity-90 mb-4">Custom Template</div>
        <div class="space-y-1">
          <div class="h-1 bg-white/30 rounded"></div>
          <div class="h-1 bg-white/30 rounded w-3/4"></div>
          <div class="h-1 bg-white/30 rounded w-1/2"></div>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-2">${template.name}</h3>
        <p class="text-sm text-gray-600">Uploaded ${new Date(template.uploadDate).toLocaleDateString()}</p>
      </div>
    `;

    return card;
  }

  deleteCustomTemplate(templateId) {
    if (confirm('Are you sure you want to delete this custom template?')) {
      delete this.customTemplates[templateId];
      localStorage.setItem('customResumeTemplates', JSON.stringify(this.customTemplates));
      this.loadCustomTemplatesUI();
      
      // If the deleted template was selected, switch to modern
      if (this.selectedTemplate === templateId) {
        this.selectTemplate('modern');
      }
    }
  }

  addExperienceItem() {
    const container = document.getElementById('experienceContainer');
    if (!container) return;

    const experienceItem = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };

    this.resumeData.experience.push(experienceItem);
    const index = this.resumeData.experience.length - 1;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'bg-gray-50 p-4 rounded-lg mb-4';
    itemDiv.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-medium text-gray-900">Experience ${index + 1}</h4>
        <button type="button" class="text-red-600 hover:text-red-800" onclick="resumeBuilder.removeExperience(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                 onchange="resumeBuilder.updateExperience(${index}, 'company', this.value)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateExperience(${index}, 'position', this.value)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input type="month" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateExperience(${index}, 'startDate', this.value)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input type="month" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateExperience(${index}, 'endDate', this.value)">
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onchange="resumeBuilder.updateExperience(${index}, 'description', this.value)"></textarea>
        </div>
      </div>
    `;

    container.appendChild(itemDiv);
  }

  updateExperience(index, field, value) {
    if (this.resumeData.experience[index]) {
      this.resumeData.experience[index][field] = value;
      this.updatePreview();
    }
  }

  removeExperience(index) {
    this.resumeData.experience.splice(index, 1);
    this.refreshExperienceContainer();
    this.updatePreview();
  }

  refreshExperienceContainer() {
    const container = document.getElementById('experienceContainer');
    if (!container) return;
    
    container.innerHTML = '';
    this.resumeData.experience.forEach((_, index) => {
      this.addExperienceItem();
    });
  }

  addEducationItem() {
    const container = document.getElementById('educationContainer');
    if (!container) return;

    const educationItem = {
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    };

    this.resumeData.education.push(educationItem);
    const index = this.resumeData.education.length - 1;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'bg-gray-50 p-4 rounded-lg mb-4';
    itemDiv.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-medium text-gray-900">Education ${index + 1}</h4>
        <button type="button" class="text-red-600 hover:text-red-800" onclick="resumeBuilder.removeEducation(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Institution</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateEducation(${index}, 'institution', this.value)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateEducation(${index}, 'degree', this.value)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateEducation(${index}, 'field', this.value)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Graduation Date</label>
          <input type="month" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateEducation(${index}, 'graduationDate', this.value)">
        </div>
      </div>
    `;

    container.appendChild(itemDiv);
  }

  updateEducation(index, field, value) {
    if (this.resumeData.education[index]) {
      this.resumeData.education[index][field] = value;
      this.updatePreview();
    }
  }

  removeEducation(index) {
    this.resumeData.education.splice(index, 1);
    this.refreshEducationContainer();
    this.updatePreview();
  }

  refreshEducationContainer() {
    const container = document.getElementById('educationContainer');
    if (!container) return;
    
    container.innerHTML = '';
    this.resumeData.education.forEach((_, index) => {
      this.addEducationItem();
    });
  }

  addProjectItem() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    const projectItem = {
      name: '',
      description: '',
      technologies: '',
      link: ''
    };

    this.resumeData.projects.push(projectItem);
    const index = this.resumeData.projects.length - 1;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'bg-gray-50 p-4 rounded-lg mb-4';
    itemDiv.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-medium text-gray-900">Project ${index + 1}</h4>
        <button type="button" class="text-red-600 hover:text-red-800" onclick="resumeBuilder.removeProject(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateProject(${index}, 'name', this.value)">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateProject(${index}, 'technologies', this.value)">
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onchange="resumeBuilder.updateProject(${index}, 'description', this.value)"></textarea>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Project Link (Optional)</label>
          <input type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                 onchange="resumeBuilder.updateProject(${index}, 'link', this.value)">
        </div>
      </div>
    `;

    container.appendChild(itemDiv);
  }

  updateProject(index, field, value) {
    if (this.resumeData.projects[index]) {
      this.resumeData.projects[index][field] = value;
      this.updatePreview();
    }
  }

  removeProject(index) {
    this.resumeData.projects.splice(index, 1);
    this.refreshProjectsContainer();
    this.updatePreview();
  }

  refreshProjectsContainer() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    this.resumeData.projects.forEach((_, index) => {
      this.addProjectItem();
    });
  }

  addSkill() {
    const skillInput = document.getElementById('skillInput');
    if (!skillInput || !skillInput.value.trim()) return;

    const skill = skillInput.value.trim();
    if (!this.resumeData.skills.includes(skill)) {
      this.resumeData.skills.push(skill);
      this.updateSkillsDisplay();
      this.updatePreview();
    }

    skillInput.value = '';
  }

  updateSkillsDisplay() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;

    container.innerHTML = '';
    this.resumeData.skills.forEach((skill, index) => {
      const skillTag = document.createElement('span');
      skillTag.className = 'skill-tag inline-flex items-center space-x-2';
      skillTag.innerHTML = `
        <span>${skill}</span>
        <button type="button" class="text-white/80 hover:text-white" onclick="resumeBuilder.removeSkill(${index})">
          <i class="fas fa-times text-xs"></i>
        </button>
      `;
      container.appendChild(skillTag);
    });
  }

  removeSkill(index) {
    this.resumeData.skills.splice(index, 1);
    this.updateSkillsDisplay();
    this.updatePreview();
  }

  async autoFillFromDashboard() {
    this.showModal('loadingModal');
    
    try {
      // Simulate API call to dashboard
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - in real implementation, this would come from the dashboard API
      const dashboardData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        summary: 'Experienced software developer with expertise in web technologies and AI integration.',
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AI/ML']
      };

      // Fill form fields
      Object.keys(dashboardData).forEach(key => {
        if (key === 'skills') {
          this.resumeData.skills = [...dashboardData.skills];
          this.updateSkillsDisplay();
        } else {
          const input = document.getElementById(key);
          if (input) {
            input.value = dashboardData[key];
            this.resumeData.personalInfo[key] = dashboardData[key];
          }
        }
      });

      this.updatePreview();
      this.hideModal('loadingModal');
      this.showSuccessMessage('Data auto-filled from dashboard successfully!');
      
    } catch (error) {
      console.error('Error auto-filling from dashboard:', error);
      this.hideModal('loadingModal');
      this.showErrorMessage('Error loading data from dashboard.');
    }
  }

  async generateAISummary() {
    const summaryField = document.getElementById('summary');
    if (!summaryField) return;

    this.showModal('loadingModal');
    
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const aiSummary = "Dynamic and results-driven professional with extensive experience in software development and project management. Proven track record of delivering innovative solutions and leading cross-functional teams to achieve organizational goals. Passionate about leveraging cutting-edge technologies to drive business growth and operational efficiency.";
      
      summaryField.value = aiSummary;
      this.resumeData.personalInfo.summary = aiSummary;
      this.updatePreview();
      
      this.hideModal('loadingModal');
      this.showSuccessMessage('AI summary generated successfully!');
      
    } catch (error) {
      console.error('Error generating AI summary:', error);
      this.hideModal('loadingModal');
      this.showErrorMessage('Error generating AI summary.');
    }
  }

  async suggestSkills() {
    this.showModal('loadingModal');
    
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestedSkills = ['Problem Solving', 'Team Leadership', 'Communication', 'Project Management', 'Data Analysis'];
      
      suggestedSkills.forEach(skill => {
        if (!this.resumeData.skills.includes(skill)) {
          this.resumeData.skills.push(skill);
        }
      });
      
      this.updateSkillsDisplay();
      this.updatePreview();
      
      this.hideModal('loadingModal');
      this.showSuccessMessage('Skills suggested and added successfully!');
      
    } catch (error) {
      console.error('Error suggesting skills:', error);
      this.hideModal('loadingModal');
      this.showErrorMessage('Error suggesting skills.');
    }
  }

  updatePreview() {
    const previewContainer = document.getElementById('resumePreview');
    if (!previewContainer) return;

    try {
      let templateHTML = '';
      
      if (this.customTemplates[this.selectedTemplate]) {
        templateHTML = this.renderCustomTemplate(this.customTemplates[this.selectedTemplate]);
      } else {
        templateHTML = this.renderBuiltInTemplate(this.selectedTemplate);
      }

      previewContainer.innerHTML = templateHTML;
      previewContainer.style.transform = `scale(${this.zoomLevel})`;
    } catch (error) {
      console.error('Error updating preview:', error);
      previewContainer.innerHTML = '<div class="p-8 text-center text-red-600">Error rendering preview</div>';
    }
  }

  renderCustomTemplate(template) {
    if (template.type === 'html') {
      // Replace placeholders in HTML template
      let html = template.html;
      
      // Replace personal info placeholders
      Object.keys(this.resumeData.personalInfo).forEach(key => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(placeholder, this.resumeData.personalInfo[key] || '');
      });

      // Replace skills
      const skillsHTML = this.resumeData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join(' ');
      html = html.replace(/{{skills}}/g, skillsHTML);

      // Replace experience
      const experienceHTML = this.resumeData.experience.map(exp => `
        <div class="mb-4">
          <h4 class="font-semibold">${exp.position} at ${exp.company}</h4>
          <p class="text-sm text-gray-600">${exp.startDate} - ${exp.endDate}</p>
          <p class="mt-2">${exp.description}</p>
        </div>
      `).join('');
      html = html.replace(/{{experience}}/g, experienceHTML);

      return html;
    }
    
    return this.renderBuiltInTemplate('modern'); // Fallback
  }

  renderBuiltInTemplate(templateName) {
    const { personalInfo, experience, education, skills, projects } = this.resumeData;
    const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim();

    switch (templateName) {
      case 'modern':
        return this.renderModernTemplate(fullName, personalInfo, experience, education, skills, projects);
      case 'classic':
        return this.renderClassicTemplate(fullName, personalInfo, experience, education, skills, projects);
      case 'minimal':
        return this.renderMinimalTemplate(fullName, personalInfo, experience, education, skills, projects);
      case 'creative':
        return this.renderCreativeTemplate(fullName, personalInfo, experience, education, skills, projects);
      case 'executive':
        return this.renderExecutiveTemplate(fullName, personalInfo, experience, education, skills, projects);
      case 'tech':
        return this.renderTechTemplate(fullName, personalInfo, experience, education, skills, projects);
      case 'academic':
        return this.renderAcademicTemplate(fullName, personalInfo, experience, education, skills, projects);
      default:
        return this.renderModernTemplate(fullName, personalInfo, experience, education, skills, projects);
    }
  }

  renderModernTemplate(fullName, personalInfo, experience, education, skills, projects) {
    return `
      <div class="template-modern bg-white p-8 min-h-full">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-8 mb-8">
          <h1 class="text-3xl font-bold mb-2">${fullName || 'Your Name'}</h1>
          <p class="text-xl opacity-90 mb-4">Professional Title</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><i class="fas fa-envelope mr-2"></i>${personalInfo.email || 'email@example.com'}</div>
            <div><i class="fas fa-phone mr-2"></i>${personalInfo.phone || '+1 (555) 123-4567'}</div>
            <div class="md:col-span-2"><i class="fas fa-map-marker-alt mr-2"></i>${personalInfo.address || 'Your Address'}</div>
          </div>
        </div>

        ${personalInfo.summary ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Professional Summary</h2>
            <p class="text-gray-700 leading-relaxed">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Experience</h2>
            ${experience.map(exp => `
              <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-800">${exp.position || 'Position'}</h3>
                <p class="text-lg text-blue-600 font-medium">${exp.company || 'Company'}</p>
                <p class="text-gray-600 mb-2">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
                <p class="text-gray-700">${exp.description || 'Job description...'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Education</h2>
            ${education.map(edu => `
              <div class="mb-4">
                <h3 class="text-xl font-semibold text-gray-800">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                <p class="text-lg text-blue-600 font-medium">${edu.institution || 'Institution'}</p>
                <p class="text-gray-600">${edu.graduationDate || 'Graduation Date'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Skills</h2>
            <div class="flex flex-wrap gap-2">
              ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${projects.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Projects</h2>
            ${projects.map(project => `
              <div class="mb-4">
                <h3 class="text-xl font-semibold text-gray-800">${project.name || 'Project Name'}</h3>
                <p class="text-gray-600 mb-2">${project.technologies || 'Technologies used'}</p>
                <p class="text-gray-700">${project.description || 'Project description...'}</p>
                ${project.link ? `<a href="${project.link}" class="text-blue-600 hover:underline">View Project</a>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderClassicTemplate(fullName, personalInfo, experience, education, skills, projects) {
    return `
      <div class="template-classic bg-white p-8 min-h-full font-serif">
        <div class="text-center border-b-2 border-gray-800 pb-6 mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">${fullName || 'Your Name'}</h1>
          <div class="text-gray-600 space-y-1">
            <p>${personalInfo.email || 'email@example.com'} | ${personalInfo.phone || '+1 (555) 123-4567'}</p>
            <p>${personalInfo.address || 'Your Address'}</p>
          </div>
        </div>

        ${personalInfo.summary ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Professional Summary</h2>
            <p class="text-gray-700 leading-relaxed">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Professional Experience</h2>
            ${experience.map(exp => `
              <div class="mb-6">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">${exp.position || 'Position'}</h3>
                    <p class="text-gray-700 font-medium">${exp.company || 'Company'}</p>
                  </div>
                  <p class="text-gray-600 text-sm">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
                </div>
                <p class="text-gray-700">${exp.description || 'Job description...'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Education</h2>
            ${education.map(edu => `
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                    <p class="text-gray-700">${edu.institution || 'Institution'}</p>
                  </div>
                  <p class="text-gray-600 text-sm">${edu.graduationDate || 'Graduation Date'}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Skills</h2>
            <p class="text-gray-700">${skills.join(' • ')}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderMinimalTemplate(fullName, personalInfo, experience, education, skills, projects) {
    return `
      <div class="template-minimal bg-white p-8 min-h-full border-l-4 border-gray-800">
        <div class="mb-8">
          <h1 class="text-3xl font-light text-gray-800 mb-2">${fullName || 'Your Name'}</h1>
          <div class="text-gray-600 text-sm space-y-1">
            <p>${personalInfo.email || 'email@example.com'}</p>
            <p>${personalInfo.phone || '+1 (555) 123-4567'}</p>
            <p>${personalInfo.address || 'Your Address'}</p>
          </div>
        </div>

        ${personalInfo.summary ? `
          <div class="mb-8">
            <h2 class="text-lg font-medium text-gray-800 mb-3">Summary</h2>
            <p class="text-gray-700 text-sm leading-relaxed">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-lg font-medium text-gray-800 mb-3">Experience</h2>
            ${experience.map(exp => `
              <div class="mb-4">
                <h3 class="font-medium text-gray-800">${exp.position || 'Position'}</h3>
                <p class="text-gray-600 text-sm">${exp.company || 'Company'} | ${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
                <p class="text-gray-700 text-sm mt-1">${exp.description || 'Job description...'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-lg font-medium text-gray-800 mb-3">Education</h2>
            ${education.map(edu => `
              <div class="mb-3">
                <h3 class="font-medium text-gray-800">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                <p class="text-gray-600 text-sm">${edu.institution || 'Institution'} | ${edu.graduationDate || 'Graduation Date'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-lg font-medium text-gray-800 mb-3">Skills</h2>
            <p class="text-gray-700 text-sm">${skills.join(', ')}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderCreativeTemplate(fullName, personalInfo, experience, education, skills, projects) {
    return `
      <div class="template-creative bg-white min-h-full relative overflow-hidden">
        <div class="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-8 relative">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div class="relative z-10">
            <h1 class="text-4xl font-bold mb-2">${fullName || 'Your Name'}</h1>
            <p class="text-xl opacity-90 mb-4">Creative Professional</p>
            <div class="text-sm space-y-1">
              <p>${personalInfo.email || 'email@example.com'}</p>
              <p>${personalInfo.phone || '+1 (555) 123-4567'}</p>
              <p>${personalInfo.address || 'Your Address'}</p>
            </div>
          </div>
        </div>

        <div class="p-8">
          ${personalInfo.summary ? `
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-4 text-pink-600">About Me</h2>
              <p class="text-gray-700 leading-relaxed italic">${personalInfo.summary}</p>
            </div>
          ` : ''}

          ${experience.length > 0 ? `
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-pink-600 mb-4">Experience</h2>
              ${experience.map(exp => `
                <div class="mb-6 bg-gradient-to-r from-pink-50 to-orange-50 p-4 rounded-lg">
                  <h3 class="text-xl font-bold text-gray-800">${exp.position || 'Position'}</h3>
                  <p class="text-pink-600 font-semibold">${exp.company || 'Company'}</p>
                  <p class="text-gray-600 mb-2">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
                  <p class="text-gray-700">${exp.description || 'Job description...'}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${skills.length > 0 ? `
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-pink-600 mb-4">Skills</h2>
              <div class="flex flex-wrap gap-2">
                ${skills.map(skill => `<span class="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderExecutiveTemplate(fullName, personalInfo, experience, education, skills, projects) {
    return `
      <div class="template-executive bg-white p-8 min-h-full">
        <div class="bg-gray-900 text-white p-6 -m-8 mb-8">
          <h1 class="text-4xl font-bold mb-2">${fullName || 'Your Name'}</h1>
          <p class="text-xl text-yellow-300 mb-4">Executive Leader</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>${personalInfo.email || 'email@example.com'}</div>
            <div>${personalInfo.phone || '+1 (555) 123-4567'}</div>
            <div>${personalInfo.address || 'Your Address'}</div>
          </div>
        </div>

        ${personalInfo.summary ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-500 pb-2">Executive Summary</h2>
            <p class="text-gray-700 leading-relaxed text-lg">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-500 pb-2">Leadership Experience</h2>
            ${experience.map(exp => `
              <div class="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 class="text-xl font-bold text-gray-800">${exp.position || 'Position'}</h3>
                <p class="text-lg text-gray-700 font-semibold">${exp.company || 'Company'}</p>
                <p class="text-gray-600 mb-3">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
                <p class="text-gray-700">${exp.description || 'Job description...'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-500 pb-2">Core Competencies</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              ${skills.map(skill => `<div class="bg-yellow-100 text-gray-800 px-3 py-2 rounded font-medium">${skill}</div>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderTechTemplate(fullName, personalInfo, experience, education, skills, projects) {
    return `
      <div class="template-tech bg-white p-8 min-h-full font-mono">
        <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 -m-8 mb-8">
          <h1 class="text-3xl font-bold mb-2">${fullName.replace(' ', '.') || 'Your.Name'}</h1>
          <p class="text-xl opacity-90 mb-4">// Full Stack Developer</p>
          <div class="text-sm space-y-1">
            <p>📧 ${personalInfo.email || 'email@example.com'}</p>
            <p>📱 ${personalInfo.phone || '+1 (555) 123-4567'}</p>
            <p>📍 ${personalInfo.address || 'Your Address'}</p>
          </div>
        </div>

        ${personalInfo.summary ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">/* About */</h2>
            <p class="text-gray-700 leading-relaxed bg-gray-100 p-4 rounded border-l-4 border-green-500">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">/* Experience */</h2>
            ${experience.map(exp => `
              <div class="mb-6 bg-gray-50 p-4 rounded border-l-4 border-teal-500">
                <h3 class="text-lg font-bold text-gray-800">${exp.position || 'Position'} @ ${exp.company || 'Company'}</h3>
                <p class="text-gray-600 mb-2">${exp.startDate || 'Start'} → ${exp.endDate || 'End'}</p>
                <p class="text-gray-700">${exp.description || '// Job description...'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">/* Tech Stack */</h2>
            <div class="bg-gray-900 text-green-400 p-4 rounded">
              <p class="mb-2">const skills = [</p>
              ${skills.map(skill => `<p class="ml-4">"${skill}",</p>`).join('')}
              <p>];</p>
            </div>
          </div>
        ` : ''}

        ${projects.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">/* Projects */</h2>
            ${projects.map(project => `
              <div class="mb-4 bg-gray-50 p-4 rounded border-l-4 border-green-500">
                <h3 class="text-lg font-bold text-gray-800">${project.name || 'Project Name'}</h3>
                <p class="text-gray-600 mb-2">Tech: ${project.technologies || 'Technologies'}</p>
                <p class="text-gray-700">${project.description || '// Project description..'}</p>
                ${project.link ? `<a href="${project.link}" class="text-green-600 hover:underline">🔗 View Project</a>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderAcademicTemplate(fullName, personalInfo, experience, education, skills, projects) {
    return `
      <div class="template-academic bg-white p-8 min-h-full font-serif">
        <div class="text-center mb-8 border-b-2 border-indigo-600 pb-6">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">${fullName || 'Your Name'}</h1>
          <p class="text-xl text-indigo-600 mb-4">Academic Researcher</p>
          <div class="text-gray-600 space-y-1">
            <p>${personalInfo.email || 'email@university.edu'}</p>
            <p>${personalInfo.phone || '+1 (555) 123-4567'}</p>
            <p>${personalInfo.address || 'University Address'}</p>
          </div>
        </div>

        ${personalInfo.summary ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Research Interests</h2>
            <p class="text-gray-700 leading-relaxed text-justify">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Education</h2>
            ${education.map(edu => `
              <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                <p class="text-gray-700 font-medium">${edu.institution || 'Institution'}</p>
                <p class="text-gray-600">${edu.graduationDate || 'Graduation Date'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Academic Experience</h2>
            ${experience.map(exp => `
              <div class="mb-6">
                <h3 class="text-lg font-bold text-gray-800">${exp.position || 'Position'}</h3>
                <p class="text-gray-700 font-medium">${exp.company || 'Institution'}</p>
                <p class="text-gray-600 mb-2">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
                <p class="text-gray-700 text-justify">${exp.description || 'Research description...'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Research Skills</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              ${skills.map(skill => `<div class="text-gray-700">• ${skill}</div>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  zoomIn() {
    if (this.zoomLevel < 2) {
      this.zoomLevel += 0.1;
      this.updatePreview();
    }
  }

  zoomOut() {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.1;
      this.updatePreview();
    }
  }

  saveResume() {
    try {
      const resumeData = {
        ...this.resumeData,
        selectedTemplate: this.selectedTemplate,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem('savedResume', JSON.stringify(resumeData));
      this.showSuccessMessage('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      this.showErrorMessage('Error saving resume.');
    }
  }

  loadUserData() {
    try {
      const savedResume = localStorage.getItem('savedResume');
      if (savedResume) {
        const data = JSON.parse(savedResume);
        this.resumeData = { ...this.resumeData, ...data };
        this.selectedTemplate = data.selectedTemplate || 'modern';
        
        // Populate form fields
        Object.keys(this.resumeData.personalInfo).forEach(key => {
          const input = document.getElementById(key);
          if (input) {
            input.value = this.resumeData.personalInfo[key] || '';
          }
        });

        // Update skills display
        this.updateSkillsDisplay();
        
        // Select the saved template
        this.selectTemplate(this.selectedTemplate);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async downloadPDF() {
    this.showModal('loadingModal');
    
    try {
      const previewElement = document.getElementById('resumePreview');
      if (!previewElement) {
        throw new Error('Preview element not found');
      }

      // Temporarily reset zoom for PDF generation
      const originalZoom = this.zoomLevel;
      this.zoomLevel = 1;
      previewElement.style.transform = 'scale(1)';

      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Restore original zoom
      this.zoomLevel = originalZoom;
      previewElement.style.transform = `scale(${this.zoomLevel})`;

      const fileName = `${this.resumeData.personalInfo.firstName || 'Resume'}_${this.resumeData.personalInfo.lastName || 'Document'}.pdf`;
      pdf.save(fileName);

      this.hideModal('loadingModal');
      this.showSuccessMessage('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.hideModal('loadingModal');
      this.showErrorMessage('Error generating PDF. Please try again.');
    }
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showSuccessMessage(message) {
    const messageElement = document.getElementById('successMessage');
    if (messageElement) {
      messageElement.textContent = message;
    }
    this.showModal('successModal');
  }

  showErrorMessage(message) {
    const messageElement = document.getElementById('errorMessage');
    if (messageElement) {
      messageElement.textContent = message;
    }
    this.showModal('errorModal');
  }
}

// Initialize the resume builder when the page loads
let resumeBuilder;
document.addEventListener('DOMContentLoaded', () => {
  resumeBuilder = new ResumeBuilder();
});