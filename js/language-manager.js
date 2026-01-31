// ============================================
// Sobutay Multi-Language Management System
// ============================================

let translations = {};
let currentLanguage = 'tr';
let isLoading = false;

// LocalStorage'dan dili al
function getSavedLanguage() {
    return localStorage.getItem('sobutay-language') || 'tr';
}

// Dili localStorage'a kaydet
function saveLanguage(lang) {
    localStorage.setItem('sobutay-language', lang);
}

// Çeviri dosyasını yükle
async function loadTranslations() {
    if (isLoading) return false;
    
    try {
        isLoading = true;
        // Dinamik yol belirleme - projeler klasöründe mi değil mi kontrol et
        const isInProjectsFolder = window.location.pathname.includes('/projeler/');
        const filePath = isInProjectsFolder ? '../data/translations.json' : 'data/translations.json';
        
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Çeviri dosyası bulunamadı');
        
        translations = await response.json();
        currentLanguage = getSavedLanguage();
        
        console.log('Çeviriler yüklendi:', Object.keys(translations));
        return true;
    } catch (error) {
        console.error('Çeviri yükleme hatası:', error);
        return false;
    } finally {
        isLoading = false;
    }
}

// Çeviriye erişim fonksiyonu (nokta notasyonu ile)
function getText(path, defaultText = '') {
    try {
        const parts = path.split('.');
        let current = translations[currentLanguage];
        
        for (const part of parts) {
            current = current?.[part];
            if (current === undefined) return defaultText;
        }
        
        return current ?? defaultText;
    } catch (e) {
        console.warn(`Çeviri bulunamadı: ${path}`);
        return defaultText;
    }
}

// data-i18n öznitelikli öğeleri güncelle
function updateI18nElements() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const path = element.dataset.i18n;
        const text = getText(path);
        
        if (!text) return;
        
        if (element.tagName === 'TITLE') {
            document.title = text;
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.tagName === 'META') {
            element.content = text;
        } else {
            element.textContent = text;
        }
    });
}

// Dil değiştir
function changeLanguage(newLang) {
    if (!translations[newLang]) {
        console.error('Dil yok:', newLang);
        return;
    }
    
    if (currentLanguage === newLang) return;
    
    currentLanguage = newLang;
    saveLanguage(newLang);
    
    // Sayfayı yenilemeden içeriği güncelle
    updateI18nElements();
    updateLanguageSelector();
    
    console.log('Dil değiştirildi:', newLang);
}

// Aktif dil butonunu güncelle
function updateActiveLanguageButton() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.dataset.lang;
        btn.classList.toggle('active', lang === currentLanguage);
    });
}

// Dil seçim menüsünü yönet
function setupLanguageMenu() {
    let selectedLanguage = currentLanguage;
    
    // Dil butonlarını dinle - sadece seçim yap
    document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedLanguage = this.dataset.lang;
            // Sadece active class'ı güncelle
            document.querySelectorAll('.lang-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.lang === selectedLanguage);
            });
        });
    });
    
    // Güncelle butonu - dili değiştir
    const updateBtn = document.querySelector('.guncel-btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            if (selectedLanguage !== currentLanguage) {
                changeLanguage(selectedLanguage);
            }
            closeLanguageMenu();
        });
    }
    
    // Dil seçici ikonu
    const langSelector = document.querySelector('.lang-sel');
    if (langSelector) {
        console.log('Dil seçici bulundu:', langSelector);
        langSelector.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Dil menüsü açılıyor...');
            toggleLanguageMenu();
        });
    } else {
        console.error('Dil seçici (.lang-sel) bulunamadı!');
    }
    
    // Arka plan kapat
    const menuBg = document.querySelector('.lang-menu-bg');
    if (menuBg) {
        menuBg.addEventListener('click', closeLanguageMenu);
    }
    
    // Dil menüsü kapatma butonu
    document.querySelectorAll('.lang-menu .close').forEach(btn => {
        btn.addEventListener('click', closeLanguageMenu);
    });
}

function toggleLanguageMenu() {
    const menu = document.querySelector('.lang-menu-wrap');
    console.log('toggleLanguageMenu çağrıldı, menu:', menu);
    if (menu) {
        const isActive = menu.classList.contains('active3');
        console.log('Menu aktif mi:', isActive, '-> toggle yapılıyor');
        menu.classList.toggle('active3');
    }
}

function closeLanguageMenu() {
    const menu = document.querySelector('.lang-menu-wrap');
    if (menu) {
        menu.classList.remove('active3');
    }
}

// Dil seçicini güncellemek
function updateLanguageSelector() {
    // Aktif dil butonunu işaretle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.dataset.lang;
        const isActive = lang === currentLanguage;
        btn.classList.toggle('active', isActive);
        console.log(`Buton ${lang}: ${isActive ? 'aktif' : 'pasif'}`);
    });
    
    // Dil seçici metnini güncelle
    const langText = document.querySelector('.current-lang');
    if (langText) {
        const langNames = { 'tr': 'Tr', 'en': 'En', 'ru': 'Ru' };
        langText.textContent = langNames[currentLanguage] || 'Tr';
    }
}

// Ana başlatma fonksiyonu
async function initLanguageManager() {
    // Çeviriler yükle
    const loaded = await loadTranslations();
    
    if (!loaded) {
        console.warn('Çeviriler yüklenemedi, varsayılan dil kullanılıyor');
        return;
    }
    
    // i18n öğelerini güncelle
    updateI18nElements();
    
    // Dil menüsünü kur
    setupLanguageMenu();
    
    // Seçiciyi güncelle
    updateLanguageSelector();
}

// Sayfa yüklendikten sonra başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageManager);
} else {
    initLanguageManager();
}
