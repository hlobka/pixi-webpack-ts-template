import * as PIXI from 'pixi.js';

import gameModel, {GameSize} from "./model/GameModel";
import Sprite = PIXI.Sprite;
import GameTitle from "./controls/GameTitle";
import FontFaceLoader from "./helpers/FontFaceLoader";
import AlphaFadeInEffect from "./pixi/effects/AlphaFadeInEffect";
import BackgroundControl from "./controls/BackgroundControl";
import {Container} from "pixi.js";
import {SceneManager} from "./scenes/SceneManager";
import LoaderScene from "./scenes/LoaderScene";
// import GameField from "./game1/GameField";
// import {QuestionBar} from "./game1/QuestionBar";
// import {TeamItem} from "./game1/TeamItem";
// import FontFaceLoader from "./helper/FontFaceLoader";
// import GameTitle from "./controls/GameTitle";
// import AlphaFadeInEffect from "./effects/AlphaFadeInEffect";

// let globalScale = .5;
let globalScale = 1;
let gameSize:GameSize = {
    width: 1920 * globalScale,
    height: 1080 * globalScale,
    scale: globalScale
}

class Main {
    private readonly app:PIXI.Application;
    public static APP:PIXI.Application;

    constructor() {
        this.app = new PIXI.Application({
            width: gameSize.width,
            height: gameSize.height,
            backgroundColor: 0xcecece,
            transparent: false
        });
        Main.APP = this.app;
        document.body.appendChild(this.app.view);

        new SceneManager(this.app).navigate(LoaderScene);
        window.addEventListener('resize', this.resize.bind(this), {capture: true});
        this.resize();
    }

    private resize() {
        const innerWidth = window.innerWidth
        const innerHeight = window.innerHeight
        let width = 1920;
        let height = 1080;
        let scale = Math.min(innerWidth / width, innerHeight / height)
        let newWidth = Math.min(innerWidth / scale, width)
        let newHeight = Math.min(innerHeight / scale, height)
        this.app.renderer.resize(
            width * globalScale,
            height * globalScale
        );
        console.log("-=-=-=-=-=-");
        console.log("game width: " + width);
        console.log("game innerWidth: " + innerWidth);
        console.log("game newWidth: " + newWidth);
        console.log("game height: " + height);
        console.log("game innerHeight: " + innerHeight);
        console.log("game newHeight: " + newHeight);
        console.log("game scale: " + scale);
        let canvas:HTMLCanvasElement = this.app.view;
        canvas.style.width = newWidth * scale + 'px';
        canvas.style.height = newHeight * scale + 'px';
        canvas.style.marginTop = `${(innerHeight - newHeight * scale) / 2}px`;
        canvas.style.marginLeft = `${(innerWidth - newWidth * scale) / 2}px`;
        gameSize.scale = this.app.renderer.width / 1920;
        gameSize.width = this.app.renderer.width;
        gameSize.height = this.app.renderer.height;
        gameModel.updateLayout.emit(gameSize);
    }
}

window.onload = function () {
    let fontFaceLoader = new FontFaceLoader('Neuron-Black', 'assets/fonts/Neuron-Black.ttf');
    fontFaceLoader.load().then(() => {
        new Main();
    }).catch(reason => {
        console.error(reason);
    });
}