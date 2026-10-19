const SUPABASE_URL = "https://yuydeejyktpiopcsaigz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_bzGNIT7V-4C3ADTcB8O1Pw_9leCOmFC";

// 1. Kết nối Supabase
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

// 2. Lấy các phần tử HTML
const form = document.querySelector("#visitor-form");
const nameInput = document.querySelector("#visitor-name");
const genderFieldset = document.querySelector("#gender-fieldset");
const guideMessage = document.querySelector("#guide-message");
const guideDots = [...document.querySelectorAll(".step-dot")];
const hint = document.querySelector("#form-hint");

const backdrop = document.querySelector("#modal-backdrop");
const modal = document.querySelector("#modal-card");
const modalTitle = document.querySelector("#modal-title");
const modalContent = document.querySelector("#modal-content");
const closeModalButton = document.querySelector("#close-modal");

// 3. Bộ đếm lượt mở trên trình duyệt hiện tại
const visitCountElement = document.querySelector("#visit-count");

try {
  const counterKey = "pixel2010_local_visit_count";
  const visitCount = Number(localStorage.getItem(counterKey) || 0) + 1;

  localStorage.setItem(counterKey, String(visitCount));

  if (visitCountElement) {
    visitCountElement.textContent = String(visitCount);
  }
} catch (error) {
  console.warn("Không thể sử dụng bộ nhớ trình duyệt:", error);
}

// 4. Hướng dẫn nhập thông tin
function setGuideStep(step) {
  const messages = [
    "Hãy nhập tên của bạn",
    "Hãy chọn giới tính của bạn",
    "Chuẩn bị xong rồi nhé!",
  ];

  if (guideMessage) {
    guideMessage.textContent = messages[step];
  }

  guideDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === step);
  });
}

if (nameInput) {
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim()) {
      setGuideStep(1);
      if (hint) {
        hint.textContent = "Tốt lắm! Giờ chọn giới tính nha 🌸";
      }
    } else {
      setGuideStep(0);
      if (hint) {
        hint.textContent = "Nhập tên để bắt đầu nha ✨";
      }
    }
  });
}

document.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    setGuideStep(2);

    if (hint) {
      hint.textContent = "Bạn đã chọn giới tính. Hãy gửi thông tin nhé!";
    }
  });
});

// 5. Mở cửa sổ modal
function openModal(title, content, theme = "") {
  if (!backdrop || !modal || !modalTitle || !modalContent) {
    console.error("Không tìm thấy HTML của cửa sổ modal.");
    return;
  }

  modalTitle.textContent = title;
  modalContent.innerHTML = content;

  modal.classList.remove("male-theme", "gallery-theme", "note-theme");

  if (theme) {
    modal.classList.add(theme);
  }

  backdrop.hidden = false;

  if (closeModalButton) {
    closeModalButton.focus();
  }
}

// 6. Đóng cửa sổ modal
function closeModal() {
  if (backdrop) {
    backdrop.hidden = true;
  }

  if (nameInput) {
    nameInput.focus();
  }
}

if (closeModalButton) {
  closeModalButton.addEventListener("click", closeModal);
}

if (backdrop) {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && backdrop && !backdrop.hidden) {
    closeModal();
  }
});

// 7. Bảo vệ tên khi đưa vào nội dung HTML
function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

// 8. Gửi thông tin và hiển thị lời chúc nam/nữ
if (form && nameInput) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const gender = new FormData(form).get("gender");

    if (!name) {
      setGuideStep(0);
      nameInput.focus();
      return;
    }

    if (name.length > 40) {
      if (hint) hint.textContent = "Tên không được dài quá 40 ký tự.";
      nameInput.focus();
      return;
    }

    if (gender !== "female" && gender !== "male") {
      setGuideStep(1);

      if (hint) hint.textContent = "Bạn hãy chọn giới tính nhé!";

      if (genderFieldset) {
        genderFieldset.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) submitButton.disabled = true;
    if (hint) hint.textContent = "Đang lưu thông tin...";

    try {
      // Lưu tên và giới tính vào Supabase
      const { error } = await supabaseClient
        .from("visitors")
        .insert([{ name, gender }]);

      // Nếu lưu thất bại, hiển thị lỗi và không giả vờ thành công
      if (error) {
        console.error("Lỗi Supabase:", error);

        if (hint) {
          hint.textContent =
            "Lưu chưa thành công. Hãy kiểm tra kết nối và thử lại nhé!";
        }

        return;
      }

      if (hint) {
        hint.textContent = "Đã lưu thông tin thành công! ♡";
      }

      setGuideStep(2);

      // Lời chúc dành cho nữ
      if (gender === "female") {
        document.body.classList.remove("male-page");
        document.body.classList.add("female-page");

        openModal(
          "CHÚC MỪNG 20/10",
          `<p class="greeting">Chúc ${escapeHtml(name)} 20/10 vui vẻ nha gái!</p>
           <span class="alien" aria-label="người ngoài hành tinh">👽</span>
           <p class="small-note">Chúc bạn một ngày thật xinh và vui vẻ ✦</p>`,
        );
      } else {
        // Lời chúc dành cho nam
        document.body.classList.remove("female-page");
        document.body.classList.add("male-page");

        openModal(
          "THÔNG BÁO TỪ VŨ TRỤ",
          `<p class="greeting">Lo đi chúc người khác 20/10 đi bố 😎</p>
           <span class="alien">🛸</span>`,
          "male-theme",
        );
      }
    } catch (error) {
      console.error("Lỗi kết nối Supabase:", error);

      if (hint) {
        hint.textContent = "Có lỗi kết nối. Hãy thử lại nhé!";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// 9. Nút thư viện ảnh — chỉ chạy nếu nút tồn tại trong HTML
const galleryButton = document.querySelector("#open-gallery");

if (galleryButton) {
  galleryButton.addEventListener("click", () => {
    openModal(
      "GÓC KỶ NIỆM",
      `<p class="small-note">Chỗ để bạn chèn ảnh của mình nè!</p>
       <div class="photo-slot">
         <img
           src="assets/images/your-photo.jpg"
           alt="Ảnh kỷ niệm"
           onerror="this.hidden = true"
         >
       </div>`,
      "gallery-theme",
    );
  });
}

// 10. Nút ghi chú — chỉ chạy nếu nút tồn tại trong HTML
const aboutButton = document.querySelector("#open-about");

if (aboutButton) {
  aboutButton.addEventListener("click", () => {
    openModal(
      "MỘT CHIẾC NOTE",
      `<p class="small-note">Cảm ơn bạn đã ghé qua góc pixel bé xíu này ♡</p>
       <span class="alien">🍓✨</span>`,
      "note-theme",
    );
  });
}
