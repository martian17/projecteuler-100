
const primes = [2,3];

const extendPrimes = function(max){
    const last = primes[primes.length-1];
    outer:
    for(let i = last+2; i <= max; i += 2){
        for(let j = 0;; j++){
            const p = primes[j];
            if(p*p > i)break;
            if(i%p === 0)continue outer;
        }
        primes.push(i);
    }
};

const primeFactor = function(n){
    let sqrt = Math.sqrt(n);
    let res = [];
    extendPrimes(n);
    for(let i = 0; i < primes.length; i++){
        let prime = primes[i];
        if(prime > sqrt)break;
        res.push(prime);
    }
    return primes;
};

const allDecompositions = function(n,min){
    let result = [[n]];
    for(let i = min; i <= Math.sqrt(n); i++){
        if(n%i === 0){
            let rest = n/i;
            const r1 = allDecompositions(rest,i);
            for(let r11 of r1){
                r11.push(i);
                result.push(r11);
            }
        }
    }
    return result;
}

let minset = new Map;

for(let i = 0; i < 100000; i++){
    const decons = allDecompositions(i,2);
    for(let decon of decons){
        let sum = 0;
        for(let val of decon){
            sum += val;
        }
        let rest = i-sum;
        let k = rest + decon.length;
        if(!minset.has(k)){
            minset.set(k,i);
        }
    }
}

let ordered = [...minset].sort((a,b)=>a[0] - b[0]);
let sumSet = new Set;
for(let i = 2; i <= 12000; i++){
    if(!minset.has(i)){
        console.log("failure");
        break;
    }
    sumSet.add(minset.get(i));
}
console.log("sum",[...sumSet].reduce((a,b)=>a+b));

