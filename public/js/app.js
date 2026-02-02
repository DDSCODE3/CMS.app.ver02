//* Cms -> Content Management System

const data = {
  users: [
    {
      id: 1,
      name: "پیمان احمدی",
      username: "peyman",
      email: "peyman@gmail.com",
      password: "peyman1212",
    },
  ],

  products: [
    {
      id: 1,
      title: "کفش ورزشی",
      price: 2000000,
      slug: "nike-sport-shoe",
    },
  ],
};

const toggleMenu = document.querySelector(".toggle-sidebar");
const toast = document.querySelector(".toast");
const toastMessage = document.querySelector(".toast-content");
const toastProgress = document.querySelector(".process-bar");
const loader = document.getElementById("loader");
const themeButton = document.querySelector(".theme-button");
const htmlElemnt = document.documentElement;

toastProgress.style.width = "0%";

const showLoading = () => {
  loader.classList.remove("hidden");
};

const hideLoading = () => {
  loader.classList.add("hidden");
};

let currentTheme = "light";

const htmlElement = document.documentElement;

const saveThemeToLocalstorage = (theme) => {
  localStorage.setItem("theme", theme);
};

const getThemeFromLocalS = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    currentTheme = savedTheme;
    if (savedTheme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }
};

const changeTheme = () => {
  if (currentTheme === "light") {
    htmlElement.classList.add("dark");
    currentTheme = "dark";
  } else {
    htmlElement.classList.remove("dark");
    currentTheme = "light";
  }
  saveThemeToLocalstorage(currentTheme);
};

window.addEventListener("DOMContentLoaded", () => {
  getThemeFromLocalS();
});

const showToast = (status, message) => {
  toast.classList.remove("hidden");
  toastMessage.innerHTML = message;

  if (status === "success") {
    toast.className = "toast success";
  } else {
    toast.className = "toast failed";
  }

  let toastProgressCounter = 0;

  const toastProgressInterval = setInterval(() => {
    toastProgressCounter++;

    if (toastProgressCounter > 115) {
      toastProgress.style.width = "0%";
      toast.classList.add("hidden");
      clearInterval(toastProgressInterval);
    }

    toastProgress.style.width = `${toastProgressCounter}%`;
  }, 40);
};

function showEmptyState(containerSelector, dataName, action = "fetchNewData") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = "";
  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="empty-state">
      <div class="empty-state__content">
        <div class="empty-state__icon">
          <i class="fas fa-box-open"></i>
        </div>

        <h3 class="empty-state__title">
          ${dataName} برای نمایش وجود ندارد
        </h3>

        <p class="empty-state__description">
          در حال حاضر هیچ ${dataName} در سیستم ثبت نشده یا دریافت اطلاعات با مشکل مواجه شده است.
        </p>

        <button class="empty-state__action" onclick="${action}()">
          تلاش مجدد
        </button>
      </div>
    </div>
    `,
  );
}



toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});
themeButton.addEventListener("click", changeTheme);
