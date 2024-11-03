const getProbArray = function(d1,d2){
    let sum = 0;
    const scoreMap = new Map;
    const doubleMap = new Map;
    for(let i = 2; i <= d1+d2; i++){
        let min = i-d2;
        if(min <= 0)min = 1;
        let max = i-1;
        if(max > d1)max = d1;
        let score = max-min+1;
        sum += score;
        if(i%2 === 0){
            score--;//subtract the double from it
            doubleMap.set(i,1);
        }
        scoreMap.set(i,score);
    }
    for(let [key,val] of scoreMap){
        scoreMap.set(key, val/sum);
    }
    for(let [key,val] of doubleMap){
        doubleMap.set(key, val/sum);
    }
    return [scoreMap, doubleMap, sum];
};

const squares = `
GO
A1
CC1
A2
T1
R1
B1
CH1
B2
B3
JAIL
C1
U1
C2
C3
R2
D1
CC2
D2
D3
FP
E1
CH2
E2
E3
R3
F1
F2
U2
F3
G2J
G1
G2
CC3
G3
R4
CH3
H1
T2
H2
`.trim().split("\n");

let [diceMap, doubleMap, diceSum] = getProbArray(6,6,2);


const squareMap = new Map(squares.map((s,i)=>[i,s]));
const reverseSquareMap = new Map(squares.map((s,i)=>[s,i]));

const jumpMaps = [];
for(let i = 0; i < squares.length; i++){
    const jumpMap = squares.map(v=>0);
    const sq = squareMap.get(i);
    if(sq.match(/CC./)){
        jumpMap[i] = 14/16;
        jumpMap[reverseSquareMap.get("GO")] = 1/16;
        jumpMap[reverseSquareMap.get("JAIL")] = 1/16;
    }else if(sq.match(/CH./)){
        jumpMap[i] = 6/16;
        jumpMap[reverseSquareMap.get("GO")] += 1/16;
        jumpMap[reverseSquareMap.get("JAIL")] += 1/16;
        jumpMap[reverseSquareMap.get("C1")] += 1/16;
        jumpMap[reverseSquareMap.get("E3")] += 1/16;
        jumpMap[reverseSquareMap.get("H2")] += 1/16;
        jumpMap[reverseSquareMap.get("R1")] += 1/16;
        let slice = [...squares.slice(i), ...squares.slice(0,i)];
        let nextR;
        for(let sq of slice){
            if(sq[0] === "R"){
                nextR = sq
                break;
            }
        }
        jumpMap[reverseSquareMap.get(nextR)] += 2/16;
        let nextU;
        for(let sq of slice){
            if(sq[0] === "U"){
                nextU = sq
                break;
            }
        }
        jumpMap[reverseSquareMap.get(nextU)] += 1/16;
        const p3 = (i-3+squares.length)%squares.length;
        // this covers every case, because of arrangement
        // jumpMap[p3] = 1/16;
        for(let j = 0; j < squares.length; j++){
            jumpMap[j] += jumpMaps[p3][j]/16;
        }
    }else if(sq === "G2J"){
        jumpMap[reverseSquareMap.get("JAIL")] = 1;
    }else{
        jumpMap[i] = 1;
    }
    jumpMaps.push(jumpMap);
}

const linkMaps = [];

const JAIL = reverseSquareMap.get("JAIL");

// zero doubles
for(let i = 0; i < squares.length; i++){
    // zero doubles
    const linkMap = (new Array(squares.length*3)).fill(0);
    for(let [pos, score] of diceMap){
        let next = (i+pos)%squares.length;
        // jump from the next cell
        const jumpMap = jumpMaps[next];
        for(let j = 0; j < jumpMap.length; j++){
            linkMap[j] += jumpMap[j]*score;
        }
    }
    for(let [pos, score] of doubleMap){
        let next = (i+pos)%squares.length;
        // jump from the next cell
        const jumpMap = jumpMaps[next];
        for(let j = 0; j < jumpMap.length; j++){
            let offset = squares.length*1;
            // if(j === JAIL){
            //     offset = 0;
            // }
            linkMap[j+offset] += jumpMap[j]*score;
        }
    }
    linkMaps.push(linkMap);
}
// one doubles
for(let i = 0; i < squares.length; i++){
    // zero doubles
    const linkMap = (new Array(squares.length*3)).fill(0);
    for(let [pos, score] of diceMap){
        let next = (i+pos)%squares.length;
        // jump from the next cell
        const jumpMap = jumpMaps[next];
        for(let j = 0; j < jumpMap.length; j++){
            linkMap[j] += jumpMap[j]*score;
        }
    }
    for(let [pos, score] of doubleMap){
        let next = (i+pos)%squares.length;
        // jump from the next cell
        const jumpMap = jumpMaps[next];
        for(let j = 0; j < jumpMap.length; j++){
            let offset = squares.length*2;
            // if(j === JAIL){
            //     offset = 0;
            // }
            linkMap[j+offset] += jumpMap[j]*score;
        }
    }
    linkMaps.push(linkMap);
}
// two doubles
for(let i = 0; i < squares.length; i++){
    // zero doubles
    const linkMap = (new Array(squares.length*3)).fill(0);
    for(let [pos, score] of diceMap){
        let next = (i+pos)%squares.length;
        // jump from the next cell
        const jumpMap = jumpMaps[next];
        for(let j = 0; j < jumpMap.length; j++){
            linkMap[j] += jumpMap[j]*score;
        }
    }
    for(let [pos, score] of doubleMap){
        linkMap[JAIL] += score;
    }
    linkMaps.push(linkMap);
}


let scores = linkMaps.map(v=>0);
scores[0] = linkMaps.length;
for(let itr = 0; itr < 100000; itr++){
    let newScores = linkMaps.map(v=>0);
    for(let i = 0; i < scores.length; i++){
        const score = scores[i];
        const linkMap = linkMaps[i];
        for(let j = 0; j < linkMap.length; j++){
            newScores[j] += linkMap[j]*score;
        }
    }
    scores = newScores;
}


const normalize = function(scores){
    const sum = scores.reduce((a,b)=>a+b);
    return scores.map(v=>v/sum);
}

const sumarr = function(...arrs){
    const len = arrs[0].length;

    let res = [];
    for(let i = 0; i < len; i++){
        let r = 0;
        for(let j = 0; j < arrs.length; j++){
            r += arrs[j][i];
        }
        res.push(r);
    }
    return res;
}


// score 1: only the scores with doubles === 0
const scores0 = normalize(scores.slice(0,squares.length));
console.log(scores0.map((v,i)=>[squareMap.get(i),i,v*100]).sort((a,b)=>a[2]-b[2]));

// score 2: sum up the scores
const scores1 = normalize(sumarr(
    scores.slice(0, squares.length),
    scores.slice(squares.length, squares.length*2),
    scores.slice(squares.length*2, squares.length*3)
));
console.log(scores1.map((v,i)=>[squareMap.get(i),i,v*100]).sort((a,b)=>a[2]-b[2]));



//console.log(scores.map((v,i)=>[squareMap.get(i),i,v*2.5]).sort((a,b)=>a[2]-b[2]));


// let res;
// console.log(res=getProbArray(6,6,2));
// console.log([...res[0]].map(v=>v[1]).reduce((a,b)=>a+b));


