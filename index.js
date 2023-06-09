window.onload = () => {
    const FRAME_TIME = 30;
    const OPACITY_TRANSITION = 'opacity ease-in-out 1s';
    const LONG_PAGE_TRANSITION = 'opacity ease-in-out 1s, top linear 8s';
    const PAGE_TIMER = 9000;
    const INDENT_TOP = 25;
    const TRANSITION_TIMER = 1000;
    const SCREEN_HEIGHT = 693;
    const LAST_PAGE = 5;
    const LONG_PAGES = [3];
    const content = document.getElementById('scroll');
    const contentBg = document.getElementById('scroll-bg');
    const button = document.getElementById('button');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const restartBtn = document.getElementById('restart');
    const text = document.getElementById('text');
    
    let page = 0;
    let position = INDENT_TOP;
    let pageTimeout = null;
    let transitionTimeout = null;
    let scrollTimeout = null;
    let rewindInterval = null;
    let rewindTimeout = null;

    const switchPage = (newPage, newPosition) => {
        if (pageTimeout) {
            clearTimeout(pageTimeout);
        }
        if (transitionTimeout) {
            clearTimeout(transitionTimeout);
            transitionTimeout = null;
        }
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
        
        page = newPage;
        position = newPosition;
        content.style.transition = OPACITY_TRANSITION;
        content.style.opacity = '0';
        contentBg.style.transition = OPACITY_TRANSITION;
        contentBg.style.opacity = '0';

        if (page === LAST_PAGE) {
            button.style.opacity = '0';
        }

        if (page !== 0) {
            text.style.opacity = '0';
        }
        
        transitionTimeout = setTimeout(() => {
            content.style.top = `-${position}px`;
            content.style.opacity = '1';
            contentBg.style.top = `-${position}px`;
            contentBg.style.opacity = '1';

            if (page !== LAST_PAGE) {
                button.style.opacity = '1';
            }

            if (page === 0) {
                text.style.opacity = '1';
                text.currentTime = 0;
                text.play();
            }

            if (LONG_PAGES.includes(page)) {
                scrollTimeout = setTimeout(() => {
                    content.style.transition = LONG_PAGE_TRANSITION;
                    contentBg.style.transition = LONG_PAGE_TRANSITION;
                    position += SCREEN_HEIGHT / 2;
                    content.style.top = `-${position}px`;
                    contentBg.style.top = `-${position}px`;
                }, TRANSITION_TIMER);
            }

            if (page < LAST_PAGE) {
                showPage();
            }
        }, TRANSITION_TIMER);
    }

    const rewind = (animated = true) => {
        content.style.transition = OPACITY_TRANSITION;
        contentBg.style.transition = OPACITY_TRANSITION;

        video.pause();
        if (rewindInterval) {
            clearInterval(rewindInterval);
            rewindInterval = null;
        }
        if (rewindTimeout) {
            clearTimeout(rewindTimeout);
            rewindTimeout = null;
        }
        const currPosition = video.currentTime;
        const targetPosition = video.duration / (LAST_PAGE + 1) * page;
        const step = FRAME_TIME / TRANSITION_TIMER * (targetPosition - currPosition);
        if (animated) {
            rewindInterval = setInterval(() => {
                video.currentTime += step;
            }, FRAME_TIME);
        }

        rewindTimeout = setTimeout(() => {
            if (rewindInterval) {
                clearInterval(rewindInterval);
                rewindInterval = null;
            }
            video.currentTime = targetPosition;
            video.play();
        }, TRANSITION_TIMER);
        switchPage(page, position);
    }

    const getPosition = (newPage) => {
        let newPosition = INDENT_TOP;

        for (let i = 0; i < newPage; i++) {
            if (LONG_PAGES.includes(i)) {
                newPosition += SCREEN_HEIGHT * 1.5;
            }
            else {
                newPosition += SCREEN_HEIGHT;
            }
        }

        return newPosition;
    }

    const showPage = () => {
        if (pageTimeout) {
            clearTimeout(pageTimeout);
        }
        text.play();
        pageTimeout = setTimeout(() => switchPage(page + 1, getPosition(page + 1)), PAGE_TIMER);
    }
    
    nextBtn.addEventListener('click', () => {
        if (page < LAST_PAGE) {
            page += 1;
            position = getPosition(page);
            rewind();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (page > 0) {
            page -= 1;
            position = getPosition(page);
            rewind();
        }
    });

    restartBtn.addEventListener('click', () => {
        page = 0;
        position = getPosition(page);
        rewind(false);
    });

    showPage();
};
