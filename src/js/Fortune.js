import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import Core from "./Core.js";
import Button from "./Button.js";
import config from "./config.js";
import {scaleToWindow} from "./scaleToWindow.js";

const PI = 3.141592;
const PI2 = (PI * 2);
const SECTORS = [0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
const SECTORS_ANGLES = SECTORS.map(sectorValue => ( (PI2 / SECTORS.length) * sectorValue ));
const TIME = 1000;

export default class Fortune {

    constructor() {
        this.game = new Core(config);
        PIXI.loader
            .add("./src/assets/spritesheet-1.json")
            .load(this.setupView.bind(this));
    }

    setupView() {

        window.onresize = window.ondeviceorientation = (event) => {scaleToWindow(this.game.view, "#D6EBF2");}; 

        this.wheel = new PIXI.Sprite.fromFrame("wheel.png");
        this.wheel.position.set(this.game.view.width / 2, this.game.view.height / 2);
        this.wheel.anchor.set(0.5);
        this.wheel.scale.set(0.5);
        this.game.stage.addChild(this.wheel);


        this.stopper = new PIXI.Sprite.fromFrame("stopper.png");
        this.stopper.scale.set(0.5);
        this.stopper.x = this.wheel.x;
        this.stopper.y = this.wheel.y - (this.wheel.height / 2) - (this.stopper.height / 2);
        this.stopper.anchor.set(0.5);
        this.game.stage.addChild(this.stopper);

        this.startButton = new Button("SPIN");
        this.startButton.scale.set(0.5);
        this.startButton.x = this.wheel.x - this.startButton.width;
        this.startButton.y = this.wheel.y + (this.wheel.height / 2) + (this.startButton.height / 2);
        this.game.stage.addChild(this.startButton);
        this.startButton.click = this.startButton.tap = () => {this.startSpinning();};

        this.stopButton = new Button("STOP");
        this.stopButton.scale.set(0.5);
        this.stopButton.x = this.wheel.x + this.stopButton.width;
        this.stopButton.y = this.wheel.y + (this.wheel.height / 2) + (this.stopButton.height / 2);
        this.stopButton.disabled = true;
        this.game.stage.addChild(this.stopButton);
        this.stopButton.click = this.stopButton.tap = () => {this.stopSpinning();};

        this.animate();
    }

    startSpinning() {

        this.startButton.disabled = true;

        this.rotateWithAcceleration = new TWEEN.Tween(this.wheel)
            .to({rotation: "+6.28"}, 6000)
            .onUpdate(this.resetRotation.bind(this))
            .easing(TWEEN.Easing.Quadratic.In);
        
        this.rotateForever = new TWEEN.Tween(this.wheel)
            .to({rotation: "+6.28"}, 3000)
            .repeat(Infinity)
            .onStart(function() {this.stopButton.disabled = false;}.bind(this))
            .onUpdate(this.resetRotation.bind(this));

        this.rotateWithAcceleration.chain(this.rotateForever);
        this.rotateWithAcceleration.start();
        }

    stopSpinning() {

        this.rotateForever.stop();

        this.rotateWithDeceleration = new TWEEN.Tween(this.wheel)
            .to({rotation: "+6.28"}, 6000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onStart(function() {this.stopButton.disabled = true;}.bind(this))
            .onComplete(function() {this.startButton.disabled = false;}.bind(this))
            .onUpdate(this.resetRotation.bind(this))
            .start();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        console.log(this.wheel.rotation);
        TWEEN.update();
    }

    resetRotation() {
        while (this.wheel.rotation >= Math.PI * 2) {
            this.wheel.rotation -= Math.PI * 2;
        }
    }
}