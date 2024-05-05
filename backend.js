
import {getDatabase, set, get, update, remove, ref, child}
from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js"
const db = getDatabase();
    var enterEmail = document.querySelector("#Email");
    var enterPassword = document.querySelector("#Password");
    var RegisterEmail = document.querySelector("#Email_Register");
    var RegisterPassword = document.querySelector("#Password_Register");
    var UserNameRegister = document.querySelector("#UserName");
    var PhonenumberRegister = document.querySelector("#Phone_number");
    var BirthdayRegister = document.querySelector("#Birthday");
    var Loginbut = document.querySelector("#Login");
    var Registerbut = document.querySelector("#Register");
    var studentBut = document.querySelector("#Page_Student");
    var teacherBut = document.querySelector("#Page_Teacher");

// Hàm phân biệt là student hay teacher
let isStudent = false;
let isLecturer = false;

//Biến global
    //userID
    //userRole

function createUserDir() {
    let dbUserDir = "";
    if (isStudent) {
        dbUserDir += "Students";
    }
    else if (isLecturer) {
        dbUserDir += "Teachers";
    }
    return dbUserDir;
}

function createID(){
    return new Promise((resolve, reject) => { // Create a new Promise
        let currentID = 0;
        let dir = createUserDir();
        get(ref(db, dir)).then((snapshot) => {
            if(snapshot.exists()){
                const Students = snapshot.val();
                for(let ID in Students){
                    let numericID = parseInt(ID);
                    if(numericID > currentID)
                    {
                        currentID = numericID;
                        console.log("Current ID: " + currentID);
                        console.log("Student's Value: " + Students[ID]);
                    }
                }
                currentID += 1;
                console.log("New Current ID: " + currentID);
                resolve(currentID.toString()); // Resolve the Promise with the new ID
            } else {
                console.log("Không tìm thấy dữ liệu!");
                resolve(null);
            }
        }).catch((error) => {
            console.error(error);
            reject(error); // Reject the Promise if there's an error
        });
    });
}

    function checkIfEmailExists(email)
    {
        const dir = createUserDir();
        return get(ref(db, dir)).then((snapshot) => {
            if(snapshot.exists()){
            let userData = snapshot.val();
            for(let user in userData) {
                if(userData[user].Email === email) {
                    return true;
                }
            }
        }
            return false;
        });
    }
    function checkIfPhonenumberExists(phoneNumber) {
        let dir = createUserDir();
        return get(ref(db, dir)).then((snapshot) => {
            if(snapshot.exists()){
                let userData = snapshot.val();
                for(let user in userData) {
                    if(userData[user].Phone === phoneNumber) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
    
    async function InsertData(event){
        event.preventDefault();
        let email = RegisterEmail.value;
        let phoneNumber = PhonenumberRegister.value;
        Promise.all([checkIfEmailExists(email), checkIfPhonenumberExists(phoneNumber)]).then(async(results) => {
            let emailExists = results[0];
            let phoneNumberExists = results[1];
    
            if(emailExists) {
                alert("Email already exists!");
            } else if(phoneNumberExists) {
                alert("Phone number already exists!");
            } else {
                let newID = await createID();
                const dir = createUserDir();
                // let newEmail = email.replace(/\./g, '_');
                if (email) {
                    const studentRef = ref(db, dir + "/" + newID);
                    const data = {
                        ID: newID,
                        Name: UserNameRegister.value,
                        Phone: PhonenumberRegister.value,
                        Birth: BirthdayRegister.value,
                        Email: RegisterEmail.value,
                        Password: RegisterPassword.value,
                    };
                    set(studentRef, data)
                    .then(() => {
                        alert('Register successfully');
                    })
                    .catch((error) => {
                        console.error('Error updating data: ', error);
                    });
                }
            }
        });
    }
    
        function Login(event){
        event.preventDefault();
        let email = enterEmail.value;
        let password = enterPassword.value;
        const dir = createUserDir();
        
        let flag = true;

        get(ref(db, dir)).then((snapshot) => {
            if(snapshot.exists())
            {
                let Login_Id = snapshot.val();
                for(let data in Login_Id){
                    if(Login_Id[data].Email === email && Login_Id[data].Password === password)
                    {
                        flag = false;
                        alert("Log in successfully");
                        if (isStudent) {
                            var username = enterEmail.value;
                            localStorage.setItem("userID", Login_Id[data].ID);
                            const test = localStorage.getItem("userID");

                            console.log(test);
                
                            var url = "Generalpage_Student.html?userName=" + encodeURIComponent(username);
                
                            window.location.href = url;
                        } else if (isLecturer) {
                            console.log("test");
                            var username = enterEmail.value;
                            localStorage.setItem("userID", Login_Id[data].ID);
                
                            var url = "Generalpage_Teacher.html?userName=" + encodeURIComponent(username);
                
                            window.location.href = url;
                        }
                    }
                }
                if(flag) alert("Login Failed!");
            }

        });
    };
    
    // chọn role nào sẽ nhảy đến trang của role đó
    studentBut.addEventListener('click', function (){
        isStudent = true;
        document.querySelector(".role").classList.remove('active');
        document.querySelector(".wrapper2").classList.add('active-popup');
        Loginbut.addEventListener('click', Login);
    });
    teacherBut.addEventListener('click', function () {
        isLecturer = true;
        document.querySelector(".role").classList.remove('active');
        document.querySelector(".wrapper2").classList.add('active-popup');
        Loginbut.addEventListener('click', Login);
    });
    Registerbut.addEventListener('click', InsertData);

    
    