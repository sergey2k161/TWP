$(function() {
    // Форматирование даты (например, 2025-05-18 -> 18.05.2025)
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    let tasks = [];

    // Функции сортировки/группировки

    function renderTaskCard(task) {
        let tags = Array.isArray(task.tags) ? task.tags : (typeof task.tags === 'string' ? task.tags.split(",").map(t => t.trim()) : []);
        let tagsText = tags.length ? tags.join(", ") : "Нет";

        return $(`
            <div class="task" data-id="${task.id}">
                <h3>${task.name}</h3>
                <p><strong>Дата:</strong> ${task.date}</p>
                <p><strong>Время:</strong> ${task.time}</p>
                <p><strong>Место:</strong> ${task.place}</p>
                <p><strong>Теги:</strong> ${tagsText}</p>
                <button class="delete-btn">Удалить</button>
                <button class="update-btn">Редактировать</button>
            </div>
        `);
    }

    function renderTasksList(tasksToRender) {
        const $list = $("#task-list");
        $list.empty();
        if (tasksToRender.length === 0) {
            $list.append("<p>Задачи отсутствуют</p>");
            return;
        }
        tasksToRender.forEach(task => {
            $list.append(renderTaskCard(task));
        });
    }

    function organizeByTags(tasks) {
        let tags = [];
        tasks.forEach(task => {
            (Array.isArray(task.tags) ? task.tags : []).forEach(tag => {
                if (!tags.includes(tag)) tags.push(tag);
            });
        });

        const $list = $("#task-list");
        $list.empty();
        if (tags.length === 0) {
            $list.append("<p>Задачи без тегов</p>");
            return;
        }

        tags.forEach(tag => {
            let filteredTasks = tasks.filter(task => (Array.isArray(task.tags) ? task.tags : []).includes(tag));
            const $group = $(`<div><h2>Тег: ${tag}</h2></div>`);
            filteredTasks.forEach(task => $group.append(renderTaskCard(task)));
            $list.append($group);
        });
    }

    function organizeByPlace(tasks) {
        let places = [];
        tasks.forEach(task => {
            if (task.place && !places.includes(task.place)) places.push(task.place);
        });

        const $list = $("#task-list");
        $list.empty();
        if (places.length === 0) {
            $list.append("<p>Задачи без места</p>");
            return;
        }

        places.forEach(place => {
            let filteredTasks = tasks.filter(task => task.place === place);
            const $group = $(`<div><h2>Место: ${place}</h2></div>`);
            filteredTasks.forEach(task => $group.append(renderTaskCard(task)));
            $list.append($group);
        });
    }

    function organizeByDateAndTime(tasks) {
        // Получаем уникальные даты и сортируем их
        let dates = [...new Set(tasks.map(t => t.date))].sort();

        const $list = $("#task-list");
        $list.empty();

        if (dates.length === 0) {
            $list.append("<p>Задачи без даты</p>");
            return;
        }

        dates.forEach(date => {
            // Фильтруем задачи по дате и сортируем их по времени
            let filteredTasks = tasks.filter(task => task.date === date)
                .sort((a, b) => a.time.localeCompare(b.time));

            const $group = $(`<div><h2>Дата: ${date}</h2></div>`);

            filteredTasks.forEach(task => $group.append(renderTaskCard(task)));

            $list.append($group);
        });
    }

    // Отрисовка задач в зависимости от выбранной вкладки
    function renderByTab(tabName) {
        switch(tabName) {
            case "Новые":
                // сортируем по createdAt DESC
                renderTasksList(tasks.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
                break;
            case "Старые":
                // сортируем по createdAt ASC
                renderTasksList(tasks.slice().sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
                break;
            case "По пометкам":
                organizeByTags(tasks);
                break;
            case "По месту":
                organizeByPlace(tasks);
                break;
            case "По дате":
                organizeByDateAndTime(tasks);
                break;
            case "Добавить":
                // Показываем форму добавления
                $("#task-list").html(`
                    <form id="task-form">
                        <p><input type="text" name="name" placeholder="Название задачи" required></p>
                        <p><input type="date" name="date" required></p>
                        <p><input type="time" name="time" required></p>
                        <p><input type="text" name="place" placeholder="Место"></p>
                        <p><input type="text" name="tags" placeholder="Теги через запятую"></p>
                        <p><button type="submit">Добавить задачу</button></p>
                    </form>
                `);
                break;
            default:
                renderTasksList(tasks);
        }
    }

    // Загрузить задачи с сервера
    function loadTasks() {
        $.getJSON("/api/tasks")
            .done(data => {
                tasks = data;
                // По умолчанию "Новые"
                renderByTab("Новые");
            })
            .fail(() => {
                alert("Ошибка загрузки задач");
            });
    }

    loadTasks();

    // Обработка клика по вкладкам
    $(".tabs a span").on("click", function(e) {
        e.preventDefault();
        $(".tabs a span").removeClass("active");
        $(this).addClass("active");
        const tabName = $(this).text();
        renderByTab(tabName);
    });

    // Делегирование событий формы добавления задачи
    $("#task-list").on("submit", "#task-form", function(e) {
        e.preventDefault();
        const data = {
            name: this.name.value,
            date: this.date.value,
            time: this.time.value,
            place: this.place.value,
            tags: this.tags.value ? this.tags.value.split(",").map(t => t.trim()) : []
        };
        $.ajax({
            url: "/api/tasks",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(newTask) {
                loadTasks();
                // Активировать вкладку "Новые" после добавления
                $(".tabs a span").removeClass("active");
                $(".tabs a span").filter(function(){ return $(this).text() === "Новые"; }).addClass("active");
            },
            error: function() {
                alert("Ошибка при добавлении задачи");
            }
        });
    });

    // Делегирование кнопки удаления
    $("#task-list").on("click", ".delete-btn", function() {
        const id = $(this).closest(".task").data("id");
        if (confirm("Удалить задачу?")) {
            $.ajax({
                url: `/api/tasks/${id}`,
                method: "DELETE",
                success: function() {
                    loadTasks();
                },
                error: function() {
                    alert("Ошибка при удалении");
                }
            });
        }
    });

    // Редактирование можно добавить аналогично
    $("#task-list").on("click", ".update-btn", function() {
        const $taskCard = $(this).closest(".task");
        const id = $taskCard.data("id");

        // Получаем текущие данные задачи
        const name = $taskCard.find("h3").text();
        const date = $taskCard.find("p:nth-child(2)").text().replace("Дата: ", "");
        const time = $taskCard.find("p:nth-child(3)").text().replace("Время: ", "");
        const place = $taskCard.find("p:nth-child(4)").text().replace("Место: ", "");
        const tags = $taskCard.find("p:nth-child(5)").text().replace("Теги: ", "").split(", ");

        // Очищаем задачу и заменяем ее формой редактирования
        $taskCard.html(`
        <input type="text" class="edit-name" value="${name}">
        <input type="date" class="edit-date" value="${date}">
        <input type="time" class="edit-time" value="${time}">
        <input type="text" class="edit-place" value="${place}">
        <input type="text" class="edit-tags" value="${tags.join(", ")}">
        <button class="save-btn">Сохранить</button>
        <button class="cancel-btn">Отмена</button>
        `);
    });

    $("#task-list").on("click", ".save-btn", function() {
        const $taskCard = $(this).closest(".task");
        const id = $taskCard.data("id");

        // Получаем обновленные данные из формы
        const updatedTask = {
            name: $taskCard.find(".edit-name").val(),
            date: $taskCard.find(".edit-date").val(),
            time: $taskCard.find(".edit-time").val(),
            place: $taskCard.find(".edit-place").val(),
            tags: $taskCard.find(".edit-tags").val().split(",").map(tag => tag.trim())
        };

        // Отправляем обновленные данные на сервер
        $.ajax({
            url: `/api/tasks/${id}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedTask),
            success: function() {
                loadTasks(); // Загружаем обновленный список
            },
            error: function() {
                alert("Ошибка при редактировании");
            }
        });
    });

    $("#task-list").on("click", ".cancel-btn", function() {
        loadTasks(); // Просто загружаем задачи заново, чтобы отменить изменения
    });

});



