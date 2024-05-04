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
  const Day = await get_value(`Courses/${CourseID}/Classes/${ClassID}/Day`);
  console.log(`Courses/${CourseID}/Classes/${ClassID}/Day`);

  const Time = await get_value(`Courses/${CourseID}/Classes/${ClassID}/Time`);
  
  let result =   await find_a_node(`Students/${UserID}`, `Classes`);

  if(result) {
    console.log("Sinh viên đã đăng kí khóa học nào đó!");
    let result = await find_a_node(`Students/${UserID}/Classes`, `${CourseID+"_"+ClassID}`);
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
          alert("Đăng kí trùng lịch vui lòng kiểm tra lại!");
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
        "Assignment": -1,
      };

      await add_a_node(`Students/${UserID}/Classes`, CourseID+"_"+ClassID, Student_Class);
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

    await add_a_node(`Students/${UserID}/Classes`, CourseID+"_"+ClassID, Student_Class);
    await add_a_node(`Courses/${CourseID}/Classes/${ClassID}`,  'Students', {UserID});

    alert("Đăng kí khóa học thành công!");
  }
  return null;
}

export const Hien_thi_lop_hoc = async() => {
  let STT = 0;
  const ID = localStorage.getItem('userID');
  
  let Class = await get_value(`Students/${ID}/Classes`);

  for(const i in Class) {
    const data = Class[i];
    // Chọn phần tử cha của bảng
    var tableParent = document.querySelector('.table');

    // Tạo một hàng mới
    var newRow = document.createElement('div');
    newRow.classList.add('header2', 'subject');

    const Subject_name = await get_value(`Courses/${data.CourseID}/Course_Title`);
    console.log(`Course/${data.CourseID}/Course_Title`);

    var time = parseInt(data.Time);
    var startTime = time + 7;

    // Tạo các ô dữ liệu
    newRow.innerHTML = `
        <div class="STT"><p>${STT}</p></div>
        <div class="class_name"><p>${data.ID}</p></div>
        <div class="Subject"><p>${Subject_name}</p></div>
        <div class="Time"><p>${"From "+startTime+"h to "+ startTime+ "h50"}</p></div>
        <div class="Weekend"><p>${data.Day}</p></div>
    `;

    // Chèn hàng mới vào bảng
    tableParent.appendChild(newRow);

    STT++;
  }
}