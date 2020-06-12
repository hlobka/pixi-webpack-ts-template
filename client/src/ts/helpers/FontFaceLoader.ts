import getStringPromise from "./PromiseHelper";

export default class FontFaceLoader {

    constructor(private fontFamily:string, private fontUrl:string) {

    }

    load():Promise<string> {
        let p = getStringPromise();
        // @ts-ignore
            let junction_font = new FontFace(this.fontFamily, `url(${this.fontUrl})`);
        // @ts-ignore
        junction_font.load().then((loaded_face)=> {
            // @ts-ignore
            document.fonts.add(loaded_face);
            p.resolver();
            // @ts-ignore
        }).catch((e) => {
            p.rejector(e);
            throw e;
        });
        return p.p;
    }
}