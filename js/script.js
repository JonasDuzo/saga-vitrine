document.addEventListener('DOMContentLoaded', function () {
    /* ===== Header: sombra ao rolar, barra de progresso e botão voltar ao topo ===== */
    var header = document.getElementById('siteHeader');
    var progress = document.getElementById('progressBar');
    var backTop = document.getElementById('backToTop');
    var year = document.getElementById('currentYear');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ===== Vídeo incorporado ao lado do texto do hero (YouTube/Vimeo) ===== */
    var heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        var motionPreference = window.matchMedia
            ? window.matchMedia('(prefers-reduced-motion: reduce)')
            : null;
        var heroIframe = null;

        function getHeroEmbedUrl(rawUrl) {
            if (!rawUrl || !rawUrl.trim()) return '';

            try {
                var url = new URL(rawUrl.trim());
                var host = url.hostname.toLowerCase().replace(/^www\./, '');
                var parts = url.pathname.split('/').filter(Boolean);
                var videoId = '';
                var params = new URLSearchParams();

                if (host === 'youtu.be' || host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
                    if (host === 'youtu.be') {
                        videoId = parts[0] || '';
                    } else {
                        videoId = url.searchParams.get('v') || '';
                        if (!videoId && parts.length >= 2 && ['embed', 'shorts', 'live', 'v'].indexOf(parts[0]) !== -1) {
                            videoId = parts[1];
                        }
                    }

                    if (!/^[a-zA-Z0-9_-]{6,}$/.test(videoId)) return '';

                    params.set('autoplay', '1');
                    params.set('mute', '1');
                    params.set('loop', '1');
                    params.set('playlist', videoId);
                    params.set('controls', '1');
                    params.set('playsinline', '1');
                    params.set('rel', '0');
                    params.set('modestbranding', '1');
                    params.set('iv_load_policy', '3');
                    return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?' + params.toString();
                }

                if (host === 'vimeo.com' || host === 'player.vimeo.com') {
                    if (host === 'player.vimeo.com') {
                        videoId = parts[1] === 'video' ? (parts[2] || '') : (parts[0] || '');
                    } else {
                        videoId = parts[0] || '';
                    }

                    if (!/^\d+$/.test(videoId)) return '';

                    params.set('autoplay', '1');
                    params.set('muted', '1');
                    params.set('loop', '1');
                    params.set('playsinline', '1');
                    params.set('title', '0');
                    params.set('byline', '0');
                    params.set('portrait', '0');

                    /* Links privados/não listados do Vimeo podem exigir o parâmetro h. */
                    var privateHash = url.searchParams.get('h') || (host === 'vimeo.com' && parts.length > 1 ? parts[1] : '');
                    if (privateHash) params.set('h', privateHash);

                    return 'https://player.vimeo.com/video/' + encodeURIComponent(videoId) + '?' + params.toString();
                }
            } catch (error) {
                return '';
            }

            return '';
        }

        function syncHeroVideoMotion() {
            var shouldPlay = !(motionPreference && motionPreference.matches);
            if (!shouldPlay) {
                if (heroIframe) {
                    heroIframe.remove();
                    heroIframe = null;
                }
                heroVideo.classList.remove('is-playing');
                heroVideo.classList.remove('has-video');
                return;
            }

            if (heroIframe) return;

            var embedUrl = getHeroEmbedUrl(heroVideo.getAttribute('data-video-url') || '');
            if (!embedUrl) {
                heroVideo.classList.remove('is-playing');
                heroVideo.classList.remove('has-video');
                return;
            }

            heroIframe = document.createElement('iframe');
            heroIframe.src = embedUrl;
            heroIframe.title = 'Vídeo de apresentação do SAGA';
            heroIframe.allow = 'autoplay; encrypted-media; picture-in-picture';
            heroIframe.referrerPolicy = 'strict-origin-when-cross-origin';
            heroIframe.loading = 'eager';
            heroIframe.tabIndex = 0;
            heroIframe.setAttribute('allowfullscreen', '');
            heroVideo.classList.add('has-video');
            heroIframe.addEventListener('load', function () {
                heroVideo.classList.add('is-playing');
            });
            heroIframe.addEventListener('error', function () {
                heroVideo.classList.remove('is-playing');
                heroVideo.classList.remove('has-video');
            });
            heroVideo.appendChild(heroIframe);
        }

        syncHeroVideoMotion();
        if (motionPreference && typeof motionPreference.addEventListener === 'function') {
            motionPreference.addEventListener('change', syncHeroVideoMotion);
        } else if (motionPreference && typeof motionPreference.addListener === 'function') {
            motionPreference.addListener(syncHeroVideoMotion);
        }
    }

    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        header.classList.toggle('scrolled', y > 24);
        backTop.classList.toggle('show', y > 600);
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (y / max) * 100 : 0;
        progress.style.width = pct.toFixed(2) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===== Menu hambúrguer ===== */
    var burger = document.getElementById('burgerBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    var burgerIcon = document.getElementById('burgerIcon');
    var menuOpen = false;

    function setMenu(open) {
        menuOpen = open;
        mobileMenu.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        burgerIcon.innerHTML = open
            ? '<line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line>'
            : '<line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line>';
    }
    burger.addEventListener('click', function () { setMenu(!menuOpen); });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024 && menuOpen) setMenu(false);
    }, { passive: true });

    /* ===== Animações de entrada com IntersectionObserver ===== */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ===== Carrossel de módulos ===== */

    /* ===== Carrossel de módulos ===== */
    var carousel = document.getElementById('carousel');
    var carPrev = document.getElementById('carPrev');
    var carNext = document.getElementById('carNext');
    var carDots = document.getElementById('carDots');

    if (carousel && carPrev && carNext && carDots) {

        var carCards = Array.from(carousel.querySelectorAll('.card'));
        var dotEls = [];
        var dragging = false;
        var dragMoved = false;
        var startX = 0;
        var startScroll = 0;
        var pointerId = null;
        var suppressClick = false;
        var suppressClickTimer = null;

        if (carCards.length > 0) {

            // Cria os indicadores
            carDots.innerHTML = '';

            carCards.forEach(function (card, i) {
                var dot = document.createElement('button');

                dot.type = 'button';
                dot.className = 'car-dot';
                dot.setAttribute('aria-label', 'Ir para o módulo ' + (i + 1));
                dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');

                dot.addEventListener('click', function () {
                    goTo(i);
                });

                carDots.appendChild(dot);
                dotEls.push(dot);
            });

            function getMaxScroll() {
                return Math.max(0, carousel.scrollWidth - carousel.clientWidth);
            }

            function getCardPosition(index) {
                var position = carCards[index].offsetLeft - carCards[0].offsetLeft;
                return Math.max(0, Math.min(position, getMaxScroll()));
            }

            function getCurrentIndex() {
                var current = carousel.scrollLeft;
                var closest = 0;
                var minDistance = Infinity;

                carCards.forEach(function (card, i) {
                    var distance = Math.abs(getCardPosition(i) - current);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closest = i;
                    }
                });

                return closest;
            }

            function goTo(index) {
                index = Math.max(0, Math.min(index, carCards.length - 1));

                carousel.scrollTo({
                    left: getCardPosition(index),
                    behavior: 'smooth'
                });
            }

            function updateCar() {
                var max = getMaxScroll();
                var current = carousel.scrollLeft;
                var index = getCurrentIndex();

                carPrev.disabled = current <= 4;
                carNext.disabled = current >= max - 4;

                dotEls.forEach(function (dot, i) {
                    var active = i === index;

                    dot.classList.toggle('active', active);
                    dot.setAttribute('aria-current', active ? 'true' : 'false');
                });
            }

            // Eventos de rolagem
            carousel.addEventListener('scroll', updateCar, {
                passive: true
            });

            window.addEventListener('resize', updateCar, {
                passive: true
            });

            // Botão anterior
            carPrev.addEventListener('click', function () {
                goTo(getCurrentIndex() - 1);
            });

            // Botão próximo
            carNext.addEventListener('click', function () {
                goTo(getCurrentIndex() + 1);
            });

            // Navegação pelo teclado
            carousel.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goTo(getCurrentIndex() + 1);
                }

                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goTo(getCurrentIndex() - 1);
                }
            });

            // Arraste com mouse e caneta
            carousel.addEventListener('pointerdown', function (e) {
                if (e.pointerType === 'touch') return;
                if (e.button !== 0) return;
                if (e.target.closest('button, a, input')) return;

                dragging = true;
                dragMoved = false;
                startX = e.clientX;
                startScroll = carousel.scrollLeft;
                pointerId = e.pointerId;

                carousel.classList.add('dragging');
            });

            carousel.addEventListener('pointermove', function (e) {
                if (!dragging || e.pointerId !== pointerId) return;

                var dx = e.clientX - startX;

                if (Math.abs(dx) > 5) {
                    dragMoved = true;
                    carousel.scrollLeft = startScroll - dx;
                }
            });

            function endDrag(e) {
                if (!dragging) return;
                if (e && e.pointerId !== pointerId) return;

                dragging = false;
                carousel.classList.remove('dragging');

                if (dragMoved) {
                    suppressClick = true;

                    clearTimeout(suppressClickTimer);

                    suppressClickTimer = setTimeout(function () {
                        suppressClick = false;
                    }, 300);

                    goTo(getCurrentIndex());
                }

                dragMoved = false;
                pointerId = null;
            }

            carousel.addEventListener('pointerup', endDrag);
            carousel.addEventListener('pointercancel', endDrag);
            carousel.addEventListener('lostpointercapture', endDrag);

            carousel.addEventListener('click', function (e) {
                if (suppressClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    suppressClick = false;
                    clearTimeout(suppressClickTimer);
                }
            }, true);

            updateCar();
        }
    }

    /* ===== Planos: pré-seleção do plano no formulário ===== */
    var planButtons = document.querySelectorAll('.plan-cta');
    planButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var selectedPlan = btn.getAttribute('data-plan') || '';
            var msg = document.getElementById('fMensagem');
            var planField = document.getElementById('fPlano');
            if (planField) planField.value = selectedPlan;
            if (msg && !msg.value.trim()) {
                msg.value = 'Tenho interesse no plano ' + selectedPlan + '.';
            }
            var demoSection = document.getElementById('demonstracao');
            if (demoSection) demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.setTimeout(function () {
                var nameField = document.getElementById('fNome');
                if (nameField) nameField.focus({ preventScroll: true });
            }, 450);
        });
    });

    /* ===== Formulário de demonstração com validação client-side ===== */
    var form = document.getElementById('demoForm');
    var formArea = document.getElementById('demoFormArea');
    var successBox = document.getElementById('successBox');
    var resetBtn = document.getElementById('resetDemo');

    function setError(input, errId, msg) {
        var err = document.getElementById(errId);
        if (msg) {
            input.classList.add('invalid');
            input.setAttribute('aria-invalid', 'true');
            err.textContent = msg;
            return false;
        }
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
        err.textContent = '';
        return true;
    }

    function validateField(id) {
        var el = document.getElementById(id);
        var v = el.value.trim();
        switch (id) {
            case 'fNome':
                return setError(el, 'errNome', v.length < 3 ? 'Informe seu nome completo (mínimo 3 caracteres).' : '');
            case 'fEscola':
                return setError(el, 'errEscola', v.length < 2 ? 'Informe o nome da escola ou da rede.' : '');
            case 'fEmail':
                var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
                return setError(el, 'errEmail', emailOk ? '' : 'Digite um e-mail válido, como voce@escola.gov.br.');
            case 'fTelefone':
                var digits = v.replace(/\D/g, '');
                return setError(el, 'errTelefone', (digits.length < 10 || digits.length > 11) ? 'Informe um telefone com DDD (10 ou 11 dígitos).' : '');
            case 'fMensagem':
                return setError(el, 'errMensagem', v.length > 600 ? 'A mensagem pode ter no máximo 600 caracteres.' : '');
        }
        return true;
    }

    ['fNome', 'fEscola', 'fEmail', 'fTelefone', 'fMensagem'].forEach(function (id) {
        var el = document.getElementById(id);
        el.addEventListener('blur', function () { validateField(id); });
        el.addEventListener('input', function () {
            if (el.classList.contains('invalid')) validateField(id);
        });
    });

    /* Máscara simples de telefone */
    var tel = document.getElementById('fTelefone');
    tel.addEventListener('input', function () {
        var d = tel.value.replace(/\D/g, '').slice(0, 11);
        var out = d;
        if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
        if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length > 10 ? 7 : 6) + '-' + d.slice(d.length > 10 ? 7 : 6);
        tel.value = out;
    });

    /*
     * Configure este endpoint antes da publicação:
     * window.SAGA_CONFIG.formEndpoint = 'https://seu-dominio.com/api/solicitacoes';
     * O endpoint deve aceitar POST JSON e permitir CORS para o domínio do site.
     */
    window.SAGA_CONFIG = window.SAGA_CONFIG || { formEndpoint: '' };
    var formStatus = document.getElementById('formStatus');
    var submitButton = document.getElementById('submitDemo');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var ids = ['fNome', 'fEscola', 'fEmail', 'fTelefone', 'fMensagem'];
        var ok = true;
        var firstInvalid = null;
        ids.forEach(function (id) {
            var valid = validateField(id);
            if (!valid) { ok = false; if (!firstInvalid) firstInvalid = document.getElementById(id); }
        });
        if (!ok) {
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        var endpoint = String(window.SAGA_CONFIG.formEndpoint || '').trim();
        if (!endpoint) {
            formStatus.textContent = 'O canal de recebimento ainda não foi configurado. A equipe responsável precisa definir o endpoint do formulário antes de habilitar o envio.';
            formStatus.hidden = false;
            return;
        }

        if (!/^https:\/\//i.test(endpoint)) {
            formStatus.textContent = 'O endereço de envio configurado é inválido. Entre em contato com o administrador do site.';
            formStatus.hidden = false;
            return;
        }

        formStatus.hidden = true;
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = 'Enviando...';

        var payload = Object.fromEntries(new FormData(form).entries());
        try {
            var response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            formArea.style.display = 'none';
            successBox.classList.add('show');
            successBox.setAttribute('tabindex', '-1');
            successBox.focus();
        } catch (error) {
            formStatus.textContent = 'Não foi possível enviar sua solicitação agora. Verifique sua conexão e tente novamente.';
            formStatus.hidden = false;
        } finally {
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            submitButton.textContent = 'Solicitar demonstração';
        }
    });

    resetBtn.addEventListener('click', function () {
        form.reset();
        ['fNome', 'fEscola', 'fEmail', 'fTelefone', 'fMensagem'].forEach(function (id) {
            var errorIds = { fNome: 'errNome', fEscola: 'errEscola', fEmail: 'errEmail', fTelefone: 'errTelefone', fMensagem: 'errMensagem' };
            setError(document.getElementById(id), errorIds[id], '');
        });
        successBox.classList.remove('show');
        formArea.style.display = '';
        if (formStatus) { formStatus.hidden = true; formStatus.textContent = ''; }
        var planField = document.getElementById('fPlano');
        if (planField) planField.value = '';
        document.getElementById('fNome').focus();
    });

    /* Scroll suave com foco no destino para acessibilidade */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = a.getAttribute('href');
            if (id.length < 2) return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            setTimeout(function () { target.focus({ preventScroll: true }); }, 500);
        });
    });
});