import express from "express";
import { connect } from "./utils/features.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;


connect().then((connection) => {
    console.log("Connected to the database");
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});
import issueRoutes from "./routes/issue.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
app.use("/api/issues", issueRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/complaints", complaintRoutes);

app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
