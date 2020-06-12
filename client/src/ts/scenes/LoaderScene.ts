import PIXI, {Application} from "pixi.js";
import BackgroundControl from "../controls/BackgroundControl";
import BaseScene from "./BaseScene";
import StrictResourcesHelper from "../pixi/StrictResourcesHelper";
import gameModel from "../model/GameModel";
import {SceneManager} from "./SceneManager";
import AlphaFadeInEffect from "../pixi/effects/AlphaFadeInEffect";
import GameTitle from "../controls/GameTitle";
import MainScene from "./MainScene";

export default class LoaderScene extends BaseScene {
    private readonly gameTitle:PIXI.Container;
    private timeoutBeforeShowTheGame:number = -1;
    private gameLoadTime:number = -1;

    constructor(sceneManager:SceneManager, app:Application) {
        super(sceneManager, app);
        this.gameTitle = new GameTitle("Spin it to Win It").container;
    }

    compose():void {
        this.app.stage.addChild(this.gameTitle);
        PIXI.Loader.shared.add('UI', 'assets/atlases/ui.json');
        PIXI.Loader.shared.add('config', 'assets/config.json');
        PIXI.Loader.shared.once('complete', this.onLoadComplete.bind(this));
        PIXI.Loader.shared.load();
        this.gameLoadTime = Date.now();
    }

    dispose():void {
        // @ts-ignore
        let backgroundControl:BackgroundControl = gameModel.controls.get(BackgroundControl);
        this.scene.removeChild(backgroundControl.container);
        this.scene.removeChild(this.gameTitle);
    }

    private onLoadComplete() {
        let texture = StrictResourcesHelper.getTexture("UI", "game_bg.png");
        let backgroundControl = new BackgroundControl(texture);
        gameModel.controls.set(BackgroundControl, backgroundControl);
        new AlphaFadeInEffect(backgroundControl.container, this.app.ticker);
        this.scene.addChildAt(backgroundControl.container, 0);
        this.app.stage.addChild(this.gameTitle);
        setTimeout(() => {
            this.sceneManager.navigate(MainScene);
        }, this.timeoutBeforeShowTheGame - (Date.now() - this.gameLoadTime));
    }

}