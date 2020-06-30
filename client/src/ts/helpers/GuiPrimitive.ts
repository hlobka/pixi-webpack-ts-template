import {Graphics} from "pixi.js";

export function getRect(w:number, h:number, color:number = 0xff0000, alpha:number = 1):Graphics{
    return new RoundRect(w, h, 0, color, alpha);
}

export class RoundRect extends Graphics {

    constructor(width:number, height:number, radius:number = 5, bgColor:number = 0xebeced, alpha:number = 1) {
        super();
        this.beginFill(bgColor, alpha);
        this.drawRoundedRect(0, 0, width, height, radius);
        this.endFill();
        this.x = 0;
        this.y = 0;
        this.cacheAsBitmap = true;
    }

}