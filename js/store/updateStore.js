let storeName = document.getElementById("storeName");
storeName.value = localStorage.getItem('storeName');
let storeWebsite = document.getElementById("storeWebsite");
storeWebsite.value = localStorage.getItem('website');
let storeImage = document.getElementById("storeImage");
let telephoneNumber = document.getElementById("telephoneNumber");
let addedNumbers = JSON.parse(localStorage.getItem('telephoneNumber'));
let addedCategories = JSON.parse(localStorage.getItem('storeCategories'));
let selectedCategories = [];
let token = localStorage.getItem('token');
let data;
apiBaseUrl = "https://oshops-app.herokuapp.com/";


if (token == undefined || token == null) {
    window.location.href = "../../html/login.html";
    localStorage.clear()
}


function getCurrentAdmin() {
    let getCurrentAdmin = ``;
    let permission = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}getCurrentAdmin`;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            getCurrentAdmin = `<h5>${json.userData.firstName} ${json.userData.lastName}</h5>
                            <small>${json.userData.role}</small>`;
            if (json.userData.role == 'superAdmin') {
                permission = `<a href="./admin.html"><i class="fas fa-user-cog"></i>
                <span>Admins</span>
            </a>`;
            }
            document.getElementById("permission").innerHTML = permission;
            document.getElementById("getCurrentAdmin").innerHTML = getCurrentAdmin;
        }
    };
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function logOut() {
    window.location = "../../html/login.html";
    localStorage.clear();
}


function isValid(num) {
    let regex = /^\d+$/;
    let isValid = regex.test(num)
    if (isValid) {
        return true;
    }
    else {

        return false;
    }
}


function isEmpty(num) {
    if (num == "") {
        return true;
    }
    else {
        return false;
    }
}


function findNumberInList(numList, num) {
    let numberFound = numList.includes(num);
    if (numberFound) {
        return true;
    }
    else {
        return false;
    }
}


function addNewPhoneNumberInput() {
    let number = telephoneNumber.value;
    if (!isEmpty(number)) {
        if (isValid(number)) {
            if (findNumberInList(addedNumbers, number)) {
                let msg = `<div class="alert alert-danger" role="alert">Phone number already exists!</div>`;
                document.getElementById('msg').innerHTML = msg;
                setTimeout(() => {
                    msg = '';
                    document.getElementById('msg').innerHTML = msg;

                }, 2000);
            }
            else if (!findNumberInList(addedNumbers, number)) {
                addedNumbers.push(number);
                telephoneNumber.value = "";
                let msg = `<div class="alert alert-success" role="alert">Phone number added!</div>`;
                document.getElementById('msg').innerHTML = msg;
                setTimeout(() => {
                    msg = '';
                    document.getElementById('msg').innerHTML = msg;
                }, 2000)
                viewAddedPhoneNumbers();
            }
        }
        else {
            let msg = `<div class="alert alert-danger" role="alert">Please enter a valid phone number!</div>`;
            document.getElementById('msg').innerHTML = msg;
            setTimeout(() => {
                msg = '';
                document.getElementById('msg').innerHTML = msg;
            }, 2000);
        }
    }
    else {
        let msg = `<div class="alert alert-danger" role="alert">Please enter a phone number!</div>`;
        document.getElementById('msg').innerHTML = msg;
        console.log("no value");
        setTimeout(() => {
            msg = '';
            document.getElementById('msg').innerHTML = msg;

        }, 2000);
    }
}


function createRow(i) {
    return `<li class="list-group-item" id="${i}">
    <i class="fas fa-times text-danger mr-5" onclick="removeNumber('${i}')" style="position: relative; font-size: larger; cursor:pointer;">
    </i>${addedNumbers[i]} </li>`;
}


function setOldPhoneNumbers(numList) {
    let info = `<li class="list-group-item disabled" aria-disabled="true" id="addedHeader">Added Numbers</li>`;

    for (var i = 0; i < numList.length; i++) {
        info += createRow(i);
    }
    document.getElementById("viewAddedPhoneNumbers").innerHTML = info;
}


function viewAddedPhoneNumbers() {
    let info = `<li class="list-group-item disabled" aria-disabled="true" id="addedHeader">Added Numbers</li>`;

    for (var i = 0; i < addedNumbers.length; i++) {
        info += createRow(i);
    }
    document.getElementById("viewAddedPhoneNumbers").innerHTML = info;
}


function removeNumber(index) {
    addedNumbers.splice(index, 1);
    viewAddedPhoneNumbers();
}


function getAllCategories() {
    let url = `${apiBaseUrl}getAllCategories`;
    let categories = ``;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                for (let index = 0; index < json.allCategories.length; index++) {
                    categories = categories + `<div class="form-check" class="mt-5">
                    <input class="form-check-input" name="mycheckboxes" type="checkbox" value="${json.allCategories[index].categoryName}" id="${json.allCategories[index]._id}">
                    <label class="form-check-label">
                    ${json.allCategories[index].categoryName}
                    </label>
                </div>`;


                }
            }


            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}
            </div>`;
                document.getElementById("msg").innerHTML = msg;
            }
        }
        document.getElementById("categoryList").innerHTML = categories;
    }
    var data = JSON.stringify({ "token": token });
    xhr.send(data);
}


function setOldCategories(oldCategories) {
    let matches = [];
    let allCategories = [];
    setTimeout(() => {
        let checkBoxesArray = document.querySelectorAll('input[type=checkbox]');
        checkBoxesArray = Array.from(checkBoxesArray);

        for (let index = 0; index < oldCategories.length; index++) {
            oldCategories[index] = oldCategories[index]._id;

        }

        for (let index = 0; index < checkBoxesArray.length; index++) {
            allCategories[index] = checkBoxesArray[index].id;

        }
        allCategories.shift();
        matches = allCategories.filter(element => oldCategories.includes(element));

        for (let index = 0; index < checkBoxesArray.length; index++) {
            if (matches.includes(checkBoxesArray[index].id)) {
                document.getElementById(checkBoxesArray[index].id).checked = true;
            }
        }

    }, 1000);


}



function getCheckedBoxes(checkBoxName) {
    let checkBoxesArray = document.getElementsByName(checkBoxName);
    for (let i = 0; i < checkBoxesArray.length; i++) {
        if (checkBoxesArray[i].checked) {
            selectedCategories.push(checkBoxesArray[i].id);
        }
    }
}




function getAllStoreCategories() {
    for (var option of document.getElementById('categoryList')) {
        if (option.checked) {
            selectedCategories.push(option.value);
        }
    }
}



storeImage.addEventListener("change", (e) => {
    getCheckedBoxes("mycheckboxes");
    const img = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        data = JSON.stringify({
            "storeName": storeName.value, "storeLogoURL": {
                "data": base64String,
                "name": img.name
            }, "storeCategories": selectedCategories,
            "telephoneNumber": addedNumbers,
            "website": storeWebsite.value
        });
    }
    reader.readAsDataURL(e.target.files[0]);
})


function updateStore() {
    if (storeImage.files.length == 0) {
        getCheckedBoxes("mycheckboxes");
        data = JSON.stringify({
            "storeName": storeName.value,
            "storeCategories": selectedCategories,
            "telephoneNumber": addedNumbers,
            "website": storeWebsite.value
        });

    }
    let storeId = localStorage.getItem("storeId");
    let msg = ``;
    var xhr = new XMLHttpRequest();
    var url = `${apiBaseUrl}updateStore/${storeId}`;
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.status == 200) {
                msg = `<div class="alert alert-success" role="alert">
                ${json.message}
                </div>`;
                setTimeout(() => {
                    document.getElementById('msg').innerHTML = msg;
                    window.location = "../../html/stores/viewStore.html";
                }, 2000);

                localStorage.removeItem('storeName');
                localStorage.removeItem('storeId');
                localStorage.removeItem('telephoneNumber');
                localStorage.removeItem('website');
                localStorage.removeItem('storeCategories');
                document.getElementById('msg').innerHTML = msg;
            }

            else {
                msg = `<div class="alert alert-danger" role="alert">
                ${json.message}

            </div>`;
                
                setTimeout(() => {
                    msg = ``;
                    document.getElementById('msg').innerHTML = msg;
                    // location.reload();
                }, 2000);
                document.getElementById('msg').innerHTML = msg;
            }
        }
    }
    xhr.send(data);
}


getCurrentAdmin();
setOldPhoneNumbers(addedNumbers);
getAllCategories();
setOldCategories(addedCategories);

document.getElementById("updateBtn").addEventListener("click", updateStore);