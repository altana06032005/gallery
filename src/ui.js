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
    }

    init() {
        // Back button
        this.backBtn.addEventListener('click', () => this.handleBack());

        // Filter button
        this.filterBtn.addEventListener('click', () => this.toggleFilters());

        // Horizontal Scroll Wheel Support
        this.catalogContent.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            this.catalogContent.scrollLeft += evt.deltaY;
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
            }
        });
    }

    renderWorks(works) {
        this.catalogContent.innerHTML = '';
        works.forEach((work, index) => {
            const card = document.createElement('div');
            card.className = 'work-card';
            card.style.opacity = '0'; // Start hidden for stagger
            card.style.transform = 'translateX(50px)';

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

        // Staggered Reveal Horizontal
        gsap.to('.work-card', {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.4,
            ease: "power2.out"
        });
    }

    toggleFilters() {
        this.filterPanel.classList.toggle('active');
    }
}
