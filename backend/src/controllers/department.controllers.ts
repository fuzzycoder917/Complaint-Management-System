import { TryCatch } from "../middlewares/error.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { mssql, connect } from "../utils/features.js";

// CREATE DEPARTMENT
export const createDepartment = TryCatch(async (req, res, next) => {
    let { deptt_name, deptt_strength, deptt_hod } = req.body;

    if (!deptt_name || !deptt_hod || !deptt_strength || deptt_strength <= 0) {
        throw new ApiError(400, "All department fields are required and must be valid");
    }

    deptt_name = deptt_name.trim().toUpperCase();
    deptt_hod = deptt_hod.trim().toUpperCase();

    const pool = await connect();
    await pool.request()
        .input("deptt_name", mssql.VarChar, deptt_name)
        .input("deptt_hod", mssql.VarChar, deptt_hod)
        .input("deptt_strength", mssql.Int, deptt_strength)
        .query(`
            INSERT INTO Departments (deptt_name, deptt_strength, deptt_hod)
            VALUES (@deptt_name, @deptt_strength, @deptt_hod)
        `);

    res.json({ message: "Department created successfully" });
});

// GET ALL DEPARTMENTS
export const getDepartments = TryCatch(async (req, res, next) => {
    const pool = await connect();
    const result = await pool.request().query(`SELECT * FROM Departments`);
    res.json(result.recordset);
});

// GET SINGLE DEPARTMENT
export const getDepartment = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const pool = await connect();
    const result = await pool.request()
        .input("id", mssql.Int, id)
        .query(`SELECT * FROM Departments WHERE deptt_id = @id`);

    if (result.recordset.length === 0) {
        throw new ApiError(404, "Department not found");
    }

    res.json(result.recordset[0]);
});

// DELETE DEPARTMENT
export const deleteDepartment = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const pool = await connect();
    const result = await pool.request()
        .input("id", mssql.Int, id)
        .query(`DELETE FROM Departments WHERE deptt_id = @id`);

    if (result.rowsAffected[0] === 0) {
        throw new ApiError(404, "Department not found");
    }

    res.json({ message: "Department deleted successfully" });
});

// UPDATE DEPARTMENT
export const updateDepartment = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let { deptt_name, deptt_hod, deptt_strength } = req.body;

    if (
        deptt_name === undefined &&
        deptt_hod === undefined &&
        deptt_strength === undefined
    ) {
        throw new ApiError(400, "At least one department field is required to update");
    }

    if (deptt_strength !== undefined) {
        deptt_strength = Number(deptt_strength);
        if (!Number.isInteger(deptt_strength) || deptt_strength <= 0) {
            throw new ApiError(400, "deptt_strength must be a positive integer");
        }
    }

    if (typeof deptt_name === "string") deptt_name = deptt_name.trim().toUpperCase();
    if (typeof deptt_hod === "string") deptt_hod = deptt_hod.trim().toUpperCase();

    const pool = await connect();
    const request = pool.request();
    request.input("id", mssql.Int, Number(id));

    const setClauses: string[] = [];
    if (deptt_name !== undefined) {
        request.input("deptt_name", mssql.VarChar(100), deptt_name);
        setClauses.push("deptt_name = @deptt_name");
    }
    if (deptt_hod !== undefined) {
        request.input("deptt_hod", mssql.VarChar(100), deptt_hod);
        setClauses.push("deptt_hod = @deptt_hod");
    }
    if (deptt_strength !== undefined) {
        request.input("deptt_strength", mssql.Int, deptt_strength);
        setClauses.push("deptt_strength = @deptt_strength");
    }

    const query = `
        UPDATE Departments
        SET ${setClauses.join(", ")}
        WHERE deptt_id = @id
    `;

    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
        throw new ApiError(404, "Department not found");
    }

    res.json({ message: "Department updated successfully" });
});
