const Queue = require('avkrash-queue');

class SlidingWindow {
    constructor() {
        this.queue = new Queue();
        this.stat = new Map();
        this.stat.set("*", 0);
    }
    enqueue(ts, mark) {
        if (!this.stat.has(mark)) {
            this.stat.set(mark, 0);
        }
        this.stat.set(mark, this.stat.get(mark) + 1);
        this.stat.set("*", this.stat.get("*") + 1);
        this.queue.enqueue({ ts, mark });
    }
    forgetBefore(ts) {
        while (!this.queue.isEmpty() && this.queue.peek().ts < ts) {
            const record = this.queue.dequeue();
            this.stat.set("*", this.stat.get("*") - 1);
            this.stat.set(record.mark, this.stat.get(record.mark) - 1);
        }
    }
    getStat(hostPorts) {
        let message = "" + this.stat.get("*");
        for (const hostPort of hostPorts) {
            let count = 0;
            if (this.stat.has(hostPort)) {
                count = this.stat.get(hostPort);
            }
            message += "\t" + count; 
        }
        return message;
    }
}

exports.SlidingWindow = SlidingWindow;