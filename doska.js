// 4/2/1
let str;
let n = 10;
let blue = 9;

document.write("<table>");
for (let i = 0; i < n; i++) {
    blue--
    document.write("<tr>");
    for (let j = 0; j < n; j++) {
        if (j < blue) {
            str = "class='r1'"; // в серый
        } else {
            str = "class='r2'";
        }
        document.write("<td " + str + "></td>");
    }
    document.write("</tr>");
}
document.write("</table>");


/// 5/18
function sumSecondHalfDigits(number) {
    let numToString = number.toString();
    console.log(`numToString = ${numToString}`)
    let secondHalf = numToString.slice(Math.floor(numToString.length / 2));
    console.log(`secondHalf = ${secondHalf}`)

    let sum = 0;
    for (let el of secondHalf) {
        sum += Number(el);
        console.log(`el = ${el}: sum = ${sum}`)
    }
    return sum;
}

function sumSecondHalfDigitsClick() {
    let number = Number(document.getElementById("number").value);
    if (isNaN(number)) {
        alert("Ошибка: Введите корректное число.");
        return;
    }
    document.getElementById("resultHalf").textContent = `Результат: ${sumSecondHalfDigits(number)}`;
}

// 5/31
function findKthDigit(k) {
    let sequence = "";
    let num = 2;

    while (sequence.length < k) {
        sequence += num;
        num += 2;
    }
    console.log(sequence)

    return sequence[k - 1];
    document.getElementById("resultDigit").textContent = sequence[k - 1];
}

function findKthDigitClick() {
    let k = Number(document.getElementById("numberDigit").value);

    document.getElementById("resultDigit").textContent = `Результат: ${findKthDigit(k)}`;
}