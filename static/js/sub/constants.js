
var DEBUG = JSON.parse(tmp)[0]['DEBUG']; 

const debugmode     = DEBUG=='true'? true:false;                       // whether to skip instructions + practice (for debugging) 
const tpb           = debugmode ? [60]:[60];                           // correct responses needed per block to finish
const block_reward  = 0.25;                                             // reward for successfully completing a block
const acc_crit      = 0.75;                                                 // minimum accuracy required
const block_time_limit = 90000;                                        // 1 minute 30 seconds in milliseconds
const adapt_time    = false                                            // adaptive deadlines or not, UNSURE PURPOSE
const adapt_quant   = 0.70                                             // if adapative deadlines, what quantile of baseline RTs to use, UNSURE PURPOSE

const nblocks       = debugmode ? 3:2; // match the two active debug conditions
const nprac         = 5;
const stimdir       = 'static/images/'                                 // stimulus directory
const stim          = ['up','down'];                                   // direction of oddball 
const fontsize      = '100px';                                         // font size
const keys          = ['q','w','e'];                                   // keys to press                                       // P(correct) needed to get points, REMOVE?
//const rewtime       = 2500;                                          // time that rewards stay on screen, UNSURE PURPOSE
const rewiti        = 1000;                                            // time for feedback task to task
const errtime       = 1500;                                            // error or timeout message duration (in ms.)
var   maxtime       = debugmode ? 7500:750;                            //change back to 750!!!!!! // max response deadline (if !adapt_time)
var   isi           = 100;                                             // short isi to avoid "glitch" feel


//var reward_list   = []; 
var length_list    = []; 
var condition_list = []; 
var subgoal_list   = [];                                                // randomly placed subgoal for each block


// possible game scenarios
const scenarios = [
  //"knight",
  //"diver",
  "explorer"
];


// image assets for each game scenario
const scenarioAssets = {

  knight: {
    background: "static/images/background-knight.png",

    characterWithSubgoal: "static/images/knight-sword.png",

    characterNoSubgoal: "static/images/knight.png",

    subgoal: "static/images/sword.png",

    goal: "static/images/dragon.png",

    completed: "static/images/knight-dragon-defeated.png"
  },

  diver: {
    background: "static/images/background-diver.png",

    characterWithSubgoal: "static/images/diver-tank.png",

    characterNoSubgoal: "static/images/diver.png",

    subgoal: "static/images/tank.png",

    goal: "static/images/submarine.png",

    completed: "static/images/diver-in-submarine.png"
  },

  explorer: {
    background: "static/images/background-explorer.png",

    characterWithSubgoal: "static/images/explorer-key.png",

    characterNoSubgoal: "static/images/explorer.png",

    subgoal: "static/images/key.png",

    goal: "static/images/treasure.png",

    completed: "static/images/explorer-treasure.png"
  }

};


// create the list of block conditions
// 5 no-subgoal blocks, 5 early-subgoal blocks and 5 late-subgoal blocks
if(debugmode) {

  // in debug mode, run one of each condition
  condition_list = [
    "no_subgoal",
    "early",
    "late"
  ];

} else {

  condition_list = [
    ...Array(5).fill("no_subgoal"),
    ...Array(5).fill("early"),
    ...Array(5).fill("late")
  ];
}


// randomize the order of the block conditions for each participant
condition_list = _.shuffle(condition_list);


// create block information
for(let block = 0; block < nblocks; block++) {

  // only one block length for now
  length_list.push(tpb[0]); 

  // reward_list.push(rewards[0]);


  // no-subgoal condition has no sword position
  if(condition_list[block] == "no_subgoal") {

    subgoal_list.push(null);

  }


  // randomly place early subgoal between 20% and 40% of the block
  else if(condition_list[block] == "early") {

    // subgoal is an integer number of correct responses so that
    // the participant can land exactly on the subgoal

    let min_subgoal = Math.ceil(tpb[0] * 0.20);
    let max_subgoal = Math.floor(tpb[0] * 0.40);

    let subgoal = Math.floor(
      Math.random() * (max_subgoal - min_subgoal + 1)
    ) + min_subgoal;

    subgoal_list.push(subgoal);

  }


  // randomly place late subgoal between 60% and 80% of the block
  else if(condition_list[block] == "late") {

    // subgoal is an integer number of correct responses so that
    // the participant can land exactly on the subgoal

    let min_subgoal = Math.ceil(tpb[0] * 0.60);
    let max_subgoal = Math.floor(tpb[0] * 0.80);

    let subgoal = Math.floor(
      Math.random() * (max_subgoal - min_subgoal + 1)
    ) + min_subgoal;

    subgoal_list.push(subgoal);

  }

}


// check block information
console.log(length_list);
//console.log(reward_list);
console.log(condition_list);
console.log(subgoal_list);


// used if adapt_time is true
function Quartile(data, q) { // calculate the q-th quantile of a data set
  data=Array_Sort_Numbers(data);
  var pos = ((data.length) - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if( (data[base+1]!==undefined) ) {
    return data[base] + rest * (data[base+1] - data[base]);
  } else {
    return data[base];
  }
}


function Array_Sort_Numbers(inputarray){ // sort array of numbers in ascending order
  return inputarray.sort(function(a, b) {
    return a - b;
  });
}
