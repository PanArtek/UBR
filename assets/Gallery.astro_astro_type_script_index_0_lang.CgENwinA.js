class c{constructor(){this.projects=[],this.currentProjectId=null,this.currentImageIndex=0,this.init()}async init(){await this.loadProjects(),this.renderProjects(),this.bindEvents()}async loadProjects(){let e=[];try{const t=await fetch("/api/projects.php");if(t.ok){const n=await t.json();n.success&&(e=n.projects,console.log("Loaded projects from PHP API:",e.length))}}catch(t){console.warn("PHP API not available, falling back to JSON:",t)}let o=[];if(e.length===0)try{o=(await(await fetch("/UBR/data/projects.json")).json()).projects.filter(s=>s.isVisible)}catch(t){console.warn("Could not load projects data:",t)}const i=this.getLocalStorageProjects();this.projects=[...e,...o,...i].filter(t=>t.isVisible).sort((t,n)=>(n.order||0)-(t.order||0)),this.updateCounters()}getLocalStorageProjects(){try{const e=localStorage.getItem("ubr_projects");return e?JSON.parse(e):[]}catch(e){return console.error("Error reading localStorage projects:",e),[]}}updateCounters(){const e=document.getElementById("totalCount");e&&(e.textContent=this.projects.length),["lazienki-kuchnie","mieszkania","wykonczennia","domy-jednorodzinne","remonty-kapitalne","dachy-elewacje"].forEach(i=>{const t=document.getElementById(`count-${i}`);if(t){const n=this.projects.filter(s=>s.category===i).length;t.textContent=n}})}bindEvents(){document.querySelectorAll(".filter-btn").forEach(n=>{n.addEventListener("click",s=>{document.querySelectorAll(".filter-btn").forEach(r=>r.classList.remove("active")),s.target.classList.add("active"),this.filterProjects(s.target.dataset.category)})});const e=document.getElementById("lightboxClose"),o=document.getElementById("lightboxPrev"),i=document.getElementById("lightboxNext"),t=document.getElementById("lightbox");e&&e.addEventListener("click",()=>this.closeLightbox()),o&&o.addEventListener("click",()=>this.prevImage()),i&&i.addEventListener("click",()=>this.nextImage()),document.addEventListener("keydown",n=>{if(t&&t.classList.contains("flex"))switch(n.key){case"Escape":this.closeLightbox();break;case"ArrowLeft":this.prevImage();break;case"ArrowRight":this.nextImage();break}}),t&&t.addEventListener("click",n=>{n.target.id==="lightbox"&&this.closeLightbox()})}filterProjects(e){const o=e==="all"?this.projects:this.projects.filter(i=>i.category===e);this.renderProjects(o)}renderProjects(e=this.projects){const o=document.querySelector(".projects-grid"),i=document.getElementById("emptyMessage");if(e.length===0){o.innerHTML="",i.classList.remove("hidden");return}i.classList.add("hidden"),o.innerHTML=e.map((t,n)=>`
        <div class="project-card card animate-fadeIn group" 
             style="animation-delay: ${n*.1}s;"
             data-category="${t.category}"
             onclick="openLightbox('${t.id}')">
          
          <!-- Zdjęcie główne lub placeholder -->
          <div class="project-image relative overflow-hidden rounded-t-lg">
            ${t.images?.length>0?`
              <img src="${t.images.find(s=>s.isMain)?.url||t.images[0].url}" 
                   alt="${t.title}"
                   class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                   loading="lazy" 
                   onerror="this.src='/UBR/images/placeholder.svg'" />
            `:`
              <svg width="400" height="256" xmlns="http://www.w3.org/2000/svg" class="rounded-t-lg">
                <defs>
                  <linearGradient id="grad-${t.category}-${n}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#31EC56" />
                    <stop offset="50%" style="stop-color:#EF036C" />
                    <stop offset="100%" style="stop-color:#EE72F8" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad-${t.category}-${n})" />
                <text x="50%" y="40%" text-anchor="middle" fill="white" 
                      font-family="system-ui" font-size="18" font-weight="700">
                  ${this.getCategoryName(t.category)}
                </text>
                <text x="50%" y="60%" text-anchor="middle" fill="rgba(255,255,255,0.8)" 
                      font-family="system-ui" font-size="14">
                  UBR WYKOŃCZENIA WNĘTRZ
                </text>
              </svg>
            `}
            
            ${t.images?.length>1?`
              <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                📷 ${t.images.length}
              </div>
            `:""}
            
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- Informacje o projekcie -->
          <div class="project-info p-6">
            <h3 class="font-bold text-xl mb-2 group-hover:text-[#31EC56] transition-colors duration-300">${t.title}</h3>
            <p class="text-gray-600 text-sm mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#EF036C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ${t.location} • ${t.area||"N/A"}
            </p>
            <p class="text-gray-700 text-sm line-clamp-2 mb-4">${t.description}</p>
            
            ${t.features?.length?`
              <div class="features flex flex-wrap gap-2">
                ${t.features.slice(0,3).map(s=>`<span class="bg-[#31EC56]/10 text-[#31EC56] text-xs font-medium px-3 py-1 rounded-full">${s}</span>`).join("")}
                ${t.features.length>3?`<span class="text-gray-500 text-xs font-medium">+${t.features.length-3}</span>`:""}
              </div>
            `:""}
          </div>
        </div>
      `).join("")}getCategoryName(e){return{"domy-jednorodzinne":"Dom Jednorodzinny",mieszkania:"Mieszkanie","remonty-kapitalne":"Remont Kapitalny",wykonczennia:"Wykończenia","dachy-elewacje":"Dachy & Elewacje","lazienki-kuchnie":"Łazienki & Kuchnie"}[e]||e}openLightbox(e){const o=this.projects.find(t=>t.id===e);if(!o||!o.images?.length)return;this.currentProjectId=e,this.currentImageIndex=0,this.updateLightboxImage();const i=document.getElementById("lightbox");i&&(i.classList.replace("hidden","flex"),document.body.style.overflow="hidden")}closeLightbox(){const e=document.getElementById("lightbox");e&&(e.classList.replace("flex","hidden"),document.body.style.overflow="")}prevImage(){const e=this.projects.find(o=>o.id===this.currentProjectId);e?.images?.length&&(this.currentImageIndex=this.currentImageIndex>0?this.currentImageIndex-1:e.images.length-1,this.updateLightboxImage())}nextImage(){const e=this.projects.find(o=>o.id===this.currentProjectId);e?.images?.length&&(this.currentImageIndex=this.currentImageIndex<e.images.length-1?this.currentImageIndex+1:0,this.updateLightboxImage())}updateLightboxImage(){const e=this.projects.find(l=>l.id===this.currentProjectId);if(!e?.images?.length)return;const o=e.images[this.currentImageIndex],i=document.getElementById("lightboxImage"),t=document.getElementById("lightboxTitle"),n=document.getElementById("lightboxDescription"),s=document.getElementById("lightboxLocation"),r=document.getElementById("lightboxArea");i&&(i.src=o.url),t&&(t.textContent=e.title),n&&(n.textContent=o.caption||e.description),s&&(s.innerHTML=`
        <svg class="w-4 h-4 text-[#EF036C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        ${e.location}
      `),r&&(r.textContent=e.area)}}window.openLightbox=a=>{window.galleryManager&&window.galleryManager.openLightbox(a)};document.addEventListener("DOMContentLoaded",()=>{window.galleryManager=new c});
