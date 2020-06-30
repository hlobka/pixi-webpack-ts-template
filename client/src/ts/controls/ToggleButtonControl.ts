import MainControl, {PivotType} from "./MainControl";
import {Sprite, Texture} from "pixi.js";
import {GlowFilter} from "@pixi/filter-glow";
import Signal from "../helpers/signals/signal/Signal";

export default class ToggleButtonControl extends MainControl {

    private readonly defaultState:PIXI.Sprite;
    private readonly toggleState:PIXI.Sprite;
    public onClick:Signal<ToggleButtonControl> = new Signal<ToggleButtonControl>();
    private isToggled:boolean = false;

    constructor(defaultTexture:Texture, toggleTexture:Texture) {
        super();
        this.defaultState = new Sprite(defaultTexture);
        this.toggleState = new Sprite(toggleTexture);
        this.setPivotTo(this.defaultState, PivotType.BL);
        this.setPivotTo(this.toggleState, PivotType.BL);
        this.setPivotTo(this.container, PivotType.BL);
        this.defaultState.y += this.defaultState.height;
        this.toggleState.y += this.defaultState.height;
        this.toggleState.visible = false;
        this.container.addChild(
            this.defaultState,
            this.toggleState
        );
        let glowFilter:GlowFilter = new PIXI.filters.GlowFilter({
            color: 0xffffff, outerStrength: 50, distance: 10, quality: .3
        });
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on("pointerover", () => {
            this.container.filters = [glowFilter];
            if (!this.isToggled) {
                this.defaultState.visible = false;
                this.toggleState.visible = true;
            }
        });
        this.container.on("pointerout", () => {
            this.container.filters = [];
            if (!this.isToggled) {
                this.defaultState.visible = true;
                this.toggleState.visible = false;
            }
        });
        this.container.on("pointerdown", () => {
            if (this.isEnable()) {
                this.onClick.emit(this);
            }
        })
    }

    isEnable() {
        return this.container.alpha === 1;
    }

    enable() {
        this.container.alpha = 1;
    }

    disable() {
        if (this.container.alpha === 1) {
            this.container.alpha += 1;
        }
    }

    toggle(value:boolean = true) {
        this.isToggled = value;
        this.toggleState.visible = this.isToggled;
        this.defaultState.visible = !this.isToggled;
    }
}
