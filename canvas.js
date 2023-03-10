const canvas = document.querySelector("canvas");
const contentContainer = document.querySelector(".lms__content");
const canvas_container = document.querySelector(".canvas");
const thicknessPrompt = document.querySelector(".canvas__menu__icon__thickness");
const colorPrompt = document.querySelector(".canvas__menu__icon__colors");
const colorPromptContainer = document.querySelector(".canvas__menu__icon--color_picker");
const thicknessPromptContainer = document.querySelector(".canvas__menu__icon--thickness");
const colorPicker = document.querySelector(".canvas__menu__icon__color_selector__color");
const ctx = canvas.getContext("2d");

// resize
canvas.addEventListener("resize", () => {
    canvas.width = contentContainer.offsetWidth - 498;
    canvas.height = contentContainer.offsetHeight;
});

// click outside handler
document.addEventListener("click", (e) => {
    const isClickInsidePrompt = thicknessPromptContainer.contains(e.target);
    const isClickInsideColorPrompt = colorPromptContainer.contains(e.target);

    if (!isClickInsidePrompt) {
        thicknessPrompt.style.display = "none";
    }

    if (!isClickInsideColorPrompt) {
        colorPrompt.style.display = "none";
    }
});

// Make it visually fill the positioned parent

// ...then set the internal size to match


canvas.width = contentContainer.offsetWidth - 498;
canvas.height = contentContainer.offsetHeight;
ctx.scale(1, 1);

let plots = [];
let shapes = [];
let pointHistory = {};
const mousePos = {};
let strokeThickness = 1;
let currentColor = "black";
let isPainting = false;
let isDrawingCircle = false;
let isDrawingRectangle = false;
let isElementDragging = false;
let elem = null;

// draw functions

const drawline = (coords, thickness, color) => {
    let i;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    canvas.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (i = 1; i < coords.length - 2; i++) {
        // this.vueCanvasCtx.lineTo(coords[i].x, coords[i].y);
        var xc = (coords[i].x + coords[i + 1].x) / 2;
        var yc = (coords[i].y + coords[i + 1].y) / 2;
        ctx.quadraticCurveTo(coords[i].x, coords[i].y, xc, yc);
    }

    if (i >= 2) {
        // For the last 2 points
        ctx.quadraticCurveTo(coords[i].x, coords[i].y, coords[i + 1].x, coords[i + 1].y);
    }
    ctx.stroke();
};

// events
canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    mousePos.x = x;
    mousePos.y = y;

    if (isPainting) {
        plots.push({ x: x, y: y });

        shapes.push({
            type: "brush",
            coords: [...plots],
            color: currentColor,
            thickness: strokeThickness,
        });
    }

    if (isElementDragging) {
        elem.style.left = e.pageX - elem.offsetWidth / 2 + "px";
        elem.style.top = e.pageY - elem.offsetHeight / 2 + "px";
    }
});

canvas.addEventListener("mouseup", (e) => {
    plots = [];
    isPainting = false;
    elem = null;
    isElementDragging = false;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    pointHistory.end = { x, y };

    if (isDrawingCircle) {
        const distance = calculateDistance(pointHistory.start.x, pointHistory.end.x, pointHistory.start.y, pointHistory.end.y);
        drawArc(pointHistory.start.x, pointHistory.start.y, distance);
        shapes.push({
            type: "circle",
            x: pointHistory.start.x,
            y: pointHistory.start.y,
            radius: distance,
            thickness: strokeThickness,
            color: currentColor,
        });
        isDrawingCircle = false;
    }

    if (isDrawingRectangle) {
        drawRect(pointHistory.start.x, pointHistory.start.y, pointHistory.end.x, pointHistory.end.y);
        shapes.push({
            type: "rectangle",
            x1: pointHistory.start.x,
            y1: pointHistory.start.y,
            x2: pointHistory.end.x,
            y2: pointHistory.end.y,
            thickness: strokeThickness,
            color: currentColor,
        });
        isDrawingRectangle = false;
    }
    pointHistory = {};
});

canvas.addEventListener("mousedown", (e) => {
    if (isDrawingCircle || isDrawingRectangle) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        pointHistory.start = { x, y };
    } else {
        isPainting = true;
    }
});

const openThicknessPrompt = () => {
    thicknessPrompt.style.display = "flex";
};

const openColorPrompt = () => {
    console.log("hello world");
    colorPrompt.style.display = "flex";
};

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    plots = [];
    shapes = [];
    pointHistory = {};
    mousePos = {};
    isPainting = false;
    isDrawingCircle = false;
    isDrawingRectangle = false;
    isElementDragging = false;
    elem = null;
};

const setThickness = (thickness) => {
    if (thickness) {
        strokeThickness = thickness;
    }
};

const setColor = (color) => {
    currentColor = color;
    colorPicker.style.backgroundColor = color;
};

const drawCircle = () => {
    isDrawingRectangle = false;
    isDrawingCircle = true;
};

const drawRectangle = () => {
    isDrawingCircle = false;
    isDrawingRectangle = true;
};

const drawTextField = () => {
    const { x, y } = mousePos;
    const input = document.createElement("textarea");
    input.classList.add("canvas_input");
    input.setAttribute("placeholder", "متن را وارد کنید");
    input.style.top = `${x}px`;
    input.style.left = `${y}px`;

    input.addEventListener("mousedown", (e) => {
        isElementDragging = true;
        elem = e.target;
    });

    input.addEventListener("mouseup", () => {
        isElementDragging = false;
        elem = null;
    });

    canvas_container.appendChild(input);
};

const drawArc = (x, y, radius, thickness, color) => {
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

const drawRect = (x1, y1, x2, y2, thickness, color) => {
    const __x2 = x1 - x2;
    const __y2 = y1 - y2;

    ctx.beginPath();
    ctx.rect(x1, y1, __x2 * -1, __y2 * -1);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();
};

const calculateDistance = (x1, x2, y1, y2) => {
    const _x = Math.pow(x2 - x1, 2);
    const _y = Math.pow(y1 - y2, 2);
    return Math.sqrt(_x + _y);
};

const drawFrames = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        if (shape.type === "circle") {
            drawArc(shape.x, shape.y, shape.radius, shape.thickness, shape.color);
        }

        if (shape.type === "rectangle") {
            drawRect(shape.x1, shape.y1, shape.x2, shape.y2, shape.thickness, shape.color);
        }

        if (shape.type === "brush") {
            drawline(shape.coords, shape.thickness, shape.color);
        }
    }
};

const animate = () => {
    requestAnimationFrame(animate);
    drawFrames();

    if (isDrawingCircle && pointHistory.start.x && pointHistory.start.y) {
        // get current mousePosition
        const distance = calculateDistance(pointHistory.start.x, mousePos.x, pointHistory.start.y, mousePos.y);
        drawArc(pointHistory.start.x, pointHistory.start.y, distance);
    }

    if (isDrawingRectangle) {
        drawRect(pointHistory.start.x, pointHistory.start.y, mousePos.x, mousePos.y);
    }
};
animate();
