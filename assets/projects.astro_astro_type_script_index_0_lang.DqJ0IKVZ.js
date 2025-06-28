class n{constructor(){this.projects=[],this.filteredProjects=[],this.init()}async init(){if(!this.isLoggedIn()){this.showAuthError();return}document.getElementById("mainContent").style.display="block",await this.loadProjects(),this.updateStats(),this.renderProjects(),this.setupFilters()}isLoggedIn(){const s=sessionStorage.getItem("ubr_admin_logged_in"),e=sessionStorage.getItem("ubr_admin_login_time");if(!s||!e)return!1;const o=Date.now()-parseInt(e),i=8*60*60*1e3;return o<=i}showAuthError(){document.getElementById("authCheck").classList.remove("hidden"),document.getElementById("mainContent").style.display="none"}async loadProjects(){try{let s=[];try{s=(await(await fetch("/UBR/data/projects.json")).json()).projects||[]}catch(t){console.warn("Could not load JSON projects:",t)}const e=this.getLocalStorageProjects();this.projects=[...s,...e].sort((t,o)=>(o.order||0)-(t.order||0)),this.filteredProjects=[...this.projects],document.getElementById("loadingState").style.display="none"}catch(s){console.error("Error loading projects:",s),this.projects=[],this.filteredProjects=[],document.getElementById("loadingState").style.display="none"}}getLocalStorageProjects(){try{const s=localStorage.getItem("ubr_projects");return s?JSON.parse(s):[]}catch(s){return console.error("Error reading localStorage projects:",s),[]}}updateStats(){const s=this.projects.length,e=this.projects.filter(o=>o.isVisible).length,t=this.projects.reduce((o,i)=>o+(i.images?.length||0),0);document.getElementById("totalProjects").textContent=s,document.getElementById("visibleProjects").textContent=e,document.getElementById("totalImages").textContent=t}setupFilters(){const s=document.getElementById("categoryFilter"),e=document.getElementById("statusFilter");[s,e].forEach(t=>{t&&t.addEventListener("change",()=>this.applyFilters())})}applyFilters(){const s=document.getElementById("categoryFilter")?.value,e=document.getElementById("statusFilter")?.value;this.filteredProjects=this.projects.filter(t=>{const o=!s||t.category===s,i=!e||e==="visible"&&t.isVisible||e==="hidden"&&!t.isVisible;return o&&i}),this.renderProjects()}renderProjects(){const s=document.getElementById("projectsList"),e=document.getElementById("emptyState");if(this.filteredProjects.length===0){s.innerHTML="",e.classList.remove("hidden");return}e.classList.add("hidden"),s.innerHTML=this.filteredProjects.map(t=>`
        <div class="project-card bg-white rounded-lg shadow-sm border p-6">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="font-semibold text-lg text-gray-800 truncate">${t.title}</h3>
                <span class="px-2 py-1 text-xs rounded-full ${t.isVisible?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
                  ${t.isVisible?"👁️ Widoczny":"🙈 Ukryty"}
                </span>
              </div>
              <div class="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                <span class="flex items-center gap-1">
                  📍 ${t.location}
                </span>
                <span class="flex items-center gap-1">
                  📐 ${t.area}
                </span>
                <span class="flex items-center gap-1">
                  📅 ${t.year}
                </span>
                <span class="flex items-center gap-1">
                  📷 ${t.images?.length||0} zdjęć
                </span>
              </div>
              <p class="text-sm text-gray-700 mb-3 line-clamp-2">${t.description}</p>
              <div class="flex flex-wrap gap-1">
                ${(t.features||[]).slice(0,3).map(o=>`<span class="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">${o}</span>`).join("")}
                ${t.features?.length>3?`<span class="text-gray-500 text-xs">+${t.features.length-3}</span>`:""}
              </div>
            </div>
            <div class="project-actions flex gap-2 flex-shrink-0">
              <button onclick="editProject('${t.id}')" 
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                ✏️ Edytuj
              </button>
              <button onclick="toggleVisibility('${t.id}')" 
                      class="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors flex items-center gap-2">
                ${t.isVisible?"🙈 Ukryj":"👁️ Pokaż"}
              </button>
              <button onclick="deleteProject('${t.id}')" 
                      class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-2">
                🗑️ Usuń
              </button>
            </div>
          </div>
        </div>
      `).join("")}editProject(s){window.location.href=`/UBR/admin/edit/?id=${s}`}toggleVisibility(s){const e=this.projects.find(t=>t.id===s);e&&(e.isVisible=!e.isVisible,this.updateLocalStorageProject(e),this.updateStats(),this.renderProjects(),this.showNotification(`Projekt "${e.title}" został ${e.isVisible?"opublikowany":"ukryty"}`,"success"))}deleteProject(s){const e=this.projects.find(t=>t.id===s);e&&confirm(`Czy na pewno chcesz usunąć projekt "${e.title}"?

Ta operacja jest nieodwracalna.`)&&(this.removeFromLocalStorage(s),this.projects=this.projects.filter(t=>t.id!==s),this.applyFilters(),this.updateStats(),this.showNotification(`Projekt "${e.title}" został usunięty`,"success"))}updateLocalStorageProject(s){try{const e=localStorage.getItem("ubr_projects");let t=e?JSON.parse(e):[];const o=t.findIndex(i=>i.id===s.id);o>=0&&(t[o]=s,localStorage.setItem("ubr_projects",JSON.stringify(t)))}catch(e){console.error("Error updating localStorage project:",e)}}removeFromLocalStorage(s){try{const e=localStorage.getItem("ubr_projects");if(e){let t=JSON.parse(e);t=t.filter(o=>o.id!==s),localStorage.setItem("ubr_projects",JSON.stringify(t))}}catch(e){console.error("Error removing from localStorage:",e)}}showNotification(s,e="info"){const t=document.createElement("div");t.className=`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full ${e==="success"?"bg-green-600":e==="error"?"bg-red-600":"bg-blue-600"}`,t.textContent=s,document.body.appendChild(t),setTimeout(()=>{t.classList.remove("translate-x-full")},100),setTimeout(()=>{t.classList.add("translate-x-full"),setTimeout(()=>{document.body.removeChild(t)},300)},3e3)}logout(){confirm("Czy na pewno chcesz się wylogować?")&&(sessionStorage.removeItem("ubr_admin_logged_in"),sessionStorage.removeItem("ubr_admin_login_time"),window.location.href="/UBR/admin/")}}window.showAddForm=()=>{window.location.href="/UBR/admin/edit/"};window.editProject=r=>{window.projectsManager.editProject(r)};window.toggleVisibility=r=>{window.projectsManager.toggleVisibility(r)};window.deleteProject=r=>{window.projectsManager.deleteProject(r)};window.logout=()=>{window.projectsManager.logout()};document.addEventListener("DOMContentLoaded",()=>{window.projectsManager=new n});
