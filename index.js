function isValidNumber(value) {
    if (isNaN(value) || value === null) {
        return false;
    }
    return true;
}

let x = +prompt("Введите первое число (x):");
if (!isValidNumber(x)) {
    alert("Ошибка: Первое число введено некорректно.");
} else {
    let y = +prompt("Введите второе число (y):");
    if (!isValidNumber(y)) {
        alert("Ошибка: Второе число введено некорректно.");
    } else {
        let operation = prompt("Введите знак арифметической операции (+, -, *, /):");
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
                alert("Ошибка: Неверный знак арифметической операции.");
                result = null;
        }

        if (result !== null) {
            alert("Результат: " + result);
        }
    }
}