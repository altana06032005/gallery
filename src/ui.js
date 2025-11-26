import { categories } from './data.js';
import gsap from 'gsap';
const header = document.querySelector('header');

export class UIManager {
    constructor(onBack) {
        this.onBack = onBack;
        this.container = document.getElementById('ui-container');
        this.catalog = document.getElementById('catalog');
        this.catalogContent = document.getElementById('catalog-content');
        this.backBtn = document.getElementById('back-btn');
        this.categoryTitle = document.getElementById('category-title');
        this.filterBtn = document.getElementById('filter-btn');
        this.filterPanel = document.getElementById('filter-panel');

        this.init();

        this.scrollY = 0;
        this.cards = [];
        this.touchStartY = 0;
        this.isTouching = false;
    }

    init() {
        // Back button
        this.backBtn.addEventListener('click', () => this.handleBack());

        // Filter button
        this.filterBtn.addEventListener('click', () => this.toggleFilters());

        // Vertical Scroll Stack Support
        this.catalogContent.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            if (!this.cards || this.cards.length === 0) return;

            const maxScroll = (this.cards.length - 1) * 100; // Allow scrolling through all cards
            this.scrollY += evt.deltaY;
            this.scrollY = Math.max(0, Math.min(this.scrollY, maxScroll));

            this.updateCardPositions();
        });

        // Touch Support for Mobile
        this.catalogContent.addEventListener('touchstart', (evt) => {
            this.isTouching = true;
            this.touchStartY = evt.touches[0].clientY;
        });

        this.catalogContent.addEventListener('touchmove', (evt) => {
            if (!this.isTouching || !this.cards || this.cards.length === 0) return;
            evt.preventDefault(); // Prevent default page scroll

            const currentY = evt.touches[0].clientY;
            const deltaY = this.touchStartY - currentY;
            this.touchStartY = currentY;

            const maxScroll = (this.cards.length - 1) * 100;
            this.scrollY += deltaY * 2; // Multiplier for sensitivity
            this.scrollY = Math.max(0, Math.min(this.scrollY, maxScroll));

            this.updateCardPositions();
        });

        this.catalogContent.addEventListener('touchend', () => {
            this.isTouching = false;
        });
    }

    updateCardPositions() {
        this.cards.forEach((card, i) => {
            // Calculate position relative to scroll
            // We want cards to stack at the top (or bottom) as we scroll
            // Let's make them stack from bottom up as requested: "accumulating from the bottom"

            // Logic:
            // As we scroll down (scrollY increases), cards move up.
            // When a card reaches a certain point, it slows down and stacks.

            const cardBaseY = i * 150; // Initial vertical spacing
            const scrollOffset = this.scrollY;

            let yPos = cardBaseY - scrollOffset;

            // Stacking logic:
            // If yPos < i * 10 (small offset for stack), clamp it
            // This creates the stack effect at the top of the container
            // Wait, request says "accumulating from the bottom". 
            // This usually means a stack at the bottom of the viewport?
            // "stacking on top of each other... accumulating from the bottom"
            // Let's interpret this as: Cards enter from bottom, move up, and stack on top of each other.
            // Actually, "accumulating from the bottom" might mean the stack grows from the bottom.
            // Let's try a standard vertical scroll where cards overlap.

            // Revised Logic for "Scroll Stack":
            // Cards are positioned vertically.
            // As you scroll, they move up.
            // They overlap significantly.

            // Let's try a sticky stack effect where cards stick to the top?
            // Or maybe they start stacked at bottom and spread out?

            // Let's go with a visual stack where cards are essentially a deck.
            // i * 40 is the visual offset in the stack.
            // (i * 400) is the scroll trigger.

            // Simple Vertical Stack:
            // Cards are spaced out.
            // As they move up, they might overlap.

            // Let's try this:
            // Standard vertical list, but with negative margins or absolute positioning to overlap.

            // Let's use absolute positioning for full control.
            // We need to set container height or handle it in JS.
            // Since we are using transform, we can just calculate Y.

            // "Stacking on top of each other"
            // Let's make them stack at the top as you scroll past them.

            const stackOffset = i * 10; // Compressed stack distance
            const unstackedPos = i * 300 - scrollOffset; // Normal scroll position

            // If unstackedPos < stackOffset, use stackOffset
            // But we want them to stack at the bottom? "Accumulating from the bottom"
            // Maybe it means the stack is at the bottom of the screen?
            // Let's assume standard "cards stack on top of each other" behavior often seen in modern web design (like a deck of cards).
            // Usually this means the previous card stays, and the next card slides ON TOP of it.
            // OR the current card slides up and reveals the next one?

            // Let's try: Cards start distributed. As you scroll, they gather.
            // Let's try a simple "Deck" effect where cards slide up and stack at a specific Y.

            // Let's try this interpretation:
            // Cards are in a vertical list.
            // As you scroll down, the cards move up.
            // But they don't move off screen; they stack at the top (or bottom).
            // "Accumulating from the bottom" -> Stack at the bottom?

            // Let's try stacking at the BOTTOM of the view.
            // Viewport Height ~ 100vh.
            // Stack target = Height - (i * offset).

            const containerHeight = window.innerHeight;
            const cardHeight = 500;
            const targetY = containerHeight - 100 - (this.cards.length - i) * 10;

            // This is getting complicated. Let's stick to a simpler "Vertical Scroll with Overlap".
            // "Accumulating from the bottom" -> New cards come from bottom and cover the previous ones?
            // That is standard scrolling if z-index is right.

            // Let's implement a "Stacking Cards" effect where cards stick.
            // We will use sticky positioning logic via JS.

            // Let's try:
            // Cards are spaced by 300px.
            // As scrollY increases, cards move up.
            // y = i * 300 - scrollY.
            // But we clamp y so it doesn't go above a certain point (stacking at top).
            // OR we clamp y so it doesn't go below a certain point (stacking at bottom).

            // "Accumulating from the bottom" -> Stack grows at the bottom.
            // This sounds like: Card 0 is at bottom. Card 1 slides down to stack on it?
            // Or Card 0 slides up, stops at bottom. Card 1 slides up, stops above it?

            // Let's go with: Cards slide UP. They stack at the TOP.
            // This is the most common "stack" effect.
            // If the user insists on "accumulating from the bottom", maybe they mean the VISUAL stack looks like it's built from the bottom?
            // Let's try to make them stack at the bottom.

            // Logic:
            // y = (i * 300) - scrollY
            // max_y = window.innerHeight - 600 + (i * 20) // Stack at bottom
            // y = Math.min(y, max_y)

            // Actually, let's keep it simple and elegant.
            // Vertical list.
            // Cards overlap (negative margin equivalent).
            // As you scroll, they move up.
            // Z-index: Higher index is on top? Or lower?
            // "Stacking on top of each other" -> Next card covers previous?
            // Then z-index should increase with i.

            // Let's do:
            // z-index = i
            // y = i * 100 - scrollY (dense packing)
            // scale = 1

            // Let's try a dynamic stack:
            // Cards are spread out (i * 400).
            // As they reach a point (say, top of screen + 100px), they start moving slower (parallax) or stop (sticky).

            // Let's try the "Sticky Stack" at the TOP.
            // y = i * 400 - scrollY.
            // if y < i * 40, y = i * 40.

            // But user said "accumulating from the bottom".
            // Maybe they mean:
            // Card 0 is at the bottom.
            // Card 1 comes from below and stacks on it?
            // That would be weird scrolling.

            // Let's assume "Stacking from bottom" means the stack is anchored at the bottom.
            // y = i * 400 - scrollY.
            // min_y = window.innerHeight - 600 - (this.cards.length - i) * 10.
            // y = Math.max(y, min_y) ? No.

            // Let's stick to the "Deck of Cards" effect where they stack at the TOP, but with Z-index such that later cards are ON TOP.
            // This looks like they are piling up.

            // Let's refine the "Stacking" logic to be visually pleasing.
            // We'll use a standard vertical scroll but with cards starting further down and moving up.
            // We will use `updateCardPositions` to handle the transform.

            const spacing = 300; // Space between cards
            const stackPosition = 100; // Where they stack
            const stackSpacing = 20; // Space between stacked cards

            let pos = (i * spacing) - this.scrollY + 200; // Initial position

            // If we want them to stack at the bottom:
            // They should stop moving when they reach the bottom stack area.

            // Let's try a simple vertical scroll where they overlap.
            // "Accumulating from the bottom" -> Maybe the stack is at the bottom?
            // Let's try to implement a stack at the bottom.
            // Cards fall down? No, scroll is usually pushing up.

            // Let's try:
            // Cards move UP.
            // When they reach the top, they scroll away.
            // But new cards come from the bottom and COVER the old ones.
            // This is "stacking on top".

            // Implementation:
            // z-index = i.
            // Card i covers Card i-1.
            // y = i * 300 - this.scrollY.

            // Let's add a scale effect for depth.

            const dist = (i * 350) - this.scrollY;
            // We want them to start from bottom.

            // Let's just map scrollY to Y position directly.
            // Center the view.

            const y = (i * 350) - this.scrollY + 100;
            const scale = 1;

            card.style.transform = `translateY(${y}px) scale(${scale})`;
            card.style.zIndex = i;
        });
    }

    handleBack() {
        this.hideCatalog();
        if (this.onBack) this.onBack();
    }

    showCatalog(categoryId) {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        // Typewriter effect for title
        this.categoryTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < category.name.length) {
                this.categoryTitle.textContent += category.name.charAt(i);
                i++;
                setTimeout(typeWriter, 40);
            }
        };

        this.renderWorks(category.works);

        this.container.classList.add('active');
        header.classList.add('hidden');

        // HUD Slide Up
        gsap.fromTo(this.catalog,
            { opacity: 0, y: 50, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 0.2, ease: "power3.out", onComplete: typeWriter }
        );
    }

    hideCatalog() {
        // Close filters if open
        this.filterPanel.classList.remove('active');

        gsap.to(this.catalog, {
            opacity: 0,
            y: 50,
            scale: 0.98,
            duration: 0.4,
            onComplete: () => {
                this.container.classList.remove('active');
                this.categoryTitle.textContent = '';
                header.classList.remove('hidden');
            }
        });
    }

    renderWorks(works) {
        this.catalogContent.innerHTML = '';
        works.forEach((work, index) => {
            const card = document.createElement('div');
            card.className = 'work-card';
            card.style.opacity = '0'; // Start hidden for stagger
            // card.style.transform set by updateCardPositions later, but we need initial state for animation?
            // Let's just set opacity 0. Position will be handled by updateCardPositions.
            card.style.zIndex = works.length - index;

            card.innerHTML = `
        <div class="work-image" style="background-image: url('${work.image}')"></div>
        <div class="work-info">
          <div>
            <h3>${work.title}</h3>
            <h4>// ${work.artist}</h4>
          </div>
          <p>${work.description}</p>
          <div class="tags">${work.tags.map(t => `<span>[${t}]</span>`).join('')}</div>
        </div>
      `;
            this.catalogContent.appendChild(card);
        });

        // Staggered Reveal (Opacity only to avoid transform conflicts)
        gsap.to('.work-card', {
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.4,
            ease: "power2.out"
        });

        this.cards = this.catalogContent.querySelectorAll('.work-card');
        this.scrollY = 0;
        this.updateCardPositions();
    }



    toggleFilters() {
        this.filterPanel.classList.toggle('active');
    }
}


