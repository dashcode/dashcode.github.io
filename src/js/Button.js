export default class Button extends PIXI.Sprite {

    constructor(textString) {

        super();

        this.buttonDisabledTexture = PIXI.Texture.fromFrame("button_white_disable.png");
        this.buttonHoverTexture = PIXI.Texture.fromFrame("button_white_over.png");
        this.buttonDownTexture = PIXI.Texture.fromFrame("button_white_press.png");
        this.buttonUpTexture = PIXI.Texture.fromFrame("button_white_release.png");

        //this.texture = PIXI.Sprite(PIXI.loader.resources["./assets/spritesheet.json"].textures["button_white_release.png"]);
        this.texture = this.buttonUpTexture;

        this.anchor.set(0.5);

        this.isDisabled = false;
        this.interactive = true;
        this.buttonMode = true;

        this
            .on('pointerdown', this.onButtonDown)
            .on('pointerup', this.onButtonUp)
            .on('pointerupoutside', this.onButtonUp)
            .on('pointerover', this.onButtonOver)
            .on('pointerout', this.onButtonOut);

        this.textString = textString;

        this.fontStyle = {
            fontFamily: 'Arial',
            fontSize: this.height / 2,
            fontWeight: 'bold',
            fill: '#000000'
        };

        this.setLabel(this.textString, this.fontStyle)
    }

    setLabel(textString, fontStyle) {
        this.label = new PIXI.Text(textString, fontStyle);
        this.label.anchor = new PIXI.Point(0.5, 0.5);
        this.addChild(this.label);
    }

    onButtonDown() {
        this.texture = this.buttonDownTexture;
    }

    onButtonUp() {
        this.texture = this.buttonUpTexture;
    }

    onButtonOver() {
        this.texture = this.buttonHoverTexture;
    }

    onButtonOut() {
        this.texture = this.buttonUpTexture;
    }

    get disabled() {
        return this.isDisabled;
    }

    set disabled(bool) {
        if (bool) {
            this.texture = this.buttonDisabledTexture;
            this.isDisabled = true;
            this.interactive = false;
            this.buttonMode = false;
            this.alpha = 0.2;
        } else {
            this.texture = this.buttonUpTexture;
            this.interactive = true;
            this.buttonMode = true;
            this.isDisabled = false;
            this.alpha = 1;
        }

    }

}