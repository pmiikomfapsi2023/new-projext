document.addEventListener('DOMContentLoaded', function() {

    /* =====================================================
       1. Menu Mobile
       ===================================================== */
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (btn && menu) {
        btn.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });

        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menu.classList.add('hidden');
            });
        });
    }

    /* =====================================================
       2. Dark Mode Toggle
       ===================================================== */
    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const darkIcons = document.querySelectorAll('.theme-toggle-dark-icon');
    const lightIcons = document.querySelectorAll('.theme-toggle-light-icon');

    function setThemeIcon(isDark) {
        if (isDark) {
            darkIcons.forEach(function(icon) { icon.classList.add('hidden'); });
            lightIcons.forEach(function(icon) { icon.classList.remove('hidden'); });
        } else {
            lightIcons.forEach(function(icon) { icon.classList.add('hidden'); });
            darkIcons.forEach(function(icon) { icon.classList.remove('hidden'); });
        }
    }

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        document.body.classList.toggle('dark-mode', isDark);
        setThemeIcon(isDark);
        localStorage.setItem('color-theme', theme);
    }

    const savedTheme = localStorage.getItem('color-theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    function toggleTheme() {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(nextTheme);
    }

    if (themeToggleDesktop) {
        themeToggleDesktop.addEventListener('click', toggleTheme);
    }

    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    /* =====================================================
       3. Kontrol Chatbox AI
       ===================================================== */
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatContent = document.getElementById('chat-content');

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxEB_Uskbf2nn9Ru0mxkfKf3h32Az_aXBbKaY1S6rnibW0V2klHqEk97suZ0eSQVAwN/exec";

    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', function() {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden') && chatInput) {
                setTimeout(function() {
                    chatInput.focus();
                }, 80);
            }
        });
    }

    if (closeChat && chatWindow) {
        closeChat.addEventListener('click', function() {
            chatWindow.classList.add('hidden');
        });
    }

    if (chatForm && chatInput && chatContent) {
        chatForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const msg = chatInput.value.trim();
            if (!msg) return;

            appendMessage('user', msg);
            chatInput.value = '';

            const loadingId = appendMessage('bot', 'Sedang berpikir...');

            try {
                const response = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    body: JSON.stringify({ message: msg })
                });

                const data = await response.json();
                const loadingMessage = document.getElementById(loadingId);

                if (loadingMessage) {
                    loadingMessage.innerText = data.reply || 'Maaf Sahabat, belum ada jawaban dari server.';
                }
            } catch (err) {
                const loadingMessage = document.getElementById(loadingId);
                if (loadingMessage) {
                    loadingMessage.innerText = "Maaf Sahabat, koneksi terputus. Coba lagi nanti.";
                }
            }
        });
    }

    function appendMessage(sender, text) {
        const id = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const div = document.createElement('div');

        if (sender === 'user') {
            div.className = 'message-user';
        } else {
            div.className = 'message-bot';
            div.id = id;
        }

        div.innerText = text;
        chatContent.appendChild(div);

        setTimeout(function() {
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 50);

        return id;
    }

    /* =====================================================
       4. Login Portal Kader
       ===================================================== */
    const namaUser = localStorage.getItem('namaKader'); 

    if (namaUser) {
        const authDesktop = document.getElementById('auth-desktop-container');

        if (authDesktop) {
            authDesktop.innerHTML = `
                <div class="relative">
                    <button id="desktop-user-button" class="user-menu-btn" type="button">
                        Halo, Sahabat ${escapeHTML(namaUser)}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="desktop-dropdown" class="absolute right-0 top-full pt-2 w-48 hidden z-50">
                        <div class="user-dropdown-box">
                            <a href="ganti-password">Ganti Password</a>
                            <button onclick="logoutKader()" type="button">Keluar</button>
                        </div>
                    </div>
                </div>
            `;

            const userButton = document.getElementById('desktop-user-button');
            const dropdown = document.getElementById('desktop-dropdown');

            if (userButton && dropdown) {
                userButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                });

                document.addEventListener('click', function(e) {
                    if (!authDesktop.contains(e.target)) {
                        dropdown.classList.add('hidden');
                    }
                });
            }
        }

        const authMobile = document.getElementById('auth-mobile-container');

        if (authMobile) {
            authMobile.innerHTML = `
                <div class="mobile-user-box">
                    <div>
                        <p class="small-label">Masuk sebagai:</p>
                        <p class="user-name">Sahabat ${escapeHTML(namaUser)}</p>
                    </div>
                    <div class="mobile-user-actions">
                        <a href="ganti-password">Ganti Password</a>
                        <button onclick="logoutKader()" type="button">Keluar</button>
                    </div>
                </div>
            `;
        }
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});

/* Fungsi Keluar / Logout */
window.logoutKader = function() {
    localStorage.clear(); 
    window.location.reload();
};
