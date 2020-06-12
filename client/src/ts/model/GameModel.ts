import Signal from "../helpers/signals/signal/Signal";
import {Howl} from "howler";
import ServerCommunicator from "../helpers/ServerCommunicator";
import MainControl from "../controls/MainControl";

export class GameModel {

    public readonly updateLayout:Signal<GameSize> = new Signal<GameSize>();
    //todo: should be not a map - instance;
    public readonly controls:Map<Function, MainControl> = new Map();
    private howler:Howl = <any>{};

    initHowler():Promise<string|void> {
        let root = location.origin + location.pathname.replace(/\/\w+\.html/, "");
        let action = "/assets/sounds/SOUND_FILE.soundmap.json";
        return ServerCommunicator.get(action, root).then(soundConfigContent => {
            let soundConfig:TSoundConfig = JSON.parse(soundConfigContent);
            console.warn("config", soundConfig);
            this.howler = new Howl({
                src: soundConfig.src,
                sprite: soundConfig.sprite,
                autoplay: false,
                onend: function () {
                    console.warn('Finished!');
                }, onloaderror: soundId => {
                    console.error('onloaderror: ' + soundId, soundConfig);
                }
            });
            this.howler.load();
        })
    }

    unload($this:any) {
        this.updateLayout.unload($this);
    }
}

export type GameSize = {
    width:number;
    height:number;
    scale:number;
}

type TSoundConfig = {
    src:string[];
    sprite:{ [name:string]:[number, number] | [number, number, boolean] };
}

let gameModel = new GameModel();
export default gameModel;