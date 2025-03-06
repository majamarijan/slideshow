// all code provied by @WebDevAcademy
let slideshowWidth;

window.onload = () => {
  const slideshow = document.querySelector(".slideshow");
  const select = document.querySelector("#select");
  let val = select.value;

  if (select) {
    select.onchange = (e) => {
      console.log(e.target.value)
      val = e.target.value;
      document.querySelector(".content").innerHTML = "";
      document.querySelector(".slider").innerHTML = "";
      controlData(val);
    };
  }
  controlData(val);
  slideshowWidth = slideshow.getBoundingClientRect().width;
};

async function fetchData(val) {
  const res = await fetch("https://www.freetestapi.com/api/v1/"+val+'?limit=25');
  const json = await res.json();
  return json;
}

function controlData(val) {
    fetchData(val).then((data) => {
    buildUISlider(data);
    displayContent(data[0]);
    sliderController();
  });
}

window.onresize = () => {
  slideshowWidth = document
    .querySelector(".slideshow")
    .getBoundingClientRect().width;
};

function buildUISlider(data) {
  const slider = document.querySelector(".slider");
  if (data.length > 0) {
    data.forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class='cardWrapper'>
          <img src=${d.image} alt=${d.name} />
          <p class='text'>${d.name}</div>
        </div>
      `;
      slider.append(card);
      card.onclick = () => {
        displayContent(d);
      };
    });
  }
}

function displayContent(item) {
  const content = document.querySelector(".content");
  const awards =
    typeof item.awards === "object"
      ? item.awards.map((a) => `<li>${a}</li>`).join("")
      : item.awards
          .split(",")
          .map((a) => `<li>${a}</li>`)
          .join("");
  const movies = item.known_for
    ? item.known_for.map((k) => `<li>${k}</li>`).join("")
    : item.most_famous_movies.map((k) => `<li>${k}</li>`).join("");
  content.innerHTML = `
    <div class='contentWrapper contentFadeIn' id=${item.id}>
        <img src=${item.image} alt=${item.name} title=${item.name} />
      <div class='contentInfo'>
      <div class='group'>
        <h2>${item.name} <br />(${item.birth_year}-${
    item.death_year ? item.death_year : ""
  })</h2>
        <p class='bio'>${item.biography}</p>
        </div>
         <div class='group'>
        <h3>Awards</h3>
        <ul>
          ${awards}
        </ul>
        </div>
         <div class='group'>
        <h3>Movies</h3>
        <ul>
          ${movies}
        </ul>
        </div>
      </div>
    </div>
  `;
}

function sliderController() {
  const buttons = document.querySelectorAll(".btn");
  const slider = document.querySelector(".slider");
  const slideshow = document.querySelector(".slideshow");
  const card = document.querySelector(".slider .card");
  const cardWidth = card.getBoundingClientRect().width;
  let numberOfCardsToMove,
    gap = Number(getComputedStyle(slider).gap.replace(/\D/g, "")),
    inc = 0,
    left = 0;
  slider.style.left = "0px";
  Array.from(buttons).forEach((btn) => {
    if (btn.className.includes("forward")) {
      btn.onclick = () => {
        numberOfCardsToMove = Math.floor(slideshowWidth / cardWidth);
        const cardsToShow =
          cardWidth * numberOfCardsToMove + gap * numberOfCardsToMove;
        if (
          Math.ceil(slider.getBoundingClientRect().width + inc) <
          slideshow.getBoundingClientRect().width
        ) {
          inc = 0;
        } else {
          inc -= cardsToShow;
        }
        slider.style.left = inc + "px";
      };
    } else {
      btn.onclick = () => {
        numberOfCardsToMove = Math.floor(slideshowWidth / cardWidth);
        const cardsToShow =
          cardWidth * numberOfCardsToMove + gap * numberOfCardsToMove;
        left = Number(getComputedStyle(slider).left.replace(/\D+$/, ""));
        if (left >= 0) {
          slider.style.left = "0px";
        } else {
          inc += cardsToShow;
          slider.style.left = inc + "px";
        }
      };
    }
  });
}
