// Test function for testing different parts of the scheduler with dummy data
function testSuite() {
  var boundaryTest = false;

  // Write a test query here
  describe("maths", 2, "10:00", "18:00", "on", false, 0);

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
          str = completedSubjects[i].moduleName + ": PASSED " + "\n";
        } else {
          str = completedSubjects[i].moduleName + ": FAILED " + "\n";
        }
        report += str;
      }
      alert(report);
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
        quota: 100,
        color: "Black",
        type: "A",
        dueDate: "2019-10-28"
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
        color: "Pink",
        type: "A",
        dueDate: "2020-01-17"
      },

      m8 = { moduleCode: "CI346",
        moduleName: "Concurrency & Client Server Computing",
        quota: 100,
        color: "Pink",
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
    let bundle = setUp(start, finish, mode, "business");
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