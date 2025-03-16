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


// 5/18
function sumSecondHalfDigits(number) {
    let numToString = number.toString();
    console.log(`numToString = ${numToString}`)
    let secondHalf = numToString.slice(Math.floor(numToString.length / 2));
    console.log(`secondHalf = ${secondHalf}`)

    let sum = 0;
    for (let el of secondHalf) {
        //console.log(`el = ${el}: sum = ${sum}`)
        sum += Number(el);
    }
    return sum;
}

console.log("Вывод процесса работы кода для задания 5/18")
let number = prompt("Задайте число для задания 18");
console.log(sumSecondHalfDigits(number));


function findKthDigit(k) {
    let sequence = "";
    let num = 2;

    while (sequence.length < k) {
        sequence += num;
        num += 2;
    }
    console.log(sequence)

    return sequence[k - 1];
}

let number2 = prompt("Задайте число K");
console.log(`k-я цифра последовательности ${findKthDigit(number2)}`);