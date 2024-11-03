const fs = require("fs");
const txt = ""+fs.readFileSync("./96.txt");

const checkSquare = function(grid,x,y){
    let fillMap = 0;
    const idx = y*9+x;
    if(grid[idx] !== 0)return -1;
    for(let xx = 0; xx < 9; xx++){
        const idx2 = y*9+xx;
        const n = grid[idx2];
        if(n === 0)continue;
        fillMap |= 1<<n;
    }
    for(let yy = 0; yy < 9; yy++){
        const idx2 = yy*9+x;
        const n = grid[idx2];
        if(n === 0)continue;
        fillMap |= 1<<n;
    }
    const x0 = x-x%3;
    const y0 = y-y%3;
    for(let yy = y0; yy < y0+3; yy++){
        for(let xx = x0; xx < x0+3; xx++){
            const idx2 = yy*9+xx;
            const n = grid[idx2];
            if(n === 0)continue;
            fillMap |= 1<<n;
        }
    }
    return fillMap;
}

const solveSudoku = function(grid){// grid is an instance of Uint8Array of length 81
    // couldve used a smaller bitmap, but this should be a good compromise
    let xm = 0;
    let ym = 0;
    let minopts = 9;
    let zcnt = 0;
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            const fillMap = checkSquare(grid,x,y);
            if(fillMap === -1)continue;// square not 0
            zcnt++;
            let ncnt = 0;
            for(let i = 1; i <= 9; i++){
                if((fillMap>>>i)&1)continue;
                ncnt++;
            }
            if(ncnt === 0)return false;// number collision inevitable
            if(ncnt < minopts){
                minopts = ncnt;
                xm = x;
                ym = y;
            }
        }
    }
    if(zcnt === 0)return grid;
    const fillMap = checkSquare(grid,xm,ym);
    for(let i = 1; i <= 9; i++){
        if((fillMap>>>i)&1)continue;
        const idx = ym*9+xm;
        grid[idx] = i;
        const res = solveSudoku(grid);
        if(res)return res;
        grid[idx] = 0;
    }
    return false;
}

const sudokus = txt.trim().split(/Grid ../g).slice(1).map(v=>new Uint8Array(v.match(/\d/g).map(v=>parseInt(v))));

const printSudoku = function(grid){
    let res = "";
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            let idx = y*9+x;
            res += grid[idx] + ",";
        }
        res += "\n";
    }
    console.log(res);
}


const sudoku0 = new Uint8Array([
    0,0,3,0,2,0,6,0,0,
    9,0,0,3,0,5,0,0,1,
    0,0,1,8,0,6,4,0,0,
    0,0,8,1,0,2,9,0,0,
    7,0,0,0,0,0,0,0,8,
    0,0,6,7,0,8,2,0,0,
    0,0,2,6,0,9,5,0,0,
    8,0,0,2,0,3,0,0,9,
    0,0,5,0,1,0,3,0,0,
]);

{
    const solution = solveSudoku(sudoku0);
    printSudoku(solution);
}

let sum = 0;
for(let i = 0; i < sudokus.length; i++){
    const sudoku = sudokus[i];
    const solution = solveSudoku(sudoku);
    console.log(i);
    printSudoku(solution);
    const tl = solution[0]*100 + solution[1]*10 + solution[2];
    sum += tl;
}

console.log(sum);
//console.log(sudokus);


