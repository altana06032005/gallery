import { Stage1_Charging } from './stages/Stage1_Charging.js';
import { Stage2_Flight } from './stages/Stage2_Flight.js';
import { Stage3_Combat } from './stages/Stage3_Combat.js';
import { Stage4_Landing } from './stages/Stage4_Landing.js';
import { Stage5_Scanning } from './stages/Stage5_Scanning.js';
import { Stage6_Collection } from './stages/Stage6_Collection.js';
// Import other stages as we create them
console.log("Stage1 module:", Stage1_Charging);

export class GameManager {
  constructor(container) {
    this.container = container;
    this.currentStage = null;
    this.state = {
      energy: 0,
      score: 0,
      scannedSegments: 0,
      collectedSamples: 0
    };
  }

  start() {
    this.loadStage(1);
  }

  loadStage(stageNumber) {
    // Clear container
    this.container.innerHTML = '';

    // Cleanup previous stage if exists
    if (this.currentStage && this.currentStage.cleanup) {
      this.currentStage.cleanup();
    }

    switch (stageNumber) {
      case 1:
        this.currentStage = new Stage1_Charging(this.container, this);
        break;
      case 2:
        this.currentStage = new Stage2_Flight(this.container, this);
        break;
      case 3:
        this.currentStage = new Stage3_Combat(this.container, this);
        break;
      case 4:
        this.currentStage = new Stage4_Landing(this.container, this);
        break;
      case 5:
        this.currentStage = new Stage5_Scanning(this.container, this);
        break;
      case 6:
        this.currentStage = new Stage6_Collection(this.container, this);
        break;
      // Future stages
      default:
        console.error('Unknown stage:', stageNumber);
    }

    if (this.currentStage) {
      this.currentStage.init();
    }
  }

  nextStage() {
    // Logic to determine next stage based on current
    if (this.currentStage instanceof Stage1_Charging) {
      this.loadStage(2);
    } else if (this.currentStage instanceof Stage2_Flight) {
      this.loadStage(3);
    } else if (this.currentStage instanceof Stage3_Combat) {
      this.loadStage(4);
    } else if (this.currentStage instanceof Stage4_Landing) {
      this.loadStage(5);
    } else if (this.currentStage instanceof Stage5_Scanning) {
      this.loadStage(6);
    }
  }
}
