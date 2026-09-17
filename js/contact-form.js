document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const submitButton = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-form-status]');
    const configNotice = form.querySelector('[data-form-config-notice]');
    const endpoint = form.dataset.formspreeEndpoint || '';
    const isConfigured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)
        && !endpoint.includes('REPLACE_WITH_FORM_ID');
    let submitting = false;

    function setStatus(message, isError = false) {
        status.textContent = message;
        status.classList.toggle('form-status--error', isError);
    }

    if (!isConfigured) {
        setStatus('Biểu mẫu chưa được cấu hình. Vui lòng liên hệ qua email hoặc hotline bên trên.', true);
    } else {
        form.action = endpoint;
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-disabled');
        if (configNotice) configNotice.hidden = true;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (submitting) return;

        if (!isConfigured) {
            setStatus('Không thể gửi: endpoint Formspree chưa được cấu hình. Vui lòng dùng email hoặc hotline.', true);
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            setStatus('Vui lòng điền đầy đủ và đúng định dạng các trường bắt buộc.', true);
            return;
        }

        submitting = true;
        submitButton.disabled = true;
        submitButton.setAttribute('aria-disabled', 'true');
        setStatus('Đang gửi yêu cầu...');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form)
            });
            const result = await response.json().catch(function () { return {}; });
            if (!response.ok) {
                const message = result.errors && result.errors.length
                    ? result.errors.map(function (error) { return error.message; }).join(' ')
                    : 'Không thể gửi yêu cầu qua Formspree.';
                throw new Error(message);
            }

            form.reset();
            setStatus('Yêu cầu đã được gửi. VTA Group sẽ phản hồi trong thời gian sớm nhất.');
        } catch (error) {
            setStatus(`${error.message || 'Không thể gửi yêu cầu.'} Vui lòng gửi email tới tnhhxnkvta@gmail.com hoặc gọi 0908 306 127.`, true);
        } finally {
            submitting = false;
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-disabled');
        }
    });
});
