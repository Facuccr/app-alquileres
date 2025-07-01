// js/modules/login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginEmailInput = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // ¡MUY IMPORTANTE! Evitar el envío predeterminado del formulario

      // Eliminar clases de validación previas
      loginForm.classList.remove("was-validated");

      let isValid = true;

      // --- Validación de Email ---
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginEmailInput.value)) {
        loginEmailInput.classList.add("is-invalid");
        isValid = false;
      } else {
        loginEmailInput.classList.remove("is-invalid");
        loginEmailInput.classList.add("is-valid");
      }

      // --- Validación de Contraseña ---
      // Asegurarse de que no esté vacía y cumpla con la longitud mínima (8 caracteres)
      if (
        loginPasswordInput.value.trim() === "" ||
        loginPasswordInput.value.length < 8
      ) {
        loginPasswordInput.classList.add("is-invalid");
        isValid = false;
      } else {
        loginPasswordInput.classList.remove("is-invalid");
        loginPasswordInput.classList.add("is-valid");
      }

      if (isValid) {
        // Si todas las validaciones de frontend pasan, proceder con la petición al backend
        try {
          const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: loginEmailInput.value,
              password: loginPasswordInput.value,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // Si el estado de la respuesta es 2xx (éxito)
            alert(data.message || "Inicio de sesión exitoso.");
            // Redirigir a la página de listados después del login exitoso
            window.location.href = "listings.html";
          } else {
            // Error en el login (ej. credenciales inválidas, cuenta no verificada)
            alert(
              data.message ||
                "Error al iniciar sesión. Por favor, verifica tus credenciales."
            );
            console.error("Error de backend:", data.error);

            // Opcional: Si el error es por credenciales inválidas,
            // puedes marcar los campos de email y contraseña como inválidos
            if (response.status === 401) {
              // 401 Unauthorized
              loginEmailInput.classList.add("is-invalid");
              loginPasswordInput.classList.add("is-invalid");
            }
          }
        } catch (error) {
          console.error("Error de red o del servidor:", error);
          alert(
            "No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde."
          );
        }
      } else {
        // Si hay errores en el frontend, añadir la clase was-validated para mostrar los feedbacks
        loginForm.classList.add("was-validated");
      }
    });

    // --- Validación en tiempo real (opcional, para mejor UX) ---
    // Esto hace que los mensajes de error aparezcan a medida que el usuario escribe
    loginEmailInput.addEventListener("input", () => {
      if (loginForm.classList.contains("was-validated")) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginEmailInput.value)) {
          loginEmailInput.classList.add("is-invalid");
        } else {
          loginEmailInput.classList.remove("is-invalid");
        }
      }
    });

    loginPasswordInput.addEventListener("input", () => {
      if (loginForm.classList.contains("was-validated")) {
        if (
          loginPasswordInput.value.trim() === "" ||
          loginPasswordInput.value.length < 8
        ) {
          loginPasswordInput.classList.add("is-invalid");
        } else {
          loginPasswordInput.classList.remove("is-invalid");
        }
      }
    });
  }
});
