var headerAnimationState = 0
        var totalTextAnimationDuration = 0;
        var headerHideDuration=2,headerShowDuration=.8;
        var myCanvasHeader = document.getElementById("myCanvasHeader");
        function animateHeader() {
            if (headerAnimationState == 0) {
                myCanvasHeader.style.opacity = 1;
                const letters = myCanvasHeader.textContent.split('');
                myCanvasHeader.textContent = ''; // Clear the original text
                letters.forEach((letter, index) => {
                    const span = document.createElement('span');
                    span.textContent = letter;
                    totalTextAnimationDuration = index * .1;
                    span.style.animationDelay = `${totalTextAnimationDuration}s`; // Delay for each letter
                    span.classList.add('animated-letter');
                    myCanvasHeader.appendChild(span);
                });
                headerAnimationState=1
                setTimeout(animateHeader, (totalTextAnimationDuration+headerShowDuration) * 1000)
            }
            else if(headerAnimationState==1){
                if(myCanvasHeader.style.opacity>0){
                    myCanvasHeader.style.opacity -= .05;
                    setTimeout(animateHeader, 50)
                }
                else{
                    headerAnimationState=0
                    setTimeout(animateHeader, (headerHideDuration) * 1000)
                }
            }
        }
        animateHeader()