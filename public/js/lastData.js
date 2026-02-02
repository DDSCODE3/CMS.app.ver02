// ! to show last courses and last users

const usersDataElem = document.querySelector(".users-data");
const usersTableBody = document.querySelector(".article-container");
const coursesTableBody = document.querySelector(".table-body");
const productsData_top = document.querySelector(".products-data_top");
const productsData_bottom = document.querySelector(".products-data_bottom");
const removeModalScreen = document.querySelector(".remove-modalScreen");
const rejectDELETE = document.querySelector(".reject-DELETE");
const acceptDELETE = document.querySelector(".accept-DELETE");
const productsData = document.querySelector(".products-data");

let courseIdToRemove = null;

const showModal = (courseID) => {
  removeModalScreen.classList.remove("hidden");
  courseIdToRemove = courseID;
};

const hideModal = () => {
  removeModalScreen.classList.add("hidden");
};

const showLastUsers = (users) => {
  usersTableBody.innerHTML = "";
  users.forEach((user) => {
    usersTableBody.insertAdjacentHTML(
      "beforeend",
      `
        <article>
            <span class="icon-card">
                <i class="fa-solid fa-user"></i>
            </span>
            <div>
                <p class="user-name">${user.firstname}</p>
                <p class="user-email">${user.email}</p>
            </div>
        </article>
      `,
    );
  });
};

const showLastCourses = (courses) => {
  coursesTableBody.innerHTML = "";
  courses.forEach((cours) => {
    coursesTableBody.insertAdjacentHTML(
      "beforeend",
      `<div class="tableRow">
         <p class="product-title">${cours.title}</p>
         <p class="product-price">${cours.price.toLocaleString()}</p>
         <p class="product-shortName">${cours.registersCount}</p>
         <div class="product-manage">
           </button>
           <button class="remove-btn" onclick="showModal('${cours._id}')">
             <!-- Delete fas icon -->
             <i class="fas fa-trash-alt"></i>
           </button>
         </div>
        </div>
        
        `,
    );
  });
};

const removeCourse = (courseID) => {
  fetch(`https://js-cms.iran.liara.run/api/courses/${courseIdToRemove}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        console.log(courseID);
        showToast("failed", "حذف دوره با مشکل مواجه شد");
        throw new Error("Delete failed");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Course deleted:", data);
      fetchNewData();
      showToast("success", "دوره با موفقیت حذف شد");
      hideModal();
    })
    .catch((err) => console.error(err));
};

const fetchNewData = () => {
  showLoading();
  // fetch اول برای users
  fetch("https://js-cms.iran.liara.run/api/users")
    .then((response) => response.json())
    .then((usersData) => {
      const lastUsers = usersData.slice(-5);
      usersDataElem.innerHTML = usersData.length;
      showLastUsers(lastUsers);
    })
    .catch(() => {
      showEmptyState(".table-body", "کاربری");
      showToast("failed", "در دریافت اطلاعات  کاربران از سرور مشکلی وجود دارد");
    })
    .finally(() => {
      hideLoading();
    });
  // fetch دوم برای courses
  fetch("https://js-cms.iran.liara.run/api/courses")
    .then((response) => response.json())
    .then((coursesData) => {
      const lastCourses = coursesData.slice(-5);
      productsData_top.innerHTML = coursesData.length;
      productsData_bottom.innerHTML = coursesData.length;
      showLastCourses(lastCourses);
    })
    .catch(() => {
      showEmptyState(".article-container", "دوره ای");
      showToast("failed", "در دریافت اطلاعات دوره هااز سرور مشکلی وجود دارد");
    })
    .finally(() => {
      hideLoading();
    });
};

window.addEventListener("load", fetchNewData);
rejectDELETE.addEventListener("click", hideModal);
acceptDELETE.addEventListener("click", removeCourse);
