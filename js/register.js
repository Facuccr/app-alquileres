document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const termsCheckbox = document.getElementById("terms");
  const userTypeSelect = document.getElementById("userType");
  const fullNameInput = document.getElementById("fullName");

  // Elementos de la foto de perfil
  const profilePic = document.getElementById("profilePic");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const photoUploadInput = document.getElementById("photoUpload");

  // Elementos del modal de verificación
  const verificationModal = document.getElementById("verificationModal"); // Ahora es el div directo
  const closeModalBtn = document.getElementById("closeModalBtn"); // Botón para cerrar el modal
  const cancelModalBtn = document.getElementById("cancelModalBtn"); // Botón para cancelar en el footer del modal
  const verificationMethodText = document.getElementById(
    "verificationMethodText"
  );
  const verificationCodeInput = document.getElementById("verificationCode");
  const verificationCodeFeedback = document.getElementById(
    "verificationCodeFeedback"
  );
  const verifyBtn = document.getElementById("verifyBtn");
  const resendCodeBtn = document.getElementById("resendCodeBtn");
  const resendTimerSpan = document.getElementById("resendTimer"); // Cambiado a resendTimerSpan para evitar conflicto con el intervalo

  // Variables para la simulación
  let simulatedVerificationCode = "";
  let verificationMethod = "email"; // Por defecto, correo
  let countdownInterval;
  const RESEND_TIME = 30; // seconds

  // --- Lógica de la Foto de Perfil ---
  if (changePhotoBtn && photoUploadInput) {
    changePhotoBtn.addEventListener("click", () => {
      photoUploadInput.click();
    });

    // También permitir hacer clic en la imagen para cambiar la foto
    profilePic.parentElement.addEventListener("click", () => {
      photoUploadInput.click();
    });

    photoUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- Lógica de los Radio Buttons de Verificación ---
  document
    .querySelectorAll('input[name="verificationMethod"]')
    .forEach((radio) => {
      radio.addEventListener("change", (event) => {
        verificationMethod = event.target.value;
      });
    });

  // --- Funciones de Validación de Campos (adaptadas a Tailwind) ---
  const validateField = (inputElement, isValid) => {
    const feedbackElement = inputElement.nextElementSibling; // Asume que el feedback está justo después
    // Para el caso del select con icono
    if (inputElement.id === "userType") {
      feedbackElement = inputElement.nextElementSibling.nextElementSibling;
    }
    // Para el caso del checkbox
    if (inputElement.id === "terms") {
      feedbackElement = inputElement.nextElementSibling.nextElementSibling;
    }

    if (isValid) {
      inputElement.classList.remove("border-red-500", "focus:ring-red-500");
      inputElement.classList.add(
        "border-gray-300",
        "focus:ring-primary-custom"
      ); // O el estilo por defecto de Tailwind
      if (feedbackElement) feedbackElement.classList.add("hidden");
    } else {
      inputElement.classList.add("border-red-500", "focus:ring-red-500");
      inputElement.classList.remove(
        "border-gray-300",
        "focus:ring-primary-custom"
      );
      if (feedbackElement) feedbackElement.classList.remove("hidden");
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{7,15}$/; // Ajustado para ser más permisivo, 7 a 15 dígitos
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // --- Event Listeners para Validación en Tiempo Real (Input/Change) ---
  userTypeSelect.addEventListener("change", () => {
    validateField(userTypeSelect, userTypeSelect.value !== "");
  });

  fullNameInput.addEventListener("input", () => {
    validateField(fullNameInput, fullNameInput.value.trim() !== "");
  });

  emailInput.addEventListener("input", () => {
    validateField(emailInput, emailRegex.test(emailInput.value));
  });

  phoneInput.addEventListener("input", () => {
    validateField(phoneInput, phoneRegex.test(phoneInput.value.trim()));
  });

  passwordInput.addEventListener("input", () => {
    validateField(passwordInput, passwordRegex.test(passwordInput.value));
    // Revalidar confirmar contraseña si la contraseña cambia
    validateField(
      confirmPasswordInput,
      confirmPasswordInput.value === passwordInput.value &&
        passwordRegex.test(confirmPasswordInput.value)
    );
  });

  confirmPasswordInput.addEventListener("input", () => {
    validateField(
      confirmPasswordInput,
      confirmPasswordInput.value === passwordInput.value &&
        passwordRegex.test(confirmPasswordInput.value)
    );
  });

  termsCheckbox.addEventListener("change", () => {
    validateField(termsCheckbox, termsCheckbox.checked);
  });

  // --- Funciones del Modal de Verificación ---

  // Genera un código de 6 dígitos para la simulación
  function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Muestra el modal y genera/muestra el código en consola
  function showVerificationModal() {
    simulatedVerificationCode = generateVerificationCode();
    console.log(
      "%c CÓDIGO DE VERIFICACIÓN SIMULADO (usa este código):",
      "background: #222; color: #bada55; font-size: 16px; padding: 5px;",
      simulatedVerificationCode
    );

    let target = "";
    if (verificationMethod === "email") {
      target = emailInput.value;
      verificationMethodText.textContent = `tu correo electrónico (${target})`;
    } else if (verificationMethod === "whatsapp") {
      target = phoneInput.value;
      verificationMethodText.textContent = `tu número de WhatsApp (${target})`;
    }

    startResendTimer();
    verificationCodeInput.value = "";
    validateField(verificationCodeInput, true); // Limpiar validación previa

    // Mostrar el modal con animaciones de Tailwind
    verificationModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden"); // Prevenir scroll del body
    // Trigger modal content animation
    setTimeout(() => {
      verificationModal
        .querySelector(".modal-content-animated")
        .classList.remove("scale-95", "opacity-0");
      verificationModal
        .querySelector(".modal-content-animated")
        .classList.add("scale-100", "opacity-100");
    }, 10);
  }

  function hideVerificationModal() {
    // Ocultar el modal con animaciones de Tailwind
    verificationModal
      .querySelector(".modal-content-animated")
      .classList.add("scale-95", "opacity-0");
    verificationModal
      .querySelector(".modal-content-animated")
      .classList.remove("scale-100", "opacity-100");
    setTimeout(() => {
      verificationModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 300); // Coincidir con la duración de la transición CSS

    clearInterval(countdownInterval);
    resendTimerSpan.textContent = "";
    resendCodeBtn.disabled = false;
    verificationCodeInput.value = "";
    validateField(verificationCodeInput, true); // Restablecer estilo de validación del input del código
  }

  function startResendTimer() {
    let timeLeft = RESEND_TIME;
    resendCodeBtn.disabled = true;
    resendTimerSpan.textContent = `(${timeLeft}s)`;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      timeLeft--;
      resendTimerSpan.textContent = `(${timeLeft}s)`;
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        resendTimerSpan.textContent = "";
        resendCodeBtn.disabled = false;
      }
    }, 1000);
  }

  // Evento para el botón de Reenviar Código
  if (resendCodeBtn) {
    resendCodeBtn.addEventListener("click", () => {
      showVerificationModal(); // Regenera y muestra el nuevo código en consola
      // Ya no es necesario el alert, la consola es suficiente.
    });
  }

  // Evento para el botón de Verificar en el modal
  if (verifyBtn) {
    verifyBtn.addEventListener("click", () => {
      const enteredCode = verificationCodeInput.value.trim();

      if (enteredCode === simulatedVerificationCode) {
        alert(
          "¡Código verificado exitosamente! Redirigiendo a la página de inicio de sesión..."
        );
        hideVerificationModal();
        registerForm.reset(); // Limpia el formulario
        registerForm.classList.remove("was-validated"); // Quitar clase de validación de Bootstrap
        profilePic.src = "src/img/11702731.png"; // Restablece la foto
        window.location.href = "login.html"; // Redirige al login
      } else {
        validateField(verificationCodeInput, false); // Marcar como inválido
        verificationCodeFeedback.textContent =
          "Código de verificación incorrecto.";
      }
    });
  }

  // Eventos para cerrar el modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", hideVerificationModal);
  }
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", hideVerificationModal);
  }

  // --- Lógica del Formulario de Registro (adaptada a Tailwind) ---
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formIsValid = true;

    // Validaciones de los campos
    const fieldsToValidate = [
      { input: userTypeSelect, validateFn: () => userTypeSelect.value !== "" },
      {
        input: fullNameInput,
        validateFn: () => fullNameInput.value.trim() !== "",
      },
      {
        input: emailInput,
        validateFn: () => emailRegex.test(emailInput.value),
      },
      {
        input: phoneInput,
        validateFn: () => phoneRegex.test(phoneInput.value.trim()),
      },
      {
        input: passwordInput,
        validateFn: () => passwordRegex.test(passwordInput.value),
      },
      {
        input: confirmPasswordInput,
        validateFn: () =>
          confirmPasswordInput.value === passwordInput.value &&
          passwordRegex.test(confirmPasswordInput.value),
      },
      { input: termsCheckbox, validateFn: () => termsCheckbox.checked },
    ];

    fieldsToValidate.forEach(({ input, validateFn }) => {
      if (!validateFn()) {
        formIsValid = false;
        // Aplicar estilos de error de Tailwind
        input.classList.add("border-red-500", "focus:ring-red-500");
        input.classList.remove("border-gray-300", "focus:ring-primary-custom");
        // Mostrar feedback de error (asumiendo que está justo después)
        let feedbackElement = input.nextElementSibling;
        if (input.id === "userType") {
          // Para el select con icono
          feedbackElement = input.nextElementSibling.nextElementSibling;
        } else if (input.id === "terms") {
          // Para el checkbox
          feedbackElement = input.nextElementSibling.nextElementSibling;
        }

        if (feedbackElement) feedbackElement.classList.remove("hidden");
      } else {
        // Remover estilos de error y aplicar estilos válidos de Tailwind
        input.classList.remove("border-red-500", "focus:ring-red-500");
        input.classList.add("border-gray-300", "focus:ring-primary-custom");
        let feedbackElement = input.nextElementSibling;
        if (input.id === "userType") {
          feedbackElement = input.nextElementSibling.nextElementSibling;
        } else if (input.id === "terms") {
          feedbackElement = input.nextElementSibling.nextElementSibling;
        }
        if (feedbackElement) feedbackElement.classList.add("hidden");
      }
    });

    if (formIsValid) {
      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            password: passwordInput.value,
            user_type: userTypeSelect.value,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // alert(data.message || "Registro exitoso."); // Descomentar si se quiere un alert
          showVerificationModal(); // Muestra el modal con el código en consola
        } else {
          alert(data.message || "Error al registrar el usuario.");
          console.error("Error de backend:", data.error);
        }
      } catch (error) {
        console.error("Error de red o del servidor:", error);
        alert(
          "No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } else {
      // Si el formulario no es válido, agrega la clase `was-validated` para mostrar todos los errores.
      // Esta clase se maneja en el CSS (`register.css`) para ocultar/mostrar los mensajes de error.
      registerForm.classList.add("was-validated");
      alert(
        "Por favor, corrige los errores en el formulario antes de registrarte."
      );
    }
  });

  // Validar el input del código de verificación en el modal
  if (verificationCodeInput) {
    verificationCodeInput.addEventListener("input", (event) => {
      event.target.value = event.target.value.replace(/\D/g, ""); // Solo números
      if (event.target.value.length === 6) {
        // Si tiene 6 dígitos, se considera potencialmente válido para efectos de UI
        validateField(verificationCodeInput, true);
      } else {
        // Si no tiene 6 dígitos, se considera inválido para efectos de UI
        validateField(verificationCodeInput, false);
        verificationCodeFeedback.textContent =
          "El código debe tener 6 dígitos."; // Mensaje más específico
      }
    });
  }
});
