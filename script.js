window.onload = start;

var canva = document.querySelector("svg");
var canvaHeight = canva.getAttribute("height");
var canvaWidth = canva.getAttribute("width");
var path = canva.querySelector("path");

var blockH = 10;
var blockW = 5;
function start(){
  canva = document.querySelector("svg");
  canva.setAttribute("width", 
    window.innerWidth);
  canva.setAttribute("height", 
   window.innerHeight);
  
  canvaHeight = window.innerHeight;
  canvaWidth = window.innerWidth;

  path = canva.querySelector("path");
  
  for(var i = 0; i < 100;i++){
    var x =
     Math.floor(
       (Math.random()*canvaWidth) / blockW)
    var y =
     Math.floor(
       (Math.random()*canvaHeight) / blockH)
       
    buildLeaf({
      x: x*blockW,
      y: y*blockH
    }, `${x} ${y}`);
    
  }
 
 document.body.addEventListener(
   "touchstart",() => {
     console.log("hdud")
   }
 )
 document.body.addEventListener(
   "touchmove",() => {
    // console.log("y888")
   }
 )
 document.body.addEventListener(
   "touchend",() => {
     console.log("ene")
   }
 )
 
  loop(0,1);
}
var globald = "";

var leaves = {};
var levels = 5;
var height = 10;
var left = 2;

function buildLeaf(pos,id){
  var points = [];
  var d = "M "+pos.x + " "+pos.y;
  for(var i = 0; i < levels; i++){
    var x = left*i+pos.x;
    var y = canvaHeight-(height*i+
      (canvaHeight-pos.y));
   
    points.push({
      x:x,
      y:y
    });
    d += `L ${x} ${y}`;
  }
  for(var i = levels - 2; i > -1; i--){
    var x = left*i+pos.x+
        (left*(levels-1-i)*2);
    var y = canvaHeight-(height*i+
      (canvaHeight-pos.y));
    points.push({
      x: x,
      y: y
    });
    d += `L ${x} ${y}`;
  }
  d += "L "+pos.x + " "+pos.y+"Z";
  globald += d;
  path.setAttribute("d",globald);
  var leaf = {
    points: points,
    pos: pos
  }
  leaves[id] = leaf;
  return leaf;
}

function updateLeaf(angle, leaf){
  var rad = angle*(Math.PI/180);
 
  var d = `M ${leaf.pos.x} ${leaf.pos.y}
  L ${leaf.points[0].x} ${leaf.points[0].y}\n`
  var d1 = "";
  
  var mx = leaf.pos.x + left * (levels-1);
  var my = leaf.pos.y;
  
  for(var i = 1; i < levels; i++){
    var tx = Math.sin(rad*i) * height;
    var ty = Math.cos(rad*i) * height;
    var ly = Math.sin(rad*i) * 
      (levels-1-i)*left;
    var lx = Math.cos(rad*i) * 
      (levels-1-i)*left;
    
    leaf.points[i].x = mx+tx-lx;
    leaf.points[i].y = my-ty-ly;
    
    d += `L ${leaf.points[i].x} 
            ${leaf.points[i].y}\n`
            
    if(i+1 == levels){
      break;
    }
    
    leaf.points[levels-1-i].x = mx+tx+lx;
    leaf.points[levels-1-i].y = my-ty+ly;
    
    
    d1 = `L ${leaf.points[levels-1-i].x}
            ${leaf.points[levels-1-i].y}\n`
            + d1;
            
    mx = mx+tx;
    my = my-ty;
  }
  
  d += d1;
  
  d +=
     `L ${leaf.points[leaf.points.length-1].x} 
        ${leaf.points[leaf.points.length-1].y}`
  d += `L ${leaf.pos.x} ${leaf.pos.y}Z`
  globald += d;
  path.setAttribute("d",globald);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loop(k,d){
  while(true){
    if(Math.abs(k) >= 30){
      return loop(29*d,d*-1);
    }
    globald = ""
    Object.values(leaves).forEach(x => {
      updateLeaf(k,x);
    })
    k+=d;
    await sleep(0);
  }
}
