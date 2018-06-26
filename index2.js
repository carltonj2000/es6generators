console.log("");
console.log("foo");
function* foo() {
  try {
    const x = yield 3;
    console.log("x: " + x); // may never get here!
  } catch (err) {
    console.log("Error: " + err);
  }
}

it = foo();

console.log(it.next());
it.throw("hell no");

console.log("");
console.log("foo2");

function* foo2() {}
const it2 = foo2();
try {
  it2.throw("error");
} catch (e) {
  console.log("error:", e);
}

console.log("");
console.log("foo3");

function* foo3() {
  var x = yield 3;
  var y = x.toUpperCase(); // could be a TypeError error!
  yield y;
}

const it3 = foo3();

it3.next(); // { value:3, done:false }

try {
  it3.next(42); // `42` won't have `toUpperCase()`
} catch (err) {
  console.log("to upper failed"); // TypeError (from `toUpperCase()` call in err)
}

console.log("");
console.log("foo4");

function* foo4() {
  yield 3;
  yield 4;
}

function* bar() {
  yield 1;
  yield 2;
  yield* foo4(); // `yield *` delegates iteration control to `foo()`
  yield 5;
}

for (const v of bar()) {
  console.log(v);
}

(() => {
  console.log("");
  console.log("yield with value");

  function* foo() {
    var z = yield 3;
    var w = yield 4;
    console.log("z: " + z + ", w: " + w);
  }

  function* bar() {
    var x = yield 1;
    var y = yield 2;
    yield* foo(); // `yield*` delegates iteration control to `foo()`
    var v = yield 5;
    console.log("x: " + x + ", y: " + y + ", v: " + v);
  }

  var it = bar();

  it.next(); // { value:1, done:false }
  it.next("X"); // { value:2, done:false }
  it.next("Y"); // { value:3, done:false }
  it.next("Z"); // { value:4, done:false }
  it.next("W"); // { value:5, done:false }
  // z: Z, w: W

  it.next("V"); // { value:undefined, done:true }
  // x: X, y: Y, v: V
})();

(() => {
  console.log("");
  console.log("yield with returned value");
  function* foo() {
    yield 2;
    yield 3;
    return "foo"; // return value back to `yield*` expression
  }

  function* bar() {
    yield 1;
    var v = yield* foo();
    console.log("v: " + v);
    yield 4;
  }

  var it = bar();

  console.log(it.next()); // { value:1, done:false }
  console.log(it.next()); // { value:2, done:false }
  console.log(it.next()); // { value:3, done:false }
  console.log(it.next()); // "v: foo"   { value:4, done:false }
  console.log(it.next()); // { value:undefined, done:true }
})();

(() => {
  console.log("");
  console.log("nested yield error handling");

  function* foo() {
    try {
      yield 2;
    } catch (err) {
      console.log("foo caught: " + err);
    }

    yield; // pause

    // now, throw another error
    throw "Oops!";
  }

  function* bar() {
    yield 1;
    try {
      yield* foo();
    } catch (err) {
      console.log("bar caught: " + err);
    }
  }

  var it = bar();

  it.next(); // { value:1, done:false }
  it.next(); // { value:2, done:false }

  it.throw("Uh oh!"); // will be caught inside `foo()`
  // foo caught: Uh oh!

  it.next(); // { value:undefined, done:true }  --> No error here!
  // bar caught: Oops!
})();
