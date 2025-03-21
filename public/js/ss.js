// ID
const navBar = document.getElementById("navbar");
const fakeNav = document.getElementById("fake-nav");
const footer = document.getElementById("footer");
const indJobCap = document.getElementById("ind-job-cap");
const indJobDesc = document.getElementById("ind-job-desc");
const instagram = document.getElementById("instagram");


var jobHead;
var indJob;
var indJobCap_Rec;
var applyFromTop;
var applyFromBottom;

const navHeight = 56;

function toggleMenu() {
    var hamburgerMenu = document.getElementById("kx--menu__button");

    if (hamburgerMenu) {
        hamburgerMenu.onclick = function(e) {

            if (navBar.classList.contains('active')) {
                navBar.classList.toggle('active');

            } else {
                setTimeout(function() {
                    navBar.classList.toggle('active');
                }, 100);
            }
            hamburgerMenu.classList.toggle("open");
        }
    }
}

// const indJobDesc_Rec = indJobDesc.getBoundingClientRect();
if (indJobCap) {
    indJobCap_Rec = indJobCap.getBoundingClientRect();
    jobHead = document.getElementsByClassName('job-heading');
    indJob = document.getElementsByClassName('individual-job');
}

function getStyle(oElm, strCssRule) {
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    } else if (oElm.currentStyle) {
        strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}

function navScroll() {

    var stickyNav = navBar.offsetTop + navHeight + 30;

    if (window.pageYOffset >= stickyNav) {
        navBar.classList.add("sticky", "animated", "fadeInDown");

    } else {
        navBar.classList.remove("sticky", "animated", "fadeInDown");

    }
}


function jobCapScroll() {

    if (indJobCap) {

        function reset() {
            indJobCap.classList.remove("sticky", "sticky-bottom");
            indJobDesc.classList.remove("offset-4");
            indJobCap.style.width = "inherit";
        }

        reset();

        var jobHeadingHeight = jobHead[0].offsetHeight;
        var jobSectionPadding = getStyle(document.getElementById("individual-job"), "padding-top");

        applyFromTop = (jobHeadingHeight + parseInt(jobSectionPadding) - 80);


        var capH = indJobCap.childNodes[1].offsetHeight;
        var footH = footer.offsetHeight;
        var bodPadd = parseInt(jobSectionPadding);
        var docH = document.documentElement.scrollHeight;
        var tRem = capH + footH + bodPadd;
        var bottom = footH + capH;

        applyFromBottom = docH - (tRem + 83);

        window.onscroll = function() {

            navScroll();

            if (window.pageYOffset >= applyFromTop && window.pageYOffset < applyFromBottom) {
                indJobCap.classList.remove("sticky-bottom");
                indJobCap.classList.add("sticky");
                indJobDesc.classList.add("offset-4");
                indJobCap.style.width = indJobCap_Rec.width + "px";
            } else if (window.pageYOffset >= applyFromBottom) {
                indJobCap.classList.remove("sticky");
                indJobCap.classList.add("sticky-bottom");
            } else {
                reset();
            }
        }

    }
}


// When the user scrolls the page, execute myFunction
window.onscroll = function() {
    navScroll();
};

if (indJobCap) {
    window.onresize = function() {
        indJobCap_Rec = indJobCap.getBoundingClientRect();
        jobCapScroll();
    };
}

$('.close-alert').click(function() {
    $(this).parents(':eq(1)').remove();
});



function getInstagramData() {
    if (instagram) {
        $.ajax({
            url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=5810898585.3b52b49.86e493d9c7ef401cae4852b6d04cacda",
            success: function(result) {
                displayInstagram(result.data);
            }
        });
    }
}

function displayInstagram(instagramData) {
    var i;
    for (i = 0; i < 6; i++) {
        var instagramLink = document.createElement('a');
        var instagramDiv = document.createElement('div');
        var instagramImg = document.createElement('img');
        instagramLink.setAttribute('target', '_blank');
        instagramDiv.className = "col-sm-6 col-md-4 col-lg-4";
        instagramLink.href = instagramData[i].link;
        instagramImg.src = instagramData[i].images.standard_resolution.url;
        instagramDiv.appendChild(instagramLink);
        instagramLink.appendChild(instagramImg);
        instagram.appendChild(instagramDiv);
    }
}

function lazyLoadImages() {
    var allimages = document.getElementsByTagName('img');
    for (var i = 0; i < allimages.length; i++) {
        if (allimages[i].getAttribute('data-src')) {
            allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
        }
    }
}

function admin() {

    $('#exampleModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var job_id = button.data('job') // Extract info from data-* attributes
        var job_title = button.data('title') // Extract info from data-* attributes
        console.log(job_title);
        var modal = $(this)
        modal.find('#delete-form').attr('action', ' /jobs/admin/' + job_id + '?_method=DELETE');
        modal.find('#job-title').text(job_title);
    })
}

admin();

function appPreLoader() {
    document.body.classList.add("loaded");
}

// Below needs a tidy
window.addEventListener('load',
    function() {
        // appPreLoader();
    }, false);

document.addEventListener("DOMContentLoaded", function(event) {
    getInstagramData();
    navScroll();
    jobCapScroll();
    toggleMenu();
});

(() => {
    lazyLoadImages();
    $('[data-toggle="tooltip"]').tooltip();
})();