const BufferList = require('bl');
const { Transform } = require('readable-stream');

class VariableStack {

    stack = [{ isRoot: true, value: {} }];

    get top(){
        return this.stack[this.stack.length - 1];
    }

    get value(){
        return this.top.value;
    }

    set value(val){
        this.top.value = val;
    }

    push(name, value = {}){
        if(this.top.value[name]){
            value = this.value;
        }

        this.stack.push({
            isRoot: false,
            name,
            value
        });
    }

    pop(){
        let popLayer = this.top;
        if(popLayer.isRoot){
            throw new Error('can\'t pop root layer');
        }

        this.stack.pop();

        this.value[popLayer.name] = popLayer.value;
    }

    popAll(){
        while(!this.top.isRoot){
            this.pop();
        }
    }
}


module.exports = class Dissolve extends Transform {
    jobs = [];
    varStack = new VariableStack();
    buffer = new BufferList();
    offset = 0;

    static defaults = {
        endianness: 'le',
        loopVarName: '__loop_tmp',
        encoding: 'utf8',
        shortenOnEOF: true
    };

    get vars(){
        return this.varStack.value;
    }

    set vars(val){
        this.varStack.value = val;
    }

    constructor(options){
        super({ ...options, objectMode: true, encoding: null });

        this.options = {
            ...Dissolve.defaults,
            ...options
        };
    }

    _transform(chunk, encoding, done){
        this.offset = 0;

        this.buffer.append(chunk);

        while(this.jobs.length > 0){
            let job = this.jobs[0];

            if(job.type === 'push'){
                this.jobs.shift();
                this.varStack.push(job.name, job.value);
                continue;

            } else if(job.type === 'pop'){
                this.jobs.shift();
                this.varStack.pop();
                continue;

            } else if(job.type === 'tap'){
                this.jobs.shift();

                let unqueue = this.queueJobs();

                // if the tap has a name, we push a new var-layer
                if(job.name){
                    this
                        .push(job.name)
                        .tap(job.callback, job.args)
                        .pop()

                } else {
                    job.callback.apply(this, job.args);
                }

                unqueue();
                continue;

            } else if(job.type === 'loop'){
                if(job.finished){
                    this.jobs.shift();
                    continue;
                }

                let unqueue = this.queueJobs();

                if(job.name){
                    if(!this.vars[job.name]){
                        this.vars[job.name] = [];
                    }

                    this
                        .tap(this.options.loopVarName, job.callback, [job.finish, job.discard])
                        .tap(function(){
                            if(!job.discarded){
                                this.vars[job.name].push(this.vars[this.options.loopVarName]);
                            }
                            job.discarded = false;
                            delete this.vars[this.options.loopVarName];
                        });

                } else {
                    this.tap(job.callback, [job.finish, job.discard]);
                }

                unqueue();
                continue;
            }

            // determine length of next job
            let length;
            if(typeof job.length === 'string'){
                length = this.vars[job.length];
            } else {
                length = job.length;
            }

            let remainingBuffer = this.buffer.length - this.offset;

            if(this.options.shortenOnEOF && remainingBuffer > 0 && remainingBuffer <= length && (job.type === 'buffer' || job.type === 'string')){
                length = remainingBuffer;
            }

            // break on end of buffer
            if(this.buffer.length - this.offset < length){

                if(this.jobs.length > 0){
                    // unwind loop, by removing the loop job
                    this.unwindRemainingJobs();
                    continue;
                }
                break;
            }

            if(job.type === 'buffer'){
                this.jobs.shift();
                this.vars[job.name] = this.buffer.slice(this.offset, this.offset + length);
                this.offset += length;
                continue;

            } else if(job.type === 'string'){
                this.jobs.shift();
                this.vars[job.name] = this.buffer.toString(job.encoding, this.offset, this.offset + length);
                this.offset += length;
                continue;

            } else if(job.type === 'skip'){
                this.jobs.shift();
                this.offset += length;
                continue;

            } else {
                switch (job.type) {
                    case "int8le":  { this.vars[job.name] = this.buffer.readInt8(this.offset);  break; }
                    case "int8be":  { this.vars[job.name] = this.buffer.readInt8(this.offset);  break; }
                    case "uint8le": { this.vars[job.name] = this.buffer.readUInt8(this.offset); break; }
                    case "uint8be": { this.vars[job.name] = this.buffer.readUInt8(this.offset); break; }

                    case "int16le":  { this.vars[job.name] = this.buffer.readInt16LE(this.offset);  break; }
                    case "int16be":  { this.vars[job.name] = this.buffer.readInt16BE(this.offset);  break; }
                    case "uint16le": { this.vars[job.name] = this.buffer.readUInt16LE(this.offset); break; }
                    case "uint16be": { this.vars[job.name] = this.buffer.readUInt16BE(this.offset); break; }

                    case "int32le":  { this.vars[job.name] = this.buffer.readInt32LE(this.offset);  break; }
                    case "int32be":  { this.vars[job.name] = this.buffer.readInt32BE(this.offset);  break; }
                    case "uint32le": { this.vars[job.name] = this.buffer.readUInt32LE(this.offset); break; }
                    case "uint32be": { this.vars[job.name] = this.buffer.readUInt32BE(this.offset); break; }

                    case "int64le":  { this.vars[job.name] = (Math.pow(2, 32) * this.buffer.readInt32LE(this.offset + 4)) + ((this.buffer[this.offset + 4] & 0x80 === 0x80 ? 1 : -1) * this.buffer.readUInt32LE(this.offset)); break; }
                    case "int64be":  { this.vars[job.name] = (Math.pow(2, 32) * this.buffer.readInt32BE(this.offset)) + ((this.buffer[this.offset] & 0x80 === 0x80 ? 1 : -1) * this.buffer.readUInt32BE(this.offset + 4)); break; }
                    case "uint64le": { this.vars[job.name] = (Math.pow(2, 32) * this.buffer.readUInt32LE(this.offset + 4)) + this.buffer.readUInt32LE(this.offset); break; }
                    case "uint64be": { this.vars[job.name] = (Math.pow(2, 32) * this.buffer.readUInt32BE(this.offset)) + this.buffer.readUInt32BE(this.offset + 4); break; }

                    case "floatle":  { this.vars[job.name] = this.buffer.readFloatLE(this.offset);  break; }
                    case "floatbe":  { this.vars[job.name] = this.buffer.readFloatBE(this.offset);  break; }

                    case "doublele": { this.vars[job.name] = this.buffer.readDoubleLE(this.offset); break; }
                    case "doublebe": { this.vars[job.name] = this.buffer.readDoubleBE(this.offset); break; }
                    default: { return done(new Error(`invalid job type ${job.type}`)); }
                }

                this.jobs.shift();
                this.offset += length;
            }
        }

        this.push(null);
        this.buffer.consume(this.offset);
        return done();
    }


    /**
     * purges all jobs from the job-queue, which need to read from the stream
     */
    unwindRemainingJobs(){
        let filteredJobs = this.jobs
            .slice()
            .filter(job => job.type === 'pop' || (job.type === 'tap' && !job.name));

        this.jobs.splice(0);
        this.jobs.push(...filteredJobs);
    }

    pushJob(name, type, length, options){
        this.jobs.push({ name, type, length, ...options });
        return this;
    }

    queueJobs(){
        let queuedJobs = this.jobs.slice();
        // empty jobs
        this.jobs.splice(0);

        // unqueue-method
        return () => this.jobs.push(...queuedJobs);
    }

    tap(name, callback, args){
        if(typeof name === 'function'){
            args = callback;
            callback = name;
            name = undefined;
        }

        this.jobs.push({
            name,
            type: 'tap',
            args,
            callback
        });
        return this;
    }

    loop(name, callback){
        if(typeof name === 'function'){
            callback = name;
            name = undefined;
        }

        let loopJob = {
            name,
            type: 'loop',
            callback,
            finished: false,
            discarded: false
        };

        loopJob.finish = function(discard){
            loopJob.finished = true;
            loopJob.discarded = !!discard;
        }

        loopJob.discard = function(){
            loopJob.discarded = true;
        }

        this.jobs.push(loopJob);
        return this;
    }

    skip(length){
        this.jobs.push({
            type: 'skip',
            length
        });
        return this;
    }

    pop(){
        this.jobs.push({
            type: 'pop'
        });
        return this;
    }

    push(name, value){
        this.jobs.push({
            type: 'push',
            name,
            value
        });
        return this;
    }

    buffer(name, length){ return this.pushJob(name, 'buffer', length); }
    string(name, length, encoding = this.options.encoding){ return this.pushJob(name, 'string', length, { encoding }); }

    int8(name){ return this.pushJob(name, 'int8' + this.options.endianness, 1); }
    int8le(name){ return this.pushJob(name, 'int8le', 1); }
    int8be(name){ return this.pushJob(name, 'int8be', 1); }
    uint8(name){ return this.pushJob(name, 'uint8' + this.options.endianness, 1); }
    uint8le(name){ return this.pushJob(name, 'uint8le', 1); }
    uint8be(name){ return this.pushJob(name, 'uint8be', 1); }

    int16(name){ return this.pushJob(name, 'int16' + this.options.endianness, 2); }
    int16le(name){ return this.pushJob(name, 'int16le', 2); }
    int16be(name){ return this.pushJob(name, 'int16be', 2); }
    uint16(name){ return this.pushJob(name, 'uint16' + this.options.endianness, 2); }
    uint16le(name){ return this.pushJob(name, 'uint16le', 2); }
    uint16be(name){ return this.pushJob(name, 'uint16be', 2); }

    int32(name){ return this.pushJob(name, 'int32' + this.options.endianness, 4); }
    int32le(name){ return this.pushJob(name, 'int32le', 4); }
    int32be(name){ return this.pushJob(name, 'int32be', 4); }
    uint32(name){ return this.pushJob(name, 'uint32' + this.options.endianness, 4); }
    uint32le(name){ return this.pushJob(name, 'uint32le', 4); }
    uint32be(name){ return this.pushJob(name, 'uint32be', 4); }

    int64(name){ return this.pushJob(name, 'int64' + this.options.endianness, 8); }
    int64le(name){ return this.pushJob(name, 'int64le', 8); }
    int64be(name){ return this.pushJob(name, 'int64be', 8); }
    uint64(name){ return this.pushJob(name, 'uint64' + this.options.endianness, 8); }
    uint64le(name){ return this.pushJob(name, 'uint64le', 8); }
    uint64be(name){ return this.pushJob(name, 'uint64be', 8); }

    float(name){ return this.pushJob(name, 'float' + this.options.endianness, 4); }
    floatle(name){ return this.pushJob(name, 'floatle', 4); }
    floatbe(name){ return this.pushJob(name, 'floatbe', 4); }

    double(name){return this.pushJob(name, 'double' + this.options.endianness, 8); }
    doublele(name){return this.pushJob(name, 'doublele', 8); }
    doublebe(name){return this.pushJob(name, 'doublebe', 8); }
}
