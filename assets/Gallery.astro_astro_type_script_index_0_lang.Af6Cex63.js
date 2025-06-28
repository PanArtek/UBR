class l{constructor(){this.projects=[],this.currentProjectId=null,this.currentImageIndex=0,this.init()}async init(){await this.loadProjects(),this.renderProjects(),this.bindEvents()}async loadProjects(){let e=[];try{e=(await(await fetch("/UBR/data/projects.json")).json()).projects.filter(o=>o.isVisible)}catch(i){console.warn("Could not load projects data:",i)}const n=this.getLocalStorageProjects();this.projects=[...e,...n].filter(i=>i.isVisible).sort((i,t)=>(t.order||0)-(i.order||0)),this.updateCounters()}getLocalStorageProjects(){try{const e=localStorage.getItem("ubr_projects");return e?JSON.parse(e):[]}catch(e){return console.error("Error reading localStorage projects:",e),[]}}updateCounters(){const e=document.getElementById("totalCount");e&&(e.textContent=this.projects.length),["lazienki-kuchnie","mieszkania","wykonczennia","domy-jednorodzinne","remonty-kapitalne","dachy-elewacje"].forEach(i=>{const t=document.getElementById(`count-${i}`);if(t){const o=this.projects.filter(s=>s.category===i).length;t.textContent=o}})}bindEvents(){document.querySelectorAll(".filter-btn").forEach(o=>{o.addEventListener("click",s=>{document.querySelectorAll(".filter-btn").forEach(r=>r.classList.remove("active")),s.target.classList.add("active"),this.filterProjects(s.target.dataset.category)})});const e=document.getElementById("lightboxClose"),n=document.getElementById("lightboxPrev"),i=document.getElementById("lightboxNext"),t=document.getElementById("lightbox");e&&e.addEventListener("click",()=>this.closeLightbox()),n&&n.addEventListener("click",()=>this.prevImage()),i&&i.addEventListener("click",()=>this.nextImage()),document.addEventListener("keydown",o=>{if(t&&t.classList.contains("flex"))switch(o.key){case"Escape":this.closeLightbox();break;case"ArrowLeft":this.prevImage();break;case"ArrowRight":this.nextImage();break}}),t&&t.addEventListener("click",o=>{o.target.id==="lightbox"&&this.closeLightbox()})}filterProjects(e){const n=e==="all"?this.projects:this.projects.filter(i=>i.category===e);this.renderProjects(n)}renderProjects(e=this.projects){const n=document.querySelector(".projects-grid"),i=document.getElementById("emptyMessage");if(e.length===0){n.innerHTML="",i.classList.remove("hidden");return}i.classList.add("hidden"),n.innerHTML=e.map((t,o)=>`
        <div class="project-card glass-card hover-lift cursor-pointer" 
             data-category="${t.category}"
             onclick="openLightbox('${t.id}')">
          
          <!-- Zdjęcie główne lub placeholder -->
          <div class="project-image relative">
            ${t.images?.length>0?`
              <img src="${t.images.find(s=>s.isMain)?.url||t.images[0].url}" 
                   alt="${t.title}"
                   class="w-full h-48 object-cover rounded-t-lg" 
                   loading="lazy" 
                   onerror="this.src='/UBR/images/placeholder.svg'" />
            `:`
              <svg width="400" height="192" xmlns="http://www.w3.org/2000/svg" class="rounded-t-lg">
                <defs>
                  <linearGradient id="grad-${t.category}-${o}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6" />
                    <stop offset="100%" style="stop-color:#1e40af" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad-${t.category}-${o})" rx="8" />
                <text x="50%" y="40%" text-anchor="middle" fill="white" 
                      font-family="system-ui" font-size="16" font-weight="600">
                  ${this.getCategoryName(t.category)}
                </text>
                <text x="50%" y="60%" text-anchor="middle" fill="rgba(255,255,255,0.8)" 
                      font-family="system-ui" font-size="12">
                  UBR WYKOŃCZENIA WNĘTRZ
                </text>
              </svg>
            `}
            
            ${t.images?.length>1?`
              <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                📷 ${t.images.length}
              </div>
            `:""}
          </div>

          <!-- Informacje o projekcie -->
          <div class="project-info p-4">
            <h3 class="font-semibold text-lg mb-2">${t.title}</h3>
            <p class="text-gray-600 text-sm mb-2">${t.location} • ${t.area||"N/A"}</p>
            <p class="text-gray-700 text-sm line-clamp-2">${t.description}</p>
            
            ${t.features?.length?`
              <div class="features mt-3 flex flex-wrap gap-1">
                ${t.features.slice(0,3).map(s=>`<span class="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">${s}</span>`).join("")}
                ${t.features.length>3?`<span class="text-gray-500 text-xs">+${t.features.length-3}</span>`:""}
              </div>
            `:""}
          </div>
        </div>
      `).join("")}getCategoryName(e){return{"domy-jednorodzinne":"Dom Jednorodzinny",mieszkania:"Mieszkanie","remonty-kapitalne":"Remont Kapitalny",wykonczennia:"Wykończenia","dachy-elewacje":"Dachy & Elewacje","lazienki-kuchnie":"Łazienki & Kuchnie"}[e]||e}openLightbox(e){const n=this.projects.find(t=>t.id===e);if(!n||!n.images?.length)return;this.currentProjectId=e,this.currentImageIndex=0,this.updateLightboxImage();const i=document.getElementById("lightbox");i&&(i.classList.replace("hidden","flex"),document.body.style.overflow="hidden")}closeLightbox(){const e=document.getElementById("lightbox");e&&(e.classList.replace("flex","hidden"),document.body.style.overflow="")}prevImage(){const e=this.projects.find(n=>n.id===this.currentProjectId);e?.images?.length&&(this.currentImageIndex=this.currentImageIndex>0?this.currentImageIndex-1:e.images.length-1,this.updateLightboxImage())}nextImage(){const e=this.projects.find(n=>n.id===this.currentProjectId);e?.images?.length&&(this.currentImageIndex=this.currentImageIndex<e.images.length-1?this.currentImageIndex+1:0,this.updateLightboxImage())}updateLightboxImage(){const e=this.projects.find(c=>c.id===this.currentProjectId);if(!e?.images?.length)return;const n=e.images[this.currentImageIndex],i=document.getElementById("lightboxImage"),t=document.getElementById("lightboxTitle"),o=document.getElementById("lightboxDescription"),s=document.getElementById("lightboxLocation"),r=document.getElementById("lightboxArea");i&&(i.src=n.url),t&&(t.textContent=e.title),o&&(o.textContent=n.caption||e.description),s&&(s.textContent=e.location),r&&(r.textContent=e.area)}}window.openLightbox=a=>{window.galleryManager&&window.galleryManager.openLightbox(a)};document.addEventListener("DOMContentLoaded",()=>{window.galleryManager=new l});
