function getCourseInfo(stuID) {
    var CourseInfoArray;
    get(ref(db, "Students/" + stuID + "/Classes/").then((snapshot) => {
        if(snapshot.exists())
        {
            let courses = snapshot.val();

            for(let ID in courses){
                CourseInfoArray.push(courses[ID].CourseID);
            }

            //Tạm thời trả về array chưa tất cả các môn học đang tham gia, tùy theo yêu cầu Frontend sẽ chỉnh lại
            return CourseInfoArray
        }
        else {
            //Tạm thời trả về array rỗng, tùy theo yêu cầu Frontend sẽ chỉnh lại
            return CourseInfoArray;
        }
    }));
}