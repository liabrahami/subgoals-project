var debrief = {
  type: 'html-keyboard-response',
  stimulus: `
    <div id="debriefingtext" style="max-width:900px; margin:0 auto; text-align:left; line-height:1.4;">
      <h1>Debriefing</h1>

      <p>Thank you for your participation in our study! Your anonymous data makes an
      important contribution to our understanding of cognitive effort.</p>

      <p><b>Background:</b> Research within the intersection of motivation and cognitive 
      processes has suggested that proximation to a goal is a strong motivator of mental 
      effort expenditure, especially when the distance to the goal is easily visualizable. 
      In other words, people tend to increase their cognitive effort when they see they 
      are closer to the goal, as progress diminishes the distance remaining more importantly 
      when the distance is shorter rather than longer. While this effect, the goal gradient 
      effect, has been well documented, less is known about the influence of a manipulated, 
      untrustworthy perceived progress on cognitive effort. Thus, this study aimed to 
      investigate how different modulations of perceived progress influence the cognitive 
      effort exerted.</p>

      <p><b>Design:</b> You were asked to complete an odd-one-out task, while a progress bar 
      indicating your distance to the goal was presented to you. This progress bar was either 
      “concave”, which fills up fast at first and slow towards the end, “convex”, which fills 
      up slow at first and fast towards the end, or “linear”, which fills up in a uniform 
      manner, indicating true progress.</p>

      <p><b>Hypotheses:</b> We hypothesize that participants presented to a “concave” or 
      “convex” progress bar receive a boost of motivation during the fast parts of the 
      progress bar, and a drop during the slow parts, which would be translated in their 
      behavior indicating the cognitive effort spent. Participants being presented to a 
      “linear” progress bar will demonstrate classic goal gradient effect.</p>

      <p>This is basic research in psychology. We were not testing or evaluating you. 
      Our interest lies in subjects as a group. You will remain completely anonymous in 
      all our reports. If you have any further questions about this research, please do not 
      hesitate to contact either one of the principal investigators or one of the experimenters. 
      If you have any questions or concerns regarding your rights or welfare as a participant 
      in this research study, please contact the McGill Ethics Manager at 514-398-6831 or 
      lynda.mcneil@mcgill.ca</p>

      <p>If you have any questions about this research, you may contact the
      principal investigator, Lia Brahami (lia.brahami@mail.mcgill.ca). If you wish
      to have this debrief form sent to you, please request it upon the researcher 
      accompanying you today.</p>

      <p>For further reading on similar issues, you may want to consult these articles:</p>

      <p>Devine, S., Roy, M., Beierholm, U., & Otto, A. R. (2024). Proximity to rewards 
      modulates parameters of effortful control exertion. <i>Journal of Experimental 
      Psychology General</i>, 153(5), 1257–1267.</p>

      <p>Bonezzi, A., Brendl, C. M., & De Angelis, M. (2011). Stuck in the middle. 
      <i>Psychological Science</i>, 22(5), 607–612.</p>

      <p>Kivetz, R., Urminsky, O., & Zheng, Y. (2006). The Goal-Gradient hypothesis 
      resurrected: purchase acceleration, illusionary goal progress, and customer 
      retention. <i>Journal of Marketing Research</i>, 43(1), 39–58.</p>

      <p>Thank you very much for participating.</p>

      <p style="margin-top:2em; text-align:center; font-weight:bold;">
        Press the SPACEBAR to continue.
      </p>
    </div>
  `,
  choices: ['space'], // spacebar only
  on_start: function() {
    document.body.style.background = "white";
    document.body.style.color = "black";
  },
  on_finish: function() {
    jsPsych.data.addProperties({ debrief_shown: true });
  }
};