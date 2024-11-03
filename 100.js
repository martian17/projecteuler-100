const sqrtBigInt = function(n){
    let order = 0n;
    for(;; order++){
        const r = 1n<<order;
        if(r*r > n)break;
    }
    order--;
    let result = 1n<<order;
    for(let i = order-1n; i >= 0n; i--){
        const r = result | 1n<<i;
        if(r*r > n)continue;
        result = r;
    }
    return result;// result is floor of square root
}

//console.log(sqrtBigInt(25n));


// 1n 1n
// 4n 3n
// 21n 15n
// 120n 85n
// 697n 493n
// 4060n 2871n
// 23661n 16731n
// 137904n 97513n
// 803761n 568345n
// 4684660n 3312555n
// 27304197n 19306983n
// 159140520n 112529341n

for(let i = 1n/*1_000_000_000_000n*/;; i++){
    const numerator = i*(i-1n)/2n;
    const sm = sqrtBigInt(numerator);
    const sm1 = sm+1n;
    if(sm*sm1 === numerator){
        console.log(i,sm1);
        //if(i > 1_000_000_000_000n)break;
        let i0 = i;
        i = BigInt(Math.floor(Number(i)*5.82842712474617-10))
        if(i0 > i)i = i0;
    }
}
