class Additive{
    terms = [];
    additive = true;
    toString(){
        const terms = this.terms.map(([s,v])=>[s,v.toString()]).sort((a,b)=>a[1]<b[1]?-1:1);
        let res = "";
        for(let [s,v] of terms){
            if(s){
                res += "-";
            }else{
                res += "+";
            }
            res += v;
        }
        return "("+res+")";
    }
    eval(names){
        let res = 0;
        for(let [s,v] of this.terms){
            let r = s?-1:1;
            if(typeof v === "string"){
                res += r*names[v];
            }else{
                res += r*v.eval(names);
            }
        }
        return res;
    }
}

class Multive{
    terms = [];
    additive = false;
    toString(){
        const terms = this.terms.map(([s,v])=>[s,v.toString()]).sort((a,b)=>a[1]<b[1]?-1:1);
        let res = "";
        for(let [s,v] of terms){
            if(s){
                res += "/";
            }else{
                res += "*";
            }
            res += v;
        }
        return "("+res+")";
    }
    eval(names){
        let res = 1;
        for(let [s,v] of this.terms){
            let r;
            if(typeof v === "string"){
                r = names[v];
            }else{
                r = v.eval(names);
            }
            if(s)r = 1/r;
            res *= r;
        }
        return res;
    }
}


const flattenFormula = function(f, parent, s){// s is sign
    if(typeof f === "string"){
        parent.terms.push([s,f]);
        return;
    }
    if(parent.additive === true){
        if(f.op === "+"){
            flattenFormula(f.l, parent, s);
            flattenFormula(f.r, parent, s);
        }else if(f.op === "-"){
            flattenFormula(f.l, parent, s);
            flattenFormula(f.r, parent, !s);
        }else{
            parent.terms.push([s,flattenFormula(f, new Multive, false)]);
        }
    }else{
        if(f.op === "*"){
            flattenFormula(f.l, parent, s);
            flattenFormula(f.r, parent, s);
        }else if(f.op === "/"){
            flattenFormula(f.l, parent, s);
            flattenFormula(f.r, parent, !s);
        }else{
            parent.terms.push([s,flattenFormula(f, new Additive, false)]);
        }
    }
    return parent;
}

function* permutate(arr){
    if(arr.length === 1){
        yield arr;
        return;
    }
    for(let i = 0; i < arr.length; i++){
        for(let arr2 of permutate([...arr.slice(0,i), ...arr.slice(i+1,arr.length)])){
            arr2.push(arr[i]);
            yield arr2;//[arr[i],...arr2];
        }
    }
}

function* mutate(options,length){
    const n = options.length ** length;
    for(let i = 0; i < n; i++){
        let v = i.toString(options.length);
        v = v.padStart(length, "0");
        yield v.split("").map(v=>options[parseInt(v,36)])
    }
}

for(let v of mutate("+-*/".split(""),4)){
    console.log(v);
}


const getEveryFormula = function(){
    let res = [];
    for(let [A,B,C,D] of permutate("ABCD".split(""))){
        for(let [op1,op2,op3] of mutate("+-*/".split(""),4)){
            res.push({
                op: op1,
                l: {
                    op: op2,
                    l: {
                        op: op3,
                        l: A,
                        r: B,
                    },
                    r: C
                },
                r: D
            });
            res.push({
                op: op1,
                l: {
                    op: op2,
                    l: A,
                    r: {
                        op: op3,
                        l: B,
                        r: C,
                    },
                },
                r: D
            });
            res.push({
                op: op1,
                l: {
                    op: op2,
                    l: A,
                    r: B,
                },
                r: {
                    op: op3,
                    l: C,
                    r: D,
                },
            });
            res.push({
                op: op1,
                l: A,
                r: {
                    op: op2,
                    l: {
                        op: op3,
                        l: B,
                        r: C,
                    },
                    r: D,
                },
            });
            res.push({
                op: op1,
                l: A,
                r: {
                    op: op2,
                    l: B,
                    r: {
                        op: op3,
                        l: C,
                        r: D,
                    },
                },
            });
        }
    }
    const map = new Map;
    for(let v of res){
        const flat = flattenFormula(v,new Additive,false);
        const id = flat.toString();
        if(map.has(id))continue;
        map.set(id,flat);
    }
    return [...map].map(([a,b])=>b);
}

const formulas = getEveryFormula();
let max = 0;
let maxnums;

for(let D = 3; D < 10; D++){
for(let C = 2; C < D; C++){
for(let B = 1; B < C; B++){
for(let A = 0; A < B; A++){
    const nums = [... new Set([...new Set(getEveryFormula().map(v=>v.eval({
        A: A,
        B: B,
        C: C,
        D: D,
    })))].filter(v=>Math.abs(v%1) < 0.000001 && v > 0).map(v=>Math.round(v)))].sort((a,b)=>a-b);
    console.log([A,B,C,D]);

    let nnn = 0;
    for(let i = 0; i < nums.length; i++){
        if(nums[i] === i+1){
            nnn = i+1;
        }
    }
    if(nnn > max){
        max = nnn;
        maxnums = [A,B,C,D];
    }
}}}}

console.log(max,maxnums);

// console.log(getEveryFormula());
// const nums = [... new Set([...new Set(getEveryFormula().map(v=>v.eval({
//     A: 1,
//     B: 2,
//     C: 4,
//     D: 5,
// })))].filter(v=>Math.abs(v%1) < 0.000001 && v > 0).map(v=>Math.round(v)))].sort((a,b)=>a-b);
// let nnn = 0;
// for(let i = 0; i < nums.length; i++){
//     if(nums[i] === i+1){
//         nnn = i+1;
//     }
// }
// console.log(nums,nnn);


//flattenFormula();
