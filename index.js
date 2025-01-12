const display = document.querySelector('#display');
const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.operator');
const commands = document.querySelectorAll('.command');

class Buffer {
    buffer = [];
    accumulator = 0;
    operator = null;
    vestigial = false;

    constructor(display){
        this.display = display;
    }

    addOperator(operator){
        this.evalOperation();
        this.operator = operator;
        this.accumulator = this.evalBuffer()
        this.vestigial = true;
    }

    evalOperation(){
        if(!this.operator) return
        this.buffer = (eval(`${this.accumulator} ${this.operator} ${this.evalBuffer()}`)).toString().split("").slice();
        this.operator = null;
        this.vestigial = true;
        this.render();
    }

    evalBuffer(){
        if (this.buffer.length > 0){
            return parseFloat(this.buffer.join(""));
        }
        return 0
    }

    clear(){        
        this.buffer = [];
        this.vestigial = false;
        this.render();
    }

    add(value){
        if (this.vestigial){
            this.clear()
        }
        if(this.buffer.length > 11){
            return
        }
        if (value === '.'){
            if (this.buffer.includes(value)){
                return;
            }
            if (this.buffer.length === 0){
                this.buffer.push('0');
            }
        }
        if (value === "0") {
            if (this.buffer.length === 1 && this.buffer[0] === '0') {
                return;
            }
        }
        this.buffer.push(value);
        this.render();
    }

    render(){
        this.display.innerHTML = this.buffer.join("");
    }
}

const buffer = new Buffer(display);

digits.forEach(digit => {
    digit.addEventListener('click', () => {
        buffer.add(digit.textContent);
    })
})

commands.forEach(command => {
    command.addEventListener('click', () => {
        if (command.textContent === 'c'){
            buffer.operator = null
            buffer.clear();
        }
        if (command.textContent === '='){
            buffer.evalOperation();
        }
    })
})

operators.forEach(operator=>{
    operator.addEventListener('click', () => {
        buffer.addOperator(operator.textContent);
    })
})