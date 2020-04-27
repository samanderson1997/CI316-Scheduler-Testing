
/**********************************************************************************************************************/
/*********************************************** PROCEDURAL CALLS *****************************************************/
/**********************************************************************************************************************/

// Initialise the calendar
var currentDate = "09-23-2019"; // = new Date(); will set to current date
var cd = new Date(currentDate); // TODO: Update to the real current date when system is done
//var currentDate = stringBuilder(cd); // TODO: Replaces occurrences of currentDate with this when the system is using the real date and not a dummy one

// On-screen Calendar Initialisation
scheduler.config.first_hour = 0;
scheduler.config.last_hour = 24;
scheduler.config.collision_limit = 1;
scheduler.init('scheduler_here', new Date(currentDate), "week"); // Starts at the start of term

const ms_day = (24*(60*60*1000)); // Used to add days
var evt_count = 0;

// Global variable updated with completed subject names and total hours, then queried by the schedulingReport later on.
var completedSubjects = [];
var decrementedQuotas = false;
var decrementedAssignments = [];

// Set up the scheduler and on-screen content
testSuite(); // For testing
//setup(); // Checks for GET request with schedule instructions

/**********************************************************************************************************************/
/********************************************** SETUP FUNCTIONALITY ***************************************************/
/**********************************************************************************************************************/

// Decide what to do on the opening of this page
function setup() {
  // Query attributes
  const url = new URL(window.location.href);
  var query = checkGetRequest(url);

  testSuite();

  // TODO: Add checks for if no modules found
  var _assignments = []; // Actual thing - needs to be made a carbon copy of the database
  _assignments = populateAssignmentsArray(); // First operation; create and return a carbon copy of the user's modules db table
  var sch_plan = {}; // The test plan to be analysed for daily start times, mode, etc.

  if(query) { // They were sent here by the Schedule.html page
    sch_plan = generateSchedulePlan(url);
    //_assignments = populateAssignmentsArray(); // Run checks to make sure that DB entries exist
    //work_planner(test_assignments, sch_plan); // TODO: Switch to the following: work_planner(_assignments, sch_plan);

  } else { // They were not sent here from the scheduler page. They are either logging in or first time here
      var success = loadCalendar();
      if(success === false) { // It's their first time here
        testSuite(); // TODO: This is just a test
        //alert("No saved schedule found. Would you like to create one now?");
      }
  }
}

// Check to see if parameters exist in the URL
function checkGetRequest(url) {
  let urlx = url.toString();
  return urlx.indexOf("&") > -1;
}

/**********************************************************************************************************************/
/***************************************************** TESTING ********************************************************/
/**********************************************************************************************************************/

// Test function for testing different parts of the scheduler with dummy data
function testSuite() {
  var boundaryTest = false;

  // Write a test query here
  describe("maths", 2, "17:00", "23:59", "off", false, 0);

  function describe(subject, mode, start, finish, weekends, boundaries, type) {
    if(boundaries) { boundaryTest = true; }

    if(subject === "business") {
      $business_schedule(start, finish, weekends, mode, type);
    } else if(subject === "psychology") {
      $psychology_schedule(start, finish, weekends, mode, type);
    } else if(subject === "computer science") {
      $comp_schedule(start, finish, weekends, mode, type);
    } else if(subject === "maths") {
      $maths_schedule(start, finish, weekends, mode, type);
    } else if(subject === "product design") {
      $product_design_schedule(start, finish, weekends, mode, type);
    }

  }

  /************ DEFAULT FUNCTIONS *************/
  function setUp(start, finish, weekends, mode, course) {
    var plan = {
      mode: mode,
      startTime: start,
      endTime: finish,
      weekends: weekends // If "off", Saturday and Sunday will be skipped and the available hours will decrease
    };

    let assignments = $getAssignments(course); // Fresh set of data each time

    return {
      plan: plan,
      assignments: assignments
    };
  }
  function tearDown() {
    // Nothing goes here because no functionality needed
    checkUtilisation();
    function checkUtilisation() {
      let report = "";
      for(let i=0; i<completedSubjects.length; i++) {
        let pass = completedSubjects[i].success;
        let str;
        if(pass) {
          str = completedSubjects[i].moduleName + ": COMPLETED " + "\n";
        } else {
          str = completedSubjects[i].moduleName + ": FAILED " + "\n";
        }
        report += str;
      }
      //alert(report);
    }
  }

  /***************** DATA *********************/
  function $getAssignments(course) {
    // Test Case Data
    var business_assignments = [
      m1 = {
        moduleCode: "BS305",
        moduleName: "1st Semester Corporate Finance",
        quota: 100,
        color: "Green",
        type: "E",
        dueDate: "2020-01-29"
      },
      m2 = {
        moduleCode: "BS305",
        moduleName: "2nd Semester Corporate Finance",
        quota: 100,
        color: "Green",
        type: "E",
        dueDate: "2020-05-22"
      },
      m3 = {
        moduleCode: "BS301",
        moduleName: "Dissertation",
        quota: 50,
        color: "Black",
        type: "A",
        dueDate: "2019-10-31"
      },
      m4 = {
        moduleCode: "BS307",
        moduleName: "International Finance",
        quota: 200,
        color: "Blue",
        type: "A",
        dueDate: "2020-05-05"
      },
      m5={
        moduleCode: "BS311",
        moduleName: "Managing & Developing People",
        quota: 60,
        color: "Orange",
        type: "A",
        dueDate: "2020-03-30"
      },
      m6={
        moduleCode: "BS315",
        moduleName: "Consumer Psychology",
        quota: 200,
        color: "Purple",
        type: "A",
        dueDate: "2020-04-04"
      },
      m7={
        moduleCode: "BS320",
        moduleName: "Assignment: Business Strategy",
        quota: 60,
        color: "Brown",
        type: "A",
        dueDate: "2020-03-25"
      },
      m8={
        moduleCode: "BS320",
        moduleName: "Exam: Business Strategy",
        quota: 140,
        color: "Purple",
        type: "E",
        dueDate: "2020-05-15"
      }

    ];
    var psychology_assignments = [
      m1 = {
        moduleCode: "SS603",
        moduleName: "Dissertation",
        quota: 400,
        color: "Black",
        type: "A",
        dueDate: "2020-04-21"
      },
      m2 = {
        moduleCode: "SS605",
        moduleName: "1 Sociology",
        quota: 200,
        color: "Orange",
        type: "A",
        dueDate: "2020-01-25"
      },
      m3 = {
        moduleCode: "SS606",
        moduleName: "Cyberpsychology",
        quota: 200,
        color: "Purple",
        type: "A",
        dueDate: "2020-05-01"
      },
      m4 = {
        moduleCode: "SS611",
        moduleName: "2 Sociology",
        quota: 200,
        color: "Black",
        type: "A",
        dueDate: "2020-05-21"
      },
      m5 = {
        moduleCode: "SS618",
        moduleName: "Critical Community Psychology",
        quota: 100,
        color: "Red",
        type: "A",
        dueDate: "2020-01-21"
      },
      m6 = {
        moduleCode: "SS618",
        moduleName: "Exam: Critical Community Psychology",
        quota: 100,
        color: "Red",
        type: "E",
        dueDate: "2020-05-22"
      }
    ];
    var product_design_assignments = [
      m1 = {
        moduleCode: "PD301",
        moduleName: "Main Project",
        quota: 400,
        color: "Black",
        type: "A",
        dueDate: "2020-05-20"
      },
      m2 = {
        moduleCode: "PD303",
        moduleName: "Pathways",
        quota: 400,
        color: "Green",
        type: "A",
        dueDate: "2020-03-20"
      },
      m3 = {
        moduleCode: "PD305",
        moduleName: "Project: Tech",
        quota: 200,
        color: "Blue",
        type: "A",
        dueDate: "2020-01-31"
      },
      m4 = {
        moduleCode: "PD305",
        moduleName: "Report: Tech",
        quota: 100,
        color: "Blue",
        type: "A",
        dueDate: "2020-05-05"
      }
    ];
    var mathematics_assignments = [
      m1 = {
        moduleCode: "MM602",
        moduleName: "Mathematics of Finance",
        quota: 200,
        color: "Blue",
        type: "E",
        dueDate: "2020-05-22"
      },
      m2 = {
        moduleCode: "MM605",
        moduleName: "Maths Education Experience",
        quota: 200,
        color: "Red",
        type: "A",
        dueDate: "2020-04-25"
      },
      m3 = {
        moduleCode: "MM618",
        moduleName: "Time Series & Forecasting",
        quota: 200,
        color: "Grey",
        type: "A",
        dueDate: "2020-06-01"
      },
      m4 = {
        moduleCode: "MM640",
        moduleName: "Extended Mathematical Sciences Project",
        quota: 400,
        color: "Black",
        type: "A",
        dueDate: "2020-04-29"
      },
      m5 = {
        moduleCode: "MM607",
        moduleName: "Perspectives on Maths",
        quota: 200,
        color: "Purple",
        type: "A",
        dueDate: "2020-01-31"
      }
    ];
    var computer_science_assignments = [
      m1={
        moduleCode: "CI301",
        moduleName: "The Individual Project",
        quota: 400,
        color: "Black",
        type: "A",
        dueDate: "2020-05-20" },

      m2={ moduleCode: "CI360",
        moduleName: "Mobile App Development",
        quota: 200,
        color: "Green",
        type: "A",
        dueDate: "2020-05-01"},

      m3={ moduleCode: "CI315",
        moduleName: "Design Patterns",
        quota: 100,
        color: "Orange",
        type: "E", // Type: Exam
        dueDate: "2020-01-28"},

      m4={ moduleCode: "CI315",
        moduleName: "Software Architecture",
        quota: 100,
        color: "Brown",
        type: "E",
        dueDate: "2020-06-01" },

      m5={ moduleCode: "CI312",
        moduleName: "Computer Graphics Algorithms",
        quota: 100,
        color: "Purple",
        type: "A",
        dueDate: "2019-12-12"
      },

      m6={ moduleCode: "CI316",
        moduleName: "Software Validation",
        quota: 100,
        color: "Blue",
        type: "A",
        dueDate: "2020-05-02"
      },

      m7= { moduleCode: "CI346",
        moduleName: "Programming Languages",
        quota: 100,
        color: "Gray",
        type: "A",
        dueDate: "2020-01-17"
      },

      m8 = { moduleCode: "CI346",
        moduleName: "Concurrency & Client Server Computing",
        quota: 100,
        color: "Gray",
        type: "E",
        dueDate: "2020-05-22"
      }
    ];

    let assignments = []; // Actual array, created from scratch at each execution

    if(course === "business") {
      assignments = business_assignments;
    } else if(course === "psychology") {
      assignments = psychology_assignments;
    } else if(course === "computer science") {
      assignments = computer_science_assignments;
    } else if(course === "maths") {
      assignments = mathematics_assignments;
    } else if(course === "product design") {
      assignments = product_design_assignments;
    }

    return assignments;
  }

  /***************************** TEST SCENARIOS ******************************/

  // Business & Finance
  function $business_schedule(start, finish, weekends, mode, type) {
    let bundle = setUp(start, finish, weekends, mode, "business");
    if(boundaryTest) { setBoundaryTest(bundle.assignments, bundle.plan, type) }
    work_planner(bundle.assignments, bundle.plan);
    tearDown();
  }

  // Psychology
  function $psychology_schedule(start, finish, weekends, mode, type) {
    let bundle = setUp(start, finish, weekends, mode, "psychology");
    if(boundaryTest) { setBoundaryTest(bundle.assignments, bundle.plan, type) }
    work_planner(bundle.assignments, bundle.plan);
    tearDown();
  }

  // Maths
  function $maths_schedule(start, finish, weekends, mode, type) {
    let bundle = setUp(start, finish, weekends, mode, "maths");
    if(boundaryTest) { setBoundaryTest(bundle.assignments, bundle.plan, type) }
    work_planner(bundle.assignments, bundle.plan);
    tearDown();
  }

  // Computer Science
  function $comp_schedule(start, finish, weekends, mode, type) {
    let bundle = setUp(start, finish, weekends, mode, "computer science");
    if(boundaryTest) { setBoundaryTest(bundle.assignments, bundle.plan, type) }
    work_planner(bundle.assignments, bundle.plan);
    tearDown();
  }

  // Product Design
  function $product_design_schedule(start, finish, weekends, mode, type) {
    let bundle = setUp(start, finish, weekends, mode, "product design");
    if(boundaryTest) { setBoundaryTest(bundle.assignments, bundle.plan, type) }
    work_planner(bundle.assignments, bundle.plan);
    tearDown();
  }

  // BOUNDARY TESTING
  function setBoundaryTest(assignments, plan, type) {
    if (type === 1) {
      testWithLowerCap(assignments, plan);
    } else if (type === 2) {
      testWithInfeasibleWorkload(assignments);
    } else {
      // Do nothing
    }
  }

  function testWithLowerCap(assignments, plan) {
    let startTime = plan.startTime.substring(0,2);
    let finishTime = plan.endTime.substring(0,2);
    startTime++; startTime++; finishTime--; // Lose three hours
    let t1 = startTime+":00"; let t2 = finishTime+":00";
    plan.startTime = t1; plan.endTime = t2;
  }
  function testWithInfeasibleWorkload(assignments) {
    assignments.forEach(function(e) {
      e.quota = e.quota*2;  // Double all quotas
    });
  }

  // ASSERTIONS
  function equal(a, b, c) {
    return a + b === c;
  }

}

/**********************************************************************************************************************/
/********************************************** ON-SCREEN CONTENT *****************************************************/
/**********************************************************************************************************************/

// Populates a scheduling report in the top cell
function populateSchedulingReport(assignments) {

  // Assign the original quota to the completed assignments array so it can be sorted
  for(let i=0; i<completedSubjects.length; i++) {
    let pos = getAssignmentByName(assignments, completedSubjects[i].moduleName);
    completedSubjects[i].quota = assignments[pos].quota;
  }

  // Sort by highest workload
  completedSubjects = sortByWorkload(completedSubjects, 1);

  // Create on-screen information for each subject
  for(let i=0; i<completedSubjects.length; i++) {
    let name = completedSubjects[i].moduleName;
    let pos = getAssignmentByName(assignments, name);

    // Utilisation: util / target hours (e.g. 185hrs / 200hrs)
    let util = completedSubjects[i].utilisation;
    let targetHours = assignments[pos].quota;

    // Set display name
    var header = name;
    if(name.length > 20) {
      header = name.substring(0, 20) + "...";
    } else {
      header += ":  ";
    }

    // Set on screen with corresponding colour and attributes
    var utilisation = util + "/" + targetHours;
    if(util < (targetHours*0.75)) {
      $("#report").append('<h6 class="reportTxtFailure util_box">'+header+utilisation+'</h6>');
    } else if (util < targetHours) {
      $("#report").append('<h6 class="reportTxtWarning util_box">'+header+utilisation+'</h6>');
    } else if(util === targetHours) {
      $("#report").append('<h6 class="reportTxtSuccess util_box">'+header+utilisation+'</h6>');
    } else {
      $("#report").append('<h6 class="reportTxtSuccess util_box">'+header+targetHours+'/'+targetHours+'</h6>');
    }
  }

}

// Populate sidebar filters- takes unaltered assignments as a param meaning it needs to be called in the proper sequence in order to work
function populateFilters(assignments) {

  var subjects = []; // Needed to correspond to events

  // Get the names of each module for display labels and shorten them to fit on-screen
  assignments.forEach(function(assignment) {
    let subject = assignment.moduleName.substring(0, 20) + "...";
    subjects.push(subject);
  });

  // Populate the cell with corresponding checkboxes
  for(let i=0; i<assignments.length; i++) {
    let temp_ID = assignments[i].moduleCode + assignments[i].moduleName.substring(0,1); // Create a temporary unique identifier

    // Create the checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "cb_"+temp_ID;
    checkbox.value = temp_ID;
    checkbox.id = temp_ID;
    checkbox.checked = true;

    // Add the associated listener to each box
    checkbox.addEventListener("change", function() {
      if(checkbox.checked) {
        showStudySessionGroup(checkbox.value, 1, assignments);
        checkbox.checked = true;
      } else {
        showStudySessionGroup(checkbox.value, -1, assignments);
        checkbox.checked = false;
      }
    });

    // Create the label
    var label = document.createElement("label");
    label.htmlFor = temp_ID;
    label.appendChild(document.createTextNode(subjects[i]));
    label.classList.add("modLbl");

    // Create the element to be placed on-screen
    var comb = document.createElement("div");
    comb.className = "filter_item";
    comb.appendChild(checkbox);
    comb.appendChild(label);

    // Add the element to the sidebar cell
    var calendarFilters = document.getElementById("calendar_filters");
    calendarFilters.appendChild(comb);
  }
}

// Get the next three deadlines and make a countdown to them in the bottom corner
function populateCountdown(assignments) {

  // If there are assignments saved
  if(assignments !== []) {
    assignments = sortByDeadline(assignments, -1); // Sort by soonest
    var added = 0; // Used for keeping track

    // Iterating three times to get the three soonest deadlines
    for(let i=0; i<assignments.length; i++) {
      let dueDate = new Date(assignments[i].dueDate);
      let daysUntil = Math.round(getDaysUntilDeadline(assignments[i].dueDate, cd));

      // If the due date in ms is greater than today's date in ms
      if(dueDate.getTime() > cd.getTime()) {
        let obj = { // Use an object for jQuery convenience
          title: assignments[i].moduleName,
          timeLeft: daysUntil
        };
        $("#countdown_section").append('<h6 class="pb_text">' + obj.title + '</h6><div class="countdown_box"><h5 class="cd_text">' + obj.timeLeft + ' days remaining</h5></div>');
        added++;
        if(added >= 3) { break; } // Break once three have been added
      }
    }

    // No countdowns were added
    if(added === 0) { $("#countdown_section").append('<h6 class="pb_text">No upcoming deadlines</h6>') }

  } else { // Assignments is empty
    $("#countdown_section").append('<h6 class="pb_text">No modules found</h6>');
  }

}

// Populate the footer with the event notes from the event clicked.
function populateEventNotes() {

  // jQuery event listener for when an event is clicked.
  $('.dhx_cal_event').on('click', function() {
    scheduler.attachEvent("onClick", function(id,ev){
      let event = scheduler.getEvent(id);
      // On click of an event e
      function populateFooter(e) {
        let eventNotes = document.getElementById("event_notes");
        let date = e.created;
        $(eventNotes).text(e.notes);
        $(eventNotes).append('<br>Created on ' + date + '</br>');
      }
      populateFooter(event); // Add the event's saved notes to the cell at the bottom of the screen
    });
  });
}

/**********************************************************************************************************************/
/********************************************* MAJOR FUNCTIONALITY ****************************************************/
/**********************************************************************************************************************/

/* ASSEMBLY OF SCHEDULER PARTS ****************************************************************************************/

// Main unit of functionality for scheduling with a given plan and list of assignments
function work_planner(assignments, scheduledPlan) {

  // Create a carbon copy of the assignments for sidebar content (to avoid destructive assignment)
  var cbc = [];
  assignments.forEach(function(e) {
    let cci = Object.assign({}, e);
    cbc.push(cci);
  });
  populateCountdown(cbc);  // Populate the on-screen content for the sidebar

  // Get the daily work slot, should be 6 or 8 hrs.
  var cap = getHourDifference(scheduledPlan.startTime, scheduledPlan.endTime, currentDate);

  // Work out the daily average amount of time required for each module based on its quota and time available
  var avgs = [];
  for(var i=0; i<assignments.length; i++) {
    var av = getDailyAverage(assignments[i], scheduledPlan.weekends);
    avgs.push(av); // For testing the daily total
  }
  let total = sumArrayValues(avgs); // Add up all the averages

  // Attach the daily averages and hours scheduled attribute to each subject
  for(let i=0; i<assignments.length; i++) {
    assignments[i].avg = avgs[i];
    assignments[i].hoursScheduled = 0; // Initialise value in the first iteration
  }

  // Determine scheduling method
  if(total < (cap-1)) { // all avgs fit into a single day - good, easy to fulfill
    scheduleByAvgs(assignments, scheduledPlan, cap, total);
  } else { // Subjects need refactoring in order to fit and make best use of time
    refactorStudy(assignments, scheduledPlan, cap, total);
  }

  // THE SCHEDULE HAS NOW BEEN GENERATED

  // With the schedule complete, populate the filters
  populateFilters(cbc);
  populateEventNotes();

  // Use the decremented quotas for the side bar if a decrement took place. Use the standard carbon copy if not.
  if(decrementedQuotas) {
    populateSchedulingReport(decrementedAssignments);
  } else {
    populateSchedulingReport(cbc);
  }

}

// Get the plan attributes for the schedule from the GET request contained in the URL (if there is one)
function generateSchedulePlan(url) {
  let plan = {};

  plan.startTime = url.searchParams.get("startTime");
  plan.endTime = url.searchParams.get("endTime");
  plan.weekends = url.searchParams.get("weekends");
  plan.mode = url.searchParams.get("balance");

  return plan;
}

/* SCHEDULING BY WORKLOAD *********************************************************************************************/

// If all the daily averages are less than the cap then good, it will be easy to plan all the desired hours
function scheduleByAvgs(assignments, scheduleDetails, cap, total) {
  const method_ID = 1; // Will be used by the break function later to determine how to add a break

  // Create the date object
  var date = new Date(currentDate + " " + scheduleDetails.startTime); // TODO: Change to cd date object when live

  assignments = sortByDeadline(assignments, 1); // Sort into a reasonable starting order
  var quotasComplete = false; // For keeping track of whether there is work still to be done

  // Runs while there are still subjects with hours left to plan
  while (quotasComplete === false) {

    // Run a batch job which schedules daily study for all the subjects, returns the date after processing.
    let dst = scheduleBatchSubjects(date, assignments, cap, total, scheduleDetails, method_ID); // Decrements quotas internally

    // Fix issues with daylight savings offset
    let nextDay = new Date(dst.getTime() + ms_day); // The finish time + the ms equivalent of a day
    let rDate = resetDate(nextDay); // Reset that day to remove the timestamp
    date = new Date(rDate + " " + scheduleDetails.startTime); // Update the current date to the new date + the plan's daily start time

    // Check to see if there's work to be done and reshuffle the array for variety
    quotasComplete = checkAllQuotas(assignments);
    assignments.reverse(); // Reverse the order for variety
  }
  alert("Scheduling complete.");
}

// If daily averages combined exceed the daily cap, then study needs to be refactored into the calendar.
function refactorStudy(assignments, plan, cap, total) {
  const method_ID = 2; // For later.

  var date = new Date(currentDate + " " + plan.startTime); // Create a rolling date object

  // Check the feasibility of the entire workload
  let feasible = determineOverallFeasibility(assignments, cap, plan);

  if(feasible) {
    route(plan.mode); // No workload easing or extending needs to occur

  } else {

    // Get the user's choice on how they want to improve scheduling results
    var choice = prompt("1- Increase Cap | 2- Decrement Quotas | 3- Both | 4- Proceed Anyway"); // Get the best course of action

    if(choice == 1) {
      plan = reschedule_increaseCap(assignments, plan, cap); // Increase the daily cap
      route(plan.mode);

    } else if (choice == 2) {
      assignments = reschedule_decrementQuotas(assignments, plan, cap);
      route(plan.mode);

    } else if(choice == 3) {
      plan = reschedule_increaseCap(assignments, plan, cap); // Increase the daily cap
      assignments = reschedule_decrementQuotas(assignments, plan, cap);
      route(plan.mode);

    } else if (choice == 4) {
      assignments = sortByWorkload(assignments, 1);
      route(plan.mode);
    }

  }

  // For saving time writing routing if statements
  function route(mode) {
    if(mode === 1) {
      schedule_assignmentMode(assignments, plan, date, cap, total, method_ID);
    } else if(mode === 2) {
      schedule_balancedMode(assignments, plan, date, cap, total, method_ID);
    } else if(mode === 3) {
      schedule_revisionMode(assignments, plan, date, cap, total, method_ID);
    }
  }

}

/* MAIN SCHEDULING FUNCTIONS ******************************************************************************************/

// Batch Scheduler- Plan subjects and breaks for a given day
function scheduleBatchSubjects(date, assignments, cap, total, plan, id) {

  //if(date.getHours() < plan.startTime.substring(0,2)) { date = new Date(resetDate(date) + " " + plan.startTime); }

  // Temp vars for creating the calendar entry on-screen
  var sessionLength, tempName, tempCode, tempColour;

  // Set exam / deadline reminders on the day
  for(var i=0; i<assignments.length; i++) { // Looping over each subject
    // Add a reminder (either an exam or coursework reminder depending on type) for the deadline of the subject
    if(assignments[i].type !== "done") {
      setDeadlineReminder(assignments[i], plan);
      assignments[i].type = "done"; // Set so this only occurs for each subject once
    }

    // Check if the user wants to schedule study on weekend days, and skip them if not
    if (plan.weekends === "off") { date = skipWeekendDays(date, plan); }

    // Check for a looming deadline with a lot of work still left and swap that in for i
    let pos = checkHighPrioritySubject(assignments);
    let cc_i; let highPrioritySubject = false;
    if(pos !== false) {
      cc_i = i; // Create a copy of i
      i = pos; // Set i to the high-priority subject going forward
      highPrioritySubject = true; // We'll need this to put i back
    }

    // Get the display attributes for the calendar event
    tempName = assignments[i].moduleName;
    tempCode = assignments[i].moduleCode;
    tempColour = assignments[i].color;
    sessionLength = assignments[i].avg; // It'll be something like 1hr - 3hr

    var shorterSubject = false; // For when a shorter subject might take the place of a longer one at the end of the day

    // Not necessary if scheduling by average, so only fires if one of them got here via the refactoring method
    if(id === 2) {
      let hrsLeft = getTimeRemainingInDay(date, plan); // Get the hours left in the day

      // Check to make sure the session will not overrun the day, and switch to something shorter if so
      if(hrsLeft < sessionLength) {
        function findShorterSession(assignments) {
          for(let x=0; x<assignments.length; x++) {
            if(assignments[x].avg < sessionLength) {
              return x;
            }
          }
          return undefined; // If no match found
        }
        var x = findShorterSession(assignments); // Find a shorter session to fill the remaining hours

        // If there is no shorter session to plan
        if(isNaN(x)) {
          incrementDay(date, plan); // Move to the next day
          if(plan.weekends === "off") { date = skipWeekendDays(date, plan); } // Skip weekend days called here to stop overlap on a Friday

        } else { // Something shorter can be planned, set new display values
          shorterSubject = true;
          tempName = assignments[x].moduleName;
          tempCode = assignments[x].moduleCode;
          tempColour = assignments[x].color;
          sessionLength = assignments[x].avg;
        }
      }

      // Check if the finish time is going to exceed the daily limit
      let provisionalFinishDate = new Date(date.getTime() + (sessionLength * (60*60*1000))); // + sessionLength in hrs
      if(provisionalFinishDate.getHours() < plan.startTime.substring(0,2) || provisionalFinishDate.getHours()-1 >= plan.endTime.substring(0,2)) { // -1 to get the right hour
        if(date.getHours() === 0 ) { // Rolled over onto the next day
          date = new Date(resetDate(date) + " " + plan.startTime);
        } else { // Need to increment
          date = incrementDay(date, plan); // Move to next day
        }
        if(plan.weekends === "off") { date = skipWeekendDays(date, plan); } // To stop overlap onto a Saturday
      }


    }

    // Splices any subject which has passed the due date and expired.
    let this_deadline = new Date(assignments[i].dueDate);
    // Passed the due date, expired
    if(date.getTime() > this_deadline.getTime()) {
      var failedModule = {}; // Will be added to the finished modules list for the scheduling report on-screen
      let name = assignments[i].moduleName;
      let scheduled = assignments[i].hoursScheduled;
      // Keep a global record of the completed subjects
      failedModule = {
        moduleName: name,
        utilisation: scheduled,
        success: false
      };

      completedSubjects.push(failedModule);
      assignments.splice(i, 1); // Remove the expired subject
      continue; // to the next iteration/subject, don't proceed any further.
    }

    // Increment the rolling date to determine the finish time
    var exactStartTime = stringBuilder(date); // Turns the start time into a calendar-readable format
    var nextDate = new Date(date.getTime() + (sessionLength * (60 * 60 * 1000))); // + x number of hours for session length
    var exactFinishTime = stringBuilder(nextDate); // Turns the finish time into a calendar-readable format

    // Create some metadata to display on-screen for the subject due to be planned and create the physical event
    let notes = "Automatically generated study session for " + tempCode + ": " + tempName;
    createStudySessionEvent(tempName, tempCode, exactStartTime, exactFinishTime, tempColour, notes); // Add to calendar

    // If we had to use a shorter subject, we need to subtract from that, not the original
    if(shorterSubject) {
      assignments[x].quota -= sessionLength; // Decrement the quota
      assignments[x].hoursScheduled += sessionLength;    // Hour track keeper
    } else {
      assignments[i].quota -= sessionLength; // Decrement the quota
      assignments[i].hoursScheduled += sessionLength;    // Hour track keeper
    }

    // Update the time then add a proportional break relative to the workload
    date = nextDate; // Update the time after the session has been added
    let breakLength = addBreak(cap, total, assignments.length, plan, id, sessionLength); // Add a break between study sessions
    date = new Date(date.getTime() + (60 * 60 * 1000) * breakLength); // + x number of break hours

    // Check to see if the current assignment has any work left to plan, and then remove it if not
    var done = checkQuota(assignments[i].quota);

    // The subject has no hours left to plan, we can move it into the completed subjects record
    if (done) {
      var completedModule = {};
      let name = assignments[i].moduleName;
      let scheduled = assignments[i].hoursScheduled;

      // Keep a global record of the completed subjects
      completedModule = {
        moduleName: name,
        utilisation: scheduled,
        success: true
      };
      completedSubjects.push(completedModule);
      assignments.splice(i, 1); // Remove the subject from the workload
    }

    // If this was a high-priority subject, put i back to its original position
    if(highPrioritySubject) { i = cc_i; }

  }
  return date; // Return the date at the end of the day
}

// Schedule Mode 1: Assignment mode (longer blocks of study, extended study sessions
function schedule_assignmentMode(assignments, plan, date, cap, total, id) {
  let quotasComp = false; // For keeping track of outstanding work

  // Double up all averages for assignment mode to make the blocks longeer
  assignments.forEach(function(e) {
    e.avg++; // Add an hour to each for longer blocks
    if(e.avg >= cap/2) {
      e.avg = ((cap/2)-1); // Decrement to ensure the user has free time during the day if one of their subjects exceeds 50% of their day
    }
  });

  // Sort the assignments according to the soonest
  assignments = sortByDeadline(assignments, -1);

  // Runs while there's still hours left to plan
  while(quotasComp === false) {
    date = scheduleBatchSubjects(date, assignments, cap, total, plan, id);
    assignments = sortByDeadline(assignments, -1);
    if(date.getDay() % 2  === 0) { // a multiple of two (2, 4, 6)
      assignments = sortByDeadline(assignments, -1); // Sort the assignments according to the soonest
    } else{ // Not (0, 1, 3, 5)
      assignments = sortByHoursAlreadyScheduled(assignments, 1); // Sort the workload by largest
    }
    quotasComp = checkAllQuotas(assignments);
  }

  alert("Scheduling finished");
}

// Schedule Mode 2: Balanced (long and short blocks, whatever works really)
function schedule_balancedMode(assignments, plan, date, cap, total, id) {

  // Check for long blocks
  for(let i=0; i<assignments.length; i++) {
    if(assignments[i].avg >= (cap/2)) {
      assignments[i].avg = ((cap/2)-1);
    }
  }

  let quotasComplete = false; // For keeping track of outstanding work to be done
  assignments = sortByDeadline(assignments, -1); // Sort the assignments so the highest workload is at the front

  // Schedule while there's still work to be done
  while(quotasComplete === false) {
    date = scheduleBatchSubjects(date, assignments, cap, total, plan, id); // Batch job

    // Always puts the highest-priority subjects to the front
    if(date.getDay() % 2 === 0) {
      assignments = sortByHoursAlreadyScheduled(assignments, 1);
    } else {
      assignments = sortByDeadline(assignments, -1);
    }
    quotasComplete = checkAllQuotas(assignments);
  }

  alert("Scheduling Finished.");
}

// Schedule Mode 3: Revision mode (short blocks, never keep anything too long, could just cycle through 1hr sessions)
function schedule_revisionMode(assignments, plan, date, cap, total, id) {

  let assignments_done = false; // Keeping track of outstanding work

  // Revision mode requires short bursts of subjects so reduces the session length, but not if their deadline is soon approaching
  assignments = sortByDeadline(assignments, -1); // Get soonest
  assignments.forEach(function(e) {
    if(getDaysUntilDeadline(e.dueDate, date) > 100) {
        e.avg = 1; // Setting a 1hr session length
    }
  });

  // While there are hours still left to plan
  while(assignments_done === false) {
    date = scheduleBatchSubjects(date, assignments, cap, total, plan, id); // Batch job
    if(date.getDay() % 2 !== 0) {
      assignments = sortByDeadline(assignments, -1);
    } else {
      assignments = sortByHoursAlreadyScheduled(assignments, 1);
    }
    assignments_done = checkAllQuotas(assignments);
  }

  alert("Scheduling finished.");

}

// Check if there is a fast-approaching deadline with a lot of work to do still.
function checkHighPrioritySubject(assignments) {
  for(let i=0; i<assignments.length; i++) {
    let daysUntil = getDaysUntilDeadline(assignments[i].dueDate, cd);
    let quota = assignments[i].quota;

    // High priority subject
    if(daysUntil < 20 && quota > daysUntil) {
      return getAssignmentByName(assignments, assignments[i].moduleName);
    }
  }
  return false;
}


/* RESCHEDULING *******************************************************************************************************/

// Increase the daily number of hours the scheduler plans across to allow more hours in the day to complete assignments
function reschedule_increaseCap(assignments, plan, cap) {

  // Get the start and finish time from the plan
  let startTimeHrs = plan.startTime.substring(0,2);
  let finishTimeHrs = plan.endTime.substring(0,2);

  // Increment the daily start and finish time by an hour
   startTimeHrs--; finishTimeHrs++;

  // Add the revised times to the plan
  plan = amendPlanTimes(startTimeHrs, finishTimeHrs);
  function amendPlanTimes(start, finish) {
    let t1, t2;
    t1 = start + ":00";
    t2 = finish + ":00";
    plan.startTime = t1;
    plan.endTime = t2;
    return plan;
  }

  return plan;
}

// If the user is trying to cram too much work into not enough time,  they can choose to decrement the quotas
function reschedule_decrementQuotas(assignments, plan, cap) {

  // Get relevant information
  let lastDeadLine = getFurthestDeadline(assignments); //alert(lastDeadLine.moduleName);
  let totalHrs = ((getDaysUntilDeadline(lastDeadLine.dueDate, cd)) * cap); //alert(totalHrs);

  // New values
  let pcInc = 0.05; // A marginal percentage decrease to the deadlines
  let newQuotas = [];
  let balanceFound = false;

  // Continually test gradual decrementing of quotas until workload = 3/4 of available time
  while(balanceFound === false) {
    assignments.forEach(function(e) {
      let currentQuota = e.quota;
      newQuotas.push(currentQuota * (1-pcInc)); // 0.95, 0.9, 0.85 of original quotas, etc...
    });

    let newWorkload = sumArrayValues(newQuotas);
    if(newWorkload < (totalHrs*0.8)) {
      balanceFound = true;
    } else {
      pcInc += 0.05;
    }
  }

  // Assign the new quotas once the balance has been found
  for(let i=0; i<assignments.length; i++) {
    assignments[i].quota = newQuotas[i];
  }

  // For the sidebar later on
  assignments.forEach(function(e) {
    let assignment = Object.assign({}, e);
    decrementedAssignments.push(assignment);
  });
  decrementedQuotas = true;

  // Sort and add priority to the soonest deadline (which might be overlooked)
  assignments = sortByDeadline(assignments, -1);
  assignments[0].avg += 1; // Add an hour to help schedule more time

  return assignments;
}

/* ADDING CALENDAR EVENTS *********************************************************************************************/

// Set overhead reminders for exams and deadlines for each module
function setDeadlineReminder(assignment, plan) {

  // Set reminder time attributes
  let e_date = new Date(assignment.dueDate + " " + "00:00");
  let end_date = new Date(e_date.getTime() + ms_day);

  // Set display attributes for the calendar event
  let code, name, start, finish, colour, notes;
  code = assignment.moduleCode; // Both the same

  // Turn dates into calendar-readable format
  start = stringBuilder(e_date);
  finish = stringBuilder(end_date);

  // Determines what kind of reminder to add, whether it's Assignment [A] or Exam [E]
  if(assignment.type === "E") {
    // Exam event details
    name = "EXAM: " + assignment.moduleCode;
    colour = "Red";
    notes = "Examination for " + code + ": " + assignment.moduleName;
  } else if(assignment.type === "A") {
    // Deadline event details
    colour = "Black";
    name = "DEADLINE: " + assignment.moduleCode;
    notes = "Examination for " + code + ": " + assignment.moduleName;
  }

  // Create the event
  createStudySessionEvent(name, code, start, finish, colour, notes);
}

// Create a study session event on the calendar with given parameters
function createStudySessionEvent(title, code, start, finish, color, notes) {

  // Calendar ID and reference
  let temp_ID = code + evt_count;
  let dateCreated = new Date();

    scheduler.addEvent({
      id: temp_ID,
      start_date: start,
      end_date: finish,
      text: title,
      code: code,
      color: color,
      notes: notes, // Custom scheduler data
      created: dateCreated // Custom scheduler data
    });

    evt_count++; // Keep counting the number of events created to generate a unique ID for each one

}

// Show / Hide assignments using the filters
function showStudySessionGroup(cb_val, mode, assignments) {

  // Get a collection of all the events in the calendar
  var evs = scheduler.getEvents();

  // Get the code and first unique letter to differentiate between assignments with the same course code
  var modCode = cb_val.substring(0, 5); // Get the module code from the request
  let tempCode = cb_val.substring(5,6);

  // Box ticked- Show all
  if(mode===1) {
    // Loop through each event looking for matches on the code for the filter that was clicked
    evs.forEach(function (event) {
      let tempLetter = event.text.substring(0,1); // Direct match

      // If event moduleCode matches, show event
      if (event.code === modCode && tempCode === tempLetter) {
        let this_name = event.text;
        let i = getAssignmentByName(assignments, this_name);
        scheduler.getEvent(event.id).color = assignments[i].color; // Restore colour if previously hidden
        scheduler.updateEvent(event.id);
      }
    });

  } else if(mode===-1) { // Box unticked, hide all
    evs.forEach(function (event) {
      let tempLetter = event.text.substring(0,1); // Direct match
      if (event.code === modCode && tempCode === tempLetter) {
        scheduler.getEvent(event.id).color = "White"; // Turn white to simulate hiding but still block out the space
        scheduler.updateEvent(event.id);
      }
    });
  }

}

/**********************************************************************************************************************/
/************************************************ MINOR FUNCTIONALITY *************************************************/
/**********************************************************************************************************************/

/* SORTING ************************************************************************************************************/

// Sort the assignments so that the highest workload subjects are first in the queue
function sortByWorkload(assignments, mode) { // 1- Highest-Lowest / -1- Lowest-Highest

  // Sort the objects by descending quota
  function compare(a,b) {
    var quota1 = a.quota;
    var quota2 = b.quota;
    let comparison = 0;
    if(quota1 > quota2) {
      comparison = mode * -1;
    } else if(quota1 < quota2) {
      comparison = mode;
    }
    return comparison;
  }
  assignments.sort(compare);
  return assignments;
}

// Sort by average workload (1- Most hrs - least hrs // -1- Least hrs - most hrs
function sortByDailyAverage(assignments, mode) { // 1- Highest-Lowest / -1- Lowest-Highest
  function compare(a,b) {
    let av1 = a.avg;
    let av2 = b.avg;
    let comp;
    if(av1 > av2) {
      comp = mode * -1;
    } else if(av1 < av2) {
      comp = mode;
    }
    return comp;
  }
  assignments.sort(compare); // Sort
  return assignments;
}

// Sort by soonest deadline and furthest deadline (Mode 1- Furthest - Soonest / -1- Soonest - Furthest
function sortByDeadline(assignments, mode) {
  function compare(a,b) {
    let d1 = new Date(a.dueDate);
    let d2 = new Date(b.dueDate);
    let dComp;

    if(d1.getTime() > d2.getTime()) {
      dComp = mode * -1;
    } else if(d1.getTime() < d2.getTime()) {
      dComp = mode;
    }
    return dComp;
  }
  assignments.sort(compare);
  return assignments;
}

function sortByHoursAlreadyScheduled(assignments, mode) { // 1: Sort by mode scheduled, -1 sort by least scheduled

  function compare(a,b) {
    let t1 = a.hoursScheduled;
    let t2 = b.hoursScheduled;
    let comp;
    if(t1 >= t2) {
      comp = mode;
    } else {
      comp = mode*1;
    }
    return comp;
  }

  assignments.sort(compare);
  return assignments;

}

// Randomise the elements of an array
function randomise(arr) {
  for(let i= arr.length-1; i>0; i--) {
    let j = Math.floor(Math.random() * (i+1));
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

/* GETTERS ************************************************************************************************************/

// Get information about a particular subject by its name, assumes that two assignments don't have the same name
function getAssignmentByName(assignments, param) {
  for(let i=0; i<assignments.length; i++) {
    if(assignments[i].moduleName === param) {
      return i; // Return the index position
    }
  }
}

// Get the latest / earliest deadlines and return
function getFurthestDeadline(assignments) {
  let furthestDeadline = new Date(assignments[0].dueDate);
  let subject = {};

  // Comparison loop through all subjects to test for the highest date
  let currentDeadline = new Date();
  for(var i=1; i<assignments.length; i++) {
    currentDeadline = new Date(assignments[i].dueDate);
    if(currentDeadline.getTime() > furthestDeadline.getTime()) {
      subject = assignments[i];
      furthestDeadline = currentDeadline;
    }
  }
  return subject; // Returns the whole object (inefficient)
}

// Get the daily average workload in hours for a particular module and round up
function getDailyAverage(module, weekends) {
  var req_hours = module.quota;
  var d = module.dueDate;
  var daysUntil = getDaysUntilDeadline(d, cd);

  // If the user has chosen not to plan study on weekends
  if(weekends === "off") {
    let weekdaysUntil = ((daysUntil / 7) * 5);
    return (Math.ceil(req_hours / weekdaysUntil));
  } else {
    return Math.ceil(req_hours / daysUntil);
  }

}

// Get the days until the deadline from the current date (getCurrentDay)
function getDaysUntilDeadline(deadline, currentDate) {
  let dl = new Date(deadline);
  let timeDiff = dl.getTime() - currentDate.getTime();
  return timeDiff / (1000*60*60*24);
}


/* FEASIBILITY ********************************************************************************************************/

// Determine the feasibility of all daily avgs vs daily cap
function determineOverallFeasibility(assignments, cap, plan) {

  // Get relevant information
  let overallWorkload = getOverallWorkload(assignments);
  let totalHrs = getTotalHours(assignments, plan, cap);

  return overallWorkload <= (totalHrs * 0.85); // Reduce by 15% because we need to account time for breaks
}

// Work out the overall workload, in hours, of all the subjects in the assignments array
function getOverallWorkload(assignments) {
  let overallWorkload = 0;
  for(let i=0; i<assignments.length; i++) {
    overallWorkload = overallWorkload + assignments[i].quota;
  }
  return overallWorkload;
}

// Work out the time until the last deadline
function getTotalHours(assignments, plan, cap) {

  // Get relevant information
  let lastDeadline = getFurthestDeadline(assignments);
  let days = getDaysUntilDeadline(lastDeadline.dueDate, cd);

  let totalHrs;
  if(plan.weekends === "off") {
    totalHrs = ((days/7)*5) * cap;
  } else {
    totalHrs = (days * cap);
  }

  return totalHrs;
}


/* CHECKS *************************************************************************************************************/

// Check to see if a single quota is 0
function checkQuota(quota) {
  return quota <= 0;
}

// Check to see if any of the subjects still have hours left to plan
function checkAllQuotas(assignments) {
  if(assignments.length === 0) {
    return true;
  } else {
    for(let i=0; i<assignments.length; i++) {
      if(assignments[i].quota > 0) {
        return false;
      }
    }
    return true; // Unreachable if any subject has outstanding work to do
  }
}


/* TIME OPERATIONS ****************************************************************************************************/

// Increment the day using the resetDate method if the time has exceeded the daily threshold
function incrementDay(date, plan) {
  let d = new Date(date.getTime() + ms_day);  // + 24 hours
  let str = resetDate(d);
  return new Date(str + " " + plan.startTime); // Use the reset day + the plan startTime
}

// If the weekends setting is marked as "off" on the schedule plan, check the day and skip to Monday if it's a weekend day
function skipWeekendDays(date, plan) {
  if(date.getDay() === 6) { // Saturday, skip 2 days
    date = incrementDay(date, plan);
    date = incrementDay(date, plan);
  } else if(date.getDay() === 0) { // Sunday, skip 1 day
    date = incrementDay(date, plan);
  }
  return date;
}

// Determine the length of breaks based on the workload and settings used
function addBreak(cap, total, moduleCount, plan, id, sessionLength) {

  // If there's only a couple of modules left in the array
  if(moduleCount === 1 || moduleCount === 2) {
    return 1;

  } else if(moduleCount === 3) {
      return 1;

  } else {
    switch(id) {
      case 1: // ScheduleByAvgs - combined total < cap -- Returns a break length proportional to the workload
        let freeHrs = cap - total;
        return freeHrs / moduleCount;

      case 2: // RefactorStudy - Needs specific rules to follow
        switch(plan.mode) {
          case 1: // Assignment Mode
            if(sessionLength > 2) {
              return 1;
            } else {
              return 0.5; // Anything less and it won't be added before the day increments
            }

          case 2: // Balanced mode
            if(plan.weekends === "off") {
              return 0.333333333333333;
            } else {
              return 0.5;
            }

          case 3: // Revision mode
            if(plan.weekends === "off") {
              return 0.25;
            } else {
              return 0.5; // Revision Mode
            }
        }
    }
  }
}

// Returns the amount of hours left in a day until the daily finish time
function getTimeRemainingInDay(date, plan) {
  return plan.endTime.substring(0, 2) - date.getHours();
}

// Find the time difference between two times
function getHourDifference(t1, t2, date) {
  // Create the date format
  let timeStart = new Date(date + " " + t1).getHours();
  let timeStop = new Date(date + " " + t2).getHours();
  return timeStop - timeStart;
}

/* ARITHMETIC *********************************************************************************************************/

// Sum the values in a given array
function sumArrayValues(arr) {
  return arr.reduce(function (a, b) {
    return a + b;
  }, 0);
}

/* FORMATTING *********************************************************************************************************/

// Build a string in the format the scheduler can use rather than the JS format
function stringBuilder(date) {
  let string, day, month, year, time, hrs, sec;

  // Get the day and month
  day = date.getDate(); // Gets day as a number
  month = date.getMonth() + 1; // Gets the month
  if(month < 10) { month = "0" + month; }

  year = date.getFullYear(); // Gets year in YYYY format

  // Get the time
  hrs = date.getHours();
  sec = date.getSeconds();

  // Add a zero before for formatting
  if(hrs < 10) { hrs = "0" + hrs; }
  if(sec < 10) { sec = "0" + sec; }
  time = hrs + ":" + sec; // Set the format

  // Bind the new format for the calendar together and return it
  string = day + "-" + month + "-" + year + " " + time;
  return string;
}

// Get the date without the time stamp in string format
function resetDate(d) {
  let yy, mm, dd;
  yy = d.getFullYear();
  mm = d.getMonth() + 1;
  dd = d.getDate();
  return yy + "-" + mm + "-" + dd;
}

/**********************************************************************************************************************/
/*************************************** GET / POPULATE STUFF FROM THE DATABASE ***************************************/
/**********************************************************************************************************************/
//////////////////////////////// NOTE: The following functions are out of scope for CI316 //////////////////////////////

// Fill the assignments array from the database
function populateAssignmentsArray() {
  var assignments = [];
  let longString;

  // TODO: .ajax whatever

  // Populate the assignments array from the parsed string returned from the DB
  var obj = JSON.parse(longString);
  obj.forEach(function(e) {
    let assignment = {
      moduleName: e.moduleName,
      moduleCode: e.moduleCode,
      quota: e.quota,
      color: e.color,
      dueDate: e.dueDate,
      type: e.type
    };
    assignments.push(assignment);
  });

  return assignments;
}

// Save the calendar as a JSON String and send to DB
function saveCalendar() {
  var longText = scheduler.toJSON();
  // XHTTP Request to SaveCalendar.php
}

// Load the JSON string from the DB and parse it in
function loadCalendar() {
  var xhttp_responseText = '';
  // New XHTTP Request to LoadCalendar.php
  if(xhttp_responseText !== '') {
    scheduler.parse(xhttp_responseText); // TODO: Double check this is the correct syntax
    return true;
  } else {
    return false;
  }
}
