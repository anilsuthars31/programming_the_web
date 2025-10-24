// Compact color palette script: hover (temp), click (lock/toggle), reset, keyboard
// (function(){
//   const boxes = document.querySelectorAll('.color-box');
//   const reset = document.getElementById('resetBtn');
//   const body = document.body;
//   const orig = getComputedStyle(body).backgroundColor || '';
//   let locked = null;
//   const show = c => body.style.backgroundColor = c;

//   boxes.forEach(b=>{
//     const c = b.style.backgroundColor;
//     b.tabIndex = 0;
//     b.addEventListener('mouseenter', ()=>{ if(!locked) show(c); });
//     b.addEventListener('mouseleave', ()=>{ if(!locked) show(orig); });
//     b.addEventListener('click', ()=>{ locked = locked===c? null : c; show(locked||orig); });
//     b.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); b.click(); } });
//   });

//   reset.addEventListener('click', ()=>{ locked = null; show(orig); });
// })();


// get elements (fixed selectors: no '.' or '#' for these DOM APIs)
const boxes = document.getElementsByClassName('color-box');
const reset = document.getElementById('resetBtn');
const colorDisplay = document.getElementById('colorDisplay');

//add click event to boxes
for (let i=0; i<boxes.length; i++) {
    boxes[i].addEventListener('mouseenter', function() {
        const bgcolor = this.style.backgroundColor;
        document.body.style.backgroundColor = bgcolor;
        // data-color attribute holds the color name; use dataset for access
        if (colorDisplay) colorDisplay.textContent = 'Background Color: ' + (this.dataset.color || bgcolor);
    });

    // make click lock the color (toggle)
    boxes[i].addEventListener('click', function() {
        const bgcolor = this.style.backgroundColor;
        // toggle lock using a data attribute on body
        if (document.body.dataset.locked === bgcolor) {
            delete document.body.dataset.locked;
            document.body.style.backgroundColor = '';
            if (colorDisplay) colorDisplay.textContent = 'Background Color: (default)';
        } else {
            document.body.dataset.locked = bgcolor;
            document.body.style.backgroundColor = bgcolor;
            if (colorDisplay) colorDisplay.textContent = 'Background Color: ' + (this.dataset.color || bgcolor);
        }
    });

    // keyboard support
    boxes[i].addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
}

// reset button 
if (reset) {
    reset.addEventListener('click', function() {
        delete document.body.dataset.locked;
        document.body.style.backgroundColor = '';
        if (colorDisplay) colorDisplay.textContent = 'Background Color: (default)';
    });
} else {
    console.warn('Reset button not found');
}