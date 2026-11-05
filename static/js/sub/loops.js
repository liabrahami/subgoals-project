
var practice = {
  timeline: [prac_probe, prac_feedback, saveandUpdatePracData], 

  loop_function: function() {

    if(pracCount==nprac) {

      maxtime = adapt_time ? Quartile(rts, adapt_quant) : maxtime; 

      jsPsych.data.addProperties({deadline: maxtime});

      return false; 

    }

    return true; 

  }, 

  on_start: function() {

    // hide game / progress display during practice
    document.querySelector('#jspsych-progressbar-container')
      .style.display = 'none'; 
    // return to normal layout between blocks
    document.querySelector('.jspsych-display-element')
      .classList.remove('game-active');

  }

};


/*
// create the 3 images used on the progress bar
function setupProgressImages() {

  let progressBar = document.querySelector('#jspsych-progressbar-outer');

  // current position image
  if(!document.getElementById('current-progress-image')) {

    let currentHTML =
      '<img id="current-progress-image" ' +
      'class="progress-image" ' +
      'src="static/images/current.png">';

    progressBar.insertAdjacentHTML('beforeEnd', currentHTML);

  }

  // subgoal image
  if(!document.getElementById('subgoal-progress-image')) {

    let subgoalHTML =
      '<img id="subgoal-progress-image" ' +
      'class="progress-image" ' +
      'src="static/images/subgoal.png">';

    progressBar.insertAdjacentHTML('beforeEnd', subgoalHTML);

  }

  // goal image
  if(!document.getElementById('goal-progress-image')) {

    let goalHTML =
      '<img id="goal-progress-image" ' +
      'class="progress-image" ' +
      'src="static/images/goal.png">';

    progressBar.insertAdjacentHTML('beforeEnd', goalHTML);

  }

}
*/


// create the game background, character, subgoal and goal images
function setupGame() {

  let progressContainer = document.querySelector('#jspsych-progressbar-container');

  // only create the game once
  if(!document.getElementById('game-container')) {

    let gameHTML =
      '<div id="game-container">' +

        '<img id="game-character" ' +
        'class="game-image" ' +
        'src=""> ' +

        '<img id="game-subgoal" ' +
        'class="game-image" ' +
        'src="' + selectedScenarioAssets.subgoal + '"> ' +

        '<img id="game-goal" ' +
        'class="game-image" ' +
        'src="' + selectedScenarioAssets.goal + '">' +

        '<div id="oddball-panel">' +
          '<div id="oddball-stimuli"></div>' +
        '</div>' +

        '</div>';

    progressContainer.insertAdjacentHTML('beforeEnd', gameHTML);

  }

  // always make sure the correct scenario background is shown
  document.getElementById('game-container').style.backgroundImage =
    'url("' + selectedScenarioAssets.background + '")';

}


/*
 // update the linear progress bar and the positions of the 3 images
 function updateProgressBar() {

   // progCount = number of correct answers
   // length_list[bCount] = number of correct answers needed to finish the block
   let progress = progCount / length_list[bCount];

   // convert the subgoal from number of correct responses to a proportion of the block
   let subgoal_progress = subgoal_list[bCount] / length_list[bCount];

   // all progress bars are linear
   jsPsych.setProgressBar(progress);

   // get the 3 progress bar images
   let currentImage = document.getElementById('current-progress-image');
   let subgoalImage = document.getElementById('subgoal-progress-image');
   let goalImage = document.getElementById('goal-progress-image');

   // current image moves with the participant's progress
   currentImage.style.left = (progress * 100) + '%';

   // goal image always stays at the end of the progress bar
   goalImage.style.left = '100%';

   // if the participant has not yet reached the subgoal,
   // show the subgoal image at the subgoal position
   if(progCount < subgoal_list[bCount]) {

     subgoalImage.style.display = 'block';
     subgoalImage.style.left = (subgoal_progress * 100) + '%';

   } else {

     // once the participant reaches the subgoal, hide the subgoal image
     subgoalImage.style.display = 'none';

   }

 }
*/

// calculate the maximum detour height relative to game width
function getScenarioDetourHeight() {

  if(selectedScenario == "knight") {
    return 130 / 12;
  }

  if(selectedScenario == "explorer") {
    return 130 / 12;
  }

  // diver does not take a detour
  return 0;
}

// calculate the vertical movement needed to follow the detour
function getDetourOffset(progress) {

  // how far the character moves into the distance (in cqw units)
  const maxDetourHeight = getScenarioDetourHeight();

  // first half: move away from the viewer
  if(progress <= 0.5) {
    return maxDetourHeight * (progress / 0.5);
  } 
  // second half: move back toward the viewer
  else {
    return maxDetourHeight * ((1 - progress) / 0.5);
  }

}

// calculate how much the character should shrink on the detour
function getDetourScale(progress) {

  // size at the peak of the detour
  const minScale = 0.60;

  // first half: shrink until 50%
  if(progress <= 0.5) {
    return 1 - ((1 - minScale) * (progress / 0.5));
  }

  // second half: grow back to normal size
  else {
    return minScale + ((1 - minScale) * ((progress - 0.5) / 0.5));
  }

}

// update the game and the positions of the 3 images
function updateGameProgress() {

  // progCount = number of correct answers
  // length_list[bCount] = number of correct answers needed to finish the block
  let progress = progCount / length_list[bCount];

  // convert task progress from 0-100% to 10-90% of the game background
  let character_position = 10 + (progress * 80);

  // only take the detour when there is a subgoal
  let character_offset = 0;
  let character_scale = 1;

  if(condition_list[bCount] != "no_subgoal" && selectedScenario != "diver") {
    character_offset = getDetourOffset(progress);
    character_scale = getDetourScale(progress);
  }

  // old progress bar is no longer being visually used
  // jsPsych.setProgressBar(progress);

  // get the 3 game images
  let characterImage = document.getElementById('game-character');
  let subgoalImage = document.getElementById('game-subgoal');
  let goalImage = document.getElementById('game-goal');

  // current image moves with the participant's progress
  characterImage.style.left = character_position + '%';

  // move character vertically so it follows the detour
  characterImage.style.bottom =
    'calc(var(--character-bottom) + ' + character_offset + 'cqw)';

  // shrink character on the way up the detour, then grow it back
  characterImage.style.transform =
    'translateX(-50%) scale(' + character_scale + ')';

  // goal image always stays at 90% of the game background
  goalImage.style.left = '90%';

  // no-subgoal condition:
  // character already starts with the subgoal object
  if(condition_list[bCount] == "no_subgoal") {

    characterImage.src = selectedScenarioAssets.characterWithSubgoal;

    subgoalImage.style.display = 'none';

  } else {

    // convert the subgoal from number of correct responses to a proportion of the block
    let subgoal_progress = subgoal_list[bCount] / length_list[bCount];

    // convert subgoal progress from 0-100% to 10-90% of the game background
    let subgoal_position = 10 + (subgoal_progress * 80);

    // calculate subgoal position and scale
    // diver subgoal stays on the straight path
    let subgoal_offset = 0;
    let subgoal_scale = 1;

    if(selectedScenario != "diver") {
      subgoal_offset = getDetourOffset(subgoal_progress);
      subgoal_scale = getDetourScale(subgoal_progress);
    }

    // position the subgoal on the detour
    subgoalImage.style.left = subgoal_position + '%';

    subgoalImage.style.bottom =
      'calc(var(--subgoal-bottom) + ' + subgoal_offset + 'cqw)';

    // shrink the subgoal based on its position on the detour
    subgoalImage.style.transform =
      'translateX(-50%) scale(' + subgoal_scale + ')';

    // if the participant has not yet reached the subgoal,
    // show the subgoal image at the subgoal position
    if(progCount < subgoal_list[bCount]) {

      characterImage.src = selectedScenarioAssets.characterNoSubgoal;

      subgoalImage.style.display = 'block';

    } else {

      // once the participant reaches the subgoal,
      // hide the subgoal image
      subgoalImage.style.display = 'none';

      // and update the character so that it now has the subgoal object
      characterImage.src = selectedScenarioAssets.characterWithSubgoal;

    }

  }

}



var trials = {

  timeline: [probe, saveandUpdateData], 

  loop_function: function() {

    // stop when the goal is reached or the 90-second limit is reached
    return !blockFinished();

  },

  on_start: function() {

    console.log(length_list);
    console.log(subgoal_list);
    console.log(condition_list);

    // show game
    document.querySelector('#jspsych-progressbar-container').style.display = 'block'; 

    // add game background, character, subgoal and goal images
    setupGame();

    // update game and image positions
    updateGameProgress();

  },

};



var flag; // fix weird bug with jsPsych so that blocks don't skip 

var countdown = {

  timeline:[show_countdown], 

  loop_function: function() {

    if(cdwn < 1) {

      cdwn = 3;

      flag = false; 

      return false

    }

    flag = true; 

    return true; 

  }

}; 



var blocks = {

  timeline: [countdown, trials, feedback_b],

  loop_function: function() {

    console.log("BLOCK LOOP CHECK");
    console.log("bCount:", bCount);
    console.log("nblocks:", nblocks);
    console.log("flag:", flag);

    // if this was the last block, hide the game and stop
    if(bCount==nblocks-1) {

      document.querySelector('#jspsych-progressbar-container')
        .style.display = 'none';

      document.querySelector('.jspsych-display-element')
        .classList.remove('game-active');

      return false;

    }

    return true; 

  },

  on_start: function() {

    // hide and reset game display between blocks
    document.querySelector('#jspsych-progressbar-container')
      .style.display = 'none';

    // return to normal layout for the countdown
    document.querySelector('.jspsych-display-element')
      .classList.remove('game-active');

    // reset progress
    // jsPsych.setProgressBar(0); 
    progCount=0; 

    // start a fresh timer and accuracy count for each block
    blockStartTime = null;
    goalReachedTime = null;
    blockBonus = 0;
    pcorrect = null;

    // increment block and reset trial in block
    if(flag==false) {

      bCount++;

      tCount=0;

      flag = true; 

    }

  }

};

