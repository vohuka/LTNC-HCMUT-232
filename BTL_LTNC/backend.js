//sign up function
// const auth = getAuth();
// var Signup = document.getElementById("Login")
// Signup.addEventListener("click",function(event){
//     event.preventDefault();
//     var email = document.getElementById("Email").value
//    var password = document.getElementById("Password").value
//     auth.createUserWithEmailAndPassword(email,password).then(function(){
//         console.log("Sign up successfully")
//     })
//     .catch(function(error){
//         var errorcode = error.code;
//         var errorMessage = error.message;
//     })

// });
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
    var Loginbut = document.querySelector("#Login")
    var Registerbut = document.querySelector("#Register")
    function createID(){
        return new Promise((resolve, reject) => { // Create a new Promise
            let currentID = 0;
            get(ref(db,"Student")).then((snapshot) => {
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
        const dbref=ref(db);
        return get(ref(db, "Student")).then((snapshot) => {
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
        const dbref = ref(db);
        return get(ref(db, "Student")).then((snapshot) => {
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
    
    // async function someFunction() {
    //     let newID = await createID();
    //     // Các dòng code sau đây sẽ không được thực thi cho đến khi createID() hoàn thành
    //     console.log(newID);
    //     return newID.toString();
    // }
    
    async function InsertData(){
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
                let newID = await createID(); // Gọi hàm để lấy ID mới
                console.log(newID);
                set(ref(db, "Student/" + newID),{ // Sử dụng ID mới trong đường dẫn
                    Name: UserNameRegister.value,
                    Phone: PhonenumberRegister.value,
                    Birth: BirthdayRegister.value,
                    Email: RegisterEmail.value,
                    Password: RegisterPassword.value,
                })
                .then(()=>{
                    alert("Data added successfully!")
                })
                .catch((error)=>{
                    alert(error)
                });
            }
        });
    }
    
    function Login(){
        let email = enterEmail.value;
        let password = enterPassword.value;
        get(ref(db,"Student")).then((snapshot) => {
            if(snapshot.exists())
            {
                let Login_Id = snapshot.val();
                for(let data in Login_Id){
                    if(Login_Id[data].Email === email && Login_Id[data].Password === password)
                    {
                        alert("Log in successfully");
                        document.querySelector(".wrapper2").classList.remove('active-popup');
                        document.querySelector(".role").classList.add('active');
                        

                    }
                }
                
            }

        });
    }
    
    Loginbut.addEventListener('click', Login);
    Registerbut.addEventListener('click',InsertData)
