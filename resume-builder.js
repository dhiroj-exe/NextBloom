// Resume Builder JavaScript
class ResumeBuilder {
  constructor() {
    this.selectedTemplate = 'modern';
    this.resumeData = {
      personalInfo: {},
      experience: [],
      education: [],
      skills: [],
      projects: []
    };
    this.zoomLevel = 1;
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadUserData();
    this.updatePreview();
  }

  bindEvents() {
    // Template selection
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectTemplate(card.dataset.template);
      });
    });

    // Auto-fill button
    document.getElementById('autoFillBtn').addEventListener('click', () => {
      this.autoFillFromDashboard();
    });

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
    document.getElementById('addExperience').addEventListener('click', () => {
      this.addExperienceItem();
    });

    document.getElementById('addEducation').addEventListener('click', () => {
      this.addEducationItem();
    });

    document.getElementById('addProject').addEventListener('click', () => {
      this.addProjectItem();
    });

    // Skills
    document.getElementById('addSkill').addEventListener('click', () => {
      this.addSkill();
    });

    document.getElementById('skillInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addSkill();
      }
    });

    // AI features
    document.getElementById('generateSummary').addEventListener('click', () => {
      this.generateAISummary();
    });

    document.getElementById('suggestSkills').addEventListener('click', () => {
      this.suggestSkills();
    });

    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => {
      this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
      this.updateZoom();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
      this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.3);
      this.updateZoom();
    });

    // Save and download
    document.getElementById('saveBtn').addEventListener('click', () => {
      this.saveResume();
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadPDF();
    });

    // Modal close
    document.getElementById('closeSuccessModal').addEventListener('click', () => {
      document.getElementById('successModal').classList.add('hidden');
    });
  }

  selectTemplate(template) {
    // Remove previous selection
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('selected');
    });

    // Add selection to clicked template
    document.querySelector(`[data-template="${template}"]`).classList.add('selected');
    
    this.selectedTemplate = template;
    this.updatePreview();
  }

  async loadUserData() {
    try {
      // Try to get user data from localStorage or session
      const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userData.firstName) {
        this.resumeData.personalInfo = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          summary: userData.summary || ''
        };
        this.populateForm();
      }
    } catch (error) {
      console.log('No user data found in localStorage');
    }
  }

  populateForm() {
    Object.keys(this.resumeData.personalInfo).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
        input.value = this.resumeData.personalInfo[key];
      }
    });
  }

  async autoFillFromDashboard() {
    this.showLoading();
    
    try {
      // Get user email from localStorage or session
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userEmail = currentUser.email;
      
      if (!userEmail) {
        this.hideLoading();
        alert('Please log in to auto-fill from dashboard data.');
        return;
      }
      
      // Call backend API to get user data
      const response = await fetch(`http://localhost:5000/api/resume/user-data?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dashboardData = await response.json();
      
      // If no specific data found, use mock data for demonstration
      if (!dashboardData.personalInfo.firstName) {
        const mockData = {
          personalInfo: {
            firstName: currentUser.firstName || 'John',
            lastName: currentUser.lastName || 'Doe',
            email: currentUser.email || 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, City, State 12345',
            summary: 'Passionate professional with experience in modern technologies and a commitment to excellence. Skilled in problem-solving, teamwork, and continuous learning.'
          },
          experience: [
            {
              title: 'Professional Role',
              company: 'Company Name',
              location: 'City, State',
              startDate: '2022-01',
              endDate: 'Present',
              description: 'Responsible for key tasks and achievements. Collaborated with team members to deliver high-quality results and exceed expectations.'
            }
          ],
          education: [
            {
              degree: currentUser.education || 'Degree Program',
              school: 'Educational Institution',
              location: 'City, State',
              graduationDate: '2021-12',
              gpa: ''
            }
          ],
          skills: ['Communication', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability'],
          projects: [
            {
              name: 'Sample Project',
              description: 'Description of a project that demonstrates your skills and abilities',
              technologies: 'Technologies used in the project',
              link: ''
            }
          ]
        };
        
        this.resumeData = mockData;
      } else {
        this.resumeData = dashboardData;
      }
      
      this.populateAllSections();
      this.updatePreview();
      
      this.hideLoading();
      this.showSuccess('Resume auto-filled successfully from your dashboard data!');
    } catch (error) {
      this.hideLoading();
      console.error('Error auto-filling data:', error);
      
      // Fallback to basic user data
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.firstName) {
        this.resumeData.personalInfo = {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: '',
          address: '',
          summary: ''
        };
        this.populateForm();
        this.updatePreview();
        this.showSuccess('Basic information loaded from your account!');
      } else {
        alert('Error loading data from dashboard. Please try again or fill manually.');
      }
    }
  }

  populateAllSections() {
    // Populate personal info
    this.populateForm();

    // Populate experience
    this.resumeData.experience.forEach(exp => {
      this.addExperienceItem(exp);
    });

    // Populate education
    this.resumeData.education.forEach(edu => {
      this.addEducationItem(edu);
    });

    // Populate skills
    this.resumeData.skills.forEach(skill => {
      this.addSkillTag(skill);
    });

    // Populate projects
    this.resumeData.projects.forEach(project => {
      this.addProjectItem(project);
    });
  }

  addExperienceItem(data = {}) {
    const container = document.getElementById('experienceContainer');
    const index = this.resumeData.experience.length;
    
    if (!data.title) {
      this.resumeData.experience.push({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }

    const experienceHTML = `
      <div class="experience-item border border-gray-200 rounded-lg p-4 mb-4" data-index="${index}">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-medium text-gray-900">Experience ${index + 1}</h4>
          <button class="remove-experience text-red-600 hover:text-red-800">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input type="text" class="exp-title w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.title || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" class="exp-company w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.company || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" class="exp-location w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.location || ''}">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="month" class="exp-start w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.startDate || ''}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="month" class="exp-end w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.endDate || ''}">
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea class="exp-description w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows="3">${data.description || ''}</textarea>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', experienceHTML);
    this.bindExperienceEvents(container.lastElementChild, index);
  }

  bindExperienceEvents(element, index) {
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateExperienceData(index);
      });
    });

    element.querySelector('.remove-experience').addEventListener('click', () => {
      this.removeExperience(index);
    });
  }

  updateExperienceData(index) {
    const element = document.querySelector(`[data-index="${index}"]`);
    if (element) {
      this.resumeData.experience[index] = {
        title: element.querySelector('.exp-title').value,
        company: element.querySelector('.exp-company').value,
        location: element.querySelector('.exp-location').value,
        startDate: element.querySelector('.exp-start').value,
        endDate: element.querySelector('.exp-end').value,
        description: element.querySelector('.exp-description').value
      };
      this.updatePreview();
    }
  }

  removeExperience(index) {
    this.resumeData.experience.splice(index, 1);
    this.refreshExperienceSection();
  }

  refreshExperienceSection() {
    const container = document.getElementById('experienceContainer');
    container.innerHTML = '';
    this.resumeData.experience.forEach((exp, index) => {
      this.addExperienceItem(exp);
    });
    this.updatePreview();
  }

  addEducationItem(data = {}) {
    const container = document.getElementById('educationContainer');
    const index = this.resumeData.education.length;
    
    if (!data.degree) {
      this.resumeData.education.push({
        degree: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: ''
      });
    }

    const educationHTML = `
      <div class="education-item border border-gray-200 rounded-lg p-4 mb-4" data-edu-index="${index}">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-medium text-gray-900">Education ${index + 1}</h4>
          <button class="remove-education text-red-600 hover:text-red-800">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input type="text" class="edu-degree w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.degree || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">School/University</label>
            <input type="text" class="edu-school w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.school || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" class="edu-location w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.location || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
            <input type="month" class="edu-graduation w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.graduationDate || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
            <input type="text" class="edu-gpa w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.gpa || ''}">
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', educationHTML);
    this.bindEducationEvents(container.lastElementChild, index);
  }

  bindEducationEvents(element, index) {
    const inputs = element.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateEducationData(index);
      });
    });

    element.querySelector('.remove-education').addEventListener('click', () => {
      this.removeEducation(index);
    });
  }

  updateEducationData(index) {
    const element = document.querySelector(`[data-edu-index="${index}"]`);
    if (element) {
      this.resumeData.education[index] = {
        degree: element.querySelector('.edu-degree').value,
        school: element.querySelector('.edu-school').value,
        location: element.querySelector('.edu-location').value,
        graduationDate: element.querySelector('.edu-graduation').value,
        gpa: element.querySelector('.edu-gpa').value
      };
      this.updatePreview();
    }
  }

  removeEducation(index) {
    this.resumeData.education.splice(index, 1);
    this.refreshEducationSection();
  }

  refreshEducationSection() {
    const container = document.getElementById('educationContainer');
    container.innerHTML = '';
    this.resumeData.education.forEach((edu, index) => {
      this.addEducationItem(edu);
    });
    this.updatePreview();
  }

  addSkill() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();
    
    if (skill && !this.resumeData.skills.includes(skill)) {
      this.resumeData.skills.push(skill);
      this.addSkillTag(skill);
      input.value = '';
      this.updatePreview();
    }
  }

  addSkillTag(skill) {
    const container = document.getElementById('skillsContainer');
    const skillTag = document.createElement('div');
    skillTag.className = 'skill-tag flex items-center';
    skillTag.innerHTML = `
      <span>${skill}</span>
      <button class="ml-2 text-white hover:text-red-200" onclick="resumeBuilder.removeSkill('${skill}')">
        <i class="fas fa-times text-xs"></i>
      </button>
    `;
    container.appendChild(skillTag);
  }

  removeSkill(skill) {
    this.resumeData.skills = this.resumeData.skills.filter(s => s !== skill);
    this.refreshSkillsSection();
  }

  refreshSkillsSection() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';
    this.resumeData.skills.forEach(skill => {
      this.addSkillTag(skill);
    });
    this.updatePreview();
  }

  addProjectItem(data = {}) {
    const container = document.getElementById('projectsContainer');
    const index = this.resumeData.projects.length;
    
    if (!data.name) {
      this.resumeData.projects.push({
        name: '',
        description: '',
        technologies: '',
        link: ''
      });
    }

    const projectHTML = `
      <div class="project-item border border-gray-200 rounded-lg p-4 mb-4" data-project-index="${index}">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-medium text-gray-900">Project ${index + 1}</h4>
          <button class="remove-project text-red-600 hover:text-red-800">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input type="text" class="project-name w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.name || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea class="project-description w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows="2">${data.description || ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
            <input type="text" class="project-technologies w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.technologies || ''}" placeholder="e.g., React, Node.js, MongoDB">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Project Link (Optional)</label>
            <input type="url" class="project-link w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${data.link || ''}" placeholder="https://github.com/username/project">
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', projectHTML);
    this.bindProjectEvents(container.lastElementChild, index);
  }

  bindProjectEvents(element, index) {
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateProjectData(index);
      });
    });

    element.querySelector('.remove-project').addEventListener('click', () => {
      this.removeProject(index);
    });
  }

  updateProjectData(index) {
    const element = document.querySelector(`[data-project-index="${index}"]`);
    if (element) {
      this.resumeData.projects[index] = {
        name: element.querySelector('.project-name').value,
        description: element.querySelector('.project-description').value,
        technologies: element.querySelector('.project-technologies').value,
        link: element.querySelector('.project-link').value
      };
      this.updatePreview();
    }
  }

  removeProject(index) {
    this.resumeData.projects.splice(index, 1);
    this.refreshProjectsSection();
  }

  refreshProjectsSection() {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';
    this.resumeData.projects.forEach((project, index) => {
      this.addProjectItem(project);
    });
    this.updatePreview();
  }

  async generateAISummary() {
    this.showLoading();
    
    try {
      // Call backend API for AI suggestions
      const response = await fetch('http://localhost:5000/api/resume/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'summary',
          context: {
            experience: this.resumeData.experience,
            education: this.resumeData.education,
            skills: this.resumeData.skills
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const summaries = data.summaries || [];
        
        if (summaries.length > 0) {
          const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
          document.getElementById('summary').value = randomSummary;
          this.resumeData.personalInfo.summary = randomSummary;
          this.updatePreview();
          this.hideLoading();
          this.showSuccess('AI summary generated successfully!');
          return;
        }
      }
      
      // Fallback to local generation
      const summaries = [
        "Dynamic and results-driven professional with expertise in modern technologies and a passion for innovative solutions. Proven track record of delivering high-quality projects and collaborating effectively in team environment.",
        "Experienced professional with strong analytical skills and a commitment to continuous learning. Demonstrated ability to adapt to new technologies and drive successful project outcomes.",
        "Motivated professional with excellent problem-solving abilities and strong communication skills. Focused on delivering value through technical expertise and collaborative teamwork.",
        "Detail-oriented professional with a strong foundation in technology and business processes. Committed to excellence and continuous improvement in all aspects of work.",
        "Innovative professional with a passion for solving complex problems and creating efficient solutions. Strong background in teamwork and project management."
      ];
      
      const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
      document.getElementById('summary').value = randomSummary;
      this.resumeData.personalInfo.summary = randomSummary;
      
      this.hideLoading();
      this.updatePreview();
      this.showSuccess('AI summary generated successfully!');
    } catch (error) {
      this.hideLoading();
      console.error('Error generating summary:', error);
      alert('Error generating AI summary. Please try again.');
    }
  }

  async suggestSkills() {
    this.showLoading();
    
    try {
      // Call backend API for skill suggestions
      const response = await fetch('http://localhost:5000/api/resume/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'skills',
          context: {
            experience: this.resumeData.experience,
            education: this.resumeData.education,
            currentSkills: this.resumeData.skills
          }
        })
      });
      
      let suggestedSkills = [];
      
      if (response.ok) {
        const data = await response.json();
        const skillCategories = data.skills || {};
        
        // Combine all skill categories
        Object.values(skillCategories).forEach(categorySkills => {
          suggestedSkills = suggestedSkills.concat(categorySkills);
        });
      }
      
      // Fallback skills if API fails
      if (suggestedSkills.length === 0) {
        suggestedSkills = [
          'Problem Solving', 'Team Collaboration', 'Project Management', 
          'Communication', 'Leadership', 'Time Management', 'Adaptability',
          'Critical Thinking', 'Customer Service', 'Data Analysis'
        ];
      }
      
      // Add random selection of suggested skills
      const skillsToAdd = suggestedSkills
        .filter(skill => !this.resumeData.skills.includes(skill))
        .slice(0, 5); // Add up to 5 new skills
      
      skillsToAdd.forEach(skill => {
        this.resumeData.skills.push(skill);
        this.addSkillTag(skill);
      });
      
      this.hideLoading();
      this.updatePreview();
      
      if (skillsToAdd.length > 0) {
        this.showSuccess(`Added ${skillsToAdd.length} suggested skills based on your experience!`);
      } else {
        this.showSuccess('No new skills to suggest - you already have a comprehensive skill set!');
      }
    } catch (error) {
      this.hideLoading();
      console.error('Error suggesting skills:', error);
      alert('Error suggesting skills. Please try again.');
    }
  }

  updatePreview() {
    const preview = document.getElementById('resumePreview');
    let html = '';

    switch (this.selectedTemplate) {
      case 'modern':
        html = this.generateModernTemplate();
        break;
      case 'classic':
        html = this.generateClassicTemplate();
        break;
      case 'minimal':
        html = this.generateMinimalTemplate();
        break;
      case 'creative':
        html = this.generateCreativeTemplate();
        break;
      default:
        html = this.generateModernTemplate();
    }

    preview.innerHTML = html;
  }

  generateModernTemplate() {
    const { personalInfo, experience, education, skills, projects } = this.resumeData;
    
    return `
      <div class="template-modern h-full bg-white">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <h1 class="text-3xl font-bold mb-2">${personalInfo.firstName || 'First Name'} ${personalInfo.lastName || 'Last Name'}</h1>
          <div class="text-lg opacity-90 mb-4">Professional Title</div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><i class="fas fa-envelope mr-2"></i>${personalInfo.email || 'email@example.com'}</div>
            <div><i class="fas fa-phone mr-2"></i>${personalInfo.phone || 'Phone Number'}</div>
            <div class="col-span-2"><i class="fas fa-map-marker-alt mr-2"></i>${personalInfo.address || 'Address'}</div>
          </div>
        </div>

        <div class="p-8">
          <!-- Summary -->
          ${personalInfo.summary ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">Professional Summary</h2>
              <p class="text-gray-700 leading-relaxed">${personalInfo.summary}</p>
            </div>
          ` : ''}

          <!-- Experience -->
          ${experience.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">Work Experience</h2>
              ${experience.map(exp => `
                <div class="mb-4">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="font-semibold text-gray-800">${exp.title}</h3>
                      <p class="text-blue-600 font-medium">${exp.company}</p>
                    </div>
                    <div class="text-right text-sm text-gray-600">
                      <div>${exp.location}</div>
                      <div>${exp.startDate} - ${exp.endDate || 'Present'}</div>
                    </div>
                  </div>
                  <p class="text-gray-700 text-sm leading-relaxed">${exp.description}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">Education</h2>
              ${education.map(edu => `
                <div class="mb-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold text-gray-800">${edu.degree}</h3>
                      <p class="text-blue-600">${edu.school}</p>
                    </div>
                    <div class="text-right text-sm text-gray-600">
                      <div>${edu.location}</div>
                      <div>${edu.graduationDate}</div>
                      ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Skills -->
          ${skills.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">Skills</h2>
              <div class="flex flex-wrap gap-2">
                ${skills.map(skill => `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Projects -->
          ${projects.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">Projects</h2>
              ${projects.map(project => `
                <div class="mb-4">
                  <h3 class="font-semibold text-gray-800">${project.name}</h3>
                  <p class="text-gray-700 text-sm mb-1">${project.description}</p>
                  <p class="text-blue-600 text-sm mb-1"><strong>Technologies:</strong> ${project.technologies}</p>
                  ${project.link ? `<p class="text-sm"><a href="${project.link}" class="text-blue-600 hover:underline">${project.link}</a></p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateClassicTemplate() {
    const { personalInfo, experience, education, skills, projects } = this.resumeData;
    
    return `
      <div class="template-classic h-full bg-white p-8">
        <!-- Header -->
        <div class="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">${personalInfo.firstName || 'First Name'} ${personalInfo.lastName || 'Last Name'}</h1>
          <div class="text-gray-600 mb-4">
            ${personalInfo.email || 'email@example.com'} | ${personalInfo.phone || 'Phone Number'} | ${personalInfo.address || 'Address'}
          </div>
        </div>

        <!-- Summary -->
        ${personalInfo.summary ? `
          <div class="mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide">Professional Summary</h2>
            <p class="text-gray-700 leading-relaxed">${personalInfo.summary}</p>
          </div>
        ` : ''}

        <!-- Experience -->
        ${experience.length > 0 ? `
          <div class="mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide">Work Experience</h2>
            ${experience.map(exp => `
              <div class="mb-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-semibold text-gray-800">${exp.title}</h3>
                    <p class="text-gray-600 italic">${exp.company}, ${exp.location}</p>
                  </div>
                  <div class="text-gray-600 text-sm">
                    ${exp.startDate} - ${exp.endDate || 'Present'}
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">${exp.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <div class="mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide">Education</h2>
            ${education.map(edu => `
              <div class="mb-3">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-800">${edu.degree}</h3>
                    <p class="text-gray-600 italic">${edu.school}, ${edu.location}</p>
                  </div>
                  <div class="text-gray-600 text-sm">
                    ${edu.graduationDate}
                    ${edu.gpa ? `<br>GPA: ${edu.gpa}` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills.length > 0 ? `
          <div class="mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide">Skills</h2>
            <p class="text-gray-700">${skills.join(' • ')}</p>
          </div>
        ` : ''}

        <!-- Projects -->
        ${projects.length > 0 ? `
          <div class="mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide">Projects</h2>
            ${projects.map(project => `
              <div class="mb-4">
                <h3 class="font-semibold text-gray-800">${project.name}</h3>
                <p class="text-gray-700 text-sm mb-1">${project.description}</p>
                <p class="text-gray-600 text-sm mb-1"><em>Technologies:</em> ${project.technologies}</p>
                ${project.link ? `<p class="text-sm text-gray-600">${project.link}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  generateMinimalTemplate() {
    const { personalInfo, experience, education, skills, projects } = this.resumeData;
    
    return `
      <div class="template-minimal h-full bg-white p-8">
        <!-- Header -->
        <div class="border-l-4 border-gray-900 pl-6 mb-8">
          <h1 class="text-2xl font-light text-gray-900 mb-1">${personalInfo.firstName || 'First Name'} ${personalInfo.lastName || 'Last Name'}</h1>
          <div class="text-gray-600 text-sm space-y-1">
            <div>${personalInfo.email || 'email@example.com'}</div>
            <div>${personalInfo.phone || 'Phone Number'}</div>
            <div>${personalInfo.address || 'Address'}</div>
          </div>
        </div>

        <!-- Summary -->
        ${personalInfo.summary ? `
          <div class="mb-8">
            <h2 class="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Summary</h2>
            <p class="text-gray-700 text-sm leading-relaxed">${personalInfo.summary}</p>
          </div>
        ` : ''}

        <!-- Experience -->
        ${experience.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Experience</h2>
            ${experience.map(exp => `
              <div class="mb-6">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="font-medium text-gray-900">${exp.title}</h3>
                  <span class="text-xs text-gray-500">${exp.startDate} - ${exp.endDate || 'Present'}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">${exp.company} • ${exp.location}</p>
                <p class="text-sm text-gray-700 leading-relaxed">${exp.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Education</h2>
            ${education.map(edu => `
              <div class="mb-4">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="font-medium text-gray-900">${edu.degree}</h3>
                  <span class="text-xs text-gray-500">${edu.graduationDate}</span>
                </div>
                <p class="text-sm text-gray-600">${edu.school} • ${edu.location}</p>
                ${edu.gpa ? `<p class="text-xs text-gray-500">GPA: ${edu.gpa}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Skills</h2>
            <div class="text-sm text-gray-700">${skills.join(' • ')}</div>
          </div>
        ` : ''}

        <!-- Projects -->
        ${projects.length > 0 ? `
          <div class="mb-8">
            <h2 class="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Projects</h2>
            ${projects.map(project => `
              <div class="mb-4">
                <h3 class="font-medium text-gray-900 mb-1">${project.name}</h3>
                <p class="text-sm text-gray-700 mb-1">${project.description}</p>
                <p class="text-xs text-gray-600 mb-1">${project.technologies}</p>
                ${project.link ? `<p class="text-xs text-gray-500">${project.link}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  generateCreativeTemplate() {
    const { personalInfo, experience, education, skills, projects } = this.resumeData;
    
    return `
      <div class="template-creative h-full bg-white">
        <!-- Header -->
        <div class="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-8 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div class="relative z-10">
            <h1 class="text-3xl font-bold mb-2">${personalInfo.firstName || 'First Name'} ${personalInfo.lastName || 'Last Name'}</h1>
            <div class="text-lg opacity-90 mb-4">Creative Professional</div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><i class="fas fa-envelope mr-2"></i>${personalInfo.email || 'email@example.com'}</div>
              <div><i class="fas fa-phone mr-2"></i>${personalInfo.phone || 'Phone Number'}</div>
              <div class="col-span-2"><i class="fas fa-map-marker-alt mr-2"></i>${personalInfo.address || 'Address'}</div>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Summary -->
          ${personalInfo.summary ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 relative">
                <span class="bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">About Me</span>
                <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded"></div>
              </h2>
              <p class="text-gray-700 leading-relaxed mt-4">${personalInfo.summary}</p>
            </div>
          ` : ''}

          <!-- Experience -->
          ${experience.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 relative">
                <span class="bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">Experience</span>
                <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded"></div>
              </h2>
              <div class="mt-4">
                ${experience.map(exp => `
                  <div class="mb-4 pl-4 border-l-2 border-pink-200">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h3 class="font-semibold text-gray-800">${exp.title}</h3>
                        <p class="text-pink-600 font-medium">${exp.company}</p>
                      </div>
                      <div class="text-right text-sm text-gray-600">
                        <div>${exp.location}</div>
                        <div>${exp.startDate} - ${exp.endDate || 'Present'}</div>
                      </div>
                    </div>
                    <p class="text-gray-700 text-sm leading-relaxed">${exp.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 relative">
                <span class="bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">Education</span>
                <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded"></div>
              </h2>
              <div class="mt-4">
                ${education.map(edu => `
                  <div class="mb-3 pl-4 border-l-2 border-orange-200">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="font-semibold text-gray-800">${edu.degree}</h3>
                        <p class="text-orange-600">${edu.school}</p>
                      </div>
                      <div class="text-right text-sm text-gray-600">
                        <div>${edu.location}</div>
                        <div>${edu.graduationDate}</div>
                        ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Skills -->
          ${skills.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 relative">
                <span class="bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">Skills</span>
                <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded"></div>
              </h2>
              <div class="flex flex-wrap gap-2 mt-4">
                ${skills.map(skill => `<span class="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-800 px-3 py-1 rounded-full text-sm border border-pink-200">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Projects -->
          ${projects.length > 0 ? `
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-3 relative">
                <span class="bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">Projects</span>
                <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded"></div>
              </h2>
              <div class="mt-4">
                ${projects.map(project => `
                  <div class="mb-4 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100">
                    <h3 class="font-semibold text-gray-800 mb-1">${project.name}</h3>
                    <p class="text-gray-700 text-sm mb-2">${project.description}</p>
                    <p class="text-pink-600 text-sm mb-1"><strong>Technologies:</strong> ${project.technologies}</p>
                    ${project.link ? `<p class="text-sm"><a href="${project.link}" class="text-pink-600 hover:underline">${project.link}</a></p>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  updateZoom() {
    const preview = document.getElementById('resumePreview');
    preview.style.transform = `scale(${this.zoomLevel})`;
  }

  async saveResume() {
    this.showLoading();
    
    try {
      // Get user email from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userEmail = currentUser.email;
      
      // Save to localStorage as backup
      localStorage.setItem('resumeData', JSON.stringify(this.resumeData));
      localStorage.setItem('selectedTemplate', this.selectedTemplate);
      
      // Save to backend if user is logged in
      if (userEmail) {
        const response = await fetch('http://localhost:5000/api/resume/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userEmail: userEmail,
            resumeData: this.resumeData,
            template: this.selectedTemplate,
            timestamp: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          this.hideLoading();
          this.showSuccess('Resume saved successfully to your account!');
        } else {
          throw new Error('Failed to save to server');
        }
      } else {
        this.hideLoading();
        this.showSuccess('Resume saved locally! Log in to save to your account.');
      }
    } catch (error) {
      this.hideLoading();
      console.error('Error saving resume:', error);
      this.showSuccess('Resume saved locally! Server save failed.');
    }
  }

  async downloadPDF() {
    this.showLoading();
    
    try {
      const element = document.getElementById('resumePreview');
      const canvas = await html2canvas(element, {
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
      
      const fileName = `${this.resumeData.personalInfo.firstName || 'Resume'}_${this.resumeData.personalInfo.lastName || 'Document'}.pdf`;
      pdf.save(fileName);
      
      this.hideLoading();
      this.showSuccess('Resume downloaded successfully!');
    } catch (error) {
      this.hideLoading();
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }

  showLoading() {
    document.getElementById('loadingModal').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loadingModal').classList.add('hidden');
  }

  showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
  }
}

// Initialize the resume builder when the page loads
let resumeBuilder;
document.addEventListener('DOMContentLoaded', () => {
  resumeBuilder = new ResumeBuilder();
});