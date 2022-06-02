'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
// "querySelectorAll" is a node list
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const links = document.querySelectorAll('.nav__link');
const links2 = document.querySelector('.nav__links');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const openModal = function (event) {
  // the event does not get explicitly handled, its default action should not be taken as it normally would be.
  // This case is it href:# so it will default navigate to the top and now it's ignored
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// (ST) ANIMATION BY HOVERING ON NAV (FADE OUT)
// const handleHover = function (event, opacity) {
const handleHover = function (event) {
  // (!) "this" = value, in this case the opacity
  // event.currentTarget = is still the element (default is this the element but now it's overwritten)
  const link = event.target;

  if (link.classList.contains('nav__link')) {
    const parent = link.closest('.nav');
    const siblings = parent.querySelectorAll('.nav__link');
    const logo = parent.querySelector('img');

    // logo.style.opacity = opacity;
    logo.style.opacity = this;

    siblings.forEach(sibEl => {
      if (sibEl !== link) {
        // sibEl.style.opacity = opacity;
        sibEl.style.opacity = this;
      }
    });
  }
};
// mouseenter doesn't bobble (!)
// OPTION 1: still function in a function
// nav.addEventListener('mouseover', event => handleHover(event, 0.5));
// nav.addEventListener('mouseout', event => handleHover(event, 1));
// OPTION 2! It wil combine the 2 function in one! (cleanest way)
// Keep in mind blind can take only one argument (!)
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// (ST) SMOOTH SCROLL
// Here you will ad on each link the same EventListener
// not good for perfarmancy if you copy the same event!
// links.forEach(function (el) {
//   el.addEventListener('click', function (event) {
//     event.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     const section = document.querySelector(id);
//     section.scrollIntoView({ behavior: 'smooth' });
//   });
// });
// CLEAN SOLUTION FOR MULTIPLE SAME EVENT (!)
// EVENT DELEGATION
links2.addEventListener('click', function (event) {
  event.preventDefault();
  const target = event.target;

  if (target.classList.contains('nav__link')) {
    const id = target.getAttribute('href');
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

btnScrollTo.addEventListener('click', function (event) {
  // Return the cordination or the possition of the DOM element in the viewport
  // position can chnage of you scroll a little bit.
  // Values are in px's
  const stn1Rect = section1.getBoundingClientRect(); // DOMRect {x: 0, y: 1001, width: 679, height: 2232.1875, top: 1001, …}
  console.log(stn1Rect);
  // console.log(event.target.getBoundingClientRect());

  // The scroll to, counting from the top of the page
  // hard to explain, you have to play with it.
  // window.scrollTo(stn1Rect.left, stn1Rect.top);
  // FIX
  // for the top we do:
  //    take pos. section from top viewport + pos. scroll from top viewport
  //    = distance top from page & the section
  // window.scrollTo(
  //   stn1Rect.left + window.pageXOffset,
  //   stn1Rect.top + window.pageYOffset
  // );
  // FIX 2 + OBJECT (OLD SCHOOL)
  // window.scrollTo({
  //   left: stn1Rect.left + window.pageXOffset,
  //   top: stn1Rect.top + pageYOffset,
  //   behavior: 'smooth',
  // });
  // FIX 3 + OBJECT (MODERN WAY)
  section1.scrollIntoView({ behavior: 'smooth' });
});

// (ST) STICKY NAVIGATION
// BAD WAY (!)
// checking on each scroll position
/*
const sectionCords = section1.getBoundingClientRect();
window.addEventListener('scroll', function (event) {
  const scrollPos = window.scrollY;
  nav.classList.remove('sticky');

  if (scrollPos > sectionCords.top) {
    nav.classList.add('sticky');
  }
});
*/
// CLEANEST WAY = OBSERVER!
const navHeight = getComputedStyle(nav).height;
const stickyNav = function (entries) {
  const [ents] = entries;

  nav.classList.remove('sticky');

  if (!ents.isIntersecting) {
    nav.classList.add('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // Is the visseble size in the VP of the section for example
  rootMargin: `-${getComputedStyle(nav).height}`, // Margin where we get the height that is set in CSS
});

headerObserver.observe(header);

// (ST) TAP COMPONENT

tabsContainer.addEventListener('click', function (event) {
  const clickedTab = event.target.closest('.operations__tab');
  console.log(clickedTab);

  // if (clickedTab.classList.contains('operations__tab'))
  if (clickedTab) {
    // Clear all tabs
    tabs.forEach(tabs => tabs.classList.remove('operations__tab--active'));
    // Add class on clicked tab
    clickedTab.classList.add('operations__tab--active');

    // Activate content area
    const content = document.querySelector(
      `.operations__content--${clickedTab.dataset.tab}`
    );
    // const contentChilds = [...content.parentElement.children];
    // contentChilds.forEach(contentChild =>
    //   contentChild.classList.remove('operations__content--active')
    // );
    tabsContent.forEach(tc =>
      tc.classList.remove('operations__content--active')
    );
    content.classList.add('operations__content--active');
  }
});

// (ST) SHOWING SECTION WITH OBSERVER
const sections = document.querySelectorAll('.section');
const sectionFunc = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    const section = entry.target;
    section.classList.remove('section--hidden');
    observer.unobserve(section); // This will stop the observer for that specific section BETTER performancy!
  }
};
const sectionObserver = new IntersectionObserver(sectionFunc, {
  root: null,
  threshold: 0.2,
});

sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// (ST) LAZY LOADING IMAGES WITH OBSERVER
// Very usefull for performancy
const images = document.querySelectorAll('img[data-src]'); // It will get all the elements with the data attribute (i)

const imgFunc = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    const img = entry.target;
    img.src = img.dataset.src;
    // Import to show the image only when it is full loaded (!)
    img.addEventListener('load', function () {
      img.classList.remove('lazy-img');
    });

    observer.unobserve(img); // This will stop the observer for that specific section BETTER performancy!
  }
};
const imgObserver = new IntersectionObserver(imgFunc, {
  root: null,
  threshold: 0,
});

images.forEach(img => imgObserver.observe(img));

// (ST) SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let currentSlide = 0;
  let maxSlides = slides.length;

  const creatDots = function () {
    slides.forEach((_, idx) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide= ${idx}></button>`
      );
    });
  };
  const activeDot = function (slideId = 0) {
    const dot = document.querySelector(`.dots__dot[data-slide="${slideId}"]`);
    const dots = document.querySelectorAll('.dots__dot');

    dots.forEach(dot => dot.classList.remove('dots__dot--active'));
    dot.classList.add('dots__dot--active');
  };
  const goToSlide = function (curSlide = 0) {
    slides.forEach((slide, idx) => {
      // console.log(slide, idx);
      slide.style.transform = `translateX(${100 * (idx - curSlide)}%)`;
    });
  };
  const nextSlide = function () {
    currentSlide++;

    if (currentSlide === maxSlides) {
      currentSlide = 0;
    }

    goToSlide(currentSlide);
    activeDot(currentSlide);
  };
  const prevSlide = function () {
    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = maxSlides - 1;
    }

    goToSlide(currentSlide);
    activeDot(currentSlide);
  };
  const init = function () {
    goToSlide();
    creatDots();
    activeDot();
  };

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (event) {
    // if (event.key === 'ArrowLeft') {
    //   prevSlide();
    // } else if (event.key === 'ArrowRight') {
    //   nextSlide();
    // }
    event.key === 'ArrowLeft' && prevSlide();
    event.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (event) {
    const dot = event.target;

    if (dot.classList.contains('dots__dot')) {
      const slideId = dot.dataset.slide;
      currentSlide = slideId;
      goToSlide(slideId);
      activeDot(slideId);
    }
  });
};

slider();

/*
  (T) HOW TO SELECTING DOM ELEMENTS
*/
/*
// It will return the entire document (HTML) page
console.log(document.documentElement);
// It will return the "head" of the document
console.log(document.head);
// It return a one first DOM element linked with that class .header
// header = element, .header = class, #header = id
console.log(document.querySelector('.header'));
// It return a nodelist with multiple DOM element linked with that class .section
// It's NOT updating automaticly when you remove a section!
console.log(document.querySelectorAll('.section'));
// It will return the "body" of the document
console.log(document.body);
// It will return the DOM element by "id"
console.log(document.getElementById('section--1'));
// It return a HTML collection with multiple DOM element by the "tag name" button
// It's updating automaticly!
console.log(document.getElementsByTagName('button'));
// It return a HTML collection with multiple DOM element by the "class name" btn
// It's updating automaticly!
console.log(document.getElementsByClassName('btn'));
*/

/*
  (T) HOW TO CREATING AND INSERTING DOM ELEMENTS
*/
/*
const html = `
<div class="movements__row">
  <div class="movements__type movements__type--${class}">
    ${value}
  </div>
  <div class="movements__value">
    ${value} €
  </div>
</div>
`;
(i) It will insert or create the temp html into the DOM
  'beforebegin': Before the element itself.
  'afterbegin': Just inside the element, before its first child.
  'beforeend': Just inside the element, after its last child.
  'afterend': After the element itself.

  => DOMelement.insertAdjacentHTML('afterbegin', html);
*/

const msg = document.createElement('div');
msg.classList.add('cookie-message');
msg.textContent = 'We used cookies for improved functionality and analytics.';
msg.innerHTML =
  'We used cookies for improved functionality and analytics. <button class="btn btn--close-cookies">Got it!</button>';

// DOM element is unique so can't use them on different place so, you have to "clone" it (!)

// (ST) INSERT (CREATING)
// It will add the DOM element "msg" on the "first" child of the parent (header) DOM element
// header.prepend(msg);

// It will add the DOM element "msg" on the "last" child of the parent (header) DOM element
header.append(msg);
// header.append(msg.cloneNode(true)); // copied!

// It will add the DOM element "msg", before the header DOM element as a sibling
// header.before(msg);

// It will add the DOM element "msg", after the header DOM element as a sibling
// header.after(msg);

// (ST) REMOVE (DELETING)
/*
const btnCloseCook = document.querySelector('.btn--close-cookies');
btnCloseCook.addEventListener('click', function () {
  // NEW ES6
  // msg.remove();
  // OLD
  msg.parentElement.removeChild(msg);
});
*/

/*
  (T) STYLES, ATTRIBUTES AND CLASSES
*/
/*
// (ST) GET / SET DOM ELEMENT STYLES
// Those are inline styles directly in the DOM element
// It will change the "background color" of the DOM element
msg.style.backgroundColor = '#37383d'; // rgb(55, 56, 61)
// It will change the "width" of the DOM element
msg.style.width = '120%';
// Get style ONLY by inline style in the DOM element (not in a class)
console.log(msg.style.backgroundColor);
// Get style that is linked from a / different classes or even if there no style related.
console.log(getComputedStyle(msg).color); // rgb(187, 187, 187)
console.log(getComputedStyle(msg).height); // 50px
msg.style.height =
  Number.parseFloat(getComputedStyle(msg).height, 10) + 30 + 'px';
// We need to the nomber from the string 50px => 50
// console.log(Number.parseFloat(getComputedStyle(msg).height, 10) + 30 + 'px');
*/
/*
// (ST) SET ROOT VARIABLES STYLES
document.documentElement.style.setProperty('--color-primary', 'orangered');
*/
/*
// (ST) GET / SET DOM ELEMENT ATTRIBUTES
const logo = document.querySelector('.nav__logo');
const btnLink = document.querySelector('.nav__link--btn');

// GET
// Only standad property
console.log(logo.alt); // Bankist logo
logo.alt = 'Beautiful minimalist logo';
console.log(logo.className); //nav__logo
// Undifened not a standard property
console.log(logo.designer); // undefined
// Fix
console.log(logo.getAttribute('designer')); // Chiel

// Absolute URL (Full url)
console.log(logo.src); // http://127.0.0.1:8080/13-Advanced-DOM-Bankist/starter/img/logo.png
console.log(btnLink.href); // http://127.0.0.1:8080/13-Advanced-DOM-Bankist/starter/#
// Relative URL
console.log(logo.getAttribute('src')); // img/logo.png
console.log(btnLink.getAttribute('href')); // #

// DATA ATTRIBUTES: Special onces, attributes that starts with data f.e. data-version-number
console.log(logo.dataset.versionNumber); // 3.0

// SET
// Adding attributes
logo.setAttribute('Company', 'Bankist');
*/
/*
// (ST) GET / SET DOM ELEMENT CLASSES
// Classes
// Those are fake class names (just examples)
logo.classList.add('add', 'add2'); // Mulitple option
logo.classList.remove('remove', 'remove2'); // Mulitple option
logo.classList.toggle('toggle');
logo.classList.contains('contains');
*/
/*
  (T) HOW TO GET THE COORDINATION
*/
/*
// (ST) COORDINATION OF A DOM ELEMENT
// Return the cordination or the possition between the DOM element and the viewport
// position can chnage of you scroll a little bit.
// Values are in px's
const stn1Rect = section1.getBoundingClientRect(); // DOMRect {x: 0, y: 1001, width: 679, height: 2232.1875, top: 1001, …}
console.log(stn1Rect);
// console.log(event.target.getBoundingClientRect());
*/
// (ST) COORDINATION WHEN YOU SCROLL
// (Y) It give the current possition between the top of the viewport and the top of the page
console.log('Current scrool(X/Y):', window.pageXOffset, window.pageYOffset); // Current scrool(X/Y): 0 495
/*
// (ST) GET RECTANGLE SIZE OF THE VIEWPORT H-W
// (Y) It give the rectangle size of the viewport when you make it smaller or bigger
console.log(
  'height/width viewport:',
  document.documentElement.clientHeight,
  document.documentElement.clientWidth
); // height/width viewport: 986 679
*/
/*
  (T) TYPES OF EVENTS AND EVENT HANDLERS
*/
/*
// (i) Documentation that can be very usefull!
// https://developer.mozilla.org/en-US/docs/Web/Events?retiredLocale=nl (!)
// https://www.w3schools.com/jsref/dom_obj_event.asp (!)
const h1 = document.querySelector('h1');
const alertH1 = function (event) {
  alert('Your mouse is enter the H1 DOM element');

  // That will give the possebility to show the alert in this case one time
  h1.removeEventListener('mouseenter', alertH1);
};
// mouseenter is like a hovering in css
h1.addEventListener('mouseenter', alertH1);
// OLD SCHOOL
// h1.onmouseenter = function (event) {
//   alert('Your mouse is enter the H1 DOM element');
// };
*/
/*
// (ST) EVENT PROPAGATION: BUBBLING & CAPTURING
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const rdmColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

const navLink = document.querySelector('.nav__link');
navLink.addEventListener('click', function (event) {
  this.style.backgroundColor = rdmColor();
  // event.target is where the event is activated so in this case where it's clicked
  // event.currentTarget is where each event is activated and actualy the same as "this" keyword
  console.log('LINK:', event.target, event.currentTarget);

  // Stop the propagation it will not reach the parents events
  // IS NOT THE TO USE IT (!)
  // event.stopPropagation;
});

const navLinks = document.querySelector('.nav__links');
navLinks.addEventListener('click', function (event) {
  this.style.backgroundColor = rdmColor();
  // event.target is where the event is activated so in this case where it's clicked
  console.log('LINK:', event.target);
});

const nav = document.querySelector('.nav');
nav.addEventListener(
  'click',
  function (event) {
    this.style.backgroundColor = rdmColor();
    // event.target is where the event is activated so in this case where it's clicked
    console.log('LINK:', event.target);
  },
  true // Capturing it will showing event directly once he's going down from the DOM
);
*/

/*
  (T) DOM TRAVERSING
  // Walking through the dom
*/
/*
const h1 = document.querySelector('h1');

// (ST) DOWNWARDS: childs
console.log(h1.querySelectorAll('.highlight')); // NodeList(2) [span.highlight, span.highlight]
console.log(h1.childNodes); // NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]
// only for direct childrens
console.log(h1.children); // HTMLCollection(3) [span.highlight, br, span.highlight]

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orange';

// (ST) UPWARDS: childs
console.log(h1.parentNode);
// only for direct childrens
console.log(h1.parentElement); // div.header__title

// It will look to the closest .header parent element of the h1
h1.closest('.header').style.background = 'var(--gradient-secondary)';

// (ST) SIDEWAY: siblings
// It will check on he's previous sibling in the same parent block
console.log(h1.previousElementSibling);
// It will check on he's next sibling in the same parent block
console.log(h1.nextElementSibling);
// How to get all the childerens => go to the parent level => ask to the childeren
console.log(h1.parentElement.children);
*/

/*
  (T) OBSERVER
*/
// const obsCallBack = function (entries, observer) {
//   console.log(entries);
// };

// const obsOptions = {
//   root: null, // The root is the element that you want to intersection
//   threshold: [0, 0.2], // Threshold is range that you can gave to activate the callback function 10% [start,end] of viewport
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);

// observer.observe(section1);

/*
  (T) LIFECYCLE DOM EVENTS
*/
/*
// This is an option to do functions after the DOM is build
// BUT is actually the same if you put the JS script at the end of the HTML file
document.addEventListener('DOMContentLoaded', function (event) {
  console.log('HTML parsed and DOM tree built!', event);
});

// This event can be used when the page need fully loaded f.e. on images
window.addEventListener('load', function (event) {
  console.log('Page fully loaded', event);
});

// This event can be used when a user leave the page f.e. alert message
// Only if it's needed! f.e. when you don't wont lose data
window.addEventListener('beforeunload', function (event) {
  event.preventDefault();
  console.log(event);
  event.returnValue = ''; // This is important to add for this event
});
*/
