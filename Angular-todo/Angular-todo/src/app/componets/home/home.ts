import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../model/employee';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  employees: Employee[] = [];
  loading: boolean = false;
  error: string = '';
  
  // Form states
  showAddForm: boolean = false;
  showEditForm: boolean = false;
  editingEmployee: Employee | null = null;
  
  // Form data
  newEmployee: Employee = {
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: 0,
    address: ''
  };

  constructor(private employeeService: EmployeeService) { 
    console.log('Home component constructor called');
  }

  ngOnInit(): void {
    console.log('Home component ngOnInit called');
    this.fetchEmployees();
  }

  fetchEmployees() {
    console.log('fetchEmployees method called');
    this.loading = true;
    this.error = '';
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        console.log('Employee data received:', data);
        this.employees = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.error = 'Failed to load employees. Please try again.';
        this.loading = false;
      }
    });
  }

  // Add Employee
  showAddEmployeeForm() {
    this.showAddForm = true;
    this.showEditForm = false;
    this.resetForm();
  }

  addEmployee() {
    if (this.validateForm(this.newEmployee)) {
      this.loading = true;
      console.log('Sending create request for employee:', this.newEmployee);
      
      this.employeeService.createEmployee(this.newEmployee).subscribe({
        next: (response) => {
          console.log('Employee added successfully:', response);
          console.log('Response type:', typeof response);
          console.log('Response keys:', response ? Object.keys(response) : 'No response');
          
          // Handle the response and add to local array
          const newEmployee = this.handleApiResponse(response, this.newEmployee);
          console.log('Adding new employee to array:', newEmployee);
          this.employees.push(newEmployee);
          // Force change detection by creating a new array reference
          this.employees = [...this.employees];
          this.showAddForm = false;
          this.resetForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          this.error = 'Failed to add employee. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  // Edit Employee
  showEditEmployeeForm(employee: Employee) {
    this.editingEmployee = { ...employee };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  updateEmployee() {
    if (this.editingEmployee && this.validateForm(this.editingEmployee)) {
      this.loading = true;
      console.log('Sending update request for employee:', this.editingEmployee);
      
      this.employeeService.updateEmployee(this.editingEmployee._id!, this.editingEmployee).subscribe({
        next: (response) => {
          console.log('Employee updated successfully:', response);
          console.log('Response type:', typeof response);
          console.log('Response keys:', response ? Object.keys(response) : 'No response');
          
          // Handle the response and update local array
          const updatedEmployee = this.handleApiResponse(response, this.editingEmployee!);
          console.log('Updated employee data:', updatedEmployee);
          
          // Update the employee in the local array
          const index = this.employees.findIndex(emp => emp._id === this.editingEmployee!._id);
          if (index !== -1) {
            console.log('Updating employee at index:', index, 'with data:', updatedEmployee);
            this.employees[index] = updatedEmployee;
            // Force change detection by creating a new array reference
            this.employees = [...this.employees];
          } else {
            console.warn('Employee not found in local array for update');
          }
          this.showEditForm = false;
          this.editingEmployee = null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.error = 'Failed to update employee. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  // Delete Employee
  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.loading = true;
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          console.log('Employee deleted successfully');
          this.employees = this.employees.filter(emp => emp._id !== id);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.error = 'Failed to delete employee. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  // Utility methods
  cancelForm() {
    this.showAddForm = false;
    this.showEditForm = false;
    this.editingEmployee = null;
    this.resetForm();
  }

  resetForm() {
    this.newEmployee = {
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      salary: 0,
      address: ''
    };
  }

  // Helper method to handle different response formats
  private handleApiResponse(response: any, fallbackData: any): any {
    console.log('Handling API response:', response);
    
    // If response is null/undefined, use fallback
    if (!response) {
      console.log('No response received, using fallback data');
      return fallbackData;
    }
    
    // If response has a 'data' property (common API pattern)
    if (response.data) {
      console.log('Response has data property:', response.data);
      return response.data;
    }
    
    // If response is an array, take the first item (for single item responses)
    if (Array.isArray(response) && response.length > 0) {
      console.log('Response is array, taking first item:', response[0]);
      return response[0];
    }
    
    // If response has the expected employee structure
    if (response._id || response.name || response.email) {
      console.log('Response appears to be employee data');
      return response;
    }
    
    // Fallback to original data
    console.log('Using fallback data due to unexpected response format');
    return fallbackData;
  }

  validateForm(employee: Employee): boolean {
    if (!employee.name || !employee.email || !employee.phone) {
      this.error = 'Name, email, and phone are required fields.';
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      this.error = 'Please enter a valid email address.';
      return false;
    }
    
    this.error = '';
    return true;
  }

  clearError() {
    this.error = '';
  }
}
