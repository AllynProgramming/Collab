const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const ACCOUNTS_KEY = 'merzBeautyAccounts';
const SESSION_KEY = 'merzBeautySession';

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

function getAccounts() {
    const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
    return storedAccounts ? JSON.parse(storedAccounts) : [];
}

function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getCurrentUser() {
    const storedUser = localStorage.getItem(SESSION_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(SESSION_KEY);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
    }
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
    }
    if (!document.querySelector('.fixed.inset-0.z-50:not(.hidden)')) {
        document.body.style.overflow = 'auto';
    }
}

function switchModal(fromId, toId) {
    closeModal(fromId);
    openModal(toId);
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('hidden', 'bg-red-600', 'border-red-400');

    if (isError) {
        toast.classList.add('bg-red-600', 'border-red-400');
    } else {
        toast.classList.add('bg-botanical-deep', 'border-botanical-gold');
    }

    toast.classList.remove('bg-botanical-deep', 'border-botanical-gold');
    toast.classList.add(isError ? 'bg-red-600' : 'bg-botanical-deep');
    toast.classList.add(isError ? 'border-red-400' : 'border-botanical-gold');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

function handleRegister(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const mobile = String(formData.get('mobile') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!firstName || !lastName || !mobile || !email || !password || !confirmPassword) {
        showToast('Please complete all fields to register.', true);
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', true);
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match.', true);
        return;
    }

    const accounts = getAccounts();
    const exists = accounts.some(account => {
        return account.email.toLowerCase() === email.toLowerCase() || account.mobile === mobile;
    });

    if (exists) {
        showToast('An account with this email or mobile number already exists.', true);
        return;
    }

    const newUser = {
        firstName,
        lastName,
        mobile,
        email,
        password,
    };

    accounts.push(newUser);
    saveAccounts(accounts);
    setCurrentUser(newUser);
    updateAuthUI();
    form.reset();
    closeModal('registerModal');
    window.location.href = 'CUstomer_Dashboard.html';
}

function handleLogin(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const identifier = String(formData.get('identifier') || '').trim();
    const password = String(formData.get('password') || '');

    if (!identifier || !password) {
        showToast('Please enter your email/mobile and password.', true);
        return;
    }

    const accounts = getAccounts();
    const user = accounts.find(account => {
        const emailMatches = account.email.toLowerCase() === identifier.toLowerCase();
        const mobileMatches = account.mobile === identifier;
        return (emailMatches || mobileMatches) && account.password === password;
    });

    if (!user) {
        showToast('Invalid email/mobile or password.', true);
        return;
    }

    setCurrentUser(user);
    updateAuthUI();
    form.reset();
    closeModal('loginModal');
    window.location.href = 'CUstomer_Dashboard.html';
}

function handleAuthButtonClick() {
    const currentUser = getCurrentUser();

    if (currentUser) {
        logoutUser();
        return;
    }

    openModal('loginModal');
}

function updateAuthUI() {
    const currentUser = getCurrentUser();
    const navLoginBtn = document.getElementById('navLoginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const profileBtn = document.getElementById('profileBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');
    const profilePanel = document.getElementById('profilePanel');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');

    if (currentUser) {
        if (navLoginBtn) {
            navLoginBtn.textContent = 'Logout';
            navLoginBtn.classList.remove('hover:text-botanical-emerald');
            navLoginBtn.classList.add('hover:text-botanical-gold');
        }

        if (profileBtn) profileBtn.classList.remove('hidden');
        if (registerBtn) registerBtn.classList.add('hidden');
        if (mobileProfileBtn) mobileProfileBtn.classList.remove('hidden');
        if (mobileLoginBtn) mobileLoginBtn.textContent = 'Logout';
        if (mobileRegisterBtn) mobileRegisterBtn.classList.add('hidden');

        if (profilePanel && profileName && profileEmail && profilePhone) {
            profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            profileEmail.textContent = currentUser.email;
            profilePhone.textContent = currentUser.mobile;
            profilePanel.classList.remove('hidden');
        }
    } else {
        if (navLoginBtn) {
            navLoginBtn.textContent = 'Sign In';
            navLoginBtn.classList.add('hover:text-botanical-emerald');
            navLoginBtn.classList.remove('hover:text-botanical-gold');
        }

        if (profileBtn) profileBtn.classList.add('hidden');
        if (registerBtn) registerBtn.classList.remove('hidden');
        if (mobileProfileBtn) mobileProfileBtn.classList.add('hidden');
        if (mobileLoginBtn) mobileLoginBtn.textContent = 'Sign In';
        if (mobileRegisterBtn) mobileRegisterBtn.classList.remove('hidden');

        if (profilePanel) profilePanel.classList.add('hidden');
    }
}

function logoutUser() {
    clearCurrentUser();
    updateAuthUI();
    showToast('You have been logged out.');
}

function initializeAuth() {
    const navLoginBtn = document.getElementById('navLoginBtn');
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (event) => {
            event.preventDefault();
            handleAuthButtonClick();
        });
    }

    const profileLogoutBtn = document.getElementById('profileLogoutBtn');
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', logoutUser);
    }

    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (currentUser) {
                logoutUser();
                return;
            }
            openModal('loginModal');
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    updateAuthUI();
}

initializeAuth();

function handleAuth(event, successText) {
    event.preventDefault();
    closeModal('registerModal');
    closeModal('loginModal');
    showToast(successText);
}
