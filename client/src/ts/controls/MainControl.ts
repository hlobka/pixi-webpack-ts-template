import {Container} from "pixi.js";

export default abstract class MainControl {
    public readonly container:PIXI.Container;

    protected constructor() {
        this.container = new Container();
    }
}