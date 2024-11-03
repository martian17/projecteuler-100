const getDivisors = function(n){
    const sq = Math.ceil(Math.sqrt(n));
    const res = [1];
    for(let i = 2; i < sq; i++){
        if(n%i === 0){
            const pair = n/i;
            res.push(i);
            if(pair !== i)res.push(pair);
        }
    }
    return res;
};

const getDivisorSum = function(n){
    const sq = Math.sqrt(n);
    let sum = 1;
    for(let i = 2; i <= sq; i++){
        if(n%i === 0){
            const pair = n/i;
            sum += i;
            if(pair !== i)sum += pair;
        }
    }
    return sum;
};

const links = [0];
for(let i = 1; i < 1_000_000; i++){
    links.push(getDivisorSum(i));
}
console.log(links);

let maxLinks = 0;
let maxLinkSet;
outer:
//for(let i = 12496; i <= 12496; i++){
for(let i = 0; i < 1_000_000; i++){
    if(i%1000 === 0)console.log(i);
    let passed = new Set;
    let n = i;
    let cnt = 0;
    while(true){
        passed.add(n);
        n = links[n];
        cnt++;
        if(n >= 1_000_000)continue outer;
        if(passed.has(n)){
            if(n === i && cnt > maxLinks){
                maxLinks = cnt;
                maxLinkSet = passed;
            }
            continue outer;
        }
    }
}
console.log(maxLinkSet, maxLinks, [...maxLinkSet].sort((a,b)=>a-b));


//console.log(getDivisors(28).reduce((a,b)=>a+b));


