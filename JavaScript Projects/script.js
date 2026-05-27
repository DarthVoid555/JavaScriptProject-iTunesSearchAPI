String.prototype.size = "14px";

String.prototype.write = stringWrite;

function stringWrite() {
    console.log("Цвет текста: " + this.color);
    console.log("Размер шрифта: " + this.size);
    console.log("Текст: " + this.toString());
}

let s = new String("Это строка");
s.color = "red";
s.size = "16px";
s.write();

console.log("---");

let s2 = new String("Вторая строка");
s2.color = "blue";
s2.write();

console.log("---");

let s3 = new String("Третья строка");
s3.color = "green";
s3.write();