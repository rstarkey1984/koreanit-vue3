let hello = function(){
  console.log("hello");
}

const a = hello;

a();

let run = function(fn){
  console.log(fn);
}

run(a);