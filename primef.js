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
    extendPrimes(Math.sqrt(n)+10);
    for(let i = 0; i < primes.length; i++){
        let prime = primes[i];
        if(prime > sqrt)break;
        res.push(prime);
    }
    return res;
};

console.log(primeFactor(159140520));
console.log(primeFactor(112529341));
