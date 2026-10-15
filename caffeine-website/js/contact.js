(function () {
  'use strict';

  var SELECTORS = {
    form: '#contact-form',
    nameInput: '#name',
    emailInput: '#email',
    subjectInput: '#subject',
    messageInput: '#message',
    nameError: '#name-error',
    emailError: '#email-error',
    subjectError: '#subject-error',
    messageError: '#message-error',
    formErrorContainer: '#form-error-message',
    formErrorText: '#form-error-text',
    formSuccessContainer: '#form-success-message',
    formSuccessText: '#form-success-text'
  };

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var form = document.querySelector(SELECTORS.form);
  if (!form) return;

  var fieldConfigs = [
    {
      input: document.querySelector(SELECTORS.nameInput),
      error: document.querySelector(SELECTORS.nameError),
      label: 'Name'
    },
    {
      input: document.querySelector(SELECTORS.emailInput),
      error: document.querySelector(SELECTORS.emailError),
      label: 'Email'
    },
    {
      input: document.querySelector(SELECTORS.subjectInput),
      error: document.querySelector(SELECTORS.subjectError),
      label: 'Subject'
    },
    {
      input: document.querySelector(SELECTORS.messageInput),
      error: document.querySelector(SELECTORS.messageError),
      label: 'Message'
    }
  ];

  var formErrorContainer = document.querySelector(SELECTORS.formErrorContainer);
  var formErrorText = document.querySelector(SELECTORS.formErrorText);
  var formSuccessContainer = document.querySelector(SELECTORS.formSuccessContainer);
  var formSuccessText = document.querySelector(SELECTORS.formSuccessText);

  function validateField(config) {
    var input = config.input;
    if (!input) return true;

    var value = input.value.trim();
    var isValid = true;
    var message = '';

    if (input.hasAttribute('required') && !value) {
      isValid = false;
      message = config.label + ' is required.';
    }

    if (isValid && value && input.type === 'email' && !EMAIL_REGEX.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address.';
    }

    if (isValid && value && input.hasAttribute('minlength')) {
      var min = parseInt(input.getAttribute('minlength'), 10);
      if (!isNaN(min) && value.length < min) {
        isValid = false;
        message = 'Must be at least ' + min + ' characters.';
      }
    }

    if (config.error) {
      config.error.textContent = message;
      config.error.hidden = isValid;
    }

    input.setAttribute('aria-invalid', String(!isValid));

    return isValid;
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
    if (formSuccessContainer) {
      formSuccessContainer.hidden = true;
    }
  }

  function showFormSuccess(message) {
    if (formSuccessText) {
      formSuccessText.textContent = message;
    }
    if (formSuccessContainer) {
      formSuccessContainer.hidden = false;
    }
    if (formErrorContainer) {
      formErrorContainer.hidden = true;
    }
  }

  function hideFormStatus() {
    if (formErrorContainer) {
      formErrorContainer.hidden = true;
    }
    if (formSuccessContainer) {
      formSuccessContainer.hidden = true;
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

    hideFormStatus();

    var allValid = validateForm();

    if (allValid) {
      showFormSuccess('Form validation passed. This is a demonstration message — configure a backend to process the submission.');
    } else {
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
    }
  });
})();
