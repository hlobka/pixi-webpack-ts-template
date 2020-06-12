import PIXI, {Container} from "pixi.js";
import gameModel, {GameSize} from "../model/GameModel";
import TextStyles from "../model/TextStyles";

export default class GameTitle {
    public readonly container:Container;
    private gameTitle:PIXI.Text;

    constructor(private title:string) {
        this.container = new Container();
        this.gameTitle = new PIXI.Text(title, TextStyles.GAME_LABEL);
        this.container.addChild(this.gameTitle);
        this.gameTitle.pivot.set(this.gameTitle.width * .5, this.gameTitle.height * .5);
        gameModel.updateLayout.add(this.onResize, this);
        window.addEventListener("beforeunload", ev => {
            gameModel.unload(this);
        });
    }

    private onResize(gameSize:GameSize) {
        this.container.x = gameSize.width * .5;
        this.container.y = gameSize.height * .5;
    }
}