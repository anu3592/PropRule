/**
 * PropRules — Global Animation Engine
 * js/animations.js
 *
 * Handles: scroll reveals, number counters, page transitions,
 * quiz slide transitions, compare highlights, watchlist collapse.
 * No Three.js. No WebGL. No scrub. No pin.
 */

(function () {
    'use strict';

    /* ================================================
       1. PAGE FADE-IN ON LOAD
    ================================================ */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.22s ease';
    window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

    /* ================================================
       2. PAGE TRANSITION ON LINK CLICK
       Fade out → navigate. New page fades in (via load above).
    ================================================ */
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto') ||
            href.startsWith('http') || link.target === '_blank') return;
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 200);
    });

    /* ================================================
       3. STICKY HEADER — transparent → solid on scroll
    ================================================ */
    const header = document.querySelector('header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 24);
            // Show nav CTA button after scroll
            const navCta = document.getElementById('navCta');
            if (navCta) navCta.style.display = window.scrollY > 30 ? 'inline-flex' : 'none';
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ================================================
       4. SCROLL REVEAL — .reveal elements
       Simple IntersectionObserver — no scrub, no pin.
    ================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.delay || 0);
                setTimeout(() => el.classList.add('visible'), delay);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    function initReveal() {
        document.querySelectorAll('.reveal').forEach((el, i) => {
            // Stagger siblings in same parent
            const siblings = el.parentElement
                ? [...el.parentElement.querySelectorAll('.reveal')]
                : [];
            const idx = siblings.indexOf(el);
            if (idx > 0) el.dataset.delay = idx * 85;
            revealObserver.observe(el);
        });
    }

    /* ================================================
       5. NUMBER COUNTER ANIMATION
       Usage: <span class="counter" data-target="15">0</span>
    ================================================ */
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
        const suffix = el.dataset.suffix || el.textContent.replace(/[0-9.]/g, '');
        const duration = 1400;
        const start = performance.now();
        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.round(eased * target * 10) / 10;
            el.textContent = (Number.isInteger(target) ? Math.round(current) : current) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    function initCounters() {
        document.querySelectorAll('.counter').forEach(el => {
            const raw = el.textContent.trim();
            el.dataset.target = raw.replace(/[^0-9.]/g, '');
            el.dataset.suffix = raw.replace(/[0-9.]/g, '');
            el.textContent = '0' + el.dataset.suffix;
            counterObserver.observe(el);
        });
    }

    /* ================================================
       6. FIRMS PAGE — filter card fade
    ================================================ */
    function initFirmsPage() {
        if (!document.getElementById('firmsGrid')) return;

        // Stagger card entrance on load
        const cards = document.querySelectorAll('.firm-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(24px)';
            card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
            }, 120 + i * 75);
        });

        // Intercept renderFirms to add transition on filter change
        const grid = document.getElementById('firmsGrid');
        if (!grid) return;
        const observer = new MutationObserver(() => {
            grid.querySelectorAll('.firm-card').forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(16px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                    card.style.opacity = '';
                    card.style.transform = '';
                }, i * 65);
            });
        });
        observer.observe(grid, { childList: true });
    }

    /* ================================================
       7. FIRM DETAIL PAGE — stat counters + rule highlights
    ================================================ */
    function initFirmDetailPage() {
        // Detect firm detail by URL or marker
        if (!document.querySelector('.firm-hero, .quick-rules-grid')) return;

        // Mark warning/ok rule rows
        document.querySelectorAll('tr, .rule-item').forEach(row => {
            const text = row.textContent.toLowerCase();
            if (
                text.includes('consistency') || text.includes('windfall') ||
                text.includes('restricted') || text.includes('not allowed') ||
                text.includes('yes') && (text.includes('clause') || text.includes('rule'))
            ) {
                row.classList.add('rule-row-warn');
                const firstCell = row.querySelector('td, .label');
                if (firstCell && !firstCell.querySelector('.warn-dot')) {
                    const dot = document.createElement('span');
                    dot.className = 'warn-dot';
                    firstCell.prepend(dot);
                }
            }
        });

        // Pulse CTA compare button
        const ctas = document.querySelectorAll('.btn-primary');
        ctas.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('compare')) {
                btn.classList.add('btn-cta-pulse');
            }
        });

        // Hidden rule cards sweep reveal
        const hiddenCards = document.querySelectorAll('.hidden-rule-card, .warning-card');
        hiddenCards.forEach(card => card.classList.add('hidden-rule-reveal'));

        // Watchlist button bounce
        const watchBtn = document.getElementById('ftmoWatchlistBtn');
        if (watchBtn) {
            const origToggle = watchBtn.onclick;
            watchBtn.addEventListener('click', () => {
                const icon = document.getElementById('ftmoStarIcon');
                if (icon) {
                    icon.parentElement.classList.remove('star-bounce');
                    void icon.parentElement.offsetWidth; // reflow
                    icon.parentElement.classList.add('star-bounce');
                }
            });
        }
    }

    /* ================================================
       8. COMPARE PAGE — column hover, row stagger, highlights
    ================================================ */
    function initComparePage() {
        if (!document.getElementById('comparisonTable') && !document.querySelector('.compare-grid')) return;

        // Make firm header row sticky
        const headerRow = document.querySelector('.compare-firms-header, thead tr');
        if (headerRow && headerRow.closest('thead')) {
            headerRow.closest('thead').classList.add('compare-sticky-header');
        }

        // Column hover tint
        const table = document.querySelector('#comparisonTable, table.compare-table');
        if (table) {
            const cols = table.querySelectorAll('th:not(:first-child)');
            cols.forEach((th, colIdx) => {
                const allColCells = table.querySelectorAll(
                    `td:nth-child(${colIdx + 2}), th:nth-child(${colIdx + 2})`
                );
                th.addEventListener('mouseenter', () =>
                    allColCells.forEach(c => c.classList.add('compare-col-hover'))
                );
                th.addEventListener('mouseleave', () =>
                    allColCells.forEach(c => c.classList.remove('compare-col-hover'))
                );
            });

            // Row stagger animation on render
            const animateRows = () => {
                table.querySelectorAll('tbody tr').forEach((row, i) => {
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-10px)';
                    row.style.transition = `opacity 0.3s ease ${i * 55}ms, transform 0.3s ease ${i * 55}ms`;
                    setTimeout(() => {
                        row.style.opacity = '';
                        row.style.transform = '';
                    }, 80 + i * 55);
                });
            };
            // Observe table mutations (firms added)
            const tableObserver = new MutationObserver(animateRows);
            tableObserver.observe(table, { childList: true, subtree: true });
            animateRows();
        }

        // Summary card entrance
        const summary = document.querySelector('.compare-summary-card');
        if (summary) {
            summary.style.transform = 'scale(0.97)';
            summary.style.opacity = '0';
            summary.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            const so = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    summary.style.transform = 'scale(1)';
                    summary.style.opacity = '1';
                    so.disconnect();
                }
            }, { threshold: 0.3 });
            so.observe(summary);
        }
    }

    /* ================================================
       9. FIND MY FIRM — quiz transitions + progress bar
    ================================================ */
    function initQuizPage() {
        if (!document.getElementById('quizSection')) return;

        // Inject progress bar above quiz
        const quizSection = document.getElementById('quizSection');
        const progressWrap = document.createElement('div');
        progressWrap.className = 'quiz-progress-bar';
        progressWrap.innerHTML = '<div class="quiz-progress-fill" id="quizProgressFill"></div>';
        quizSection.insertBefore(progressWrap, quizSection.firstChild);

        const fill = document.getElementById('quizProgressFill');

        // Hook into quiz navigation
        // We patch the existing renderQuestion and showResults if available
        const origRender = window.renderQuestion;
        if (typeof origRender === 'undefined') {
            // Watch for question changes via DOM mutation
            const questionEl = document.querySelector('.quiz-question, .question-block, [id^="question"]');
            if (questionEl) {
                let currentIdx = 0;
                const qObserver = new MutationObserver(() => {
                    // Read progress from any counter element
                    const progressEl = document.querySelector('.quiz-progress-text, .step-counter');
                    if (progressEl) {
                        const match = progressEl.textContent.match(/(\d+)\s*[\/of]\s*(\d+)/);
                        if (match) {
                            const pct = (parseInt(match[1]) / parseInt(match[2])) * 100;
                            if (fill) fill.style.width = pct + '%';
                        }
                    }
                    // Slide animation
                    questionEl.style.animation = 'none';
                    void questionEl.offsetWidth;
                    questionEl.style.animation = 'slideInRight 0.3s ease forwards';
                });
                qObserver.observe(quizSection, { childList: true, subtree: true });
            }
        }

        // Style option buttons hover/select
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.option-btn').forEach(b => {
                    b.classList.remove('selected');
                    b.classList.add('dimmed');
                });
                btn.classList.remove('dimmed');
                btn.classList.add('selected');
            });
        });

        // Results: match bars
        const animateResultBars = () => {
            document.querySelectorAll('.match-bar-fill').forEach(bar => {
                const target = bar.dataset.width || '70';
                setTimeout(() => { bar.style.width = target + '%'; }, 300);
            });
            // Best match card
            const best = document.querySelector('.result-card');
            if (best) best.classList.add('best-match');
        };
        // Watch for results section becoming visible
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            const ro = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) { animateResultBars(); ro.disconnect(); }
            }, { threshold: 0.2 });
            ro.observe(resultsSection);
        }
    }

    /* ================================================
       10. BLOG PAGE — image zoom + article list hover
    ================================================ */
    function initBlogPage() {
        if (!document.querySelector('.blog-grid, .articles-grid, .blog-hero')) return;

        // Wrap images for zoom effect
        document.querySelectorAll('.article-card img, .blog-card img').forEach(img => {
            const parent = img.parentElement;
            if (!parent.classList.contains('blog-card-img-wrap')) {
                const wrap = document.createElement('div');
                wrap.className = 'blog-card-img-wrap';
                parent.insertBefore(wrap, img);
                wrap.appendChild(img);
            }
        });

        // Article list items — teal left border hover
        document.querySelectorAll('.article-list-item, .blog-list-item').forEach(item => {
            item.classList.add('article-list-item');
        });

        // Stagger card entrance
        document.querySelectorAll('.article-card, .blog-card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`;
            setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
            }, 100 + i * 80);
        });
    }

    /* ================================================
       11. ACCOUNT PAGE — watchlist stagger + remove
    ================================================ */
    function initAccountPage() {
        if (!document.getElementById('watchlistSection') && !document.querySelector('.watchlist-grid')) return;

        // Stagger watchlist cards
        const wCards = document.querySelectorAll('.watchlist-item, .watchlist-card');
        wCards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            card.style.transition = `opacity 0.4s ease ${i * 90}ms, transform 0.4s ease ${i * 90}ms`;
            setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
            }, 100 + i * 90);
        });

        // Animate quiz tags
        document.querySelectorAll('.quiz-tag').forEach((tag, i) => {
            setTimeout(() => tag.classList.add('visible'), 200 + i * 60);
        });

        // Remove button collapse
        document.querySelectorAll('.btn-remove-watchlist, [onclick*="removeWatchlist"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.watchlist-item, .watchlist-card');
                if (card) {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, max-height 0.35s ease, padding 0.35s ease, margin 0.35s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    card.style.maxHeight = card.offsetHeight + 'px';
                    setTimeout(() => {
                        card.style.maxHeight = '0';
                        card.style.padding = '0';
                        card.style.margin = '0';
                        card.style.overflow = 'hidden';
                    }, 50);
                    setTimeout(() => card.remove(), 380);
                }
            });
        });
    }

    /* ================================================
       12. ADMIN PAGE — form focus, status pulse
    ================================================ */
    function initAdminPage() {
        if (!document.querySelector('.sidebar') && !document.getElementById('adminPanel')) return;

        // Draft badge pulse
        document.querySelectorAll('.status-badge').forEach(badge => {
            if (badge.textContent.trim().toLowerCase() === 'draft') {
                badge.classList.add('status-draft');
            }
        });

        // Save button success state
        document.querySelectorAll('[onclick*="save"], .btn-save').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    btn.classList.add('btn-save-success');
                    const prev = btn.innerHTML;
                    btn.innerHTML = '<i data-lucide="check"></i> Saved!';
                    if (window.lucide) window.lucide.createIcons();
                    setTimeout(() => {
                        btn.classList.remove('btn-save-success');
                        btn.innerHTML = prev;
                        if (window.lucide) window.lucide.createIcons();
                    }, 2500);
                }, 300);
            });
        });
    }

    /* ================================================
       13. TOOLTIP INIT — all [data-tooltip] elements
    ================================================ */
    function initTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            if (el.closest('.tooltip-wrap')) return;
            const wrap = document.createElement('span');
            wrap.className = 'tooltip-wrap';
            el.parentNode.insertBefore(wrap, el);
            wrap.appendChild(el);
            const box = document.createElement('span');
            box.className = 'tooltip-box';
            box.textContent = el.dataset.tooltip;
            wrap.appendChild(box);
        });
    }

    /* ================================================
       14. BUTTON LOADING STATE
       Add class .btn-loadable to buttons you want loading state on.
    ================================================ */
    function initLoadingButtons() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                const btn = form.querySelector('button[type="submit"], .btn-primary');
                if (btn) {
                    btn.classList.add('btn-loading');
                    btn.disabled = true;
                    setTimeout(() => {
                        btn.classList.remove('btn-loading');
                        btn.disabled = false;
                    }, 4000); // safety reset
                }
            });
        });
    }

    /* ================================================
       15. INIT ON DOM READY
    ================================================ */
    window.addEventListener('DOMContentLoaded', () => {
        initReveal();
        initCounters();
        initTooltips();
        initLoadingButtons();

        // Page-specific
        initFirmsPage();
        initFirmDetailPage();
        initComparePage();
        initQuizPage();
        initBlogPage();
        initAccountPage();
        initAdminPage();
    });

})();
