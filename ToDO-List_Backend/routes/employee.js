const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    getAllEmployees
} = require("../employee-handler");

const router = express.Router();


// Add Employee with File Upload
router.post("/",  async (req, res) => {
    try {
        const model = req.body;
        const employee = await addEmployee(model);
        res.status(201).json(employee);
    } catch (error) {
        console.error("Upload Error:", error); // Log the full error for debugging
        res.status(500).json({ message: "Error adding employee", error: error.message });
    }
});



router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const model = req.body;

    console.log("Incoming update request for ID:", id);
    console.log("Body data:", model);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Employee ID" });
    }

    const updatedEmployee = await updateEmployee(id, model);

    if (!updatedEmployee) {
      return res.status(404).send({ message: "Employee not found" });
    }

    res.status(200).send({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send({
      message: "Error updating employee",
      error: error.message,
    });
  }
});


// Delete employee
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await deleteEmployee(id);
        if (!deleted) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.send({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting employee", error: error.message });
    }
});

// Get single employee by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await getEmployee(id);
        if (!employee) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.send(employee);
    } catch (error) {
        res.status(500).send({ message: "Error fetching employee", error: error.message });
    }
});

// Get all employees
router.get("/", async (req, res) => {
    try {
        const employee = await getAllEmployees();
        res.send(employee); // [] if no employees exist
    } catch (error) {
        res.status(500).send({ message: "Error fetching employees", error: error.message });
    }
});

module.exports = router;