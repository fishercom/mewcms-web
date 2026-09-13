import { translations } from './i18n.js';

let currentLang = localStorage.getItem('mewcms_lang') || 'es';

// State for Interactive Studio
let studioState = {
  title: "Why We Migrated from WordPress to MewCMS",
  slug: "why-we-migrated-from-wordpress-to-mewcms",
  category: "Architecture & DevOps",
  tags: "Laravel, React19, Inertia, HighPerformance",
  content: `After maintaining 35 client websites on legacy WordPress installations, our engineering team hit a breaking point. Plugin updates routinely broke our custom post types, unindexed wp_postmeta queries choked our database servers during traffic spikes, and our Time-To-First-Byte (TTFB) hovered around a sluggish 850ms.

We migrated to MewCMS—and the transformation was instantaneous.

By uniting Laravel 12's rock-solid backend with Inertia.js 2 and React 19, MewCMS gives our developers end-to-end TypeScript safety and sub-35ms response times. The built-in QuickMediaDrawer eliminated our reliance on vulnerable third-party file managers, and the dynamic schema engine allows us to spin up custom content structures in seconds. It purrs like a kitten, yet strikes with enterprise resilience.`,
  mediaInserted: true,
  likesCount: 248,
  schemaFields: [
    { name: "title", type: "string (indexed)" },
    { name: "slug", type: "sluggable (unique)" },
    { name: "hero_banner", type: "media (quick_drawer)" },
    { name: "taxonomies", type: "relation (many-to-many)" },
    { name: "reading_time_mins", type: "integer" },
    { name: "is_featured", type: "boolean (default: false)" }
  ]
};

// Code Snippets
const codeSnippets = {
  mew: `// MewCMS Controller (Laravel 12 + Inertia.js 2)
namespace App\\Http\\Controllers\\Admin;

use App\\Models\\CmsArticle;
use Inertia\\Inertia;
use Illuminate\\Http\\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $articles = CmsArticle::query()
            ->with(['taxonomies', 'author', 'schema'])
            ->when($request->search, fn($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15);

        // Inertia renders React 19 SPA view seamlessly without REST/GraphQL bloat
        return Inertia::render('admin/articles/index', [
            'articles' => $articles,
            'filters' => $request->only(['search', 'category'])
        ]);
    }
}`,
  wp: `// WordPress Legacy Hook & Query Spaghetti
add_action('init', function() {
    register_post_type('cms_article', [
        'public' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'custom-fields']
    ]);
});

// Massive query overhead with unindexed wp_postmeta EAV table
function render_articles_legacy() {
    $args = [
        'post_type' => 'cms_article',
        'posts_per_page' => 15,
        'meta_query' => [
            ['key' => '_reading_time', 'compare' => 'EXISTS'] // Triggers slow table scan!
        ]
    ];
    $query = new WP_Query($args);
    // Requires brittle PHP template loop & 40+ plugins loaded into memory...
}`
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupLanguageSwitcher();
  applyLanguage(currentLang);
  setupInteractiveStudio();
  setupCodeShowcase();
  setupSmoothNavigation();
  renderSchemaPreview();
  renderLivePreview();
});

// Language Switcher Logic
function setupLanguageSwitcher() {
  const enBtn = document.getElementById('lang-en');
  const esBtn = document.getElementById('lang-es');

  if (enBtn && esBtn) {
    enBtn.addEventListener('click', () => applyLanguage('en'));
    esBtn.addEventListener('click', () => applyLanguage('es'));
  }
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('mewcms_lang', lang);

  // Update active state on toggle buttons
  const enBtn = document.getElementById('lang-en');
  const esBtn = document.getElementById('lang-es');
  if (enBtn && esBtn) {
    enBtn.classList.toggle('active', lang === 'en');
    esBtn.classList.toggle('active', lang === 'es');
  }

  const dict = translations[lang] || translations.en;

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Update title attribute on html
  document.documentElement.lang = lang;
}

// Interactive Studio Playground
function setupInteractiveStudio() {
  const tabBtns = document.querySelectorAll('.studio-tab-btn');
  const panels = document.querySelectorAll('.studio-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      if (target === 'preview') {
        renderLivePreview();
      } else if (target === 'schema') {
        renderSchemaPreview();
      }
    });
  });

  // Input Listeners in Editor
  const titleInput = document.getElementById('studio-title-input');
  const slugInput = document.getElementById('studio-slug-input');
  const categorySelect = document.getElementById('studio-cat-select');
  const tagsInput = document.getElementById('studio-tags-input');
  const contentArea = document.getElementById('studio-content-textarea');

  if (titleInput && slugInput) {
    titleInput.addEventListener('input', (e) => {
      studioState.title = e.target.value;
      studioState.slug = e.target.value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      slugInput.value = `/posts/${studioState.slug}`;
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      studioState.category = e.target.value;
    });
  }

  if (tagsInput) {
    tagsInput.addEventListener('input', (e) => {
      studioState.tags = e.target.value;
    });
  }

  if (contentArea) {
    contentArea.addEventListener('input', (e) => {
      studioState.content = e.target.value;
    });
  }

  // Formatting Toolbar Buttons
  const boldBtn = document.getElementById('tool-bold');
  const italicBtn = document.getElementById('tool-italic');
  const h2Btn = document.getElementById('tool-h2');
  const quoteBtn = document.getElementById('tool-quote');
  const mediaBtn = document.getElementById('tool-media');
  const mediaDrawer = document.getElementById('drawer-preview');

  if (boldBtn) {
    boldBtn.addEventListener('click', () => {
      insertTextAroundSelection('**', '**');
    });
  }
  if (italicBtn) {
    italicBtn.addEventListener('click', () => {
      insertTextAroundSelection('*', '*');
    });
  }
  if (h2Btn) {
    h2Btn.addEventListener('click', () => {
      insertTextAroundSelection('\n## ', '\n');
    });
  }
  if (quoteBtn) {
    quoteBtn.addEventListener('click', () => {
      insertTextAroundSelection('\n> ', '\n');
    });
  }
  if (mediaBtn && mediaDrawer) {
    mediaBtn.addEventListener('click', () => {
      mediaDrawer.classList.toggle('open');
    });
  }

  // Schema Add Field
  const addFieldBtn = document.getElementById('btn-add-schema-field');
  const newFieldName = document.getElementById('new-field-name');
  const newFieldType = document.getElementById('new-field-type');

  if (addFieldBtn && newFieldName && newFieldType) {
    addFieldBtn.addEventListener('click', () => {
      const name = newFieldName.value.trim().toLowerCase().replace(/\s+/g, '_');
      const type = newFieldType.value;
      if (name) {
        studioState.schemaFields.push({ name, type });
        newFieldName.value = '';
        renderSchemaFieldsList();
        renderSchemaPreview();
      }
    });
  }

  renderSchemaFieldsList();

  // Like/Purr Button in Preview
  const purrBtn = document.getElementById('btn-purr-like');
  if (purrBtn) {
    purrBtn.addEventListener('click', () => {
      studioState.likesCount += 1;
      const countEl = document.getElementById('preview-likes-count');
      if (countEl) {
        countEl.textContent = `${studioState.likesCount} ${currentLang === 'es' ? 'ronroneos' : 'purrs'}`;
      }
      purrBtn.style.transform = 'scale(1.15)';
      setTimeout(() => purrBtn.style.transform = 'scale(1)', 200);
    });
  }
}

function insertTextAroundSelection(prefix, suffix) {
  const textarea = document.getElementById('studio-content-textarea');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end) || 'Selected text';
  const replacement = prefix + selected + suffix;

  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  studioState.content = textarea.value;
  textarea.focus();
}

function renderSchemaFieldsList() {
  const container = document.getElementById('schema-fields-container');
  if (!container) return;

  container.innerHTML = '';
  studioState.schemaFields.forEach((field, index) => {
    const item = document.createElement('div');
    item.className = 'schema-field-item';
    item.innerHTML = `
      <div class="field-info">
        <strong>${field.name}</strong>
        <span class="field-pill-type">${field.type}</span>
      </div>
      <button class="field-delete-btn" data-index="${index}" title="Remove">✕</button>
    `;
    container.appendChild(item);
  });

  // Attach delete handlers
  container.querySelectorAll('.field-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      studioState.schemaFields.splice(idx, 1);
      renderSchemaFieldsList();
      renderSchemaPreview();
    });
  });
}

function renderSchemaPreview() {
  const codeBox = document.getElementById('schema-json-preview');
  if (!codeBox) return;

  const schemaJson = {
    schema_version: "2.4.0",
    entity: "Article",
    table: "cms_articles",
    driver: "eloquent_inertia",
    fields: studioState.schemaFields.reduce((acc, f) => {
      acc[f.name] = {
        type: f.type,
        sluggable: f.name === 'slug',
        searchable: f.name === 'title' || f.type.includes('string'),
        validation: "required"
      };
      return acc;
    }, {})
  };

  codeBox.textContent = JSON.stringify(schemaJson, null, 2);
}

function renderLivePreview() {
  const previewTitle = document.getElementById('preview-rendered-title');
  const previewCat = document.getElementById('preview-rendered-category');
  const previewTags = document.getElementById('preview-rendered-tags');
  const previewBody = document.getElementById('preview-rendered-body');
  const previewLikes = document.getElementById('preview-likes-count');

  if (previewTitle) previewTitle.textContent = studioState.title;
  if (previewCat) previewCat.textContent = studioState.category;
  if (previewLikes) {
    previewLikes.textContent = `${studioState.likesCount} ${currentLang === 'es' ? 'ronroneos' : 'purrs'}`;
  }

  if (previewTags) {
    previewTags.innerHTML = '';
    const tagList = studioState.tags.split(',').map(t => t.trim()).filter(Boolean);
    tagList.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'preview-tag-pill';
      span.textContent = `#${tag}`;
      previewTags.appendChild(span);
    });
  }

  if (previewBody) {
    // Basic Markdown formatting for paragraphs and headings
    const paragraphs = studioState.content.split('\n\n');
    let html = '';
    paragraphs.forEach(p => {
      if (p.startsWith('## ')) {
        html += `<h2 style="font-family: var(--font-display); font-size: 1.5rem; margin: 24px 0 12px; color: #fff;">${p.replace('## ', '')}</h2>`;
      } else if (p.startsWith('> ')) {
        html += `<blockquote style="border-left: 3px solid var(--color-cyan); padding-left: 16px; margin: 16px 0; color: #94a3b8; font-style: italic;">${p.replace('> ', '')}</blockquote>`;
      } else {
        html += `<p style="margin-bottom: 16px;">${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</p>`;
      }
    });
    previewBody.innerHTML = html;
  }
}

// Code Showcase Tab Switching
function setupCodeShowcase() {
  const codeBtns = document.querySelectorAll('.code-tab-btn');
  const codeEl = document.getElementById('showcase-code');
  const filenameEl = document.getElementById('showcase-filename');

  codeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-code');
      codeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (codeEl && codeSnippets[mode]) {
        codeEl.textContent = codeSnippets[mode];
        if (filenameEl) {
          filenameEl.textContent = mode === 'mew'
            ? 'app/Http/Controllers/Admin/ArticleController.php'
            : 'wp-content/themes/legacy-theme/functions.php';
        }
      }
    });
  });
}

// Snappy hardware-accelerated smooth navigation for in-page anchors
function setupSmoothNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = 76;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, targetId);
        }
      }
    });
  });
}
