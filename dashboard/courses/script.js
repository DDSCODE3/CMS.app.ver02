const coursesTableBody = document.querySelector(".table-body");
const removeModalScreen = document.querySelector(".remove-modalScreen");
const rejectDELETE = document.querySelector(".reject-DELETE");
const acceptDELETE = document.querySelector(".accept-DELETE");
const productsData = document.querySelector(".products-data");
// create new course
const createCourseModal = document.querySelector(".create-course-modal");
const rejectCreateCourse = document.querySelector(".reject-create-course");
const acceptCreateCourse = document.querySelector(".accept-create-course");
const createProduct = document.querySelector("#create-product");
const newCourseTitle = document.querySelector("#product-title");
const newCoursePrice = document.querySelector("#product-price");
const newCourseStudentsCount = document.querySelector("#product-shortName");
const newProductCategory = document.querySelector(".new-product-category");

// update course
const updateCourseModal = document.querySelector(".update-course-modal");
const productNewTitle = document.querySelector(".product-new-title");
const productNewPrice = document.querySelector(".product-new-price");
const productNewCount = document.querySelector(".product-new-count");
const productNewCategory = document.querySelector(".product-new-category");
const rejectUpdateCourse = document.querySelector(".reject-update-course");
const acceptUpdateCourse = document.querySelector(".accept-update-course");

// pagination
let allCourses = [];
const coursesPerPage = 10;
let currentPage = 1;
const paginationContainer = document.querySelector(".pagination");
let page = 1;

let courseIdToRemove = null;
let courseIdToUpdate = null;
let currentCourseToUpdate = null;

const showRemoveCourseModal = (courseID) => {
  removeModalScreen.classList.remove("hidden");
  courseIdToRemove = courseID;
};

const showCreateCourseModal = () => {
  createCourseModal.classList.remove("hidden");
};

const hideCreateCourseModal = () => {
  createCourseModal.classList.add("hidden");
  clearCourseInputs();
};

const showUpdatCourseModal = (courseID) => {
  updateCourseModal.classList.remove("hidden");
  courseIdToUpdate = courseID;
  setCourseInputsValues();
};

const hideUpdatCourseModal = () => {
  updateCourseModal.classList.add("hidden");
  clearCourseInputs();
};

const hideRemoveCourseModal = () => {
  removeModalScreen.classList.add("hidden");
};

const showCourses = (courses) => {
  if (courses.length > 0) {
    coursesTableBody.innerHTML = "";

    console.log(courses);

    courses.forEach((course) => {
      coursesTableBody.insertAdjacentHTML(
        "beforeend",
        `
        <div class="tableRow">
          <p class="product-title">${course.title}</p>
          <p class="product-price">${course.price.toLocaleString()}</p>
          <p class="product-category">${course.category}</p>
          <p class="product-shortName">${course.registersCount}</p>
          <div class="product-manage">
            <button class="edit-btn" onclick="showUpdatCourseModal('${course._id}')">
              <!-- Edit icon -->
              <i class="fas fa-edit"></i>
            </button>
            <button class="remove-btn" onclick="showRemoveCourseModal('${course._id}')">
              <!-- Delete fas icon -->
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `,
      );
    });
  } else {
    showEmptyState(".table-body", "دوره ای");
  }
};

const buildCoursePayload = ({
  titleInput,
  priceInput,
  countInput,
  categoryInput,
  discountInput = 0,
}) => {
  const title = titleInput.value.trim();
  const price = +priceInput.value;
  const count = +countInput.value;
  const category = categoryInput.value;
  const discount = +discountInput;

  if (!title) return { error: "عنوان دوره الزامی است" };
  if (!price || price <= 0) return { error: "قیمت معتبر وارد کنید" };
  if (count < 0) return { error: "تعداد دانشجو معتبر نیست" };
  if (!category) return { error: "دسته‌بندی را انتخاب کنید" };
  if (discount < 0 || discount > 100) return { error: "تخفیف نامعتبر است" };

  return {
    data: {
      title,
      price,
      registersCount: count,
      category,
      discount,
    },
  };
};

const createCourse = () => {
  const { data, error } = buildCoursePayload({
    titleInput: newCourseTitle,
    priceInput: newCoursePrice,
    countInput: newCourseStudentsCount,
    categoryInput: newProductCategory,
  });

  if (error) {
    showToast("failed", error);
    return;
  }

  showLoading(); // 🔹 شروع لودینگ

  fetch("https://js-cms.iran.liara.run/api/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      desc: "توضیحات فیک برای دوره ایجاد شده",
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      fetchNewData();
      hideCreateCourseModal();
      showToast("success", "دوره جدید با موفقیت ایجاد شد");
      clearCourseInputs();
    })
    .catch(() => {
      hideCreateCourseModal();
      showToast("failed", "مشکلی در ایجاد دوره جدید وجود دارد!");
    })
    .finally(() => {
      hideLoading(); // 🔹 پایان لودینگ
    });
};

const updateCourse = () => {
  const { data, error } = buildCoursePayload({
    titleInput: productNewTitle,
    priceInput: productNewPrice,
    countInput: productNewCount,
    categoryInput: productNewCategory,
  });

  if (error) {
    showToast("failed", error);
    hideUpdatCourseModal();
    return;
  }

  showLoading();

  fetch(`https://js-cms.iran.liara.run/api/courses/${courseIdToUpdate}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      fetchNewData();
      showToast("success", "دوره با موفقیت ویرایش شد");
      hideUpdatCourseModal();
    })
    .catch(() => {
      showToast("failed", "بروزرسانی با مشکل مواجه شد");
    })
    .finally(() => {
      hideLoading();
    });
};

const removeCourse = () => {
  showLoading();

  fetch(`https://js-cms.iran.liara.run/api/courses/${courseIdToRemove}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Delete failed");
      return response.json();
    })
    .then((data) => {
      console.log("Course deleted:", data);
      showToast("success", "دوره با موفقیت حذف شد");
      fetchNewData(); // بروزرسانی جدول
      hideRemoveCourseModal();
    })
    .catch(() => {
      showToast("failed", "دوره حذف نشد!");
      hideRemoveCourseModal();
    })
    .finally(() => {
      hideLoading();
    });
};

const clearCourseInputs = () => {
  newCourseTitle.value = "";
  newCoursePrice.value = "";
  newCourseStudentsCount.value = "";
  newProductCategory.value = "";
};

const setCourseInputsValues = () => {
  productNewTitle.value = "";
  productNewPrice.value = "";
  productNewCount.value = "";
  productNewCategory.value = "";
  fetch("https://js-cms.iran.liara.run/api/courses")
    .then((res) => res.json())
    .then((data) => {
      const filteredCourses = data.filter((course) =>
        courseIdToUpdate.includes(course._id),
      );
      currentCourseToUpdate = filteredCourses[0];
      productNewTitle.value = currentCourseToUpdate.title;
      productNewPrice.value = currentCourseToUpdate.price;
      productNewCount.value = currentCourseToUpdate.registersCount;
      productNewCategory.value = currentCourseToUpdate.category;
    })
    .catch(() => {
      showToast("failed", "مشکلی در دریافت اطلاعات وجود دارد");
      hideUpdatCourseModal();
    });
  console.log(currentCourseToUpdate);
};

const changePageHandler = (page) => {
  currentPage = page;

  const start = (page - 1) * coursesPerPage;
  const end = start + coursesPerPage;

  const coursesToShow = allCourses.slice(start, end);
  showCourses(coursesToShow);

  // active class
  document.querySelectorAll(".page").forEach((btn, index) => {
    btn.classList.toggle("active", index + 1 === page);
  });
};

const generatePagination = (courses) => {
  const pagesCount = Math.ceil(courses.length / coursesPerPage);
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
  fetch("https://js-cms.iran.liara.run/api/courses", {})
    .then((response) => response.json())
    .then((data) => {
      allCourses = data;
      generatePagination(data);
      changePageHandler(1);
      productsData.innerHTML = data.length;
    })
    .catch(() => {
      showEmptyState(".table-body", "دوره ای");
      showToast("failed", "در دریافت اطلاعات از سرور مشکلی وجود دارد");
    })
    .finally(() => {
      hideLoading();
    });
};

window.addEventListener("load", fetchNewData);
rejectDELETE.addEventListener("click", hideRemoveCourseModal);
acceptDELETE.addEventListener("click", removeCourse);
createProduct.addEventListener("click", showCreateCourseModal);
rejectCreateCourse.addEventListener("click", hideCreateCourseModal);
acceptCreateCourse.addEventListener("click", createCourse);
rejectUpdateCourse.addEventListener("click", hideUpdatCourseModal);
acceptUpdateCourse.addEventListener("click", updateCourse);

const courses = [
  {
    title: "آموزش جامع JavaScript",
    price: 3200000,
    registersCount: 120,
    category: "frontend",
    discount: 10,
    desc: "دوره کامل جاوااسکریپت از صفر تا پیشرفته",
  },
  {
    title: "React پیشرفته با پروژه واقعی",
    price: 4500000,
    registersCount: 85,
    category: "frontend",
    discount: 15,
    desc: "ساخت پروژه‌های واقعی با React",
  },
  {
    title: "HTML و CSS پروژه‌محور",
    price: 1800000,
    registersCount: 200,
    category: "frontend",
    discount: 5,
    desc: "طراحی سایت مدرن و ریسپانسیو",
  },
  {
    title: "TypeScript کاربردی",
    price: 2600000,
    registersCount: 90,
    category: "frontend",
    discount: 0,
    desc: "تسلط بر TypeScript برای پروژه‌های واقعی",
  },
  {
    title: "Node.js و Express عملی",
    price: 3800000,
    registersCount: 70,
    category: "backend",
    discount: 0,
    desc: "پیاده‌سازی بک‌اند واقعی با Node.js",
  },
  {
    title: "NestJS از صفر تا حرفه‌ای",
    price: 4200000,
    registersCount: 55,
    category: "backend",
    discount: 10,
    desc: "فریم‌ورک NestJS برای بک‌اند مقیاس‌پذیر",
  },
  {
    title: "REST API نویسی حرفه‌ای",
    price: 3000000,
    registersCount: 65,
    category: "backend",
    discount: 5,
    desc: "طراحی API استاندارد و امن",
  },
  {
    title: "MongoDB برای برنامه‌نویسان",
    price: 2100000,
    registersCount: 60,
    category: "database",
    discount: 5,
    desc: "کار عملی با دیتابیس MongoDB",
  },
  {
    title: "SQL و طراحی دیتابیس",
    price: 2300000,
    registersCount: 80,
    category: "database",
    discount: 0,
    desc: "طراحی اصولی دیتابیس‌های رابطه‌ای",
  },
  {
    title: "Git و GitHub حرفه‌ای",
    price: 1500000,
    registersCount: 150,
    category: "tools",
    discount: 0,
    desc: "کنترل نسخه و کار تیمی با Git",
  },
  {
    title: "Docker برای برنامه‌نویسان",
    price: 3400000,
    registersCount: 40,
    category: "devops",
    discount: 10,
    desc: "کانتینرسازی پروژه‌ها با Docker",
  },
  {
    title: "Linux مقدماتی تا پیشرفته",
    price: 2800000,
    registersCount: 75,
    category: "devops",
    discount: 0,
    desc: "کار با لینوکس مخصوص دولوپرها",
  },
  {
    title: "امنیت در وب",
    price: 3600000,
    registersCount: 50,
    category: "security",
    discount: 15,
    desc: "مفاهیم امنیتی و جلوگیری از حملات رایج",
  },
  {
    title: "الگوریتم و ساختمان داده",
    price: 4000000,
    registersCount: 95,
    category: "computer-science",
    discount: 0,
    desc: "تقویت تفکر الگوریتمی برای مصاحبه",
  },
  {
    title: "Next.js پروژه‌محور",
    price: 3900000,
    registersCount: 68,
    category: "frontend",
    discount: 10,
    desc: "ساخت وب‌اپ‌های SSR با Next.js",
  },
  {
    title: "Clean Code برای برنامه‌نویسان",
    price: 2500000,
    registersCount: 110,
    category: "software",
    discount: 5,
    desc: "نوشتن کد تمیز و قابل نگهداری",
  },
];

const createCoursesAtOnce = () => {
  Promise.all(
    courses.map((course) =>
      fetch("https://js-cms.iran.liara.run/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      }),
    ),
  )
    .then((responses) => {
      if (responses.some((res) => !res.ok)) {
        throw new Error();
      }
      fetchNewData();
      showToast("success", "۱۶ دوره با موفقیت ایجاد شدند 🎉");
    })
    .catch(() => {
      showToast("failed", "خطا در ایجاد بعضی از دوره‌ها");
    });
};
createCoursesAtOnce();
