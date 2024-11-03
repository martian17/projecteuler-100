const probArrayCache = new Map;

const getProbArray = function(d1,d2,jailLife){
    const id = ""+d1+d2+jailLife;
    if(probArrayCache.has(id))return probArrayCache.get(id);

    let sum = 0;
    const scoreMap = new Map;
    for(let i = 2; i <= d1+d2; i++){
        let min = i-d2;
        if(min <= 0)min = 1;
        let max = i-1;
        if(max > d1)max = d1;
        let score = max-min+1;
        sum += score;
        if(i%2 === 0)score--;//subtract the double from it
        scoreMap.set(i,score);
    }
    if(jailLife !== 0){
        const [doubleMap,dsum] = getProbArray(d1,d2,jailLife-1);
        // multiply the existing score by the dsum
        for(let [i,val] of scoreMap){
            scoreMap.set(i,val*dsum);
        }
        sum *= dsum;
        for(let i = 2; i <= d1+d2; i += 2){
            for(let [j, score] of doubleMap){
                if(typeof j === "number"){
                    const progress = i+j;
                    scoreMap.set(progress, (scoreMap.get(progress) || 0) + score);
                }else{
                    scoreMap.set(j, (scoreMap.get(j) || 0) + score);
                }
            }
        }
    }else{
        scoreMap.set("JAIL",Math.floor((d1+d2)/2));
    }
    const result = [scoreMap,sum];
    probArrayCache.set(id, result);
    return result;
}


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

let [diceMap, diceSum] = getProbArray(4,4,2);

// normalize
for(let [key, val] of diceMap){
    diceMap.set(key, val/diceSum);
}

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

for(let i = 0; i < squares.length; i++){
    const linkMap = squares.map(v=>0);
    for(let [pos, score] of diceMap){
        if(typeof pos === "number"){
            let next = (i+pos)%squares.length;
            // jump from the next cell
            const jumpMap = jumpMaps[next];
            for(let j = 0; j < jumpMap.length; j++){
                linkMap[j] += jumpMap[j]*score;
            }
        }else{
            linkMap[reverseSquareMap.get(pos)] += score;
        }
    }
    linkMaps.push(linkMap);
}

console.log(linkMaps);
console.log(linkMaps.map(v=>v.reduce((a,b)=>a+b)));

let scores = squares.map(v=>0);
scores[0] = squares.length;
for(let itr = 0; itr < 10000; itr++){
    let newScores = squares.map(v=>0);
    for(let i = 0; i < squares.length; i++){
        const score = scores[i];
        const linkMap = linkMaps[i];
        for(let j = 0; j < linkMap.length; j++){
            newScores[j] += linkMap[j]*score;
        }
    }
    scores = newScores;
}

console.log(scores.map((v,i)=>[squareMap.get(i),i,v*2.5]).sort((a,b)=>a[2]-b[2]));


// let res;
// console.log(res=getProbArray(6,6,2));
// console.log([...res[0]].map(v=>v[1]).reduce((a,b)=>a+b));


