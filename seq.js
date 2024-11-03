const repeat = function(n,r){
    let arr = [];
    for(let i = 0; i < r; i++){
        arr.push(n);
    }
    return arr.join("");
};

const findLocation = function(digits,order,index){
    if(index === 0 && digits[0] === "0")return -1;
    let first = digits.slice(0,order-index);
    let rest = digits.slice(order-index,order);
    if(rest[0] === "0")return -1;
    
    if(index === 0)return parseInt(first);
    
    //check if first is all 9
    let all9 = true;
    for(let n of first){
        if(n !== "9"){
            all9 = false;
            break;
        }
    }
    // check if rest is power 10
    let power10 = true;
    if(rest[0] !== "1")power10 = false;
    for(let n of rest.slice(1)){
        if(n !== "0"){
            power10 = false;
            break;
        }
    }
    //console.log(all9,power10)
    if(all9 && power10){
        return parseInt(repeat("9",order));
    }
    
    let restn = parseInt(rest);
    //console.log(firstn,restn)
    if(all9)return parseInt((restn-1)+first);
    return parseInt(rest+first);
};

const arreq = function(a,b){
    if(a.length !== b.length)return false;
    for(let i = 0; i < a.length; i++){
        if(a[i] !== b[i])return false;
    }
    return true;
};

const checkLocation = function(location,index,digits){
    let first = (location+"").slice(index);
    let pos = 0;
    if(first !== digits.slice(0,first.length))
        return false;
    digits = digits.slice(first.length);
    location++;
    while(digits.length > (""+location).length){
        const middle = (""+location);
        if(middle !== digits.slice(0,middle.length))
            return false;
        digits = digits.slice(middle.length);
        location++;
    }
    if(digits !== (""+location).slice(0,digits.length))
        return false;
    return true;
}

const findFullLocation = function(digits){
    let n = digits.length;
    // coding and coding..
    // order: number of digits of the beginning number to scan
    for(let order = 1; order <= n; order++){
        let solutions = [];
        for(let index = 0; index < order; index++){
            let location = findLocation(digits,order,index);
            if(location === -1)continue;// -1 when starts with 0 or contains 0
            let solution;
            if(solution = checkLocation(location,index,digits)){
                solutions.push([location,index]);
            }
        }
        if(parseInt(digits) === 0)solutions.push([parseInt(1+digits),1]);
        if(solutions.length === 0)continue;
        solutions.sort((a,b)=>a[0]-b[0]);
        return solutions[0];
    }
}



function findPosition(num){
    const [location,idx] = findFullLocation(num);
    //console.log(location,idx);
    let order = (location+"").length;
    let p = location*order;
    //console.log(num,location,idx);
    for(order--; order > 0; order--){
        p -= (10**order);
    }
    return p+idx-1;
}

let longStr = "";
for(let i = 1; i < 1000000; i++){
    longStr += i;
}

const findPositionSlow = function(num){
    return longStr.match(num).index;
}

//console.log(findLocation("9100".split(""),2,1))

for(let i = 1; i < 100000; i++){
    let ii = i+"";
    for(let z = 0; (z+ii.length) <= 6; z++){
        let digits = repeat("0",z)+ii;
        if(findPosition(digits) !== findPositionSlow(digits))console.log(digits)
        //console.log(digits)
    }
}

console.log(findPosition("00101"),findPositionSlow("00101"))


//console.log(findFullLocation(9630));
//console.log(findLocation("946".split(""),2,1));

// console.log(findPosition(454));
// console.log(findPosition(234));
// console.log(findPosition(920));
// console.log(findPosition(192),findPositionSlow(192));

