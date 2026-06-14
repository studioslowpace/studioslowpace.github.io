// ==========================================
// 載入頁首並處理年份（維持原樣）
// ==========================================  
fetch('/header.html')
    .then(response => response.text())
    .then(data => {
        const container = document.getElementById('header-container');
        if (container) {
            container.innerHTML = data;
            setupHeaderMenu(); // 🛠️ 載入完成後，啟動選單核心與自動收納功能
        }
    })
    .catch(err => console.error("頁首載入失敗:", err));

    // ==========================================================================
    // 【7. Header 智慧導覽選單演算法】
    // ==========================================================================
    function setupHeaderMenu() {
        const toggleButton = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.header-nav-links');

        if (toggleButton && navLinks) {
            toggleButton.onclick = function(e) {
                navLinks.classList.toggle('active');
                e.stopPropagation();
            };

            document.onclick = function(e) {
                if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== toggleButton) {
                    navLinks.classList.remove('active');
                }
            };
        }

        const mainNav = document.querySelector('.header-nav-links'); 
        if (!mainNav) return;

        let moreMenu = document.getElementById('more-menu');
        let overflowLinks = document.getElementById('overflow-links');
        
        if (!moreMenu) {
            moreMenu = document.createElement('div');
            moreMenu.id = 'more-menu';
            moreMenu.className = 'more-dropdown';
            moreMenu.innerHTML = `
                <a href="#" class="more-toggle" onclick="return false;">更多 ▾</a>
                <div class="more-dropdown-content" id="overflow-links"></div>
            `;
            mainNav.appendChild(moreMenu);
            overflowLinks = document.getElementById('overflow-links');
        }

        const allLinks = Array.from(mainNav.children).filter(el => el !== moreMenu && el.tagName === 'A');
        const searchBtn = mainNav.querySelector('.search-icon-btn');

        function adjustNavItems() {
            if (window.innerWidth <= 768) {
                allLinks.forEach(item => mainNav.insertBefore(item, moreMenu));
                if (searchBtn) mainNav.appendChild(searchBtn);
                moreMenu.style.display = 'none';
                return;
            }

            moreMenu.style.display = 'none'; 
            overflowLinks.innerHTML = '';    
            allLinks.forEach(item => mainNav.insertBefore(item, moreMenu));
            if (searchBtn) mainNav.appendChild(searchBtn);

            let navContainerWidth = mainNav.offsetWidth;
            let totalWidth = 0;
            let isOverflow = false;
            
            const moreBtnWidth = 90; 
            const searchBtnWidth = searchBtn ? (searchBtn.offsetWidth || 50) : 50;

            for (let i = 0; i < allLinks.length; i++) {
                const item = allLinks[i];
                if (isOverflow) {
                    overflowLinks.appendChild(item);
                    continue;
                }

                const itemStyle = window.getComputedStyle(item);
                const marginLeft = parseFloat(itemStyle.marginLeft) || 0;
                const marginRight = parseFloat(itemStyle.marginRight) || 0;
                totalWidth += item.offsetWidth + marginLeft + marginRight;

                if (totalWidth + moreBtnWidth + searchBtnWidth > navContainerWidth) {
                    isOverflow = true;
                    moreMenu.style.display = 'inline-block';
                    overflowLinks.appendChild(item);
                }
            }
        }

        adjustNavItems();
        window.removeEventListener('resize', adjustNavItems);
        window.addEventListener('resize', adjustNavItems);
    }

// ==========================================
// 載入頁尾並處理年份（維持原樣）
// ==========================================
    fetch('/footer.html')
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById('global-footer');
        if (footerContainer) {
            footerContainer.innerHTML = data;
            
            // 頁尾載入完成後，更新年份
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
        }
    })
    .catch(err => console.error("頁尾載入失敗:", err));