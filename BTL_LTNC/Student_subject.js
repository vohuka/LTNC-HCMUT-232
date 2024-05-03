import { initializeApp }                     from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, child, get, set } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx8uDOgXaLWzsR5H6autaHqmBoj-Q5m2U",
  authDomain: "ltnc-web.firebaseapp.com",
  databaseURL: "https://ltnc-web-default-rtdb.firebaseio.com",
  projectId: "ltnc-web",
  storageBucket: "ltnc-web.appspot.com",
  messagingSenderId: "819852901117",
  appId: "1:819852901117:web:84832bef50ef4b33e55c94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//Biến global quan trọng
const db = getDatabase();

function get_class_for_student(stuID) {
    const classRef = ref(db, "Students/" + stuID + "/Classes/");
    var classInfo_obj_array;
    get(classRef).then((snapshot) => {
        if(snapshot.exists()){
            let courseList = snapshot.val();
            for(let course_in_study in courseList){
                let classInfo_obj = {
                    "courseID": courseList[course_in_study].CourseID,
                    "courseName": courseList[course_in_study].Course_Title,
                    "classID": courseList[course_in_study].ID,
                };
                // 
                var newDiv = document.createElement("div");
                newDiv.className = "card dashboard";

                var newImg = document.createElement("img");
                newImg.className = "img";
                newImg.src = "picture/Background 8.jpg";

                var newDiv2 = document.createElement("div");
                newDiv2.className = "string box-subject";

                var newDiv3 = document.createElement("div");
                newDiv3.className = "format-string";

                var newP = document.createElement("p");
                newP.textContent = classInfo_obj.courseID;

                var newA = document.createElement("a");
                newA.href = "#";
                newA.id = classInfo_obj.courseName + '_' + classInfo_obj.classID;
                newA.textContent = classInfo_obj.courseName + '_' + classInfo_obj.classID;
                newDiv3.appendChild(newP);
                newDiv3.appendChild(newA);
                newDiv2.appendChild(newDiv3);
                newDiv.appendChild(newImg);
                newDiv.appendChild(newDiv2);

                classInfo_obj_array.push(classInfo_obj);
            }
            //Tạm thời trả về array lưu object gồm mã môn học và mã lớp, tùy theo yêu cầu Frontend sẽ chỉnh lại
            return classInfo_obj_array;
        } else {
            console.log("Không tìm thấy dữ liệu!");
            //Tạm thời trả về array rỗng, tùy theo yêu cầu Frontend sẽ chỉnh lại
            return classInfo_obj_array;
        }
    }).catch((error) => {
        console.error(error);
    });
}