export const student = {
    name: "Arsalan Ahmed",
    email: "arsalan@neominds.com",
    id: "ST-2026-001",
    avatar: null,
    major: "Artificial Intelligence & Machine Learning",
    attendance: "94.2%",
    points: 1250,
    level: 14
};

export const batches = [
    {
        id: 'b1',
        name: "Mastering Neural Networks",
        course: "AIML",
        teacher: "Dr. Irfan Malik",
        timing: "Mon - Wed, 10:00 AM",
        performance: "92%",
        completion: "65%",
        nextClass: "Tomorrow, 10:00 AM"
    },
    {
        id: 'b2',
        name: "Full Stack Development - Batch C",
        course: "Web Development",
        teacher: "Sara Khan",
        timing: "Tue - Thu, 02:00 PM",
        performance: "88%",
        completion: "40%",
        nextClass: "Thursday, 02:00 PM"
    }
];

export const mockNotes = [
    { id: 1, title: "Backpropagation Deep Dive", teacher: "Dr. Irfan", date: "Feb 14, 2026", batchId: "b1", fileSize: "2.4 MB" },
    { id: 2, title: "React State Management Patterns", teacher: "Sara Khan", date: "Feb 12, 2026", batchId: "b2", fileSize: "1.8 MB" },
    { id: 3, title: "Optimization Algorithms", teacher: "Dr. Irfan", date: "Feb 10, 2026", batchId: "b1", fileSize: "3.1 MB" }
];

export const mockAssignments = [
    { id: 1, title: "Cost Function Implementation", batchId: "b1", dueDate: "Feb 20, 2026", status: "Pending", difficulty: "Medium" },
    { id: 2, title: "API Route Integration", batchId: "b2", dueDate: "Feb 18, 2026", status: "Submitted", difficulty: "Hard" },
    { id: 3, title: "Neural Layer Visualization", batchId: "b1", dueDate: "Feb 25, 2026", status: "Pending", difficulty: "Medium" }
];

export const jobs = [
    { id: 1, role: "AI Engineer", company: "MetaGraph", location: "Remote", type: "Full-time", salary: "$120k - $150k", tags: ["Python", "PyTorch"] },
    { id: 2, role: "Full Stack Developer", company: "NexusTech", location: "Bangalore", type: "Hybrid", salary: "₹12L - ₹18L", tags: ["React", "Node.js"] },
    { id: 3, role: "Data Scientist", company: "DataFlow", location: "Dubai", type: "On-site", salary: "AED 15k - 20k", tags: ["SQL", "Pandas"] },
    { id: 4, role: "Frontend Intern", company: "VeloCode", location: "Remote", type: "Internship", salary: "$2k/mo", tags: ["Tailwind", "JS"] }
];

export const notifications = [
    { id: 1, text: "Dr. Irfan uploaded new session notes for Neural Networks.", time: "2h ago", type: "note" },
    { id: 2, text: "Assignment deadline approaching: Cost Function Implementation.", time: "5h ago", type: "deadline" },
    { id: 3, text: "Your attendance for yesterday's session has been marked.", time: "1d ago", type: "attendance" }
];
