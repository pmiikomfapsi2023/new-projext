document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Logika Menu Mobile (Hamburger)
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // 2. Logika Dark Mode Toggle
    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const darkIcons = document.querySelectorAll('.theme-toggle-dark-icon');
    const lightIcons = document.querySelectorAll('.theme-toggle-light-icon');

    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        lightIcons.forEach(icon => icon.classList.remove('hidden'));
    } else {
        darkIcons.forEach(icon => icon.classList.remove('hidden'));
    }

    function toggleTheme() {
        darkIcons.forEach(icon => icon.classList.toggle('hidden'));
        lightIcons.forEach(icon => icon.classList.toggle('hidden'));

        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('color-theme', 'dark');
        }
    }

    if (themeToggleDesktop) {
        themeToggleDesktop.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // 3. Kontrol Chatbox AI
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatContent = document.getElementById('chat-content');

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxEB_Uskbf2nn9Ru0mxkfKf3h32Az_aXBbKaY1S6rnibW0V2klHqEk97suZ0eSQVAwN/exec";

    if (chatToggle && chatWindow && closeChat) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            chatInput.focus();
        });
        closeChat.addEventListener('click', () => chatWindow.classList.add('hidden'));
    }

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
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
                
                document.getElementById(loadingId).innerText = data.reply;
            } catch (err) {
                document.getElementById(loadingId).innerText = "Maaf Sahabat, koneksi terputus. Coba lagi nanti.";
            }
        });
    }

    function appendMessage(sender, text) {
        const id = 'msg-' + Date.now();
        const div = document.createElement('div');
        
        if (sender === 'user') {
            div.className = 'bg-pmii-blue text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] shadow-md w-fit break-words whitespace-pre-wrap';
            div.innerText = text;
        } else {
            div.className = 'bg-blue-100 text-pmii-dark p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm text-gray-800 w-fit break-words whitespace-pre-wrap';
            div.id = id;
            div.innerText = text;
        }
        chatContent.appendChild(div);
        
        setTimeout(() => {
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 50);
        return id;
    }

    // 4. Logika Login Portal Kader
    const namaUser = localStorage.getItem('namaKader'); 
    
    if (namaUser) {
        const authDesktop = document.getElementById('auth-desktop-container');
        if (authDesktop) {
            authDesktop.innerHTML = `
                <div class="relative group" onclick="const menu = document.getElementById('desktop-dropdown'); menu.classList.toggle('hidden');">
                    <button class="bg-blue-50 text-pmii-blue px-4 py-2 rounded-full text-sm font-bold border border-blue-200 flex items-center gap-2 transition hover:bg-blue-100 focus:outline-none cursor-pointer">
                        Halo, Sahabat ${namaUser}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="desktop-dropdown" class="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                        <div class="bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                            <a href="ganti-password" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pmii-blue transition">Ganti Password</a>
                            <button onclick="logoutKader()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">Keluar</button>
                        </div>
                    </div>
                </div>
            `;
        }

        const authMobile = document.getElementById('auth-mobile-container');
        if (authMobile) {
            authMobile.innerHTML = `
                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col gap-3 shadow-sm">
                    <div>
                        <p class="text-xs text-gray-500 font-medium">Masuk sebagai:</p>
                        <p class="font-bold text-pmii-blue text-sm">Sahabat ${namaUser}</p>
                    </div>
                    <div class="border-t border-blue-200/50 pt-3 flex flex-col gap-2">
                        <a href="ganti-password" class="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold text-center border border-gray-200 hover:bg-gray-50 transition w-full shadow-sm">Ganti Password</a>
                        <button onclick="logoutKader()" class="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold text-center hover:bg-red-100 transition w-full shadow-sm">Keluar</button>
                    </div>
                </div>
            `;
        }
    }
});

// Fungsi Keluar / Logout (Wajib di luar agar bisa diklik)
window.logoutKader = function() {
    localStorage.clear(); 
    window.location.reload();
}
