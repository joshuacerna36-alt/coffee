(function () {
  'use strict';

  var SELECTORS = {
    form: '#login-form',
    emailInput: '#login-email',
    passwordInput: '#login-password',
    roleInput: '#login-role',
    emailError: '#email-error',
    passwordError: '#password-error',
    roleError: '#role-error',
    formErrorContainer: '#login-error-message',
    formErrorText: '#login-error-text',
    logoutBtn: '#logout-btn'
  };

  var STORAGE_KEY = 'caffiene_auth';
  var ADMIN_PAGE = 'admin.html';
  var CLIENT_PAGE = 'client.html';

  function checkAuth() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        var parsed = JSON.parse(data);
        return {
          isLoggedIn: parsed.loggedIn === true,
          role: parsed.role || null,
          email: parsed.email || null
        };
      }
    } catch (e) {
      console.error('Unable to read auth data:', e);
    }
    return { isLoggedIn: false, role: null, email: null };
  }

  function storeAuth(role, email) {
    var authData = {
      role: role,
      email: email,
      loggedIn: true
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch (e) {
      console.error('Unable to save auth data:', e);
    }
  }

  function redirectToDashboard(role) {
    var url = role === 'admin' ? ADMIN_PAGE : CLIENT_PAGE;
    window.location.href = url;
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Unable to clear auth data:', e);
    }
    window.location.href = 'login.html';
  }

  window.caffieneAuth = {
    STORAGE_KEY: STORAGE_KEY,
    checkAuth: checkAuth,
    logout: logout
  };

  var body = document.body;
  var requiresAuth = body ? body.getAttribute('data-requires-auth') : null;

  if (requiresAuth === 'admin' || requiresAuth === 'client') {
    var session = checkAuth();
    var isAuthorized = session.isLoggedIn && session.role === requiresAuth;

    if (!isAuthorized) {
      window.location.href = 'login.html';
      return;
    }

    var logoutBtn = document.querySelector(SELECTORS.logoutBtn);
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        logout();
      });
    }
    return;
  }

  var preExistingSession = (function () {
    var session = checkAuth();
    return session.isLoggedIn ? session : null;
  })();

  if (preExistingSession) {
    var redirectUrl = preExistingSession.role === 'admin' ? ADMIN_PAGE : CLIENT_PAGE;
    window.location.href = redirectUrl;
    return;
  }

  var form = document.querySelector(SELECTORS.form);
  if (!form) return;

  var fieldConfigs = [
    {
      input: document.querySelector(SELECTORS.emailInput),
      error: document.querySelector(SELECTORS.emailError),
      label: 'Email',
      validate: function (value) {
        if (!value) {
          return { valid: false, message: 'Email is required.' };
        }
        var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EMAIL_REGEX.test(value)) {
          return { valid: false, message: 'Please enter a valid email address.' };
        }
        return { valid: true, message: '' };
      }
    },
    {
      input: document.querySelector(SELECTORS.passwordInput),
      error: document.querySelector(SELECTORS.passwordError),
      label: 'Password',
      validate: function (value) {
        if (!value) {
          return { valid: false, message: 'Password is required.' };
        }
        if (value.length < 6) {
          return { valid: false, message: 'Password must be at least 6 characters.' };
        }
        return { valid: true, message: '' };
      }
    },
    {
      input: document.querySelector(SELECTORS.roleInput),
      error: document.querySelector(SELECTORS.roleError),
      label: 'Role',
      validate: function (value) {
        if (!value) {
          return { valid: false, message: 'Please select a role.' };
        }
        return { valid: true, message: '' };
      }
    }
  ];

  var formErrorContainer = document.querySelector(SELECTORS.formErrorContainer);
  var formErrorText = document.querySelector(SELECTORS.formErrorText);

  function validateField(config) {
    var input = config.input;
    if (!input) return true;

    var value = input.value.trim();
    var result = config.validate(value);

    if (config.error) {
      config.error.textContent = result.message;
      config.error.hidden = result.valid;
    }

    input.setAttribute('aria-invalid', String(!result.valid));
    return result.valid;
  }

  function validateForm() {
    var allValid = true;
    fieldConfigs.forEach(function (config) {
      if (!validateField(config)) {
        allValid = false;
      }
    });
    return allValid;
  }

  function showFormError(message) {
    if (formErrorText) {
      formErrorText.textContent = message;
    }
    if (formErrorContainer) {
      formErrorContainer.hidden = false;
    }
  }

  function hideFormError() {
    if (formErrorContainer) {
      formErrorContainer.hidden = true;
    }
  }

  fieldConfigs.forEach(function (config) {
    if (!config.input) return;

    config.input.addEventListener('blur', function () {
      validateField(config);
    });

    config.input.addEventListener('input', function () {
      if (config.input.getAttribute('aria-invalid') === 'true') {
        validateField(config);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    hideFormError();

    var allValid = validateForm();

    if (!allValid) {
      showFormError('Please fix the highlighted fields and try again.');
      var firstInvalid = null;
      fieldConfigs.forEach(function (config) {
        if (firstInvalid === null && config.input && config.input.getAttribute('aria-invalid') === 'true') {
          firstInvalid = config.input;
        }
      });
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    var roleInput = document.querySelector(SELECTORS.roleInput);
    var emailInput = document.querySelector(SELECTORS.emailInput);

    var role = roleInput ? roleInput.value : '';
    var email = emailInput ? emailInput.value.trim() : '';

    if (role && email) {
      storeAuth(role, email);
      redirectToDashboard(role);
    }
  });
})();
