/* ============================================================
   Prime Vector LMS — reports.js
   ============================================================ */

const mockData = {
    attendance: `<tr><td>ACDX-001</td><td>Jane Doe</td><td>Full Stack</td><td>2024-10-15</td><td>09:00 AM</td><td>10:00 AM</td><td>60 mins</td><td>100%</td><td><span class="badge badge-success">Present</span></td></tr>
                 <tr><td>ACDX-002</td><td>John Smith</td><td>Data Science</td><td>2024-10-15</td><td>09:15 AM</td><td>10:00 AM</td><td>45 mins</td><td>75%</td><td><span class="badge badge-warning">Late</span></td></tr>
                 <tr><td>ACDX-003</td><td>Alice Brown</td><td>Full Stack</td><td>2024-10-15</td><td>09:30 AM</td><td>10:00 AM</td><td>30 mins</td><td>50%</td><td><span class="badge badge-danger">Absent</span></td></tr>`,
    
    progress: `<tr><td>ACDX-001</td><td>Jane Doe</td><td>Full Stack</td><td>4/5</td><td>12/15</td><td>92%</td><td>In Progress</td><td>95%</td><td>45 hrs</td></tr>
               <tr><td>ACDX-002</td><td>John Smith</td><td>Data Science</td><td>2/5</td><td>5/15</td><td>78%</td><td>Not Started</td><td>40%</td><td>20 hrs</td></tr>`,
               
    daily: `<tr><td>09:00 AM</td><td>05:00 PM</td><td>Full Stack (Live)</td><td>3</td><td>Yes</td><td>1</td><td>No</td><td>6 hrs</td></tr>
            <tr><td>10:00 AM</td><td>04:00 PM</td><td>Data Science (Live)</td><td>1</td><td>No</td><td>0</td><td>Yes</td><td>4 hrs</td></tr>`,
            
    faculty: `<tr><td>35</td><td>2</td><td>94%</td><td>88%</td><td>Excellent</td><td>5</td></tr>
              <tr><td>28</td><td>5</td><td>85%</td><td>70%</td><td>Good</td><td>12</td></tr>`,
              
    admin: `<tr><td>1250</td><td>1100</td><td>91%</td><td>45%</td><td>30%</td><td>25%</td><td>85%</td><td>340</td></tr>`
};

const mockHeaders = {
    attendance: `<tr><th>Student ID</th><th>Student Name</th><th>Course</th><th>Date</th><th>Join Time</th><th>Exit Time</th><th>Duration</th><th>Attendance %</th><th>Status</th></tr>`,
    progress: `<tr><th>Student ID</th><th>Student Name</th><th>Course</th><th>Modules Completed</th><th>Assignments</th><th>Quiz Score</th><th>Internship/Project</th><th>Overall %</th><th>Learning Hours</th></tr>`,
    daily: `<tr><th>Login Time</th><th>Logout Time</th><th>Live Classes</th><th>Videos Watched</th><th>Notes Uploaded</th><th>Assignments</th><th>Quiz Attempted</th><th>Total Time</th></tr>`,
    faculty: `<tr><th>Students Present</th><th>Students Absent</th><th>Attendance %</th><th>Assignment Completion</th><th>Performance</th><th>Pending Tasks</th></tr>`,
    admin: `<tr><th>Total Students</th><th>Active Students</th><th>Attendance %</th><th>Course Completion</th><th>Internship/Project</th><th>Placement Readiness</th><th>Certificates Earned</th><th>Total Count</th></tr>`
};

function updateReportView() {
    const reportType = document.getElementById('reportTypeSelect').value;
    const tableHead = document.getElementById('reportTableHead');
    const tableBody = document.getElementById('reportTableBody');
    
    if (tableHead && tableBody && mockHeaders[reportType] && mockData[reportType]) {
        tableHead.innerHTML = mockHeaders[reportType];
        tableBody.innerHTML = mockData[reportType];
    }
}

function exportToExcel() {
    const reportType = document.getElementById('reportTypeSelect');
    const reportName = reportType ? reportType.options[reportType.selectedIndex].text : 'Report';
    
    // Export table using the real CSV utility
    Export.toCSV('reportTable', `${reportName.replace(/\s+/g, '_')}.csv`);
}
