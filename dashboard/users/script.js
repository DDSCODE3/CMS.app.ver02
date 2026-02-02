const usersTableBody = document.querySelector(".table-body");
const remove_userModal = document.querySelector(".remove_user-modalScreen");
const usersData = document.querySelector(".users-data");
const rejectDELETE = document.querySelector(".reject-DELETE");
const acceptDELETE = document.querySelector(".accept-DELETE");

// Create user
const createUserBtn = document.querySelector("#create-user");
const createUserModal = document.querySelector(".create-user-modalScreen");
const rejectCreateUserBtn = document.querySelector(".reject-create-user");
const acceptCreateUserBtn = document.querySelector(".accept-create-user");
const userFirstNameInput = document.querySelector("#user-firstName");
const userLastNameInput = document.querySelector("#user-lastName");
const userUsernameInput = document.querySelector("#user-username");
const userEmailInput = document.querySelector("#user-email");
const userAgeInput = document.querySelector("#user-age");
const userCityInput = document.querySelector("#user-city");

// update user data
const updeUserModal = document.querySelector(".update-user-modalScreen");
const userNewFirstName = document.querySelector(".user-new-firstName");
const userNewLastName = document.querySelector(".user-new-lastName");
const userNewUsername = document.querySelector(".user-new-username");
const userNewEmail = document.querySelector(".user-new-email");
const userNewAge = document.querySelector(".user-new-age");
const userNewCity = document.querySelector(".user-new-city");
const rejectUpdateUser = document.querySelector(".reject-update-user");
const acceptUpdateUser = document.querySelector(".accept-update-user");

// pagination
const usersPerPage = 10;
const paginationContainer = document.querySelector(".pagination");
let page = 1;
let coursesPerPage = 10;
let allUsers = [];

let userIdToRemove = null;
let userIdToUpdate = null;

// * این مودال برای پاک کردن کاربره
const showModal = (userId) => {
  remove_userModal.classList.remove("hidden");
  userIdToRemove = userId;
};
// * این مودال برای پاک کردن کاربره
const hideModal = () => {
  remove_userModal.classList.add("hidden");
};

const showCreatUserModal = () => {
  createUserModal.classList.remove("hidden");
};

const hideCreatUserModal = () => {
  createUserModal.classList.add("hidden");
};

const showUserUpdateModal = (userId) => {
  userIdToUpdate = userId;
  updeUserModal.classList.remove("hidden");
  setUserInputsValues();
};

const hideUserUpdateModal = () => {
  updeUserModal.classList.add("hidden");
};

const showUsers = (users) => {
  if (users.length === 0) {
    showEmptyState(".table-body", "کاربری");
    return;
  }
  console.log(1);

  usersTableBody.innerHTML = "";

  users.forEach(({ firstname, lastname, username, email, _id }) => {
    usersTableBody.insertAdjacentHTML(
      "beforeend",
      `
      <div class="tableRow">
        <p class="user-fullName">${firstname} ${lastname}</p>
        <p class="user-username">${username}</p>
        <p class="user-email">${email}</p>
        <p class="user-password">${_id}</p>
        <div class="product-manage">
          <button class="edit-btn" onclick="showUserUpdateModal('${_id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="remove-btn" onclick="showModal('${_id}')">
            <i class="fas fa-ban"></i>
          </button>
        </div>
      </div>
      `,
    );
  });
};

const buildUserPayload = ({
  firstNameInput,
  lastNameInput,
  usernameInput,
  emailInput,
  ageInput,
  cityInput,
}) => {
  const firstname = firstNameInput.value.trim();
  const lastname = lastNameInput.value.trim();
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const age = +ageInput.value;
  const city = cityInput.value.trim();

  if (!firstname) return { error: "نام الزامی است" };
  if (!lastname) return { error: "نام خانوادگی الزامی است" };
  if (!username) return { error: "نام کاربری الزامی است" };

  if (!email) return { error: "ایمیل الزامی است" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "فرمت ایمیل معتبر نیست" };

  if (!age || age <= 0) return { error: "سن معتبر وارد کنید" };
  if (!city) return { error: "شهر را وارد کنید" };

  return {
    data: {
      firstname,
      lastname,
      username,
      email,
      age,
      city,
    },
  };
};

const removeUser = (userId) => {
  showLoading();
  fetch(`https://js-cms.iran.liara.run/api/users/${userIdToRemove}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        console.log(userId);
        throw new Error("Delete failed");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Course deleted:", data);
      fetchNewData();
      showToast("success", "کاربر با موفقیت حذف شد");
      hideModal();
    })
    .catch(() => {
      showToast("failed", "کاربر حذف نشد !");
      hideModal();
    })
    .finally(() => {
      hideLoading();
    });
};

const updateUser = () => {
  const { data, error } = buildUserPayload({
    firstNameInput: userNewFirstName,
    lastNameInput: userNewLastName,
    usernameInput: userNewUsername,
    emailInput: userNewEmail,
    ageInput: userNewAge,
    cityInput: userNewCity,
  });

  if (error) {
    hideUserUpdateModal();
    showToast("failed", error);
    return;
  }
  showLoading();
  fetch(`https://js-cms.iran.liara.run/api/users/${userIdToUpdate}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      fetchNewData();
      showToast("success", "کاربر با موفقیت ویرایش شد");
      hideUserUpdateModal();
    })
    .catch(() => {
      showToast("failed", "بروزرسانی با مشکل مواجه شد");
      hideUserUpdateModal();
    })
    .finally(() => {
      hideLoading();
    });
};

const createUser = () => {
  const { data, error } = buildUserPayload({
    firstNameInput: userFirstNameInput,
    lastNameInput: userLastNameInput,
    usernameInput: userUsernameInput,
    emailInput: userEmailInput,
    ageInput: userAgeInput,
    cityInput: userCityInput,
  });

  if (error) {
    hideCreatUserModal();
    showToast("failed", error);
    return;
  }
  showLoading();
  fetch("https://js-cms.iran.liara.run/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      fetchNewData();
      hideCreatUserModal();
      showToast("success", "کاربر جدید با موفقیت ایجاد شد");
      clearUserInputs();
    })
    .catch(() => {
      showToast("failed", "مشکلی در ایجاد کاربر جدید وجود داره");
    })
    .finally(() => {
      hideLoading();
    });
};

const clearUserInputs = () => {
  userFirstNameInput.value = "";
  userLastNameInput.value = "";
  userUsernameInput.value = "";
  userEmailInput.value = "";
  userCityInput.value = "";
  userAgeInput.value = "";
};

const setUserInputsValues = () => {
  userNewFirstName.value = "";
  userNewLastName.value = "";
  userNewUsername.value = "";
  userNewEmail.value = "";
  userNewAge.value = "";
  userNewCity.value = "";
  fetch("https://js-cms.iran.liara.run/api/users")
    .then((res) => res.json())
    .then((data) => {
      const filteredUsers = data.filter((users) =>
        userIdToUpdate.includes(users._id),
      );
      currentUserToUpdate = filteredUsers[0];

      userNewFirstName.value = currentUserToUpdate.firstname;
      userNewLastName.value = currentUserToUpdate.lastname;
      userNewUsername.value = currentUserToUpdate.username;
      userNewEmail.value = currentUserToUpdate.email;
      userNewAge.value = currentUserToUpdate.age;
      userNewCity.value = currentUserToUpdate.city;
    })
    .catch(() => {
      showToast("failed", "مشکلی در دریافت اطلاعات وجود دارد");
      hideUserUpdateModal();
    });
};

const changePageHandler = (page) => {
  currentPage = page;

  const start = (page - 1) * usersPerPage;
  const end = start + usersPerPage;

  const usersToShow = allUsers.slice(start, end);
  showUsers(usersToShow);

  // active class
  document.querySelectorAll(".page").forEach((btn, index) => {
    btn.classList.toggle("active", index + 1 === page);
  });
};

const generatePagination = (users) => {
  const pagesCount = Math.ceil(users.length / usersPerPage);
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= pagesCount; i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li class="page ${i === 1 ? "active" : ""}"
          onclick="changePageHandler(${i})">
        ${i}
      </li>
      `,
    );
  }
};

const fetchNewData = () => {
  showLoading();

  fetch("https://js-cms.iran.liara.run/api/users")
    .then((response) => response.json())
    .then((data) => {
      allUsers = data; // ذخیره کاربران
      usersData.innerHTML = data.length;

      generatePagination(data);
      changePageHandler(1);
    })
    .catch(() => {
      showEmptyState(".table-body", "کاربری");
      showToast("failed", "در دریافت اطلاعات از سرور مشکلی وجود دارد");
    })
    .finally(() => {
      hideLoading();
    });
};

window.addEventListener("load", fetchNewData);
rejectDELETE.addEventListener("click", hideModal);
acceptDELETE.addEventListener("click", removeUser);
createUserBtn.addEventListener("click", showCreatUserModal);
rejectCreateUserBtn.addEventListener("click", hideCreatUserModal);
acceptCreateUserBtn.addEventListener("click", createUser);
rejectUpdateUser.addEventListener("click", hideUserUpdateModal);
acceptUpdateUser.addEventListener("click", updateUser);

// const users = [
//   {
//     firstname: "آرین",
//     lastname: "نیک‌فر",
//     username: "arian_nikfar",
//     email: "arian.nikfar@gmail.com",
//     age: 26,
//     city: "تهران",
//   },
//   {
//     firstname: "رها",
//     lastname: "دادگر",
//     username: "raha_dadgar",
//     email: "raha.dadgar@gmail.com",
//     age: 24,
//     city: "اصفهان",
//   },
//   {
//     firstname: "پارسا",
//     lastname: "بهرامی",
//     username: "parsa_bhrm",
//     email: "parsa.bahrami@gmail.com",
//     age: 28,
//     city: "شیراز",
//   },
//   {
//     firstname: "یاسمن",
//     lastname: "کوشا",
//     username: "yasmin_kousha",
//     email: "yasmin.kousha@gmail.com",
//     age: 22,
//     city: "رشت",
//   },
//   {
//     firstname: "کیان",
//     lastname: "فرهودی",
//     username: "kian_farhoodi",
//     email: "kian.farhoodi@gmail.com",
//     age: 30,
//     city: "مشهد",
//   },
//   {
//     firstname: "ملیکا",
//     lastname: "سپهری",
//     username: "melika_sepehri",
//     email: "melika.sepehri@gmail.com",
//     age: 25,
//     city: "کرج",
//   },
//   {
//     firstname: "سامیار",
//     lastname: "یزدانی",
//     username: "samiar_yzd",
//     email: "samiar.yazdani@gmail.com",
//     age: 27,
//     city: "یزد",
//   },
//   {
//     firstname: "النا",
//     lastname: "حق‌شناس",
//     username: "elena_haghshenas",
//     email: "elena.hagh@gmail.com",
//     age: 23,
//     city: "تبریز",
//   },
//   {
//     firstname: "دانیال",
//     lastname: "پوررضا",
//     username: "danial_pourreza",
//     email: "danial.pourreza@gmail.com",
//     age: 29,
//     city: "اهواز",
//   },
//   {
//     firstname: "هلیا",
//     lastname: "ماهدخت",
//     username: "helia_mahdokht",
//     email: "helia.mahdokht@gmail.com",
//     age: 21,
//     city: "ساری",
//   },
//   {
//     firstname: "ماهان",
//     lastname: "صدیقی",
//     username: "mahan_sedighi",
//     email: "mahan.sedighi@gmail.com",
//     age: 31,
//     city: "قم",
//   },
//   {
//     firstname: "نیلا",
//     lastname: "پژمان",
//     username: "nila_pejman",
//     email: "nila.pejman@gmail.com",
//     age: 24,
//     city: "قزوین",
//   },
//   {
//     firstname: "آدرین",
//     lastname: "رادمنش",
//     username: "adrin_radmanesh",
//     email: "adrin.radmanesh@gmail.com",
//     age: 27,
//     city: "تهران",
//   },
// ];

// const createUsersAtOnce = () => {
//   Promise.all(
//     users.map((user) =>
//       fetch("https://js-cms.iran.liara.run/api/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(user),
//       }),
//     ),
//   )
//     .then((responses) => {
//       if (responses.some((res) => !res.ok)) {
//         throw new Error();
//       }
//       fetchNewData();
//       showToast("success", "۱۳ کاربر با موفقیت ایجاد شدند 🎉");
//     })
//     .catch(() => {
//       showToast("failed", "خطا در ایجاد بعضی از کاربران");
//     });
// };
// console.log(1);
// createUsersAtOnce();
// createUsersAtOnce();
