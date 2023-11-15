const inquirer = require('inquirer'); //inquirer dependancy
const mysql = require('mysql2'); //using mysql
require('dotenv').config(); //dotenv for password security to github.

console.log("==================================");
console.log("=== Employee Management System ===");
console.log("==================================");


const connection = mysql.createConnection({ //Creat connection to my database.
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD, //I am using dotenv, learned from this week so I dont expose my password at all.
    database: 'manager_db'

  });


  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    init();
    
  });


function init() { //On console start we run this function, and ask the question of what we want to do.
    inquirer 
    .prompt([ 
          {
            type: 'list', //here we use a checkbox as we want to select specific licenses without the user having to recall them.
            message: "What would you like to do?",
            name: 'dataGrab',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'] //we selected 5 of the more commonly used licenses, could add more options if we need to however there was not much direction on this.
          }
    ])
    .then((response) => grabData(response) 
  );
}


function grabData(response) { //once we grab the response of what we want to do we use a switch case to see what data we will show the user.
   const query =  response.dataGrab; //putting response data into a variable.


   switch (query) {  //View all employees
    case "View All Employees":
        viewAllEmployees(); //seperate function
      
      break;

    case "Add Employee":
        addEmployee(); //Seperate functiuon to handle.
      
      break;
    
      case "Update Employee Role":
        updateEmployee();
     
      break;
    
      case "View All Roles":
        viewAllRoles(); //sep function
     
      break;

      case "Add Role": //Should be similar to add employee
      addRole();
      
      break;

      case "View All Departments":
        viewAllDepartments();
    
      break;

      case "Add Department": //should be the same as add employee
        addDepartment();
        break;
    
    
  }
 

};

function viewAllEmployees() { 
    connection.query('SELECT * FROM employees', (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
      
     
    });
  }

  function viewAllRoles() { //grabs data from roles and shows us it.
    connection.query('SELECT * FROM roles', (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
     
    });
  }

  function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
     
    });
  }

  function addEmployee() { //We handle Employee add here, with user input.
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Enter the first name of the employee:',
          name: 'firstName'
        },
        {
          type: 'input',
          message: 'Enter the last name of the employee:',
          name: 'lastName'
        },
        {
          type: 'input',
          message: 'Enter the role ID of the employee:',
          name: 'roleId'
        },
        {
          type: 'input',
          message: 'Enter the manager ID of the employee (if applicable):',
          name: 'managerId'
        }
      ])
      .then((answers) => {
        const { firstName, lastName, roleId, managerId } = answers;
  
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        const values = [firstName, lastName, roleId, managerId];
  
        connection.query(query, values, (err, result) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          init();
        });
      });
  }

  function addRole() { //Handle the adding of roles.
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Enter Title Of the Role',
          name: 'title'
        },
        {
          type: 'input',
          message: 'Which Department Does this Role Belong to?',
          name: 'department'
        },
        {
          type: 'input',
          message: 'Enter the Salary of this Role',
          name: 'salary'
        },
      ])
      .then((answers) => {
        const { title, department, salary } = answers;
  
        const query = 'INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)';
        const values = [title, department, salary];
  
        connection.query(query, values, (err, result) => {
          if (err) throw err;
          console.log('Role added successfully!');
          init();
        });
      });
  }

  function addDepartment() { //Handle Department addition.
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Enter the name of the New Department',
          name: 'departmentName'
        }
      ])
      .then((answers) => {
        const { departmentName } = answers;
  
        const query = 'INSERT INTO department (name) VALUES (?)';
        const values = [departmentName];
  
        connection.query(query, values, (err, result) => {
          if (err) throw err;
          console.log('Department added successfully!');
          init();
        });
      });
  }


  function updateEmployee() {
    connection.query('SELECT * FROM employees', (err, results) => {
      if (err) throw err;
      console.table(results);
  
      
      const employeeNames = results.map((employee) => `${employee.first_name} ${employee.last_name}`); //map employee names into a vaariable.
  
      // Prompt the user to choose an employee to update
      inquirer
        .prompt([
          {
            type: 'list',
            message: 'Choose an employee to update:',
            name: 'selectedEmployee',
            choices: employeeNames,
          },
          {
            type: 'input',
            message: 'Enter the updated first name:',
            name: 'updatedFirstName',
          },
          {
            type: 'input',
            message: 'Enter the updated last name:',
            name: 'updatedLastName',
          },
          {
            type: 'input',
            message: 'Enter the updated role:',
            name: 'updatedRole',
          },
          {
            type: 'input',
            message: 'Enter the updated manager:',
            name: 'updatedManager',
          },
        ])
        .then((response) => {
          // Handle the selected employee and updated values
          const selectedEmployee = response.selectedEmployee;
          const updatedFirstName = response.updatedFirstName;
          const updatedLastName = response.updatedLastName;
          const updatedRole = response.updatedRole;
          const updatedManager = response.updatedManager;
  
          console.log(`Updating employee: ${selectedEmployee}`);
          console.log(`Updated first name: ${updatedFirstName}`);
          console.log(`Updated last name: ${updatedLastName}`);
          console.log(`Updated role: ${updatedRole}`);
          console.log(`Updated manager: ${updatedManager}`);
  
          // Split the selected employee name into first name and last name
          const [firstName, lastName] = selectedEmployee.split(' ');
  
          // Perform the update operation in the database
          connection.query(
            'UPDATE employees SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE first_name = ? AND last_name = ?',
            [updatedFirstName, updatedLastName, updatedRole, updatedManager, firstName, lastName],
            (err, result) => {
              if (err) throw err;
              console.log('Employee updated successfully!');
              init();
            }
          );
        });
    });
  }