const {SlidingWindow} = require('./SlidingWindow');
const {RetriableClient} = require('./RetriableClient');
const {RoachKV} = require('./RoachKV');

class ReadIncWriteTest {
    constructor(nodes) {
        this.nodes = nodes;
        this.cps = new SlidingWindow();
        this.hostPorts = nodes.map(node => node.host + ":" + node.port);
        this.isActive = false;
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
        while (this.isActive) {
            await new Promise((resolve, reject) => {
                setTimeout(() => resolve(true), 1000);
            });
            const time = time_us()
            this.cps.forgetBefore(time - 1000*1000)
            
            console.info(
                "" + Math.floor((time - started) / (1000 * 1000)) + "\t" + 
                this.cps.getStat(this.hostPorts)
            );
        }
    }
    async startClientThread(node, key) {
        const hostPort = node.host + ":" + node.port;
        const conn = new RetriableClient(node);
        const service = new RoachKV(conn);
        while (this.isActive) {
            try {
                const read = await service.read(key);
                if (read==null) {
                    await service.create(key, "0");
                } else {
                    await service.update(key, parseInt(read) + 1);
                }
                this.cps.enqueue(time_us(), hostPort);
            } catch (e) { }
        }
    }
}

exports.ReadIncWriteTest = ReadIncWriteTest;

function time_us() {
    const [s, ns] = process.hrtime();
    return (s*1e9 + ns) / 1000;
}