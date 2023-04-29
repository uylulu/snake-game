var grid = document.querySelectorAll(".grid-item");

let num = [],di = [],node = [],cnt = [],n = 12;
let dx = [0,-1,0,1];
let dy = [-1,0,1,0];

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
let head = rand(0,n*n - 1),tail = head;

for(let i = 0;i < 144;i++) {
    num.push(-1);
    di.push(-1);
    cnt.push(0);
}

function cal(pos,way) {
    let row = Math.floor(pos / n) + dx[way],col = pos % n + dy[way];

    if(row < 0 || row >= n || col < 0 || col >= n) {
        return -1;
    }
    return row*n + col;
}

function color(pos,w) {
    num[pos] = w;

    if(w == -1) {
        grid[pos].style.backgroundColor = "white";
    } else if(w == 1) {
        grid[pos].style.backgroundColor = "blue";
    } else if(w == 2) {
        grid[pos].style.backgroundColor = "red";
    }
}

function init() {
    grid.forEach(div => {
        div.style.backgroundColor = "white";
    })
    for(let i = 0;i < 144;i++) {
        num[i] = -1;
        di[i] = -1;
    }

    head = rand(0,n*n - 1);
    tail = head;
    node.length = 0;
    node.push(head);

    di[head] = rand(0,3);

    while(true) {
        let nw = cal(head,di[head]);
        if(nw == -1) {
            di[head] = rand(0,3);
        } else {
            break;
        }
    }

    color(head,1);
}

function update_score() {
    document.getElementById("score").innerHTML = "SCORE = " + node.length.toString();
}
 
// The key codes for the left arrow key, up arrow key, right key, 
// and down arrow key are 37, 38, 39, and 40, respectively.

document.addEventListener('keydown', (event) => {
    var code = event.code;

    if(code == "ArrowLeft") {
        if(di[head] != 2) {
            di[head] = 0;
        }
    } else if(code == "ArrowUp") {
        if(di[head] != 3) {
            di[head] = 1;
        }
    } else if(code == "ArrowRight") {
        if(di[head] != 0) {
            di[head] = 2;
        }
    } else {
        if(di[head] != 1) {
            di[head] = 3;
        }
    }
}, false);

let myGame;

function food() {
    let pos = rand(0,n*n - 1);

    while(true) {
        let ok = true;

        node.forEach(val => {
            if(val == pos) {
                ok = false;
            }
        })
        if(ok) break;
    }

    color(pos,2);
}

function verdict(w) {
    if(w == 0) {
        document.getElementById("verdict").innerHTML = "YOU HIT THE WALL";
    } else {
        document.getElementById("verdict").innerHTML = "YOU BIT YOURSELF";
    }
}

function simulate() {
    let nw = cal(head,di[head]);



    if(nw == -1) {
        verdict(0);
        clearInterval(myGame);
        return 0;
    }

    if(num[nw] != 2) {
        color(nw,1);
    
    
        color(tail,-1);
    
        let tmp = di[tail],tmp2 = di[head];
        di[tail] = -1;
    
        tail = cal(tail,tmp);
        di[nw] = tmp2;
    
        head = nw;
    
        node[0] = tail;
        node[node.length - 1] = nw;

        for(let i = 1;i < node.length - 1;i++) {
            node[i] = cal(node[i],di[node[i]]);
        }
    
    } else if(num[nw] == 2) {

        color(nw,1);
        
        node.push(nw);
        let tmp2 = di[head];
        di[nw] = tmp2;
        head = nw;

        food();
        
    }
    for(let i = 0;i < cnt.length;i++) cnt[i] = 0;
    node.forEach(pos => cnt[pos]++);
    cnt.forEach(val => {
        if(val >= 2) {
            verdict(1);
            clearInterval(myGame);
            return 0;
        }
    })
    update_score();

}

function startGame() {
    document.getElementById("verdict").innerHTML = "SNAKE IN MY ASS";
    init();
    food();
    update_score();
    myGame = setInterval(simulate,100);
}

document.getElementById("button").addEventListener("click", startGame);