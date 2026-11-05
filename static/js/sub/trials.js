
var bCount      = 0;
var tCount      = 0; 
var totalTrial  = 0; 
var progCount   = 0; 
var totalTokens = 0; 
var cdwn        = 3; 
var common      = null;
var odd         = null; 
var oddIdx      = null; 
var sequence    = null; 
var ans         = null; 
var timedout    = null; 
var key_press   = null; 
var rt          = null; 
var pcorrect    = null; 
var blockStartTime = null;
var goalReachedTime = null;
var blockBonus = 0;


// calculate how much time has passed since the block started
function blockElapsedTime() {
  if(blockStartTime === null) return 0;

  return Date.now() - blockStartTime;
}

// check whether the current block should end
function blockFinished() {

  // block ends when 60 correct responses are reached
  if(progCount >= length_list[bCount]) return true;

  // OR when the 90-second deadline is reached
  if(blockElapsedTime() >= block_time_limit) return true;

  return false;
}


var probe = {

  type: 'html-keyboard-response',

  on_start: function() {

    // use game layout only while the oddball task is being shown
    document.querySelector('.jspsych-display-element')
      .classList.add('game-active');

    // start the block timer when the first oddball appears
    if(blockStartTime === null) {
      blockStartTime = Date.now();
    }

    // make sure the game is visible from the very first trial
    document.querySelector('#jspsych-progressbar-container')
      .style.display = 'block';


    // make sure the game has been created
    setupGame();


    // show the correct starting progress / images
    updateGameProgress();

  },

  stimulus: function() {

    html = ''; 


    // 1. Sample sequence
    oddIdx = _.sample([0,1,2]); 

    common = _.sample(stim); //up or down

    odd = stim.filter(s => s!=common)[0]; 


    // 2. Create stim
    sequence = Array(3).fill(stimdir+'oddball_'+common+'.png'); 

    sequence[oddIdx] = stimdir+'oddball_'+odd+'.png'; 


    // 3. Determine correct answer and display stim in HTML format
    ans = keys[oddIdx]; 


    // Create the three oddball images
    html += '<div id="oddball-images">';

    for(let i=0; i<3; i++) {
      html += '<img class="oddball-image" src="' + sequence[i] + '">';
    }

    html += '</div>';

    return html;

  },

  on_load: function() {

    let oddballs = document.getElementById('oddball-images');
    let stimulusContainer = document.getElementById('oddball-stimuli');

    if(oddballs && stimulusContainer) {
      stimulusContainer.appendChild(oddballs);
    }

  },

  choices: debugmode ? [...keys, 'space'] : keys,

  trial_duration: function() {

    // response duration cannot extend beyond the block time limit
    let remainingTime = block_time_limit - blockElapsedTime();

    return Math.max(1, Math.min(maxtime, remainingTime));

  },

  post_trial_gap: isi,


  on_finish: function(data){

    // remove oddballs from the game container after each trial
    let oddballs = document.getElementById('oddball-images');

    if(oddballs) {
      oddballs.remove();
    }

    if(data.key_press==null) {

      timedout  = true;

      key_press = null;

      rt        = null;

      accuracy  = 0;

    } else {

      key_press =
        jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(
          data.key_press
        );

      console.log(key_press);

      rt = data.rt;

      // SPACE counts as correct only in debug mode
      if(debugmode && key_press == 'space') {
        accuracy = 1;
      } else {
        accuracy = key_press==ans ? 1:0;
      }

    }

  }

};



var feedback_t = { //feedback trial

  type: 'html-keyboard-response',

  stimulus: function() {

    if(timedout)    return '<div style="font-size:75px;color:red">TOO SLOW!</div>'; 

    if(accuracy==0) return '<div style="font-size:75px;color:red">INCORRECT!</div>'; 

    if(accuracy==1) return ''; 

  },


  choices: ['space'],


  trial_duration: function(){

    if(timedout||accuracy==0) return errtime; 

    return 0; 

  }

};



var feedback_b = { //feedback block

  type: 'html-keyboard-response',

  on_start: function() {

    // return to normal layout for the feedback screen
    document.querySelector('.jspsych-display-element')
      .classList.remove('game-active');

    // hide the game
    document.querySelector('#jspsych-progressbar-container')
      .style.display = 'none';

  },

  stimulus: function() {

    // original reward rule: pcorrect must meet the 75% accuracy threshold
    // also require completing the goal within the 90-second limit
    let reachedGoalInTime = goalReachedTime !== null &&
      goalReachedTime <= block_time_limit;

    blockBonus = (reachedGoalInTime && pcorrect >= acc_crit)
      ? block_reward : 0;

    if(blockBonus > 0) {

      // SUCCESS: keep the completed scenario image
      html =
        '<div id="game-complete-screen">' +

          '<div id="game-complete-title">' +
            'Good job! You earned a $0.25 bonus!' +
          '</div>' +

          '<img id="game-complete-image" ' +
          'src="' + selectedScenarioAssets.completed + '">' +

          '<div id="game-complete-text">' +
            'Press SPACE to continue.' +
          '</div>' +

        '</div>';

    } else {

      // FAILURE: show only text, no image
      html =
        '<div id="game-complete-screen">' +

          '<div id="game-complete-title">' +
            'Too many mistakes! No reward this time.' +
          '</div>' +

          '<div id="game-complete-text">' +
            'Press SPACE to continue.' +
          '</div>' +

        '</div>';

    }

    return html;

  },

  choices: ['space'],

  on_finish: function() {

    // add the reward once and save a summary of this block
    totalTokens += blockBonus;

    let reason = (goalReachedTime === null || goalReachedTime > block_time_limit)
      ? 'time_limit' : (blockBonus > 0 ? 'goal_reached' : 'low_accuracy');

    jsPsych.data.write({
      isBlockSummary: true,
      block: bCount,
      scenario: selectedScenario,
      condition: condition_list[bCount],
      subgoal: subgoal_list[bCount],
      correct_responses: progCount,
      total_responses: tCount,
      block_accuracy: pcorrect,
      block_elapsed_ms: blockElapsedTime(),
      goal_reached_ms: goalReachedTime,
      block_outcome: blockBonus > 0 ? 'success' : 'failure',
      block_end_reason: reason,
      bonus_earned: blockBonus,
      total_bonus: totalTokens
    });

  }

};


var saveandUpdateData = {

  type: 'html-keyboard-response',

  stimulus: '',

  trial_duration: 0,


  on_finish: function(data) {

    data.isDataTrial   = true; // helpful for parsing

    data.block         = bCount;

    data.blocklen      = length_list[bCount];

    data.trialinblock  = tCount;

    data.trial         = totalTrial;

    data.progress      = progCount/data.blocklen;

    data.condition     = condition_list[bCount];

    data.subgoal       = subgoal_list[bCount];

    data.block_elapsed_ms = blockElapsedTime();

    data.running_accuracy = (progCount + accuracy) / (tCount + 1);

    //data.reward        = reward_list[bCount];

    data.common        = common; 

    data.odd           = odd;  

    data.oddidx        = oddIdx;

    data.correct_ans   = ans; 

    data.key_press     = key_press; 

    data.rt            = rt; 

    data.accuracy      = accuracy; 

    data.timedout      = timedout; 

    //data.totalTokens   = totalTokens; 

    data.timestamp     = Date.now(); 


    timedout = false; 

    tCount++;

    totalTrial++;


    // only increment progress if answer is correct 
    if(accuracy==1) progCount++; 

    // save when the 60th correct response reaches the goal
    if(progCount >= length_list[bCount] && goalReachedTime === null) {
      goalReachedTime = blockElapsedTime();
    }


    // update game and current character position
    updateGameProgress();


    pcorrect = progCount/tCount; 


    console.log(progCount);

  }

};



var show_countdown = {

  type: 'html-keyboard-response',

  stimulus: function() {

    html = '<div style="font-size:75px;">'+cdwn+'</div>'; 

    return html;

  },


  choices: jsPsych.NO_KEYS,

  trial_duration: 1000,


  on_finish: function() {

    cdwn -= 1; 

  }

};



var end = {

  type: 'html-keyboard-response',

  stimulus: function() {

    html  = "<p>You are done the experiment!</p>";

    html += '<p>You earned a <b>bonus</b> $'+totalTokens.toFixed(2) +'. Congratulations!</p>';

    html += "<p>Press SPACE to finish. Thank you so much!</p>";

    return html;

  },


  choices: ['space']

};
