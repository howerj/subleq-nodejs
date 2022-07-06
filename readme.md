# An N-Bit SUBLEQ Virtual Machine with test images for node-js

* Author: Richard James Howe
* Email: howe.r.j.89@gmail.com
* Repo: https://github.com/howerj/subleq-nodejs
* License: MIT / Public Domain

This is a virtual machine that implements an 8 to 32 bit [SUBLEQ](https://esolangs.org/wiki/Subleq) 
One Instruction Set Computer (OISC). The default cell size is 16-bit. Images can be as
large as you like, but be aware the machine cell width restricts how much the
OISC can address. It's just for fun.

If you feel like supporting the project you can buy a book from
Amazon, available [here](https://www.amazon.com/SUBLEQ-EFORTH-Forth-Metacompilation-Machine-ebook/dp/B0B5VZWXPL)
that describes how the project works and how to port a Forth to
a new platform.

Similar projects, same author:

* <https://github.com/howerj/subleq>, virtual machine written in C with
  self-hosted eForth system for SUBLEQ.
* <https://github.com/howerj/subleq-js>, a JavaScript version of the
  SUBLEQ machine, different to this one, that runs on
  <https://howerj.github.io/subleq.htm>.

# Example

This example program takes a string containing a SUBLEQ program
and loads it into the SUBLEQ VM, it then executes it.


```js
	const subleq = require("@howerj/subleq")

	const hello = `12 12 3 36 37 6 37 12 9 37 37 12 0 -1 15 38 36 18
	12 12 21 53 37 24 37 12 27 37 37 30 36 12 -1 37 37 0 39 0 -1 72 101 108
	108 111 44 32 87 111 114 108 100 33 10 53`;

	var cpu = new subleq({
	  putch: function (ch) { process.stdout.write(String.fromCharCode(ch)); },
	});

	cpu.loadFromString(hello, true);

```

This example runs the default eForth image and allows the user to
interactively program in a REPL.

```js
	const subleq = require('@howerj/subleq');

	var cpu = new subleq({
	  putch: function (ch) { process.stdout.write(String.fromCharCode(ch)); },
	  getch: function () {
		let buffer = Buffer.alloc(1)
		if (require("fs").readSync(0, buffer, 0, 1) != 1)
			return -1;
		return buffer.toString('utf8').charCodeAt(0);
	  }
	});

	cpu.load(cpu.eforth());
	cpu.eval(".( EFORTH READY ) cr");
	cpu.run()
```

All options width sensible default values are shown here:

```js
	const subleq = require('@howerj/subleq');

	var cpu = new subleq({
	  putch: function (ch) { process.stdout.write(String.fromCharCode(ch)); }, // Example putch, writes to stdout
	  getch: function () { // Example getch, reads from stdin
		let buffer = Buffer.alloc(1)
		if (require("fs").readSync(0, buffer, 0, 1) != 1)
			return -1;
		return buffer.toString('utf8').charCodeAt(0);
	  },
	  debug: false, // If true debugging information is logged to the console
	  width: 16, // SUBLEQ machine width, 8-32 bit inclusive
	  timeout_ms: 0, // If non zero setTimeout will be called when cycles run out or input returns an error
	});
```

# API

## load(arr, length = 32768, run = false)

Load signed values from an array *arr* into the memory of the SUBLEQ CPU,
enough memory will be allocated to hold all of the values in *arr*, however
your program might require additional memory, which can be optionally 
specified with the *length* parameter. Optionally the function can be told
to call *run()* after loading. This function will either return *null* or
the result of *run()*.

## loadFromString(str, run = false)

Load from a string instead of an array, most SUBLEQ programs found on the
internet consist of ASCII text containing a list of space delimited 
signed decimal values, this function can split a string containing that
format into an array and then *load()* it. Much like *load()*, *run()*
can be called if the *run* parameter is true. The function will return
*null* or the result of *run()*.

## eforth()

This function returns an array containing a complete [Forth](https://en.wikipedia.org/wiki/Forth_%28programming_language%29) 
image, which when used in conjunction with *load()* will run a the
programming language, care must be taken to hook up the appropriate
*putch* and *getch* functions. The eForth image will only work on the
16-bit version of the SUBLEQ VM!

## get/set putch

This getter/setter combo allow the setting of the *putch* function
used by the SUBLEQ machine for output. The function should behave
like the [C](https://en.wikipedia.org/wiki/The_C_Programming_Language)
function ["putchar"](https://www.cplusplus.com/reference/cstdio/putchar/),
the function should accept a single value in the range 0 to 127
which should represent a single [ASCII](https://en.wikipedia.org/wiki/ASCII)
character to be output. You may return negative on failure, but it will
not be used by the SUBLEQ VM (output is assumed to succeed).

The default *putch* callback will swallow characters, doing nothing
with them.

## get/set getch

This getter/setter combo allow the setting of the *getch* function
used by the SUBLEQ machine for input. The function should behave
like the [C](https://en.wikipedia.org/wiki/The_C_Programming_Language)
function ["getchar"](https://www.cplusplus.com/reference/cstdio/getchar/),
the function should return a negative integer on failure, and on success
should return a number representing the
[ASCII](https://en.wikipedia.org/wiki/ASCII) character value to
be input.

The default *getch* callback will return -1, indicating failure
to get input.

## run(cycles = 0)

Run the currently loaded program, this will be run for the number
of cycles given to the program (or if the cycles is set to zero,
which it is by default, it will continue to run until some other
halt conditions are met).

The function currently always returns *null*.

## step()

Single step execution of the SUBLEQ machine with the previously loaded
program. *step()* returns the same result as *run()*.

## stop()

Prevent the machine from running.

## start()

Continue a *stop()*'ped machine.

## reset()

Reset execution so the Virtual Machine as it was when execution
started (eg. The program counter is zero).

## eval(s, append = "\n")

Evaluate a string, *s*, that is set the input to the virtual machine to
the string and continue *run()* the VM until the input is consumed
by the previously loaded program. *append* is appended to the input
string *s*. The program might chose to do nothing with the string.

