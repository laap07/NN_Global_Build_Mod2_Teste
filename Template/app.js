(function () {
    
    //UNITY STUFF
    var buildUrl = "Build";
    var loaderUrl = buildUrl + "/Webgl.loader.js";
    var config = {
        dataUrl: buildUrl + "/121d4acda2dd477cac89ff53341924b9.data",
        frameworkUrl: buildUrl + "/46ec97cb9449e180dafd57f69e38c896.js",
        codeUrl: buildUrl + "/a930367e7146940c685e0bc47d5744e5.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Kriativar",
        productName: "Novo Nordisk",
        productVersion: "0.1",
    };



    function iOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    function isFullscreen(){
        return document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
    }
    var main_container = document.querySelector("#main-container");
    var container = document.querySelector("#unity-container");
    var canvas = document.querySelector("#unity-canvas");
    var loader= document.querySelector("#loader");
    var loaderFill= document.querySelector("#fill");
    var toggle_fullscreen=document.querySelector("#toggle_fullscreen");

    function onProgress(progress) {
        loaderFill.style.width = progress * 100 + "%";
    }

    function onComplete(unityInstance) {
        loader.remove();
    }
    var resizeTimeOut;
    function onWindowResize() {
        const dpr = window.devicePixelRatio || 1;
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

        var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

        if (width / height > 16 / 9) {
            // Se a janela é mais larga que 16:9, ajusta com base na altura
            width = Math.floor(height * (16 / 9));
        } else {
            // Se a janela é mais alta que 16:9, ajusta com base na largura
            height = Math.floor(width * (9 / 16));
        }

        //canvas.height=height;
        //canvas.width=width;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    
        // Set canvas resolution in actual pixels (DPR-aware)
        canvas.width = width * dpr;
        canvas.height = height * dpr;
    }
    function onWindowResizeWithDelay(){
        clearTimeout(resizeTimeOut);
        resizeTimeOut = setTimeout(onWindowResize, 200);
    }
        function setCanvasFullscreen() {
            const canvas = document.getElementById('unity-canvas'); // Substitua pelo ID correto do seu canvas
        
            // Ajusta o tamanho do canvas para cobrir a tela mantendo a proporção 16:9
            function resizeToFullscreen() {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
        
                // Calcula a largura e altura mantendo a proporção 16:9
                let width = windowWidth;
                let height = width * (9 / 16);
        
                if (height > windowHeight) {
                    height = windowHeight;
                    width = height * (16 / 9);
                }
        
                // Aplica as dimensões ao canvas
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                canvas.style.position = 'absolute';
                canvas.style.top = `${(windowHeight - height) / 2}px`; // Centraliza verticalmente
                canvas.style.left = `${(windowWidth - width) / 2}px`; // Centraliza horizontalmente
            }
        
            // Força o canvas a entrar em tela cheia (Fullscreen API)
            function enableFullscreen() {
                if (canvas.requestFullscreen) {
                    canvas.requestFullscreen();
                } else if (canvas.webkitRequestFullscreen) { // Para navegadores baseados em WebKit
                    canvas.webkitRequestFullscreen();
                } else if (canvas.mozRequestFullScreen) { // Para Firefox
                    canvas.mozRequestFullScreen();
                } else if (canvas.msRequestFullscreen) { // Para Internet Explorer/Edge
                    canvas.msRequestFullscreen();
                } else {
                    console.error("Seu navegador não suporta Fullscreen API.");
                }
            }
        
            // Garante que o canvas esteja em tela cheia ou ajustado na janela
            resizeToFullscreen();
            window.addEventListener('resize', resizeToFullscreen);
        
            // Opcional: Ação para entrar em tela cheia ao carregar ou por interação do usuário
            //window.addEventListener('click', enableFullscreen);
        }
        
        // Chame essa função ao carregar a página
        window.onload = setCanvasFullscreen;


    var script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        createUnityInstance(canvas, config, onProgress)
            .then(onComplete)
            .catch((message) => {
                alert(message);
        });
    };
    document.body.appendChild(script);

    window.addEventListener('resize', onWindowResizeWithDelay);
    onWindowResizeWithDelay();


    if(iOS()){
        toggle_fullscreen.style.display="none";
    }
    else{
        toggle_fullscreen.addEventListener('click', function(){

           // if already full screen; exit
            // else go fullscreen
            if ( isFullscreen() ) {
              
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } 
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } 
                else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } 
                else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                
            } else {
                
                if (main_container.requestFullscreen) {
                    main_container.requestFullscreen();
                } else if (main_container.mozRequestFullScreen) {
                    main_container.mozRequestFullScreen();
                } else if (main_container.webkitRequestFullscreen) {
                    main_container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (container.msRequestFullscreen) {
                    main_container.msRequestFullscreen();
                }
            }
           
        });

        document.onfullscreenchange = function ( event ) {
            if ( isFullscreen() ) {
                if (toggle_fullscreen.classList.contains("fullscreenON")) {
                    toggle_fullscreen.classList.remove("fullscreenON");
                }
                toggle_fullscreen.classList.add("fullscreenOFF");

               
            } else {
                
                if (toggle_fullscreen.classList.contains("fullscreenOFF")) {
                    toggle_fullscreen.classList.remove("fullscreenOFF");
                }
                toggle_fullscreen.classList.add("fullscreenON");

              
            }
            setTimeout(() => {
                canvas.width=1000;
                onWindowResizeWithDelay();
            }, 400);
        };

    }

})();
