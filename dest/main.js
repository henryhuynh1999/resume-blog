var el1 = document.getElementsByTagName("body")[0];
el1.setAttribute("style", "overflow: hidden;");
function ready() {
  setTimeout(removeLoad, 3000);
}
function removeLoad() {
  var el = document.getElementById("shiba");
  el.setAttribute("style", "display: none;");
}
ready();
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);
console.log(vh);
window.addEventListener("mousemove", (event) => {
  console.log(event.clientX);
});
function customCursor(options) {
  let settings = $.extend(
      {
        targetClass: "custom-cursor", // create element with this class
        wrapper: $("body"), // jQuery
        speed: 0.1,
        movingDelay: 300, // fire event onStop after delay
        hasHover: false, // has hover events
        hoverTarget: $("a[href], button,h1"),
        touchDevices: false, // show on touch devices
        onMove: function (data) {},
      },
      options
    ),
    data = {},
    checkTouch =
      !settings.touchDevices &&
      "undefined" !== typeof document.documentElement.ontouchstart,
    timer = null;

  // exit
  if (checkTouch || !settings.wrapper.length) return;

  // append the ball
  settings.wrapper.append(`<div class="${settings.targetClass}"></div>`);

  let $cursor = $("." + settings.targetClass),
    position = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    mouse = { x: position.x, y: position.y },
    setX = gsap.quickSetter($cursor, "x", "px"),
    setY = gsap.quickSetter($cursor, "y", "px");

  // update data
  data.cursor = $cursor;

  // on mouse move
  window.addEventListener("mousemove", init);

  function init() {
    // remove default mousemove event
    window.removeEventListener("mousemove", init);

    // add new custom event
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;

      // update data and trigger event
      data.isMoving = true;
      settings.onMove(data);

      timer = setTimeout(function () {
        // update data and trigger event
        data.isMoving = false;
        settings.onMove(data);
      }, settings.movingDelay);
    });

    // fade out cursor
    document.addEventListener("mouseleave", (e) => {
      // update data and trigger event
      data.isInViewport = false;
      settings.onMove(data);
    });

    // update cursor's position
    document.addEventListener("mouseenter", (e) => {
      mouse.x = position.x = e.x;
      mouse.y = position.y = e.y;

      // update data and trigger event
      data.isInViewport = true;
      settings.onMove(data);
    });

    gsap.ticker.add((time, deltaTime) => {
      let fpms = 60 / 1000,
        delta = deltaTime * fpms,
        dt = 1 - Math.pow(1 - settings.speed, delta);
      position.x += (mouse.x - position.x) * dt;
      position.y += (mouse.y - position.y) * dt;
      setX(position.x);
      setY(position.y);
    });

    data.isInViewport = true;
  }

  // on hover
  if (settings.hasHover && settings.hoverTarget.length) {
    setTimeout(function () {
      settings.hoverTarget.hover(
        function () {
          data.hoverTarget = $(this);
          data.isHover = true;
          settings.onMove(data);
        },
        function () {
          data.hoverTarget = $(this);
          data.isHover = false;
          settings.onMove(data);
        }
      );
    }, 100);
  }
}

// big ball
customCursor({
  hasHover: true,
  onMove: function (data) {
    if (data.isInViewport) {
      // in viewport
      if (data.isMoving) {
        if (data.isHover) {
          gsap.to(data.cursor, { opacity: 1, scale: 1.5 });
        } else {
          gsap.to(data.cursor, { opacity: 0.5, scale: 0.8 });
        }
      } else {
        if (data.isHover) {
          gsap.to(data.cursor, { opacity: 1, scale: 1.5 });
        } else {
          gsap.to(data.cursor, { opacity: 0.5, scale: 1 });
        }
      }
    } else {
      // out viewport
      gsap.to(data.cursor, { opacity: 0, scale: 0 });
    }
  },
});

// dot inside
customCursor({
  targetClass: "custom-cursor-dot",
  speed: 0.5,
  onMove: function (data) {
    if (data.isInViewport) {
      gsap.to(data.cursor, { opacity: 1 });
    } else {
      gsap.to(data.cursor, { opacity: 0 });
    }
  },
});
