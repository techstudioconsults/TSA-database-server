const getCourseFee = (classType, courseCohort) => {
  const cohortLower = courseCohort.toLowerCase();
  let courseFee = 0;

  if (cohortLower.includes("fullstack")) {
    courseFee = getFullstackFee(classType);
  } else if (cohortLower.includes("frontend")) {
    courseFee = getFrontendFee(classType);
  } else if (cohortLower.includes("data")) {
    courseFee = getDataFee(classType);
  } else if (cohortLower.includes("cyber")) {
    courseFee = getCyberFee(classType);
  } else if (
    cohortLower.includes("product design") ||
    cohortLower.includes("ui")
  ) {
    courseFee = getProductDesignFee(classType);
  }

  return courseFee;
};

const getFullstackFee = (classType) => {
  switch (classType) {
    case "weekday":
      return 650000;
    case "weekend":
      return 400000;
    case "online":
      return 300000;
    default:
      return 0;
  }
};

const getFrontendFee = (classType) => {
  switch (classType) {
    case "weekday":
      return 500000;
    case "weekend":
      return 300000;
    default:
      return 0;
  }
};

const getDataFee = (classType) => {
  switch (classType) {
    case "weekday":
      return 400000;
    case "weekend":
      return 400000;
    case "online":
      return 250000;
    default:
      return 0;
  }
};

const getCyberFee = (classType) => {
  switch (classType) {
    case "weekday":
    case "weekend":
      return 400000;
    default:
      return 0;
  }
};

const getProductDesignFee = (classType) => {
  switch (classType) {
    case "weekday":
    case "weekend":
      return 350000;
    case "online":
      return 200000;
    default:
      return 0;
  }
};

function getCourseTypeAbbreviation(classType) {
  switch (classType) {
    case "weekend":
      return "WE";
    case "weekday":
      return "WD";
    case "online":
      return "ON";
    default:
      return "";
  }
}
function getCourseCode(courseCohort) {
  if (courseCohort.toLowerCase().includes("fullstack")) {
    return "01";
  } else if (courseCohort.toLowerCase().includes("frontend")) {
    return "02";
  } else if (
    courseCohort.toLowerCase().includes("product") ||
    courseCohort.toLowerCase().includes("ui")
  ) {
    return "03";
  } else if (courseCohort.toLowerCase().includes("data")) {
    return "04";
  } else if (courseCohort.toLowerCase().includes("cyber")) {
    return "05";
  }
}

module.exports = { getCourseFee, getCourseTypeAbbreviation, getCourseCode };
