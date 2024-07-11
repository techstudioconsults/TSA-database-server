const getCourseFee = (classType, courseCohort) => {
  const cohortLower = courseCohort.toLowerCase();
  let courseFee = 0;

  if (cohortLower.includes("fullstack")) {
    courseFee = getFullstackFee(classType);
  } else if (cohortLower.includes("frontend")) {
    courseFee = getFrontendFee(classType);
  } else if (cohortLower.includes("digital")) {
    courseFee = getDigitalMarketingFee(classType);
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
      return 500000;
    case "weekend":
      return 400000;
    case "online":
      return 200000;
    default:
      return 0;
  }
};

const getCyberFee = (classType) => {
  switch (classType) {
    case "weekday":
      return 500000;
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

const getDigitalMarketingFee = (classType) => {
  switch (classType) {
    case "weekday":
      return 200000;
    case "weekend":
      return 0;
    case "online":
      return 0;
    default:
      return 0;
  }
};

const getCourseTypeAbbreviation = (classType) => {
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
};
const getCourseCode = (courseCohort) => {
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
  } else if (courseCohort.toLowerCase().includes("digital")) {
    return "06";
  }
};
const createCourseDuration = (courseCohort) => {
  if (courseCohort.toLowerCase().includes("fullstack")) {
    return 16;
  } else if (courseCohort.toLowerCase().includes("frontend")) {
    return 16;
  } else if (courseCohort.toLowerCase().includes("product design")) {
    return 12;
  } else if (courseCohort.toLowerCase().includes("data")) {
    return 12;
  } else if (courseCohort.toLowerCase().includes("cyber")) {
    return 12;
  } else if (courseCohort.toLowerCase().includes("digital")) {
    return 4;
  } else {
    return null; // Return null for unknown course cohorts
  }
};

module.exports = {
  getCourseFee,
  getCourseTypeAbbreviation,
  getCourseCode,
  createCourseDuration,
};
