
// Miscelaneous preperation stuff
const filename = 'oddball_' + JSON.parse(tmp)[0]['ID'] + '_' + Date() + '.csv'; 

// randomly select one game scenario for the entire experiment
const selectedScenario =
  jsPsych.randomization.sampleWithoutReplacement(scenarios, 1)[0];

// get the image assets for the selected scenario
const selectedScenarioAssets =
  scenarioAssets[selectedScenario];

// let CSS apply the settings for the selected game scenario
// use <html> so both the game and completed block screen inherit them
document.documentElement.setAttribute('data-game-scenario', selectedScenario);

jsPsych.data.addProperties({
  subject: JSON.parse(tmp)[0]['ID'],
  age: JSON.parse(tmp)[0]['AGE'], 
  sex: JSON.parse(tmp)[0]['SEX'],
  date: Date.now(),

  scenario: selectedScenario
});

console.log("Available scenarios:", scenarios);
console.log("Selected scenario:", selectedScenario);
console.log("Selected assets:", selectedScenarioAssets);

var fs = {

  type: 'fullscreen', 

  fullscreen_mode: true,

  on_start: function(){

    // set up task appearence
    document.body.style.background = "black";

    document.body.style.color = 'white';

    document.querySelector('#jspsych-progressbar-container').style.display = 'none';

    document.querySelector('#jspsych-progressbar-container').style.background = 'black'; 

    document.querySelector('#jspsych-progressbar-container').style.border = 'black'; 

    document.querySelector('#jspsych-progressbar-outer').style.height = '25px'; 

  }, 

};


// preload oddball, game and instruction images
img_preload = [
  'static/images/oddball_up.png',
  'static/images/oddball_down.png',

  // old progress bar images
  //'static/images/current.png',
  //'static/images/subgoal.png',
  //'static/images/goal.png',

  // selected game scenario images
  selectedScenarioAssets.background,
  selectedScenarioAssets.characterWithSubgoal,
  selectedScenarioAssets.characterNoSubgoal,
  selectedScenarioAssets.subgoal,
  selectedScenarioAssets.goal,
  selectedScenarioAssets.completed
];


for(let i=1; i<15; i++) {

  img_preload.push(
    'static/images/instructions-' + selectedScenario + '/Slide' + i + '.jpg'
  );
}

// Repeat instructions and practice until all quiz answers are correct
var instructionCheckLoop = {

  timeline: [
    instructions1,
    practice,
    instructions2,
    inst_quiz,

    {
      timeline: [instructionFailureMessage],

      conditional_function: function() {
        return totalInstQ !== 5;
      }
    }
  ],

  loop_function: function() {

    // Passed: all 5 answers correct
    if(totalInstQ === 5) {

      jsPsych.data.addProperties({
        instruction_repeats: instructionRepeats
      });

      return false;
    }

    // Failed: increment repetition counter
    instructionRepeats++;

    // Restart instruction slides
    instIdx = 1;

    // Restart practice trials
    pracCount = 0;

    return true;
  }
};


// Setup Timeline
if(debugmode) {

  // timeline = [fs, blocks, task2Q, demographics, debrief_questions, DASS21, BISBAS, NFC, end];

  timeline = [fs, blocks, task2Q, end];

} else {

  timeline = [
    //fs,
    //instructionCheckLoop,
    //instructions3,
    //blocks,
    task2Q,
    debrief,
    demographics,
    debrief_questions,
    end
  ];

  //timeline = [fs, consent, instructions1, practice, instructions2, inst_quiz, instructions3, blocks, task2Q, demographics, debrief_questions, DASS21, BISBAS, NFC, end];

  //timeline = [fs, instructions1, practice, instructions2, inst_quiz, instructions3, blocks, task2Q, debrief, demographics, debrief_questions, end];

  //timeline = [fs, blocks, task2Q, demographics, debrief_questions, end];

  //timeline = [fs, task2Q, debrief, debrief_questions, end];

  //timeline = [fs, blocks, task2Q, end];

}


// Run and preload images
jsPsych.init({

  timeline: timeline,

  show_preload_progress_bar: true,

  preload_images: img_preload,  

  show_progress_bar: true, 

  on_finish: function() {

    jsPsych.data.get().localSave('csv', filename); 

    window.close();

  }

});


console.log(subgoal_list);
