(function() {

    const themes = {
        default: {
            '--base-text-color': '#212529',
            '--header-bg': '#007bff',
            '--header-text-color': '#fff',
            '--default-btn-bg': '#007bff',
            '--default-btn-text-color': '#fff',
            '--default-btn-hover-bg': '#0069d9',
            '--default-btn-border-color': '#0069d9',
            '--danger-btn-bg': '#dc3545',
            '--danger-btn-text-color': '#fff',
            '--danger-btn-hover-bg': '#bd2130',
            '--danger-btn-border-color': '#dc3545',
            '--input-border-color': '#ced4da',
            '--input-bg-color': '#fff',
            '--input-text-color': '#495057',
            '--input-focus-bg-color': '#fff',
            '--input-focus-text-color': '#495057',
            '--input-focus-border-color': '#80bdff',
            '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
        },
        dark: {
            '--base-text-color': '#212529',
            '--header-bg': '#343a40',
            '--header-text-color': '#fff',
            '--default-btn-bg': '#58616b',
            '--default-btn-text-color': '#fff',
            '--default-btn-hover-bg': '#292d31',
            '--default-btn-border-color': '#343a40',
            '--default-btn-focus-box-shadow':
                '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
            '--danger-btn-bg': '#b52d3a',
            '--danger-btn-text-color': '#fff',
            '--danger-btn-hover-bg': '#88222c',
            '--danger-btn-border-color': '#88222c',
            '--input-border-color': '#ced4da',
            '--input-bg-color': '#fff',
            '--input-text-color': '#495057',
            '--input-focus-bg-color': '#fff',
            '--input-focus-text-color': '#495057',
            '--input-focus-border-color': '#78818a',
            '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
        },
        light: {
            '--base-text-color': '#212529',
            '--header-bg': '#fff',
            '--header-text-color': '#212529',
            '--default-btn-bg': '#fff',
            '--default-btn-text-color': '#212529',
            '--default-btn-hover-bg': '#e8e7e7',
            '--default-btn-border-color': '#343a40',
            '--default-btn-focus-box-shadow':
                '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
            '--danger-btn-bg': '#f1b5bb',
            '--danger-btn-text-color': '#212529',
            '--danger-btn-hover-bg': '#ef808a',
            '--danger-btn-border-color': '#e2818a',
            '--input-border-color': '#ced4da',
            '--input-bg-color': '#fff',
            '--input-text-color': '#495057',
            '--input-focus-bg-color': '#fff',
            '--input-focus-text-color': '#495057',
            '--input-focus-border-color': '#78818a',
            '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
        },
    }

    let lastSelectedTheme = localStorage.getItem('toDoList-theme') || 'default'

    // Elements UI
    const listContainer = document.querySelector('.tasks-list-section .list-group')
    const themeSelect = document.getElementById('themSelect')

    const form = document.forms['addTask']
    const inputTitle = form.elements['title']
    const inputBody = form.elements['body']

    // Events
    setTheme(lastSelectedTheme)
    renderOfTasks(getTasksFromLS())

    form.addEventListener('submit', onFormSubmitHandler)
    listContainer.addEventListener('click', onDeleteHandler)
    themeSelect.addEventListener('change', onThemeSelectHandler)



    // Functions
    function renderOfTasks(tasksList) {
        if (!tasksList) {
            console.error('Передайте список задач!')
            return
        }

        const fragment = document.createDocumentFragment()

        Object.values(tasksList).forEach(task => {
            const li = listItemTemplate(task)
            fragment.appendChild(li)
        })
        listContainer.appendChild(fragment)
    }

    function onFormSubmitHandler(e) {
        e.preventDefault()
        const titleValue = inputTitle.value
        const bodyValue = inputBody.value

        if (!titleValue || !bodyValue) {
            alert('Пожалуйта введите title и body')
            return
        }

        const task = createTask(titleValue, bodyValue)
        const savedToLS = saveToLS(task)
        const li = listItemTemplate(task)
        listContainer.insertAdjacentElement('afterbegin', li)
        form.reset()
    }

    function onDeleteHandler({target}) {
        if (target.classList.contains('delete-btn')) {
            const parent = target.closest('[data-task-id]')
            const id = parent.dataset.taskId
            const confirmed = deleteTask(id)
            deleteTaskFromHTML(confirmed, parent)
        }
    }

    function deleteTask(id) {
        const { title } = getTasksFromLS()[id]
        const isConfirm = confirm(`Точно вы хотите удалить задачу: ${title}`)
        if (!isConfirm) return isConfirm
        deleteTaskFromLS(id)
        return isConfirm
    }

    function createTask(title, body) {
        const newTask = {
            title,
            body,
            completed: false,
            _id: `${Math.random()}`
        }
        return newTask
    }

    function listItemTemplate({ _id, title, body }) {
        const li = document.createElement('li')
        li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2')
        li.setAttribute('data-task-id', _id)

        const span = document.createElement('span')
        span.textContent = title
        span.style.fontWeight = 'bold'

        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn')
        btn.textContent = 'Delete Task'

        const article = document.createElement('p')
        article.classList.add('mt-2', 'w-100')
        article.textContent = body

        li.appendChild(span)
        li.appendChild(btn)
        li.appendChild(article)
        return li
    }

    function saveToLS(task) {
        let arrayTasksFromLS = JSON.parse(localStorage.getItem('tasks'))

        if (!arrayTasksFromLS) {
            localStorage.setItem('tasks', JSON.stringify([task]))
        } else {
            arrayTasksFromLS.push(task)
            localStorage.setItem('tasks', JSON.stringify(arrayTasksFromLS))
        }
    }


    function getTasksFromLS() {
        let tasksFromLs
        try {
            tasksFromLs = JSON.parse(localStorage.getItem('tasks')).reverse()
        } catch (error) {
            tasksFromLs = []
        }

        let objOfTasksLS

        if (tasksFromLs) {
            objOfTasksLS = tasksFromLs.reduce((acc, task) => {
                acc[task._id] = task
                return acc
            }, {})
        }
        return objOfTasksLS
    }


    function deleteTaskFromLS(id) {
        const tasksLS = getTasksFromLS()
        if (tasksLS[id]) delete tasksLS[id]
        localStorage.setItem('tasks', JSON.stringify(Object.values(tasksLS).reverse()))
    }


    function deleteTaskFromHTML(confirmed, el) {
        if (!confirmed) return
        el.remove()
    }

    function onThemeSelectHandler(e) {
        const selectedTheme = themeSelect.value
        const isConfirmed = confirm(`Вы действительно хотите изменить тему на: ${selectedTheme}`)
        if (!isConfirmed) {
            themeSelect.value = lastSelectedTheme
            return
        }
        setTheme(selectedTheme)
        lastSelectedTheme = selectedTheme
        localStorage.setItem('toDoList-theme', selectedTheme)
    }

    function setTheme(name) {
        const selectedThemeObj = themes[name]
        Object.entries(selectedThemeObj).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value)
        })
    }

})()