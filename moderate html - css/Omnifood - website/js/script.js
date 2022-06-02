///// nav--open
///////////////////////////////////////////////////////////
//Mobile navigation
const btnMobileNav = document.querySelector(".nav__mobile");
const header = document.querySelector(".header");

btnMobileNav.addEventListener("click", function () {
  header.classList.toggle("nav--open"); //toggle will add and remove
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
//Smooth scrolling
const allLinks = document.querySelectorAll("a:link");
//console.log(allLinks);
allLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    //console.log(event);
    event.preventDefault();
    const href = link.getAttribute("href");
    //console.log(href);

    //Scroll back to top
    if (href == "#") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    //Scroll to other links
    if (href != "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      // console.log(sectionEl);
      sectionEl.scrollIntoView({
        behavior: "smooth",
      });
    }

    if (link.classList.contains("nav__list__item__link")) {
      header.classList.toggle("nav--open"); //toggle will add and remove
    }
  });
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
//Sticky
const sectionElHero = document.querySelector(".section--hero");
const observer = new IntersectionObserver(
  function (entries) {
    const arrEntry = entries[0];
    console.log(arrEntry);

    if (arrEntry.isIntersecting == false) {
      header.classList.toggle("nav--sticky");
    } else {
      header.classList.remove("nav--sticky");
    }
  },
  {
    //In the viewport
    root: null,
    threshold: 0.1, //When the section hero is 10% VP
    rootMargin: "-80px", // height of the sticky
  }
);

observer.observe(sectionElHero);
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

// https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js

/*
.no-flexbox-gap .main-nav-list li:not(:last-child) {
  margin-right: 4.8rem;
}

.no-flexbox-gap .list-item:not(:last-child) {
  margin-bottom: 1.6rem;
}

.no-flexbox-gap .list-icon:not(:last-child) {
  margin-right: 1.6rem;
}

.no-flexbox-gap .delivered-faces {
  margin-right: 1.6rem;
}

.no-flexbox-gap .meal-attribute:not(:last-child) {
  margin-bottom: 2rem;
}

.no-flexbox-gap .meal-icon {
  margin-right: 1.6rem;
}

.no-flexbox-gap .footer-row div:not(:last-child) {
  margin-right: 6.4rem;
}

.no-flexbox-gap .social-links li:not(:last-child) {
  margin-right: 2.4rem;
}

.no-flexbox-gap .footer-nav li:not(:last-child) {
  margin-bottom: 2.4rem;
}

@media (max-width: 75em) {
  .no-flexbox-gap .main-nav-list li:not(:last-child) {
    margin-right: 3.2rem;
  }
}

@media (max-width: 59em) {
  .no-flexbox-gap .main-nav-list li:not(:last-child) {
    margin-right: 0;
    margin-bottom: 4.8rem;
  }
}
*/
