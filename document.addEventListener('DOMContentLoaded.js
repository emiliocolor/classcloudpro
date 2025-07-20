        document.addEventListener('DOMContentLoaded', function() {
            const nameModal = new bootstrap.Modal(document.getElementById('nameModal'));
            
            const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
            if (!isAuthenticated) {
                window.location.href = "login.html";
                return;
            }

            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('authenticated');
                sessionStorage.removeItem('username');
                window.location.href = "login.html";
            });

            function updateUserName() {
                const savedName = localStorage.getItem('userName') || 'Usuario';
                document.getElementById('userWelcome').textContent = `Bienvenido, ${savedName}`;
                document.getElementById('welcomeTitle').textContent = `Bienvenido, ${savedName}`;
                document.getElementById('welcomeMessage').textContent = `Accede a todas las herramientas digitales y materiales educativos que necesitas para tu crecimiento profesional y personal.`;
            }
            
            updateUserName();
            
            document.getElementById('editNameBtn').addEventListener('click', function() {
                const currentName = localStorage.getItem('userName') || '';
                document.getElementById('userNameInput').value = currentName;
                nameModal.show();
            });
            
            document.getElementById('saveNameBtn').addEventListener('click', function() {
                const newName = document.getElementById('userNameInput').value.trim();
                if (newName) {
                    localStorage.setItem('userName', newName);
                    updateUserName();
                    nameModal.hide();
                    
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-custom position-fixed bottom-0 end-0 m-3';
                    notification.style.zIndex = '1000';
                    notification.innerHTML = '<strong><i class="fas fa-check-circle me-2"></i>Nombre actualizado</strong>';
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 2000);
                }
            });

            const navLinks = document.querySelectorAll('.sidebar-nav-link');
            const sections = document.querySelectorAll('[id$="-section"]');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    const sectionId = this.getAttribute('data-section') + '-section';
                    sections.forEach(section => {
                        section.classList.remove('active-section');
                        section.classList.add('hidden-section');
                    });
                    
                    document.getElementById(sectionId).classList.remove('hidden-section');
                    document.getElementById(sectionId).classList.add('active-section');
                });
            });

            const filterButtons = document.querySelectorAll('.filter-btn');
            const toolItems = document.querySelectorAll('.tool-item');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    const filterValue = button.getAttribute('data-filter');
                    
                    toolItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
            
            const materialFilterButtons = document.querySelectorAll('#materiales-section .filter-btn');
            const materialItems = document.querySelectorAll('.material-item');
            
            materialFilterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    materialFilterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    const filterValue = button.getAttribute('data-filter');
                    
                    materialItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
            
            const sidebarFilterButtons = document.querySelectorAll('.filter-btn-sidebar');
            
            sidebarFilterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelector('.sidebar-nav-link[data-section="herramientas"]').click();
                    const filterValue = button.getAttribute('data-filter');
                    document.querySelector(`.filter-btn[data-filter="${filterValue}"]`).click();
                });
            });
            
            const chatMessages = document.getElementById('chatMessages');
            const messageInput = document.getElementById('messageInput');
            const sendMessageBtn = document.getElementById('sendMessageBtn');
            const clearChatBtn = document.getElementById('clearChatBtn');
            const attachFileBtn = document.getElementById('attachFileBtn');
            const fileInput = document.getElementById('fileInput');
            const chatSearchInput = document.getElementById('chatSearchInput');
            
            function loadMessages() {
                const savedMessages = localStorage.getItem('chatMessages');
                if (savedMessages) {
                    chatMessages.innerHTML = savedMessages;
                    scrollToBottom();
                }
            }
            
            function saveMessages() {
                localStorage.setItem('chatMessages', chatMessages.innerHTML);
            }
            
            function sendMessage() {
                const messageText = messageInput.value.trim();
                if (messageText === '') return;
                
                if (isValidUrl(messageText)) {
                    const linkDescription = prompt("Por favor describe de qué se trata este enlace:", "Enlace importante");
                    if (linkDescription === null) return;
                    
                    addMessage(`${linkDescription}: <a href="${messageText}" target="_blank">${messageText}</a>`, 'user');
                } else {
                    addMessage(messageText.replace(/\n/g, '<br>'), 'user');
                }
                
                messageInput.value = '';
                saveMessages();
            }
            
            function isValidUrl(string) {
                try {
                    new URL(string);
                    return true;
                } catch (_) {
                    return false;
                }
            }
            
            function addMessage(text, sender) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                
                if (sender === 'user') {
                    messageDiv.classList.add('user-message');
                    messageDiv.innerHTML = `
                        <div class="message-actions">
                            <button class="message-action-btn" onclick="copyMessage(this)"><i class="fas fa-copy"></i></button>
                            <button class="message-action-btn" onclick="editMessage(this)"><i class="fas fa-edit"></i></button>
                        </div>
                        <p>${text}</p>
                    `;
                } else if (sender === 'system') {
                    messageDiv.classList.add('system-message');
                    messageDiv.innerHTML = `<p><i class="fas fa-info-circle me-2"></i>${text}</p>`;
                }
                
                chatMessages.appendChild(messageDiv);
                scrollToBottom();
            }
            
            window.copyMessage = function(btn) {
                const messageText = btn.closest('.message').querySelector('p').textContent;
                navigator.clipboard.writeText(messageText);
                
                const notification = document.createElement('div');
                notification.className = 'alert alert-custom position-fixed bottom-0 end-0 m-3';
                notification.style.zIndex = '1000';
                notification.innerHTML = '<strong><i class="fas fa-check-circle me-2"></i>Mensaje copiado</strong>';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            };
            
            window.editMessage = function(btn) {
                const messageDiv = btn.closest('.message');
                const messageText = messageDiv.querySelector('p').textContent;
                
                const editInput = document.createElement('textarea');
                editInput.className = 'form-control mb-2';
                editInput.value = messageText;
                
                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn btn-primary btn-sm me-2';
                saveBtn.textContent = 'Guardar';
                saveBtn.onclick = function() {
                    messageDiv.querySelector('p').innerHTML = editInput.value.replace(/\n/g, '<br>');
                    saveMessages();
                };
                
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'btn btn-secondary btn-sm';
                cancelBtn.textContent = 'Cancelar';
                cancelBtn.onclick = function() {
                    messageDiv.querySelector('p').style.display = 'block';
                    editContainer.remove();
                };
                
                const editContainer = document.createElement('div');
                editContainer.appendChild(editInput);
                editContainer.appendChild(saveBtn);
                editContainer.appendChild(cancelBtn);
                
                messageDiv.querySelector('p').style.display = 'none';
                messageDiv.insertBefore(editContainer, messageDiv.querySelector('p'));
            };
            
            function scrollToBottom() {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            sendMessageBtn.addEventListener('click', sendMessage);
            
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            clearChatBtn.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres borrar todo el historial del chat?')) {
                    chatMessages.innerHTML = '';
                    localStorage.removeItem('chatMessages');
                }
            });
            
            attachFileBtn.addEventListener('click', function() {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const fileUrl = URL.createObjectURL(file);
                    
                    if (file.type.startsWith('image/')) {
                        addMessage(`Archivo adjunto: ${file.name}`, 'user');
                        addMessage(`<img src="${fileUrl}" class="img-fluid" alt="${file.name}" style="max-width: 100%; border-radius: 8px;">`, 'user');
                    } else {
                        addMessage(`Archivo adjunto: <a href="${fileUrl}" download="${file.name}">${file.name}</a>`, 'user');
                    }
                    
                    saveMessages();
                }
            });
            
            chatSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const messages = chatMessages.querySelectorAll('.message');
                
                messages.forEach(message => {
                    const text = message.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        message.style.display = 'block';
                        const html = message.innerHTML;
                        const highlighted = html.replace(
                            new RegExp(searchTerm, 'gi'),
                            match => `<span style="background-color: yellow;">${match}</span>`
                        );
                        message.innerHTML = highlighted;
                    } else {
                        message.style.display = 'none';
                    }
                });
            });
            
            loadMessages();
            
            const searchInputs = document.querySelectorAll('.search-input');
            
            searchInputs.forEach(input => {
                input.addEventListener('keyup', function() {
                    const searchTerm = this.value.toLowerCase();
                    const sectionId = this.closest('.rounded-container').querySelector('.section-title').getAttribute('id').replace('-section', '');
                    
                    if (sectionId === 'herramientas') {
                        toolItems.forEach(item => {
                            const title = item.querySelector('h5').textContent.toLowerCase();
                            const description = item.querySelector('p').textContent.toLowerCase();
                            
                            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                                item.style.display = 'block';
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                }, 50);
                            } else {
                                item.style.opacity = '0';
                                setTimeout(() => {
                                    item.style.display = 'none';
                                }, 300);
                            }
                        });
                    } else if (sectionId === 'materiales') {
                        materialItems.forEach(item => {
                            const title = item.querySelector('h5').textContent.toLowerCase();
                            const description = item.querySelector('p').textContent.toLowerCase();
                            
                            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                                item.style.display = 'block';
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                }, 50);
                            } else {
                                item.style.opacity = '0';
                                setTimeout(() => {
                                    item.style.display = 'none';
                                }, 300);
                            }
                        });
                    }
                });
            });
            
            const personalNotes = document.getElementById('personalNotes');
            const saveNotesBtn = document.getElementById('saveNotesBtn');
            
            const savedNotes = localStorage.getItem('personalNotes');
            if (savedNotes) {
                personalNotes.value = savedNotes;
            }
            
            saveNotesBtn.addEventListener('click', function() {
                localStorage.setItem('personalNotes', personalNotes.value);
                
                const notification = document.createElement('div');
                notification.className = 'alert alert-custom position-fixed bottom-0 end-0 m-3';
                notification.style.zIndex = '1000';
                notification.style.borderRadius = '8px';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.innerHTML = '<strong><i class="fas fa-check-circle me-2"></i>Notas guardadas</strong>';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('fade');
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                }, 3000);
            });
            
            const calendarMonth = document.getElementById('calendarMonth');
            const calendarDays = document.getElementById('calendarDays');
            const prevMonthBtn = document.getElementById('prevMonth');
            const nextMonthBtn = document.getElementById('nextMonth');
            const calendarNotes = document.getElementById('calendarNotes');
            const saveCalendarNotesBtn = document.getElementById('saveCalendarNotesBtn');
            const selectedDateTitle = document.getElementById('selectedDateTitle');
            
            let currentDate = new Date();
            let currentMonth = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();
            let selectedDate = currentDate;
            
            function renderCalendar() {
                calendarDays.innerHTML = '';
                
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                                   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
                
                const firstDay = new Date(currentYear, currentMonth, 1);
                const lastDay = new Date(currentYear, currentMonth + 1, 0);
                
                const firstDayOfWeek = firstDay.getDay();
                
                const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
                
                for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day other-month';
                    dayElement.textContent = prevLastDay - i;
                    calendarDays.appendChild(dayElement);
                }
                
                for (let i = 1; i <= lastDay.getDate(); i++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    
                    const dayNumber = document.createElement('div');
                    dayNumber.className = 'day-number';
                    dayNumber.textContent = i;
                    dayElement.appendChild(dayNumber);
                    
                    const dayDate = new Date(currentYear, currentMonth, i);
                    if (currentDate.getDate() === i && 
                        currentDate.getMonth() === currentMonth && 
                        currentDate.getFullYear() === currentYear) {
                        dayElement.classList.add('today');
                    }
                    
                    const dayKey = formatDateKey(dayDate);
                    const dayNotes = localStorage.getItem(`calendarNotes_${dayKey}`);
                    if (dayNotes) {
                        const notesDiv = document.createElement('div');
                        notesDiv.className = 'calendar-note';
                        notesDiv.textContent = dayNotes.length > 20 ? dayNotes.substring(0, 20) + '...' : dayNotes;
                        dayElement.appendChild(notesDiv);
                    }
                    
                    dayElement.addEventListener('click', function() {
                        selectedDate = dayDate;
                        selectedDateTitle.textContent = formatDate(dayDate);
                        
                        const selectedDayKey = formatDateKey(dayDate);
                        const selectedDayNotes = localStorage.getItem(`calendarNotes_${selectedDayKey}`);
                        calendarNotes.value = selectedDayNotes || '';
                    });
                    
                    calendarDays.appendChild(dayElement);
                }
                
                const daysLeft = 42 - (firstDayOfWeek + lastDay.getDate());
                for (let i = 1; i <= daysLeft; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day other-month';
                    dayElement.textContent = i;
                    calendarDays.appendChild(dayElement);
                }
                
                if (selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear) {
                    selectedDateTitle.textContent = formatDate(selectedDate);
                    const selectedDayKey = formatDateKey(selectedDate);
                    const selectedDayNotes = localStorage.getItem(`calendarNotes_${selectedDayKey}`);
                    calendarNotes.value = selectedDayNotes || '';
                } else {
                    selectedDateTitle.textContent = 'Hoy';
                    const todayKey = formatDateKey(currentDate);
                    const todayNotes = localStorage.getItem(`calendarNotes_${todayKey}`);
                    calendarNotes.value = todayNotes || '';
                }
            }
            
            function formatDateKey(date) {
                const d = new Date(date);
                let month = '' + (d.getMonth() + 1);
                let day = '' + d.getDate();
                const year = d.getFullYear();
                
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                
                return [year, month, day].join('-');
            }
            
            function formatDate(date) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return date.toLocaleDateString('es-ES', options);
            }
            
            saveCalendarNotesBtn.addEventListener('click', function() {
                const dayKey = formatDateKey(selectedDate);
                localStorage.setItem(`calendarNotes_${dayKey}`, calendarNotes.value);
                
                renderCalendar();
                
                const notification = document.createElement('div');
                notification.className = 'alert alert-custom position-fixed bottom-0 end-0 m-3';
                notification.style.zIndex = '1000';
                notification.innerHTML = '<strong><i class="fas fa-check-circle me-2"></i>Notas guardadas</strong>';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            });
            
            prevMonthBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar();
            });
            
            nextMonthBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar();
            });
            
            renderCalendar();
            
            const settingsBtn = document.getElementById('settingsBtn');
            const settingsModal = document.getElementById('settingsModal');
            const closeSettingsBtn = document.getElementById('closeSettingsBtn');
            const settingsTabs = document.querySelectorAll('.settings-tab');
            
            settingsBtn.addEventListener('click', function() {
                settingsModal.classList.add('active');
            });
            
            closeSettingsBtn.addEventListener('click', function() {
                settingsModal.classList.remove('active');
            });
            
            settingsTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    settingsTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    document.querySelectorAll('.settings-tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    
                    const tabId = this.getAttribute('data-tab') + '-tab';
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            const toolsData = [
                { name: 'GitHub', icon: 'fab fa-github', url: 'https://github.com', category: 'desarrollo' },
                { name: 'DeepSeek', icon: 'fas fa-robot', url: 'https://chat.deepseek.com/', category: 'ia' },
                { name: 'ChatGPT', icon: 'fas fa-brain', url: 'https://chat.openai.com', category: 'ia' },
                { name: 'Gemini AI', icon: 'fas fa-gem', url: 'https://gemini.google.com', category: 'ia' },
                { name: 'Blackbox AI', icon: 'fas fa-box', url: 'https://www.blackbox.ai', category: 'ia' },
                { name: 'Google Drive', icon: 'fab fa-google-drive', url: 'https://drive.google.com', category: 'google' },
                { name: 'Google Docs', icon: 'fas fa-file-word', url: 'https://docs.google.com', category: 'google' },
                { name: 'Google Sheets', icon: 'fas fa-file-excel', url: 'https://sheets.google.com', category: 'google' },
                { name: 'Google Slides', icon: 'fas fa-file-powerpoint', url: 'https://slides.google.com', category: 'google' },
                { name: 'Canva', icon: 'fab fa-canva', url: 'https://www.canva.com', category: 'diseno' },
                { name: 'Google Classroom', icon: 'fas fa-chalkboard-teacher', url: 'https://classroom.google.com', category: 'educacion' },
                { name: 'Google Scholar', icon: 'fas fa-book', url: 'https://scholar.google.com', category: 'educacion' },
                { name: 'Coursera', icon: 'fas fa-graduation-cap', url: 'https://www.coursera.org', category: 'educacion' },
                { name: 'Santander Open Academy', icon: 'fas fa-graduation-cap', url: 'https://www.santanderopenacademy.com/es/index.html', category: 'educacion' },
                { name: 'Udemy', icon: 'fas fa-laptop-code', url: 'https://www.udemy.com', category: 'educacion' },
                { name: 'Aprende.org', icon: 'fas fa-chalkboard', url: 'https://aprende.org/capacitate', category: 'educacion' },
                { name: 'Oxford Learner\'s Dictionary', icon: 'fas fa-book', url: 'https://www.oxfordlearnersdictionaries.com/', category: 'ingles' },
                { name: 'Cambridge Dictionary', icon: 'fas fa-university', url: 'https://dictionary.cambridge.org/', category: 'ingles' },
                { name: 'British Council', icon: 'fas fa-globe-europe', url: 'https://learnenglish.britishcouncil.org/', category: 'ingles' },
                { name: 'Test English', icon: 'fas fa-check-circle', url: 'https://test-english.com/', category: 'ingles' }
            ];

            const materialsData = [
                { name: 'Material 1', icon: 'fas fa-code', url: 'NO IBA A SER TAN FÁCIL!', category: 'programacion' },
            ];

            let selectedTools = JSON.parse(localStorage.getItem('selectedTools')) || [];
            
            function renderToolsSelection() {
                const container = document.getElementById('tools-selection-container');
                container.innerHTML = '';

                toolsData.forEach(tool => {
                    const isSelected = selectedTools.some(selected => selected.name === tool.name);
                    const item = document.createElement('div');
                    item.className = `custom-quick-access-item ${isSelected ? 'selected' : ''}`;
                    item.innerHTML = `
                        <i class="${tool.icon} me-2"></i>
                        <span>${tool.name}</span>
                    `;
                    item.addEventListener('click', () => {
                        item.classList.toggle('selected');
                    });
                    container.appendChild(item);
                });
            }

            function renderShortcutsSelection() {
                const container = document.getElementById('shortcuts-selection-container');
                container.innerHTML = '';

                toolsData.forEach(tool => {
                    const isSelected = selectedTools.slice(0, 3).some(selected => selected.name === tool.name);
                    const item = document.createElement('div');
                    item.className = `custom-quick-access-item ${isSelected ? 'selected' : ''}`;
                    item.innerHTML = `
                        <i class="${tool.icon} me-2"></i>
                        <span>${tool.name}</span>
                    `;
                    item.addEventListener('click', () => {
                        item.classList.toggle('selected');
                    });
                    container.appendChild(item);
                });
            }

            document.getElementById('save-tools-selection').addEventListener('click', () => {
                const selectedItems = Array.from(document.querySelectorAll('#tools-selection-container .custom-quick-access-item.selected'));
                selectedTools = selectedItems.map(item => {
                    const toolName = item.querySelector('span').textContent;
                    return toolsData.find(tool => tool.name === toolName);
                });

                localStorage.setItem('selectedTools', JSON.stringify(selectedTools));
                renderQuickAccess('quick-tools-access', selectedTools);
                renderCustomShortcuts(selectedTools.slice(0, 3));
                
                const notification = document.createElement('div');
                notification.className = 'alert alert-custom position-fixed bottom-0 end-0 m-3';
                notification.style.zIndex = '1000';
                notification.style.borderRadius = '8px';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.innerHTML = '<strong><i class="fas fa-check-circle me-2"></i>Selección de herramientas guardada</strong>';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('fade');
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                }, 3000);
            });

            document.getElementById('save-shortcuts-selection').addEventListener('click', () => {
                const selectedItems = Array.from(document.querySelectorAll('#shortcuts-selection-container .custom-quick-access-item.selected'));
                const selectedShortcuts = selectedItems.slice(0, 3).map(item => {
                    const toolName = item.querySelector('span').textContent;
                    return toolsData.find(tool => tool.name === toolName);
                });

                selectedTools = [...selectedShortcuts, ...selectedTools.slice(3)];
                localStorage.setItem('selectedTools', JSON.stringify(selectedTools));
                renderCustomShortcuts(selectedShortcuts);
                
                const notification = document.createElement('div');
                notification.className = 'alert alert-custom position-fixed bottom-0 end-0 m-3';
                notification.style.zIndex = '1000';
                notification.style.borderRadius = '8px';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.innerHTML = '<strong><i class="fas fa-check-circle me-2"></i>Accesos directos guardados</strong>';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('fade');
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                }, 3000);
            });

            function renderQuickAccess(containerId, items) {
                const container = document.getElementById(containerId);
                container.innerHTML = '';
                
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'quick-access-item';
                    
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.target = '_blank';
                    link.className = 'd-flex align-items-center text-decoration-none';
                    link.innerHTML = `
                        <i class="${item.icon} quick-access-icon"></i>
                        <span>${item.name}</span>
                    `;
                    
                    li.appendChild(link);
                    container.appendChild(li);
                });
            }
            
            function renderCustomShortcuts(items) {
                const container = document.getElementById('custom-shortcuts');
                container.innerHTML = '';
                
                items.forEach((item, index) => {
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.target = '_blank';
                    link.className = 'd-block text-white-50 mb-2';
                    if (index === items.length - 1) {
                        link.className = 'd-block text-white-50';
                    }
                    link.innerHTML = `<i class="${item.icon} me-2"></i> ${item.name}`;
                    container.appendChild(link);
                });
            }
            
            renderToolsSelection();
            renderShortcutsSelection();
            renderQuickAccess('quick-tools-access', selectedTools);
            renderCustomShortcuts(selectedTools.slice(0, 3));
        });

        function navigateToSection(sectionName) {
            const sectionLink = document.querySelector(`.sidebar-nav-link[data-section="${sectionName}"]`);
            if (sectionLink) {
                sectionLink.click();
            }
        }

        document.getElementById('exploreSectionBtn').addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target-section');
            navigateToSection(targetSection);
        });