const fs = require("fs");
const words = JSON.parse("[" + fs.readFileSync("./98.txt") + "]");

console.log(words);

let max = 0;
for(let word of words){
    if(word.length > max)max = word.length;
}
console.log(max);

// const candidatesMap = [];
// for(let i = 0; i < words.length; i++){
//     console.log(i);
//     const word = words[i];
//     const wmap = new Map();
//     for(let j = 0; j < word.length; j++){
//         const c = word[j];
//         if(!wmap.has(c))wmap.set(c,[]);
//         wmap.get(c).push(j);
//     }
//     console.log(wmap);
//     const sameChars = [...wmap.values()];
//     const candidates = [];
//     inner:
//     for(let n = 0;; n++){
//         //if(n%1000 === 0)console.log(n);
//         const nn = ""+(n*n);
//         if(nn.length < word.length)continue;
//         if(nn.length > word.length)break;
//         for(let j = 0; j < sameChars.length; j++){
//             const lst = sameChars[j];
//             let c = nn[lst[0]];
//             for(let k = 1; k < lst.length; k++){
//                 if(c !== nn[lst[k]])continue inner;
//             }
//             for(let k = 0; k < j; k++){
//                 if(c === nn[sameChars[k][0]])continue inner;
//             }
//         }
//         candidates.push(nn);
//     }
//     candidatesMap[i] = new Set(candidates);
//     if(i === 1)break;
// }

const getCandidates = function(word){
    const wmap = new Map();
    for(let j = 0; j < word.length; j++){
        const c = word[j];
        if(!wmap.has(c))wmap.set(c,[]);
        wmap.get(c).push(j);
    }
    const sameChars = [...wmap.values()];
    const candidates = [];
    inner:
    for(let n = 0;; n++){
        const nn = ""+(n*n);
        if(nn.length < word.length)continue;
        if(nn.length > word.length)break;
        for(let j = 0; j < sameChars.length; j++){
            const lst = sameChars[j];
            let c = nn[lst[0]];
            for(let k = 1; k < lst.length; k++){
                if(c !== nn[lst[k]])continue inner;
            }
            for(let k = 0; k < j; k++){
                if(c === nn[sameChars[k][0]])continue inner;
            }
        }
        candidates.push(nn);
    }
    return new Set(candidates);
}

const anagrams = new Map;
for(let i = 0; i < words.length; i++){
    const word = words[i];
    const id = word.split("").sort().join("");
    if(!anagrams.has(id))anagrams.set(id,[]);
    anagrams.get(id).push(word);
}

console.log(anagrams);
console.log([...anagrams.values()].filter(v=>v.length > 1));
const candidateMap = new Map;
const pairs = [];
for(let lst of anagrams.values()){
    if(lst.length <= 1)continue;
    if(lst.length === 2){
        pairs.push(lst);
    }else{
        for(let i = 1; i < lst.length; i++){
            for(let j = 0; j < i; j++){
                pairs.push([lst[i],lst[j]]);
            }
        }
    }
    for(let v of lst){
        candidateMap.set(v,getCandidates(v));
    }
}

console.log(candidateMap);

let answer = 0;

for(let [w1,w2] of pairs){
    const candidates = candidateMap.get(w1);
    for(let candidate of candidates){
        const nmap = new Map;
        for(let i = 0; i < w1.length; i++){
            const c = w1[i];
            const d = candidate[i];
            nmap.set(c,d);
        }
        const n1 = candidate;
        const n2 = [...w2].map(c=>nmap.get(c)).join("");
        if(candidateMap.get(w2).has(n2)){
            const v1 = parseInt(n1);
            const v2 = parseInt(n2);
            let ans = v2;
            if(v1 > v2){
                ans = v2;
            }
            if(ans > answer){
                answer = ans;
            }
        }
    }
}

console.log(answer);



