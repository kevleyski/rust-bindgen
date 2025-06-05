// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="requirements.html"><strong aria-hidden="true">2.</strong> Requirements</a></li><li class="chapter-item expanded "><a href="library-usage.html"><strong aria-hidden="true">3.</strong> Library Usage with build.rs</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="tutorial-0.html"><strong aria-hidden="true">3.1.</strong> Tutorial</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="tutorial-1.html"><strong aria-hidden="true">3.1.1.</strong> Add bindgen as a Build Dependency</a></li><li class="chapter-item expanded "><a href="tutorial-2.html"><strong aria-hidden="true">3.1.2.</strong> Create a wrapper.h Header</a></li><li class="chapter-item expanded "><a href="tutorial-3.html"><strong aria-hidden="true">3.1.3.</strong> Create a build.rs File</a></li><li class="chapter-item expanded "><a href="tutorial-4.html"><strong aria-hidden="true">3.1.4.</strong> Include the Generated Bindings in src/lib.rs</a></li><li class="chapter-item expanded "><a href="tutorial-5.html"><strong aria-hidden="true">3.1.5.</strong> Write a Sanity Test</a></li><li class="chapter-item expanded "><a href="tutorial-6.html"><strong aria-hidden="true">3.1.6.</strong> Publish Your Crate!</a></li></ol></li><li class="chapter-item expanded "><a href="non-system-libraries.html"><strong aria-hidden="true">3.2.</strong> Bindings for non-system libraries</a></li></ol></li><li class="chapter-item expanded "><a href="command-line-usage.html"><strong aria-hidden="true">4.</strong> Command Line Usage</a></li><li class="chapter-item expanded "><a href="customizing-generated-bindings.html"><strong aria-hidden="true">5.</strong> Customizing the Generated Bindings</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="allowlisting.html"><strong aria-hidden="true">5.1.</strong> Allowlisting</a></li><li class="chapter-item expanded "><a href="blocklisting.html"><strong aria-hidden="true">5.2.</strong> Blocklisting</a></li><li class="chapter-item expanded "><a href="opaque.html"><strong aria-hidden="true">5.3.</strong> Treating a Type as an Opaque Blob of Bytes</a></li><li class="chapter-item expanded "><a href="replacing-types.html"><strong aria-hidden="true">5.4.</strong> Replacing One Type with Another</a></li><li class="chapter-item expanded "><a href="nocopy.html"><strong aria-hidden="true">5.5.</strong> Preventing the Derivation of Copy and Clone</a></li><li class="chapter-item expanded "><a href="nodebug.html"><strong aria-hidden="true">5.6.</strong> Preventing the Derivation of Debug</a></li><li class="chapter-item expanded "><a href="nodefault.html"><strong aria-hidden="true">5.7.</strong> Preventing the Derivation of Default</a></li><li class="chapter-item expanded "><a href="must-use-types.html"><strong aria-hidden="true">5.8.</strong> Annotating types with #[must-use]</a></li><li class="chapter-item expanded "><a href="visibility.html"><strong aria-hidden="true">5.9.</strong> Field visibility</a></li><li class="chapter-item expanded "><a href="code-formatting.html"><strong aria-hidden="true">5.10.</strong> Code formatting</a></li></ol></li><li class="chapter-item expanded "><a href="cpp.html"><strong aria-hidden="true">6.</strong> Generating Bindings to C++</a></li><li class="chapter-item expanded "><a href="objc.html"><strong aria-hidden="true">7.</strong> Generating Bindings to Objective-c</a></li><li class="chapter-item expanded "><a href="using-unions.html"><strong aria-hidden="true">8.</strong> Using Unions</a></li><li class="chapter-item expanded "><a href="using-bitfields.html"><strong aria-hidden="true">9.</strong> Using Bitfields</a></li><li class="chapter-item expanded "><a href="using-fam.html"><strong aria-hidden="true">10.</strong> Using Flexible Array Members</a></li><li class="chapter-item expanded "><a href="faq.html"><strong aria-hidden="true">11.</strong> FAQ</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
