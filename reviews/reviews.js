const bg = document.getElementById("bg");
const rating = document.getElementById("rating");
const hotspots = document.querySelectorAll(".hotspot");

// only list a review once its 1_ and 2_ pngs are in the Images folder
const ready = ["spear", "pasta", "inciting"];

// horizontal position of each name: [left, width] in image pixels (same on every image)
const xs = {
  spear:    [925, 280],
  inciting: [940, 190],
  comics:   [930, 290],
  pasta:    [935, 240],
  pup:      [945, 220],
  girlish:  [975, 115]
};

// box heights in image pixels (Inciting Incident takes two lines)
const heights = { spear: 44, inciting: 60, comics: 44, pasta: 44, pup: 44, girlish: 44 };

// per image: gif = top edge of the gif, y = vertical CENTER of each name (all in image pixels)
const layouts = {
  "1_spear":    { gif: 1480, y: { spear: 852, inciting: 928, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
  "2_spear":    { gif: 1920, y: { spear: 825, inciting: 910, comics: 966, pasta: 1020, pup: 1092, girlish: 1172 } },
  "1_pasta":    { gif: 1020, y: { spear: 835, inciting: 919, comics: 977, pasta: 1031, pup: 1103, girlish: 1183 } },
  "2_pasta":    { gif: 1290, y: { spear: 845, inciting: 915, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
  "1_inciting": { gif: 1470, y: { spear: 844, inciting: 928, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
  "2_inciting": { gif: 2130, y: { spear: 836, inciting: 920, comics: 978, pasta: 1032, pup: 1104, girlish: 1184 } }
  // add "1_comics", "2_comics", etc. here when those pngs exist
};

let current = "spear";
let version = 1;

function place() {
  const key = `${version}_${current}`;
  const layout = layouts[key] || layouts["1_spear"]; // fallback until you add the new layout
  const w = bg.naturalWidth;
  const h = bg.naturalHeight;

  rating.style.top = (layout.gif / h * 100) + "%";

  hotspots.forEach((el) => {
    const name = el.dataset.review;
    if (name === current) {            // no link to the page you're already on
      el.style.display = "none";
      return;
    }
    const [x, width] = xs[name];
    const height = heights[name];
    const top = layout.y[name] - height / 2;

    el.style.display = "block";
    el.style.left = (x / w * 100) + "%";
    el.style.top = (top / h * 100) + "%";
    el.style.width = (width / w * 100) + "%";
    el.style.height = (height / h * 100) + "%";
  });
}

function render() {
  bg.src = `./Images/${version}_${current}.png`;
}

// reposition every time a new image finishes loading
bg.addEventListener("load", place);

rating.addEventListener("click", () => {
  version = version === 1 ? 2 : 1;
  render();
});

hotspots.forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.dataset.review;
    if (!ready.includes(target)) return;
    current = target;      // version is NOT reset, so you stay on 1 or 2
    render();
    window.scrollTo(0, 0);
  });
});

render();