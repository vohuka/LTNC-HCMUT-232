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




//Function

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
        "Class": `Courses/${ma_mon_hoc}`,
        "ID": Class_Name
      }; 

      console.log("DEBUGGGGG" + Class_content);
  
      if(result) {
        console.log("Giảng viên đã đăng kí lớp học trước đó!")
        let Teacher_Classes = await get_value(`Teachers/${userID}/Classes`);
        for(const Classes_Data in Teacher_Classes) {
          const Class = Teacher_Classes[Classes_Data];
          if(Class.Day == day && Class.Time == tiet_hoc) {
            alert("Trùng lịch giảng dạy, vui lòng chọn lại!");
            location.reload();
            return null;
          }
        }
        console.log("Không trùng lịch giảng dạy");
        await set_value(`Courses/${ma_mon_hoc}/Num`,       Num_of_class_in_course);
        await add_a_node(`Courses/${ma_mon_hoc}/Classes`,  Class_Name, Course_Class_Content);
        await add_a_node(`Teachers/${userID}/Classes`,     ma_mon_hoc+"_"+Class_Name, Class_content);
        alert("Cập nhật lớp học thành công!") 
        location.reload();
        return null;
      }
      else {
        console.log("Giảng viên chưa đăng kí lớp học trước đó!");
        console.log(Class_content);
  
        await set_value(`Courses/${ma_mon_hoc}/Num`,       Num_of_class_in_course);
        await add_a_node(`Courses/${ma_mon_hoc}/Classes`,  Class_Name, Course_Class_Content);
        await add_a_node(`Teachers/${userID}/Classes`,     ma_mon_hoc+"_"+Class_Name, Class_content);
        alert("Cập nhật lớp học thành công!")
        location.reload();
        return null;
      }
    }
    else {
      alert("Không tìm thấy khóa học");
    }
    return null;
  }

  export const Hien_thi_lop_hoc = async() => {
    let STT = 0;
    const ID = localStorage.getItem('userID');
    
    let Class = await get_value(`Teachers/${ID}/Classes`);

  
    for(const i in Class) {
      const data = Class[i];
      // Chọn phần tử cha của bảng
      var tableParent = document.querySelector('.table');
  
      // Tạo một hàng mới
      var newRow = document.createElement('div');
      newRow.classList.add('header2', 'subject');
  
      const Subject_name = await get_value(`${data.Class}/Course_Title`);
  
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
