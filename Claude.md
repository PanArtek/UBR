# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this Astro portfolio website for a construction company.

## Project Overview

This repository contains an Astro-based portfolio website for a construction company featuring:
- Modern, professional design optimized for construction industry
- Photo gallery of completed projects with categories (residential, commercial, renovations)
- Mobile-first responsive design
- Easy photo management system for future mobile uploads
- Contact forms and business information
- Fast loading and SEO-optimized

## Tech Stack

- **Framework**: Astro 4.x (static site generation)
- **Styling**: Tailwind CSS + custom CSS for construction-specific design
- **Images**: Astro Image optimization with WebP/AVIF support
- **Deployment**: GitHub Pages (static hosting)
- **Future mobile uploads**: Prepared for integration with simple CMS or file upload service

## Development Environment

### WSL Ubuntu Setup
Since this is running on WSL Ubuntu, use these commands:

```bash
# Node.js and npm management
node --version                       # Check Node version (should be 18+)
npm --version                       # Check npm version

# Astro development
npm run dev                         # Start dev server (usually http://localhost:4321)
npm run build                       # Build for production
npm run preview                     # Preview production build locally

# Git workflow for deployment
git add .
git commit -m "Update: [description]"
git push origin main                # Auto-deploys to GitHub Pages
```

### Directory Structure for Construction Portfolio
```
src/
  ├── components/
  │   ├── Gallery.astro           # Photo gallery with residential categories
  │   ├── ProjectCard.astro       # Individual project showcase
  │   ├── ContactForm.astro       # Contact/quote request form
  │   ├── Navigation.astro        # Main navigation
  │   └── AdminPanel.astro        # Mobile admin interface
  ├── layouts/
  │   └── Layout.astro           # Base layout with meta tags
  ├── pages/
  │   ├── index.astro            # Homepage with hero + featured projects
  │   ├── galeria.astro          # Full gallery page with filtering
  │   ├── o-nas.astro            # About company page
  │   ├── kontakt.astro          # Contact page
  │   └── admin/
  │       ├── index.astro        # Admin login (mobile-optimized)
  │       ├── upload.astro       # Photo upload interface
  │       └── manage.astro       # Gallery management
  └── styles/
      └── global.css             # Custom styles + mobile admin CSS
public/
  ├── images/
  │   ├── projects/              # Project photos organized by residential categories
  │   │   ├── domy-jednorodzinne/      # Single family houses
  │   │   ├── mieszkania/              # Apartments and condos  
  │   │   ├── remonty-kapitalne/       # Major renovations
  │   │   ├── wykonczennia/            # Interior finishing
  │   │   ├── dachy-elewacje/          # Roofs and facades
  │   │   └── lazienki-kuchnie/        # Bathrooms and kitchens
  │   ├── team/                  # Company team photos
  │   └── equipment/             # Tools and machinery photos
  └── favicon.ico
```

## Content Guidelines

### Image Management for Construction Projects

**File Naming Convention for Residential Projects:**
```
projects/[category]/[year]-[month]-[project-description]-[number].jpg
Examples:
- projects/domy-jednorodzinne/2024-03-dom-120m2-puszcza-marianska-01.jpg
- projects/mieszkania/2024-01-mieszkanie-3pokoje-remont-calosciowy-01.jpg
- projects/lazienki-kuchnie/2024-02-lazienka-prysznic-terakota-before.jpg
- projects/lazienki-kuchnie/2024-02-lazienka-prysznic-terakota-after.jpg
- projects/wykonczennia/2024-04-salon-panele-gipskarton-malowanie-01.jpg
```

**Image Requirements:**
- **Format**: JPG for photos, WebP for web optimization
- **Size**: Max 2MB per image (Astro will optimize automatically)
- **Dimensions**: Minimum 1200px width for gallery display
- **Alt text**: Always include descriptive alt text for accessibility

**Categories for Residential Projects:**
- `domy-jednorodzinne` - Single family houses
- `mieszkania` - Apartments and condos
- `remonty-kapitalne` - Major renovations
- `wykonczennia` - Interior finishing work
- `dachy-elewacje` - Roofs and facades
- `lazienki-kuchnie` - Bathrooms and kitchens

### Mobile Photo Upload Preparation

The site structure is prepared for future mobile upload integration:

**Current Implementation:**
- Static images in `/public/images/projects/`
- Manual file management via Git

### Custom Admin Panel for Mobile Management (Android Priority)

The website will include a mobile-optimized admin panel accessible from Android devices:

**Architecture:**
- **Frontend**: Progressive Web App (PWA) using Astro + Vanilla JS
- **Backend**: Simple Node.js API with file upload handling
- **Storage**: Local file system + Git auto-commit for deployment
- **Authentication**: Simple PIN/password protection
- **Mobile-first**: Touch-friendly interface optimized for phones

**Features for Mobile Upload:**
1. **Photo Upload Interface**:
   - Drag & drop or camera capture
   - Automatic image compression
   - Category selection dropdown
   - Project description input
   - Before/after toggle for renovations

2. **Project Management**:
   - Quick project creation with templates
   - Bulk photo uploads for single project
   - Image editing: crop, rotate, brightness
   - Gallery preview before publishing

3. **Offline Capability**:
   - PWA works offline
   - Queue uploads when connection restored
   - Local image storage until sync

**Implementation Plan:**
```
/admin/
  ├── index.astro                  # Admin login page
  ├── upload.astro                 # Photo upload interface
  ├── gallery-manager.astro        # Manage existing photos
  └── project-creator.astro        # Create new project entries

/api/
  ├── upload.js                    # Handle file uploads
  ├── auth.js                      # Simple authentication
  └── gallery.js                   # Gallery management endpoints
```

**Security Considerations:**
- IP whitelist for admin access
- Simple PIN authentication (sufficient for small business)
- Rate limiting on uploads
- File type validation (only images)
- Automatic backup before any changes

## Design Guidelines

### Construction Industry Design Principles

- **Colors**: Professional palette - blues, grays, oranges (safety colors)
- **Typography**: Clean, readable fonts (Inter, Source Sans Pro)
- **Layout**: Grid-based, showcasing work prominently
- **Call-to-actions**: Clear contact buttons and quote requests
- **Trust signals**: Certifications, years of experience, testimonials

### Component Patterns

**Gallery Component:**
```astro
---
// Gallery.astro - Displays project images with filtering
const { category = "all", limit = 12 } = Astro.props;
---
```

**Project Card:**
```astro
---
// ProjectCard.astro - Individual project showcase
const { title, category, image, description, date } = Astro.props;
---
```

**Contact Form:**
```astro
---
// ContactForm.astro - Quote request form
// Include fields: name, email, phone, project_type, description, budget_range
---
```

## Development Workflow

### Standard Development Process

1. **Feature Development:**
   ```bash
   # Start with planning
   # Add new component or page
   # Test locally with npm run dev
   # Optimize images and performance
   # Test responsive design on mobile
   ```

2. **Content Updates:**
   ```bash
   # Add new project photos to correct category folder
   # Update gallery data/config if needed
   # Test image loading and optimization
   # Commit and push for deployment
   ```

3. **Deployment Process:**
   ```bash
   npm run build                    # Build static site
   # Check build output for errors
   git add .
   git commit -m "Add: [new projects/features]"
   git push origin main            # Auto-deploy to GitHub Pages
   ```

## Code Modification Principles (Adapted for Construction Portfolio)

### Content-First Development
* **Prioritize visual impact** - Construction work is visual, make photos prominent
* **Mobile-first approach** - Many clients browse on phones at job sites
* **Fast loading essential** - Optimize all images, use lazy loading
* **Professional credibility** - Every element should reinforce company expertise

### Image and Media Handling
* **Optimize automatically** - Use Astro's image optimization for all photos
* **Responsive images** - Serve appropriate sizes for different screens
* **Lazy loading** - Load images as user scrolls through gallery
* **Alt text mandatory** - Accessibility and SEO require descriptive alt text

### Performance Guidelines
* **Target metrics**: Lighthouse score 90+ for all categories
* **Image sizes**: Automatically generate multiple sizes for responsive display
* **Caching strategy**: Leverage browser caching for repeat visitors
* **CDN ready**: Structure prepared for future CDN integration

### SEO and Business Focus
* **Local SEO**: Include location-based keywords and business information
* **Schema markup**: Add structured data for construction business
* **Meta descriptions**: Craft compelling descriptions for each page
* **Contact optimization**: Make it easy to request quotes and contact company

## Testing and Quality Assurance

### Pre-deployment Checklist
- [ ] All images load and display correctly
- [ ] Contact forms work (test with form service)
- [ ] Mobile responsive design tested on actual devices
- [ ] Gallery filtering works correctly
- [ ] Page load speed under 3 seconds
- [ ] All links and navigation functional
- [ ] Business information (phone, address, email) accurate

### Cross-browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (mobile iOS)
- [ ] Chrome mobile (Android)

### Content Verification
- [ ] All project photos have proper categories
- [ ] Alt text present for all images
- [ ] Company information up-to-date
- [ ] Contact information correct
- [ ] Services accurately described

## Future Enhancements Roadmap

### Phase 1 (Current): Static Portfolio
- [x] Basic Astro setup with GitHub Pages
- [x] Photo gallery with categories
- [x] Contact forms and business info
- [x] Mobile responsive design

### Phase 2: Enhanced Features
- [ ] Before/after project comparisons
- [ ] Customer testimonials section
- [ ] Equipment and team showcases
- [ ] Blog for construction tips and updates

### Phase 3: Mobile Admin Panel (Priority)
- [ ] PWA admin panel for Android devices
- [ ] Touch-optimized photo upload interface
- [ ] Camera integration for direct photo capture
- [ ] Offline capability with sync when online
- [ ] Simple PIN authentication system
- [ ] Bulk upload with project categorization
- [ ] Before/after photo pairing for renovations

### Phase 4: Advanced Features
- [ ] Project timeline/progress tracking
- [ ] Quote calculator for common projects
- [ ] Client portal for project updates
- [ ] Integration with business management tools

## Common Commands for Construction Portfolio Development

```bash
# Development
npm run dev                         # Start development server
npm run build                       # Build for production
npm run preview                     # Preview production build

# Image optimization
# (Astro handles this automatically, but for manual optimization:)
npx @astrojs/image-tools optimize ./public/images/

# Gallery management
# Add new project photos:
# 1. Copy images to appropriate /public/images/projects/[category]/ folder
# 2. Run development server to test
# 3. Commit and push for deployment

# Content updates
# Update company info in src/components/Contact.astro
# Add new services in src/pages/index.astro
# Modify gallery categories in src/components/Gallery.astro
```

## WSL Ubuntu Specific Notes

- Use Windows file explorer to easily drag photos to `/public/images/` folders
- Node.js and Git should work identically to native Linux
- Consider using VS Code with Remote-WSL extension for seamless development
- File permissions usually not an issue for this static site setup
## Documentation and Context Management

### Automatic Documentation Requirements

**IMPORTANT: Claude Code MUST maintain a development log in `doc.md` file for context continuity.**

### Documentation Rules

1. **Always update `doc.md`** after every significant change or feature addition
2. **Include timestamp** and brief description of what was done
3. **Document decisions** made during development (why certain approaches were chosen)
4. **Track file changes** - which files were created, modified, or deleted
5. **Note dependencies** added or removed
6. **Record configuration changes** (astro.config.mjs, package.json, etc.)

### doc.md Structure

```markdown
# UBR Portfolio Development Log

## 2024-06-28

### Initial Setup
- **Time**: 10:30
- **Action**: Project initialization with Astro
- **Files Created**: 
  - astro.config.mjs
  - package.json
  - src/layouts/Layout.astro
  - src/pages/index.astro
- **Dependencies**: astro, @astrojs/tailwind, tailwindcss
- **Notes**: Configured for GitHub Pages deployment with base path
