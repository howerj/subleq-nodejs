const subleq = require("./subleq")

const hi = `9 -1 3 10 -1 6 0 0 -1 72 105 0`;
const hello = `12 12 3 36 37 6 37 12 9 37 37 12 0 -1 15 38 36 18
12 12 21 53 37 24 37 12 27 37 37 30 36 12 -1 37 37 0 39 0 -1 72 101 108
108 111 44 32 87 111 114 108 100 33 10 53`;

var cpu = new subleq({
  putch: function (ch) { process.stdout.write(String.fromCharCode(ch)); },
  getch: function () {
	let buffer = Buffer.alloc(1)
	if (require("fs").readSync(0, buffer, 0, 1) != 1)
		return -1;
	return buffer.toString('utf8').charCodeAt(0);
  }
});

cpu.loadFromString(hi, true);
cpu.putch(10);
cpu.loadFromString(hello, true);

cpu.load(cpu.eforth());

cpu.eval(".( EFORTH LOADED - USED:) here u. cr");
cpu.eval(".( WORDS: ) words cr");


