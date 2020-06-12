import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel, {GameSize} from "../model/GameModel";
import {Sprite} from "pixi.js";
import StrictResourcesHelper from "../pixi/StrictResourcesHelper";

export default class MainScene extends BaseScene {

    compose():void {
        // @ts-ignore
        let backgroundControl:BackgroundControl = gameModel.controls.get(BackgroundControl);
        let texture = StrictResourcesHelper.getTexture("UI", "alf-like.png");
        this.scene.addChild(backgroundControl.container);
        let sprite = new Sprite(texture);
        sprite.pivot.set(sprite.width * .5, sprite.height * .5)
        this.scene.addChild(sprite);
        let x = 0;
        this.app.ticker.add(params => {
            sprite.scale.set(Math.sin(x)/2 + 1, Math.cos(x)/2 + 1);
            x += 0.1;
        });
        gameModel.updateLayout.add((gameSize:GameSize) => {
            sprite.x = gameSize.width * .5;
            sprite.y = gameSize.height * .5;
        }, this);
    }

    dispose():void {
    }

}