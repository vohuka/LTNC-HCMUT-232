// Import the functions you need from the SDKs you need
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
    //userID:   localStorage
    //userRole: localStorage


//Hàm tương tác dữ liệu từ database (Hàm bool)
function find_a_node(ref_link, node_name) {
  return new Promise((resolve, reject) => {
    const classesRef = ref(db, `${ref_link}`);
    const specificClassRef = child(classesRef, `${node_name}`);

    get(specificClassRef).then((snapshot) => {
      resolve(snapshot.exists());
    }).catch((error) => {
      reject('Lỗi không xác định!');
    });
  });
}
    
function add_a_node(ref_link, node_name, node_content) {  //Add data vào dadabase lưu ý input đúng đường dẫn và kiểu dữ liệu
  const nodeRef = ref(db, `${ref_link}/${node_name}`);

  set(nodeRef, node_content).then(() => {
    console.log(`Node "${node_name}" đã được thêm vào "${ref_link}" thành công!`);
  }).catch((error) => {
    console.error(`Lỗi khi thêm node "${node_name}" vào "${ref_link}":`, error);
  });
}

const get_value = async (path) => {    //Lấy dữ liệu từ firebase lưu ý input đúng đường dẫn
  const Ref = ref(db, path);
  const snapshot = await get(Ref);

  return snapshot.val();
}

const set_value = async (path, newValue) => {
  const Ref = ref(db, path);
  const snapshot = await get(Ref);

  // Kiểm tra xem giá trị mới có khác với giá trị hiện tại không
  try {
    await set(Ref, newValue); // Sử dụng set để ghi đè giá trị của nút
    console.log("Giá trị đã được cập nhật thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật giá trị:", error);
  }
}

//Hàm Xác thực
export const authenticateUser_Student = async (username, password) => {
  console.log(username);
  console.log(password);
  const userRef = ref(db, `Students`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const studentsData = snapshot.val();

    // Duyệt qua từng sinh viên để kiểm tra username và password
    for (const studentId in studentsData) {
      const student = studentsData[studentId];
      if (student.user == username && student.password == password) {
        localStorage.setItem('userRole', student.role)
        localStorage.setItem('userID',   student.ID);

        const value = localStorage.getItem('userID');
        console.log(student.ID);
        location.href = '../Login/student.html';
        return null;
      }
    }

    console.log("Sai tên đăng nhập hoặc mật khẩu!");
  }
}

export const authenticateUser_Teacher = async (username, password) => {
  console.log(username);
  console.log(password);
  const userRef = ref(db, `Teachers`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const TeachersData = snapshot.val();

    // Duyệt qua từng sinh viên để kiểm tra username và password
    for (const TeachersId in TeachersData) {
      const Teachers = TeachersData[TeachersId];
      if (Teachers.user == username && Teachers.password == password) {
        localStorage.setItem('userRole', Teachers.role);
        localStorage.setItem('userID',   Teachers.ID);
        const value = localStorage.getItem('userID');
        console.log(value);
        location.href = '../Login/teacher.html';
        return null;
      }
    }

    console.log("Sai tên đăng nhập hoặc mật khẩu!");
  }
}


//Hàm check access
export function checkAccess_Teacher(link) {
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'teacher') {
      // Nếu là giảng viên, cho phép truy cập
      console.log('Cho phép truy cập');
  }
  else if(userRole === 'student') {
    window.location.href = link;
  }
  else {
      // Nếu chưa đăng nhập (null), chuyển hướng về trang chính
      window.location.href = '/';
  }
}
export function checkAccess_Student(link) {
  const userRole = localStorage.getItem('userRole');
  if(userRole === 'student') {
    console.log('Cho phép truy cập');
  }
  else if(userRole === 'teacher') {
    window.location.href = link;
  }
  else {
    // Nếu chưa đăng nhập (null), chuyển hướng về trang chính
    window.location.href = '/';
  }
}
export function checkAccess_fromOutside(Student_link, Teacher_link) {
  const userRole = localStorage.getItem('userRole');
  if(userRole === 'teacher') {
    window.location.href = Teacher_link;
  }
  else if(userRole === 'student') {
    window.location.href = Student_link;
  }
  else {
    console.log("Không tìm thấy tài khoản");
  }
}
//Hàm add khóa học vào giảng viên
export const Class_create = async (ma_mon_hoc, day, tiet_hoc) => {
  if(ma_mon_hoc == "") {
    alert("Nah");
    return null;
  }

  let result = await find_a_node('Courses', ma_mon_hoc);
  if(result) {
    const userID = localStorage.getItem('userID');
    result = await find_a_node(`Teachers/${userID}`, 'Classes');

    const Num_of_class_in_course  = await get_value(`Courses/${ma_mon_hoc}/Num`)+1;
    const Num_of_class_in_teacher = await get_value(`Teachers/${userID}/Num_of_class`)+1;
    const Class_Name = "L" + Num_of_class_in_course; 
    const Course_Class_Content = {
      "Day": day,
      "Time": tiet_hoc,
      "ID": Class_Name,
      "Teacher": `Teachers/${userID}`
    };
    const Class_content = {
      "Day": day,
      "Time": tiet_hoc,
      "Class": `Courses/${ma_mon_hoc}/${Class_Name}`,
      "ID": Class_Name
    }; 

    if(result) {
      console.log("Giảng viên đã đăng kí lớp học trước đó!")
      let Teacher_Classes = await get_value(`Teachers/${userID}/Classes`);
      for(const Classes_Data in Teacher_Classes) {
        const Class = Teacher_Classes[Classes_Data];
        if(Class.Day == day && Class.Time == tiet_hoc) {
          alert("Trùng lịch giảng dạy, vui lòng chọn lại!");
          return null;
        }
      }
      console.log("Không trùng lịch giảng dạy");
      await set_value(`Courses/${ma_mon_hoc}/Num`,       Num_of_class_in_course);
      await add_a_node(`Courses/${ma_mon_hoc}/Classes`,  Class_Name, Course_Class_Content);
      await add_a_node(`Teachers/${userID}/Classes`,     Class_Name, Class_content);
      alert("Cập nhật lớp học thành công!") 
      return null;
    }
    else {
      console.log("Giảng viên chưa đăng kí lớp học trước đó!");
      console.log(Class_content);

      await set_value(`Courses/${ma_mon_hoc}/Num`,       Num_of_class_in_course);
      await add_a_node(`Courses/${ma_mon_hoc}/Classes`,  Class_Name, Course_Class_Content);
      await add_a_node(`Teachers/${userID}/Classes`,     Class_Name, Class_content);
      alert("Cập nhật lớp học thành công!")
      return null;
    }
  }
  else {
    alert("Không tìm thấy khóa học");
  }
  return null;
}


//Hàm đăng kí khóa học của sinh viên

export const Chon_mon_hoc = async (select) => {
  let Course = await get_value(`Courses`)
  for(const i in Course) {
    const data = Course[i];
    const option = document.createElement('option');
    console.log(data.Course_ID);
    option.value = data.Course_ID;
    option.textContent = data.Course_Title;
    select.appendChild(option);
  }
}

export const Chon_lop_hoc = async (select, CourseID) => {
  console.log(select);
  console.log(CourseID);

  let Course = await get_value(`Courses/${CourseID}/Classes`);
  if(Course == null) {
    select.innerHTML = '';
    return;
  }

  for(const i in Course) {
    const data = Course[i];
    console.log(data);
    const option = document.createElement('option');
    option.value = data.ID;
    option.textContent = "Class " + data.ID + " |" + data.Day + " |From "+ (parseInt(data.Time) + 7) + "h to " + (parseInt(data.Time) + 7) + " h50";
    select.appendChild(option);
  }
}

export const Dang_ki_mon_hoc = async(CourseID, ClassID) => {
  const UserID = localStorage.getItem('userID');
  console.log(CourseID, ClassID, UserID);
  const Day  = await get_value(`Courses/${CourseID}/Classes/${ClassID}/Day`);
  const Time = await get_value(`Courses/${CourseID}/Classes/${ClassID}/Time`);
  
  let result =   await find_a_node(`Students/${UserID}`, `Classes`);

  if(result) {
    console.log("Sinh viên đã đăng kí khóa học nào đó!");
    let result = await find_a_node(`Students/${UserID}/Classes`, `${CourseID}`);
    if(result) {
      alert("Sinh viên đã đăng kí môn này!");
      return null;
    }
    else {
      console.log("Sinh viên chưa đăng kí môn này!");
      let Students_Class = await get_value(`Students/${UserID}/Classes`);
      console.log(`Students/${UserID}/Classes`);
      for(const i in Students_Class) {
        const data = Students_Class[i];
        if(data.Day == Day && data.Time == Time) {
          alert("Đăng kì trùng lịch vui lòng kiểm tra lại!");
          return null;
        }
      }

      const Student_Class = {
        "Day": Day,
        "Time": Time,
        "ID": ClassID,
        "CourseID": CourseID,
        "Midterm": -1,
        "Final": -1,
        "Assignment": -1
      };

      await add_a_node(`Students/${UserID}/Classes`, CourseID, Student_Class);
      await add_a_node(`Courses/${CourseID}/Classes/${ClassID}`,  'Students', {UserID});

      alert("Đăng kí khóa học thành công!");

      return null;
    }
  }
  else {
    console.log("Sinh viên chưa đăng kí khóa học nào!");
    const Student_Class = {
      "Day": Day,
      "Time": Time,
      "ID": ClassID,
      "CourseID": CourseID,
      "Midterm": -1,
      "Final": -1,
      "Assignment": -1
    };

    await add_a_node(`Students/${UserID}/Classes`, CourseID, Student_Class);
    await add_a_node(`Courses/${CourseID}/Classes/${ClassID}`,  'Students', {UserID});

    alert("Đăng kí khóa học thành công!");
  }
  return null;
}