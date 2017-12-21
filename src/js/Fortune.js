import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import Core from "./Core.js";
import Button from "./Button.js";
import config from "./config.js";
import {scaleToWindow} from "./scaleToWindow.js";

const PI = Math.PI;
const PI_2 = (PI * 2);
const SECTORS = [0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
const SECTORS_ANGLES = SECTORS.map(sectorValue => ((PI_2 / SECTORS.length) * SECTORS.indexOf(sectorValue)));
const ROTATION_TIME = 1000;
const ACCELERATION_TIME = ROTATION_TIME * 2;

class Fortune {

    constructor() {

        this.game = new Core(config);
        PIXI.loader
            .add("./src/assets/spritesheet-1.json")
            .load(this.setupView.bind(this));
    }

    setupView() {

        //Setup background color and scaleRatio. They could be useful for correct stage resize. 
        this.backgroundColor = "#D6EBF2";
        this.scaleRatio = 1.2;

        //Bind to custom resize function
        window.onresize = window.ondeviceorientation = (event) => {
            this.reszie(this.backgroundColor);
        };

        //Init wheel sprite
        this.wheel = new PIXI.Sprite.fromFrame("wheel.png");
        this.wheel.scale.set(this.scaleRatio / 2);
        this.wheel.position.set(this.game.view.width / 2, this.game.view.height / 2);
        this.wheel.anchor.set(0.5);
        this.game.stage.addChild(this.wheel);

        //Init stopper sprite
        this.stopper = new PIXI.Sprite.fromFrame("stopper.png");
        this.stopper.scale.set(this.scaleRatio / 2);
        this.stopper.x = this.wheel.x;
        this.stopper.y = this.wheel.y - (this.wheel.height / 2) - (this.stopper.height / 2);
        this.stopper.anchor.set(this.scaleRatio / 2);
        this.game.stage.addChild(this.stopper);

        //Init START button sprite
        this.startButton = new Button("SPIN");
        this.startButton.scale.set(this.scaleRatio / 2);
        this.startButton.x = this.wheel.x - this.startButton.width;
        this.startButton.y = this.wheel.y + (this.wheel.height / 2) + (this.startButton.height / 2);
        this.game.stage.addChild(this.startButton);
        this.startButton.click = this.startButton.tap = () => {
            this.startSpinning();
        };

        //Init STOP button sprite
        this.stopButton = new Button("STOP");
        this.stopButton.scale.set(this.scaleRatio / 2);
        this.stopButton.x = this.wheel.x + this.stopButton.width;
        this.stopButton.y = this.wheel.y + (this.wheel.height / 2) + (this.stopButton.height / 2);
        this.stopButton.disabled = true;
        this.game.stage.addChild(this.stopButton);
        this.stopButton.click = this.stopButton.tap = () => {
            this.stopSpinning();
        };

        //Init background for result text
        this.resultBackground = new PIXI.Graphics();
        this.resultBackgroundColor = 0xDEE0DE;
        this._drawResultBackground(this.resultBackgroundColor);
        this.game.stage.addChild(this.resultBackground);

        //Init result var & result text
        this.result = "";
        this.resultFontStyle = {
            fontFamily: 'Arial',
            fontSize: (this.resultBackground.height / 2),
            fontWeight: 'bold',
            fill: '#000000'
        };
        this.resultText = new PIXI.Text(this.result, this.resultFontStyle);
        this.resultText.anchor.set(0.5);
        this.resultText.position.set(this.wheel.position);
        this.resultText.position = this.wheel.position;
        this.game.stage.addChild(this.resultText);
        this.resultText.visible = false;

        //Start animation loop
        this.animate();
    }

    startSpinning() {

        this.startButton.disabled = true;
        this.resultBackground.visible = false;
        this.resultText.visible = false;

        this.rotateWithAcceleration = new TWEEN.Tween(this.wheel)
            .to({rotation: this.wheel.rotation + PI_2}, ACCELERATION_TIME)
            .onUpdate(this.resetRotation.bind(this))
            .easing(TWEEN.Easing.Quadratic.In);

        this.rotateForever = new TWEEN.Tween(this.wheel)
            .to({rotation: this.wheel.rotation + PI_2}, ROTATION_TIME)
            .repeat(Infinity)
            .onStart(function () {this.stopButton.disabled = false;}.bind(this))
            .onUpdate(this.resetRotation.bind(this));

        this.rotateWithAcceleration.chain(this.rotateForever);
        this.rotateWithAcceleration.start();
    }

    stopSpinning() {

        this.rotateForever.stop();

        this.rotateWithDeceleration = new TWEEN.Tween(this.wheel)
            .to({rotation: this.getResultRotation()}, ACCELERATION_TIME)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onStart(function () {this.stopButton.disabled = true;}.bind(this))
            .onComplete(function () {this.showResult(this.result);}.bind(this))
            .onUpdate(this.resetRotation.bind(this))
            .start();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();
    }

    getResultRotation() {

        let closest,
            difference,
            resultRotation,
            resultSector,
            rotation;

        //Find closest correct angel after relative rotation to prevent undefined results
        rotation = this.wheel.rotation;
        closest = SECTORS_ANGLES.reduce(function (prev, crnt) {
            return (Math.abs(crnt - rotation) < Math.abs(prev - rotation) ? crnt : prev);
        });

        //Find difference and caclculate relative result rotation
        difference = rotation - closest;
        resultRotation = (rotation + PI_2) - difference;

        //Add random value to final rotation
        resultRotation += this.getRandomArbitrary(-0.05, 0.05);

        //Find sector number for result 
        resultSector = SECTORS[SECTORS_ANGLES.indexOf(closest)];
        
        //Update result 
        this.result = String(resultSector);

        return resultRotation;
    }

    showResult(result) {
        this.resultText.text = result;
        this.resultBackground.visible = true;
        this.resultText.visible = true;
        this.startButton.disabled = false;
    }

    reszie(backgroundColor) {
        //Also returns scale ratio(not used actually)
        this.scaleRatio = scaleToWindow(this.game.view, backgroundColor);
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    resetRotation() {
        //Prevent wheel.rotation overflow and used for rotate correction
        while (this.wheel.rotation >= PI_2) {
            this.wheel.rotation -= PI_2;
        }
    }

    _drawResultBackground(color) {
        
        let radius = this.wheel.width / 2;

        this.resultBackground.lineStyle(0);
        this.resultBackground.beginFill(color, 0.3);
        this.resultBackground.drawCircle(this.wheel.x, this.wheel.y, radius);
        this.resultBackground.endFill();

        this.resultBackground.visible = false;
    }
}

export {Fortune};