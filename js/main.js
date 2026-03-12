(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Initiate the wowjs
    new WOW().init();


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Blog carousel
    $(".blog-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: false,
        dots: false,
        loop: true,
        margin: 50,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: true,
        dots: true,
        loop: true,
        margin: 50,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });

    // Add smooth scroll for anchor links
    $(document).on('click', 'a[href^="#"]', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

})(jQuery);
(function ($) {
    "use strict";

    // WOW init [web:7]
    if (typeof WOW !== "undefined") {
        new WOW().init();
    }

    // Testimonial carousel init [web:9]
    if ($(".testimonial-carousel").length) {
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 800,
            center: false,
            dots: true,
            loop: true,
            margin: 16,
            nav: false,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }

    // ---------- Products Page (Jaipur Prices) ----------
    async function loadJaipurProducts() {
        var $grid = $("#productGrid");
        if (!$grid.length) return;

        try {
            const res = await fetch("data/prices-jaipur.json", { cache: "no-store" });
            const data = await res.json();

            $("#price-last-updated").text(data.last_updated || "--");

            window.PK_PRODUCTS = (data.products || []);

            renderProducts(window.PK_PRODUCTS);
            bindProductFilters();
        } catch (e) {
            $grid.html('<div class="col-12"><div class="bg-white rounded p-4">Data file missing: <code>data/prices-jaipur.json</code></div></div>');
        }
    }

    function renderProducts(products) {
        var $grid = $("#productGrid");

        if (!products || !products.length) {
            $grid.html('<div class="col-12"><div class="bg-white rounded p-4">No products found.</div></div>');
            return;
        }

        var html = products.map(function (p) {
            var sizes = (p.pack_sizes || []).map(function (s) {
                return '<span class="badge bg-light text-dark border me-1 mb-1">' + s + "</span>";
            }).join("");

            var priceText = (p.jaipur_price === null || p.jaipur_price === undefined) ? "Call" : ("₹" + p.jaipur_price);

            return `
        <div class="col-lg-4 col-md-6">
          <div class="bg-white rounded shadow-sm h-100 overflow-hidden">
            <img src="${p.image || 'img/products/placeholder.jpg'}" class="img-fluid" alt="${p.name || 'Product'}" style="height:180px; width:100%; object-fit:cover;">
            <div class="p-4">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="mb-1">${p.name || ''}</h5>
                  <small class="text-muted">${p.brand || ''}${p.category ? ' • ' + p.category : ''}</small>
                </div>
                <span class="badge bg-primary">${p.brand || ''}</span>
              </div>

              <div class="mt-3">${sizes}</div>

              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="text-muted">Our Jaipur Price</span>
                <span class="fw-bold text-primary" style="font-size:1.1rem;">${priceText}</span>
              </div>

              <small class="text-muted d-block mt-1">Updated: ${p.updated || '--'}</small>

              <div class="d-flex gap-2 mt-3 flex-wrap">
                <a class="btn btn-primary btn-sm rounded-pill px-3" href="https://wa.me/916375338302?text=${encodeURIComponent('Hi, I want price & availability for: ' + (p.name || '') + ' (' + (p.brand || '') + ')')}">WhatsApp</a>
                <a class="btn btn-outline-dark btn-sm rounded-pill px-3" href="tel:+916375338302">Call</a>
                <a class="btn btn-outline-primary btn-sm rounded-pill px-3" href="mailto:pestsolutionspestkill@gmail.com?subject=${encodeURIComponent('Enquiry: ' + (p.name || 'Product'))}">Email</a>
              </div>
            </div>
          </div>
        </div>
      `;
        }).join("");

        $grid.html(html);
    }

    function bindProductFilters() {
        var $brand = $("#brandFilter");
        var $search = $("#searchFilter");
        var $reset = $("#resetFilters");

        function apply() {
            var brand = ($brand.val() || "ALL").toUpperCase();
            var q = ($search.val() || "").toLowerCase().trim();

            var filtered = (window.PK_PRODUCTS || []).filter(function (p) {
                var okBrand = (brand === "ALL") || ((p.brand || "").toUpperCase() === brand);
                var text = ((p.name || "") + " " + (p.category || "")).toLowerCase();
                var okSearch = !q || text.includes(q);
                return okBrand && okSearch;
            });

            renderProducts(filtered);
        }

        if ($brand.length) $brand.on("change", apply);
        if ($search.length) $search.on("input", apply);
        if ($reset.length) $reset.on("click", function () {
            $brand.val("ALL");
            $search.val("");
            apply();
        });
    }

    // Run on load
    $(window).on("load", function () {
        loadJaipurProducts();
    });

})(jQuery);

