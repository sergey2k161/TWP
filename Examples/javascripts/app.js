var main = function (taskObjects) {
    "use strict";

    var tasks = taskObjects.map(function (task) {
        return task.name;
    });

    var organizeByTags = function (taskObjects) {
        var tags = [];

        taskObjects.forEach(function (task) {
            task.tags.forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });

        return tags.map(function (tag) {
            var tasksWithTag = taskObjects.filter(function (task) {
                return task.tags.indexOf(tag) !== -1;
            });
            return { "name": tag, "tasks": tasksWithTag };
        });
    };

    var organizeByPlace = function (taskObjects) {
        var places = [];

        taskObjects.forEach(function (task) {
            if (places.indexOf(task.place) === -1) {
                places.push(task.place);
            }
        });

        return places.map(function (place) {
            var tasksAtPlace = taskObjects.filter(function (task) {
                return task.place === place;
            });
            return { "name": place, "tasks": tasksAtPlace };
        });
    };

    var organizeByDateAndTime = function (taskObjects) {
        var dates = [];

        taskObjects.forEach(function (task) {
            if (dates.indexOf(task.date) === -1) {
                dates.push(task.date);
            }
        });

        dates.sort();

        return dates.map(function (date) {
            var tasksOnDate = taskObjects.filter(function (task) {
                return task.date === date;
            });

            var times = [];
            tasksOnDate.forEach(function (task) {
                if (times.indexOf(task.time) === -1) {
                    times.push(task.time);
                }
            });
            times.sort();

            var timeGroups = times.map(function (time) {
                var tasksAtTime = tasksOnDate.filter(function (task) {
                    return task.time === time;
                });
                return {
                    time: time,
                    tasks: tasksAtTime
                };
            });

            return {
                name: formatDate(date),
                times: timeGroups
            };
        });
    };

    var formatDate = function (dateString) {
        var date = new Date(dateString);
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    };

    var renderTaskCard = function (task) {
        var $taskItem = $("<div>").addClass("task-item");

        $taskItem.append($("<h3>").text(task.name));
        $taskItem.append($("<p>").html("<strong>Дата и время:</strong> " + formatDate(task.date) + ", " + task.time));
        $taskItem.append($("<p>").html("<strong>Место:</strong> " + task.place));

        var $tagsContainer = $("<div>").addClass("tags");
        task.tags.forEach(function (tag) {
            $tagsContainer.append($("<span>").addClass("tag").text(tag));
        });

        $taskItem.append($tagsContainer);
        return $taskItem;
    };

    var renderDateTimeGroups = function (groups) {
        var $container = $("<div>");

        groups.forEach(function (dateGroup) {
            var $dateGroup = $("<div>").addClass("task-group");
            $dateGroup.append($("<h2>").text(dateGroup.name));

            dateGroup.times.forEach(function (timeGroup) {
                var $timeGroup = $("<div>").addClass("time-group");
                $timeGroup.append($("<h3>").text("Время: " + timeGroup.time));

                timeGroup.tasks.forEach(function (task) {
                    $timeGroup.append(renderTaskCard(task));
                });

                $dateGroup.append($timeGroup);
            });

            $container.append($dateGroup);
        });

        return $container;
    };

    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var $element = $(element);
            var $content;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<div>");
                var sortedTasks = taskObjects.slice().sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                sortedTasks.forEach(function (task) {
                    $content.append(renderTaskCard(task));
                });
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<div>");
                var sortedTasks = taskObjects.slice().sort(function (a, b) {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                sortedTasks.forEach(function (task) {
                    $content.append(renderTaskCard(task));
                });
            } else if ($element.parent().is(":nth-child(3)")) {
                $content = $("<div>");
                var organizedByTag = organizeByTags(taskObjects);
                organizedByTag.forEach(function (tagGroup) {
                    var $tagGroupContainer = $("<div>").addClass("task-group");
                    $tagGroupContainer.append($("<h2>").text(tagGroup.name));
                    tagGroup.tasks.forEach(function (task) {
                        $tagGroupContainer.append(renderTaskCard(task));
                    });
                    $content.append($tagGroupContainer);
                });
            } else if ($element.parent().is(":nth-child(4)")) {
                $content = $("<div>");
                var organizedByPlace = organizeByPlace(taskObjects);
                organizedByPlace.forEach(function (placeGroup) {
                    var $placeGroupContainer = $("<div>").addClass("task-group");
                    $placeGroupContainer.append($("<h2>").text(placeGroup.name));
                    placeGroup.tasks.forEach(function (task) {
                        $placeGroupContainer.append(renderTaskCard(task));
                    });
                    $content.append($placeGroupContainer);
                });
            } else if ($element.parent().is(":nth-child(5)")) {
                var organizedByDateTime = organizeByDateAndTime(taskObjects);
                $content = renderDateTimeGroups(organizedByDateTime);
            } else if ($element.parent().is(":nth-child(6)")) {
                $content = $("<div>");
                $content.append($("<h2>").text("Добавить новую задачу").css("margin-bottom", "20px"));

                $content.append($("<p>").text("Название задачи:"));
                var $nameInput = $("<input type='text' placeholder='Введите название задачи'>");
                $content.append($nameInput);

                $content.append($("<p>").text("Дата:"));
                var $dateInput = $("<input type='date'>");
                $content.append($dateInput);

                $content.append($("<p>").text("Время:"));
                var $timeInput = $("<input type='time'>");
                $content.append($timeInput);

                $content.append($("<p>").text("Место:"));
                var $placeInput = $("<input type='text' placeholder='Укажите место'>");
                $content.append($placeInput);

                $content.append($("<p>").text("Пометки (теги через запятую):"));
                var $tagsInput = $("<input type='text' placeholder='Например: Работа, Важно, Срочно'>");
                $content.append($tagsInput);

                var $addButton = $("<button>").text("Добавить задачу");
                $content.append($addButton);

                $addButton.on("click", function () {
                    if ($nameInput.val() !== "" && $dateInput.val() !== "" && $timeInput.val() !== "" && $placeInput.val() !== "") {
                        var newTask = {
                            name: $nameInput.val(),
                            date: $dateInput.val(),
                            time: $timeInput.val(),
                            place: $placeInput.val(),
                            tags: $tagsInput.val() ? $tagsInput.val().split(",").map(tag => tag.trim()) : [],
                            createdAt: new Date().toISOString()
                        };

                        taskObjects.push(newTask);
                        tasks.push(newTask.name);

                        $nameInput.val("");
                        $dateInput.val("");
                        $timeInput.val("");
                        $placeInput.val("");
                        $tagsInput.val("");

                        alert("Задача успешно добавлена!");
                    } else {
                        alert("Пожалуйста, заполните все обязательные поля!");
                    }
                });
            }

            $("main .content").append($content);
            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    $.getJSON("tasks.json", function (taskObjects) {
        main(taskObjects);
    }).fail(function(jqxhr, textStatus, error) {
        console.log("Ошибка загрузки данных: " + textStatus + ", " + error);
        main([]);
    });
});
