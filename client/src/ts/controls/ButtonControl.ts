import MainControl from "./MainControl";
import {Filter, Sprite, Texture} from "pixi.js";
import Signal from "../helpers/signals/signal/Signal";
import {GlowFilter} from "@pixi/filter-glow";
import {getCirclePolygons} from "../helpers/GuiMath";

export default class ButtonControl extends MainControl {
    public onClick:Signal<ButtonControl> = new Signal<ButtonControl>();

    private readonly button:PIXI.Sprite;
    private readonly sepiaColorFilter:PIXI.filters.ColorMatrixFilter;
    private readonly additionalFilters:Array<Filter> = [];

    constructor(texture:Texture) {
        super();
        this.button = new Sprite(texture);
        this.button.interactive = true;
        this.button.buttonMode = true;
        let glowFilter:GlowFilter = new PIXI.filters.GlowFilter({
            color: 0xffffff, outerStrength: 50, distance: 10, quality: 0.1
        });
        this.sepiaColorFilter = new PIXI.filters.ColorMatrixFilter();
        this.sepiaColorFilter.sepia( false);
        this.button.on("pointerover", () => {
            this.container.filters = [glowFilter, ...this.additionalFilters];
        });
        this.button.on("pointerout", () => {
            this.container.filters = [...this.additionalFilters];
        });
        this.button.hitArea = new PIXI.Polygon(getCirclePolygons(this.button.width * .5, 10));
        this.button.on("pointerdown", () => {
            if (this.isEnable()) {
                this.onClick.emit(this);
            }
        })
        this.container.addChild(this.button);
    }

    isEnable() {
        return this.button.alpha === 1;
    }

    enable() {
        this.button.alpha = 1;
        this.button.filters = [];
        this.button.interactive = true;
        this.button.buttonMode = true;
    }

    disable() {
        if (this.button.alpha === 1) {
            this.button.filters = [this.sepiaColorFilter];
            this.button.interactive = false;
            this.button.buttonMode = false;
            this.container.filters = [...this.additionalFilters];
            this.button.alpha += 1;
        }
    }

    addFilter(filter:Filter) {
        this.additionalFilters.push(filter);
        this.container.filters = [...this.additionalFilters];
    }
}