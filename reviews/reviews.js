const bg = document.getElementById("bg");
const rating = document.getElementById("rating");
const hotspots = document.querySelectorAll(".hotspot");

// these are for the archive 
const archiveLink = document.getElementById("archive-link");
const back = document.getElementById("back");
let inArchive = false;

// link position on each inciting page, in image pixels (x = left edge, y = top edge)
const archiveSpots = {
  "1_inciting": { x: 413, y: 1392, w: 415, h: 30 },
  "2_inciting": { x: 428, y: 1934, w: 415, h: 30 }
};

// only list a review once its 1_ and 2_ pngs are in the Images folder, make sure they follow the pattern 
const ready = ["spear", "pasta", "inciting", "pup", "girlish"];

// horizontal position of each name, [left, width] in image pixels (same on every image)
// lowk annoying we need a better solution for this down the road 
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

// NOTE: next time, all navigation bars and pages need to be the same size and same place on a page
    // per image - gif = top edge of the gif, y = vertical CENTER of each name (all in image pixels)
    // optional gifX = horizontal center of the gif in image pixels (otherwise the CSS left value is used)
const layouts = {
    "1_spear":    { gif: 1480, y: { spear: 852, inciting: 928, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
    "2_spear":    { gif: 1920, y: { spear: 825, inciting: 910, comics: 966, pasta: 1020, pup: 1092, girlish: 1172 } },
    "1_pasta":    { gif: 1020, y: { spear: 835, inciting: 919, comics: 977, pasta: 1031, pup: 1103, girlish: 1183 } },
    "2_pasta":    { gif: 1290, y: { spear: 845, inciting: 915, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
    "1_inciting": { gif: 1425, y: { spear: 844, inciting: 928, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
    "2_inciting": { gif: 2130, y: { spear: 836, inciting: 920, comics: 978, pasta: 1032, pup: 1104, girlish: 1184 } },
  
    "1_pup":      { gif: 1420, y: { spear: 837, inciting: 921, comics: 979, pasta: 1033, pup: 1105, girlish: 1185 } },
    "2_pup":      { gif: 1300, gifW: 22, y: { spear: 844, inciting: 888, comics: 954, pasta: 1008, pup: 1076, girlish: 1165 } },
    "1_girlish":  { gif: 1560, y: { spear: 845, inciting: 922, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
    "2_girlish":  { gif: 1130, gifW: 22, y: { spear: 845, inciting: 922, comics: 986, pasta: 1040, pup: 1112, girlish: 1192 } },
};

let current = "spear";
let version = 1;

function place() {
    const key = `${version}_${current}`;
    const layout = layouts[key] || layouts["1_spear"]; 
    const w = bg.naturalWidth;
    const h = bg.naturalHeight;
    if (!w || !h) return; 

    // archive page
    if (inArchive) {
        rating.style.display = "none";
        archiveLink.style.display = "none";
        back.style.display = "block";
        hotspots.forEach((el) => (el.style.display = "none"));
        return;
    }
    rating.style.display = "";
    back.style.display = "none";
  
    // gif width: per-image gifW if set, otherwise the CSS width
    rating.style.width = layout.gifW ? layout.gifW + "%" : "";
  
    // shrink the gif if it's taller than the space below its top edge
    const scale = bg.clientWidth / w;           
    const room = (h - layout.gif) * scale;       
    if (room > 0 && rating.offsetHeight > room) {
      const wPct = rating.offsetWidth / bg.clientWidth * 100;
      rating.style.width = (wPct * room / rating.offsetHeight) + "%";
    }
  
    // horizontal: only override the CSS centering if this layout has its own gifX
    if (layout.gifX !== undefined) {
      rating.style.left = (layout.gifX / w * 100) + "%";
    } else {
      rating.style.left = "";  
    }
  
    // vertical: clamped so the gif never hangs off the bottom of the page - happened with girlish and pup a lot
    const gifHeightPct = bg.clientHeight ? rating.offsetHeight / bg.clientHeight * 100 : 0;
    const topPct = Math.min(layout.gif / h * 100, 100 - gifHeightPct);
    rating.style.top = topPct + "%";
  
    // clickable name boxes
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
    // clickable archive link (only exists on the inciting pages)
    const spot = archiveSpots[key];
    if (spot) {
        archiveLink.style.display = "block";
        archiveLink.style.left = (spot.x / w * 100) + "%";
        archiveLink.style.top = (spot.y / h * 100) + "%";
        archiveLink.style.width = (spot.w / w * 100) + "%";
        archiveLink.style.height = (spot.h / h * 100) + "%";
    } else {
        archiveLink.style.display = "none";
    }
}

function render() {
    bg.src = inArchive ? "./Images/archive.png" : `./Images/${version}_${current}.png`;
}


bg.addEventListener("load", place);
rating.addEventListener("load", place);
window.addEventListener("resize", place);

// gif toggles between version 1 and 2
rating.addEventListener("click", () => {
  version = version === 1 ? 2 : 1;
  render();
});

hotspots.forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.dataset.review;
    if (!ready.includes(target)) return;
    current = target;
    render();
    window.scrollTo(0, 0);
  });
});

// click handlers
archiveLink.addEventListener("click", () => {
    inArchive = true;
    render();
    window.scrollTo(0, 0);
  });
  
  back.addEventListener("click", () => {
    inArchive = false;
    render();
    window.scrollTo(0, 0);
  });

render();