import "./style.css";
import Phaser from "phaser";


const sizes = {
  width: 500,
  height: 500,
};


const speedDown = 300;


class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime = 30; // 초기화 추가
    this.coinMusic;
    this.bgMusic;
    this.emitter;
  }


  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
    this.load.image("money", "/assets/money.png");
    this.load.audio("coin", "/assets/coin.mp3");
    this.load.audio("bgMusic", "/assets/bgMusic.mp3");
  }


  create() {



    this.coinMusic = this.sound.add("coin");
    this.bgMusic = this.sound.add("bgMusic");
    this.bgMusic.play({ loop: true });


    const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    bg.displayWidth = sizes.width;
    bg.displayHeight = sizes.height;


    this.player = this.physics.add
      .image(sizes.width / 2, sizes.height - 80, "basket")
      .setOrigin(0.5, 0)
      .setDisplaySize(80, 40);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);


    this.target = this.physics.add.image(sizes.width / 2, 0, "apple").setOrigin(0.5, 0).setDisplaySize(25, 25);
    this.target.setMaxVelocity(0, speedDown);


    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);
    this.cursor = this.input.keyboard.createCursorKeys();


    this.textScore = this.add.text(sizes.width - 110, 10, "Score: 0", {
      font: "20px Arial",
      fill: "#000000",
    });
    this.textTime = this.add.text(10, 10, "Remaining Time: 30", {
      font: "20px Arial",
      fill: "#000000",
    });


    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });


    this.emitter = this.add.particles(0, 0, "money", {
      speed: 80,
      gravityY: speedDown - 200,
      scale: 0.03,
      duration: 100,
      emitting: false,
    });
  }


  update() {
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }


    const { left, right } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }


  updateTimer() {
    this.remainingTime--;
    this.textTime.setText(`Remaining Time: ${this.remainingTime}`);
    if (this.remainingTime <= 0) {
      this.gameOver();
      this.timedEvent.remove();
    }
  }


  getRandomX() {
    return Math.floor(Math.random() * (sizes.width - 20));
  }


  targetHit() {
    this.coinMusic.play();
    this.emitter.explode(10, this.target.x, this.target.y);
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }


  gameOver() {
    this.sys.game.destroy(true)
  }
}


const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};


const game = new Phaser.Game(config);

