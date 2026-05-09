import { db, storage } from "./firebase-config.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const USER_CODES = {
  "1": "1111111",
  "2": "2222222",
  "3": "3333333",
  "4": "4444444",
};
const PAGE_SIZE = 5;
const MAX_VISIBLE_DOTS = 7;
const UPLOAD_TIMEOUT_MS = 30000;
const VISITOR_SESSION_KEY = "scriptoria-visitor-counted";
const postsCollection = collection(db, "newsPosts");
const metricsDocRef = doc(db, "siteMetrics", "publicStats");

const modal = document.getElementById("publisher-modal");
const openButton = document.getElementById("open-publisher");
const closeButtons = document.querySelectorAll("[data-close-publisher]");
const stepElements = [...document.querySelectorAll(".publisher-step")];
const userNumberInput = document.getElementById("publisher-user-number");
const secretInput = document.getElementById("secret-code");
const form = document.getElementById("publisher-form");
const titleInput = document.getElementById("news-title");
const contentInput = document.getElementById("news-content");
const imageInput = document.getElementById("news-image");
const submitNewsButton = document.getElementById("submit-news");
const selectedFileName = document.getElementById("selected-file-name");
const previewShell = document.getElementById("publisher-preview");
const previewImage = document.getElementById("preview-image");
const statusBox = document.getElementById("publisher-status");
const dashboardStatusBox = document.getElementById("dashboard-status");
const dashboardPostCount = document.getElementById("dashboard-post-count");
const dashboardVisitorCount = document.getElementById("dashboard-visitor-count");
const postsSection = document.getElementById("posts-news");
const newsSlider = document.querySelector("[data-news-slider]");
const newsTrack = newsSlider?.querySelector(".news-track");
const dotsContainer = newsSlider?.querySelector(".news-dots");
const prevButton = newsSlider?.querySelector(".news-arrow-right");
const nextButton = newsSlider?.querySelector(".news-arrow-left");

let publisherUserNumber = "";
let isAdminUser = false;
let deleteModeActive = false;
let previewObjectUrl = null;
let activeDeleteButton = null;

const feedState = {
  posts: [],
  currentIndex: 0,
  lastVisible: null,
  hasMore: true,
  isLoading: false,
};

const normalizeDigits = (value) =>
  value.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char] || char;
  });

const formatArabicDate = (dateValue) => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return new Intl.DateTimeFormat("ar-IQ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const truncate = (value, maxLength) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
};

const withTimeout = (promise, timeoutMs, timeoutMessage) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });

const formatFirebaseError = (error) => {
  const code = error?.code || "";

  if (code.includes("storage/unauthorized") || code.includes("permission-denied")) {
    return "الرفع مرفوض من صلاحيات Firebase. يجب تعديل قواعد Storage وFirestore.";
  }

  if (code.includes("storage/canceled")) {
    return "تم إلغاء رفع الصورة قبل الاكتمال.";
  }

  if (code.includes("storage/retry-limit-exceeded")) {
    return "انتهت مهلة رفع الصورة. تحقق من الاتصال أو إعدادات Firebase Storage.";
  }

  if (code.includes("storage/unknown")) {
    return "حدث خطأ غير معروف أثناء رفع الصورة إلى Storage.";
  }

  if (code.includes("unavailable")) {
    return "تعذر الاتصال بخدمات Firebase حاليًا.";
  }

  return error?.message || "فشل تنفيذ العملية مع Firebase.";
};

const setStatus = (message, mode = "info") => {
  statusBox.textContent = message;
  statusBox.dataset.state = mode;
};

const setDashboardStatus = (message, mode = "info") => {
  if (!dashboardStatusBox) return;
  dashboardStatusBox.textContent = message;
  dashboardStatusBox.dataset.state = mode;
};

const showStep = (stepName) => {
  stepElements.forEach((step) => {
    step.classList.toggle("active", step.dataset.step === stepName);
  });
};

const openModal = () => {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  showStep("secret");
  setStatus("");
  userNumberInput?.focus();
  document.body.classList.add("modal-open");
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

const clearPreview = () => {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = null;
  }

  previewShell.hidden = true;
  previewImage.removeAttribute("src");
};

const resetPublisher = () => {
  publisherUserNumber = "";
  isAdminUser = false;
  deleteModeActive = false;
  form.reset();
  if (userNumberInput) userNumberInput.value = "1";
  secretInput.value = "";
  secretInput.placeholder = "أدخل الرمز السري";
  if (selectedFileName) selectedFileName.textContent = "لم يتم اختيار صورة";
  clearPreview();
  setStatus("");
  showStep("secret");
  renderPosts();
};

const getNewsTypeClass = (hasImage) => (hasImage ? "type-image" : "type-text");
const getNewsTypeLabel = (hasImage) => (hasImage ? "صورة" : "خبر");
const getNewsCategory = (hasImage) => (hasImage ? "منشور مصور" : "بيان سياسي");

const toSerializablePost = (docSnapshot) => {
  const data = docSnapshot.data();
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

  return {
    id: docSnapshot.id,
    title: data.title || "",
    content: data.content || "",
    author: data.author || "publisher",
    imageUrl: data.imageUrl || "",
    createdAt,
  };
};

const createNewsMarkup = (post, index) => {
  const title = escapeHtml(post.title || "");
  const content = escapeHtml(post.content || "");
  const imageUrl = post.imageUrl || "";
  const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt || Date.now());
  const isoDate = createdAt.toISOString().split("T")[0];
  const readableDate = formatArabicDate(createdAt);
  const typeClass = getNewsTypeClass(Boolean(imageUrl));
  const typeLabel = getNewsTypeLabel(Boolean(imageUrl));
  const categoryLabel = getNewsCategory(Boolean(imageUrl));

  return `
    <article class="news-item ${index === feedState.currentIndex ? "active" : ""}" data-post-id="${post.id}">
      <div class="news-meta">
        <span class="news-type ${typeClass}">${typeLabel}</span>
        <span>${categoryLabel}</span>
        <span>بواسطة المستخدم ${escapeHtml(post.author || "-")}</span>
        <time datetime="${isoDate}">${readableDate}</time>
      </div>
      <h3>${title}</h3>
      <div class="news-body">
        <p>${content}</p>
        ${imageUrl ? `<div class="news-visual"><img src="${imageUrl}" alt="${title}" loading="lazy" /></div>` : ""}
      </div>
      ${
        deleteModeActive
          ? `<div class="news-item-actions"><button class="news-delete-btn" type="button" data-delete-post="${post.id}">حذف المنشور</button></div>`
          : ""
      }
    </article>
  `;
};

const renderLoadingState = (message) => {
  if (!newsTrack) return;

  newsTrack.innerHTML = `
    <article class="news-item news-item-state active">
      <div class="news-body">
        <h3>جار التحميل</h3>
        <p>${escapeHtml(message)}</p>
      </div>
    </article>
  `;
};

const renderEmptyState = () => {
  if (!newsTrack) return;

  newsTrack.innerHTML = `
    <article class="news-item news-item-state active">
      <div class="news-body">
        <h3>لا توجد منشورات بعد</h3>
        <p>أول خبر يتم نشره سيظهر هنا مباشرة من قاعدة البيانات.</p>
      </div>
    </article>
  `;

  if (dotsContainer) dotsContainer.innerHTML = "";
  updateSliderButtons();
};

const buildDotIndices = (total, currentIndex) => {
  if (total <= MAX_VISIBLE_DOTS) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const indices = new Set([0, total - 1, currentIndex]);
  let left = currentIndex - 1;
  let right = currentIndex + 1;

  while (indices.size < Math.min(MAX_VISIBLE_DOTS, total)) {
    if (left > 0) {
      indices.add(left);
      if (indices.size >= MAX_VISIBLE_DOTS) break;
    }

    if (right < total - 1) {
      indices.add(right);
    }

    left -= 1;
    right += 1;

    if (left <= 0 && right >= total - 1) break;
  }

  return [...indices].sort((first, second) => first - second);
};

const renderDots = () => {
  if (!dotsContainer) return;

  dotsContainer.innerHTML = "";

  const visibleIndices = buildDotIndices(feedState.posts.length, feedState.currentIndex);
  let previousIndex = -1;

  visibleIndices.forEach((index) => {
    if (previousIndex >= 0 && index - previousIndex > 1) {
      const gap = document.createElement("span");
      gap.className = "news-dot-gap";
      gap.textContent = "…";
      dotsContainer.append(gap);
    }

    const dot = document.createElement("button");
    dot.type = "button";
    dot.classList.toggle("active", index === feedState.currentIndex);
    dot.setAttribute("aria-label", `المنشور ${index + 1}`);
    dot.onclick = () => jumpToIndex(index);
    dotsContainer.append(dot);
    previousIndex = index;
  });
};

const renderPosts = () => {
  if (!newsTrack) return;

  if (!feedState.posts.length) {
    renderEmptyState();
    return;
  }

  newsTrack.innerHTML = feedState.posts
    .map((post, index) => createNewsMarkup(post, index))
    .join("");

  renderDots();
  updateSliderButtons();
};

const updateSliderButtons = () => {
  if (!prevButton || !nextButton) return;

  prevButton.disabled = feedState.isLoading || (!feedState.posts.length && !feedState.hasMore);
  nextButton.disabled = feedState.isLoading || (!feedState.posts.length && !feedState.hasMore);
};

const fetchPostsBatch = async ({ reset = false } = {}) => {
  if (feedState.isLoading) return false;

  if (!reset && !feedState.hasMore) return false;

  feedState.isLoading = true;
  updateSliderButtons();

  if (reset) {
    feedState.posts = [];
    feedState.currentIndex = 0;
    feedState.lastVisible = null;
    feedState.hasMore = true;
    renderLoadingState("يتم جلب أحدث الأخبار من قاعدة البيانات...");
  }

  try {
    const constraints = [orderBy("createdAt", "desc"), limit(PAGE_SIZE)];

    if (!reset && feedState.lastVisible) {
      constraints.push(startAfter(feedState.lastVisible));
    }

    const snapshot = await getDocs(query(postsCollection, ...constraints));

    if (snapshot.empty) {
      feedState.hasMore = false;
      if (reset) renderEmptyState();
      return false;
    }

    const batchPosts = snapshot.docs.map(toSerializablePost);

    feedState.lastVisible = snapshot.docs[snapshot.docs.length - 1];
    feedState.hasMore = snapshot.docs.length === PAGE_SIZE;
    feedState.posts = reset ? batchPosts : [...feedState.posts, ...batchPosts];

    renderPosts();
    return true;
  } catch (error) {
    console.error("Failed to load Firebase news posts.", error);
    renderLoadingState("تعذر تحميل الأخبار من قاعدة البيانات. تحقق من إعدادات Firestore ثم أعد المحاولة.");
    return false;
  } finally {
    feedState.isLoading = false;
    updateSliderButtons();
  }
};

const ensureNextPost = async () => {
  const nextIndex = feedState.currentIndex + 1;

  if (nextIndex < feedState.posts.length) return true;
  if (!feedState.hasMore) return false;

  const loaded = await fetchPostsBatch();
  return loaded && nextIndex < feedState.posts.length;
};

const syncSlider = () => {
  renderPosts();
};

const jumpToIndex = async (targetIndex) => {
  if (targetIndex < 0) return;

  while (targetIndex >= feedState.posts.length && feedState.hasMore) {
    const loaded = await fetchPostsBatch();
    if (!loaded) break;
  }

  if (targetIndex >= feedState.posts.length) return;

  feedState.currentIndex = targetIndex;
  renderPosts();
};

const showPreviousPost = async () => {
  if (!feedState.posts.length) return;

  if (feedState.currentIndex > 0) {
    feedState.currentIndex -= 1;
  } else if (!feedState.hasMore) {
    feedState.currentIndex = feedState.posts.length - 1;
  }

  renderPosts();
};

const showNextPost = async () => {
  if (!feedState.posts.length && feedState.hasMore) {
    await fetchPostsBatch({ reset: true });
    return;
  }

  const hasNextLoaded = await ensureNextPost();

  if (feedState.currentIndex < feedState.posts.length - 1) {
    feedState.currentIndex += 1;
  } else if (!hasNextLoaded && feedState.posts.length) {
    feedState.currentIndex = 0;
  }

  renderPosts();
};

const handleSecretCheck = () => {
  const selectedUser = normalizeDigits(userNumberInput?.value?.trim() || "");
  const normalized = normalizeDigits(secretInput.value.trim());

  if (!USER_CODES[selectedUser]) {
    setStatus("اختر رقم مستخدم صالح قبل المتابعة.", "error");
    userNumberInput?.focus();
    return;
  }

  if (normalized !== USER_CODES[selectedUser]) {
    setStatus("الرمز السري غير صحيح لهذا المستخدم.", "error");
    secretInput.focus();
    return;
  }

  publisherUserNumber = selectedUser;
  isAdminUser = selectedUser === "1";
  deleteModeActive = false;
  setStatus("");
  if (isAdminUser) {
    showStep("actions");
  } else {
    showStep("form");
    titleInput.focus();
  }
  renderPosts();
};

const handlePreview = () => {
  const [file] = imageInput.files || [];

  clearPreview();
  if (selectedFileName) {
    selectedFileName.textContent = file?.name || "لم يتم اختيار صورة";
  }

  if (!file) return;

  previewObjectUrl = URL.createObjectURL(file);
  previewImage.src = previewObjectUrl;
  previewShell.hidden = false;
  requestAnimationFrame(() => {
    submitNewsButton?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  });
};

const trackVisitor = async () => {
  if (sessionStorage.getItem(VISITOR_SESSION_KEY)) return;

  try {
    await setDoc(
      metricsDocRef,
      {
        visitorCount: increment(1),
        lastVisitAt: serverTimestamp(),
      },
      { merge: true }
    );
    sessionStorage.setItem(VISITOR_SESSION_KEY, "1");
  } catch (error) {
    console.error("Failed to track site visitor.", error);
  }
};

const loadDashboardMetrics = async () => {
  if (!dashboardPostCount || !dashboardVisitorCount) return;

  dashboardPostCount.textContent = "...";
  dashboardVisitorCount.textContent = "...";
  setDashboardStatus("جارٍ تحميل الإحصاءات...", "loading");

  try {
    const [postCountSnapshot, metricsSnapshot] = await Promise.all([
      getCountFromServer(postsCollection),
      getDoc(metricsDocRef),
    ]);

    const postCount = postCountSnapshot.data().count || 0;
    const visitorCount = metricsSnapshot.exists() ? metricsSnapshot.data()?.visitorCount || 0 : 0;
    const numberFormatter = new Intl.NumberFormat("ar-IQ");

    dashboardPostCount.textContent = numberFormatter.format(postCount);
    dashboardVisitorCount.textContent = numberFormatter.format(visitorCount);
    setDashboardStatus("تم تحديث الإحصاءات بنجاح.", "success");
  } catch (error) {
    console.error("Failed to load dashboard metrics.", error);
    dashboardPostCount.textContent = "--";
    dashboardVisitorCount.textContent = "--";
    setDashboardStatus("تعذر تحميل الإحصاءات من قاعدة البيانات.", "error");
  }
};

const uploadImage = async (file) => {
  const safeName = file.name.replace(/\s+/g, "-").replace(/[^A-Za-z0-9._-]/g, "");
  const path = `news-images/${Date.now()}-${safeName || "upload"}`;
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  const uploadSnapshot = await withTimeout(
    new Promise((resolve, reject) => {
      const unsubscribe = uploadTask.on(
        "state_changed",
        null,
        (error) => {
          unsubscribe();
          reject(error);
        },
        () => {
          unsubscribe();
          resolve(uploadTask.snapshot);
        }
      );
    }),
    UPLOAD_TIMEOUT_MS,
    "انتهت مهلة رفع الصورة بعد 30 ثانية. تحقق من Firebase Storage."
  );

  return getDownloadURL(uploadSnapshot.ref);
};

const prependPublishedPost = (post) => {
  feedState.posts = [post, ...feedState.posts.filter((item) => item.id !== post.id)];
  feedState.currentIndex = 0;
  renderPosts();
};

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!publisherUserNumber) {
    setStatus("أعد التحقق من رقم المستخدم أولًا.", "error");
    showStep("secret");
    return;
  }

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const imageFile = imageInput.files?.[0];

  if (!title || !content || !imageFile) {
    setStatus("يرجى إكمال العنوان والمحتوى واختيار صورة.", "error");
    return;
  }

  if (!imageFile.type.startsWith("image/")) {
    setStatus("الملف المختار ليس صورة صالحة.", "error");
    return;
  }

  const submitButton = document.getElementById("submit-news");
  submitButton.disabled = true;
  setStatus("جارٍ رفع الصورة وحفظ الخبر في قاعدة البيانات...", "loading");

  try {
    const imageUrl = await uploadImage(imageFile);

    const docRef = await withTimeout(
      addDoc(postsCollection, {
        title,
        content,
        author: publisherUserNumber,
        imageUrl,
        createdAt: serverTimestamp(),
      }),
      15000,
      "انتهت مهلة حفظ الخبر في Firestore بعد 15 ثانية."
    );

    prependPublishedPost({
      id: docRef.id,
      title,
      content,
      author: publisherUserNumber,
      imageUrl,
      createdAt: new Date(),
    });

    closeModal();
    resetPublisher();
    postsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    fetchPostsBatch({ reset: true });
  } catch (error) {
    console.error("Failed to publish news post.", error);
    setStatus(formatFirebaseError(error), "error");
  } finally {
    submitButton.disabled = false;
  }
};

const handleDeletePost = async (postId, button) => {
  if (!deleteModeActive) return;
  if (!postId) return;

  const confirmed = window.confirm("هل تريد حذف هذا المنشور نهائيًا؟");
  if (!confirmed) return;

  activeDeleteButton = button;
  if (activeDeleteButton) activeDeleteButton.disabled = true;

  try {
    await deleteDoc(doc(db, "newsPosts", postId));

    feedState.posts = feedState.posts.filter((post) => post.id !== postId);

    if (feedState.currentIndex >= feedState.posts.length) {
      feedState.currentIndex = Math.max(feedState.posts.length - 1, 0);
    }

    renderPosts();
  } catch (error) {
    console.error("Failed to delete news post.", error);
    setStatus("تعذر حذف المنشور من قاعدة البيانات.", "error");
    if (!modal?.classList.contains("is-open")) openModal();
  } finally {
    activeDeleteButton = null;
  }
};

const openPublishForm = () => {
  deleteModeActive = false;
  setStatus("");
  showStep("form");
  renderPosts();
  titleInput.focus();
  requestAnimationFrame(() => {
    titleInput.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  });
};

const openDashboard = async () => {
  if (!isAdminUser) return;
  deleteModeActive = false;
  showStep("dashboard");
  renderPosts();
  await loadDashboardMetrics();
};

const activateDeleteMode = () => {
  if (!isAdminUser) return;
  deleteModeActive = true;
  closeModal();
  setStatus("");
  renderPosts();
  postsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
};

window.setNewsSliderController?.({
  sync: () => {
    prevButton.onclick = showPreviousPost;
    nextButton.onclick = showNextPost;
    renderPosts();
  },
});

openButton?.addEventListener("click", openModal);

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal();
    resetPublisher();
  });
});

document.getElementById("check-secret")?.addEventListener("click", handleSecretCheck);
document.getElementById("actions-back-to-secret")?.addEventListener("click", () => {
  setStatus("");
  showStep("secret");
  userNumberInput?.focus();
});
document.getElementById("go-to-publish")?.addEventListener("click", openPublishForm);
document.getElementById("go-to-dashboard")?.addEventListener("click", openDashboard);
document.getElementById("go-to-delete")?.addEventListener("click", activateDeleteMode);
document.getElementById("back-from-form")?.addEventListener("click", () => {
  setStatus("");
  if (isAdminUser) {
    showStep("actions");
  } else {
    showStep("secret");
    userNumberInput?.focus();
  }
});
document.getElementById("back-from-dashboard")?.addEventListener("click", () => {
  setDashboardStatus("");
  showStep("actions");
});
document.getElementById("refresh-dashboard")?.addEventListener("click", loadDashboardMetrics);

imageInput?.addEventListener("change", handlePreview);
form?.addEventListener("submit", handleSubmit);
newsTrack?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-post]");
  if (!button) return;
  handleDeletePost(button.dataset.deletePost, button);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) {
    closeModal();
    resetPublisher();
  }
});

await trackVisitor();
await fetchPostsBatch({ reset: true });
