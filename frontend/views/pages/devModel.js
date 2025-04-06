document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize dark mode
    initThemeToggle();
  
    // Model data
    const model = {
      name: "Text Generation Model",
      deploymentUrl: "https://api.modelmarket.ai/models/text-gen-v1",
      inputParams: [
        { id: "1", name: "prompt", type: "text", required: true, min: "", max: "" },
        { id: "2", name: "temperature", type: "number", required: false, min: "0", max: "1" }
      ]
    };
  
    // Set model name and URL
    document.getElementById('model-name').textContent = model.name;
    document.getElementById('deployment-url').textContent = model.deploymentUrl;
  
    // Render initial parameters
    renderParameters(model.inputParams);
  
    // Add event listeners
    document.getElementById('copy-url-btn').addEventListener('click', copyDeploymentUrl);
    document.getElementById('add-parameter-btn').addEventListener('click', addParameter);
  
    // Copy URL to clipboard
    function copyDeploymentUrl() {
      const url = document.getElementById('deployment-url').textContent;
      navigator.clipboard.writeText(url)
        .then(() => showToast('URL Copied!'))
        .catch(err => console.error('Could not copy text: ', err));
    }
  
    // Show toast notification
    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('toast-show');
      
      setTimeout(() => {
        toast.classList.remove('toast-show');
      }, 2500);
    }
  
    // Add new parameter
    function addParameter() {
      const newId = Date.now().toString();
      const newParam = { 
        id: newId, 
        name: "", 
        type: "text", 
        required: false,
        min: "",
        max: ""
      };
      
      model.inputParams.push(newParam);
      renderParameters(model.inputParams);
    }
  
    // Render all parameters
    function renderParameters(params) {
      const container = document.getElementById('parameters-container');
      container.innerHTML = '';
      
      params.forEach(param => {
        container.appendChild(createParameterElement(param));
      });
    }
  
    // Create single parameter card
    function createParameterElement(param) {
      const paramEl = document.createElement('div');
      paramEl.className = 'parameter-card';
      paramEl.dataset.id = param.id;
      
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-12 gap-4';
      
      // Name field
      const nameCol = document.createElement('div');
      nameCol.className = 'col-span-4';
      nameCol.innerHTML = `
        <label class="form-label" for="param-name-${param.id}">Parameter Name</label>
        <input 
          type="text" 
          id="param-name-${param.id}" 
          class="form-input" 
          value="${param.name}" 
          placeholder="e.g. prompt, temperature"
          data-field="name"
        >
      `;
      
      // Type field
      const typeCol = document.createElement('div');
      typeCol.className = 'col-span-3';
      typeCol.innerHTML = `
        <label class="form-label" for="param-type-${param.id}">Data Type</label>
        <select id="param-type-${param.id}" class="form-select" data-field="type">
          <option value="text" ${param.type === 'text' ? 'selected' : ''}>Text</option>
          <option value="number" ${param.type === 'number' ? 'selected' : ''}>Number</option>
          <option value="boolean" ${param.type === 'boolean' ? 'selected' : ''}>Boolean</option>
          <option value="array" ${param.type === 'array' ? 'selected' : ''}>Array</option>
          <option value="object" ${param.type === 'object' ? 'selected' : ''}>Object</option>
        </select>
      `;
      
      // Min/Max for number
      const minCol = document.createElement('div');
      minCol.className = 'col-span-2';
      minCol.innerHTML = `
        <label class="form-label" for="param-min-${param.id}">${param.type === 'number' ? 'Min Value' : 'Min Length'}</label>
        <input 
          type="number" 
          id="param-min-${param.id}" 
          class="form-input" 
          value="${param.min}" 
          placeholder="${param.type === 'number' ? 'Min' : 'Min chars'}"
          data-field="min"
        >
      `;
      
      const maxCol = document.createElement('div');
      maxCol.className = 'col-span-2';
      maxCol.innerHTML = `
        <label class="form-label" for="param-max-${param.id}">${param.type === 'number' ? 'Max Value' : 'Max Length'}</label>
        <input 
          type="number" 
          id="param-max-${param.id}" 
          class="form-input" 
          value="${param.max}" 
          placeholder="${param.type === 'number' ? 'Max' : 'Max chars'}"
          data-field="max"
        >
      `;
      
      // Required switch
      const requiredCol = document.createElement('div');
      const colSpan = (param.type === 'number' || param.type === 'text') ? 'col-span-1' : 'col-span-5';
      requiredCol.className = `${colSpan} flex items-end pb-2`;
      requiredCol.innerHTML = `
        <div class="flex items-center space-x-2">
          <label class="switch">
            <input type="checkbox" id="param-required-${param.id}" ${param.required ? 'checked' : ''} data-field="required">
            <span class="slider"></span>
          </label>
          <span class="form-label mt-0">Required</span>
        </div>
      `;
      
      // Remove button
      const removeCol = document.createElement('div');
      removeCol.className = 'col-span-1 flex items-end justify-end pb-2';
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.disabled = model.inputParams.length <= 1;
      removeBtn.innerHTML = '<i data-lucide="minus" class="h-4 w-4"></i>';
      removeBtn.setAttribute('aria-label', 'Remove parameter');
      
      removeBtn.addEventListener('click', function() {
        removeParameter(param.id);
      });
      
      removeCol.appendChild(removeBtn);
      
      // Add columns to grid
      grid.appendChild(nameCol);
      grid.appendChild(typeCol);
      
      if (param.type === 'text' || param.type === 'number') {
        grid.appendChild(minCol);
        grid.appendChild(maxCol);
      }
      
      grid.appendChild(requiredCol);
      grid.appendChild(removeCol);
      paramEl.appendChild(grid);
      
      // Add event listeners to inputs
      paramEl.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', function() {
          updateParameter(param.id, this.dataset.field, this.type === 'checkbox' ? this.checked : this.value);
        });
      });
      
      // Reinitialize Lucide icons for dynamically added elements
      lucide.createIcons({
        icons: {
          minus: '<line x1="5" y1="12" x2="19" y2="12"></line>'
        },
        attrs: {
          class: 'h-4 w-4'
        }
      });
      
      return paramEl;
    }
    
    // Update parameter data when inputs change
    function updateParameter(id, field, value) {
      const paramIndex = model.inputParams.findIndex(p => p.id === id);
      if (paramIndex !== -1) {
        model.inputParams[paramIndex][field] = value;
        
        // If the type changed, re-render to show/hide min/max fields
        if (field === 'type') {
          renderParameters(model.inputParams);
        }
      }
    }
    
    // Remove a parameter
    function removeParameter(id) {
      if (model.inputParams.length <= 1) return;
      
      model.inputParams = model.inputParams.filter(p => p.id !== id);
      renderParameters(model.inputParams);
    }
    
    // Initialize theme toggle functionality
    function initThemeToggle() {
      const themeToggleBtn = document.getElementById('theme-toggle');
      
      // Check for saved theme preference or use OS preference
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
      
      // Toggle theme when button is clicked
      themeToggleBtn.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        lucide.createIcons(); // Refresh icons
      });
    }
  });
  