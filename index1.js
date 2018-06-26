/* If the code below ran "hi" would never happend
setTimeout(() => console.log("hi"), 1);
function foo() { for(let i=0; i<= 1E10; i++) console.log(i) }
foo()
// out would be
// 0..1E10
// "hi"

* iterators allow loop to stop cooperatively mid loop
*/

console.log("");
console.log("foo");
function* foo() {
  const x = 1 + (yield "foo");
  console.log(x);
}

const it = foo();
console.log(it.next(1));
console.log(it.next(1));

const a = [1, 2];

// console.log(a.next());

console.log("");
console.log("foo2");
function* foo2() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

const it2 = foo2();

console.log(it2.next());
console.log(it2.next());
console.log(it2.next());
console.log(it2.next());
console.log(it2.next());
console.log(it2.next());
console.log(it2.next());

console.log("");
console.log("foo3");
function* foo3() {
  let a = yield 1;
  console.log(`a = ${a}`);
  a = yield 2;
  console.log(`a = ${a}`);
  a = yield 3;
  console.log(`a = ${a}`);
  a = yield 4;
  console.log(`a = ${a}`);
  a = yield 5;
  console.log(`a = ${a}`);
}

let x = 10;
const it3 = foo3();
console.log(it3.next(x++));
console.log(it3.next(x++));
console.log(it3.next(x++));
console.log(it3.next(x++));
console.log(it3.next(x++));
console.log(it3.next(x++));

for (let it3a of foo3()) {
  console.log(it3a);
}

console.log("");
console.log("foo4");
function* foo4() {
  yield 1;
  return 2;
}
const it4 = foo4();
console.log(it4.next());
console.log(it4.next());
console.log(it4.next());

console.log("");
console.log("foo5");
function* foo5(x) {
  var y = 2 * (yield x + 1);
  console.log(y);
  var z = yield y / 3;
  console.log(z);
  return x + y + z;
}

var it5 = foo5(5);
console.log(it5.next());
console.log(it5.next(12));
console.log(it5.next(13));

console.log("");
console.log("foo6");
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (var v of foo()) console.log(v);

console.log(v);
// still `5`, not `6` :(
