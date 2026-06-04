function toggleMobileMenu() {
    const menu = document.getElementById("menu");
    const toggle = document.querySelector(".mobile-toggle");
    const isOpen = menu.classList.toggle("active");
    toggle.setAttribute("aria-expanded", String(isOpen));
}

function setActiveButton(buttons, activeButton) {
    buttons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });
}

function initMobileMenu() {
    document.querySelectorAll("#menu a").forEach((link) => {
        link.addEventListener("click", () => {
            const menu = document.getElementById("menu");
            const toggle = document.querySelector(".mobile-toggle");
            menu.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

function initThemeToggle() {
    const toggle = document.querySelector("[data-theme-toggle]");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    toggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
}

function initSkillFilters() {
    const buttons = document.querySelectorAll("[data-skill-filter]");
    const cards = document.querySelectorAll("[data-skill-category]");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.skillFilter;
            setActiveButton(buttons, button);

            cards.forEach((card) => {
                const shouldShow = filter === "all" || card.dataset.skillCategory === filter;
                card.classList.toggle("is-hidden", !shouldShow);
            });
        });
    });
}

function initProjectFilters() {
    const buttons = document.querySelectorAll("[data-project-filter]");
    const searchInput = document.querySelector("[data-project-search]");
    const cards = document.querySelectorAll("[data-project-tags]");
    let activeFilter = "all";

    function updateProjects() {
        const search = searchInput.value.trim().toLowerCase();

        cards.forEach((card) => {
            const tags = card.dataset.projectTags.toLowerCase();
            const text = card.textContent.toLowerCase();
            const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
            const matchesSearch = !search || tags.includes(search) || text.includes(search);

            card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
        });
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.projectFilter;
            setActiveButton(buttons, button);
            updateProjects();
        });
    });

    searchInput.addEventListener("input", updateProjects);
}

function initExperienceDetails() {
    document.querySelectorAll("[data-expand-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            const details = button.nextElementSibling;
            const isHidden = details.hasAttribute("hidden");

            details.toggleAttribute("hidden", !isHidden);
            button.textContent = isHidden ? "Hide highlights" : "View highlights";
        });
    });
}

function initCounters() {
    const counters = document.querySelectorAll("[data-target]");

    counters.forEach((counter) => {
        const target = Number(counter.dataset.target);
        let current = 0;

        const interval = setInterval(() => {
            current += 1;
            counter.textContent = String(current);

            if (current >= target) {
                clearInterval(interval);
            }
        }, 180);
    });
}

function initResumeModal() {
    const modal = document.querySelector("[data-modal]");
    const openButton = document.querySelector("[data-resume-preview]");
    const closeButtons = document.querySelectorAll("[data-modal-close]");

    function openModal() {
        modal.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = "";
    }

    openButton.addEventListener("click", openModal);
    closeButtons.forEach((button) => button.addEventListener("click", closeModal));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
}

function initChatbotLogoReplacement() {
    const logoSrc = "./imgs/1d1669195766115.Y3JvcCwzMDAwLDIzNDYsMCwzMjY.png";
    const chatSelector = "[id*='chatling' i], [class*='chatling' i], [id*='chatbot' i], [class*='chatbot' i]";

    function isChatElement(element) {
        return element instanceof HTMLElement && Boolean(element.closest(chatSelector));
    }

    function styleAvatar(image) {
        image.src = logoSrc;
        image.alt = "Priya Dugg logo";
        image.classList.add("portfolio-chat-avatar");
        image.style.width = "52px";
        image.style.height = "52px";
        image.style.borderRadius = "50%";
        image.style.objectFit = "cover";
        image.style.backgroundColor = "#ffffff";
        image.style.border = "1px solid #d8e1ea";
    }

    function replaceChatIcons(root = document) {
        root.querySelectorAll(`${chatSelector} img`).forEach((image) => {
            if (image.dataset.portfolioLogoApplied === "true") {
                return;
            }

            image.dataset.portfolioLogoApplied = "true";
            styleAvatar(image);
        });

        root.querySelectorAll(`${chatSelector} svg`).forEach((svg) => {
            if (!isChatElement(svg) || svg.dataset.portfolioLogoApplied === "true") {
                return;
            }

            const image = document.createElement("img");
            image.dataset.portfolioLogoApplied = "true";
            styleAvatar(image);
            svg.replaceWith(image);
        });
    }

    replaceChatIcons();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    replaceChatIcons(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initThemeToggle();
    initSkillFilters();
    initProjectFilters();
    initExperienceDetails();
    initCounters();
    initResumeModal();
    initChatbotLogoReplacement();
});
