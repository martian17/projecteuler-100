const getSub = function*(arr,str){
    for(let i = 1; i < str.length; i++){
        arr.push(str.slice(0,i));
        yield* getSub(arr,str.slice(i));
        arr.pop();
    }
    arr.push(str);
    yield arr;
    arr.pop();
};

const S_under = function(N){
    let cnt = 0;
    for(let root = 2; root <= Math.sqrt(N); root++){
        let n = root*root;
        //partition n, see if it matches root
        for(let sub of getSub([],n+"")){
            let sum = 0;
            for(let n of sub){
                sum += parseInt(n);
            }
            if(sum == root){
                console.log(sub,n);
                cnt += n;
                break;
            }
        }
    }
    return cnt;
}


console.log(S_under(1e4));

