var currentUserName;
var currentUserUid;

window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // show user's name after sign in
            firebase.database().ref('/users/' + user.uid).once('value', (success) => {
                currentUserUid = success.val().userUid;
                currentUserName = success.val().signupName;
                if (currentUserUid === user.uid) {
                    signinBtn.innerHTML = `<i style="font-size:18px; vertical-align:middle;" class="fas fa-user-circle"></i> &nbsp; ${currentUserName}`;
                }
            });

            // User is signed in.
            localStorage.setItem('auth', JSON.stringify(user));
            signoutBtn.setAttribute("onclick", "signOutBtn_f()");

            // for signoutHover
            document.getElementById("dropdownContent").removeAttribute('id', 'dropdownContent');

            //allow to click on sellBtn
            sellBtn.addEventListener('click', () => {
                signinPopup.style.display = "none";
                signupPopup.style.display = "none";
                sellPopup.style.display = "none";
                categoryPopup.style.display = "flex";
            })
        } else {
            // No user is signed in.
            signinBtn.setAttribute('onclick', "signinBtn_f()"); 
            signinBtn.innerText = "Sign In";
            localStorage.clear()

            // for signoutHover
            document.getElementsByClassName("dropdownContent")[0].setAttribute('id', 'dropdownContent');

            //don't allow to click on sellBtn
            sellBtn.addEventListener('click', () => {
                signinPopup.style.display = "flex";
                signupPopup.style.display = "none";
                sellPopup.style.display = "none";
                categoryPopup.style.display = "none";
            })
        }
    });
}

// signin popup
var signinBtn = document.getElementById("signinBtn");
var signinBtn_2 = document.getElementById("signinBtn_2");
var signinPopup = document.getElementById("signinPopup");
var closeSigninPopup = document.getElementById("closeSigninPopup");

signinBtn.addEventListener("click", function() {
    signinPopup.style.display = "flex";
    if (signupPopup) {
        signupPopup.style.display = "none";
    }
});

signinBtn_2.onclick = () => {
    signinPopup.style.display = "flex";
    if (signupPopup) {
        signupPopup.style.display = "none";
    }
    if (sellPopup) {
        sellPopup.style.display = "none";
    }
    if (categoryPopup) {
        categoryPopup.style.display = "none";
    }
};

// signup popup
var signupBtn = document.getElementById("signupBtn");
var signupPopup = document.getElementById("signupPopup");
var closeSignupPopup = document.getElementById("closeSignupPopup");
var signinPopup = document.getElementById("signinPopup");
var sellPopup = document.getElementById("sellPopup");
var categoryPopup = document.getElementById("categoryPopup");

signupBtn.onclick = () => {
    signupPopup.style.display = "flex";
    if (signinPopup) {
        signinPopup.style.display = "none";
    }
    if (sellPopup) {
        sellPopup.style.display = "none";
    }
    if (categoryPopup) {
        categoryPopup.style.display = "none";
    }
}

// category popup
var selectedCategory = '';
var sellBtn = document.getElementById("sellBtn");
var categoryPopup = document.getElementById("categoryPopup");
var closeCategoryPopup = document.getElementById("closeCategoryPopup");

sellBtn.onclick = () => {
    categoryPopup.style.display = "flex";
    sellPopup.style.display = "none";
    signupPopup.style.display = "none";
    signinPopup.style.display = "none";
}

// back category popup
var backCategoryPopup = document.getElementById("backCategoryPopup");

backCategoryPopup.onclick = () => {
    categoryPopup.style.display = "flex";
    sellPopup.style.display = "none";
    signupPopup.style.display = "none";
    signinPopup.style.display = "none";
}


// sell popup
var categoryForm = document.getElementById("categoryForm");
var categoryName = document.getElementById("categoryName");

categoryForm.onsubmit = () => {
    selectedCategory = document.querySelector("input[name='category']:checked");

    if (Boolean(selectedCategory) === true) {
        categoryName.innerText = `Category: ${selectedCategory.value}`;

        sellPopup.style.display = "flex";
        signupPopup.style.display = "none";
        signinPopup.style.display = "none";
        categoryPopup.style.display = "none";

        selectedCategory.checked = false;

        document.getElementById("warning").style.display = "none";
    } else {
        document.getElementById("warning").style.display = "block";
    }
    return false;
}

// window onclick
window.onclick = () => {
    if (event.target === signinPopup || event.target === closeSigninPopup || event.target === signupPopup || event.target === closeSignupPopup || event.target === closeSellPopup || event.target === closeCategoryPopup || event.target === closeAdDetailsPopup) {
        signupPopup.style.display = "none";
        signinPopup.style.display = "none";
        sellPopup.style.display = "none";
        categoryPopup.style.display = "none";
        adDetailsPopup.style.display = "none";
    }
}

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(n) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

setInterval(nextSlide, 3000); // Change slide every 3 seconds
//sellForm
var sellForm = document.getElementById("sellForm");

sellForm.onsubmit = (e) => {
    e.preventDefault();
    var adTitle = document.getElementById("adTitle");
    var adDescription = document.getElementById("adDescription");
    var adPrice = document.getElementById("adPrice");
    var adPhone = document.getElementById("adPhone");
    var adImage = document.getElementById("adImage");

    // firebase storage
    var file = adImage.files[0];
    console.log(file);
    if (file === undefined) {

        let ads = {
            title: adTitle.value,
            description: adDescription.value,
            price: adPrice.value,
            phone: adPhone.value,
            image: 'https://firebasestorage.googleapis.com/v0/b/olx-app-d4585.appspot.com/o/images%2Fdummyimg.jpg?alt=media&token=b38e6cca-abff-4c59-b728-3bbb8c3018fa',
            category: selectedCategory.value,
            uid: (JSON.parse(localStorage.getItem('auth')) && JSON.parse(localStorage.getItem('auth')).uid) || '',
            sellerName: currentUserName,
        }
        console.log(ads)
        firebase.database().ref('/ads').push(ads)
            .then(() => {
                // clear all fields and show category modal
                adTitle.value = "";
                adDescription.value = "";
                adPrice.value = "";
                adPhone.value = "";
                adImage.value = "";
            })
            .catch(console.log);
    } else {
        var storageRef = firebase.storage().ref('images/' + file.name);
        storageRef.put(file).then((url) => {
            url.ref.getDownloadURL().then((imgURL) => {
                console.log(imgURL);

                let ads = {
                    title: adTitle.value,
                    description: adDescription.value,
                    price: adPrice.value,
                    phone: adPhone.value,
                    image: imgURL,
                    category: selectedCategory.value,
                    uid: (JSON.parse(localStorage.getItem('auth')) && JSON.parse(localStorage.getItem('auth')).uid) || '',
                    sellerName: currentUserName,
                }
                console.log(ads)
                firebase.database().ref('/ads').push(ads)
                    .then(() => {
                        // clear all fields and show category modal
                        adTitle.value = "";
                        adDescription.value = "";
                        adPrice.value = "";
                        adPhone.value = "";
                        adImage.value = "";
                    })
                    .catch(console.log);
            })
        });
    }

    sellPopup.style.display = "none";
}

// signup with email
const signupForm = document.getElementById("signupForm");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPw = document.getElementById("signupPw");
const signupWarning = document.getElementById("signupWarning");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signupEmail.value;
    const password = signupPw.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up successfully
            const user = userCredential.user;
            const userData = {
                signupName: signupName.value,
                signupEmail: email,
                userUid: user.uid
            };
            firebase.database().ref("users").child(user.uid).set(userData);
            console.log("Signed up:", user);
            signupForm.reset(); // Clear the form fields
            signupPopup.style.display = "none"; // Hide the pop-up after sign up
        })
        .catch((error) => {
            // Handle errors
            const errorMessage = error.message;
            console.error("Sign up error:", errorMessage);
            signupWarning.innerText = errorMessage;
            signupWarning.style.display = "block";
        });
});


// signin with email
var signinEmail = document.getElementById("signinEmail");
var signinPw = document.getElementById("signinPw");
var signinForm = document.getElementById("signinForm");
var signinPopupContainer = document.getElementById("signinPopupContainer");
var signinWarning = document.getElementById("signinWarning");

signinForm.onsubmit = (e) => {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(signinEmail.value, signinPw.value).then((success) => {
        console.log(success);
        console.log("Signed in");
        localStorage.setItem('auth', JSON.stringify(success));
        signinPopup.style.display = "flex";
        signinEmail.value = "";
        signinPw.value = "";

        location.reload();

    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        signinWarning.innerText = errorMessage;
        signinWarning.style.display = "block";
    });
}

// signout
var signoutBtn = document.getElementById("signoutBtn");
function signOutBtn_f() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        localStorage.clear();
        signinEmail.value = "";
        signinPw.value = "";
        console.log("Signed out");

        // set ads to default afer user signed out
        location.reload();

    }).catch(function (error) {
        // An error happened.
    });
}

// fetching all ads
var allAds = [];
var filteredAds = [];

(function fetchAds() {
    firebase.database().ref('/ads').on('child_added', (snapshot) => {
        var data = snapshot.val();
        data.key = snapshot.key;
        allAds.push(data);
        renderAds(data);
    });
})()

// rendering all products
const picks = document.getElementById('picks');
var adUid;

function renderAds(ad) {
    picks.innerHTML = `
                    <div class="oneFourth" id="figure">
                        <figure onclick="showAdDetails(this)">
                            <div class="productImage">
                                <img src="${ad.image}" alt="">
                            </div>
                            <figcaption>
                                <span class="productID">${ad.key}</span>
                                <div class="first">
                                    <span class="price">Rs. ${ad.price}</span>
                                    <a href="javascript:void(0)" onclick="console.log('fvrt')" class="addToFvrt"><i class="far fa-heart"></i></a>
                                </div>
                                <div class="second">
                                    <span class="adTitle">${ad.title}</span>
                                </div>
                                <div class="productLocation">
                                    <span>Category: ${ad.category}</span>
                                </div>
                            </figcaption>
                        </figure>
                    </div> ${picks.innerHTML}`;
    adUid = ad.key;
}

// filtering
var searchCategory = 'All';
var popularCategories = document.getElementById("popularCategories");
var categoryHeading = document.getElementById("categoryHeading");
var browseCategories = document.getElementById("browseCategories");
var mainBanner = document.getElementById("mainBanner");
var mainBannerImg = document.getElementById("mainBannerImg");

function filter(category) {
    filteredAds = [];
    searchField.value = '';
    browseCategories.innerHTML = '';
    browseCategories.innerHTML = `Browse by Categories &nbsp; / &nbsp; ${category}`;
    // popularCategories.style.display = "none";
    categoryHeading.innerText = category;
    picks.innerHTML = '';
    searchCategory = category;

    if (category === 'All') {
        filteredAds = [...allAds];
        allAds.map((ad) => {
            renderAds(ad);
        })

        return;
    }

    allAds.map((ad) => {
        if (ad.category === category) {
            filteredAds.push(ad);
            renderAds(ad);
        }
    });

    if (picks.innerHTML.trim().length === 0) {
        picks.innerHTML = `<div style="text-align:center; margin:50px 0;"><h2>Oops! There is nothing to show :(</h2><img src="./images/noresults.png" alt=""></div>`;
    }
}

// searching ads
var searchField = document.getElementById('searchField');
var searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    search();
})

searchField.addEventListener('keyup', () => {
    if (searchCategory === 'All') {
        filteredAds = [...allAds];
    }

    if (searchField.value === '') {
        picks.innerHTML = '';
        filteredAds.map((ad) => {
            renderAds(ad);
        })
    }
})


function search() {
    popularCategories.style.display = "none";
    const textSearched = searchField.value && searchField.value.toLowerCase();
    picks.innerHTML = '';

    if (searchCategory === 'All') {
        filteredAds = [...allAds];
    }

    filteredAds.map((ad) => {
        if (ad.title && ad.title.toLowerCase().includes(textSearched)) {
            renderAds(ad);
        }
    });

    if (picks.innerHTML.trim().length === 0) {
        picks.innerHTML = `<div style="text-align:center; margin:50px 0;"><h2>Oops! There is nothing to show :(</h2><img src="./images/noresults.png" alt=""></div>`;
    }

}

//my ads
var myAds = document.getElementById("myAds");

myAds.addEventListener('click', () => {
    // location.href = 'myads.html';
    picks.innerHTML = '';
    categoryHeading.innerText = 'My Ads';
    var currentUserUid = firebase.auth().currentUser.uid;

    allAds.map((ad) => {
        if (ad.uid === currentUserUid) {
            filteredAds.push(ad);
            renderAds(ad);
        }

        // if (picks.innerHTML.trim().length === 0) {
        //     picks.innerHTML = `<div style="text-align:center; margin:50px 0;"><h2>Oops! There is nothing to show :(</h2><img src="./images/noresults.png" alt=""></div>`;
        // }
    });
})

// show ad details
var showAdImage = document.getElementById("showAdImage");
var showAdDescriptionHeading = document.getElementById("showAdDescriptionHeading");
var showAdDescriptionDesc = document.getElementById("showAdDescriptionDesc");
var price = document.getElementById("price");
var sellerName = document.getElementById("sellerName");
var sellerPhone = document.getElementById("sellerPhone");
var chatWithSeller = document.getElementById("chatWithSeller");
var adDetailsPopup = document.getElementById("adDetailsPopup");
var closeAdDetailsPopup = document.getElementById("closeAdDetailsPopup");
var adDetailsUid;

function showAdDetails(figure) {
    adDetailsPopup.style.display = "block";
    categoryPopup.style.display = "none";
    sellPopup.style.display = "none";
    signupPopup.style.display = "none";
    signinPopup.style.display = "none";

    let adUid = figure.childNodes[3].childNodes[1].innerText;

    firebase.database().ref(`/ads/${adUid}`).on('value', (snapshot) => {
        let adDetails = snapshot.val();

        if (adUid === (snapshot.key)) {
            showAdImage.innerHTML = `<img src="${adDetails.image}" alt="">`;
            showAdDescriptionHeading.innerHTML = adDetails.title;
            showAdDescriptionDesc.innerHTML = adDetails.description;
            price.innerHTML = `Rs. ${adDetails.price}`;
            sellerName.innerHTML = `Name: ${adDetails.sellerName}`;;
            sellerPhone.innerHTML = `Phone: <a href="tel:${adDetails.phone}">${adDetails.phone}</a>`;
        } else {
            console.log("key doesn't matched");
        }

        adDetailsUid = adDetails.uid;
    });
}

// delete ad
var deleteAdBtn = document.getElementById("deleteAdBtn");
console.log(adUid);

deleteAdBtn.onclick = () => {
    var figure = document.getElementById("figure");
    console.log(figure);
    console.log(figure.childNodes[1].childNodes[3]);
    console.log('del');
    let adUid = figure.childNodes[1].childNodes[3].childNodes[1].innerText;

    firebase.database().ref(`/ads/${adUid}`).remove();

    adDetailsPopup.style.display = "none";
    // location.reload();
}

//function favourite(ad){
//firebase.database().ref(`/users/${localstorage wla codepastekardo}/favouriteAds`).push(ad)
//}
