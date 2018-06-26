const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function sleep(ms, msg, cb) {
  await pause(ms);
  console.log(`\n${msg}`);
  cb();
}

sleep(0, "Async with Generators", () => {
  function request(url) {
    // this is where we're hiding the asynchronicity,
    // away from the main code of our generator
    // `it.next(..)` is the generator's iterator-resume
    // call
    const simulate = true;
    if (simulate) {
      setTimeout(() => {
        it.next(`{ "id": 123, "value": "this"}`);
      }, 250);
    } else {
      makeAjaxCall(url, function(response) {
        it.next(response);
      });
    }
    // Note: nothing returned here!
  }

  function* main() {
    var result1 = yield request("http://some.url.1");
    var data = JSON.parse(result1);

    var result2 = yield request("http://some.url.2?id=" + data.id);
    var resp = JSON.parse(result2);
    console.log("The value you asked for: " + resp.value);
  }

  var it = main();
  it.next(); // get it all started})();
});

// sleeping to allow the above code to finish
sleep(600, "Async and cache with Generators", () => {
  let cache = {};

  function request(url) {
    // this is where we're hiding the asynchronicity,
    // away from the main code of our generator
    // `it.next(..)` is the generator's iterator-resume
    // call
    const resp = `{ "id": 1234, "value": "this2"}`;
    if (true) {
      //if (cache[url]) {
      // "defer" cached response long enough for current
      // execution thread to complete
      setTimeout(function() {
        //it.next(cache[url]);
        it.next(resp);
      }, 0);
    } else {
      const simulate = true;
      if (simulate) {
        cache[url] = resp;
        setTimeout(() => {
          it.next(resp);
        }, 250);
      } else {
        makeAjaxCall(url, function(response) {
          it.next(response);
        });
      }
    }
    // Note: nothing returned here!
  }

  function* main() {
    // this yield require request to be run before the yield
    // so it.next() should not be called imediately in request but after a while
    var result1 = yield request("http://some.url.1");
    var data = JSON.parse(result1);

    var result2 = yield request("http://some.url.2?id=" + data.id);
    var resp = JSON.parse(result2);
    console.log("The value you asked for: " + resp.value);
  }

  var it = main();
  it.next(); // get it all started})();
});

sleep(1200, "Async Promise with Generators", () => {
  function request(url) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        resolve(`{ "id": 12345, "value": "this3"}`);
      }, 250);
    });
  }

  // run (async) a generator to completion
  // Note: simplified approach: no error handling here
  function runGenerator(g) {
    var it = g(),
      ret;

    // asynchronously iterate over generator
    (function iterate(val) {
      ret = it.next(val);

      if (!ret.done) {
        // poor man's "is it a promise?" test
        if ("then" in ret.value) {
          // wait on the promise
          ret.value.then(iterate);
        }
        // immediate value: just send right back in
        else {
          // avoid synchronous recursion
          setTimeout(function() {
            iterate(ret.value);
          }, 0);
        }
      }
    })();
  }

  runGenerator(function* main() {
    var result1 = yield request("http://some.url.1");
    var data = JSON.parse(result1);

    var result2 = yield request("http://some.url.2?id=" + data.id);
    var resp = JSON.parse(result2);
    console.log("The value you asked for: " + resp.value);
  });

  runGenerator(function* main() {
    console.log(yield { val: 1 });
    console.log(yield { val: 2 });
    console.log(yield { val: 3 });
  });
});
