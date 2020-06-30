import MainControl from "./MainControl";
import {Graphics} from "pixi.js";
import {getRect} from "../helpers/GuiPrimitive";
// todo: need to add animation as in youtube;
export default class FullScreenButtonControl extends MainControl {
    private readonly corner1:PIXI.Graphics;
    private readonly corner2:PIXI.Graphics;
    private readonly corner3:PIXI.Graphics;
    private readonly corner4:PIXI.Graphics;

    constructor(htmlElement:HTMLElement, color:number, weight:number = 5) {
        super();
        let cornerSize = weight * 3;
        //todo: need to check. why it works without padding;
        let cornerPadding = 0;//weight / 4;
        let center = cornerSize + cornerPadding;

        let box = getRect(center * 3, center * 3, 0xff0000, 0);
        this.corner1 = new Graphics();
        this.corner1.lineStyle(weight, color);
        this.corner1.moveTo(0, cornerSize)
        this.corner1.lineTo(0, 0)
        this.corner1.lineTo(cornerSize, 0);
        this.corner2 = new Graphics();
        this.corner2.lineStyle(weight, color);
        this.corner2.moveTo(0, 0)
        this.corner2.lineTo(cornerSize, 0);
        this.corner2.lineTo(cornerSize, cornerSize)
        this.corner3 = new Graphics();
        this.corner3.lineStyle(weight, color);
        this.corner3.moveTo(cornerSize, 0)
        this.corner3.lineTo(cornerSize, cornerSize)
        this.corner3.lineTo(0, cornerSize);
        this.corner4 = new Graphics();
        this.corner4.lineStyle(weight, color);
        this.corner4.moveTo(0, 0)
        this.corner4.lineTo(0, cornerSize)
        this.corner4.lineTo(cornerSize, cornerSize);

        this.enterNoFullScreenState(center);

        box.pivot.set(center, center);

        this.container.addChild(
            this.corner1,
            this.corner2,
            this.corner3,
            this.corner4,
            box
        );

        this.container.interactive = true;
        this.container.buttonMode = true;
        document.addEventListener('fullscreenchange', (event) => {
            if (document.fullscreenElement) {
                this.enterFullscreenState(center);
            } else {
                this.enterNoFullScreenState(center);
            }
        });
        this.container.on("pointerdown", () => {
            if (!document.fullscreenElement) {
                htmlElement.requestFullscreen().then(() => {
                    this.enterFullscreenState(center);
                });
            } else if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    this.enterNoFullScreenState(center);
                });
            }
        })

    }

    private enterNoFullScreenState(center:number) {
        this.corner1.pivot.set(center, center);
        this.corner2.pivot.set(-center, center);
        this.corner3.pivot.set(-center, -center);
        this.corner4.pivot.set(center, -center);
    }

    private enterFullscreenState(center:number) {
        this.corner1.pivot.set(-center, -center);
        this.corner2.pivot.set(+center, -center);
        this.corner3.pivot.set(+center, +center);
        this.corner4.pivot.set(-center, +center);
    }
}
