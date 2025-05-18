function isValidNumber(value) {
    if (isNaN(value) || value === null) {
        return false;
    }
    return true;
}

// Функция-исполнитель для калькулятора
function calculate(x, y, operation) {
    let result;
    switch (operation) {
        case '+':
            result = x + y;
            break;
        case '-':
            result = x - y;
            break;
        case '*':
            result = x * y;
            break;
        case '/':
            if (y === 0) {
                alert("Деление на ноль невозможно.");
                result = null;
            } else {
                result = x / y;
            }
            break;
        default:
            result = null;
    }

    return result;
}
function calculateClick() {
    let x = Number(document.getElementById("x").value);
    let operation = document.getElementById("operation").value;
    let y = Number(document.getElementById("y").value);

    if (!isValidNumber(x)) {
        alert("Ошибка: Первое число введено некорректно.");
        return;
    }

    if (!isValidNumber(y)) {
        alert("Ошибка: Второе число введено некорректно.");
        return;
    }

    let result = calculate(x, y, operation);

    if (result !== null) {
        document.getElementById("resultCalc").textContent = "Результат: " + result;
    }
}


////////

document.addEventListener("DOMContentLoaded", function() {
    // 1, 7 - Вывод текущей дат
    // const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    const days = [
        ["Понедельник", "Понедельник"],
        ["Вторник", "Вторник"],
        ["Среда", "Среда"],
        ["Четверг", "Четверг"],
        ["Пятница", "Пятница"],
        ["Суббота", "Суббота"],
        ["Воскресенье", "Воскресенье"]
    ];

    let now = new Date();
    console.log(days[now.getDay()][1]);
    let dayOfWeek = days[now.getDay()-1][1];
    let day = now.getDate();
    let month = months[now.getMonth()];
    let year = now.getFullYear();

    document.getElementById("dateTable").innerHTML = `
        <tr><td>${dayOfWeek}</td></tr>
        <tr><td>${day} ${month}</td></tr>
        <tr><td>${year}</td></tr>`;

    // 8 - Подсчет дней до сессии
    let sessionDate = new Date(year, 5, 10);
    let diff = Math.ceil((sessionDate - now) / (1000 * 60 * 60 * 24));
    document.getElementById("daysToSession").value = diff;
});

// 9 - Запрос и отображение памятной даты
function saveMemoryDate() {
    let memoryDate = prompt("Введите памятную дату (дд.мм.гггг):");
    if (memoryDate) {
        document.getElementById("memoryDateResult").textContent = `Ваша памятная дата: ${memoryDate}`;
    }
}

// 10, 11, 12 - Вычисление суммы числовой последовательности (5 + 3n)
function calculateSequenceSum() {
    let input = prompt("Введите номер первого члена и количество членов через запятую (например: 1,5)");
    let [start, count] = input.split(",").map(Number);
    console.log(start)
    console.log(count)

    if (isNaN(start) || isNaN(count) || count <= 0) {
        alert("Ошибка: введите корректные числовые значения.");
        return;
    }

    let sum = 0;
    for (let i = 0; i < count; i++) {
        sum += 5 + 3 * (start + i);
    }

    document.getElementById("sequenceResult").textContent = `Сумма: ${sum}`;
}



