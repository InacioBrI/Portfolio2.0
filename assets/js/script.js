'use strict';

/**
 * Carrega todas as seções HTML dos arquivos em /sections antes de inicializar
 * os comportamentos (navegação, modal, filtros, etc.). Isso exige que o site
 * rode em um servidor HTTP (ex.: Live Server, GitHub Pages), pois `fetch`
 * não funciona abrindo index.html direto pelo protocolo file://.
 */
async function loadSections() {
  const placeholders = document.querySelectorAll("[data-section][data-src]");
  await Promise.all(Array.from(placeholders).map(async (el) => {
    try {
      const res = await fetch(el.dataset.src);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      el.outerHTML = html;
    } catch (err) {
      console.error(`Falha ao carregar seção ${el.dataset.src}:`, err);
      el.innerHTML = `<p style="color:red">Erro ao carregar ${el.dataset.src}</p>`;
    }
  }));
}

function initPortfolio() {

  // element toggle function
  const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



  // sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // sidebar toggle functionality for mobile
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



  // testimonials variables
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // modal variable
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  // modal toggle function
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  // add click event to all modal items
  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();

    });

  }

  // add click event to modal close button
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);



  // project modal variables
  const projectItems = document.querySelectorAll("[data-project-item]");
  const projectModalContainer = document.querySelector("[data-project-modal-container]");
  const projectModalCloseBtn = document.querySelector("[data-project-modal-close-btn]");
  const projectOverlay = document.querySelector("[data-project-overlay]");
  const projectModalImg = document.querySelector("[data-project-modal-img]");
  const projectModalTitle = document.querySelector("[data-project-modal-title]");
  const projectModalCategory = document.querySelector("[data-project-modal-category]");
  const projectModalTech = document.querySelector("[data-project-modal-tech]");
  const projectModalText = document.querySelector("[data-project-modal-text]");
  const projectModalLink = document.querySelector("[data-project-modal-link]");

  const projectModalFunc = function () {
    if (!projectModalContainer) return;
    projectModalContainer.classList.toggle("active");
    projectOverlay.classList.toggle("active");
  }

  if (projectModalContainer) {
    for (let i = 0; i < projectItems.length; i++) {
      projectItems[i].addEventListener("click", function (event) {
        event.preventDefault();

        const title = this.dataset.projectTitle || "";
        const category = this.dataset.projectCategory || "";
        const tech = this.dataset.projectTech || "";
        const description = this.dataset.projectDescription || "";
        const img = this.dataset.projectImg || "";
        const url = this.dataset.projectUrl || "";

        projectModalImg.src = img;
        projectModalImg.alt = title;
        projectModalTitle.textContent = title;
        projectModalCategory.textContent = category;
        projectModalTech.textContent = tech;
        projectModalText.innerHTML = `<p>${description}</p>`;

        if (url) {
          projectModalLink.href = url;
          projectModalLink.style.display = "";
          projectModalLink.removeAttribute("aria-disabled");
        } else {
          projectModalLink.href = "#";
          projectModalLink.style.display = "none";
        }

        projectModalFunc();
      });
    }

    projectModalCloseBtn.addEventListener("click", projectModalFunc);
    projectOverlay.addEventListener("click", projectModalFunc);
  }



  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  select.addEventListener("click", function () { elementToggleFunc(this); });

  // add event in all select items
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {

      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);

    });
  }

  // filter variables
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {

    for (let i = 0; i < filterItems.length; i++) {

      if (selectedValue === "all") {
        filterItems[i].classList.add("active");
      } else if (selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }

    }

  }

  // add event in all filter button items for large screen
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {

      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }



  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  // add event to all form input field
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }

    });
  }



  // page navigation variables
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  // add event to all nav link
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {

      for (let i = 0; i < pages.length; i++) {
        if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
          pages[i].classList.add("active");
          navigationLinks[i].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          pages[i].classList.remove("active");
          navigationLinks[i].classList.remove("active");
        }
      }

    });
  }
}

// Inicia tudo após carregar as seções
loadSections().then(initPortfolio);
