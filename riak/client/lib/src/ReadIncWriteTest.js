const {SlidingWindow} = require('./SlidingWindow');
const moment = require("moment");

class ReadIncWriteTest {
    constructor(nodes, period) {
        this.nodes = nodes;
        this.cps = new SlidingWindow();
        this.isActive = false;
        this.period = period;
        this.ids = nodes.map(node => node.id);
    }
    async run() {
        this.isActive = true;
        const threads = [];
        
        threads.push(this.agg());
        for (let i=0;i<this.nodes.length;i++) {
            threads.push(this.startClientThread(this.nodes[i], "key" + i));
        }
        
        for (const thread of threads) {
            await thread;
        }
    }
    async agg() {
        const started = time_us();
        var dims = this.ids.concat(this.ids.map(x => `${x}:err`));
        console.info("#legend: time|" + dims.join("|"));

        while (this.isActive) {
            await new Promise((resolve, reject) => {
                setTimeout(() => resolve(true), this.period);
            });
            const time = time_us()
            this.cps.forgetBefore(time - this.period*1000)
            
            console.info(
                "" + Math.floor((time - started) / (this.period * 1000)) + "\t" + this.cps.getStat(dims) +
                "\t" + moment().format("YYYY/MM/DD hh:mm:ss")
            );
        }
    }
    async startClientThread(node, key) {
        while (this.isActive) {
            try {
                const read = await node.read(key);
                if (read==null) {
                    await node.create(key, "0");
                } else {
                    await node.update(key, { 
                        version: read.version,
                        value: parseInt(read.value) + 1
                    });
                }
                this.cps.enqueue(time_us(), node.id);
            } catch (e) {  
                this.cps.enqueue(time_us(), node.id + ":err");
            }
        }
    }
}

exports.ReadIncWriteTest = ReadIncWriteTest;

function time_us() {
    const [s, ns] = process.hrtime();
    return (s*1e9 + ns) / 1000;
}