const PIXI = require("pixi.js");
const TWEEN = require('@tweenjs/tween.js');

import Core from "./Core.js";
import Button from "./Button.js";
import config from "./config.js";

export default class Fortune {

    constructor() {
        this.game = new Core(config);
        PIXI.loader
            .add("./src/assets/spritesheet-1.json")
            .load(this.setupView.bind(this));
    }

    setupView() {

        window.addEventListener("resize", this.resize.bind(this));
        window.addEventListener("deviceorientation", this.resize.bind(this));

        this.wheel = new PIXI.Sprite.fromFrame("wheel.png");
        this.wheel.anchor.set(0.5);
        this.wheel.x = this.game.view.width / 2;
        this.wheel.y = this.game.view.height / 2;
        this.wheel.scale.set(0.5);
        this.game.stage.addChild(this.wheel);


        this.stopper = new PIXI.Sprite.fromFrame("stopper.png");
        this.stopper.scale.set(0.5);
        this.stopper.anchor.set(0.5);
        this.stopper.x = this.wheel.x;
        this.stopper.y = this.wheel.y - (this.wheel.height / 2) - (this.stopper.height / 2);
        this.game.stage.addChild(this.stopper);

        this.startButton = new Button("SPIN");
        this.startButton.scale.set(0.5);
        this.startButton.x = this.wheel.x - this.startButton.width;
        this.startButton.y = this.wheel.y + (this.wheel.height / 2) + (this.startButton.height / 2);
        this.game.stage.addChild(this.startButton);

        this.startButton.click = this.startButton.tap = function () { this.startSpinning(); }.bind(this);

        this.stopButton = new Button("STOP");
        this.stopButton.scale.set(0.5);
        this.stopButton.x = this.wheel.x + this.stopButton.width;
        this.stopButton.y = this.wheel.y + (this.wheel.height / 2) + (this.stopButton.height / 2);
        this.stopButton.disabled = true;
        this.stopButton.click = this.stopButton.tap = function () { this.stopSpinning(); }.bind(this);
        this.game.stage.addChild(this.stopButton);
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
        console.log(this.wheel.rotation)
        TWEEN.update();
    }

    resetRotation() {
        while (this.wheel.rotation >= Math.PI * 2) {
            this.wheel.rotation -= Math.PI * 2;
        }
    }

    resize() {
        console.log("Resize!");
    }

}
