export default class Core {

    constructor(config) {

        PIXI.utils.skipHello();

        this._app = new PIXI.Application(config);

        this.renderer = PIXI.autoDetectRenderer();

        /* Define a zero padding and a margin for the all HTML elements
        That won't allow some browsers to add padding around the element borders */
        let newStyle = document.createElement("style");
        let style = "* {padding: 0; margin: 0}";
        newStyle.appendChild(document.createTextNode(style));
        document.head.appendChild(newStyle);

        // Scale the app view to the maximum size of the window
        this._app.view.style.position = "absolute";
        this._app.view.style.display = "block";

        // Append application to the <div> with "app-wrapper" id
        document.querySelector("#app-wrapper").appendChild(this._app.view);

    }

    get stage() {
        return this._app.stage;
    }

    get ticker() {
        return this._app.ticker();
    }

    get view() {
        return this._app.view;
    }

    render() {
        return this.renderer.render(this._app.stage);
    }
}