const {SlidingWindow} = require("./SlidingWindow");

class ReadIncWriteTest {
    constructor(conns, period) {
        this.cps = new SlidingWindow();
        this.conns = conns;
        this.period = period;
        this.isActive = false;
    }
    
    async run() {
        this.isActive = true;
        const threads = [];

        threads.push(this.agg());
        for (let i=0;i<this.conns.length;i++) {
            threads.push(this.startClientThread(this.conns[i], "key" + i));
        }

        for (const thread of threads) {
            await thread;
        };
    }

    async agg() {
        const started = time_us();
        const hostPorts = this.conns.map(conn => conn.hostPort);
        while (this.isActive) {
            await new Promise((resolve, reject) => {
                setTimeout(() => resolve(true), this.period);
            });
            const time = time_us()
            this.cps.forgetBefore(time - this.period*1000)
            
            console.info(
                "" + Math.floor((time - started) / (this.period * 1000)) + "\t" + 
                this.cps.getStat(hostPorts)
            );
        }
    }

    async startClientThread(conn, key) {
        while (this.isActive) {
            try {
                const read = await conn.read(key);
                let written = null;
                if (read == null) {
                    await conn.create(key, "0");
                } else {
                    await conn.write(key, read.ver, "" + (parseInt(read.val) + 1));
                }
                this.cps.enqueue(time_us(), conn.hostPort);
            } catch(e) { }
        }
    }
}

exports.ReadIncWriteTest = ReadIncWriteTest;

function time_us() {
    const [s, ns] = process.hrtime();
    return (s*1e9 + ns) / 1000;
}