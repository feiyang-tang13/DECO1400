//==================
// Homepage Element
//==================

const menuButton = document.querySelector("#menuButton");
const menuPanel = document.querySelector("#menuPanel");

const homepageMain = document.querySelector("#homepageMain");
const homepageHeader = document.querySelector("#homepageHeader")
const homepageBottom = document.querySelector("#homepageBottom");

const maybeLaterButton = document.querySelector("#maybeLaterButton");
const gentleMessage = document.querySelector("#gentleMessage");
const maybeLaterNav = document.querySelector("#maybeLaterNav");
const maybeLaterBackButton = document.querySelector("#maybeLaterBackButton");

//=====================================
// Element show/hide helper functions
//=====================================

function showElement(element) {
  if(!element) {
    return
  };

  element.classList.remove("hidden");
}

function hideElement(element) {
  if(!element) {
    return;
  }

  element.classList.add("hidden");
}


//================
// Homepage Menu
//=================

let isMenuOpen = false;

function openMenu() {
  showElement(menuPanel)

  requestAnimationFrame(function () {
    menuPanel.classList.add("menu-open");
  })

  isMenuOpen = true;
}

function closeMenu() {
  menuPanel.classList.remove("menu-open");

  setTimeout(function () {
    hideElement(menuPanel);
  }, 250);

  isMenuOpen = false;
}

if (menuButton && menuPanel) {
  menuButton.addEventListener("click", function () {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

//=====================
// Maybe Late Message
//=====================

function showMaybeLaterMessage() {
  showElement(gentleMessage);

  requestAnimationFrame(function () {
    gentleMessage.classList.add("message-visible");
  });

  hideElement(homepageHeader);
  hideElement(homepageMain);
  hideElement(homepageBottom);

  showElement(maybeLaterNav);
}

function returnToHomepage() {
  gentleMessage.classList.remove("message-visible");

  setTimeout(function () {
    hideElement(gentleMessage);
    
    showElement(homepageHeader);
    showElement(homepageMain);
    showElement(homepageBottom);

    hideElement(maybeLaterNav);
  }, 300);
}

if(maybeLaterBackButton && gentleMessage) {
  maybeLaterButton.addEventListener("click",  function () {
    showMaybeLaterMessage();
  })
}

if (maybeLaterBackButton && gentleMessage) {
  maybeLaterBackButton.addEventListener("click", function () {
    returnToHomepage();
  })
}


//==================
// FAQ interactions
//==================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {
  const question = item.querySelector(".faq-question");

  if(!question) {
    return;
  }

  question.addEventListener("click", function () {
    item.classList.toggle("is-open");
  })
});

//======================
// Page Transition
//======================

const pageTransitionCover = document.querySelector("#pageTransitionCover");
const internalPageLinks = document.querySelectorAll('a[href$=".html"]');

function loadPage() {
  if(!pageTransitionCover) {
    return;
  }

  requestAnimationFrame(function () {
    pageTransitionCover.classList.add("is-hidden")
  })
}

window.addEventListener("load", function () {
  loadPage();
})

function navigateToAnotherPage(url) {
  if(!pageTransitionCover) {
    return;
  }

  pageTransitionCover.classList.remove("is-hidden");

  setTimeout(function () {
    window.location.href = url;
  }, 360);
}

internalPageLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    navigateToAnotherPage(link.href);
  });
});

//===========================
// Check-in screen elements
//==========================

const paletteScreen = document.querySelector("#paletteScreen");
const bodyScreen = document.querySelector("#bodyScreen");
const guidanceScreen = document.querySelector("#guidanceScreen");

const backButton = document.querySelector("#backButton");

let currentScreen = "palette";
let isScreenTransitioning = false;

// Handles the fade transition between the three check-in screens.
function showCheckinScreen(screenToShow, screenName) {
  if (!screenToShow || isScreenTransitioning) {
    return;
  }

  const currentVisibleScreen = document.querySelector(".checkin-screen:not(.hidden)");

  isScreenTransitioning = true;

  currentVisibleScreen.classList.add("screen-leaving");

  setTimeout(function () {
    hideElement(currentVisibleScreen);
    currentVisibleScreen.classList.remove("screen-leaving");

    showElement(screenToShow);
    screenToShow.classList.add("screen-entering");

    currentScreen = screenName;

    setTimeout(function () {
      screenToShow.classList.remove("screen-entering");
      isScreenTransitioning = false;
    }, 360);
  }, 360);
}

//============================
// Check-in Navigation
//============================

if (backButton) {
  backButton.addEventListener("click", function () {
    if (currentScreen === "palette") {
      navigateToAnotherPage("index.html");
      return;
    }

    if (currentScreen === "body") {
      initialisePaletteScreen();
      showCheckinScreen(paletteScreen, "palette");
      return;
    }

    if (currentScreen === "guidance") {
      initialiseBodyScreen();
      showCheckinScreen(bodyScreen, "body");
      return;
    }
  });
}


//====================
// Palette Elements
//====================

const emotionPalette = document.querySelector("#emotionPalette");
const paletteSelector = document.querySelector("#paletteSelector");
const paletteResult = document.querySelector("#paletteResult");
const emotionResultText = document.querySelector("#emotionResultText");

const rejectEmotion = document.querySelector("#rejectEmotion");
const confirmEmotion = document.querySelector("#confirmEmotion");
const paletteHint = document.querySelector("#paletteHint");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

//==========================
// Palette State
//==========================

let currentEmotionState = {
  type: "calm",
  intensity: "low",
  isMixed: false,
  xPercent: 50,
  yPercent: 45
};

let isDraggingPalette = false;
let hasDraggedPalette = false;
let ignoreNextPaletteClick = false;

const emotionCopy = {
  calm: {
    low: "There may be a quiet calm here."
  },

  sadness: {
    low: "There may be a trace of sadness here.",
    medium: "There may be sadness here.",
    high: "This sadness may feel heavy."
  },

  joy: {
    low: "There may be a small warmth of joy here.",
    medium: "There may be joy here.",
    high: "This joy may feel bright and full."
  },

  fear: {
    low: "There may be a little unease here.",
    medium: "There may be fear here.",
    high: "This fear may feel strong or close."
  },

  anger: {
    low: "There may be some tension here.",
    medium: "There may be anger here.",
    high: "This anger may feel strong."
  },

  sadness_joy: {
    soft: "There may be a soft mix of sadness and joy here.",
    deep: "There may be a bittersweet feeling here."
  },

  joy_anger: {
    soft: "There may be energy and heat here.",
    deep: "This may feel bright, charged, or restless."
  },

  fear_anger: {
    soft: "There may be tension and unease here.",
    deep: "This may feel defensive or hard to settle."
  },

  sadness_fear: {
    soft: "There may be sadness here, along with unease.",
    deep: "This may feel heavy, vulnerable, or overwhelming."
  }
}

//===========================
// Palette helper functions
//===========================

function initialisePaletteScreen() {
  currentEmotionState = {
    type: "calm",
    intensity: "low",
    isMixed: false,
    xPercent: 50,
    yPercent: 45
  };
    
  let isDraggingPalette = false;
  let hasDraggedPalette = false;
  let ignoreNextScreenClick = false;

  movePaletteSelector(currentEmotionState.xPercent, currentEmotionState.yPercent);

  hideElement(paletteResult);
  showElement(paletteHint);

  if (paletteResult) {
    paletteResult.classList.remove("card-closing");
  }
}

function getPalettePosition(event) {
  const paletteRect = emotionPalette.getBoundingClientRect();
  const selectorRect = paletteSelector.getBoundingClientRect();

  const x = event.clientX - paletteRect.left;
  const y = event.clientY - paletteRect.top;

  const selectorRadiusPercent = ((selectorRect.width / paletteRect.width) * 100 ) / 2;

  const selectorXPosPercent = (x / paletteRect.width) * 100;
  const selectorYPosPercent = (y / paletteRect.height) * 100;

  const xPercent = clamp(selectorXPosPercent, selectorRadiusPercent, 100 - selectorRadiusPercent);
  const yPercent = clamp(selectorYPosPercent, selectorRadiusPercent, 100 - selectorRadiusPercent);

  return {
    xPercent: xPercent,
    yPercent: yPercent,
  };
}

function movePaletteSelector(xPercent, yPercent) {
  paletteSelector.style.left = xPercent + "%";
  paletteSelector.style.top = yPercent + "%";
}

function getSingleIntensity(distance) {
  if (distance < 30) {
    return "low";
  }

  if (distance < 48) {
    return "medium";
  }

  return "high";
}

function getMixedIntensity(distance) {
  if (distance < 40) {
    return "soft";
  }

  return "deep";
}


// Reads the selector position and translates it into an emotion type,
// intensity level, or mixed emotion based on its distance and direction
// from the centre of the palette.
function analysePalettePosition(xPercent, yPercent) {
  const dx = xPercent - 50;
  const dy = yPercent - 50;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 13) {
    return {
      type: "calm",
      intensity: "low",
      isMixed: false
    }
  };

  const nearTop = yPercent < 28 && xPercent > 40 && xPercent < 60;
  const nearRight = xPercent > 72 && yPercent > 40 && yPercent < 60;
  const nearBottom = yPercent > 72 && xPercent > 40 && xPercent < 60;
  const nearLeft = xPercent < 28 && yPercent > 40 && yPercent < 60;

  
  if (nearTop) {
    return {
      type: "sadness_joy",
      intensity: getMixedIntensity(distance),
      isMixed: true
    };
  }

  if (nearRight) {
    return {
      type: "joy_anger",
      intensity: getMixedIntensity(distance),
      isMixed: true
    };
  }

  if (nearBottom) {
    return {
      type: "fear_anger",
      intensity: getMixedIntensity(distance),
      isMixed: true
    };
  }

  if (nearLeft) {
    return {
      type: "sadness_fear",
      intensity: getMixedIntensity(distance),
      isMixed: true
    };
  }

  if (xPercent < 50 && yPercent < 50) {
    return {
      type: "sadness",
      intensity: getSingleIntensity(distance),
      isMixed: false
    };
  }

  if (xPercent >= 50 && yPercent < 50) {
    return {
      type: "joy",
      intensity: getSingleIntensity(distance),
      isMixed: false
    };
  }

  if (xPercent < 50 && yPercent >= 50) {
    return {
      type: "fear",
      intensity: getSingleIntensity(distance),
      isMixed: false
    };
  }

  return {
    type: "anger",
    intensity: getSingleIntensity(distance),
    isMixed: false
  };
}

function getEmotionResultText(state) {
  return emotionCopy[state.type][state.intensity];
}

function updatePaletteState(xPercent, yPercent) {
  movePaletteSelector(xPercent, yPercent);
  currentEmotionState = analysePalettePosition(xPercent, yPercent);
}

function showPaletteResult() {
  emotionResultText.textContent = getEmotionResultText(currentEmotionState);

  showElement(paletteResult);

  hideElement(paletteHint);
}

function hidePaletteResult() {
  paletteResult.classList.add("card-closing");

  setTimeout(function () {
    hideElement(paletteResult);
    paletteResult.classList.remove("card-closing");
    
    showElement(paletteHint);
  }, 250)
}

//=======================
// Palette Interactions
//=======================

if (paletteScreen && emotionPalette && paletteSelector && paletteResult && emotionResultText) {
  paletteSelector.addEventListener("pointerdown", function (event) {
    isDraggingPalette = true;
    hasDraggedPalette = false;

    event.preventDefault();
    event.stopPropagation();
  })

  window.addEventListener("pointermove", function (event) {
    if (!isDraggingPalette) {
      return;
    }

    hasDraggedPalette = true;

    const position = getPalettePosition(event);

    updatePaletteState(position.xPercent, position.yPercent);
  });

  window.addEventListener("pointerup", function () {
    if (isDraggingPalette && hasDraggedPalette) {
      ignoreNextPaletteClick = true;

      setTimeout(function () {
        ignoreNextPaletteClick = false;
      }, 80);
    }

    isDraggingPalette = false;
  });

  paletteScreen.addEventListener("click", function () {
    if (ignoreNextPaletteClick) {
      ignoreNextPaletteClick = false;
      return;
    }

    if (paletteResult.classList.contains("hidden")) {
      showPaletteResult();
    }
  });

  paletteSelector.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  paletteResult.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

//==============================
// Palette Result Buttons
//==============================

if (rejectEmotion && paletteResult) {
  rejectEmotion.addEventListener("click", function (event) {
    event.stopPropagation();
    hidePaletteResult();
  });
}

if (confirmEmotion && bodyScreen) {
  confirmEmotion.addEventListener("click", function (event) {
    event.stopPropagation();

    initialiseBodyScreen();
    showCheckinScreen(bodyScreen, "body");
  });
}


//==========================
// Body Elements
//==========================

const bodyArea = document.querySelector("#bodyArea");
const bodyMarker = document.querySelector("#bodyMarker");
const bodyResult = document.querySelector("#bodyResult");
const bodyResultText = document.querySelector("#bodyResultText");

const rejectBody = document.querySelector("#rejectBody");
const confirmBody = document.querySelector("#confirmBody");
const bodyHint = document.querySelector("#bodyHint");

//======================
// Body State
//======================

let currentBodyState = {
  area: "chest",
  xPercent: 56,
  yPercent: 28
};

let isDraggingBody = false;
let hasDraggedBody = false;
let ignoreNextBodyClick = false;

//======================
// Body Copy
//======================

const bodyEmotionNames = {
  calm: {
    low: "a quiet calm"
  },

  sadness: {
    low: "a trace of sadness",
    medium: "sadness",
    high: "heavy sadness"
  },

  joy: {
    low: "a small warmth of joy",
    medium: "joy",
    high: "bright and full joy"
  },

  fear: {
    low: "a little unease",
    medium: "fear",
    high: "strong or close fear"
  },

  anger: {
    low: "some tension",
    medium: "anger",
    high: "strong anger"
  },

  sadness_joy: {
    soft: "a soft mix of sadness and joy",
    deep: "a bittersweet feeling"
  },

  joy_anger: {
    soft: "energy and heat",
    deep: "a bright, charged, or restless feeling"
  },

  fear_anger: {
    soft: "tension and unease",
    deep: "a defensive or unsettled feeling"
  },

  sadness_fear: {
    soft: "sadness along with unease",
    deep: "a heavy, vulnerable, or overwhelming feeling"
  }
};

const bodyAreaCopy = {
  head: "your head",
  throat: "your throat",
  chest: "your chest",
  stomach: "your stomach",
  hands: "your hands or arms",
  legs: "your legs or feet"
}

//========================
// Body helper functions
//========================

function initialiseBodyScreen() {
  currentBodyState = {
    area: "chest",
    xPercent: 56,
    yPercent: 28
  };

  isDraggingBody = false;
  hasDraggedBody = false;
  ignoreNextBodyClick = false;

  moveBodyMarker(currentBodyState.xPercent, currentBodyState.yPercent);

  showElement(bodyMarker);
  hideElement(bodyResult);
  showElement(bodyHint);

  if (bodyResult) {
    bodyResult.classList.remove("card-closing");
  }
}

function getBodyPosition(event) {
  const bodyRect = bodyArea.getBoundingClientRect();
  const markerRect = bodyMarker.getBoundingClientRect();

  const x = event.clientX - bodyRect.left;
  const y = event.clientY - bodyRect.top;

  const markerRadiusPercent = ((markerRect.width / bodyRect.width) * 100) / 2;

  const selectorXPosPercent = (x / bodyRect.width) * 100;
  const selectorYPosPercent = (y / bodyRect.height) * 100;

  const xPercent = clamp(
    selectorXPosPercent,
    markerRadiusPercent,
    100 - markerRadiusPercent
  );

  const yPercent = clamp(
    selectorYPosPercent,
    markerRadiusPercent,
    100 - markerRadiusPercent
  );

  return {
    xPercent: xPercent,
    yPercent: yPercent
  }; 
}

function analyseBodyPosition(xPercent, yPercent) {
  const isLeftSide = xPercent < 32;
  const isRightSide = xPercent > 68;
  const isMiddle = xPercent >= 32 && xPercent <= 68;

  if ((isLeftSide || isRightSide) && yPercent > 20 && yPercent < 80) {
    return "hands";
  }

  if (yPercent < 10 && isMiddle) {
    return "head";
  }

  if (yPercent < 20 && isMiddle) {
    return "throat";
  }

  if (yPercent < 35 && isMiddle) {
    return "chest";
  }

  if (yPercent < 50 && isMiddle) {
    return "stomach";
  }

  return "legs";
}

function moveBodyMarker(xPercent, yPercent) {
  bodyMarker.style.left = xPercent + "%";
  bodyMarker.style.top = yPercent + "%";
}

function updateBodyState(xPercent, yPercent) {
  const bodyAreaName = analyseBodyPosition(xPercent, yPercent);

  currentBodyState = {
    area: bodyAreaName,
    xPercent: xPercent,
    yPercent: yPercent
  };

  moveBodyMarker(xPercent, yPercent);
}

function getBodyResultText() {
  const emotionName = 
    bodyEmotionNames[currentEmotionState.type][currentEmotionState.intensity];

  const bodyPartName = bodyAreaCopy[currentBodyState.area];

  return "You may be feeling " + emotionName + " in " + bodyPartName + ".";
}

function showBodyResult() {
  bodyResultText.textContent = getBodyResultText();

  showElement(bodyResult);
  hideElement(bodyHint);
}

function hideBodyResult() {
  bodyResult.classList.add("card-closing");

  setTimeout(function () {
    hideElement(bodyResult);
    bodyResult.classList.remove("card-closing");

    showElement(bodyHint);
  }, 250);
}


//=============================
// Body Awareness Interactions
//=============================

if (bodyScreen && bodyArea && bodyMarker && bodyResult && bodyResultText) {
  bodyMarker.addEventListener("pointerdown", function (event) {
    isDraggingBody = true;
    hasDraggedBody = false;

    event.preventDefault();
    event.stopPropagation();
  })

  window.addEventListener("pointermove", function (event) {
    if (!isDraggingBody) {
      return;
    }

    hasDraggedBody = true;

    const position = getBodyPosition(event);

    updateBodyState(position.xPercent, position.yPercent);
  });

  window.addEventListener("pointerup", function () {
    if (isDraggingBody && hasDraggedBody) {
      ignoreNextBodyClick = true;

      setTimeout(function () {
        ignoreNextBodyClick = false;
      }, 80);
    }

    isDraggingBody = false;
  });

  bodyScreen.addEventListener("click", function () {
    if (ignoreNextBodyClick) {
      ignoreNextBodyClick = false;
      return;
    }

    if (bodyResult.classList.contains("hidden")) {
      showBodyResult();
    }
  });

  bodyMarker.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  bodyResult.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

//========================
// Body Result Buttons
//========================

if (rejectBody && bodyResult) {
  rejectBody.addEventListener("click", function (event) {
    event.stopPropagation();
    hideBodyResult();
  });
}

if (confirmBody && guidanceScreen) {
  confirmBody.addEventListener("click", function (event) {
    event.stopPropagation();

    initialiseGuidanceScreen();
    showCheckinScreen(guidanceScreen, "guidance");
  });
}

//======================
// Guidance Elements
//======================

const guidanceBackground = document.querySelector("#guidanceBackground");
const guidanceText = document.querySelector("#guidanceText");
const guidanceHint = document.querySelector("#guidanceHint");
const completionOptions = document.querySelector("#completionOptions");

//========================
// Guidance State
//========================

let currentGuidanceStep = 0;
let isGuidanceComplete = false;
let isGuidanceTextChanging = false;

//==========================
// Guidance Layout Settings
//==========================

const guidancePositions = [
  "position-left-top",
  "position-right-middle",
  "position-left-middle",
  "position-right-lower"
];

const guidanceStrengths = [
  "0.32",
  "0.26",
  "0.18",
  "0.10"
];

//==========================
// Guidance Colors
//==========================

const guidanceColours = {
  calm: "210, 210, 200",
  sadness: "85, 150, 255",
  joy: "255, 226, 90",
  fear: "205, 110, 255",
  anger: "255, 95, 95",

  sadness_joy: "205, 200, 170",
  joy_anger: "255, 160, 75",
  fear_anger: "220, 95, 170",
  sadness_fear: "145, 130, 255"
};


//======================
// Guidance Copy
//======================

const guidanceCopy = {
  sadness: [
    "Let's <strong>stay</strong> with this sadness for a moment.",
    "It's <strong>okay</strong> to feel sad.",
    "You don't have to fix <strong>anything</strong> right now.",
    "Take one <strong>slow breath</strong>, and let this feeling be here."
  ],

  fear: [
    "Let's <strong>stay</strong> with<br>this fear<br>gently.",
    "You are <strong>here</strong>,<br>in this moment.",
    "Try to notice<br>one thing around you<br>that feels <strong>steady</strong>.",
    "You don't have to<br>solve <strong>anything</strong><br>right now."
  ],

  anger: [
    "Let's <strong>notice</strong><br>this anger<br>without pushing it away.",
    "Anger can be a <strong>sign</strong><br>that something<br>matters.",
    "Try to <strong>feel</strong> where<br>the tension is held<br>in your body.",
    "You can take<br>a little <strong>space</strong><br>before responding."
  ],

  joy: [
    "Let's <strong>stay</strong> with<br>this joy<br>for a moment.",
    "Notice where it feels<br><strong>warm or light</strong><br>in your body.",
    "You can let<br>this good feeling<br>take up <strong>space</strong>.",
    "Take a moment<br>to <strong>remember</strong> this."
  ],

  calm: [
    "Let's <strong>stay</strong> with<br>this calm<br>for a moment.",
    "Notice the <strong>quietness</strong><br>that is already here.",
    "You don't need to<br>search for <strong>anything else</strong><br>right now.",
    "You can <strong>return</strong><br>to this feeling<br>when you need it."
  ],

  sadness_joy: [
    "Let's <strong>stay</strong> with<br>this mixed feeling<br>for a moment.",
    "Something here may feel<br>both <strong>warm</strong><br>and <strong>tender</strong>.",
    "You don't have to <strong>separate</strong><br>the sadness<br>from the joy.",
    "Let this feeling be<br><strong>gentle</strong><br>and <strong>complex</strong>."
  ],

  joy_anger: [
    "Let's <strong>stay</strong> with<br>this charged feeling<br>for a moment.",
    "There may be <strong>brightness</strong> here,<br>but also <strong>tension</strong>.",
    "<strong>Notice</strong> where this energy<br>is sitting<br>in your body.",
    "You do not have to<br><strong>rush</strong> with it."
  ],

  fear_anger: [
    "Let's <strong>stay</strong> with<br>this tense feeling<br>gently.",
    "There may be unease here,<br>along with a need<br>to <strong> protect</strong> yourself.",
    "<strong>Notice</strong> what feels<br>tight or alert<br>in your body.",
    "You do not have to<br>solve everything<br><strong>right now</strong>."
  ],

  sadness_fear: [
    "Let's <strong>stay</strong> with<br>this feeling<br>gently.",
    "There may be <strong>sadness</strong> here,<br>along with <strong>unease</strong>.",
    "<strong>Notice</strong> what feels<br>heavy, tender,<br>or uncertain.",
    "You do not have to<br>carry all of it<br><strong>at once</strong>."
  ],

  complete: [
    "<strong>Thank you</strong> for<br>taking a moment<br>for <strong>yourself</strong>."
  ]
};

//============================
// Guidance helper funcitons
//============================

function initialiseGuidanceScreen() {
  currentGuidanceStep = 0;
  isGuidanceComplete = false;
  isGuidanceTextChanging = false;

  if (guidanceScreen) {
    guidanceScreen.classList.remove("is-complete");
  }

  if (completionOptions) {
    hideElement(completionOptions);
  }

  if(guidanceHint) {
    showElement(guidanceHint);
  }

  if (guidanceText) {
    guidanceText.classList.remove("text-changing");
  }

  showGuidanceWithStep(currentGuidanceStep);
}

function getCurrentGuidanceBranch() {
  if (!currentEmotionState || !currentEmotionState.type) {
    return "calm";
  }

  if (!guidanceCopy[currentEmotionState.type]) {
    return "calm";
  }

  return currentEmotionState.type;
}

function clearGuidancePositionClasses() {
  if (!guidanceText) {
    return;
  }

  guidancePositions.forEach(function (positionClass) {
    guidanceText.classList.remove(positionClass);
  });
}

function applyGuidanceBackground(stepIndex) {
  if (!guidanceScreen) {
    return;
  }

  const branch = getCurrentGuidanceBranch();
  const colour = guidanceColours[branch];
  const strength = guidanceStrengths[stepIndex];

  guidanceScreen.style.setProperty("--guidance-rgb", colour);
  guidanceScreen.style.setProperty("--guidance-strength", strength);
}

function showGuidanceWithStep(stepIndex) {
  if (!guidanceText || !guidanceScreen) {
    return;
  }

  const branch = getCurrentGuidanceBranch();
  const currentCopy = guidanceCopy[branch];

  guidanceText.innerHTML = currentCopy[stepIndex];

  clearGuidancePositionClasses();
  guidanceText.classList.add(guidancePositions[stepIndex]);

  applyGuidanceBackground(stepIndex);
}

function changeGuidanceStepTo(stepIndex) {
  if (!guidanceText || isGuidanceTextChanging) {
    return;
  }

  isGuidanceTextChanging = true;
  guidanceText.classList.add("text-changing");

  setTimeout(function () {
    currentGuidanceStep = stepIndex;
    showGuidanceWithStep(currentGuidanceStep);

    requestAnimationFrame(function () {
      guidanceText.classList.remove("text-changing");
      isGuidanceTextChanging = false;
    });
  }, 340);
}

function showGuidanceComplete() {
  if (!guidanceScreen || !guidanceText) {
    return;
  }

  isGuidanceComplete = true;
  isGuidanceTextChanging = true;

  guidanceText.classList.add("text-changing");

  setTimeout(function () {
    clearGuidancePositionClasses();
    guidanceScreen.classList.add("is-complete");
    guidanceText.innerHTML = guidanceCopy.complete[0];

    hideElement(guidanceHint);
    showElement(completionOptions);

    requestAnimationFrame(function () {
      guidanceText.classList.remove("text-changing");
      isGuidanceTextChanging = false;
    });
  }, 340);
}

function moveToNextGuidanceStep() {
  if (isGuidanceComplete || isGuidanceTextChanging) {
    return;
  }

  if (currentGuidanceStep >= guidancePositions.length - 1) {
    showGuidanceComplete();
    return;
  }

  changeGuidanceStepTo(currentGuidanceStep + 1);
}

//============================
// Guidance Interactions
//============================

if (guidanceScreen && guidanceText) {
  guidanceScreen.addEventListener("click", function() {
    moveToNextGuidanceStep();
  })
}

if (completionOptions) {
  completionOptions.addEventListener("click", function (event) {
    event.stopPropagation();
  })
}

//=========================
// Memory Elements
//=========================

const finishCheckin = document.querySelector("#finishCheckin")
const memoryGrid = document.querySelector("#memoryGrid");

const memoryCard = document.querySelector("#memoryCard");
const memoryCardText = document.querySelector("#memoryCardText");
const memoryCardTime = document.querySelector("#memoryCardTime");
const memoryContent = document.querySelector("#memoryContent");

const memoryCardDelete = document.querySelector("#memoryCardDelete");
const memoryRemoveCard = document.querySelector("#memoryRemoveCard");
const memoryRemoveCancel = document.querySelector("#memoryRemoveCancel");
const memoryRemoveConfirm = document.querySelector("#memoryRemoveConfirm");


//============================
// Save Current Memory
//============================

function getMemoryEmotionText(state) {
  const currentText = getEmotionResultText(state);

  return currentText
    .replace("There may be", "There was")
    .replace("may feel", "may have felt");
}

// Saves the selected emotion and body area to localStorage
// so it can appear later on the Memory page.
function saveCurrentMemory() {
  const newMemory = {
    emotionType: currentEmotionState.type,
    intensity: currentEmotionState.intensity,
    bodyArea: currentBodyState.area,
    emotionText: getMemoryEmotionText(currentEmotionState),
    createdAt: new Date().toISOString()
  };

  const savedMemories = 
    JSON.parse(localStorage.getItem("emotionMemories")) || [];

  // add the new thing to the first of an array
  savedMemories.unshift(newMemory);

  // Save the JSON string to a localStorage and call it "emotionMemories"
  localStorage.setItem("emotionMemories", JSON.stringify(savedMemories));
}

if (finishCheckin) {
  finishCheckin.addEventListener("click", function () {
    saveCurrentMemory();
  });
}

//===========================
// Read Saved Memories
//===========================

function getSavedMemories() {
  return JSON.parse(localStorage.getItem("emotionMemories")) || [];
}

function formatMemoryDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();

  const month = date.toLocaleString("en", {
    month: "short"
  });

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return day + " " + month + ", " + hour + ":" + minute;
}

//=======================
// Memory card
//=======================

const memoryCardColourClasses = [
  "memory-card-calm",
  "memory-card-sadness",
  "memory-card-joy",
  "memory-card-fear",
  "memory-card-anger",
  "memory-card-sadness-joy",
  "memory-card-joy-anger",
  "memory-card-fear-anger",
  "memory-card-sadness-fear"
];

function getMemoryCardColourClass(memory) {
  return "memory-card-" + memory.emotionType.replace("_", "-");
}

function applyMemoryCardColour(memory) {
  memoryCardColourClasses.forEach(function (className) {
    memoryCard.classList.remove(className);
  });

  memoryCard.classList.add(getMemoryCardColourClass(memory));
}

function getMemoryCardText(memory) {
  const bodyArea = bodyAreaCopy[memory.bodyArea];

  const emotionSentence = 
  memory.emotionText ||
  getMemoryEmotionText({
    type: memory.emotionType,
    intensity: memory.intensity
  });

  return emotionSentence + "\nYou noticed it around " + bodyArea + ".";
}

let activeMemoryIndex = null;
let isMemoryCardClosing = false;
let isMemoryCardChanging = false;
let isRemoveCardClosing = false;

function updateMemoryCardContent(memory) {
  memoryCardText.textContent = getMemoryCardText(memory);
  memoryCardTime.textContent = formatMemoryDate(memory.createdAt);
}

function positionMemoryCard(memoryItem) {
  const cardGap = 18;
  const sideGap = 24;

  const contentRect = memoryContent.getBoundingClientRect();
  const itemRect = memoryItem.getBoundingClientRect();

  const cardWidth = memoryCard.offsetWidth;

  const itemCenterInContent =
    itemRect.left - contentRect.left + itemRect.width / 2;

  let cardLeft = itemCenterInContent - cardWidth / 2;

  const cardTop =
    itemRect.bottom - contentRect.top + memoryContent.scrollTop + cardGap;

  const minLeft = sideGap;
  const maxLeft = memoryContent.clientWidth - cardWidth - sideGap;

  cardLeft = clamp(cardLeft, minLeft, maxLeft);

  memoryCard.style.left = cardLeft + "px";
  memoryCard.style.top = cardTop + "px";
}

function changeMemoryCard(memory, memoryItem, memoryIndex) {
  isMemoryCardChanging = true;

  memoryCard.classList.add("card-closing");
  hideRemoveCard();

  setTimeout(function () {
    activeMemoryIndex = memoryIndex;

    updateMemoryCardContent(memory);
    applyMemoryCardColour(memory);
    positionMemoryCard(memoryItem);

    memoryCard.classList.remove("card-closing");

    requestAnimationFrame(function () {
      memoryCard.style.animation = "memory-card-enter 0.36s ease both";

      setTimeout(function () {
        memoryCard.style.animation = "";
        isMemoryCardChanging = false;
      }, 360);
    });
  }, 250);
}

function showMemoryCard(memory, memoryItem, memoryIndex) {
  if (!memoryCard || !memoryCardText || !memoryCardTime || !memoryContent) {
    return;
  }

  if (isMemoryCardClosing || isMemoryCardChanging) {
    return;
  }

  if (activeMemoryIndex === memoryIndex && !memoryCard.classList.contains("hidden")) {
    hideMemoryCard();
    return;
  }

  if (!memoryCard.classList.contains("hidden")) {
    changeMemoryCard(memory, memoryItem, memoryIndex);
    return;
  }

  activeMemoryIndex = memoryIndex;

  memoryCard.style.visibility = "hidden";
  showElement(memoryCard);
  memoryCard.classList.remove("card-closing");

  updateMemoryCardContent(memory);
  applyMemoryCardColour(memory);
  positionMemoryCard(memoryItem);

  requestAnimationFrame(function () {
    memoryCard.style.visibility = "visible";
  });
}

function hideMemoryCard() {
  if (!memoryCard || memoryCard.classList.contains("hidden") || isMemoryCardClosing) {
    return;
  }

  isMemoryCardClosing = true;

  memoryCard.classList.add("card-closing");
  hideRemoveCard();

  setTimeout(function () {
    hideElement(memoryCard);
    memoryCard.classList.remove("card-closing");
    memoryCard.style.visibility = "";
    activeMemoryIndex = null;
    isMemoryCardClosing = false;
  }, 250);
}

//==========================
// Render Memory Grid
//==========================


// Change JS emotion type to CSS class
function getMemoryBallClass(memory) {
  return "memory-ball-" + memory.emotionType.replace("_", "-");
}

function renderMemoryGrid() {
  if (!memoryGrid) {
    return;
  }

  const savedMemories = getSavedMemories();

  memoryGrid.innerHTML = "";

  savedMemories.forEach(function (memory, index) {
    const memoryItem = document.createElement("button");
    memoryItem.classList.add("memory-item");
    memoryItem.type = "button";

    const memoryBall = document.createElement("span");
    memoryBall.classList.add("memory-ball");
    memoryBall.classList.add(getMemoryBallClass(memory));

    const memoryDate = document.createElement("span");
    memoryDate.classList.add("memory-date");
    memoryDate.textContent = formatMemoryDate(memory.createdAt);

    memoryItem.appendChild(memoryBall);
    memoryItem.appendChild(memoryDate);

    memoryItem.addEventListener("click", function (event) {
      event.stopPropagation();
      showMemoryCard(memory, memoryItem, index);
    });

    memoryGrid.appendChild(memoryItem);
  })
}

renderMemoryGrid();

if (memoryContent) {
  memoryContent.addEventListener("click", function () {
    if (!memoryCard || memoryCard.classList.contains("hidden")) {
      return;
    }

    if (memoryRemoveCard && !memoryRemoveCard.classList.contains("hidden")) {
      return;
    }

    hideMemoryCard();
  });
}

if (memoryCard) {
  memoryCard.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

//==========================
// Remove Memory Card
//==========================

function showRemoveCard() {
  if (!memoryRemoveCard) {
    return;
  }

  memoryRemoveCard.classList.remove("confirm-closing");
  showElement(memoryRemoveCard);
}

function hideRemoveCard() {
  if (
    !memoryRemoveCard ||
    memoryRemoveCard.classList.contains("hidden") ||
    isRemoveCardClosing
  ) {
    return;
  }

  isRemoveCardClosing = true;
  memoryRemoveCard.classList.add("confirm-closing");

  setTimeout(function () {
    hideElement(memoryRemoveCard);
    memoryRemoveCard.classList.remove("confirm-closing");
    isRemoveCardClosing = false;
  }, 220);
}

function removeActiveMemory() {
  if (activeMemoryIndex === null) {
    return;
  }

  const savedMemories = getSavedMemories();

  savedMemories.splice(activeMemoryIndex, 1);

  localStorage.setItem("emotionMemories", JSON.stringify(savedMemories));

  hideMemoryCard();
  renderMemoryGrid();
}

if (memoryCardDelete) {
  memoryCardDelete.addEventListener("click", function (event) {
    event.stopPropagation();
    showRemoveCard();
  });
}

if (memoryRemoveCancel) {
  memoryRemoveCancel.addEventListener("click", function (event) {
    event.stopPropagation();
    hideRemoveCard();
  });
}

if (memoryRemoveConfirm) {
  memoryRemoveConfirm.addEventListener("click", function (event) {
    event.stopPropagation();
    removeActiveMemory();
  });
}