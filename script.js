const target = 18250000;
const counter = document.getElementById("counter");

let current = 0;

// عداد سريع جداً
const increment = Math.ceil(target / 450);

const animation = setInterval(() => {

    current += increment;

    if(current >= target){
        current = target;
        clearInterval(animation);
    }

    counter.innerHTML =
        current.toLocaleString('en-US');

}, 5);

function goProject(){
    document
        .getElementById("project")
        .scrollIntoView({
            behavior:"smooth"
        });
}