const isIntTriangle = function(a,b){
    // a, b, b
    const _B = b*2
    const _A = a;
    const _C = Math.round(Math.sqrt(_B*_B-_A*_A));
    const A = BigInt(_A);
    const B = BigInt(_B);
    const C = BigInt(_C);

    if(A*A+C*C !== B*B){
        return false;
    }
    const area4 = (A*C);
    if(area4%4n === 0n)return true;
    return false;
}


let sum = 0;
for(let i = 3; i < 1_000_000_000/3+10; i++){
    if(i%1000000 === 0)console.log(i);
    for(let j = -1; j <= 1; j += 2){
        const a = i;
        const b = i+j;
        if(isIntTriangle(a,b)){
            console.log(a,b,b);
            sum += a+b+b;
        }
    }
}
console.log(sum);

