document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.draggable-container').forEach(container => {
        const content = container.querySelector('.draggable-content');
        if (!content) return;

        let scale = 1;
        let isDragging = false;
        let isSpacePressed = false;
        let isHovering = false;
        let startX, startY, scrollLeft, scrollTop;

        const MIN_SCALE = 0.1;
        const MAX_SCALE = 5;
        const ZOOM_SPEED = 0.001;

        // 更新缩放
        function updateScale(newScale, centerX, centerY) {
            const oldScale = scale;
            scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

            const rect = container.getBoundingClientRect();
            const mouseX = centerX - rect.left;
            const mouseY = centerY - rect.top;

            const contentX = (container.scrollLeft + mouseX) / oldScale;
            const contentY = (container.scrollTop + mouseY) / oldScale;

            content.style.transform = `scale(${scale})`;
            content.style.transformOrigin = '0 0';

            const newScrollLeft = contentX * scale - mouseX;
            const newScrollTop = contentY * scale - mouseY;

            container.scrollLeft = newScrollLeft;
            container.scrollTop = newScrollTop;

            updateCursor();
        }

        // 更新鼠标样式
        function updateCursor() {
            if (isDragging) {
                container.style.cursor = 'grabbing';
            } else if (isSpacePressed && isHovering) {
                container.style.cursor = 'grab';
            } else {
                container.style.cursor = 'default';
            }
        }

        // 滚轮缩放
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = -e.deltaY * ZOOM_SPEED;
            const newScale = scale * (1 + delta);
            updateScale(newScale, e.clientX, e.clientY);
        }, { passive: false });

        // 跟踪鼠标是否在容器内
        container.addEventListener('mouseenter', () => {
            isHovering = true;
            updateCursor();
        });

        container.addEventListener('mouseleave', () => {
            isHovering = false;
            isDragging = false;
            updateCursor();
        });

        // 空格键按下 - 在容器上监听
        container.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                e.stopPropagation();
                if (!isSpacePressed) {
                    isSpacePressed = true;
                    updateCursor();
                }
            }
        });

        container.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                e.stopPropagation();
                isSpacePressed = false;
                isDragging = false;
                updateCursor();
            }
        });

        // 全局空格键监听 - 当鼠标在容器内时阻止默认行为
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && isHovering) {
                e.preventDefault();
                if (!isSpacePressed) {
                    isSpacePressed = true;
                    updateCursor();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                isSpacePressed = false;
                isDragging = false;
                updateCursor();
            }
        });

        // 鼠标移动
        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const x = e.pageX - container.offsetLeft;
            const y = e.pageY - container.offsetTop;
            container.scrollLeft = scrollLeft - (x - startX);
            container.scrollTop = scrollTop - (y - startY);
        });

        // 鼠标按下
        container.addEventListener('mousedown', (e) => {
            if (isSpacePressed || e.button === 1) {
                e.preventDefault();
                isDragging = true;
                startX = e.pageX - container.offsetLeft;
                startY = e.pageY - container.offsetTop;
                scrollLeft = container.scrollLeft;
                scrollTop = container.scrollTop;
                updateCursor();
            }
        });

        // 鼠标释放
        container.addEventListener('mouseup', () => {
            isDragging = false;
            updateCursor();
        });

        // 阻止中键默认行为
        container.addEventListener('auxclick', (e) => {
            if (e.button === 1) {
                e.preventDefault();
            }
        });

        // 双击重置缩放
        container.addEventListener('dblclick', (e) => {
            e.preventDefault();
            updateScale(1, e.clientX, e.clientY);
        });

        // 让容器可以获取焦点以接收键盘事件
        container.setAttribute('tabindex', '0');
        container.style.outline = 'none';

        // 初始化
        content.style.transform = `scale(${scale})`;
        content.style.transformOrigin = '0 0';
        updateCursor();
    });
});