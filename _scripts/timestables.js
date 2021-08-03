// timer variables
var timeLimit = 10;
var cntr = timeLimit;
var stopwatchstart = 0;
var stopwatch = 0;
var stopwatchmins = 0;
var stopwatchsecs = 0;

// scoreboard variables
var scoreBoardWidth = 800;
var numberRows = 2;
var numberColumns = 10;
var scoreCellDimensions = scoreBoardWidth/numberColumns;
var scoreBoardHeight = numberRows*scoreCellDimensions;
var totalscores;
var tally; // do i need to declare this variable if it is used in only one other funtion?
var tracker = [];
var startingScore = 2;
var ipos = 0;
var jpos = 0;

// question variables
var randomlad;
var num1 = 0; // initial number to add or take from
var num2 = 1; // amount by which you want to add or subtract
var answer = 0;
var timeOutVar;
var opperator = ""


// run at start button
function tt_btn() {

	// 1 - initialise tracker array scores
		for(let i = 0; i < numberRows; i++) {
			tracker[i] = [];
			for(let j = 0; j < numberColumns; j++) {
				tracker[i][j] = startingScore;
			}
		}

	// 2 - set up html
	d3.select("#buildArea").html("");
	d3.select("#buildArea").append("p").text("GO!").attr("id", "timer");
	d3.select("#buildArea").append("p").attr("id", "question");
	d3.select("#buildArea").append("input").attr("id", "answer").attr("size",3);
	d3.select("#buildArea").append("div").attr("id", "scoreboardcontainer");

	// 3 - build a score board
	build();			

	// 4 -  kick it off
	askQuestion();
	stopwatchstart = Date.now();

	// 5 - add listener to answer input
		d3.select("#answer").on("keydown", function() {
    	if (d3.event.keyCode === 13) {
        	checkAnswer();
    	}
	});
}

// question function
function askQuestion() {

	// sum the contents of the tracker
	totalscores = 0;
	for (var i = 0; i < numberRows; i++) {
		for (var j = 0; j < numberColumns; j++)  {
    		totalscores = totalscores + tracker[i][j];
		}
	}

	// condition if tracker completed
	if (totalscores == 0) {
		stopwatch = (Date.now() - stopwatchstart)/1000;
		stopwatchmins = Math.floor(stopwatch / 60);
		stopwatchsecs = Math.floor(stopwatch - stopwatchmins * 60);
		d3.select("#timer").text("You did it in " + stopwatchmins + " minutes and " + stopwatchsecs + " seconds!");
		d3.select("#question").remove();
		d3.select("#answer").remove();
		d3.select("scoreboardcontainer").remove();
		d3.select("svg").remove();

	// condition if tracker not completed	
	} else {
		myStopFunction();	//stop the current timer
		cntr = timeLimit;	//reset timer
		countDown(cntr);	// call count down
		randomlad = Math.random(); // generate a random number to pick a question
		tally = 0;

		// start adding up until you reach randomlad to find question
		for (var i = 0; i < numberRows; i++) {
			for (var j = 0; j < numberColumns; j++)  {
				tally = tally + tracker[i][j]/totalscores;
	    		num1 = (j+1)*10;
				ipos = i;
				jpos = j;
				// if you get to the question stop
				if (tally > randomlad) {break;}	    
			}
			ipos = i;
			jpos = j;
			// if you get to the question stop
	    	if (tally > randomlad) {break;}
		}


		if (ipos == 0) {
			opperator = " + ";
			correctANS = num1 + num2;
		} else {
			opperator = " - "
			correctANS = num1 - num2;
		}

		d3.select("#question").text(num1 + opperator + num2);
		d3.select("#answer").node().focus();
	
	}

}


// check answer
function checkAnswer() {
	myStopFunction();	//stop the current timer
	answer = d3.select("#answer").property("value");

	if (answer == correctANS && d3.select("#timer").text() == "Answer = " + correctANS)	{
		tracker[ipos][jpos] = tracker[ipos][jpos] + 4;
		d3.select("#timer").text("Go!");
		askQuestion();
	}
	else if (answer == correctANS) {
		// update scoreboard
		tracker[ipos][jpos] = tracker[ipos][jpos] - 2;
		d3.select("#timer").text("Go!");
		askQuestion();
	} else {
		// update scoreboard
		tracker[ipos][jpos] = tracker[ipos][jpos] + 4;
		d3.select("#timer").text("Answer = " + correctANS);
	}

	// clear input
	document.getElementById("answer").value = "";
	build();

}

// count down timer funtion
function countDown(cntr) {
 	timeOutVar = setTimeout(function() {
    	d3.select("#timer").text(cntr);          
    	if (cntr-- > 0) {
    		countDown(cntr);
    	} else {
    		d3.select("#timer").text("Answer = " + correctANS);
    	}
	}, 1000)
}

// ender function for timer function as it has to run simultaneously
function myStopFunction() {
  clearTimeout(timeOutVar);
}



// scoreboard builder function
function build() {
	d3.select("svg").remove();
	// create SVG element:
	var svg = d3.select("#scoreboardcontainer").append("svg").attr("width", scoreBoardWidth + "px").attr("height", scoreBoardHeight + "px");
	var i=0;
	// rows
	while (i < numberRows) {
		var j=0;
		while (j < numberColumns) {
		
			if (tracker[i][j]==0) {
				getcolour = 'green';
			} else if (tracker[i][j]==2) {
				getcolour = 'orange';
			} else {
				getcolour = 'red';
			}


			svg.append('rect')
				.attr('x', j*scoreCellDimensions)
		.attr('y', i*scoreCellDimensions)
		.attr('width', scoreCellDimensions)
		.attr('height', scoreCellDimensions)
		.attr('stroke', 'black')
				.attr('fill', getcolour);
			j++;
		};
		i++;
	}
}