module.exports = class VariableStack {

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

    getValueAbove(layerCount = 1){
        return this.stack[this.stack.length - 1 - layerCount].value;
    }

    push(name, value = {}){
        if(this.top.value[name]){
            value = this.value;
        } else {
            this.top.value[name] = value;
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
};
